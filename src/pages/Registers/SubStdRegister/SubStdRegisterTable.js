import { useState } from "react";
import "../../../App.css";
//pages

//component
import TableComponent from "components/table/index";

//material-ui

import { Grid} from "@material-ui/core";
import SubStdRegisterForm from "./SubStdRegisterForm";

//icons

export default function AddIndenterTable() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columns] = useState([
    {
      title: "File No.",
      field: "fileNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "SO/PO Number",
      field: "soNumber",
      width: "auto",
      filtering: true,
    },
    {
      title: "Cross Verification By",
      field: "verifiedBy",
      width: "auto",
      filtering: true,
    },
    {
      title: "Date of Inspection",
      field: "verifiedBy",
      width: "auto",
      filtering: true,
    },
    {
      title: "Status",
      field: "status",
      width: "auto",
      filtering: false,
    },
  ]);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <SubStdRegisterForm />
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
