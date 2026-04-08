import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import dbConnect from "@/lib/db";
import EstateLead from "@/models/EstateLead";
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
  registration_date: optString(),
  name: requiredString("Name"),
  phone: optString(),
  address: optString(),
  city: optString(),
  rent_or_sale: optString(),
  capturer: optString(),
  assigned_agent: optString(),
  source_channel: optString(),
  last_contact: Joi.any().optional(),
  next_call: Joi.any().optional(),
  lead_status: optString(),
  follow_up_overdue: Joi.boolean().optional(),
  sale_price: Joi.any().optional(),
  fees: Joi.any().optional(),
  last_contact_result: optString(),
  observations: optString(),
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

    const maxCard = await EstateLead.aggregate([
      {
        $group: {
          _id: null, // This groups all documents in the collection into a single result
          maxNumber: { $max: { $toInt: "$lead_id" } }
        }
      }
    ]);

    let nextLeadNumber = maxCard.length > 0 ? maxCard[0].maxNumber + 1 : 1;


    // 🔥 PROCESS EACH ROW
    for (let i = 0; i < data.length; i++) {
      const rawRow = data[i];
      const rowNum = i + 2;

      // 🔥 MAP SPANISH EXCEL HEADERS TO INTERNAL FIELDS
      const mappedRow = {
        registration_date: rawRow["Fecha alta"] ? String(rawRow["Fecha alta"]) : "",
        name: rawRow["Nombre"] ? String(rawRow["Nombre"]) : "",
        phone: rawRow["Teléfono"] ? String(rawRow["Teléfono"]) : "",
        address: rawRow["Dirección"] ? String(rawRow["Dirección"]) : "",
        city: rawRow["Poblacion"] ? String(rawRow["Poblacion"]) : "",
        rent_or_sale: rawRow["alquiler o venta"] ? String(rawRow["alquiler o venta"]) == "alquiler" ? "Rent" : "Sale" : "",
        capturer: rawRow["Captador"] ? String(rawRow["Captador"]) : "",
        assigned_agent: rawRow["Comercial (asignado)"] ? String(rawRow["Comercial (asignado)"]) : "",
        source_channel: rawRow["Fuente/Canal"] ? String(rawRow["Fuente/Canal"]) : "",
        last_contact: rawRow["Último contacto"] || null,
        next_call: rawRow["Siguiente llamada"] || null,
        lead_status: rawRow["Estado lead"] ? String(rawRow["Estado lead"]) : "",
        follow_up_overdue: rawRow["Seguimiento vencido"] ? String(rawRow["Seguimiento vencido"]) == "VENCIDO" ? false : true : false,
        sale_price: rawRow["Precio de venta"] || null,
        fees: rawRow["Honorarios"] || null,
        last_contact_result: rawRow["Resultado último contacto"] ? String(rawRow["Resultado último contacto"]) : "",
        observations: rawRow["Observaciones"] ? String(rawRow["Observaciones"]) : "",
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

      // 🔥 UNIQUE LEAD TITLE FOR EACH ROW (Auto-Increment)
      validRow.lead_id = nextLeadNumber.toString();
      nextLeadNumber++;

      try {
        await EstateLead.create(validRow);

        validSaves.push({
          row: rowNum,
          message: `Row ${rowNum} added successfully`,
        });
      } catch (dbError) {
        // If Mongoose throws an error, catch it here so the loop doesn't break!
        errorData.push({
          row: rowNum,
          errors: [`Database Error: ${dbError.message}`],
        });
      }
    }

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