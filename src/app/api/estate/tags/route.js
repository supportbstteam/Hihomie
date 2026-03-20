import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tag from "@/models/Tag";

export async function POST(request) {
    try {
        await dbConnect();
        let data = await request.json();
        if (!data.name) {
            return NextResponse.json(
                { message: "Name is required" },
                { status: 400 }
            );
        }
        const existingTag = await Tag.findOne({ name: data.name });
        if (existingTag) {
            return NextResponse.json(
                { message: "Tag with this name already exists" },
                { status: 400 }
            );
        }
        const maxNumIdTag = await Tag.findOne().sort({ num_id: -1 });
        data.num_id = maxNumIdTag ? maxNumIdTag.num_id + 1 : 1;
        const newTag = await Tag.create(data);
        return NextResponse.json(
            {
                success: true,
                message: "Tag created successfully",
                data: newTag
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await dbConnect();
        const tags = await Tag.find({ deleted: false }).sort({ createdAt: -1 });
        return NextResponse.json(
            {
                success: true,
                data: tags,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}