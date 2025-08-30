import { ArrowDown, ArrowUp, Minus, Percent, Plus, Square } from "lucide-react";
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
            <th class="psm text-dark px-4 py-3 text-left flex items-center gap-2">
                <Square strokeWidth={.25} />
              Full Name
            </th>
            <th class="psm text-dark px-4 py-3 text-left">
              Manager Name
            </th>
            <th class="psm text-dark px-4 py-3 text-left">
              Email ID
            </th>
            <th class="psm text-dark px-4 py-3 text-left">
              Contact No
            </th>
            <th class="psm text-dark px-4 py-3 text-left">
              Appraisal
            </th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-sm">
          {/* <!-- Row 1 --> */}
          {data.map((item, i) => (
            <tr>
              <td class="px-4 py-4 flex items-center space-x-3">
                <Square strokeWidth={.25} />
                <div class="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-semibold">
                  A
                </div>
                <div>
                  <div class="psm text-gray-900">{item.fullName}</div>
                  <div class="text-xs text-gray-400">{item.date}</div>
                </div>
              </td>
              <td class="px-4 py-4 text-gray-700">{item.managerName}</td>
              <td class="px-4 py-4 text-gray-700">{item.email}</td>
              <td class="px-4 py-4 text-gray-500">{item.contactNo}</td>
              <td class="px-4 py-4 flex gap-2">
                <div class={`w-2 h-2 bg-${item.appraisal.color} bg-red-500 rounded-full font-medium`}>
                  
                </div>
                  {item.appraisal.status}
              </td>
              <td class="px-4 py-4 flex space-x-3 text-gray-400">
                <button>
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 12h16M4 18h10" />
                  </svg>
                </button>
                <button>
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v16H4V4z" />
                  </svg>
                </button>
                <button>
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
