import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { name, email, password, role = 'user' } = await req.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email & password required' }, { status: 400 })
    }

    await dbConnect() // Connect to DB

    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed, role })

    return NextResponse.json({ id: user._id, email: user.email, role: user.role })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

