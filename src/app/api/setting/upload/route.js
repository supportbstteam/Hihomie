import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import dbConnect from "@/lib/db";
import Status from "@/models/LeadStatus";
import getUserFromServerSession from "@/lib/getUserFromServerSession";
const Joi = require("joi");

// helper for optional non-empty string
const optString = () => Joi.string().trim().allow("", null);
const requiredString = (field) =>
  Joi.string().trim().required().messages({
    "any.required": `${field} is required`,
    "string.empty": `${field} cannot be empty`,
  });

// ROW SCHEMA
const rowSchema = Joi.object({
  status_name: Joi.string().trim().required().messages({
    "any.required": "status_name is required",
    "string.empty": "status_name cannot be empty",
  }),
  surname: requiredString("surname"),
  first_name: requiredString("first_name"),
  last_name: requiredString("last_name"),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
    "any.required": "email is required",
    "string.empty": "email cannot be empty",
    "string.email": "email must be a valid email address",
  }),
  customer_situation: requiredString("customer_situation"),
  purchase_status: requiredString("purchase_status"),
  contacted: requiredString("contacted"),
  notes: optString(),
  source: optString(),
  category: optString(),
  tag: optString(),
  last_connected: Joi.date().iso().allow("", null).messages({
    "date.format": "last_connected must be ISO date",
  }),
  company_name: optString(),
  street: optString(),
  city: optString(),
  state: optString(),
  zip_code: Joi.string().trim().allow("", null).pattern(/^[0-9A-Za-z\- ]{0,20}$/).messages({
    "string.pattern.base": "zip_code contains invalid characters",
  }),
  country: optString(),
}).unknown(true);


export const POST = async (req) => {
  await dbConnect();
  let assigned = "";
  const user = await getUserFromServerSession();

  if (user.role !== "admin") {
    assigned = user.id;
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const errorData = [];
    const validSaves = [];

    // 🔥 FETCH STATUS ONLY ONCE
    let lead_status_id = "68c297a3212f4d647f1c1087";
    const status = await Status.findById(lead_status_id).exec();

    if (!status) {
      return NextResponse.json({ error: "Invalid status ID" }, { status: 400 });
    }

    // 🔥 CALCULATE MAX NUMBER ONLY ONE TIME (OUTSIDE LOOP)
    const maxCard = await Status.aggregate([
      { $unwind: "$cards" },
      {
        $group: {
          _id: null,
          maxNumber: { $max: { $toInt: "$cards.lead_title" } },
        },
      },
    ]);

    let nextLeadNumber = maxCard.length > 0 ? maxCard[0].maxNumber + 1 : 1;

    // 🔥 PROCESS EACH ROW
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2;

      const { error, value: validRow } = rowSchema.validate(row, {
        abortEarly: false,
        convert: true,
      });

      if (error) {
        errorData.push({
          row: rowNum,
          errors: error.details.map((d) => d.message),
        });
        continue;
      }

      const {
        status_name,
        notes,
        source,
        category,
        tag,
        last_connected,
        company_name,
        street,
        city,
        state,
        zip_code,
        country,
        website,
        ...cardData
      } = validRow;

      // 🔥 ADD DETAILS
      cardData.detailsData = { source, category, tag, last_connected, notes };
      cardData.addressDetailsData = {
        company_name,
        street,
        city,
        state,
        zip_code,
        country,
        website,
      };
      cardData.assigned = assigned;
      cardData.status = status._id;

      // 🔥 UNIQUE LEAD TITLE FOR EACH ROW
      cardData.lead_title = nextLeadNumber.toString();
      nextLeadNumber++;

      // 🔥 PUSH INTO CARDS ARRAY
      status.cards.push(cardData);

      validSaves.push({
        row: rowNum,
        message: `Row ${rowNum} added successfully`,
      });
    }

    // 🔥 SAVE ONLY ONCE (SUPER FAST)
    await status.save();

    const results = [...validSaves, ...errorData];

    return NextResponse.json(
      { message: "Data Uploaded", results },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process file", details: error.message },
      { status: 500 }
    );
  }
};