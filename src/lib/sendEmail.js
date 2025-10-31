const nodemailer = require("nodemailer");

export async function sendEmail(emailAddress, simulationData) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports (like 587)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the Mail Options
  const mailOptions = {
    from: `"Hihomie" <${process.env.EMAIL_USER}>`,
    to: emailAddress, 
    subject: "Your Mortgage Simulation Results",
    html: `
      <h1>Your Mortgage Simulation</h1>
      <p>Hello,</p>
      <p>Thank you for using our calculator. Here are the results you requested:</p>
      <ul>
        <li>Monthly Fee: <strong>€${simulationData.monthly_fee}</strong></li>
        <li>Total Purchase Cost: <strong>€${simulationData.total_fee}</strong></li>
        <li>Property Value: <strong>€${simulationData.property_value}</strong></li>
        <li>Total Interest: <strong>€${simulationData.interest}</strong></li>
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
    
  // 3. Send the Mail
  try {
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; 
  }
}
