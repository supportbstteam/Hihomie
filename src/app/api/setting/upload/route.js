import * as XLSX from "xlsx";
import dbConnect from '@/lib/db';
import Status from "@/models/LeadStatus";
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

    for (const row of data) {
      const { status_name, ...cardData } = row;

      let status = await Status.findOne({ status_name });
      if (!status) {
        status = await Status.create({
          status_name,
          cards: [cardData],
        });
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

