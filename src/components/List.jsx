import { ArrowDown, ArrowUp, EllipsisVertical, Mail, MessageSquareText, Minus, Percent, Phone, Plus, Square } from "lucide-react";
import React from "react";

const data = [
  {
    fullName: "Savannah Nguyen",
    date: "2025-08-30",
    managerName: "Axel Ortega",
    email: "victor.vazquez@correo.es",
    contactNo: "+34 690 123 497",
    appraisal: {
      status: "New Leads",
      color: "blue",
    },
  },

  {
    fullName: "Brooklyn Simmons",
    date: "2025-08-30",
    managerName: "Sonia Degollada",
    email: "ines.crespo@outlook.es",
    contactNo: "+34 655 678 931",
    appraisal: {
      status: "Approved",
      color: "green",
    },
  },
  {
    fullName: "Bessie Cooper",
    date: "2025-08-30",
    managerName: "Manager Name",
    email: "alejandro.castillo@correo.es",
    contactNo: "+34 612 345 619",
    appraisal: {
      status: "In Bank",
      color: "purple",
    },
  },
  {
    fullName: "Bessie Cooper",
    date: "2025-08-30",
    managerName: "Manager Name",
    email: "alejandro.castillo@correo.es",
    contactNo: "+34 612 345 619",
    appraisal: {
      status: "Rejected",
      color: "red",
    },
  },
];

const List = () => {
  return (
    <div class="overflow-x-auto bg-white rounded-md shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#F8FAFD]">
          <tr>
            <th class="px-4 py-3 ">
              <Square strokeWidth={0.25} />
            </th>

            <th class="psm text-dark px-4 py-3 text-left flex items-center gap-2">
              Full Name
            </th>
            <th class="psm text-dark px-4 py-3 text-left ">Manager Name</th>
            <th class="psm text-dark px-4 py-3 text-left w-2/12">Email ID</th>
            <th class="psm text-dark px-4 py-3 text-left ">Contact No</th>
            <th class="psm text-dark px-4 py-3 text-left ">Appraisal</th>
            <th class="psm text-dark px-4 py-3 text-left "></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {/* <!-- Row 1 --> */}
          {data.map((item, i) => (
            <tr>
              <td class="px-4 py-4 w-[50px] space-x-3">
                <Square strokeWidth={0.25} />
              </td>
              <td class="px-4 py-4 flex space-x-3">
                <div class="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-semibold">
                  A
                </div>
                <div>
                  <div className="psm text-dark ">{item.fullName}</div>
                  <div className="text-sm text-light">{item.date}</div>
                </div>
              </td>
              <td class="px-4 py-4 text-gray-700">{item.managerName}</td>
              <td class="px-4 py-4 text-gray-700">{item.email}</td>
              <td class="px-4 py-4 text-gray-500">{item.contactNo}</td>
              <td class="px-4 py-4 h-full gap-2 ">{item.appraisal.status}</td>
              <td class="px-4 py-4 text-gray-400">
                <div className="flex gap-2 justify-between">

                <Phone size={20}/>
                <MessageSquareText size={20}/>
                <Mail size={20}/>
                <EllipsisVertical size={20} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default List;
