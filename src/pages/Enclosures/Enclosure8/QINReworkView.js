/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import * as yup from "yup";

//material-ui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Table,
  TableBody,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import { headerValue } from "Globals.js";

//components
import { yupResolver } from "@hookform/resolvers/yup";
import HeaderPdf from "pages/Layout/HeaderPdf";
import {useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import {
  getQINdataByOL,
  updateQinObsNcForm,
} from "Redux/Actions/Inspect/InspectOLAction";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import useTable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/UseTable";

//icons
import { WING_ID } from "../../../Globals";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  space: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    width: "100%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "100%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },

  paper1: {
    width: "100%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "50%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },

  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
  },
}));

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },

  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "claimDate",
    label: "BEL Part no",
    align: "left",
    disableSorting: true,
  },
  {
    id: "totalClaimedAmount",
    label: "Description",
    field: "description",
    align: "left",
    disableSorting: true,
  },

  {
    // id: "ClaimedAmount",
    label: "Category",
    field: "itemCategoryName",
    align: "left",
    disableSorting: true,
  },

  {
    // id: "ClaimedAmount",
    label: "Observation",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Rework / Action",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Sub Part no",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Remarks / Item SL No",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Observation Closed",
    align: "left",
    disableSorting: true,
  },
];
const arraySchema = yup.object().shape({
  
});
const schema = yup.object().shape({
 
  array: yup
    .array()
    .of(arraySchema)
    .required("Must have fields")
    .typeError("required"),
});

export default function QINReworkView({ open, setOpen, rowData }) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [disable, setDisable] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const user = useSelector((store) => store.loggedInUser);
  const [savedData, setSavedData] = useState({});
  const [records, setRecords] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [isRemarks, setIsRemarks] = useState(false);
  const componentRef = React.useRef();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [filterFn, setFilterFn] = useState({ fn: (items) => items });

  const {
    TblContainer,
    TblHead,
  } = useTable(records, headCells, filterFn);

  const defaultArray = {
    partNo: "",
    description: "",
    itemCategoryName: "",
    closureStatus: "",
    reworkAction: "",
    observation: "",
    qinObsNcFormDets: [],
    id: "",
  };

  const defaultValues = {
    array: [defaultArray],
  };
  const {
 
    setValue,
    getValues,
   
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const fetchLI = (id) => {
    console.log("wrdjehrjehruo");
    if (id !== undefined) {
      setLoading(true);
      dispatch(getQINdataByOL(id))
        .then((data) => {
          console.log("this is function", data.qinObsNcFormDets);
          setSavedData(data);
          setRecords(data.qinObsNcFormDets);
          setDisable(
            data.isReworkSubmitted === true || user?.roleId === 9 ? false : true
          );

          setIsRemarks(
            data?.isQinClosed === null || data?.isQinClosed === false
              ? false
              : true
          );
          console.log("rjgtfreiu", isRemarks);
          console.log("erfhbwerhb", records?.isQinClosed);

          console.log("sdhgasehrfge", records);
          setLoading(false);
          // resetform(data);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
    setLoading(false);
    setRecords([]);
  };

  useEffect(() => {
    fetchLI(rowData?.id);
    //resetData();
    console.log("jahsdjh", rowData?.id);
  }, []);

  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item.id,
      olLineItemId: item.olLineItemId,
      reworkAction: item.reworkAction,
      closureStatus: item.closureStatus === true ? "true" : "false",
    }));

    setValue("array", MappedData);
    console.log("-----------", MappedData);
  }, [records, setValue]);

  const onFormSubmit = (data) => {
    console.log("records val", data.qinObsNcFormDets);
    const value = {
      id: savedData?.id,
      offerLetterId: savedData?.offerLetterId,
      modifiedBy: user?.roleId,

      qinObsNcFormDets: data.array?.map((item) => ({
        id: item.id,
        olLineItemId: item.olLineItemId,
        reworkAction: item.reworkAction,
        remarks: item.remarks,
        closureStatus: item.closureStatus,
        // dis: item.reworkAction === ("" || null) ? false : true,
      })),
    };
    dispatch(updateQinObsNcForm(value)).then((res) => {
      setDisableSubmit(true);
      console.log("records vadftrl", data.qinObsNcFormDets);
    });
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  console.log(getValues(), "getValues");
  return (
    <>
      <Dialog
        open={true}
        maxWidth="xl"
        align="center"
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title21" {...props} />
        )}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title21"
        >
          QUALITY IMPROVEMENT NOTE(QIN)/OBSERVATIONS/NON CONFORMANCE IS/FRM/003
        </DialogTitle>
        <DialogContent>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("qin")} />
            {/* <Paper className={classes.paper}> */}
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                <Typography className={classes.heading}>
                  QUALITY IMPROVEMENT NOTE(QIN)/OBSERVATIONS/NON CONFORMANCE
                  IS/FRM/003
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              align="center"
              style={{ margin: "auto", overflowX: "auto" }}
            >
              <TblContainer style={{ maxHeight: "600px" }}>
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
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell>File No:</StyledTableCell>
                      <StyledTableCell className={classes.remarks}>
                        {rowData?.fileNo}
                      </StyledTableCell>
                      <StyledTableCell className={classes.remarks}>
                        {" "}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>
                        P.O/Indent No. & Date:
                      </StyledTableCell>
                      <StyledTableCell className={classes.remarks}>
                        {rowData?.soNumber}
                      </StyledTableCell>
                      <StyledTableCell className={classes.remarks}>
                        {rowData?.soDate}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>
                        {isArmy ? "QACL" : "OL"} No and date:
                      </StyledTableCell>
                      <StyledTableCell className={classes.remarks}>
                        {rowData?.olNumber}
                      </StyledTableCell>
                      <StyledTableCell className={classes.remarks}>
                        {rowData?.offerDate}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>
                        Project:
                      </StyledTableCell>
                      <StyledTableCell className={classes.remarks} colSpan="2">
                        {rowData?.projectName}
                      </StyledTableCell>
                      {/* <StyledTableCell className={classes.remarks}></StyledTableCell> */}
                    </StyledTableRow>
                  </TableBody>
                </Table>
                {/* {recordsAfterPagingAndSorting()?.length != 0 && recordsAfterPagingAndSorting()?.length != undefined ? <TblPagination /> : ""} */}
              </TblContainer>
            </Grid>
            <br />
            <br />

            <Paper>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                  <Grid container>
                    <TblContainer style={{ maxHeight: "600px" }}>
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
                        <TableBody>
                          {savedData?.qinObsNcFormDets?.map((input, index) => (
                            // {(input?.remarks !== null || input?.remarks !== "") && setIsRemarks(true)}
                            <StyledTableRow>
                              {loading && <LinearProgress />}

                              <StyledTableCell className={classes.tableCell}>
                                {index + 1}
                              </StyledTableCell>
                              <StyledTableCell className={classes.remarks}>
                                {input?.partNo}
                              </StyledTableCell>
                              <StyledTableCell
                                style={{ width: "10%" }}
                                className={classes.remarks}
                              >
                                {input?.description}
                              </StyledTableCell>

                              <StyledTableCell className={classes.remarks}>
                                {input?.category}
                              </StyledTableCell>

                              <StyledTableCell
                                style={{ width: "20%" }}
                                className={classes.remarks}
                              >
                                {input?.observation}
                              </StyledTableCell>

                              <StyledTableCell style={{ width: "20%" }}>
                                {input?.reworkAction}
                              </StyledTableCell>

                              <StyledTableCell
                                className={classes.remarks}
                              ></StyledTableCell>

                              <StyledTableCell style={{ width: "20%" }}>
                                {input?.remarks}
                              </StyledTableCell>
                              <StyledTableCell style={{ width: "20%" }}>
                                {input?.closureStatus === true ? "Yes" : "No"}
                              </StyledTableCell>

                              {/* <StyledTableCell className={classes.remarks}>
                                <Controller
                                  name={`array[${index}].closureStatus`}
                                  control={control}
                                  render={({ field: { onChange, value } }) => (
                                    <FormControl component="fieldset">
                                      <RadioGroup
                                        row
                                        size="small"
                                        //value={value === true ? "true" : "false"}
                                        value={value}
                                      >
                                        <FormControlLabel
                                          value="true"
                                          onChange={onChange}
                                          control={<Radio size="small" />}
                                          disabled={user?.roleId === 9 || isRemarks}
                                          label="Yes"
                                        />
                                        <FormControlLabel
                                          value="false"
                                          onChange={onChange}
                                          control={<Radio size="small" />}
                                          disabled={user?.roleId === 9 || isRemarks}
                                          label="No"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  )}
                                />
                              </StyledTableCell> */}
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TblContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            {/* </Paper> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            // onClick={handleSubmit(handleSave)}
            type="submit"
            onClick={handlePrint}
          >
            Print
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
