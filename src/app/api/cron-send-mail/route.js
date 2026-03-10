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

  await dbConnect();

  const today = new Date().toISOString().split("T")[0];

  let dueDate = await DueDates.find({
    due_date: today
  }).lean();


  let assignedUserIds = dueDate.map(due => due.cardId);


  const assignedUsers = await CardAssignUser.find({
    cardId: { $in: assignedUserIds }
  }).lean();


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

    const dbClient = await LeadStatus.findOne(
      { "cards._id": new mongoose.Types.ObjectId(u.cardId) },
      { "cards.$": 1 }
    ).lean();

    const card = dbClient.cards[0];

    console.log("client", card);

    if (due && dbUser) {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: dbUser.email,
        subject: `Task Due Reminder`,
        html: `
<div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:25px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
    
    <h2 style="margin-top:0; color:#333;">Recordatorio de tarea pendiente</h2>

    <p style="font-size:16px; color:#555;">
      Hi <strong>${dbUser.name} ${dbUser.lname}</strong>,
    </p>

    <p style="font-size:15px; color:#555;">
      Este es un recordatorio amistoso de que tienes una tarea que entregar hoy. 
      Por favor revise los detalles a continuación:
    </p>

    <table style="width:100%; margin-top:20px; border-collapse:collapse;">
      <tr>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee; width:40%; font-weight:bold;">Cliente</td>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee;">
          ${card.first_name} ${card.last_name}
        </td>
      </tr>
      <tr>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee; font-weight:bold;">Correo Electrónico</td>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee;">${card.email}</td>
      </tr>
      <tr>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee; font-weight:bold;">Teléfono</td>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee;">${card.phone}</td>
      </tr>

      <tr>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee; font-weight:bold;">Fecha de vencimiento</td>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee;">${new Date(due.due_date).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee; font-weight:bold;">Tiempo debido</td>
        <td style="padding:10px; background:#fafafa; border:1px solid #eee;">${due.due_time}</td>
      </tr>
    </table>

    <p style="font-size:15px; color:#555; margin-top:25px;">
      Asegúrese de completar la tarea a tiempo.
      Si tiene alguna pregunta, no dude en ponerse en contacto con su gerente.
    </p>

    <p style="margin-top:30px; font-size:14px; color:#777;">
      Saludos,<br>
      <strong>Team Hihomie</strong>
    </p>

  </div>

  <p style="text-align:center; margin-top:15px; font-size:12px; color:#aaa;">
    Este es un correo electrónico automático: por favor no responda.
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
