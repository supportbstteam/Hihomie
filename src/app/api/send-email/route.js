// import { sendEmail } from "@/lib/sendEmail";
// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// export async function POST(req) {
//   try {
//     const { email, subject, mailContent, pdfHtml } = await req.json();

//     console.log("Received data:", { email, subject, mailContent, pdfHtml: pdfHtml ? "HTML content received" : "No HTML content" });

//     if (!email || !subject || !mailContent) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // 1️⃣ Launch Puppeteer on Linux
//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//         "--disable-gpu",
//         "--no-zygote",
//         "--single-process"
//       ],
//     });

//     const page = await browser.newPage();
//     await page.setContent(pdfHtml, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await browser.close();

//     // 2️⃣ Email with PDF
//     const mailOptions = {
//       from: `"HiHomie" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject,
//       html: mailContent,
//       attachments: [
//         {
//           filename: "document.pdf",
//           content: pdfBuffer,
//           contentType: "application/pdf",
//         },
//       ],
//     };

//     await sendEmail(mailOptions);

//     return NextResponse.json(
//       { message: "Email with PDF sent successfully!" },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("SEND EMAIL + PDF ERROR:", error);
//     return NextResponse.json(
//       { message: "Error sending email", error: error.message },
//       { status: 500 }
//     );
//   }
// }



import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const { email, subject, mailContent, pdfHtml } = await req.json();

    console.log("Received data:", { email, subject, mailContent, pdfHtml: pdfHtml ? "HTML received" : "NO PDF HTML" });

    if (!email || !subject || !mailContent) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let attachments = []; // by default no attachment

    // ✅ Only generate PDF when pdfHtml exists
    if (pdfHtml && pdfHtml.trim() !== "") {

      const browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-zygote",
          "--single-process",
        ],
      });

      const page = await browser.newPage();
      await page.setContent(pdfHtml, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      attachments.push({
        filename: "document.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      });
    }

    // 👉 Email sending
    const mailOptions = {
      from: `"HiHomie" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: mailContent,
      attachments, // empty OR PDF
    };

    await sendEmail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
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
