import {
  Button,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import moment from "moment";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import React, { useEffect, useState } from "react";
import ClothInspection from "./ClothInspection";
import { AntSwitch } from "../bel-bg-complex";
export const useStyles = makeStyles((theme) => ({
  pass: {
    backgroundColor: "green",
    color: "white",
    width: "50px",
    border: "none",
    "&:hover, &:focus": {
      backgroundColor: "green",
      color: "white",
      width: "50px",
      border: "none",
    },
  },
  na: {
    backgroundColor: "grey",
    color: "white",
    width: "50px",
    border: "none",
    "&:hover, &:focus": {
      backgroundColor: "grey",
      color: "white",
      width: "50px",
      border: "none",
    },
  },
  fail: {
    backgroundColor: "red",
    color: "white",
    width: "50px",
    border: "none",
    "&:hover, &:focus": {
      backgroundColor: "red",
      color: "white",
      width: "50px",
      border: "none",
    },
  },
}));

export default function TCLAVADI({ firm, handleBack }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [isChartView, setIsChartView] = useState(false);
  const fetchClothInspectionTestVales = () => {
    setLoading(true);
    axiosInstance("McdpResult/getAll")
      .then(({ data }) => {
        setRecords(data);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClothInspectionTestVales();
  }, []);
  return (
    <>
      <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
        <Button
          onClick={handleBack}
          size="small"
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Typography
          style={{ flex: 1, marginBottom: "18px" }}
          variant="h5"
          color="secondary"
          align="center"
        >
          {firm?.orgName}
        </Typography>

        <div>
          <span>Data View</span>
          <AntSwitch
            checked={isChartView}
            onChange={(e) => setIsChartView(e.target.checked)}
            name="dataViewSwitch"
          />
          <span>Chart View</span>
        </div>
      </div>

      {loading && <LinearProgress />}
      {isChartView ? (
        <ClothInspection data={records}/>
      ) : (
        <table
          style={{
            border: "1px solid",
            borderCollapse: "collapse",
            borderRadius: 8,
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <td
                style={{
                  border: "1px solid",
                  padding: "6px 12px",
                  textAlign: "center",
                }}
                colSpan={10}
              >
                <b>Summary Data</b>
              </td>
            </tr>

            <tr
              style={{
                textAlign: "center",
              }}
            >
              <td
                style={{
                  border: "1px solid",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0px 4px 0px 4px",
                }}
              >
                S.NO.
              </td>
              <td
                style={{
                  border: "1px solid",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0px 4px 0px 4px",
                }}
              >
                Ol Number
              </td>
              <td
                style={{
                  border: "1px solid",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0px 4px 0px 4px",
                }}
              >
                Sample Name
              </td>
              <td
                style={{
                  border: "1px solid",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0px 4px 0px 4px",
                }}
              >
                Size
              </td>
              <td
                style={{
                  border: "1px solid",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0px 4px 0px 4px",
                }}
              >
                No. of Passed Parameter
              </td>
              <td
                style={{
                  border: "1px solid",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0px 4px 0px 4px",
                }}
              >
                No. of Failed Parameter
              </td>
              <td
                style={{
                  border: "1px solid",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0px 4px 0px 4px",
                }}
              >
                No. of Parameter Not Checked
              </td>
              <td
                style={{
                  border: "1px solid",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0px 4px 0px 4px",
                }}
              >
                Final Result
              </td>

              <td
                style={{
                  border: "1px solid",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0px 4px 0px 4px",
                }}
              >
                Tested On
              </td>
            </tr>

            {records?.map((row, index) => (
              <tr style={{ textAlign: "center" }}>
                <td
                  style={{
                    border: "1px solid",
                    fontSize: "0.875rem",
                    padding: "0px 4px 0px 4px",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    border: "1px solid",
                    fontSize: "0.875rem",
                    padding: "0px 4px 0px 4px",
                  }}
                >
                  {row.olNo}
                </td>
                <td
                  style={{
                    border: "1px solid",
                    fontSize: "0.875rem",
                    padding: "0px 4px 0px 4px",
                  }}
                >
                  {row.sampleName}
                </td>
                <td
                  style={{
                    border: "1px solid",
                    fontSize: "0.875rem",
                    padding: "0px 4px 0px 4px",
                  }}
                >
                  {row?.size === "0" ? "S" : row.size}
                </td>
                <td
                  style={{
                    border: "1px solid",
                    fontSize: "0.875rem",
                    padding: "0px 4px 0px 4px",
                  }}
                >
                  {row.noOfPassed}
                </td>
                <td
                  style={{
                    border: "1px solid",
                    fontSize: "0.875rem",
                    padding: "0px 4px 0px 4px",
                  }}
                >
                  {row.noOfFailed}
                </td>
                <td
                  style={{
                    border: "1px solid",
                    fontSize: "0.875rem",
                    padding: "0px 4px 0px 4px",
                  }}
                >
                  {row.noOfNA}
                </td>

                <td
                  style={{
                    border: "1px solid",
                    fontSize: "0.875rem",
                    padding: "0px 4px 0px 4px",
                  }}
                >
                  {row.noOfPassed === 18 ? (
                    <button className={classes.pass}>Pass</button>
                  )  : (
                    <button className={classes.fail}>Fail</button>
                  )}
                </td>
                <td
                  style={{
                    border: "1px solid",
                    fontSize: "0.875rem",
                    padding: "0px 4px 0px 4px",
                    width: "100px",
                  }}
                >
                  {moment(row?.createdDateTime).format("DD-MM-YYYY")}
                </td>
              </tr>
            ))}
          </thead>
        </table>
      )}
    </>
  );
}
