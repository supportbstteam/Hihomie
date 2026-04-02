import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser'
import User from '@/models/User';
import { sendEmail } from "@/lib/sendEmail";


export async function POST(req) {

  try {
    const { token, surname, first_name, last_name, email, phone, snake_case, operation, reserved_property, price_property, net_earnings, catalonia, monthly_net_earnings, minimum_savings, down_payment, additional_security, paying_any_other_loans, pay_on_other_loans, old_are_you, registry_ASNEF, mortgage, second_monthly_net_earnings, second_paying_any_other_loans, owner_property, campaign } = await req.json()
    await dbConnect();

    if (token != '2y:5254polkiju69852tokenther5895sdsd1sd477sd477dslhashdsfoiasdfkcheck') {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 500 })
    }

    const admin = await User.findOne({
      role: "admin",
      name: "Super Admin"
    }).lean();

    let assignedExisting = null;

    if (email) {
      // Searches all LeadStatus documents to see if any of their 'cards' array contains this email
      const existingLead = await LeadStatus.findOne({ "cards.email": email });

      if (existingLead) {

        const targetCard = existingLead.cards.find(c => c.email === email);
        if (targetCard) {
          assignedExisting = await CardAssignUser.findOne({ cardId: targetCard._id }).lean();
        }

        const mailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      
      <div style="background-color: #f39c12; color: white; padding: 15px 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">⚠️ Alerta de Lead Duplicado</h2>
      </div>
    
      <div style="padding: 20px; color: #333333; line-height: 1.6;">
        <p>Hola Admin,</p>
        <p>Se acaba de recibir un nuevo formulario, pero la dirección de correo electrónico ya está asociada a una tarjeta existente en el sistema.</p>
    
        <h3 style="border-bottom: 2px solid #eeeeee; padding-bottom: 5px; color: #2c3e50; margin-top: 25px;">Detalles de la Nueva Solicitud:</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #555;">Nombre:</td>
            <td style="padding: 8px 0;">${first_name || ''} ${last_name || ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #3498db;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Teléfono:</td>
            <td style="padding: 8px 0;">${phone || 'N/D'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Origen:</td>
            <td style="padding: 8px 0;">${final_origin}</td>
          </tr>
        </table>
    
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #f39c12; font-size: 14px; margin-top: 20px;">
          <strong>Acción Tomada por el Sistema:</strong> La nueva tarjeta se generó y guardó en el sistema de todos modos. Por favor, revise el pipeline para determinar si estos registros deben fusionarse o si el cliente está solicitando un servicio nuevo e independiente.
        </div>
    
      </div>
    
      <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
        Esta es una notificación automática del sistema de la API de HiHomie.
      </div>
    
    </div>
    `;

        const mailOptions = {
          from: `"HiHomie" <${process.env.EMAIL_USER}>`,
          // to: admin.email ?? "admin@hihomie.es",
          to: "bstteam106@gmail.com",
          subject: "Alerta de Cliente Potencial Duplicado",
          html: mailContent,
        };

        await sendEmail(mailOptions);
      }
    }

    const maxCard = await LeadStatus.aggregate([
      { $unwind: "$cards" },
      {
        $group: {
          _id: null,
          maxNumber: { $max: { $toInt: "$cards.lead_title" } }
        }
      }
    ]);

    let maxNumber = maxCard.length > 0 ? maxCard[0].maxNumber : 0;

    if (maxNumber === 0) {
      maxNumber = 1;
    } else {
      maxNumber += 1;
    }

    let lead_status_id = '68c297a3212f4d647f1c1087';

    const newCard = {
      lead_title: maxNumber,
      surname,
      first_name,
      last_name,
      phone,
      email,
      snake_case,
      operation,
      reserved_property,
      price_property,
      net_earnings,
      catalonia,
      monthly_net_earnings,
      minimum_savings,
      down_payment,
      additional_security,
      paying_any_other_loans,
      pay_on_other_loans,
      old_are_you,
      registry_ASNEF,
      mortgage,
      second_monthly_net_earnings,
      second_paying_any_other_loans,
      owner_property,
      campaign,
      status: lead_status_id,
      property_enquiry: 'Online'
    };

    // Find the LeadStatus by ID and push the new card
    const updatedColumn = await LeadStatus.findByIdAndUpdate(
      lead_status_id,
      { $push: { cards: newCard } },
      { new: true } // return the updated document
    );

    if (!updatedColumn) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }

    const newCardId = updatedColumn.cards[updatedColumn.cards.length - 1]._id;
    if (assignedExisting) {
      await CardAssignUser.create({
        userId: assignedExisting.userId,
        cardId: newCardId,
        colId: lead_status_id
      });
    }


    return NextResponse.json({ message: 'Card added successfully', data: updatedColumn }, { status: 200 });

  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: true, message: error.message, stack: error.stack }, { status: 500 });
  }
}














