import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import LeadStatus from "@/models/LeadStatus";
import CardAssignUser from '@/models/CardAssignUser';
import DueDates from '@/models/DueDates';
import nodemailer from "nodemailer";
import User from '@/models/User';

export async function GET(request) {

    // ⛔ FIX: Ensure DB connection
    await dbConnect();

    const today = new Date().toISOString().split("T")[0];

    let dueDate = await DueDates.find({
        due_date: today
    }).lean();


    let assignedUserIds = dueDate.map(due => due.cardId);


    const assignedUsers = await CardAssignUser.find({
        cardId: { $in: assignedUserIds }
    }).lean();

    // assignedUsers.forEach(user => {
    //     const due = dueDate.find(d => d.cardId === user.cardId);
    //     if (due) {

    //     }
    // })

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    assignedUsers.forEach(async (u) => {
        const due = dueDate.find(d => d.cardId === u.cardId);
        // FIX: rename variable + make it async
        const dbUser = await User.findOne({ _id: u.userId }).lean();

        if (due && dbUser) {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: dbUser.email,
                subject: `Task Due Reminder`,
                html: `
<div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:25px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
    
    <h2 style="margin-top:0; color:#333;">Task Due Reminder</h2>

    <p style="font-size:16px; color:#555;">
      Hi <strong>${dbUser.name} ${dbUser.lname}</strong>,
    </p>

    <p style="font-size:15px; color:#555;">
      This is a friendly reminder that you have a task due today.  
      Please review the details below:
    </p>

    <table style="width:100%; margin-top:20px; border-collapse:collapse;">
      <tr>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee; width:40%; font-weight:bold;">Due Date</td>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee;">${  new Date(due.due_date).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee; font-weight:bold;">Due Time</td>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee;">${due.due_time}</td>
      </tr>
    </table>

    <p style="font-size:15px; color:#555; margin-top:25px;">
      Please make sure to complete the task on time.  
      If you have any questions, feel free to contact your manager.
    </p>

    <p style="margin-top:30px; font-size:14px; color:#777;">
      Regards,<br>
      <strong>Team Hihomie</strong>
    </p>

  </div>

  <p style="text-align:center; margin-top:15px; font-size:12px; color:#aaa;">
    This is an automated email — please do not reply.
  </p>
</div>
`

            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${dbUser.email}`);
            } catch (error) {
                console.log("Email Error:", error);
            }
        }
    });




    return NextResponse.json({
        status: "success",
        message: "Mail Sedn With cron job",
    });
}
