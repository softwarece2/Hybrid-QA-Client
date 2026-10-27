import React, { useState } from "react";
import "../../../App.css";

//pages
import UserCredentialsForm from "./UserCredentialsForm";

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";



export default function UserCredentialsTable() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [columns] = useState([
    { title: "User", field: "index", width: "auto", filtering: true },
    { title: "Rank / Designation", field: "article", width: "auto", sorting: true },
    { title: "Login ID", field: "precedence", width: "auto" },
    { title: "Actions", field: "precedence", width: "auto",  filtering: false },
   
  ]);



  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <UserCredentialsForm />
        </Grid>

        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}
