export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PasswordReset from '../../../../../models/PasswordReset';
import User from '../../../../../models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req, context) {
  try {
    await dbConnect();

    // ✅ Get email from route params
    const { email } = await context.params;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 400 }
      );
    }

    // ✅ Create reset token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 mins expiry

    // ✅ Save reset request
    await PasswordReset.create({ email, token, expiresAt });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: `Hihomie <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Hihomie-Password Reset",
      html: `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#22b573;">
        <tbody>
          <tr>
            <td style="padding:20px;">
              <a href="https://hipoteca.hihomie.es/" target="_blank" style="display:inline-block;">
                <img src="https://hipotecas.hihomie.es/src/inc/assets/template_files/mailing/img/logo-white.png"
                     alt="HiHomie Logo" 
                     style="width:200px; display:block;">
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 20px;">Click <strong><a href="${resetLink}">here</a></strong> to reset your password</p>`,
    };

    await sendEmail(mailOptions);

    return NextResponse.json({ message: "Mail sent" }, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
