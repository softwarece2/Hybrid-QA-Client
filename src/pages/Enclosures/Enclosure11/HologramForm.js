/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";

//material-ui
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  Grid,
  LinearProgress,
  makeStyles,
  Table,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import {
  default as MuiDialogActions,
  default as MuiDialogContent,
} from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import TextField from "../../../components/TextField";
import { WING_ID } from "../../../Globals";
//icons

//pages
import Button from "components/Button";
import useTable from "components/UseTable";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateHologramDetails } from "Redux/Actions/SupplyOrder/OLAction";
import {

  getLIdetails,
} from "Redux/Actions/SupplyOrder/SOAction";
import { DialogTitle, StyledTableCell } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  padding: {
    [theme.breakpoints.down("sm")]: {
      padding: "4px 0px 8px 8px",
    },
    [theme.breakpoints.down("lg")]: {
      // padding: "4px 0px 8px 8px",
    },
  },
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  heading: {
    fontSize: "0.875rem",
    fontWeight: 400,
  },
  value: {
    fontSize: "0.875rem",
  },
  text: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: theme.palette.secondary.main,
  },
  buttonProgress: {
    color: "white",
  },
}));


const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { label: "Sl No", field: "partNo", align: "left", disableSorting: true },
  { label: "Line Item/ Indent Sl No.", align: "left", disableSorting: true },
  { label: "Part No", field: "partNo", align: "left", disableSorting: true },
  {
    label: "Offered Qty",
    field: "offeredQty",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Consignee Name",
    field: "consigneeName",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Description",
    field: "description",
    align: "left",
    disableSorting: true,
  },
  {
    id: "totalClaimedAmount",
    field: "remarks",
    label: "HOLOGRAM REMARKS",
    align: "left",
    disableSorting: true,
  },
];
const defaultValues = {
  remarks: "",
};

export default function HologramForm({ olIds, OlData, open, setOpen }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // const [open, setOpen] = React.useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [disable, setDisable] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  // console.log("this ", getValues());
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const handleClose = () => {
    setOpen(false);
  };
  const {

    TblHead,
 
   
  } = useTable(records, headCells);
  const {

    
    handleSubmit,

    getValues,
    setValue,
    control,
   
  } = useForm({
    defaultValues,
    mode: "onChange",
    
  });
  const { fields} = useFieldArray({
    control,
    name: "lineItemDataDet",
  });

  const fetchLI = () => {
    setLoading(true);
  
    console.log("ejgwuieg", loading);
    dispatch(getLIdetails(olIds))
      .then((data) => {
        setRecords(data);
        console.log("ejgwuieg", records);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  console.log("this is get", loading);
  React.useEffect(() => {
    fetchLI();
    console.log("this is", loading);
  }, []);
  const onFormSubmit = (data) => {
    setLoadingDraft(true);
    const value = {
      // olIds: olIds,
      hologramDtos: data?.lineItemDataDet?.map((item) => ({
        olLineItemId: item.id,
        hologramRemarks: item.remarks,
      })),
    };
    console.log("ehjehhe", value);
    dispatch(updateHologramDetails(value))
      .then(() => {
        setOpen(false);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoadingDraft(false));
  };
  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item.id,
      hologramRemarks: item.hologramRemarks,
      soLineItemNo: item.soLineItemNo,
      description: item.description,
      offeredQty: item.offeredQty,
      partNo: item.partNo,
      consigneeName: item.consigneeName,
    }));
    setValue("lineItemDataDet", MappedData);
    setDisable(
      getValues("lineItemDataDet")?.some(
        (e) => e?.hologramRemarks === null || ""
      )
    );
    console.log("-----------", MappedData);
  }, [records, setValue]);
  console.log(loading, "loading");
  console.log(
    "thierfers ",
    getValues("lineItemDataDet")?.some((e) => e?.soLineItemNo !== null)
  );

  return (
    <>
      
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        maxWidth="lg"
        fullWidth
        open={open}
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title**" {...props} />
        )}
      >
        <DialogTitle
          // id="customized-dialog-title"
          style={{ position: "sticky", top: 0, zIndex: 2, cursor: "move" }}
          onClose={handleClose}
          id="draggable-dialog-title**"
        >
          {isArmy ? "QACL" : "Offering Letter"} Details:
        </DialogTitle>

        <DialogContent dividers style={{ position: "relative" }}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              align="left"
              style={{ margin: "auto", overflowX: "auto" }}
            >
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    root: classes.cardHeader,
                    title: classes.cardTitle,
                  }}
                  style={{ textAlign: "left" }}
                  disableTypography
                  title={
                    <Typography className={classes.heading}>
                      {isArmy ? "QACL" : "OL"} Details
                    </Typography>
                  }
                />
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                      <Typography className={classes.text}>
                        {" "}
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>
                          {isArmy ? "QACL" : "OL"} Number :
                        </span>{" "}
                        {OlData?.olNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                      <Typography className={classes.text}>
                        {" "}
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>
                          {isArmy ? "QACL" : "OL"} Date :
                        </span>{" "}
                        {moment(OlData?.olDate).format("DD-MM-YYYY")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                      <Typography className={classes.text}>
                        {" "}
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>
                          Project Name :
                        </span>{" "}
                        {OlData?.projectDescription}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              align="center"
              style={{ margin: "auto", overflowX: "auto" }}
            >
              
              <TableContainer style={{ maxHeight: "600px" }}>
                {loading && <LinearProgress />}
                <Table
                  style={{
                    position: "relative",
                    border: "1px solid lightgrey",
                  }}
                  size="small"
                  aria-label="simple table"
                  id="data-table-cleanliness-report"
                >
                  <TblHead />
                  {fields?.map((input, index) => (
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.value}>
                          {index + 1}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.value}>
                          {" "}
                          {input?.soLineItemNo}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.value}>
                          {input?.partNo}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.value}>
                          {input?.offeredQty}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.value}>
                          {input?.consigneeName}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.value}>
                          {" "}
                          {input?.description}
                        </Typography>
                      </StyledTableCell>

                      {!disable ? (
                        <StyledTableCell className={classes.tableCell}>
                          <Typography className={classes.value}>
                            {input?.hologramRemarks}
                          </Typography>
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell
                          className={classes.tableCell}
                          style={{ padding: 10 }}
                        >
                          <Controller
                            name={`lineItemDataDet[${index}].remarks`}
                            control={control}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <TextField
                                  size="small"
                                  onChange={onChange}
                                  placeholder="Enter the Hologram Remarks"
                                  value={value}
                                />
                              );
                            }}
                          ></Controller>{" "}
                        </StyledTableCell>
                      )}
                    </TableRow>
                  ))}
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit(onFormSubmit)}
            text="Print"
            variant="contained"
            color="primary"
            disabled={!disable}
          >
            {loadingDraft && (
              <CircularProgress
                size={24}
                className={classes.buttonProgress}
                // color="white"
              />
            )}
            Submit
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(false)}
            type="submit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
