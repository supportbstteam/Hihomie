import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { leads, subject, mailContent } = await req.json();

    const mailOptions = {
      from: `Hihomie <${process.env.EMAIL_USER}>`,
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
                  <!-- 3 Columns Section -->
                  <tr>
                      <td valign="middle" style="padding:20px 0; background:#f7f7f7;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tbody>
                            <tr>
          
                              <!-- Column 1 -->
                              <td valign="top" width="33.333%" style="padding:20px 10px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="text-align:left;">
                                      <img src="https://hipotecas.hihomie.es/src/inc/assets/template_files/mailing/img/logo.png"
                                           alt="HiHomie Logo"
                                           style="width:100px; display:block;">
                                      <p style="font-size:14px; color:#333; margin:10px 0 0 0; line-height:20px;">
                                        Descubre <br> la revolución <br> inmobiliaria
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
          
                              <!-- Column 2 -->
                              <td valign="top" width="33.333%" style="padding:20px 10px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="text-align:left;">
                                      <h3 style="color:#000; font-size:16px; margin:0 0 10px 0; padding-left:15px;">Links</h3>
                                      <ul style="margin:0; padding-left:0; list-style-position:inside; font-size:14px; line-height:22px; color:#333;">
                                        <li><a href="https://hihomie.es/vender/" target="_blank" style="color:#0A7F45; text-decoration:none;">Vender</a></li>
                                        <li><a href="https://hihomie.es/inmuebles/" target="_blank" style="color:#0A7F45; text-decoration:none;">Comprar</a></li>
                                        <li><a href="https://hihomie.es/inmuebles/?tipo=alquiler" target="_blank" style="color:#0A7F45; text-decoration:none;">Alquilar</a></li>
                                        <li><a href="https://hihomie.es/hipoteca/" target="_blank" style="color:#0A7F45; text-decoration:none;">Hipoteca</a></li>
                                      </ul>
                                    </td>
                                  </tr>
                                </table>
                              </td>
          
                              <!-- Column 3 -->
                              <td valign="top" width="33.333%" style="padding:20px 10px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="text-align:left;">
                                      <h3 style="color:#000; font-size:16px; margin:0 0 10px 0; padding-left:15px;">Links</h3>
                                      <ul style="margin:0; padding-left:0; list-style-position:inside; font-size:14px; line-height:22px; color:#333;">
                                        <li><a href="https://hihomie.es/servicios/" target="_blank" style="color:#0A7F45; text-decoration:none;">Servicios</a></li>
                                        <li><a href="https://hihomie.es/blog/" target="_blank" style="color:#0A7F45; text-decoration:none;">Blog</a></li>
                                        <li><a href="https://hihomie.es/perfil/" target="_blank" style="color:#0A7F45; text-decoration:none;">Perfil</a></li>
                                        <li><a href="https://hihomie.es/contacto/" target="_blank" style="color:#0A7F45; text-decoration:none;">Contacto</a></li>
                                      </ul>
                                    </td>
                                  </tr>
                                </table>
                              </td>
          
                            </tr>
                          </tbody>
                        </table>
                      </td>
                  </tr>
          
                  <!-- Bottom Bar -->
                  <tr>
                      <td style="text-align:center; color:#999; padding:15px 0; background:#f7f7f7; font-size:13px;">
                        HiHomie 2025 - La mejor hipoteca, gana más por tu piso
                      </td>
                  </tr>
          
              </tbody>
              </table>
            `,
    }
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