import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"
import LeadStatus from "../../../models/LeadStatus";
import { sendEmail } from "@/lib/sendEmail";

function daysBetween(a, b) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utcB - utcA) / msPerDay);
}

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        // limit query to leads created within last 7 days for performance
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        const leads = await LeadStatus.aggregate([
            {
                $unwind: "$cards"
            },
            {
                $match: {
                    "cards.contacted": "yes",
                    createdAt: { $gte: sevenDaysAgo },
                }
            }
        ]);

        const toNotify = [];

        for (const lead of leads) {
            const days = daysBetween(lead.createdAt, now);
            const mailContent = `
                <!-- header -->
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

                <!-- main content -->

                <p>Hola ${lead.cards.first_name} ${lead.cards.last_name}, </p><br/>
                <p>Thank you for your interest in our services. We are excited to hear from you and help you with your mortgage needs.</p><br/>
                <p>Would You Like to know more? Let us help you take the next step</p><br/>
                <p>Greetings,</p>
                <p>The HiHomie Team</p>
                `;
            const mailOptions = {
                from: `"HiHomie" <${process.env.EMAIL_USER}>`,
                to: lead.cards.email,
                subject: "100% Mortgage with the best interest rate",
                html: mailContent,
            };
            if (days === 2 || days === 5) {
                toNotify.push({ leadId: lead.cards._id.toString(), days });
                await sendEmail(mailOptions);
            }
        }

        return NextResponse.json({ success: true, checked: leads.length, notified: toNotify.length, details: toNotify });
    } catch (err) {
        console.error("Error in check-leads job:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Unknown error" },
            { status: 500 }
        );
    }
}

// 0 0 * * * curl -s "https://hipoteca.hihomie.es/api/automatic-mail" > /dev/null 2>&1