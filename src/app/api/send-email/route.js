import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const { email, subject, mailContent, pdfHtml } = await req.json();

    if (!email || !subject || !mailContent || !pdfHtml) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Launch Puppeteer on Linux
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process"
      ],
    });

    const page = await browser.newPage();
    await page.setContent(pdfHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // 2️⃣ Email with PDF
    const mailOptions = {
      from: `"HiHomie" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: mailContent,
      attachments: [
        {
          filename: "document.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

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
