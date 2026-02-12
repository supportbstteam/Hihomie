import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(req) {
  try {
    const { email, subject, mailContent, pdfHtml } = await req.json();

    if (!email || !subject || !mailContent || !pdfHtml) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ------------------------
    // 1️⃣ Generate PDF using Puppeteer (Vercel Safe)
    // ------------------------
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(pdfHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // ------------------------
    // 2️⃣ Email Content + PDF attachment
    // ------------------------
    const mailOptions = {
      from: `"HiHomie" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#22b573;">
          <tr>
            <td style="padding:20px;">
              <a href="https://hipoteca.hihomie.es/" target="_blank">
                <img src="https://hipotecas.hihomie.es/src/inc/assets/template_files/mailing/img/logo-white.png"
                     alt="HiHomie Logo"
                     style="width:180px; display:block;" />
              </a>
            </td>
          </tr>
        </table>

        ${mailContent}

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f7f7; margin-top:20px;">
          <tr>
            <td style="text-align:center; padding:20px 0; color:#999; font-size:13px;">
              HiHomie 2025 - La mejor hipoteca, gana más por tu piso
            </td>
          </tr>
        </table>
      `,

      attachments: [
        {
          filename: "document.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // ------------------------
    // 3️⃣ Send Email (with PDF)
    // ------------------------
    await sendEmail(mailOptions);

    return NextResponse.json(
      { message: "Email with PDF sent successfully!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("SEND EMAIL + PDF ERROR:", error);
    return NextResponse.json(
      { message: "Error sending email", error: error.message },
      { status: 500 }
    );
  }
}
