/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import "../../../App.css";

//pages
import AddOrgForm from "./AddOrgForm";

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstance";
import {
  getAllOrganization,
} from "pages/Services/URLs";
import InActive from "components/InActive";
import Active from "components/Active";
import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "components/ActionButton";


import MuiTextField from "@material-ui/core/TextField";
export default function AddOrgTable() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orgObj, setorgObj] = useState({});
  const [edit, setEdit] = useState(false);

  const [columns] = useState([
    {
      title: "Organization Name",
      field: "organizationName",
      width: "auto",
      filtering: true,
    },
    { title: "Mobile Number", field: "mobile", width: "auto", filtering: true },
    { title: "Email Id", field: "email", width: "auto" },
    {
      title: "Organization Type",
      field: "organizationType",
      width: "auto",
      filtering: true,
    },
    {
      title: "Organization Address",
      field: "organizationAddress",
      width: "auto",
      filtering: true,
    },
    {
      title: "Status",
      field: "active",
      width: "auto",
      filtering: false,
    },
  ]);

  const fetchOrg = () => {
    setLoading(true);
    axiosInstance
      .get(getAllOrganization)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            orgStatusValue: el?.active,
            active:
              el?.active == true ? (
                <Active />
              ) : el?.active == false ? (
                <InActive />
              ) : null,
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
    fetchOrg();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={10} xl={10}>
          <AddOrgForm
            fetch={fetchOrg}
            orgDetails={orgObj}
            edit={edit}
            setEdit={setEdit}
          />
        </Grid>

        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={[
              {
                icon: () => (
                  <ActionButton
                    variant="contained"
                    size="small"
                    color="secondary"
                    text="EDIT"
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  const data = {
                    ...rowData,
                    active: rowData?.orgStatusValue ? "true" : "false",
                  };
                  setorgObj(data);
                  setEdit(true);
                  console.log("orgObj", rowData);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
