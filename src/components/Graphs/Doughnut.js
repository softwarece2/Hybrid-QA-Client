import { Typography } from "@material-ui/core";
import React from "react";
import { Doughnut } from "react-chartjs-2";

export default function DoughnutChart(props) {
  const { value } = props;
  return (
    <div
      style={{
        minHeight: 200,
        
        borderRadius: "16px",
      }}
    >
      {value ? (
        <Doughnut
          height={200}
          data={value}
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
      ) : (
        <div style={{ minHeight: 200 }}>
          <Typography>Not Available</Typography>
        </div>
      )}
    </div>
  );
}
