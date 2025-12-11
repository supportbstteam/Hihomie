import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import dbConnect from '@/lib/db';
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


// row schema
const rowSchema = Joi.object({
  status_name: Joi.string().trim().required().messages({
    "any.required": "status_name is required",
    "string.empty": "status_name cannot be empty",
  }),
  lead_title: requiredString("lead_title"),
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

  // allow other properties (cardData props) — validate if needed
}).unknown(true); // keep unknown true so cardData fields pass through

export const POST = async (req) => {
  await dbConnect();
  let assigned = "";
  const user = await getUserFromServerSession();
  if (user.role !== "admin") {
    assigned = user.id;
  } else {
    assigned = "";
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const errorData = [];
    const validSaves = [];

    // assuming 'data' is array and you want row numbers:
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // if Excel header on row 1, row 2 is first data row

      // 1) Validate row schema
      const { error, value: validRow } = rowSchema.validate(row, {
        abortEarly: false,
        convert: true, // allow coercion (e.g., dates)
      });

      if (error) {
        errorData.push({
          row: rowNum,
          errors: error.details.map(d => d.message),
        });
        continue;
      }

      // destructure validated fields (use validRow to avoid original raw values)
      const { status_name, notes, source, category, tag, last_connected, company_name, street, city, state, zip_code, country, website, ...cardData } = validRow;

      // 2) lookup status (do this after validation)
      const status = await Status.findOne({ status_name }).exec();

      if (!status) {
        errorData.push({
          row: rowNum,
          error: `Status "${status_name}" not found`,
          card: { ...cardData, status_name }
        });
        continue;
      }

      // 3) Compose details and address objects
      const detailsData = { source, category, tag, last_connected, notes };
      const addressDetailsData = {
        company_name, street, city, state, zip_code, country, website
      };

      cardData.detailsData = detailsData;
      cardData.addressDetailsData = addressDetailsData;
      cardData.assigned = assigned;
      cardData.status = status._id;

      // status.cards.push(cardData);
      // await status.save();

      validSaves.push({ row: rowNum, message: `Row ${rowNum} added successfully` });
    }

    // Return all updated statuses with cards
    // const allStatuses = await Status.find();

    const results = [...validSaves, ...errorData];

    return NextResponse.json(
      { message: "Data Uploaded", results: results },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
};

