import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser'
import mongoose from "mongoose";
import { t } from "@/components/translations";
import { sendEmail } from "@/lib/sendEmail";
import User from '@/models/User';


export async function POST(req) {

  try {
    const { lead_title, surname, first_name, last_name, company, designation, email, phone, lead_value, assigned, type_of_opration, customer_situation, purchase_status, commercial_notes, manager_notes, detailsData, addressDetailsData, selectedColId, contacted, contract_signed, origin } = await req.json()

    let final_origin = origin || "online";

    await dbConnect();

    const admin = await User.findOne({
      role: "admin",
      name: "Super Admin"
    }).lean();

    if (email) {
      // Searches all LeadStatus documents to see if any of their 'cards' array contains this email
      const existingLead = await LeadStatus.findOne({ "cards.email": email });

      if (existingLead) {

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
          to: admin.email,
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


    const newCard = {
      lead_title: maxNumber,
      surname,
      first_name,
      last_name,
      company,
      designation,
      phone,
      email,
      lead_value,
      assigned,
      status: selectedColId,
      type_of_opration,
      customer_situation,
      purchase_status,
      commercial_notes,
      manager_notes,
      detailsData,
      addressDetailsData,
      contacted,
      contract_signed,
      property_enquiry: final_origin,
    };


    // Find the LeadStatus by ID and push the new card
    const updatedColumn = await LeadStatus.findByIdAndUpdate(
      selectedColId,
      { $push: { cards: newCard } },
      { new: true } // return the updated document
    );

    // these two lines are used to assign the card to the manager or staff or any user at the time of lead creation
    const newCardId = updatedColumn.cards[updatedColumn.cards.length - 1]._id;
    if (!assigned || assigned.trim() === "") {
      console.log("No user assigned, skipping assignment creation");
    } else {
      await CardAssignUser.create({
        userId: assigned,
        cardId: newCardId,
        colId: selectedColId
      });
    }

    if (!updatedColumn) {
      return NextResponse.json({ error: t('tm15') }, { status: 404 });
    }

    return NextResponse.json({ message: t('tm16'), data: updatedColumn }, { status: 200 });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: t("internal_se") }, { status: 500 })
  }
}

// ✅ GET - Fetch all customers
export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const email_like = searchParams.get("email_like");
  try {
    await dbConnect();

    const users = await LeadStatus.aggregate([
      { $unwind: "$cards" },
      {
        $match: {
          $or: [
            { "cards.email": { $regex: email_like, $options: "i" } },
            {
              $expr: {
                $regexMatch: {
                  input: { $concat: ["$cards.first_name", " ", "$cards.last_name"] },
                  regex: email_like,
                  options: "i",
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          name: { $concat: ["$cards.first_name", " ", "$cards.last_name"] },
          email: "$cards.email",
        },
      },
    ]);

    return NextResponse.json(users, { status: 201 })
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: t("internal_se") }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const {
      colId, id, surname, first_name, last_name,
      company, designation, email, phone, lead_value,
      assigned, status, type_of_opration, customer_situation,
      purchase_status, commercial_notes, manager_notes,
      detailsData, addressDetailsData, contacted, contract_signed
    } = await req.json();

    await dbConnect();


    // Validation
    if (!colId || !id) {
      return NextResponse.json({ error: "colId and id are required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(colId)) {
      return NextResponse.json({ error: "Invalid colId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid card id" }, { status: 400 });
    }


    // 1️⃣ Update the card in its current column
    const updatedColumn = await LeadStatus.findOneAndUpdate(
      { _id: colId, "cards._id": id },
      {
        $set: {
          // "cards.$.lead_title": lead_title,
          "cards.$.surname": surname,
          "cards.$.first_name": first_name,
          "cards.$.last_name": last_name,
          "cards.$.company": company,
          "cards.$.designation": designation,
          "cards.$.phone": phone,
          "cards.$.email": email,
          "cards.$.lead_value": lead_value,
          "cards.$.assigned": assigned,
          "cards.$.status": status,
          "cards.$.type_of_opration": type_of_opration,
          "cards.$.customer_situation": customer_situation,
          "cards.$.purchase_status": purchase_status,
          "cards.$.commercial_notes": commercial_notes,
          "cards.$.manager_notes": manager_notes,
          "cards.$.detailsData": detailsData,
          "cards.$.addressDetailsData": addressDetailsData,
          "cards.$.contacted": contacted,
          "cards.$.contract_signed": contract_signed,
        },
      },
      { new: true }
    );


    // If no card updated → card does not exist
    if (!updatedColumn) {
      return NextResponse.json({
        error: t('tm17'),
      }, { status: 404 });
    }

    // Extract updated card after update
    const updatedCard = updatedColumn.cards.id(id);

    // 2️⃣ If status changed, move the card
    if (status != colId) {

      // Source column
      const sourceCol = await LeadStatus.findById(colId);
      if (!sourceCol) {
        return NextResponse.json({ error: t('tm18') }, { status: 404 });
      }

      const cardIndex = sourceCol.cards.findIndex(
        (c) => c._id.toString() === id
      );
      if (cardIndex === -1) {
        return NextResponse.json({ error: t('tm19') }, { status: 404 });
      }

      const [movedCard] = sourceCol.cards.splice(cardIndex, 1);
      await sourceCol.save();

      // Destination column
      const destCol = await LeadStatus.findById(status);
      if (!destCol) {
        return NextResponse.json({ error: t('tm20') }, { status: 404 });
      }

      destCol.cards.push(movedCard);
      await destCol.save();
    }

    // 3️⃣ Final return
    return NextResponse.json({
      message: t('tm21'),
      data: updatedCard,
    }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: t("internal_se") }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = params; // 👈 capture id from URL

    const deletedUser = await LeadStatus.findOneAndUpdate(
      { "cards._id": id },
      { $pull: { cards: { _id: id } } }
    );

    if (!deletedUser) {
      return NextResponse.json({ error: t('tm13') }, { status: 404 });
    }

    return NextResponse.json({ message: t("tm9") }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: t("internal_se") }, { status: 500 });
  }
}


