import React from "react";
import { Bar } from "react-chartjs-2";

export default function BarChart(props) {
  const { value } = props;

  return (
    <div
      style={{
        height: 200,
        
        borderRadius: "16px",
      }}
    >
      <Bar
        height={200}
        data={value}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          responsive: true,
          maintainAspectRatio: false,

          datalabels: {
            display: true,
            color: "white",
          },
        }}
      />
    </div>
  );
}
