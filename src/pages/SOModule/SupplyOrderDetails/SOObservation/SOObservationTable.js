/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../../../App.css";

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid, makeStyles } from "@material-ui/core";
import Button from "components/Button";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { useDispatch, useSelector } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";

//icons
import MButton from "@material-ui/core/Button";
import { poObservationEmpId, poObservationSalesGroup } from "pages/Services/URLs";
import POObservationTable from "../../../Enclosures/Enclosure2C/POObservationTable";
import { USER_ROLE_ID } from "../../../../Globals";

const useStyles = makeStyles((theme) => ({
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

export default function SOObservationTable() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  
  const salesGrpId = useSelector((store) => store.loggedInUser?.salesGrpId);
  const EmpId = useSelector((store) => store.loggedInUser?.empId);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const [loading, setLoading] = useState(false);

  const [columns] = useState([
    { title: "SO Number", field: "soOrderNo", width: "auto" },
    { title: "SBU", field: "salesGroupName", width: "auto" },
    { title: "Project Name", field: "projectName", width: "auto" },
    { title: "SO/PO Date", field: "soDate", width: "auto", filtering: true },
    { title: "OBS Created Date", field: "createdDatetime", width: "auto" },
    { title: "OBS Closure Date", field: "closureDate", width: "auto" },
    { title: "Status", field: "status", width: "auto" },
  ]);

  const fetchSO = () => {
    setLoading(true);
    axiosInstanceT
      .get( user_role === 7 ? poObservationEmpId +EmpId:poObservationSalesGroup + salesGrpId  )
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            soOrderNo: el?.soOrderNo,
            // soDate: el?.soDate ? moment(el?.soDate).format("DD-MM-yyyy") : "NA",
            closureDate: el?.closureDate ? el?.closureDate?.split(" ")[0] : "",
            createdDatetime: el?.createdDatetime ? el?.createdDatetime.split(" ")[0] : "",
            status: el?.status.includes("Closed") ? (
              <MButton
                style={{
                  color: "#1b5e20",
                  backgroundColor: "#c8e6c9",
                }}
                size="small"
                classes={{
                  disabled: classes.disable,
                  root: classes.root,
                }}
              >
                {el.status}
              </MButton>
            ) : el?.status.includes("Submitted") ? (
              <MButton
                style={{
                  color: "#000000",
                  backgroundColor: "#F5DEB3",
                }}
                size="small"
                classes={{
                  disabled: classes.disable,
                  root: classes.root,
                }}
              >
                {el.status}
              </MButton>
            ) : el?.status.includes("Created") ? (
              <MButton
                style={{ color: "#cb0000", backgroundColor: "#ff7d654d" }}
                size="small"
                classes={{
                  disabled: classes.disable,
                  root: classes.root,
                }}
              >
                {el.status}
              </MButton>
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
    fetchSO();
    console.log("inside sbu so import");
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={[
              {
                icon: () => (
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    // onClick={() => dispatch(selectItem(<CheckScrutinyTable soObj={rowData}/>))}
                  >
                    Observation
                  </Button>
                ),
                onClick: (event, rowData) => {
                  dispatch(selectItem(<POObservationTable rowData={rowData} />));
                },
              },
            ]}
            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}
