"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DropDown from "@/components/ui/DropDown";
import { t } from "@/components/translations";
import toast from "react-hot-toast";
import { set } from "mongoose";

const MailModel = ({ isOpen, setMailModelOpen, mailDetails }) => {

  const colour = "#12d071ff";
  const preApprovedContent = `
  <h2 style="font-size:32px; margin:20px 0 0 0; font-weight:600; text-align: center;">HiHomie</h2>
  <h3 style="font-size:28px; margin:0 0 12px 0; font-weight:400; text-align: center;">Hipoteca Preaprobada</h3>
  <p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Hola ${mailDetails.first_name} ${mailDetails.last_name}, <br />
  ¡Tu hipoteca está preaprobada! Según hemos hablado, para comprobar la viabilidad bancaria de tu petición, necesitamos que subas tu documentación de forma segura en tu área privada de HiHomie. ¡Además te adjuntamos el resumen del asesoramiento que hemos realizado por teléfono para que tengas una orientación!
</p>

<p style="margin:16px 0;">
  <a href="https://hipoteca.hihomie.es/" 
     target="_blank" 
     style="color:${colour}; font-size:16px;">
    Access HiHomie
  </a>
</p>

<!-- Documentation Section -->
<h3 style="font-size:18px; margin:20px 0 8px 0; font-weight:bold;">
  ¿Qué documentación necesitamos?
</h3>
<ul style="margin:0 0 16px 20px; padding:0; font-size:16px; line-height:24px;">
  <li>DNI</li>
  <li>Vida laboral</li>
  <li>Contrato de Trabajo</li>
  <li>Nóminas</li>
  <li>Renta del año anterior</li>
  <li>Consentimiento de LOPD</li>
</ul>

<!-- Why Documentation -->
<h3 style="font-size:18px; margin:20px 0 8px 0; font-weight:bold;">
  ¿Por qué necesitamos tu documentación?
</h3>
<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Te pedimos la misma documentación que los bancos solicitan para poder tramitar una hipoteca. ¡ningún documento más!
</p>

<!-- Format Section -->
<h3 style="font-size:18px; margin:20px 0 8px 0; font-weight:bold;">
  ¿En qué formato debo subir la documentación?
</h3>
<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Para poder gestionar tu documentación de forma correcta necesitamos que nos la facilites escaneada en PDF o bien en formato foto .jpg (donde sea vea claro y completo todo el documento sin ningún tipo de Flash)
</p>

<!-- What happens to documentation -->
<h3 style="font-size:18px; margin:20px 0 8px 0; font-weight:bold;">
  ¿Qué va a pasar con tu documentación?
</h3>
<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Un experto hipotecario HiHomie la revisará para confirmar la viabilidad de la operación.
</p>

<!-- What happens next -->
<h3 style="font-size:18px; margin:20px 0 8px 0; font-weight:bold;">
  ¿Qué pasará una vez la información esté revisada?
</h3>
<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Nos pondremos en contacto contigo para que puedas formalizar la propuesta. Una vez nos des autorización procederemos a tramitar tu hipoteca con el banco.
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Cualquier duda no dudes en ponerte en contacto conmigo.
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Un saludo,
</p>
`;

  const pendingDocumentation1stNoticeContent = `<h2 style="font-size:32px; margin:20px 0 0 0; font-weight:600; text-align: center;">HiHomie</h2>
  <h3 style="font-size:28px; margin:0 0 12px 0; font-weight:400; text-align: center;">Documentacion pendiente</h3><br />
  <p style="font-size:26px; line-height:24px; margin:0 0 12px 0; color:${colour};">
  ¡Estás a un paso de conseguir la hipoteca más barata del mercado!<br /><br />
  </p>
  <p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Hola ${mailDetails.first_name} ${mailDetails.last_name}, <br />
  Todavía quedo a la espera de recibir la documentación para comenzar a trabajar en tu hipoteca. Recuerda que esta solicitud es totalmente gratuita y sin compromiso. Solo pagas si decides hacer la hipoteca con nosotros.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Un bróker hipotecario con gran experiencia en el sector estará contigo durante todo el proceso, ofreciéndote información y recomendaciones en todo momento.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Y eso no es todo, tu bróker hipotecario te acompañará en todo el proceso, informándote sobre temas que pueden ser de mayor complejidad como la tasación, el análisis del borrador de Contrato Hipotecario y de la FiAE, el análisis de la FEIN o la revisión de la Provisión de Fondos, entre otros.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Una vez <strong style="color:${colour};">subas la documentación solicitada</strong>, analizaremos tu perfil y te presentaremos las propuestas bancarias que mejor se adaptan a ti.
</p>

<!-- Closing -->
<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Quedo a la espera de recibir la documentación para comenzar a trabajar en tu hipoteca,
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Un saludo,
</p>`;

  const pendingDocumentation2ndNoticeContent = `<h2 style="font-size:32px; margin:20px 0 0 0; font-weight:600; text-align: center;">HiHomie</h2>
  <h3 style="font-size:28px; margin:0 0 12px 0; font-weight:400; text-align: center;">Documentacion pendiente</h3><br />
  <p style="font-size:26px; line-height:24px; margin:0 0 12px 0; color:${colour};">
  ¡Descubre las mejores condiciones para tu hipoteca!<br /><br />
  </p>
  <p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Hola ${mailDetails.first_name} ${mailDetails.last_name}, <br />
  Necesitamos que subas tu documentación para completar tu estudio de viabilidad y así, enviarte las propuestas que encajen mejor con tus necesidades, probablemente podemos conseguir mejores condiciones de las que hablamos por teléfono.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Recuerda que este estudio es totalmente gratuito y sin compromiso. Solo pagas si decides hacer la hipoteca con nosotros.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  ¡En HiHomie tenemos acuerdos especiales con más de veinte bancos nacionales y nuestros clientes ahorran una media de 15.000€ por hipoteca!
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Quedo a la espera de recibir la documentación lo antes posible,
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Un saludo,
</p>
`;

  const mortgageGrantedContent = `<h2 style="font-size:32px; margin:20px 0 0 0; font-weight:600; text-align: center;">HiHomie</h2>
  <h3 style="font-size:28px; margin:0 0 12px 0; font-weight:400; text-align: center;">Hipoteca Concedida</h3><br />
  <p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Hola ${mailDetails.first_name} ${mailDetails.last_name}<br />
  hipoteca concedida
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Un saludo,
</p>
`;

  const [mailType, setMailType] = useState("pre_approved");
  const [mailContent, setMailContent] = useState(preApprovedContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mailType === "pre_approved") {
      setMailContent(preApprovedContent);
    } else if (mailType === "pending_documentation_1st_notice") {
      setMailContent(pendingDocumentation1stNoticeContent);
    } else if (mailType === "pending_documentation_2nd_notice") {
      setMailContent(pendingDocumentation2ndNoticeContent);
    } else if (mailType === "mortgage_granted") {
      setMailContent(mortgageGrantedContent);
    }
  }, [mailType]);

  const handleClick = async () => {
    setLoading(true);

    let subject;
    switch (mailType) {
      case "pre_approved":
        subject = "	HiHomie - Hipoteca Preaprobada";
        break;
      case "pending_documentation_1st_notice":
        subject = "HiHomie - Documentacion pendiente";
        break;
      case "pending_documentation_2nd_notice":
        subject = "HiHomie - Documentacion pendiente";
        break;
      case "mortgage_granted":
        subject = "	HiHomie - Hipoteca Concedida";
        break;
      default:
        break;
    }
    const res = await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({ "email": mailDetails.email, "subject": subject, "mailContent": mailContent }),
    });

    if (!res.ok) {
      toast.error("Failed to send email");
      throw new Error("Failed to send email");
    } else {
      setLoading(false);
      toast.success("Email sent successfully");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white w-full md:max-w-3xl rounded-xl shadow-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 sticky top-0 z-20">
              <h2 className="text-xl font-semibold">
                {t("mail_to")}: {mailDetails.first_name} {mailDetails.last_name}
              </h2>

              <button
                onClick={() => setMailModelOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-6 py-5 overflow-y-auto max-h-[75vh] custom-scrollbar space-y-6 text-gray-800 leading-relaxed">

              <div>
                <p className="font-semibold text-lg mb-2">{t("mail_type")}</p>
                <DropDown
                  name="mail_type"
                  value={mailType}
                  onChange={(e) => { setMailType(e.target.value) }}
                  options={[
                    { label: t("pre_approved"), value: "pre_approved" },
                    { label: t("pending_documentation_1st_notice"), value: "pending_documentation_1st_notice" },
                    { label: t("pending_documentation_2nd_notice"), value: "pending_documentation_2nd_notice" },
                    { label: t("mortgage_granted"), value: "mortgage_granted" },
                  ]}
                />
              </div>

              <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: mailContent }} />

              <button type="button" onClick={handleClick} className="bg-green-500 text-white px-4 py-1 mt-4 rounded hover:bg-green-600 float-right cursor-pointer">{ loading ? "Sending..." : "Send" }</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MailModel;
