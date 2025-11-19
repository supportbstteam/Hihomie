"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Dropdown from "@/components/ui/DropDown";
import { get_leads } from "@/store/mailer";
import { t } from "@/components/translations";

const mailer = () => {
  const dispatch = useDispatch();
  const { leads, loader, successMessage, errorMessage, successTag } =
    useSelector((state) => state.mailer);

  const [userStatus, setUserStatus] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);

  const toggleLead = (email) => {
    if (selectedLeads.includes(email)) {
      setSelectedLeads(selectedLeads.filter((leadEmail) => leadEmail !== email));
    } else {
      setSelectedLeads([...selectedLeads, email]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(get_leads(userStatus));
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

  const handleSendMail = async () => {
    if (selectedLeads.length === 0) {
      alert(t("alert1"));
      return;
    }

    const res = await fetch("/api/send-bulk-notification-mail", {
      method: "POST",
      body: JSON.stringify({ "leads": selectedLeads, "userStatus": userStatus }),
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
              onChange={(e) => setUserStatus(e.target.value)}
              title={t("select_user_status")}
              value={userStatus}
              options={[
                { value: "No Answer", label: t("no_answer") },
                {
                  value: "Pending Documentation",
                  label: t("pending_documentation"),
                },
                { value: "Contacted Users", label: t("contacted_users") },
                { value: "Users Not Contacted", label: t("users_not_contacted") },
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
            <div className="text-center py-4 text-gray-600">
              {t("loading")}
            </div>
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
