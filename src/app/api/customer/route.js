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

    const users1 = await Customer.find({ flag: 1 }).lean();
    const users2 = await Customer.find({ flag: 2 }).lean();
    const users3 = await Customer.find({ flag: 3 }).lean();
    const users4 = await Customer.find({ flag: 4 }).lean();
    const users5 = await Customer.find({ flag: 5 }).lean();

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",  // Aug
        day: "2-digit",  // 30
        year: "numeric"  // 2025
      }).replace(",", ","); 
      // 👆 ensure format "Aug,30 2025"
    };

    const cleanUsers1 = users1.map(({ password, createdAt, ...rest }) => ({
      ...rest,
      date: formatDate(createdAt)
    }));

    const cleanUsers2 = users2.map(({ password, createdAt, ...rest }) => ({
      ...rest,
      date: formatDate(createdAt)
    }));

    const cleanUsers3 = users3.map(({ password, createdAt, ...rest }) => ({
      ...rest,
      date: formatDate(createdAt)
    }));

    const cleanUsers4 = users3.map(({ password, createdAt, ...rest }) => ({
      ...rest,
      date: formatDate(createdAt)
    }));

    const cleanUsers5 = users3.map(({ password, createdAt, ...rest }) => ({
      ...rest,
      date: formatDate(createdAt)
    }));

    const customer = {
      1: cleanUsers1,
      2: cleanUsers2,
      3: cleanUsers3,
      4: cleanUsers4,
      5: cleanUsers5
    };

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}