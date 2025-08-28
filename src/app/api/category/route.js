import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import Category from '@/models/Category'

export async function POST(req) {
  try {

    const { status, category } = await req.json()

    await dbConnect() // Connect to DB

    const data = await Category.create({ status, category })

    return NextResponse.json({ message: "Category created successfully", data }, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// ✅ GET - Fetch all customers
export async function GET() {
  try {
    await dbConnect();
    const data = await Category.find().lean();
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, category, status } = await req.json();

    await dbConnect(); // Connect DB

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category, status },
      { new: true } // return updated doc
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category updated successfully", data: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    await dbConnect();

    const { id } = await req.json()// comes from URL

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Record deleted successfully", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
