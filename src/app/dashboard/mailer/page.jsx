"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Dropdown from "@/components/ui/DropDown";
import { get_leads } from "@/store/mailer";
import { t } from "@/components/translations";
import useUserFromSession from "@/lib/useUserFromSession";

const mailer = () => {
  // mc = mail content

  const mcForNoAnswer = `<h2 style="font-size:32px; margin:20px 0 0 0; font-weight:600; text-align: center;">HiHomie</h2>
  <h3 style="font-size:28px; margin:0 0 12px 0; font-weight:400; text-align: center;">Documentacion pendiente</h3><br />
  <p style="font-size:26px; line-height:24px; margin:0 0 12px 0;">
  ¡Descubre las mejores condiciones para tu hipoteca!<br /><br />
  </p>
  <p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
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
  const mcForPendingDocumentation = `<h2 style="font-size:32px; margin:20px 0 0 0; font-weight:600; text-align: center;">HiHomie</h2>
  <h3 style="font-size:28px; margin:0 0 12px 0; font-weight:400; text-align: center;">Documentacion pendiente</h3><br />
  <p style="font-size:26px; line-height:24px; margin:0 0 12px 0;">
  ¡Descubre las mejores condiciones para tu hipoteca!<br /><br />
  </p>
  <p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
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
  const mcForContactedUsers =  `<h2 style="font-size:32px; margin:20px 0 0 0; font-weight:600; text-align: center;">HiHomie</h2>
<h3 style="font-size:28px; margin:0 0 12px 0; font-weight:400; text-align: center;">Seguimiento de nuestra llamada</h3><br />
<p style="font-size:26px; line-height:24px; margin:0 0 12px 0;">
  ¡Gracias por tu interés en conseguir la mejor hipoteca con HiHomie!<br /><br />
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Tal y como hemos comentado por teléfono, para poder completar tu estudio de viabilidad y enviarte las propuestas que mejor encajen con tus necesidades, necesitamos que subas tu documentación en tu área privada de HiHomie.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Este estudio es totalmente gratuito y sin ningún compromiso. Solo pagas si finalmente decides hacer la hipoteca con nosotros.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  En HiHomie tenemos acuerdos especiales con más de veinte bancos nacionales y nuestros clientes ahorran una media de 15.000€ por hipoteca. Queremos que tú también puedas beneficiarte de estas condiciones.
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Quedo a la espera de recibir tu documentación lo antes posible para seguir avanzando con tu caso.
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Un saludo,
</p>
`;
  const mcForUsersNotContacted = `<h2 style="font-size:32px; margin:20px 0 0 0; font-weight:600; text-align: center;">HiHomie</h2>
<h3 style="font-size:28px; margin:0 0 12px 0; font-weight:400; text-align: center;">Intento de contacto</h3><br />

<p style="font-size:26px; line-height:24px; margin:0 0 12px 0;">
  ¡Queremos ayudarte a conseguir la mejor hipoteca posible!<br /><br />
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Hemos intentado comunicarnos contigo para avanzar con tu estudio hipotecario, pero no hemos logrado contactar contigo por teléfono.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Para poder prepararte un análisis personalizado y enviarte propuestas reales de los bancos, necesitamos que subas tu documentación a tu área privada de HiHomie. Con ello podremos comprobar tu viabilidad y mostrarte las mejores opciones disponibles.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  Recuerda que este estudio es completamente gratuito y sin compromiso. Solo pagas si decides hacer la hipoteca con nosotros.
</p>

<p style="font-size:16px; line-height:24px; margin:0 0 12px 0;">
  En HiHomie trabajamos con más de veinte bancos nacionales y nuestros clientes ahorran una media de 15.000€ por hipoteca. ¡Queremos que tú también puedas beneficiarte!
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Si tienes cualquier duda o quieres que te llamemos en un momento concreto, simplemente respóndeme a este correo.
</p>

<p style="font-size:16px; line-height:24px; margin:16px 0;">
  Un saludo,
</p>
`;
  
  const user = useUserFromSession();
  const dispatch = useDispatch();
  const { leads, loader, successMessage, errorMessage, successTag } =
    useSelector((state) => state.mailer);

  const [userStatus, setUserStatus] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);

  const toggleLead = (email) => {
    if (selectedLeads.includes(email)) {
      setSelectedLeads(
        selectedLeads.filter((leadEmail) => leadEmail !== email)
      );
    } else {
      setSelectedLeads([...selectedLeads, email]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user?.id) {
      dispatch(get_leads({"userStatus": userStatus, "userId": user.id}));
    }
  };

  useEffect(() => {
    const allEmails = leads.map((lead) => lead.email);
    setSelectedLeads(allEmails);
  }, [leads]);

  const toggleAllLeads = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      const allEmails = leads.map((lead) => lead.email);
      setSelectedLeads(allEmails);
    }
  };

  const [mailContent, setMailContent] = useState("");


  const handleSendMail = async () => {
    if (selectedLeads.length === 0) {
      alert(t("alert1"));
      return;
    }
    let subject = "";

    switch (userStatus) {
      case "No Answer":
        subject = "No Answer";
        setMailContent(mcForNoAnswer);
        break;
      case "Pending Documentation":
        subject = "Pending Documentation";
        setMailContent(mcForPendingDocumentation);
        break;
      case "Contacted Users":
        subject = "Contacted Users";
        setMailContent(mcForContactedUsers);
        break;
      case "Users Not Contacted":
        subject = "Users Not Contacted";
        setMailContent(mcForUsersNotContacted);
        break;
      default:
        break;
    }

    const res = await fetch("/api/send-bulk-notification-mail", {
      method: "POST",
      body: JSON.stringify({
        leads: selectedLeads,
        subject: subject,
        mailContent: mailContent,
      }),
    });

    if (!res.ok) {
      throw new Error(t("error1"));
    }
  };

  return (
    <>
      <main className="grid grid-cols-1 lg:grid-cols-5 gap-6 m-6">
        <section className="col-span-2 bg-white rounded-lg p-6 sm:p-8 shadow-lg">
          <h2 className="text-lg bg-primary/20 rounded-lg px-2 py-3 font-semibold mb-6 flex items-center gap-2 text-gray-800">
            {t("actions")}
          </h2>

          <form onSubmit={handleSubmit}>
            <Dropdown
              label={t("users_last_3_months")}
              name="user_status"
              onChange={(e) => {
                setUserStatus(e.target.value);
              }}
              title={t("select_user_status")}
              value={userStatus}
              options={[
                { value: "No Answer", label: t("no_answer") },
                {
                  value: "Pending Documentation",
                  label: t("pending_documentation"),
                },
                { value: "Contacted Users", label: t("contacted_users") },
                {
                  value: "Users Not Contacted",
                  label: t("users_not_contacted"),
                },
              ]}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="submit"
                disabled={loader}
                className="px-6 py-2 rounded-md text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:bg-gray-400"
              >
                {loader ? t("Loading") : t("submit")}
              </button>
            </div>
          </form>
        </section>

        <section className="col-span-3 bg-white rounded-lg p-6 sm:p-8 shadow-lg flex flex-col">
          <div className="flex justify-between bg-primary/20 rounded-lg px-2 py-2 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              {t("users_last_3_months")}
            </h2>
            <button
              disabled={loader}
              type="button"
              onClick={handleSendMail}
              className="px-6 py-2 rounded-md text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:bg-gray-400"
            >
              {t("send_mail")}
            </button>
          </div>

          {/* Header */}
          <div className="grid grid-cols-5 mb-4">
            <h2 className="font-medium col-span-1">
              <input
                type="checkbox"
                checked={selectedLeads.length === leads.length}
                onChange={toggleAllLeads}
                className="w-4 h-4 accent-emerald-600"
              />
            </h2>
            <h2 className="font-medium col-span-2">{t("name")}</h2>
            <h2 className="font-medium col-span-2">{t("email")}</h2>
          </div>

          {/* Loader while leads are fetching */}
          {loader && (
            <div className="text-center py-4 text-gray-600">{t("loading")}</div>
          )}

          {/* Leads list */}
          {!loader &&
            leads.map((lead) => (
              <div key={lead.id} className="grid grid-cols-5 py-1">
                <span className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.email)}
                    onChange={() => toggleLead(lead.email)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </span>

                <span className="col-span-2">{lead.name}</span>
                <span className="col-span-2">{lead.email}</span>
              </div>
            ))}
        </section>
      </main>
    </>
  );
};

export default mailer;
