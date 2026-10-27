import React, { useEffect, useState } from "react";
import "../../../App.css";

//pages
import SalesGroupForm from "./SalesGroupForm";

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstance";
import { getAllSalesGroups } from "pages/Services/URLs";
import InActive from "components/InActive";
import Active from "components/Active";
import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "components/ActionButton";


export default function SalesGroupTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salesgroupObj, setSalesgroupObj] = useState({});

  const [columns] = useState([
    {
      title: "SalesGroup Name",
      field: "name",
      width: "auto",
      filtering: true,
    },
    { title: "Code", field: "code", width: "auto", filtering: true },
    {
      title: "Organization",
      field: "organizationName",
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

  const fetchSalesGroup = () => {
    setLoading(true);
    axiosInstance
      .get(getAllSalesGroups)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            SalesGroupStatus: el?.active,
            active:
              el?.active === true ? (
                <Active />
              ) : el?.active === false ? (
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
    fetchSalesGroup();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <SalesGroupForm
            fetch={fetchSalesGroup}
            salesGroupDetails={salesgroupObj}
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
                    active: rowData?.SalesGroupStatus ? "true" : "false",
                  };
                  setSalesgroupObj(data);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
