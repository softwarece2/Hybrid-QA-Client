/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import "../../App.css";
import { useSelector } from "react-redux";
import { WING_ID } from "../../../Globals";
import TableComponent from "components/table/index";
import { Grid,Typography } from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstance";
import { useDispatch } from "react-redux";
import Button from "components/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import { toast } from "react-toastify";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { Dialog } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import AutoCompleteNew from "components/AutoCompleteNew";
import { getSubDcqaoBySubRoleUrl} from "pages/Services/URLs";
import { getAllotoljc, saveAllotDatajcOl } from "Redux/Actions/Allotjc/AllotjcolAction";
import ActionButton from "components/ActionButton";
import { PaperComponent } from "Utils/D3Tree";


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
});

export const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, id, ...other } = props;
  return (
    <MuiDialogTitle id={id} disableTypography className={classes.root} {...other}>
      <Typography align="left" color="primary" style={{ fontSize: "0.875rem" }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton size="small" className={classes.closeButton} onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function AllotJcOL() {

  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [empVal, setEmpVal] = useState(null);
  const [idVal, setIdVal] = useState(null);
  const [olDetails, setOlDetails] = useState("");
  const [List, setList] = useState([]);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const {
    control,
  } = useForm({
    mode: "onChange",
  });

  const [columns] = useState([
    { title: "SO Number", field: "soNumber", width: "auto" },
    { title: "QACL Number", field: "olNumber", width: "auto" } ,
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
    { title: "Dcqao Officer Name", field: "inspectorName", width: "auto" },
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
  const getSubDcqaoBySubRole = (empId) => {
    axiosInstance
      .get(getSubDcqaoBySubRoleUrl + `${loggedInUser?.empId}`)
      .then((res) => setList(res?.data))
      .catch((err) => console.log("error in getSubDcqaoBySubRole" + err));
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
            inspectorName: el?.dcqaoName ? (
              el?.dcqaoName
            ) : (
              <ActionButton
                size="small"
                color="primary"
                variant="contained"
                startIcon={<SupervisorAccountIcon />}
                onClick={(e) => {
                  handleClickOpen(e);
                  setIdVal(el?.id);
                  getSubDcqaoBySubRole(el?.id);
                  setOlDetails(el);
                }}
              >
                Allot1
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
      dcqaoId: empVal,
    };
    dispatch(saveAllotDatajcOl(value))
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

        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
       
          />
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
          PaperComponent={(props) => <PaperComponent id="draggable-dialog-title23" {...props} />}
        >
          <DialogTitle>
            <span style={{ color: "#4A4A4A", cursor: "move" }} id="draggable-dialog-title23">
              Allot Dcqao
            </span>
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
                  <b>QACL Number&nbsp;:&nbsp;</b>
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
                      labelText="Select DCQAO"
                      data={List}
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
