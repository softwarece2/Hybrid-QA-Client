/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import "../../../App.css";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
//globals


//pages

//component
import TableComponent from "components/table/index";

//material-ui
import { DialogTitle, Grid, makeStyles, Typography } from "@material-ui/core";
import {
  getInspectors,
  getSupplyOrderByOrgId,
  saveAllotData,
} from "Redux/Actions/SupplyOrder/SOAction";
import moment from "moment";
import Button from "components/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,

} from "@material-ui/core";
import AutoCompleteNew from "components/AutoCompleteNew";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";


//icons
import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "components/ActionButton";
import { PaperComponent } from "Utils/D3Tree";

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

export default function AllotSOSec() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    control,
  } = useForm({

    mode: "onChange",
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [empVal, setEmpVal] = useState(null);
  const [idVal, setIdVal] = useState(null);
  const [soDetails, setSoDetails] = useState("");

  const inspectorData = useSelector(
    (store) => store.soReducer.inspectorDetails
  );
  const orgId = useSelector((store) => store.loggedInUser?.orgId);

  const [columns] = useState([
    { title: "SO Number", field: "orderNo", width: "auto" },
    {
      title: "Date and Time",
      field: "orderDate",
      width: "auto",
      filtering: true,
    },
    // { title: "Vendor Name", field: "salesGroupName", width: "auto", sorting: true },
    { title: "Section Officer Name", field: "inspectorName", width: "auto" },
    // { title: "Inspector Name", field: "inspectorName", width: "auto" },

    // { title: "Work Load", field: "WorkLoad", width: "auto", filtering: false },
    {
      title: "Actions",
      field: "actions",
      width: "auto",
      filtering: false,
      sorting: false,
    },
  ]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const fetchAllotSO = () => {
    setLoading(true);
    dispatch(getSupplyOrderByOrgId(orgId))
      .then((res) => {
        console.log("dataa", res);
        setRecords(
          res.map((el, i) => ({
            ...el,
            orderNo: el?.orderNo,
            orderDate: moment(el?.orderDate).format("DD-MM-YYYY"),
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
                    setSoDetails(el);
                  }}>
                  Allot
                </ActionButton>
              ) : (
                el?.inspectorName
              ),
            // status: (
            //   <Button size="small" className={classes.status}>
            //     Allocate
            //   </Button>
            // ),
            actions: (
              <ActionButton
                variant="contained"
                size="small"
                color="secondary"
                startIcon={<EditIcon />}
              // onClick={() => setOpen(true)}
              >
                Edit
              </ActionButton>
            ),
            // WorkLoad: (
            //   <ActionButton
            //     variant="outlined"
            //     size="small"
            //     color="secondary"
            //     onClick={() => dispatch(selectItem(<SOWorkLoadAssessment />))}
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
    fetchAllotSO();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAllot = () => {
    const value = {
      id: idVal,
      employeeId: empVal,
    };
    dispatch(saveAllotData(value))
      .then((res) => {
        //   fetch();
        if (res.status === 201) {
          setOpen(false);
          fetchAllotSO();
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
          // options={{ filtering: false, sorting: false }}
          />
        </Grid>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          PaperComponent={(props) => (
            <PaperComponent id="draggable-dialog-title29" {...props} />
          )}>
          <DialogTitle
            className={classes.DialogTitle}
            style={{ cursor: "move" }}
            id="draggable-dialog-title29">
            Allot Inspector For SO
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1} style={{ marginTop: "15px" }}>
              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>SO Number&nbsp;:&nbsp;</b>
                  {soDetails?.orderNo}
                </Typography>
              </Grid>

              <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                <Typography>
                  <b>Date&nbsp;:&nbsp;</b>
                  {moment(soDetails?.orderDate).format("DD-MM-YYYY")}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={0} style={{ marginTop: "20px" }}>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="supplyOrderId"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <AutoCompleteNew
                      labelText="Select Inspector"
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
              onClick={handleAllot}>
              Allot
            </Button>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              startIcon={<SupervisorAccountIcon />}
              onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
