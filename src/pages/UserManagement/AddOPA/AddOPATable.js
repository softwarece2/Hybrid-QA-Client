import React, { useEffect, useState } from "react";
import "../../../App.css";
import { getAllOpa } from "pages/Services/URLs";
//pages

//component
import TableComponent from "components/table/index";

//material-ui
import {  Grid } from "@material-ui/core";
import AddOPAForm from "./AddOPAForm";
import axiosInstance from "pages/Services/AxiosInstance";
import Active from "components/Active";
import InActive from "components/InActive";
import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "components/ActionButton";


export default function AddIndenterTable() {
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opaObj, setopaObj] = useState({});
  const [columns] = useState([
    {
      title: "OPA Name",
      field: "opaName",
      width: "auto",
      filtering: true,
    },
    {
      title: "Short Name",
      field: "opashortName",
      width: "auto",
      filtering: true,
    },
    {
      title: "Address",
      field: "opaAddress",
      width: "auto",
      filtering: true,
    },
    {
      title: "Status",
      field: "opaStatus",
      width: "auto",
      filtering: false,
    },
  ]);

  const fetchOpa = () => {
    setLoading(true);
    axiosInstance
      .get(getAllOpa)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            // statusVal: el?.status,
            opaStatusValue: el?.opaStatus,
            opaStatus: el?.opaStatus === "true" ? <Active /> : el?.opaStatus === "false" ? <InActive /> : null,
          }))
        );
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOpa();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <AddOPAForm fetch={fetchOpa} opaDetails={opaObj} />
        </Grid>

        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            // options={{ filtering: false, sorting: false }}
            actions={[
              {
                icon: () => (
                  <ActionButton
                    variant="contained"
                    size="small"
                    color="secondary"
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  // opaEdit(rowData.id);
                  const data = {
                    ...rowData,
                    opaStatus: rowData?.opaStatusValue ? "1" : "0",
                  };
                  setopaObj(data);
                  console.log("opaObj", data);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
