import {
  ArrowDown,
  ArrowUp,
  EllipsisVertical,
  Link,
  Mail,
  MessageSquareText,
  Minus,
  Percent,
  Phone,
  Plus,
  Square,
} from "lucide-react";
import React from "react";

const List = ({ leadStatusList, selecteFilterData }) => {
  console.log(selecteFilterData);

  const { gestor, estado, full_name, phone } = selecteFilterData || {};

  // ✅ Filtering Logic
  const filteredList = leadStatusList.filter((item) => {
    // Match Gestor
    const matchGestor = gestor
      ? item?.users?.some((user) => user._id === gestor)
      : true;

    // Match Estado
    const matchEstado = estado
      ? item?.leadStatusId === estado
      : true;

    // Match Full Name (case insensitive search)
    const matchName = full_name
      ? `${item.first_name || ""} ${item.last_name || ""}`
          .toLowerCase()
          .includes(full_name.toLowerCase())
      : true;

    // Match Phone (partial match allowed)
    const matchPhone = phone
      ? item?.phone?.toString().includes(phone)
      : true;

    return matchGestor && matchEstado && matchName && matchPhone;
  });


  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#F8FAFD]">
          <tr>
            <th className="psm text-dark px-4 py-3 text-left">Full Name</th>
            <th className="psm text-dark px-4 py-3 text-left">Title</th>
            <th className="psm text-dark px-4 py-3 text-left">Created</th>
            <th className="psm text-dark px-4 py-3 text-left">Value</th>
            <th className="psm text-dark px-4 py-3 text-left">Assigned</th>
            <th className="psm text-dark px-4 py-3 text-left">Phone</th>
            <th className="psm text-dark px-4 py-3 text-left">Status</th>
            <th className="psm text-dark px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {filteredList.length > 0 ? (
            filteredList.map((item, i) => (
              <tr key={i}>
                <td className="px-4 py-4 text-gray-700">
                  {item.first_name} {item.last_name}
                </td>
                <td className="px-4 py-4 text-gray-700">{item.lead_title}</td>
                <td className="px-4 py-4 text-gray-500">{item.createdAt}</td>
                <td className="px-4 py-4 text-gray-500">{item.lead_value}</td>
                <td className="px-4 py-4 text-gray-500">
                  {item?.users?.slice(0, 3).map((user, p) => (
                    <img
                      key={p}
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${user.image}`}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full inline-block"
                    />
                  ))}
                  {item?.users?.length > 3 && (
                    <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-gray-300 text-sm font-bold">
                      :
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-gray-500">{item.phone}</td>
                <td className="px-4 py-4 text-gray-500">{item.leadStatusname}</td>
                <td className="px-4 py-4 flex space-x-3 text-gray-400">
                  <a target="_blank" href={`tel:${item.phone}`}><Phone size={20} /></a>
                  <a target="_blank" href={`https://wa.me/${item.phone}`}><MessageSquareText size={20} /></a>
                  <a target="_blank" href={`mailto:${item.email}`}> <Mail size={20} /></a>
                  <EllipsisVertical size={20} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="text-center py-6 text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default List;
