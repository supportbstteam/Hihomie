import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import Customer from '@/models/Customer'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {



    try {
        const { first_name, last_name, email, phone, origin, automatic, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email & password required' }, { status: 400 })
        }

        await dbConnect() // Connect to DB


        const exists = await Customer.findOne({ email })
        if (exists) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
        }

        const exist = await Customer.findOne({ phone })
        if (exist) {
            return NextResponse.json({ error: 'Phone Number already exists' }, { status: 409 })
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = await Customer.create({ first_name, last_name, email, phone, origin, automatic, password: hashed })

        // ✅ password हटाकर response भेजना
        const { password: _, ...userData } = user.toObject()

        return NextResponse.json({message: "Customer created successfully",customer: userData,},{ status: 201 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// ✅ GET - Fetch all customers
export async function GET() {
  try {
    await dbConnect();

    const users = await Customer.find().lean();
  
    const userData = users.map(({ password, ...rest }) => ({
      ...rest,
    }));


    return NextResponse.json({customer: userData,},{ status: 201 })
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, first_name, last_name, phone, origin, automatic, email } = await req.json();

    await dbConnect();

    // 1. Pehle customer nikaalo
    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // 2. Agar email change kar raha hai to check karo ki dusre customer ke paas to nahi hai
    if (email && email !== existingCustomer.email) {
      const emailExists = await Customer.findOne({ email });
      if (emailExists) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
    }

    // 3. Update karo
    const user = await Customer.findByIdAndUpdate(
      id,
      { first_name, last_name, phone, origin, automatic, email },
      { new: true }
    );

    const { password: _, ...userData } = user.toObject();

    return NextResponse.json(
      { message: "Customer updated successfully", customer: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// ✅ GET - Fetch all customers

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = params; // 👈 capture id from URL

    const deletedUser = await Customer.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

