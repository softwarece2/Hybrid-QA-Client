/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";

//material-ui
import {
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

//components
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AutoCompleteNew from "components/AutoCompleteNew";
import Button from "components/Button";
import MultilineTextField from "components/MultilineTextField";
import TextArea from "components/TextArea";
import moment from "moment";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import HeaderPdf from "pages/Layout/HeaderPdf";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import {
  getCcByOLId,
  getINoteSignatoryList,
} from "Redux/Actions/Enclosure/INoteAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import useTable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/UseTable";
import { headerValue } from "Globals.js";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "1rem",
  },
  cardContent: {
    textAlign: "left",
    // padding: 16,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  buttonImport: {
    backgroundColor: "#E0F7FE",
    color: theme.palette.common.black,
    "&:hover, &:focus": {
      color: theme.palette.common.black,
      background: "#E0F7FE",
    },
  },
  paper: {
    width: "95%",
    padding: "25px 25px 25px 25px",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  remarks: {
    fontSize: "0.875rem",
    fontWeight: 400,
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  textArea: {
    resize: "none",
    userSelect: "none",
    pointerEvents: "none",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: 300,
    // lineHeight: 1.5,
    color: "#000",
  },
  inputStyles: {
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase",
    textDecoration: "underline",
    textAlign: "center",
  },
}));
const textArea = {
  resize: "none",
  userSelect: "none",
  pointerEvents: "none",
  border: "none",
  fontSize: "0.875rem",
  fontWeight: 300,
  // lineHeight: 1.5,
  color: "#000",
};
const inputStyles = {
  fontSize: "14px",
  fontWeight: 600,
  textTransform: "uppercase",
  textDecoration: "underline",
  textAlign: "center",
};
const headCells = [
  // { id: "index", label: "S.No.", align: "left" },

  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "totalClaimedAmount",
    label: "Description",
    field: "description",
    align: "left",
    disableSorting: true,
  },
  {
    id: "claimDate",
    label: "Part No",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Unit SL .NO",
    field: "itemCategoryName",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Hologram No.10 ↑ N002 ",
    align: "left",
    disableSorting: true,
  },
  {
    label: "",
    align: "left",
    disableSorting: true,
  },
];

export default function ClearanceCertifi({ rowData }) {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const [signatoryList, setSignatoryList] = useState([]);
  const [selectedSignatory, setSelectedSignatory] = useState(null);



  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,

  } = useTable(records, headCells);
  const {
 
    control,
   
    
  } = useForm({
    //  defaultValues,
    //  resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [data, setData] = useState({});

  const componentRef = React.useRef();

  const getCC = () => {
    dispatch(getCcByOLId(rowData?.id)).then((data) => {
      setData(data);
    });
  };
  useEffect(() => {
    getCC();
    getINoteSignatories();
  }, []);

  const getINoteSignatories = () => {
    getINoteSignatoryList(loggedInUser?.orgId)
      .then((res) => setSignatoryList(res))
      .catch((err) => toast.error("Something went wrong"));
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={12} align="left">
          <Button
            className={classes.button}
            type="back"
            variant="outlined"
            onClick={() => {
              dispatch(selectItem(<INoteTable />));
            }}
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <Paper className={classes.paper}>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.heading}>Address:</Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={5} lg={3} xl={3}>
              <TextArea
                value={data?.addressedTo}
                readOnly={true}
                placeholder="Address"
                labelText="Address"
                maxRows={45}
                variant="outlined"
                style={textArea}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={6} xl={6}></Grid>
            <Grid item xs={12} sm={4} md={5} lg={3} xl={3}>
              <Typography className={classes.remarks}>
                Date :{" "}
                {data?.letterDate
                  ? moment(data?.letterDate).format("DD-MM-YYYY")
                  : ""}
              </Typography>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography style={inputStyles}> {data?.title}</Typography>
            </Grid>
            {data?.clearanceLetterPointDtos?.map((item, index) => (
              <>
                <Grid
                  xs={1}
                  align="right"
                  style={{ paddingTop: 15, paddingRight: 10 }}
                >
                  <Typography className={classes.subject}>
                    {index + 1}.
                  </Typography>{" "}
                </Grid>
                <Grid xs={10} style={{ align: "left", paddingTop: 15 }}>
                  <Controller
                    name={`input[${index}].remarks`}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <MultilineTextField
                          size="small"
                          value={item.contentText}
                        />
                      );
                    }}
                  ></Controller>
                </Grid>
                <br />
                <Grid xs={1} sm={1} md={1} lg={1} xl={1}></Grid>

                <Grid
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  xl={10}
                  style={{ align: "left" }}
                >
                  {item?.clearanceLetterItemDtos.length > 0 && (
                    <TblContainer style={{ maxHeight: "600px" }}>
                      {loading && <LinearProgress />}
                      <Table
                        style={{
                          position: "relative",
                          border: "1px solid lightgrey",
                          marginTop: 15,
                          alignContent: "center",
                          marginLeft: "12px",
                          maxWidth: "1000px",
                        }}
                        // padding="100px"
                        size="small"
                        aria-label="simple table"
                        id="data-table-cleanliness-report"
                      >
                        {" "}
                        <TblHead />
                        <TableBody>
                          {item?.clearanceLetterItemDtos?.map((item, index) => (
                            <>
                              <StyledTableRow key={index}>
                                <StyledTableCell className={classes.remarks}>
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  {item?.description}
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  {item?.partNo}
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  {item?.unitSlNo}
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  {item?.hologramNo}
                                </StyledTableCell>
                              </StyledTableRow>
                            </>
                          ))}
                        </TableBody>
                      </Table>
                      {recordsAfterPagingAndSorting()?.length != 0 &&
                        recordsAfterPagingAndSorting()?.length != undefined ? (
                        <TblPagination />
                      ) : (
                        ""
                      )}
                    </TblContainer>
                  )}
                </Grid>
                <br />
              </>
            ))}
          </Grid>
          <br />
          <br />
          <Grid container spacing={3}>
            <Grid item xs={9} sm={9} md={9} lg={9} xl={9} align="left"></Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3} align="left">
              <AutoCompleteNew
                labelText="Select Signatory"
                data={signatoryList}
                required
                getOptionLabel={(o) => o?.ename}
                onChange={(e, v) => {
                  setSelectedSignatory(v);
                }}
                value={selectedSignatory}
              // disabled={disable}
              />
              {selectedSignatory && (
                <>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.enameHi}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.ename}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.designationHi}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.designation}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.roleNameHi}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.roleName}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    वरिष्ठ् गुणवत्ता आश्वासन अधिकारी के लिए
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    For Senior Quality Assurance Officer
                  </Typography>
                </>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.heading}>Copy to:-</Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <TextArea
                value={data?.copyTo}
                readOnly={true}
                maxRows={25}
                variant="plain"
                style={textArea}
              />
            </Grid>
            <br />
            <br />

            {!loading && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                {/* {responseData?.submittedDatetime && ( */}
                <Button
                  variant="contained"
                  className={classes.btn}
                  onClick={() => setOpen(true)}
                >
                  Preview
                </Button>
                {/* )} */}
              </Grid>
            )}
          </Grid>
        </div>
      </Paper>
      <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title@56" {...props} />
        )}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title@56">
          CLEARANCE CERTIFICATE
        </DialogTitle>
        <DialogContent>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("a")} />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
                <Typography className={classes.heading}>Address:</Typography>
              </Grid>

              <Grid item xs={12} sm={4} md={5} lg={3} xl={3}>
                <style>
                  {`@media print {.printbox,article{font-size: "0.875rem";}.MuiTypography-body1{font-size: "0.875rem" !important;} .printbox b{font-weight: 400;}  .printbox }`}
                </style>
                <TextArea
                  value={data?.addressedTo}
                  readOnly={true}
                  placeholder="Address"
                  labelText="Address"
                  maxRows={45}
                  variant="plain"
                  style={textArea}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2} lg={6} xl={6}></Grid>
              <Grid item xs={12} sm={4} md={5} lg={3} xl={3}>
                <Typography className={classes.remarks}>
                  Date :{" "}
                  {data?.letterDate
                    ? moment(data?.letterDate).format("DD-MM-YYYY")
                    : ""}
                </Typography>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
                <Typography style={inputStyles}> {data?.title}</Typography>
              </Grid>
              {data?.clearanceLetterPointDtos?.map((item, index) => (
                <>
                  <Grid
                    xs={1}
                    align="right"
                    style={{ paddingTop: 20, paddingRight: 10 }}
                  >
                    <Typography className={classes.subject}>
                      {index + 1}.
                    </Typography>{" "}
                  </Grid>
                  <Grid xs={10} style={{ align: "left", paddingTop: 20 }}>
                    <Typography className={classes.subject}>
                      {item.contentText}
                    </Typography>
                  </Grid>
                  <br />
                  <Grid xs={1} sm={1} md={1} lg={1} xl={1}></Grid>

                  <Grid
                    xs={10}
                    sm={10}
                    md={10}
                    lg={10}
                    xl={10}
                    style={{ align: "left" }}
                  >
                    {item?.clearanceLetterItemDtos.length > 0 && (
                      <TblContainer style={{ maxHeight: "600px" }}>
                        {loading && <LinearProgress />}
                        <Table
                          style={{
                            position: "relative",
                            border: "1px solid lightgrey",
                            marginTop: 15,
                            alignContent: "center",
                            marginLeft: "12px",
                            maxWidth: "1000px",
                          }}
                          // padding="100px"
                          size="small"
                          aria-label="simple table"
                          id="data-table-cleanliness-report"
                        >
                          {" "}
                          <TblHead />
                          <TableBody>
                            {item?.clearanceLetterItemDtos?.map(
                              (item, index) => (
                                <>
                                  <StyledTableRow key={index}>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {item?.description}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {item?.partNo}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {item?.unitSlNo}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {item?.hologramNo}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                </>
                              )
                            )}
                          </TableBody>
                        </Table>
                        {recordsAfterPagingAndSorting()?.length != 0 &&
                          recordsAfterPagingAndSorting()?.length != undefined ? (
                          <TblPagination />
                        ) : (
                          ""
                        )}
                      </TblContainer>
                    )}
                  </Grid>
                  <br />
                </>
              ))}
            </Grid>
            <br />
            <br />
            <Grid container>
              <Grid item xs={9} sm={9} md={9} lg={9} xl={9} align="left"></Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3} align="left">
                {selectedSignatory && (
                  <>
                    <Typography className={classes.textSizeBold}>
                      {selectedSignatory?.enameHi}
                    </Typography>
                    <Typography className={classes.textSizeBold}>
                      {selectedSignatory?.ename}
                    </Typography>
                    <Typography className={classes.textSizeBold}>
                      {selectedSignatory?.designationHi}
                    </Typography>
                    <Typography className={classes.textSizeBold}>
                      {selectedSignatory?.designation}
                    </Typography>
                    <Typography className={classes.textSizeBold}>
                      {selectedSignatory?.roleNameHi}
                    </Typography>
                    <Typography className={classes.textSizeBold}>
                      {selectedSignatory?.roleName}
                    </Typography>
                    <Typography className={classes.textSizeBold}>
                      वरिष्ठ् गुणवत्ता आश्वासन अधिकारी के लिए
                    </Typography>
                    <Typography className={classes.textSizeBold}>
                      For Senior Quality Assurance Officer
                    </Typography>
                  </>
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
                <Typography className={classes.heading}>Copy to:-</Typography>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <TextArea
                  value={data?.copyTo}
                  readOnly={true}
                  maxRows={25}
                  variant="plain"
                  style={textArea}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            type="submit"
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
