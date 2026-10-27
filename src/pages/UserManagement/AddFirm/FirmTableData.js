/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import TableComponent from "components/table/index";

//material-ui
import {  Grid } from "@material-ui/core";
import Active from "components/Active";
import InActive from "components/InActive";
import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "components/ActionButton";
import { useDispatch } from "react-redux";
import { getListByOrgTypeId} from "Redux/Actions/UserManagement/AddNewUserAction";
import AddFirmForm from "./AddFirmForm";

const columns = [
    {
      title: "Employee Name",
      field: "ename",
    },
    {
      title: "Department Type",
      field: "deptTypeName",
    },
     {
      title: "Department",
      field: "departmentName",
    },
    {
      title: "Role Name",
      field: "roleName",
    },
    {
      title: "Username",
      field: "username",
    },
    {
      title: "Reporting To",
      field: "reportingOfficerName",
    },
    {
      title: "Gender",
      field: "gender",
    },
    {
      title: "Status",
      field: "activeStatus",
      width: "auto",
      filtering: false,
    },
  ];
  

export default function FirmTableData() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const orgTypeId = 2;
  const [selectedUser, setSelectedUser] = useState({});
  

  const getUsers = () => {
    setLoading(true);
    dispatch(getListByOrgTypeId(orgTypeId))
      .then((res) => {
        setRecords(res.map((el, i) => ({
          ...el,
          activeValue: el?.active,
          activeStatus: el?.activeStatus === "true" ? <Active /> : el?.activeStatus === "false" ? <InActive /> : null,
          gender: el?.genderName === "F" ? "Female" : (el?.genderName === "M" ? "Male" : "Others"),
          activeStatusOriginal: el.activeStatus

        })));
      }).catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <AddFirmForm refresh={getUsers} selectedUser={selectedUser} />
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
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  const data = {
                    ...rowData,
                    active: rowData?.activeValue ? "1" : "0",
                  };
                  setSelectedUser(data);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
