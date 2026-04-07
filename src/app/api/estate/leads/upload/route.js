import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import dbConnect from "@/lib/db";
import Status from "@/models/LeadStatus";
import EstateLead from "@/models/EstateLead"; // Kept if you need it later
import getUserFromServerSession from "@/lib/getUserFromServerSession";
const Joi = require("joi");

// helper for optional non-empty string
const optString = () => Joi.string().trim().allow("", null);
const requiredString = (field) =>
  Joi.string().trim().required().messages({
    "any.required": `${field} is required`,
    "string.empty": `${field} cannot be empty`,
  });

// ROW SCHEMA (Updated for the new Excel format)
const rowSchema = Joi.object({
  first_name: requiredString("first_name"),
  phone: optString(),
  street: optString(),
  city: optString(),
  operation: optString(),
  captador: optString(),
  comercial: optString(),
  source: optString(),
  last_connected: Joi.any().optional(),
  next_call: Joi.any().optional(),
  status_name: optString(),
  price_property: Joi.any().optional(),
  fees: Joi.any().optional(),
  contact_result: optString(),
  notes: optString(),
  excel_lead_id: optString(),
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
    
    // 🔥 Adding `defval: ""` prevents the JSON from dropping empty cells
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

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
      const rawRow = data[i];
      const rowNum = i + 2;

      // 🔥 MAP SPANISH EXCEL HEADERS TO INTERNAL FIELDS
      const mappedRow = {
        first_name: rawRow["Nombre"] ? String(rawRow["Nombre"]) : "",
        phone: rawRow["Teléfono"] ? String(rawRow["Teléfono"]) : "",
        street: rawRow["Dirección"] ? String(rawRow["Dirección"]) : "",
        city: rawRow["Poblacion"] ? String(rawRow["Poblacion"]) : "",
        operation: rawRow["alquiler o venta"] ? String(rawRow["alquiler o venta"]) : "",
        captador: rawRow["Captador"] ? String(rawRow["Captador"]) : "",
        comercial: rawRow["Comercial (asignado)"] ? String(rawRow["Comercial (asignado)"]) : "",
        source: rawRow["Fuente/Canal"] ? String(rawRow["Fuente/Canal"]) : "",
        last_connected: rawRow["Último contacto"] || null,
        next_call: rawRow["Siguiente llamada"] || null,
        status_name: rawRow["Estado lead"] ? String(rawRow["Estado lead"]) : "",
        price_property: rawRow["Precio de venta"] || null,
        fees: rawRow["Honorarios"] || null,
        contact_result: rawRow["Resultado último contacto"] ? String(rawRow["Resultado último contacto"]) : "",
        notes: rawRow["Observaciones"] ? String(rawRow["Observaciones"]) : "",
        excel_lead_id: rawRow["ID lead"] ? String(rawRow["ID lead"]) : "",
      };

      const { error, value: validRow } = rowSchema.validate(mappedRow, {
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

      // Destructure fields to organize details
      const {
        status_name,
        source,
        last_connected,
        next_call,
        notes,
        street,
        city,
        excel_lead_id,
        captador,
        comercial,
        operation,
        price_property,
        fees,
        contact_result,
        ...cardData
      } = validRow;

      // 🔥 ADD DETAILS (Organized logically)
      cardData.detailsData = {
        source,
        last_connected,
        next_call,
        notes,
        operation,
        captador,
        comercial,
        price_property,
        fees,
        contact_result,
        status_name // Saving the original text status from Excel just in case
      };

      cardData.addressDetailsData = {
        street,
        city,
      };

      cardData.assigned = assigned;
      cardData.status = status._id;
      
      // Kept just in case you ever want to reference the original ID from the Excel sheet
      cardData.excel_lead_id = excel_lead_id;

      // 🔥 UNIQUE LEAD TITLE FOR EACH ROW (Auto-Increment)
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