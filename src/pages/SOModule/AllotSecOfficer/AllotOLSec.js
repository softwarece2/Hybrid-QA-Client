/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import "../../../App.css";
import { useSelector } from "react-redux";

// //globals
// import { USER_ROLE_ID } from "../../../Globals";
import { WING_ID } from "../../../../Globals";
//pages
import { getAllOfferLetters, getInspectors,  saveAllotDataOL } from "Redux/Actions/SupplyOrder/SOAction";
//component
import TableComponent from "components/table/index";

//material-ui
import { DialogTitle, Grid, makeStyles, Typography } from "@material-ui/core";
// import axiosInstance from "pages/Services/AxiosInstance";
import { useDispatch } from "react-redux";
import Button from "components/Button";
import { toast } from "react-toastify";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import AutoCompleteNew from "components/AutoCompleteNew";
// import WorkLoadAssesment from "pages/Enclosures/Enclosure16/WorkLoadAssessment";
// import { selectItem } from "Redux/Actions/SelectTreeItem";
// import OLWorkLoadAssessment from "pages/Enclosures/Enclosure16/OLWorkLoadAssessment";
import ActionButton from "components/ActionButton";
import { PaperComponent } from "Utils/D3Tree";
// import { fetchAllInspectSO } from "Redux/Actions/Notifications/InspectSOAction";

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
}));

export default function AllotOLSec() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const [open, setOpen] = useState(false);
  const [empVal, setEmpVal] = useState(null);
  const [idVal, setIdVal] = useState(null);
  const [olDetails, setOlDetails] = useState("");
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const inspectorData = useSelector((store) => store.soReducer.inspectorDetails);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const {
    // handleSubmit,
    // reset,
    control,
    // setValue,
    // getValues,
    // formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm({
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [columns] = useState([
    { title: "SO Number", field: "soNumber", width: "auto" },
    isArmy
      ? { title: "QACL Number", field: "name", width: "auto" }
      : { title: "OL Number", field: "name", width: "auto" },
    {
      title: "Offer Date",
      field: "offerDate",
      width: "auto",
      filtering: true,
    },
    {
      title: "Project Description",
      field: "projectName",
      width: "auto",
      sorting: true,
    },
    { title: "Eqpt groups", field: "sbuName", width: "auto" },
    // { title: "Inspector Name", field: "inspectorName", width: "auto" },
    { title: "Section Officer Name", field: "inspectorName", width: "auto" },
    // { title: "FCM", field: "precedence", width: "auto" },
    // { title: "FCL", field: "precedence", width: "auto" },
    // { title: "Work Load", field: "WorkLoad", width: "auto" },
    {
      title: "Actions",
      field: "precedence",
      width: "auto",
      filtering: false,
      sorting: false,
    },
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchAllotOL = () => {
    setLoading(true);
    dispatch(getAllOfferLetters(orgId))
      .then((res) => {
        setRecords(
          res.map((el, i) => ({
            ...el,
            soNumber: el?.soNumber,
            projectName: el?.projectName,
            inspectorName:
              el?.inspectorName === null ? (
                <ActionButton
                  size="small"
                  color="primary"
                  variant="contained"
                  startIcon={<SupervisorAccountIcon />}
                  onClick={(e) => {
                    handleClickOpen(e);
                    setIdVal(el?.id);
                    dispatch(getInspectors());
                    setOlDetails(el);
                  }}
                >
                  Allot
                </ActionButton>
              ) : (
                el?.inspectorName
              ),

            // WorkLoad: (
            //   <ActionButton
            //     variant="outlined"
            //     size="small"
            //     color="secondary"
            //     onClick={() => dispatch(selectItem(<OLWorkLoadAssessment />))}
            //     // onClick={() => setOpen(true)}
            //   >
            //     Work Load
            //   </ActionButton>
            // ),
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
    fetchAllotOL();
  }, []);

  const handleAllot = () => {
    const value = {
      id: idVal,
      employeeId: empVal,
    };
    dispatch(saveAllotDataOL(value))
      .then((res) => {
        if (res.status === 201) {
          setOpen(false);
          fetchAllotOL();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        {/* <Grid item xs={12} sm={12} md={11} lg={12} xl={12}></Grid> */}

        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
          // options={{ filtering: false, sorting: false }}
          />
        </Grid>
        {/* <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          fullWidth
          maxWidth='md'
        >
          <DialogTitle className={classes.DialogTitle}>
            Allot Inspector For OL
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1} style={{ marginTop: "15px" }}>
              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>SO Number&nbsp;:&nbsp;</b>
                  {olDetails?.soNumber}
                </Typography>
              </Grid>

              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>OL Number&nbsp;:&nbsp;</b>
                  {olDetails?.name}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={1} style={{ marginTop: "15px" }}>
              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>Offer Date&nbsp;:&nbsp;</b>
                  {olDetails?.offerDate}
                </Typography>
              </Grid>

              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>Project Name&nbsp;:&nbsp;</b>
                  {olDetails?.projectName}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={0} style={{ marginTop: "30px" }}>
              <Grid item xs={12} sm={8}>
                <Controller
                  name='supplyOrderId'
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <AutoCompleteNew
                      labelText='Select Inspector'
                      data={inspectorData}
                      getOptionLabel={(o) => o.ename}
                      onChange={(e, v) => {
                        onChange(v);
                        setEmpVal(v?.id);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              size='small'
              color='primary'
              variant='contained'
              startIcon={<SupervisorAccountIcon />}
              onClick={handleAllot}
            >
              Allot
            </Button>
            <Button
              size='small'
              color='secondary'
              variant='contained'
              startIcon={<SupervisorAccountIcon />}
              onClick={handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
          PaperComponent={(props) => <PaperComponent id="draggable-dialog-title28" {...props} />}
        >
          <DialogTitle className={classes.DialogTitle} style={{ cursor: "move" }} id="draggable-dialog-title28">
            Allot Section Officer For {isArmy ? "QACL" : "OL"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1} style={{ marginTop: "15px" }}>
              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>SO Number&nbsp;:&nbsp;</b>
                  {olDetails?.soNumber}
                </Typography>
              </Grid>

              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>{isArmy ? "QACL" : "OL"} Number&nbsp;:&nbsp;</b>
                  {olDetails?.name}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={1} style={{ marginTop: "15px" }}>
              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>Offer Date&nbsp;:&nbsp;</b>
                  {olDetails?.offerDate}
                </Typography>
              </Grid>

              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>Project Name&nbsp;:&nbsp;</b>
                  {olDetails?.projectName}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={0} style={{ marginTop: "30px" }}>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="supplyOrderId"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <AutoCompleteNew
                      labelText="Select Section Officer"
                      data={inspectorData}
                      getOptionLabel={(o) => o.ename}
                      onChange={(e, v) => {
                        onChange(v);
                        setEmpVal(v?.id);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              startIcon={<SupervisorAccountIcon />}
              onClick={handleAllot}
            >
              Allot
            </Button>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              startIcon={<SupervisorAccountIcon />}
              onClick={handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
