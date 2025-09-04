"use client";
import React, { useEffect, useState } from "react";
import { FaPlus, FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddTeam from "@/components/team/AddTeam";
import { delete_teamData, get_teamData, messageClear } from "@/store/userTema";
import EditTeam from "@/components/team/EditTeam";
import { t } from "@/components/translations";
import Icon from "@/components/ui/Icon";
import { Plus } from "lucide-react";

const Team = () => {
  const dispatch = useDispatch();
  const { loader, team, errorMessage, successMessage } = useSelector(
    (state) => state.team
  );
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = team.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(team.length / recordsPerPage);

  // fetch customers from API
  useEffect(() => {
    dispatch(get_teamData());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(delete_teamData(id));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setOpen(false);
      setUser(null);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="grid w-full">
      {/* Header */}
      <aside className="w-full bg-white  sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
          <div className="hidden sm:flex flex-col"></div>

          <div className="flex w-full sm:w-auto justify-end">
            <Icon
              icon={Plus}
              size={16}
              color="#99A1B7"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
      </aside>

      <div className="p-5">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stroke text-gray-600">
                <th className="py-3 text-left">{t("full_name")}</th>
                <th className="py-3 text-center">{t("position")}</th>
                <th className="py-3 text-center">{t("role")}</th>
                <th className="py-3 text-center">{t("email")}</th>
                <th className="py-3 text-center">{t("phone")}</th>
                <th className="py-3 text-center">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((row, i) => (
                <tr key={i} className="border-b border-stroke hover:bg-gray-50">
                  <td className="py-3 flex items-center gap-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${row.image}`}
                      className="w-8 h-8 rounded-full border border-stroke object-cover"
                    />{" "}
                    {row.name} {row.lname}
                  </td>

                  <td className="py-3 text-center">{row.jobTitle}</td>

                  <td className="py-3 text-center">
                    {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
                  </td>

                  <td className="py-3 text-center">{row.email}</td>

                  <td className="py-3 text-center">{row.phone}</td>

                  <td className="py-3 text-center">
                    <div className="flex justify-center gap-3 text-lg">
                      {/* <FaRegEye className="text-green-500 cursor-pointer hover:scale-110 transition" /> */}
                      <FaRegEdit
                        onClick={() => setUser(row)}
                        className="text-orange-500 cursor-pointer hover:scale-110 transition"
                      />
                      <FaRegTrashAlt
                        onClick={() => handleDelete(row._id)}
                        className="text-red-500 cursor-pointer hover:scale-110 transition"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Previa
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-sky-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {open && <AddTeam setOpen={setOpen} />}

      {user && <EditTeam user={user} setUser={setUser} />}
    </div>
  );
};

export default Team;
