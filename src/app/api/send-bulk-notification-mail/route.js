import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { leads, userStatus } = await req.json();

        const mailOptions = {
            from: `"Hihomie" <${process.env.EMAIL_USER}>`,
            // to: leads[0],
            // bcc: leads,
            subject: "This is a reminder notification mail",
            html: `
                      <h1>This is a reminder notification mail</h1>
                      <p>Hello,</p>
                      <p>Thank you for coming to us</p>
                      <p>Here is a reminder that you have not completed your Documentation.</p>
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
        // await sendEmail(mailOptions);
        
        for (const email of leads) {
            mailOptions.to = email;
            await sendEmail(mailOptions);
        }

        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
    }
}