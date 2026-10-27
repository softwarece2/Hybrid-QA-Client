/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../App.css";

//pages
//component
import TableComponent from "components/table/index";

import { WING_ID } from "../../../Globals";
//material-ui
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AutoCompleteNew from "components/AutoCompleteNew";

import Button from "components/Button";
import axiosInstance from "pages/Services/AxiosInstance";
import { Controller, useForm } from "react-hook-form";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import ActionButton from "components/ActionButton" ; 
import { getSubordinatesByEmpUrl } from "pages/Services/URLs";
import { saveAllotDCOL } from "Redux/Actions/AllotDC/AllotDcAction";
import { getAllotoljc } from "Redux/Actions/Allotjc/AllotjcolAction";
import { PaperComponent } from "Utils/D3Tree";


// }));

export default function AllotDcOL() {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [empVal, setEmpVal] = useState(null);
  const [idVal, setIdVal] = useState(null);
  const [olDetails, setOlDetails] = useState("");
  const [subordinateLists, setSubordinateLists] = useState([]);

  const loggedInUser = useSelector((store) => store.loggedInUser);

  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const {
    control,
  } = useForm({
    mode: "onChange",
  });

  const [columns] = useState([
    { title: "SO Number", field: "soNumber", width: "auto" },
    isArmy
      ? { title: "QACL Number", field: "olNumber", width: "auto" }
      : { title: "OL Number", field: "olNumber", width: "auto" },
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
    { title: "Eqpt group", field: "sbuName", width: "auto" },
    { title: "Acqao /Section Officer ", field: "inspectorName", width: "auto" },

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
  const getSubordinatesByEmpId = (empId) => {
    axiosInstance
      .get(getSubordinatesByEmpUrl + `${loggedInUser?.empId}`)
      .then((res) => setSubordinateLists(res?.data))
      .catch((err) => console.log("error in getSubordinatesByEmpId" + err));
  };

  const fetchAllotOL = () => {
    setLoading(true);
    dispatch(getAllotoljc(loggedInUser?.roleId, loggedInUser?.empId))
      .then((res) => {
        setRecords(
          res.map((el, i) => ({
            ...el,
            soNumber: el?.soNumber,
            projectName: el?.projectName,
            inspectorName: el?.secOfficerName ? (
              el?.secOfficerName
            ) : (
              <ActionButton
                size="small"
                color="primary"
                variant="contained"
                startIcon={<SupervisorAccountIcon />}
                onClick={(e) => {
                  handleClickOpen(e);
                  setIdVal(el?.id);
                  getSubordinatesByEmpId(el?.id);
                  setOlDetails(el);
                }}
              >
                Allot
              </ActionButton>
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
    fetchAllotOL();
  }, []);

  const handleAllot = () => {
    const value = {
      id: idVal,
      secOfficerId: empVal,
    };
    dispatch(saveAllotDCOL(value))
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
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
          PaperComponent={(props) => <PaperComponent id="draggable-dialog-title1$" {...props} />}
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title1$">
            Allot Inspector For {isArmy ? "QACL" : "OL"}
          </DialogTitle>
          <DialogContent dividers style={{ padding: 12, position: "relative" }}>
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
                  {olDetails?.olNumber}
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
                      labelText="Select Inspector"
                      data={subordinateLists}
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
