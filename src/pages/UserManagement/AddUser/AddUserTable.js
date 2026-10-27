/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import "../../../App.css";

//material-ui
import { Grid } from "@material-ui/core";
import { fetchAllUsers } from "Redux/Actions/UserManagement/AddNewUserAction";

import { useDispatch } from "react-redux";
import InspectionTableData from "../InspectionAgency/InspectionTableData";
import FirmTableData from "../AddFirm/FirmTableData";
import BasicTabs from "components/Tab";


export default function AddUserTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const getData = () => {
    setLoading(true);
    dispatch(fetchAllUsers())
      .then((res) => {
        setRecords(
          res.map((el, i) => ({
            ...el,
            activeValue: el?.active,
            gender: el?.genderName === "F" ? "Female" : el?.genderName === "M" ? "Male" : "Others",
          }))
        );
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getData();
  }, []);
  const tabList = [
    { label: "OLF", component: <FirmTableData /> },
    { label: "Inspection Agency", component: <InspectionTableData /> },
  ];

  return (
    <>
      <Grid>
        <BasicTabs tabList={tabList} />
      </Grid>

      {/* <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <AddUserForm
            fetch={() => {
              getData();
              setIsEditMode(false);
            }}
            userDetails={userDetails}
            isEditMode={isEditMode}
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
                    startIcon={<Edit />}
                  >
                    Edit
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  const data = {
                    ...rowData,
                    active: rowData?.activeStatus,
                  };
                  setIsEditMode(true);
                  setUserDetails(data);
                },
              },
            ]}
          // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid> */}
    </>
  );
}
