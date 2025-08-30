import { ArrowDown, ArrowUp, Minus, Percent, Plus } from "lucide-react";
import React from "react";

const Stat = [
  {
    title: "Nuevos clientes ",
    number: "33,493",
    trend: "up",
  },
  {
    title: "Contactados",
    number: "33,493",
    trend: "down",
  },
  {
    title: "En el banco",
    number: "33,493",
    trend: "up",
  },
  {
    title: "Aprobados",
    number: "33,493",
    trend: "down",
  },
];

const Stats = () => {
  return (
    <section className=" p-6 rounded-lg  grid grid-cols-4 gap-10 border border-stock bg-white">
      {Stat.map((item, i) => (
        <div className="flex flex-col gap-0 rounded-radius">
          <p className="pxs text-light uppercase">{item.title}</p>
          <div className="flex items-center justify-between">
            <p className="h4 font-medium my-4">{item.number}</p>
            <div
              className={`flex items-center gap-[2px] ${
                item.trend === "up" ? "text-primary" : "text-red-700"
              } `}
            >
              {item.trend === "up" ? (
                <Plus size={12} strokeWidth={3} />
              ) : (
                <Minus size={12} stock />
              )}
              <p className="psm "> 36 </p>
              <Percent size={14} />
              {item.trend === "up" ? (
                <ArrowUp size={16} strokeWidth={3} />
              ) : (
                <ArrowDown size={16} stock />
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Stats;
