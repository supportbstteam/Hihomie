import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, subject, mailContent } = await req.json();

    // --------------------
    //  Email Content
    // --------------------
    const mailOptions = {
      from: `"Hihomie" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#22b573;">
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

      ${mailContent}

      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:auto; background:#ffffff;">
        <tbody>
          <tr>
            <td valign="middle" style="padding:20px 0; background:#f7f7f7;">
              <!-- your columns here -->
            </td>
          </tr>
          <tr>
            <td style="text-align:center; color:#999; padding:15px 0; background:#f7f7f7; font-size:13px;">
              HiHomie 2025 - La mejor hipoteca, gana más por tu piso
            </td>
          </tr>
        </tbody>
      </table>
      `,
      // No PDF attachment now
      attachments: [],
    };

    // Send Email
    await sendEmail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
