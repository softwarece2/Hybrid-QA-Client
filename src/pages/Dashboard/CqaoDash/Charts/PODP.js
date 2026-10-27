import React from "react";

//reatc-chart
import { Pie } from "react-chartjs-2";

export default function PODP() {
  let labels = [">1Y", ">3Y", ">5Y"];

  let customLabels = labels.map((label, index) => `${label}`);

  const chartdata = {
    labels: customLabels,
    datasets: [
      {
        backgroundColor: ["#83ce83", "#7991fc", "#f792b2"],
        data: [10, 20, 30],
      },
    ],
  };
  return (
    <div style={{ width: 250 }}>
      <Pie
        height={200}
        data={chartdata}
        options={{
          legend: { display: true, position: "bottom", fontSize: "20px" },

          responsive: true,
          maintainAspectRatio: false,

          datalabels: {
            display: true,
            color: "white",
          },
          tooltips: {
            backgroundColor: "#5a6e7f",
          },
        }}
      />
    </div>
  );
}
