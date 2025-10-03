import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Task from "@/models/Task";

export async function GET() {
    try {
        await dbConnect()
        const tasks = await Task.find()
        return NextResponse.json( tasks, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        await dbConnect()
        const body = await request.json()
        const task = await Task.create({
            task: body.text,
            completed: body.completed,
            date: body.date,
            userId: body.userId,
        })
        return NextResponse.json({ task, message: 'Task created successfully' }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(request) {
    try {
        await dbConnect()
        const body = await request.json()
        const task = await Task.updateOne(
            { _id: body.task_id },
            [
              {
                $set: {
                  completed: { $not: "$completed" }
                }
              }
            ]
          )
        return NextResponse.json({ task, message: 'Task updated successfully' }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request) { 
    try {
        await dbConnect()
        const body = await request.json()
        const task = await Task.deleteOne({ _id: body.task_id })
        return NextResponse.json({ task, message: 'Task deleted successfully' }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}