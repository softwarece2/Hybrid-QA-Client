import React, { useState } from "react";
import "../../../App.css";

//pages
import AssignConsigneeForm from "./AssignConsigneeForm";

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";

//icons


export default function AssignConsigneeTable() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [columns] = useState([
    { title: "Order ID", field: "index", width: "auto", filtering: true },
    { title: "File No", field: "article", width: "auto", sorting: true },
    { title: "No of Items", field: "precedence", width: "auto" },
    { title: "Total Qty", field: "precedence", width: "auto" },
    { title: "Date Received", field: "precedence", width: "auto" },
    { title: "Indent Date", field: "precedence", width: "auto" },
    { title: "Status",  width: "auto" },
    { title: "Actions",  width: "auto" },
  ]);


  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <AssignConsigneeForm />
        </Grid>

        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
       
          />
        </Grid>
      </Grid>
    </>
  );
}
