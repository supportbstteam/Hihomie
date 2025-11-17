import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, data } = await req.json();

    const mailOptions = {
      from: `"Hihomie" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Mortgage Simulation Results",
      html: `
      <h1>Your Mortgage Simulation</h1>
      <p>Hello,</p>
      <p>Thank you for using our calculator. Here are the results you requested:</p>
      <ul>
        <li>Monthly Fee: <strong>€${data.monthly_fee}</strong></li>
        <li>Total Purchase Cost: <strong>€${data.total_fee}</strong></li>
        <li>Property Value: <strong>€${data.property_value}</strong></li>
        <li>Total Interest: <strong>€${data.interest}</strong></li>
      </ul>
    `,
      // You can also add attachments
      // attachments: [
      //   {
      //     filename: 'test.pdf',
      //     path: '/path/to/your/file.pdf',
      //     contentType: 'application/pdf'
      //   }
      // ]
    };

    await sendEmail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}