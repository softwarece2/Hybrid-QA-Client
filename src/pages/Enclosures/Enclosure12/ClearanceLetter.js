/* eslint-disable react-hooks/exhaustive-deps */
import "jspdf-autotable";
import React, { useEffect, useRef, useState } from "react";

//material-ui
import {
  Dialog,
  DialogActions,
  FormHelperText,
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { DialogContent, DialogTitle } from "Utils";

//components
import Button from "components/Button";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import {
  StyledTableCell,
  StyledTableCellPrint,
} from "../../../components/UseTable";

import MultilineTextField from "components/MultilineTextField";

//icons
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReactToPrint } from "react-to-print";

//pages
import INoteTable from "pages/InspectorModule/INote/INoteTable";

//redux

import AutoCompleteNew from "components/AutoCompleteNew";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getINoteDetailsByOlId,
  getINoteSignatoryList,
  saveINoteAction,
} from "Redux/Actions/Enclosure/INoteAction";
import { Controller, useForm } from "react-hook-form";
import { PaperComponent } from "Utils/D3Tree";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  paper: {
    width: "95%",
    padding: "12px 12px 12px 12px",
  },
  size: {
    width: 15,
    height: 15,
  },
  table: {
    width: "100%",
  },
  tableCell: {
    border: "1px solid black",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  stores: {
    textTransform: "uppercase",
    textDecoration: "underline",
    fontWeight: 600,
  },
  headingLeft: {
    fontWeight: 500,
  },
  headingRight: {
    fontSize: "0.875rem",
  },
  textSize: {
    fontSize: "0.875rem",
  },
  textSizeBold: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  subHeading: {
    fontSize: "0.875rem",
    fontWeight: 400,
    wordBreak: "break-all",
  },
  box: {
    border: "1px solid black",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  labelNote: {
    marginTop: "15px",
    marginBottom: "20px",
    fontSize: "12px",
    textAlign: "left",
    // marginLeft: "2%",
    color: "grey",
  },
  textArea: {
    fontSize: "0.875rem",
    fontWeight: 400,
    width: "150px",
  },
  textfield: {
    fontSize: "0.875rem",
    fontWeight: 400,
    maxWidth: "100px",
    height: "40px",
    wordBreak: "break-all",
  },
  tableCellTextArea: {
    border: "1px solid black",
    width: "100px",
  },

  strikethrough: {
    textDecoration: "line-through",
  },
}));

// const headCells = [
//   // { id: "index", label: "S.No.", align: "left" },
//   { id: "claimId", label: "Concession/Deviations", align: "left", disableSorting: true },
//   { id: "claimDate", label: "Affected Items Ref and Drg. No.", align: "left", disableSorting: true },
//   { id: "claimStatus", label: "Brief Details of Concession/Deviations", align: "left", disableSorting: true },
//   { id: "totalClaimedAmount", label: "Authority for Consessions/Deviations and Date", align: "left", disableSorting: true },
// ];
const defaultValues = {
  // id: "",

  newDd: moment(new Date()).format("YYYY-MM-DD"),
};
export default function ClearanceLetter({ rowData }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const roleId = useSelector((state) => state?.loggedInUser?.roleId);

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const componentRef = React.useRef();
  const [records, setRecords] = useState(null);

  const [signatoryList, setSignatoryList] = useState([]);
  const [selectedSignatory, setSelectedSignatory] = useState(null);
  const [signatoryError, setSignatoryError] = useState(null);
  const [isSignatoryDirty, setIsSignatoryDirty] = useState(false);
 
  const {
    control,
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  var converter = require("number-to-words");

  useEffect(() => {
    if (isSignatoryDirty && selectedSignatory) setSigntoryErrFalse();
  }, [selectedSignatory]);

  const fetchLI = (id) => {
    setLoading(true);
    console.log("wrdjehrjehruo", id);
    if (id !== undefined) {
      getINoteDetailsByOlId(id)
        .then((data) => {
          console.log("this is function");
          setRecords(data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setLoading(false));
    }

    setRecords([]);
  };

  useEffect(() => {
    fetchLI(rowData?.id);
  }, []);


  const getINoteSignatories = () => {
    getINoteSignatoryList(loggedInUser?.orgId)
      .then((res) => setSignatoryList(res))
      .catch((err) => toast.error("Something went wrong"));
  };

  useEffect(() => {
    // getINoteByOlId();
    getINoteSignatories();
  }, []);



  const updateLineItemUnitSlNo = (remarks, id) => {
    const newArr = records?.map((item, idx) => ({
      ...item,
      // accepted: id === idx ? accepted : item?.accepted,
      unitCostStr: id === idx ? remarks : item?.remarks,
    }));
    setRecords(newArr);
  };
  const updateLineItemHologram = (remarks, id) => {
    const newArr = records?.map((item, idx) => ({
      ...item,
      // accepted: id === idx ? accepted : item?.accepted,
      hologramRemarks: id === idx ? remarks : item?.remarks,
    }));
    setRecords(newArr);
  };

  const setSigntoryErrTrue = () => {
    setSignatoryError({ error: true, msg: "Required" });
  };

  const setSigntoryErrFalse = () => {
    setSignatoryError({ error: false, msg: null });
  };

  const saveCC = (e) => {
    if (selectedSignatory === null) setSigntoryErrTrue();
    else {
      console.log("rkgr", records);
      setSigntoryErrFalse();
      const data = {
        ...records,
        olId: rowData?.id,
        empName: selectedSignatory?.ename,
        empDesigation: selectedSignatory?.designation,
        empRole: selectedSignatory?.roleName,
        empNameHindi: selectedSignatory?.enameHi,
        empDesignationHindi: selectedSignatory?.designationHi,
        emproleHindi: selectedSignatory?.roleNameHi,
        inoteLineItems: records?.inoteLineItems?.map((item) => ({
          ...item,
          qtyAcceptedToDate: +item?.qtyAcceptedToDate + +item?.accepted,
        })),
        inoteTypeId: 4,
      };
      console.log("hswgewhe", data);
      saveINoteAction(data)
        .then((res) => {
          toast.success("Data Successfully Submitted.");
          setIsSignatoryDirty(false);
          // getINoteByOlId();
        })
        .catch((err) => {
          console.log("saveINote error", err);
          toast.error("Something went wrong. Please try again later");
        });
    }
  };

  const printref = useRef(null);

  const alphabets = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  
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
        <div ref={printref} className="printbox">
          <style>
            {`@media print {.printbox,article{font-size: 10px;}.MuiTypography-body1{font-size: 10px !important;} .printbox b{font-weight: 500;}  .printbox .printbtn{display:none} .deletebtn{display:none} .pagebreak { page-break-before: always; }}`}
          </style>

          <Grid container spacing={2}>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.headingLeft}>
                भारत सरकार
              </Typography>
              <Typography className={classes.headingLeft}>
                GOVERNMENT OF INDIA
              </Typography>

              <Typography className={classes.subHeading}>
                {" "}
                (पूर्ति विभाग)
              </Typography>
              <Typography
                className={classes.subHeading}
                style={{ padding: "0px 0px 10px 0px" }}
              >
                (Department of Defence Production and Supply)
              </Typography>

              <Typography className={classes.textSize}>
                <span style={{ color: "red" }}>*</span>जो ब्योरा आवश्यक न हों
                उन्हें काट दें ।
              </Typography>
              <Typography className={classes.textSize}>
                <span style={{ color: "red" }}>*</span>Particulars not required
                to be deleted.
              </Typography>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="center">
              <Typography className={classes.heading}>निरीक्षण पत्र</Typography>
              <Typography
                className={classes.heading}
                style={{ padding: "0px 0px 10px 0px" }}
              >
                CLEARANCE CERTIFICATE
              </Typography>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography
                className={classes.headingRight}
                style={{ padding: "0px 0px 4px 0px" }}
              >
                <span style={{ fontWeight: 600 }}>
                  {" "}
                  म.नि.पू.नि.(एस) / ln lieu of D.G.S & D.(S)-84
                </span>
              </Typography>

              <Grid container>
                <Grid item xs={7} align="left">
                  <Grid container>
                    <Grid item xs={3} align="left">
                      <Typography className={classes.subHeading}>
                        फाइल सं.
                      </Typography>
                      <Typography className={classes.subHeading}>
                        File No.{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} align="left">
                      <Typography className={classes.subHeading}>
                        <span style={{ fontWeight: 600 }}>
                          {records?.fileNo}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={5} align="left">
                  <Grid container>
                    <Grid item xs={6} align="left">
                      <Typography className={classes.subHeading}>
                        इस्स्यू सं
                      </Typography>
                      <Typography className={classes.subHeading}>
                        Issue No.
                      </Typography>
                    </Grid>
                    <Grid item xs={6} align="left">
                      <Typography className={classes.subHeading}>
                        <span style={{ fontWeight: 600 }}>NIL</span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={7} align="left">

              </Grid>
            </Grid>
          </Grid>

          <br />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.textSize}>
                1. महानिदेशक (पूर्ति तथा निपटान)/पूर्ति निदेशक(वस्त्र)दर/चालू
                ठेका/नि.स्वी. सं. और तारीख
                {/* <span style={{ fontWeight: "bold" }}>: 09/03/2021</span> */}
              </Typography>
              <Typography className={classes.textSize}>
                &nbsp;&nbsp;&nbsp;DG(SD)/Dir(SD)/Ds(Tex)/Rate/Running
                Contract/A/T.No. and date
                {/* <span style={{ fontWeight: "bold" }}>: 09/03/2021</span> */}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSize}>
                {" "}
                पूर्ति आदेश सं. और तारीख{" "}
              </Typography>
              <Typography className={classes.textSize}>
                Supply order No. and date{" "}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSizeBold}>
                {/* <span style={{ fontWeight: "bold" }}> */}:{" "}
                {records?.supplyOrderNo} dated{" "}
                {records?.supplyOrderDate
                  ? moment(records?.supplyOrderDate).format("DD-MM-YYYY")
                  : "NA"}{" "}
                &amp; Amdt.dated{" "}
                {records?.amdtDate
                  ? moment(records?.amdtDate).format("DD-MM-YYYY")
                  : "NA"}
                {/* </span> */}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSize}>
                2. ठेकेदार का नाम और पता / Contractor's Name and Address
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSizeBold}>
                : {records?.contractorName + ", " + records?.contractorAddress}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSize}>
                3. मांगकर्ता / Indentor
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSizeBold}>
                : {records?.indentor}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSize}>
                4. मांग पत्र सं. और तारीख / Indent No. and date{" "}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSizeBold}>
                : {records?.indentNo ? `${records?.indentNo} Dated ` : "NIL"}
                {records?.indentDate
                  ? moment(records?.indentDate).format("DD-MM-YYYY")
                  : ""}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSize}>
                5. प्रेषिती / Consignee
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSizeBold}>
                : {records?.consignee}{" "}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.textSize}>
                6. प्रमाणित किया जाता है कि नीचे और इसी क्रम में संलग्न पत्र में
                दर्ज माल का निरीक्षण किया जा चुका है और परिणाम इस प्रकार है
              </Typography>
              <Typography className={classes.textSize}>
                &nbsp;&nbsp;&nbsp;&nbsp;Certified that stores noted below and in
                the continuation sheets attached have been inspected with result
                as shown by{" "}
                <span style={{ fontWeight: 600 }}>{records?.orgName}</span>
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSize}>
                7. (क)
                <span style={{ fontWeight: 600 }}>
                  {" "}
                  {records?.offerLetterDate
                    ? moment(records?.offerLetterDate).format("DD-MM-YYYY")
                    : ""}{" "}
                  &nbsp;
                </span>
                तारीख को सुपुर्द किये गए/रेल पर रखे गए/निरीक्षण के लिए रखे गए
                सामान
              </Typography>
              <Typography className={classes.textSize}>
                &nbsp;&nbsp;&nbsp;&nbsp;(a) Stores delivered / put on rail /put
                up for inspection on &nbsp; &nbsp; &nbsp;
                <span style={{ fontWeight: 600 }}>
                  :{" "}
                  {records?.offerLetterDate
                    ? moment(records?.offerLetterDate).format("DD-MM-YYYY")
                    : ""}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSize}>
                (क) सामान निरीक्षण् करने की तारीख &nbsp; &nbsp; &nbsp;
              </Typography>
              <Typography className={classes.textSize}>
                (b)Stores Inspected on &nbsp; &nbsp; &nbsp;
                <span style={{ fontWeight: 600 }}>
                  : {records?.inspectionStart ?? "-"} To{" "}
                  {records?.inspectionEnd ?? "-"}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSize}>
                8. ठेकेदार के सुपुर्दगी पत्र की संख्या और तारीख
              </Typography>
              <Typography className={classes.textSize}>
                &nbsp;&nbsp;&nbsp;&nbsp;Contractor's Offering Letter No.
                /delivery note No. and date
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSizeBold}>
                : {records?.offerLetterNo} dated{" "}
                {records?.offerLetterDate &&
                  moment(records?.offerLetterDate).format("DD-MM-YYYY")}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.textSize}>
                9. अनुबद्ध समय के अंदर अथवा सक्षम प्राधिकारी द्वारा बढ़ाए गए समय
                के अंदर मदों की पूर्ति की गई/नहीं की गई दण्ड के लिए पूर्ति
                अधिकारी को भेजी गई सूचना
              </Typography>
              <Typography className={classes.textSize}>
                &nbsp;&nbsp;&nbsp;&nbsp;The items were/were not supplied within
                the stipulated time or as extended by the competent
                authority/reference made to supply Officer regarding penalty
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.textSize}>
                {records?.newDdDate && (
                  <span style={{ fontWeight: "bold" }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DD Extn Letter :
                    Provisional DD extended upto {records?.newDdDate} Amendment
                    Letter accorded by IHQ MoD (N)/ DWE vide Fax{" "}
                    {records?.ddExtLetterNo} Dated {records?.ddExtLetterDate}
                  </span>
                )}
              </Typography>
              <br />
              <br />
            </Grid>
          </Grid>

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
                {loading && <LinearProgress />}
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        align="center"
                        colSpan={10}
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          DETAILS OF STORES INSPECTED
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          निविदा स्वीकृति में मद सं. / Page No. Item No. in A/T
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>
                            <u>सामान का विवरण / Description of stores</u>
                          </span>
                        </Typography>
                        <hr />

                        <Typography className={classes.subHeading}>
                          Total quantity ordered
                        </Typography>
                        <hr />
                        <Typography className={classes.subHeading}>
                          कुल कितनी मात्रा में आर्डर दिया जहाँ डिब्बे में सामान
                          भेजा जाना हो वहाँ निरीक्षक को इस बात का संकेत देना
                          चाहिए कि क्या पूर्ति विक्रेता / क्रेता के डिब्बे में
                          की गई है / The Inspector should indicate whether the supply has been made in seller's/buyer's
                          containers.Where stores are required to be supplied in
                          the containers
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          लेखा एकक /
                        </Typography>
                        <Typography className={classes.subHeading}>
                          Accounting Unit
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          टेंडर किया गया /
                        </Typography>
                        <Typography className={classes.subHeading}>
                          Tendered
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          स्वीकॄत /
                        </Typography>
                        <Typography className={classes.subHeading}>
                          Accepted
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          खाता पन्ना में दर्ज किया गया
                        </Typography>
                        <hr />
                        <Typography className={classes.subHeading}>
                          आज की तारीख तक स्वीकृत कुल मात्रा
                        </Typography>
                        <hr />
                        <Typography className={classes.subHeading}>
                          Brought to account in ledger folio
                        </Typography>
                        <hr />
                        <Typography className={classes.subHeading}>
                          Total Quantity Accepted todate
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          अस्वीकृति /
                        </Typography>
                        <Typography className={classes.subHeading}>
                          Rejected
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          डी.जी.आई.एस.एम. लंदन या विदेश के किसी दूसरे प्राधिकारी
                          द्वारा जारी किए (यदि कोई हों) निरीक्षण प्रमाण की सं.
                          और तारीख /
                        </Typography>
                        <Typography className={classes.subHeading}>
                          No. date of inspection certificate(if any) issued by
                          D.G.I.S.M London or other inspection Authority abroad
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          अभियुक्तियाँ /
                        </Typography>
                        <Typography className={classes.subHeading}>
                          Unit sl.No
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          अभियुक्तियाँ /
                        </Typography>
                        <Typography className={classes.subHeading}>
                          Hologram NO
                        </Typography>
                      </StyledTableCell>
                    </TableRow>

                    <TableRow>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(1)</span>
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(2)</span>
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(3)</span>
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(4)</span>
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(5)</span>
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(6)</span>
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(7)</span>
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(8)</span>
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(9)</span>
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                        colSpan={1}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>(10)</span>
                        </Typography>
                      </StyledTableCell>
                    </TableRow>

                    <TableRow>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}></Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.stores}>
                          {/* SPARES FOR SONAR PAYAL SYSTEM */}
                          {records?.description ?? "-"}
                          {/* --------------to get from svc----------------- */}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}></Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}></Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}></Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}></Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}></Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}></Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCellTextArea}
                      ></StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCellTextArea}
                      >
                        <Typography className={classes.subHeading} align="left">
                          {records?.remarks ?? "-"}
                        </Typography>
                      </StyledTableCell>
                    </TableRow>

                    {records?.inoteLineItems?.length ? (
                      records?.inoteLineItems?.map((item, id) => (
                        <TableRow>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              {id + 1}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              {item?.description ?? "-"}
                            </Typography>
                            <Typography className={classes.subHeading}>
                              {item?.partNo ?? "-"}
                            </Typography>
                            <Typography className={classes.subHeading}>
                              Total Quantity Ordered : {item?.orderedQty ?? "-"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              {item?.uom ?? "-"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              {item?.tendered ?? "-"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              {item?.accepted ?? "-"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography>{`${item?.ledgerFolio}/${
                              records?.existing
                                ? +item?.qtyAcceptedToDate
                                : +item?.qtyAcceptedToDate + +item?.accepted
                            }`}</Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              {item?.rejected ?? "-"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              -
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCellTextArea}
                          >
                            {records?.existing ? (
                              <Typography className={classes.subHeading}>
                                {item?.remarks ?? "-"}
                              </Typography>
                            ) : (
                              <MultilineTextField
                                className={classes.textArea}
                                onChange={(e) => {
                                  updateLineItemUnitSlNo(e.target.value, id);
                                }}
                                value={item?.unitCostStr}
                                placeholder="Unit sl No."
                                rows={4}
                              />
                            )}
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCellTextArea}
                          >
                            {records?.existing ? (
                              <Typography className={classes.subHeading}>
                                {item?.remarks ?? "-"}
                              </Typography>
                            ) : (
                              <MultilineTextField
                                className={classes.textArea}
                                onChange={(e) => {
                                  updateLineItemHologram(e.target.value, id);
                                }}
                                value={item?.hologramRemarks}
                                placeholder="Remarks"
                                rows={4}
                              />
                            )}
                          </StyledTableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <StyledTableCell
                          align="center"
                          className={classes.tableCell}
                          colSpan={9}
                        >
                          No Line Items
                        </StyledTableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <Typography className={classes.textSize}>
            टिप्पणी:- अंतिम मद के बाद में तत्काल एक रेखा खाींची जाएगी या टाइफ की
            जाएगी। रेखा के नीचे "भंडार का विवरण" नाम के खाने में पृथक रूप में दी
            गई मदों की कुल संख्या इस प्रकार दर्ज की जाएगी। निरीक्षण की गई मदों
            की संख्या ................................ (शब्दों में)
          </Typography>
          <Typography className={classes.textSize}>
            Note:- A line to be drawn or typed Immediately after the last item.
            Below the line will be entered the total no of items separately
            shown in the Col “DESCRIPTION OF STORES” thus ITEM INSPECTED NO. (in
            word) -
            <span style={{ fontWeight: 600 }}>
              TOTAL INSPECTED ITEMS-{" "}
              <span style={{ textTransform: "uppercase" }}>{`${
                records?.inoteLineItems?.length
                  ? converter.toWords(records?.inoteLineItems?.length)
                  : "ZERO"
              }`}</span>{" "}
              ONLY
            </span>
          </Typography>
          <br />
          <br />

          <Grid container>
            <Grid item xs={9} sm={9} md={9} lg={9} xl={9} align="left">
              <Typography className={classes.subHeading}>
                स्थान / Station :{" "}
                <span style={{ fontWeight: 600 }}>Bangalore</span>
              </Typography>
              <Typography className={classes.subHeading}>
                तारीख / Dated&nbsp; :&nbsp;
                {!records?.existing && roleId === 2 ? (
                  <Controller
                    name="cqaoApprovalDate"
                    control={control}
                    //value={value}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        {...props}
                        labelText="Approval Date"
                        placeholder="Approval date"
                        onChange={(e) => {
                          onChange(e);
                          // setSelectedDate(e.target.value);
                          setRecords({
                            ...records,
                            inoteDate: e.target.value,
                          });
                          console.log("date", e.target.value);
                        }}

                        value={value}
                        type="date"
                        size="small"
                        required

                      />
                    )}
                  />
                ) : (
                  <span style={{ fontWeight: 600 }}>
                    {records?.inoteDate
                      ? moment(records?.inoteDate).format("DD-MM-YYYY")
                      : "NA"}
                  </span>
                )}
              </Typography>
            </Grid>

            <Grid item xs={3} sm={3} md={3} lg={3} xl={3} align="left">
              <AutoCompleteNew
                labelText="Select Signatory"
                data={signatoryList}
                getOptionLabel={(o) => o?.ename}
                onChange={(e, v) => {
                  setSelectedSignatory(v);
                  setIsSignatoryDirty(true);
                }}
                value={selectedSignatory}
              />
              <FormHelperText error={!!signatoryError?.error}>
                {signatoryError?.msg}
              </FormHelperText>
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
          </Grid>

          <Grid align="center">
            {/* <ReceiptCertificate ref={printrefr}  /> */}
          </Grid>
        </div>
      </Paper>
      <br />
      <Grid container spacing={2} align="left">
        <Grid item xs={9} align="right">
          {roleId !== 7 && (
            <Button
              variant="contained"
              color="primary"
              className="printbtn"
              disabled={records?.existing}
              onClick={saveCC}
            >
              Save
            </Button>
          )}
        </Grid>
        <Grid item xs={1} align="right">
          <Button
            type="submit"
            //disabled={!records?.existing}
            onClick={() => setOpen(true)}
            variant="contained"
            className={classes.btn}
          >
            Preview
          </Button>
        </Grid>
        <Dialog
          open={open}
          // onClose={onClose}
          maxWidth="lg"
          align="center"
          PaperComponent={(props) => (
            <PaperComponent id="draggable-dialog-title$$$" {...props} />
          )}
        >
          <DialogTitle
            style={{ fontSize: "0.875rem", cursor: "move" }}
            onClose={() => setOpen(false)}
            id="draggable-dialog-title$$$"
          >
            I-Note
          </DialogTitle>

          <DialogContent>
            <div ref={componentRef}>
              <Grid container spacing={1}>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
                  <Typography className={classes.headingLeft}>
                    भारत सरकार
                  </Typography>
                  <Typography className={classes.headingLeft}>
                    GOVERNMENT OF INDIA
                  </Typography>

                  <Typography className={classes.subHeading}>
                    {" "}
                    (पूर्ति विभाग)
                  </Typography>
                  <Typography
                    className={classes.subHeading}
                    style={{ padding: "0px 0px 10px 0px" }}
                  >
                    (Department of Defence Production and Supply)
                  </Typography>

                  <Typography className={classes.textSize}>
                    <span style={{ color: "red" }}>*</span>जो ब्योरा आवश्यक न
                    हों उन्हें काट दें ।
                  </Typography>
                  <Typography className={classes.textSize}>
                    <span style={{ color: "red" }}>*</span>Particulars not
                    required to be deleted.
                  </Typography>
                </Grid>

                <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="center">
                  <Typography className={classes.heading}>
                    निरीक्षण पत्र
                  </Typography>
                  <Typography
                    className={classes.heading}
                    style={{ padding: "0px 0px 10px 0px" }}
                  >
                    CLEARANCE CERTIFICATE
                  </Typography>
                </Grid>

                <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
                  <Typography
                    className={classes.headingRight}
                    style={{ padding: "0px 0px 4px 0px" }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {" "}
                      म.नि.पू.नि.(एस) / ln lieu of D.G.S & D.(S)-84
                    </span>
                  </Typography>
                  <Grid container>
                    <Grid item xs={7} align="left">
                      <Grid container>
                        <Grid item xs={3} align="left">
                          <Typography className={classes.subHeading}>
                            फाइल सं.
                          </Typography>
                          <Typography className={classes.subHeading}>
                            File No.{" "}
                          </Typography>
                        </Grid>
                        <Grid item xs={9} align="left">
                          <Typography className={classes.subHeading}>
                            <span style={{ fontWeight: 600 }}>
                              {records?.fileNo}
                            </span>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={5} align="left">
                      <Grid container>
                        <Grid item xs={6} align="left">
                          <Typography className={classes.subHeading}>
                            इस्स्यू सं
                          </Typography>
                          <Typography className={classes.subHeading}>
                            Issue No.
                          </Typography>
                        </Grid>
                        <Grid item xs={6} align="left">
                          <Typography className={classes.subHeading}>
                            <span style={{ fontWeight: 600 }}>NIL</span>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={0}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
                  <Typography className={classes.textSize}>
                    1. महानिदेशक (पूर्ति तथा निपटान)/पूर्ति
                    निदेशक(वस्त्र)दर/चालू ठेका/नि.स्वी. सं. और तारीख
                    {/* <span style={{ fontWeight: "bold" }}>: 09/03/2021</span> */}
                  </Typography>
                  <Typography className={classes.textSize}>
                    &nbsp;&nbsp;&nbsp;DG(SD)/Dir(SD)/Ds(Tex)/Rate/Running
                    Contract/A/T.No. and date
                    {/* <span style={{ fontWeight: "bold" }}>: 09/03/2021</span> */}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSize}>
                    {" "}
                    पूर्ति आदेश सं. और तारीख{" "}
                  </Typography>
                  <Typography className={classes.textSize}>
                    Supply order No. and date{" "}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSizeBold}>
                    {/* <span style={{ fontWeight: "bold" }}> */}:{" "}
                    {records?.supplyOrderNo} dated
                    {records?.supplyOrderDate
                      ? moment(records?.supplyOrderDate).format("DD-MM-YYYY")
                      : "NA"}{" "}
                    &amp; Amdt.dated{" "}
                    {records?.amdtDate
                      ? moment(records?.amdtDate).format("DD-MM-YYYY")
                      : "NA"}
                    {/* </span> */}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSize}>
                    2. ठेकेदार का नाम और पता / Contractor's Name and Address
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSizeBold}>
                    :{" "}
                    {records?.contractorName +
                      ", " +
                      records?.contractorAddress}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSize}>
                    3. मांगकर्ता / Indentor
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSizeBold}>
                    : {records?.indentor}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSize}>
                    4. मांग पत्र सं. और तारीख / Indent No. and date{" "}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSizeBold}>
                    :{" "}
                    {records?.indentNo ? `${records?.indentNo} Dated ` : "NIL"}
                    {records?.indentDate
                      ? moment(records?.indentDate).format("DD-MM-YYYY")
                      : ""}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSize}>
                    5. प्रेषिती / Consignee
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSizeBold}>
                    : {records?.consignee}{" "}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
                  <Typography className={classes.textSize}>
                    6. प्रमाणित किया जाता है कि नीचे और इसी क्रम में संलग्न पत्र
                    में दर्ज माल का निरीक्षण किया जा चुका है और परिणाम इस प्रकार
                    है
                  </Typography>
                  <Typography className={classes.textSize}>
                    &nbsp;&nbsp;&nbsp;&nbsp;Certified that stores noted below
                    and in the continuation sheets attached have been inspected
                    with result as shown by{" "}
                    <span style={{ fontWeight: 600 }}>{records?.orgName}</span>
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSize}>
                    7. (क){" "}
                    <span style={{ fontWeight: 600 }}>
                      {records?.offerLetterDate
                        ? moment(records?.offerLetterDate).format("DD-MM-YYYY")
                        : ""}{" "}
                      &nbsp;
                    </span>{" "}
                    तारीख को सुपुर्द किये गए/रेल पर रखे गए/निरीक्षण के लिए रखे
                    गए सामान
                  </Typography>
                  <Typography className={classes.textSize}>
                    &nbsp;&nbsp;&nbsp;&nbsp;(a) Stores delivered / put on rail
                    /put up for inspection on &nbsp; &nbsp; &nbsp;
                    <span style={{ fontWeight: 600 }}>
                      :{" "}
                      {records?.offerLetterDate
                        ? moment(records?.offerLetterDate).format("DD-MM-YYYY")
                        : ""}
                    </span>
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSize}>
                    (क) सामान निरीक्षण् करने की तारीख &nbsp; &nbsp; &nbsp;
                  </Typography>
                  <Typography className={classes.textSize}>
                    (b)Stores Inspected on &nbsp; &nbsp; &nbsp;
                    <span style={{ fontWeight: 600 }}>
                      : {records?.inspectionStart ?? "-"} To{" "}
                      {records?.inspectionEnd ?? "-"}
                    </span>
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSize}>
                    8. ठेकेदार के सुपुर्दगी पत्र की संख्या और तारीख
                  </Typography>
                  <Typography className={classes.textSize}>
                    &nbsp;&nbsp;&nbsp;&nbsp;Contractor's Offering Letter No.
                    /delivery note No. and date
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                  <Typography className={classes.textSizeBold}>
                    : {records?.offerLetterNo} dated
                    {records?.offerLetterDate &&
                      moment(records?.offerLetterDate).format("DD-MM-YYYY")}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
                  <Typography className={classes.textSize}>
                    9. अनुबद्ध समय के अंदर अथवा सक्षम प्राधिकारी द्वारा बढ़ाए गए
                    समय के अंदर मदों की पूर्ति की गई/नहीं की गई दण्ड के लिए
                    पूर्ति अधिकारी को भेजी गई सूचना
                  </Typography>
                  <Typography className={classes.textSize}>
                    &nbsp;&nbsp;&nbsp;&nbsp;The items were/were not supplied
                    within the stipulated time or as extended by the competent
                    authority/reference made to supply Officer regarding penalty
                  </Typography>
                </Grid>
              </Grid>

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
                    {loading && <LinearProgress />}
                    <Table className={classes.table} size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCellPrint
                            align="center"
                            colSpan={10}
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              DETAILS OF STORES INSPECTED
                            </Typography>
                          </StyledTableCellPrint>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              निविदा स्वीकृति में मद सं. / Page No. Item No. in
                              A/T
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>
                                <u>सामान का विवरण / Description of stores</u>
                              </span>
                            </Typography>
                            <hr />

                            <Typography className={classes.subHeading}>
                              Total quantity ordered
                            </Typography>
                            <hr />
                            <Typography className={classes.subHeading}>
                              कुल कितनी मात्रा में आर्डर दिया जहाँ डिब्बे में
                              सामान भेजा जाना हो वहाँ निरीक्षक को इस बात का
                              संकेत देना चाहिए कि क्या पूर्ति विक्रेता / क्रेता
                              के डिब्बे में की गई है / The Inspector should
                              indicate whether the supply has been made in
                              seller's/buyer's containers.Where stores are
                              required to be supplied in the containers
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              लेखा एकक /
                            </Typography>
                            <Typography className={classes.subHeading}>
                              Accounting Unit1
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              टेंडर किया गया /
                            </Typography>
                            <Typography className={classes.subHeading}>
                              Tendered
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              स्वीकॄत /
                            </Typography>
                            <Typography className={classes.subHeading}>
                              Accepted
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              खाता पन्ना में दर्ज किया गया
                            </Typography>
                            <hr />
                            <Typography className={classes.subHeading}>
                              आज की तारीख तक स्वीकृत कुल मात्रा
                            </Typography>
                            <hr />
                            <Typography className={classes.subHeading}>
                              Brought to account in ledger folio
                            </Typography>
                            <hr />
                            <Typography className={classes.subHeading}>
                              Total Quantity Accepted todate
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              अस्वीकृति /
                            </Typography>
                            <Typography className={classes.subHeading}>
                              Rejected
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              डी.जी.आई.एस.एम. लंदन या विदेश के किसी दूसरे
                              प्राधिकारी द्वारा जारी किए (यदि कोई हों) निरीक्षण
                              प्रमाण की सं. और तारीख /
                            </Typography>
                            <Typography className={classes.subHeading}>
                              No. date of inspection certificate(if any) issued
                              by D.G.I.S.M London or other inspection Authority
                              abroad
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              अभियुक्तियाँ /
                            </Typography>
                            <Typography className={classes.subHeading}>
                              Item sl.No
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>
                              अभियुक्तियाँ /
                            </Typography>
                            <Typography className={classes.subHeading}>
                              Hologram NO
                            </Typography>
                          </StyledTableCellPrint>
                        </TableRow>

                        <TableRow>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(1)</span>
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(2)</span>
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(3)</span>
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(4)</span>
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(5)</span>
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(6)</span>
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(7)</span>
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(8)</span>
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(9)</span>
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                            colSpan={1}
                          >
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>(10)</span>
                            </Typography>
                          </StyledTableCellPrint>
                        </TableRow>

                        <TableRow>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography
                              className={classes.subHeading}
                            ></Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.stores}>
                              {/* SPARES FOR SONAR PAYAL SYSTEM */}
                              {records?.description ?? "-"}
                              {/* --------------to get from svc----------------- */}
                            </Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography
                              className={classes.subHeading}
                            ></Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography
                              className={classes.subHeading}
                            ></Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography
                              className={classes.subHeading}
                            ></Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography
                              className={classes.subHeading}
                            ></Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography
                              className={classes.subHeading}
                            ></Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography
                              className={classes.subHeading}
                            ></Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography
                              className={classes.subHeading}
                            ></Typography>
                          </StyledTableCellPrint>
                          <StyledTableCellPrint
                            align="center"
                            className={classes.tableCellTextArea}
                          >
                            <Typography
                              className={classes.subHeading}
                              align="left"
                            >
                              {records?.remarks}
                            </Typography>
                          </StyledTableCellPrint>
                        </TableRow>

                        {records?.inoteLineItems?.length ? (
                          records?.inoteLineItems?.map((item, id) => (
                            <TableRow>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCell}
                              >
                                <Typography
                                  className={classes.subHeading}
                                >{`(${alphabets[id]})`}</Typography>
                              </StyledTableCellPrint>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCell}
                              >
                                <Typography className={classes.subHeading}>
                                  {item?.description ?? "-"}
                                </Typography>
                                <Typography className={classes.subHeading}>
                                  {item?.partNo ?? "-"}
                                </Typography>
                                <Typography className={classes.subHeading}>
                                  Total Quantity Ordered :{" "}
                                  {item?.orderedQty ?? "-"}
                                </Typography>
                              </StyledTableCellPrint>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCell}
                              >
                                <Typography className={classes.subHeading}>
                                  {item?.uom ?? "-"}
                                </Typography>
                              </StyledTableCellPrint>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCell}
                              >
                                <Typography className={classes.subHeading}>
                                  {item?.tendered ?? "-"}
                                </Typography>
                              </StyledTableCellPrint>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCell}
                              >
                                <Typography className={classes.subHeading}>
                                  {item?.accepted ?? "-"}
                                </Typography>
                              </StyledTableCellPrint>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCell}
                              >
                                <Typography>{`${item?.ledgerFolio}/${
                                  records?.existing
                                    ? +item?.qtyAcceptedToDate
                                    : +item?.qtyAcceptedToDate + +item?.accepted
                                }`}</Typography>
                              </StyledTableCellPrint>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCell}
                              >
                                <Typography className={classes.subHeading}>
                                  {item?.rejected ?? "-"}
                                </Typography>
                              </StyledTableCellPrint>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCell}
                              >
                                <Typography className={classes.subHeading}>
                                  -
                                </Typography>
                              </StyledTableCellPrint>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCellTextArea}
                              >
                                <Typography className={classes.textArea}>
                                  {item?.unitCostStr ?? "-"}
                                </Typography>
                              </StyledTableCellPrint>
                              <StyledTableCellPrint
                                align="center"
                                className={classes.tableCellTextArea}
                              >
                                <Typography className={classes.textArea}>
                                  {item?.unitCostStr ?? "-"}
                                </Typography>
                              </StyledTableCellPrint>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <StyledTableCellPrint
                              align="center"
                              className={classes.tableCell}
                              colSpan={9}
                            >
                              No Line Items
                            </StyledTableCellPrint>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {/* {recordsAfterPagingAndSorting()?.length != 0 &&
                recordsAfterPagingAndSorting()?.length != undefined ? (
                  <TblPagination />
                ) : (
                  ""
                )} */}
                  </Grid>
                </Grid>
              </Grid>
              <br />

              <Typography className={classes.textSize}>
                टिप्पणी:- अंतिम मद के बाद में तत्काल एक रेखा खाींची जाएगी या
                टाइफ की जाएगी। रेखा के नीचे "भंडार का विवरण" नाम के खाने में
                पृथक रूप में दी गई मदों की कुल संख्या इस प्रकार दर्ज की जाएगी।
                निरीक्षण की गई मदों की संख्या ................................
                (शब्दों में)
              </Typography>
              <Typography className={classes.textSize}>
                Note:- A line to be drawn or typed Immediately after the last
                item. Below the line will be entered the total no of items
                separately shown in the Col “DESCRIPTION OF STORES” thus ITEM
                INSPECTED NO. (in word) -
                <span style={{ fontWeight: 600 }}>
                  TOTAL INSPECTED ITEMS- ONE ONLY
                </span>
              </Typography>

              <br />
              <Grid container>
                <Grid
                  item
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  align="left"
                ></Grid>
                <Grid container>
                  <Grid item xs={9} sm={9} md={9} lg={9} xl={9} align="left">
                    <br />
                    {/* <Typography className={classes.subHeading}>
                  ITEMS INSPECTED :
                  <span style={{ fontWeight: 600, textTransform: "capitalize" }}>
                    {records?.inoteLineItems?.length !== null && records?.inoteLineItems?.length !== undefined
                      ? `${converter.toWords(records?.inoteLineItems?.length)} Only`
                      : "- Only"}
                  </span>
                </Typography> */}
                    <Typography className={classes.subHeading}>
                      स्थान / Station :{" "}
                      <span style={{ fontWeight: 600 }}>Bangalore</span>
                    </Typography>
                    <Typography className={classes.subHeading}>
                      तारीख / Dated&nbsp; :{" "}
                      <span style={{ fontWeight: 600 }}>
                        {moment(records?.inoteDate).format("DD-MM-YYYY")}
                      </span>
                    </Typography>
                  </Grid>

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
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handlePrint}
              text="Print"
              variant="contained"
              color="primary"
            >
              Print
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
