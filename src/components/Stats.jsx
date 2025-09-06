import React from "react";

const Stats = ({ leadStatus }) => {
  // Aggregate lead_value and count per status_name
  const aggregatedStats = leadStatus.map(status => {
    const totalLeadAmount = status.cards.reduce(
      (sum, card) => sum + Number(card.lead_value || 0),
      0
    );

    return {
      status_name: status.status_name,
      total: totalLeadAmount,
      count: status.cards.length,
      color: status.color || "#cccccc",
    };
  });

  return (
    <section className="h-fit p-4 grid  grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 bg-background-secondary ">
      {aggregatedStats.map((item, i) => (
        <div
          key={i}
          className="p-4 bg-white rounded-lg shadow flex flex-col justify-between"
        >
          <div>
            <p className="text-2xl font-bold">${item.total.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">
              {item.status_name} - {item.count}
            </p>
          </div>
          <div className="mt-4 h-1 w-full rounded-full" style={{ backgroundColor: item.color }} />
        </div>
      ))}
    </section>

  );
};

export default Stats;
