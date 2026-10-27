/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import "../../App.css";

//pages
import axiosInstance from "pages/Services/AxiosInstance";
import { getAllApplicableTestBySalesGrpId } from "pages/Services/URLs";
import ApplicableTestForm from "./ApplicableTestForm";

//component
import ActionButton from "components/ActionButton";
import Active from "components/Active";
import InActive from "components/InActive";
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";

import { useSelector } from "react-redux";

//icons
import EditIcon from "@material-ui/icons/Edit";

export default function ApplicableTestTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appTestObj, setAppTestObj] = useState({});

  const [columns] = useState([
    {
      title: "Test Name",
      field: "testName",
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
//   const user_emp = useSelector((store) => store.loggedInUser?.empId);

  const salesgrpId = useSelector((store) => store.loggedInUser?.salesGrpId);

  const fetchApplicableTestBySalesGrpId = () => {
    setLoading(true);
    if (!salesgrpId) {
      console.error("Sales Group ID is missing");
      setLoading(false);
      return;
    }
    axiosInstance
      .get(`${getAllApplicableTestBySalesGrpId}/${salesgrpId}`)
      .then(({ data }) => {
        console.log("Fetched data:", data);
        setRecords(
          data.map((el, i) => ({
            ...el,
            appTestStatusValue: el?.active,
            active:
              el?.active !== undefined ? (
                el.active ? (
                  <Active />
                ) : (
                  <InActive />
                )
              ) : (
                <Active />
              ),
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
    fetchApplicableTestBySalesGrpId();
  }, [salesgrpId]);

  return (
    <>
      <Grid container spacing={2} alignItems="center" align="center">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <ApplicableTestForm
            fetch={fetchApplicableTestBySalesGrpId}
            appTestDetails={appTestObj}
            records={records}
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
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  const data = {
                    ...rowData,
                    active: rowData?.appTestStatusValue ? "true" : "false",
                  };
                  setAppTestObj(data);
                  console.log("appTestObj", data);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
