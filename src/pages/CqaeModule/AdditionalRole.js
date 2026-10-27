/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";
import Active from "components/Active";
import InActive from "components/InActive";
import { useDispatch, useSelector } from "react-redux";
import { getAllAoldetailsByOrgId } from "Redux/Actions/UserManagement/AddNewUserAction";
import AODorAOL from "./AODorAOL";
import moment from "moment";


export default function AdditionalRole() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const [columns] = useState([
    {
      title: "Employee Name",
      field: "asnEmpName",
      width: "auto",
      filtering: true,
    },
    {
      title: "Assigned Role",
      field: "asnDesg",
      width: "auto",
      filtering: true,
    },
    {
      title: "Type",
      field: "type",
      width: "auto",
      filtering: true,
    },
    {
      title: "From Date",
      field: "fromDate",
      width: "auto",
      filtering: true,
    },
    {
      title: "To Date ",
      field: "toDate",
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

  const getData = () => {
     setLoading(true);
      dispatch(getAllAoldetailsByOrgId(orgId))
        .then((res) => {
          setRecords(res.map((el, i) => ({
            ...el,
            fromDate: moment(el?.fromDate).format("DD-MM-YYYY"),
            toDate: moment(el?.toDate).format("DD-MM-YYYY") ,
            active:el?.active == true ? <Active /> : el?.active == false ? <InActive /> : null
          })));
         }).catch((error) => {
          console.log("error", error);
        })
         .finally(() => setLoading(false));
    };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <AODorAOL getData={getData}
          />
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
