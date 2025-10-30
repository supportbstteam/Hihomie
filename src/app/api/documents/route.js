import { writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import Document from "@/models/Document";
import dbConnect from "@/lib/db";

export async function POST(request) {
    const data = await request.formData();
    const file = data.get("document");
    const colId = data.get("colId");
    const cardId = data.get("cardId");
    const userId = data.get("userId");

    if (!file) {
        return NextResponse.json({ success: false, error: "No file provided." });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), "public/uploads/documents", filename);

    try {
        await writeFile(path, buffer);

        await dbConnect();
        const newDocument = new Document({
            document_name: filename,
            document_path: `/uploads/documents/${filename}`,
            colId,
            cardId,
            userId,
        });
        await newDocument.save();

        return NextResponse.json({
            success: true,
            path: `/uploads/documents/${filename}`
        });
    } catch (error) {
        console.error("Error saving file:", error);
        return NextResponse.json({ success: false, error: "Failed to save file." });
    }
}