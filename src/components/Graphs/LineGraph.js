import React from "react";
import { Line } from "react-chartjs-2";

export default function LineChart(props) {
  const { dataLine } = props;

  return (
    <div style={{ height: 305, paddingBottom: "1%", paddingTop: "1.5%" }}>
      <Line
        height={200}
        data={dataLine}
        options={{
          plugins: {
            legend: {
              display: true,
              position: "right",
              fontSize: "14px",
              labels: {
                boxWidth: 10,
                boxHeight: 10,
              },
            },
          },
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
