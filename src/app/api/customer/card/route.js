import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Customer from '@/models/Customer'


export async function POST(req) {
    try {
        const { userId, to } = await req.json();
let flag;
        if (to == 'nuevos') {
            flag = 1;
        } else if (to == 'contactado') {
            flag = 2;
        } else if (to == 'enelbanco') {
            flag = 3;
        } else if (to == 'aprobado') {
            flag = 4;
        } else if (to == 'rechazado') {
            flag = 5;
        }


        await dbConnect();

        const user = await Customer.findByIdAndUpdate(
            userId,
            { flag },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Customer updated successfully"},
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
