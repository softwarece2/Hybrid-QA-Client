/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../App.css";
//component
import ActionButton from "components/ActionButton";
import TableComponent from "components/table/index";

//material-ui
import { Grid, makeStyles } from "@material-ui/core";

//redux
import MButton from "@material-ui/core/Button";
import { selectItem } from "Redux/Actions/SelectTreeItem";

import { useDispatch } from "react-redux";

import { getGccPos } from "Redux/Actions/Enclosure/INoteAction";
import moment from "moment";
import CreateGcs from "./CreateGcs.js/CreateGcs";


//icons

const useStyles = makeStyles((theme) => ({
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  DialogTitle: {
    backgroundColor: "#205375",
    color: "white",
    padding: "4px",
    zIndex: 1,
  },
  disable: {
    color: "grey !important",
  },
  root: {
    borderRadius: 4,
    height: 25,
    textTransform: "none",
    cursor: "default",
  },
}));

export default function GCCTable() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
 const salesGrpId=useSelector((store) => store.loggedInUser?.salesGrpId);

  const [columns] = useState([
     { title: "SO Number", field: "supplyOrderNo", width: "auto" },
    {
      title: "SBU",
      field: "salesGroupName",
      width: "auto",
      filtering: true,
    },

    { title: "Project Name", field: "projectName", width: "auto" },
    { title: "Supply Order Date", field: "supplyOrderDate", width: "auto" },
   
  ]);

  const fetchAllotOL = () => {
    setLoading(true);
    if(salesGrpId){
    dispatch(getGccPos(salesGrpId))
      .then((res) => {
        setRecords(
          res.map((el, i) => ({
            ...el,
            projectName: el?.projectName	,
            soNumber: el?.supplyOrderNo,
            salesGroupName: el?.salesGrpName,
            supplyOrderDate:moment(el?.supplyOrderDate).format("DD-MM-YYYY"),
            inoteStatus:
              el?.inoteStatus === "Issued" ? (
                <MButton
                  style={{ color: "#1b5e20", backgroundColor: "#c8e6c9" }}
                  size="small"
                  classes={{
                    disabled: classes.disable,
                    root: classes.root,
                  }}
                >
                  Issued
                </MButton>
              ) : el?.inoteStatus === "Pending" ? (
                <MButton
                  style={{
                    color: "#cb0000",
                    backgroundColor: "#ff7d654d",
                  }}
                  size="small"
                  classes={{
                    disabled: classes.disable,
                    root: classes.root,
                  }}
                >
                  Pending
                </MButton>
              ) : null,
          }))
        );
        // const isFormIv = res.inoteTypeId === 2 ? true : false;
        // setButtonVisible(isFormIv);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });}
     
  };

  useEffect(() => {
    fetchAllotOL();
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
              (rowData) => ({
                icon: () => (
                  <ActionButton
                    variant="contained"
                    size="small"
                    color="secondary"
                    // disabled={!rowData?.inoteTypeId || rowData?.inoteTypeId === 2}
                    onClick={() => {
                      dispatch(selectItem(<CreateGcs soId={rowData?.id} />));
                    }}
                  >
                 GCS
                  </ActionButton>
                ),
                // onClick: (event, rowData) => {
                //   dispatch(selectItem(<InspectionTestCertificate olId={rowData?.id} />));
                // },
              }),
          
            ]}
            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}
