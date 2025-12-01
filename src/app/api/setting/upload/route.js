import * as XLSX from "xlsx";
import dbConnect from '@/lib/db';
import Status from "@/uploads/models/LeadStatus";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  await dbConnect();

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

    for (const row of data) {
      const { status_name, notes, source, category, tag, last_connected, company_name, street, city, state, zip_code, country, website, ...cardData } = row;

      const detailsData = {
        source: source,
        category: category,
        tag: tag,
        last_connected: last_connected,
        notes: notes,
      };
      const addressDetailsData = {
        company_name: company_name,
        street: street,
        city: city,
        state: state,
        zip_code: zip_code,
        country: country,
        website: website,
      };

      cardData.detailsData = detailsData;
      cardData.addressDetailsData = addressDetailsData;
      cardData.assigned = "";

      let status = await Status.findOne({ status_name });
      if (!status) {
        errorData.push({
          status_name,
          error: "Status not found",
          card: cardData,
        });
        continue;
      } else {
        status.cards.push(cardData);
        await status.save();
      }
    }

    // Return all updated statuses with cards
    const allStatuses = await Status.find();

    return NextResponse.json(
      { message: "Data Uploaded", cards: allStatuses },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
};

