/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import "jspdf-autotable";
import React, { useEffect, useRef, useState } from "react";

//material-ui
import {
  Divider,
  FormHelperText,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { saveAs } from "file-saver";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import nabcb from "../../../assets/Images/Nabcb.JPG";
//redux
import { useDispatch, useSelector } from "react-redux";

//components
import { StyledTableCell } from "../../../components/UseTable";

//icons
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getINoteDetailsByOlIds,
  getINoteSignatoryList,
  saveINoteAction,
} from "Redux/Actions/Enclosure/INoteAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import AutoCompleteNew from "components/AutoCompleteNew";
import Button from "components/Button";
import moment from "moment";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import { toast } from "react-toastify";
import InspectionTestCertificateTable from "./InspectionTestCertificateTable";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { getOlConcessionById } from "Redux/Actions/SupplyOrder/OLAction";
import axios from "axios";
import { PDF_SERVER } from "config";
import { restrict } from "restrict";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  printImage: {
    display: "none",
    "@media print": {
      display: "block",
      height: "100px",
    },
  },
  paper: {
    padding: "40px 40px 10px 40px",
  },
  logoLeft: {
    [theme.breakpoints.up("lg")]: {
      height: 75,
    },
    [theme.breakpoints.down("md")]: {
      height: 72,
    },
    [theme.breakpoints.down("sm")]: {
      height: 68,
    },
    [theme.breakpoints.down("xs")]: {
      height: 66,
    },
  },
  logoRight: {
    [theme.breakpoints.up("lg")]: {
      height: 85,
    },
    [theme.breakpoints.down("md")]: {
      height: 62,
    },
    [theme.breakpoints.down("sm")]: {
      height: 58,
    },
    [theme.breakpoints.down("xs")]: {
      height: 56,
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
    fontWeight: 600,
    fontSize: 14,
  },
  textSize: {
    fontSize: "0.875rem",
    textAlign: "justify",
  },
  textSizeBold: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  tableCell: {
    border: "1px solid black",
  },
  box: {
    border: "1px solid black",
    marginLeft: "10px",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
}));

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  {
    id: "claimId",
    label:
      "एरिया  छूट से आर  आई द्वारा जारी किया जाएगा / Concession/Deviations",
    align: "left",
    disableSorting: true,
  },
  {
    id: "claimDate",
    label:
      "प्रभावित मद का संदर्भ एवं ड्राइंग संख्या / Affected Items Ref and Drg. No.",
    align: "left",
    disableSorting: true,
  },
  {
    id: "claimStatus",
    label: "छूट का संछेप विवरण / Brief Details of Concession/Deviations",
    align: "left",
    disableSorting: true,
  },
  {
    id: "totalClaimedAmount",
    label:
      "छूट का प्राधिकार और तारीख /Authority for Consessions/Deviations and Date",
    align: "left",
    disableSorting: true,
  },
];
const defaultArray = {
  itemRemarks: "",
  olLineItemId: "",
  partNo: "",
  uom: "",
  tendered: "",
  accepted: "",
  rejected: "",
  ledgerFolio: "",
  qtyAcceptedToDate: "",
  remarks: "",
  orderedQty: "",
  hologramRemarks: "",
  indentNo: "",
  description: "",
};

const defaultValues = {
  inoteItemsDet: [defaultArray],
};
export default function InspectionTestCertificate({ fnId, olIds }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const [loading, setLoading] = React.useState(false);
  const [records, setRecords] = useState([]);
  const [data, setData] = useState(null);
  const [signatoryList, setSignatoryList] = useState([]);
  const [selectedSignatory, setSelectedSignatory] = useState(null);
  const [signatoryError, setSignatoryError] = useState(null);
  const [isSignatoryDirty, setIsSignatoryDirty] = useState(false);
  const [rec, setRec] = useState([]);
  const [INote, setINote] = useState("");
  const [remarks, setRemarks] = useState("Satisfactory");
  const roleId = useSelector((state) => state?.loggedInUser?.roleId);
  const printref = useRef(null);
  const [prevInote, setPrevInote] = useState("");
  const [prevInoteDate, setPrevInoteDate] = useState("");
  const [Amendment, setAmendment] = useState("");

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });
  const {
    handleSubmit,
    reset,
    setValue,
    control,
  } = methods;

  const getFoe4DetailsByOlId = () => {
    const queryString = olIds?.map((id) => `olIds=${id}`).join("&");
    getINoteDetailsByOlIds(queryString)
      .then((res) => {
        console.log("res", res);
        setINote(res?.inoteNo);
        setRemarks(res?.cqaoRemarks ? res?.cqaoRemarks : remarks);
        setPrevInote(res?.prevINoteNo);
        setPrevInoteDate(
          res?.prevINoteDate
            ? res?.prevINoteDate.split("-").reverse().join("-")
            : null
        );
        // setPrevInoteDate(moment(res?.prevINoteDate).format("yyyy-mm-dd"));
        setAmendment(res?.amendment);
        const newres = {
          ...res,
          inoteDate: res?.existing ? res?.inoteDate : res?.cqaoApprovalDate,
        };
        setValue(
          "cqaoApprovalDate",
          res?.inoteDate
            ? moment(new Date(res?.inoteDate)).format("YYYY-MM-DD")
            : res?.cqaoApprovalDate
        );
        setData(newres);
        reset(res);
      })
      .catch((err) => toast.error("Something went wrong."));


  };

  React.useEffect(() => {
    getINoteSignatories();
    getFoe4DetailsByOlId();
  }, []);

  useEffect(() => {
    const queryString = olIds?.map((id) => `olIds=${id}`).join("&");
    dispatch(getOlConcessionById(queryString)).then((data) => {
      console.log("dgshgdshe", data);
      setRec(data);
    });
  }, []);

  useEffect(() => {
    if (isSignatoryDirty && selectedSignatory) setSigntoryErrFalse();
  }, [selectedSignatory]);

  const setSigntoryErrTrue = () => {
    setSignatoryError({ error: true, msg: "Required" });
  };

  const setSigntoryErrFalse = () => {
    setSignatoryError({ error: false, msg: null });
  };

  const getINoteSignatories = () => {
    getINoteSignatoryList(loggedInUser?.orgId)
      .then((res) => setSignatoryList(res))
      .catch((err) => toast.error("Something went wrong"));
  };

  const saveINote = (formData) => {
    console.log(formData, "data");
    if (false) {
      setSigntoryErrTrue();
    } else {
      setSigntoryErrFalse();
      const saveData = {
        ...formData,
        inoteNo: INote,
        cqaoRemarks: remarks,
        amendment: Amendment,
        inspectionFileNoteId: fnId,
        empName: selectedSignatory?.ename,
        empDesigation: selectedSignatory?.designation,
        empRole: selectedSignatory?.roleName,
        empNameHindi: selectedSignatory?.enameHi,
        empDesignationHindi: selectedSignatory?.designationHi,
        emproleHindi: selectedSignatory?.roleNameHi,
        prevINoteNo: prevInote,
        prevINoteDate: prevInoteDate
          ? moment(prevInoteDate).format("DD-MM-YYYY")
          : prevInoteDate,
        inoteDate: data?.inoteDate,
        inoteTypeId: 2,
      };
      setRecords(saveData);
      saveINoteAction(saveData)
        .then((res) => {
          toast.success("Data Successfully Submitted.");
          setIsSignatoryDirty(false);
          getFoe4DetailsByOlId();
        })
        .catch((err) => {
          console.log("saveINote error", err);
          toast.error("Something went wrong. Please try again later");
        });
    }
  };
  console.log("sdjfhsd", data?.inoteLineItems, records, rec.length, rec);
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
            {`@media print {.printbox,article{font-size: 10px;}.MuiTypography-body1{font-size: 10px !important;} .printbox b{font-weight: 400;}  .printbox .printbtn{display:none}} .pagebreak { page-break-before: always; }}`}
          </style>
          <Grid container spacing={1}>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3} align="center">
              {/* <img src={ilac} alt="logo" className={classes.logoLeft} /> */}
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="center">
              <Typography className={classes.heading}>
                फॉर्म IV / Form IV
              </Typography>
              <Typography className={classes.heading}>
                निरीक्षण एवं परीक्षण प्रमाण पत्र
              </Typography>
              <Typography className={classes.heading}>
                INSPECTION AND TEST CERTIFICATE
              </Typography>
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3} align="center">
              <img src={nabcb} alt="logo" className={classes.logoRight} />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                फर्म का संदर्भ / Firms's Ref :
                <span style={{ fontWeight: "normal" }}>
                  {data?.offerLetterNo}
                </span>
              </Typography>
              {/* <br /> */}
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                तारीख / Date : &nbsp;&nbsp;
                <span style={{ fontWeight: "normal" }}>
                  {data?.olDateStr &&
                    moment(
                      data.olDateStr
                        .split(",")
                        ?.sort(
                          (a, b) =>
                            new Date(a?.split("-").reverse().join("-")) -
                            new Date(b?.split("-").reverse().join("-"))
                        )[0]
                        .split("-")
                        .reverse()
                        .join("-")
                    ).format("DD-MMM-YYYY")}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                1. निरीक्षण प्राधिकार / QA INSPECTION AUTHORITY
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Controller
                name="orgName"
                control={control}
                //value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    size="small"
                    value={value}
                    onChange={(v) => {
                      onChange(v);
                    }}
                    {...props}
                    placeholder="Org Name"
                    variant="outlined"
                    fullWidth
                    multiline
                    maxRows={2}
                    onInput={restrict.name}
                  />
                )}
              />
              {/* <Typography className={classes.subHeading}>

                : &nbsp;&nbsp;{data?.orgName}
              </Typography> */}
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                2.निरीक्षण की तारिख / DATE OF INSPECTION
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                : &nbsp;&nbsp;
                {data?.inspectionStart ? data?.inspectionStart : "NA"} To&nbsp;
                {data?.inspectionEnd ? data?.inspectionEnd : "NA"}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                3. फर्म का नाम / FIRMS'S NAME
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                :&nbsp;&nbsp; {data?.contractorAddress}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                4. आदेश देने का प्राधिकार / ORDERING AUTHORITY
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Controller
                name="indentor"
                control={control}
                //value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    size="small"
                    value={value}
                    onChange={(v) => {
                      onChange(v);
                    }}
                    {...props}
                    placeholder="Indentor"
                    variant="outlined"
                    fullWidth
                    multiline
                    maxRows={2}
                    onInput={restrict.remarks}
                  />
                )}
              />
              {/* <Typography className={classes.subHeading}>
                :&nbsp;&nbsp; {data?.indentor}
              </Typography> */}
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                5. आदेश संख्या एवं तारीख / ORDER No. AND DATE
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                :&nbsp;&nbsp; {data?.supplyOrderNo ?? "-"} Dated &nbsp;
                {data?.supplyOrderDate
                  ? moment(data?.supplyOrderDate).format("DD-MM-YYYY")
                  : "-"}
                {data?.existing ? (
                  <Typography
                    className={classes.textSizeBold}
                    style={{ marginLeft: "18px" }}
                  >
                    {data?.amendment}
                  </Typography>
                ) : (
                  <TextField
                    onChange={(e) => {
                      setAmendment(e.target.value);
                    }}
                    inputProps={{ maxLength: 500 }}
                    // style={{ fontSize: "11px" }}
                    value={Amendment}
                    InputProps={{ classes: { input: classes.textSizeBold } }}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                )}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                6. क - प्रमाण / (a) DESCRIPTION
              </Typography>
              <Typography className={classes.textSize}>
                [जिस मद से यह प्रमाण पत्र संबंधित है उसका पूर्ण विवरण मात्रा तथा
                पंजीकरण संख्या यदि यह प्रेषित माल केवल आंशिक आपूर्ति है तो इस
                कालम मे आंशिक आपूर्ति लिखा जाना चाहिए / Full description qty and
                registered numbers if any, of the items to which this
                certificate refers (if this consignment represents only part
                supply, this column should be enclosed 'PART SUPPLY')]
              </Typography>
            </Grid>
            <Grid item xs={1}>
              :&nbsp;&nbsp;
            </Grid>
            <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
              <Typography align="center" className={classes.subHeading}>
                <span style={{ textDecoration: "underline" }}>
                  {data?.typeOfDelivery}
                </span>
              </Typography>
              <Controller
                name="description"
                control={control}
                //value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    size="small"
                    value={value}
                    onChange={(v) => {
                      onChange(v);
                    }}
                    {...props}
                    placeholder="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    maxRows={2}
                    onInput={restrict.remarks}
                  />
                )}
              />

              <Typography
                align="center"
                className={classes.subHeading}
                style={{
                  padding: 4,
                  borderTop: "2px solid black",
                  borderBottom: "2px solid black",
                }}
              >
                Total Items Inspected : &nbsp;&nbsp;
                {data?.inoteLineItems?.length}
                <span style={{ fontWeight: 400 }}>
                  (Details as per Enclosure)
                </span>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                (b)PREVIOUS REFERENCE
              </Typography>
              <Typography className={classes.textSize}>
                (यदि पहले कोई आंशिक आपूर्ति दी गयी हो तो उससे संबंधित जारी किए
                गए निरीक्षण एवं परीक्षण प्रमाण- पत्रो की संदर्भ संख्या / Ref.No.
                of I and T certficate, if any, issued in respect of part
                supplies made earlier)
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              {/* <Typography className={classes.subHeading}>:&nbsp;&nbsp;NIL</Typography> */}

              <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item>
                  <TextField
                    onChange={(e) => {
                      setPrevInote(e.target.value);
                    }}
                    inputProps={{ maxLength: 20 }}
                    style={{ width: "180px", fontSize: "11px" }}
                    value={prevInote}
                    InputProps={{ classes: { input: classes.textSize } }}
                    variant="outlined"
                    size="small"
                    placeholder="Prev I-Note No"
                    onInput={restrict.remarks}
                  />
                </Grid>

                <Grid item>
                  <Typography className={classes.subHeading}>
                    &nbsp;&nbsp;DATED&nbsp;&nbsp;
                  </Typography>
                </Grid>

                <Grid item>
                  <TextField
                    variant="standard"
                    title={prevInoteDate}
                    InputProps={{
                      classes: { input: classes.textBold },
                    }}
                    fullWidth
                    type="date"
                    placeholder="Previous I-Note date"
                    // onKeyDown={(e) => {
                    //   e.preventDefault();
                    // }}
                    style={{ marginBottom: "8px" }}
                    value={prevInoteDate}
                    onChange={(e) => {
                      setPrevInoteDate(e.target.value);
                    }}
                  />
                  {/* <TextField
                      placeholder="Previous I-Note date"
                      onChange={(e) => {
                        setPrevInoteDate(e.target.value);
                        console.log("jrjrht,",prevInoteDate)
                      }}
                      // onChange={e => onChange(setSelectedDate(e.target.value))}
                      value={moment(prevInoteDate).format("yyyy-MM-DD")}
                      type="date"
                      size="small"
                      required
                    /> */}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                7.ड्राइंग संख्या तथा विशिष्ट संख्या / Drg. No.and Specification
                No.
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                :
                <span style={{ fontWeight: "normal" }}>
                  &nbsp;&nbsp;As in 6(a) above
                </span>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                8. जिसको भेजा गया/ भेजा जाएगा उसका प्रेषण विवरण यदि उपलब्ध हो /
                DESPATCHED TO AND DESPATCH DETAILS (if available).
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Controller
                name="consignee"
                control={control}
                //value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    size="small"
                    value={value}
                    onChange={(v) => {
                      onChange(v);
                    }}
                    {...props}
                    placeholder="Consignee"
                    variant="outlined"
                    fullWidth
                    multiline
                    maxRows={2}
                    onInput={restrict.remarks}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.subHeading}>
                9. फर्म का प्रमाण -पत्र / FIRM'S CERTIFICATE
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.textSize}>
                मैं / हम यह प्रमाणित करते है कि / I / We hereby certify that :
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                (क) नीचे ग मे दी गई वस्तुओ के ब्योरोको छोड़ कर यहा वर्णित वस्तुओ
                का संगत विशिष्टियों और ड्राइंगो के अनुसार निरीक्षण और परीक्षण
                किया गया |<br /> (a) The articles described here have been
                inspected and tested at our works in accordance with the
                relevant specifications and drawings, with which they comply
                except as detailed at (c) below.
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                (ख) संगत आदेश सहित सामानो की पहचान तथा पैकिंग से संबंधित पूरी कर
                ली गई है या कर ली जाएंगी |<br /> (b) Any other requirements of
                relevant order including those referring to identification and
                packing of articles have been met or will be met.
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                (ग) आदेश मे निर्धारित बोर्ड पर कार्य निष्पादन की गारंटी के बारे
                मे यह प्रमाण -पत्र हमे किसी प्रकार की छूट नहीं देता |<br />
                (c) This certificate does not relieve us from any guarantee
                regarding performanace on board stipulated in the order.
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                (घ) निरीक्षण करने वाले प्राधिकरण के एजेंट के प्राधिकार के बिना
                इन ड्राइंगो तथा विशिष्टियों मे किसी प्रकार का कोई बदलाव नहीं
                किया जा सकता प्राधिकृत बदलाव नीचे पैरा 10 मे दिये गए है |<br />
                (d) There has been no deviation from the drawings and
                specifications execept as authorised by the Inspecting
                Authority/Agency. The authorised deviations are stated in para
                10 below.
              </Typography>
              {/* <br /> */}
            </Grid>
            <Grid
              item
              xs={4}
              sm={4}
              md={4}
              lg={4}
              xl={4}
              className={classes.box}
              align="left"
              style={{ marginTop: "25px" }}
            >
              <Typography
                className={classes.subHeading}
                style={{ padding: 4, fontStyle: "italic", fontWeight: 600 }}
              >
                {`"This I&TC is valid till..... 
                ${data?.inoteDate
                    ? moment(data?.inoteDate).add(1, "M").format("DD-MM-YYYY")
                    : ""
                  }, for the purpose of
                despatch only."`}
                {/* "This I-Note is valid till..... 26-May-23, for the purpose of despatch only. " */}
              </Typography>
            </Grid>
            <br />
            <br />
            <Grid
              item
              xs={3}
              sm={3}
              md={3}
              lg={3}
              xl={3}
              style={{ marginTop: "25px" }}
            ></Grid>
            <Grid
              item
              xs={4}
              sm={4}
              md={4}
              lg={4}
              xl={4}
              align="center"
              style={{ marginTop: "25px" }}
            >
              <Typography className={classes.subHeading}>
                ITEMS INSPECTED ARE MARKED WITH <br />
                <Controller
                  name="remarks"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      size="small"
                      value={value}
                      onChange={(v) => {
                        onChange(v);
                      }}
                      {...props}
                      placeholder="Remarks"
                      variant="outlined"
                      fullWidth
                      multiline
                      maxRows={2}
                      onInput={restrict.remarks}
                    />
                  )}
                />
                {/* {data?.remarks == "null" ||
                data?.remarks == null ||
                data?.remarks == "" ? (
                  data?.remarks
                ) : (
                  <span
                    style={{
                      fontStyle: "italic",
                      fontWeight: 600,
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    {data?.remarks ??
                      data?.remarks.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                  </span>
                )} */}
              </Typography>
            </Grid>
            {/* <br/>
            <br/>
            <br/> */}
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              align="center"
              style={{ marginTop: "25px" }}
            >
              <Typography className={classes.subHeading}>
                {data?.inoteNo}&nbsp;&nbsp; DATED &nbsp;&nbsp;
                {!data?.existing && roleId === 2 ? (
                  <Controller
                    name="cqaoApprovalDate"
                    control={control}
                    //value={value}
                    render={({ field: { onChange, value, ...props } }) => (
                      <span style={{ fontWeight: 600 }}>
                        {moment(value).format("DD-MM-YYYY")}
                      </span>
                    )}
                  />
                ) : (
                  <span style={{ fontWeight: 600 }}>
                    {data?.inoteDate
                      ? moment(data?.inoteDate).format("DD-MM-YYYY")
                      : "   NA"}
                  </span>
                )}
              </Typography>
            </Grid>
            <br />
            <br />
            <br />
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              align="left"
              style={{ marginTop: "20px" }}
            >
              <Typography className={classes.textSize}>
                (च) संगत निरीक्षक एवं परीक्षण प्रमाण - पत्रों तथा रीपोर्टों के
                रेकॉर्ड हमने रख लिए है तथा इनकी प्रतियां निरीक्षक को उपलब्ध करवा
                दी गयी है | निरीक्षक के प्राधिकार के बिना हमारे द्वारा रखे गए
                रेकॉर्ड नष्ट कर दिये जाएंगे |<br />
                (e) Records of the relevant inspection and test certificates and
                reports have been retained by us with copies provided to the
                inspection agency. The records retained by us will not be
                destroyed without his written authority.
              </Typography>
            </Grid>
            <div class="pagebreak"> </div>
            <Divider></Divider>
            <br />
            <br />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.subHeading}>
                10. उपयुक्त पैरा घ के अनुसार दी गई छूट | पिछला संदर्भ यदि कोई है
                तो उसे हर पृष्ठ पर देते हुए जारी रखा जा सकता है |<br />
                Concession/Deviations granted as per para 9(d) referred above
                (continue on separate loose sheets if required giving reasons)
              </Typography>
            </Grid>
          </Grid>
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
                      <TableHead>
                        <TableRow className={classes.tableCell}>
                          {headCells.map((el, index) => (
                            <TableCell key={index}>
                              <Typography
                                style={{ fontSize: "13px", fontWeight: 800 }}
                              >
                                {el.label}
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      {/* <TblHead /> */}
                      {rec.length > 0 ? (
                        rec?.map((input, index) => (
                          <TableBody>
                            <StyledTableCell className={classes.tableCell}>
                              <Typography className={classes.textSize}>
                                {input?.concession}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell className={classes.tableCell}>
                              <Typography className={classes.textSize}>
                                {input?.affectedItemRef}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell className={classes.tableCell}>
                              <Typography className={classes.textSize}>
                                {input?.concessionDetails}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell className={classes.tableCell}>
                              <Typography className={classes.textSize}>
                                {input?.authority}
                              </Typography>
                            </StyledTableCell>
                          </TableBody>
                        ))
                      ) : (
                        <TableBody>
                          <TableRow>
                            <TableCell
                              colSpan={headCells.length}
                              align="center"
                            >
                              <Typography className={classes.text}>
                                <span
                                  style={{ fontWeight: 400, color: "#4A4A4A" }}
                                >
                                  NIL
                                </span>
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}

                      {/* {recordsAfterPagingAndSorting()?.length != 0 &&
                    recordsAfterPagingAndSorting()?.length != undefined ? (
                      <TblPagination />
                    ) : (
                      ""
                    )} */}
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                फार्म की ओर से हस्ताक्षर / SIGNED ON BEHALF OF THE FIRM
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                :&nbsp;&nbsp;
                {data?.contractorAddress ?? "-"}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                हस्ताक्षर / SIGNATURE
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>: </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                पद / POSITION HELD
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>: </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                तारीख / DATE
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              {!data?.existing && roleId === 2 ? (
                <Controller
                  name="cqaoApprovalDate"
                  control={control}
                  //value={value}
                  render={({ field: { onChange, value, ...props } }) => (
                    <Typography className={classes.subHeading}>
                      : {moment(value).format("DD-MM-YYYY")}
                    </Typography>
                  )}
                />
              ) : (
                <Typography className={classes.subHeading}>
                  :
                  {data?.inoteDate
                    ? moment(data?.inoteDate).format("DD-MM-YYYY")
                    : "NA"}
                </Typography>
              )}
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                11. क्षेत्रीय / निवासी निरीक्षक की टिप्पणिया यदि कोई हो /
                REMARKS OF THE Senior QUALITY ASSURANCE OFFICER (if any)
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <TextField
                onChange={(e) => {
                  setRemarks(e.target.value);
                }}
                inputProps={{ maxLength: 20 }}
                style={{ width: "150px", fontSize: "11px" }}
                value={remarks}
                InputProps={{ classes: { input: classes.textSize } }}
                variant="outlined"
                size="small"
                onInput={restrict.remarks}
              />

              {/* <Typography className={classes.subHeading}>
                : <span style={{ fontWeight: "600" }}>Satisfactory</span>
              </Typography> */}
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                12. निरीक्षक का प्रमाण पत्र / INSPECTION AND TEST CERTIFICATE
                NUMBER
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                <style>{`.labelInote {
                display:none;
              } @media print{.iNoteText{display:none;} 
              .labelInote{
                display:block;
              }}`}</style>

                {/* {data?.existing == true ? (
                  <Typography
                    style={{ fontWeight: 600 }}
                    className={classes.subHeading}
                  >
                    : {INote}
                  </Typography>
                ) : ( */}
                <TextField
                  onChange={(e) => {
                    setINote(e.target.value);
                  }}
                  inputProps={{ maxLength: 20 }}
                  style={{ width: "150px", fontSize: "11px" }}
                  value={INote}
                  InputProps={{ classes: { input: classes.textSize } }}
                  variant="outlined"
                  size="small"
                  onInput={restrict.remarks}
                />
                {/* )} */}

                {/* <span style={{ fontWeight: 600 }} className="labelInote">: {data?.inoteNo}</span> */}
              </Typography>
            </Grid>
            <Grid item xs={7} sm={7} md={7} lg={7} xl={7} align="left">
              <Typography className={classes.textSize}>
                प्रमाणित किया जाता है की निरीक्षण और परीक्षण से मैं संतुष्ट हूँ
                / Certified that inspection and test have been carried out to my
                satisfaction.
              </Typography>
              <br />
            </Grid>

            <Grid item xs={5} sm={5} md={5} lg={3} xl={3} align="left">
              {/* <Typography className={classes.subHeading}>Sunil Kumar</Typography>
              <Typography className={classes.subHeading}> SSO-II</Typography>
              <Typography className={classes.subHeading}>ACQAO</Typography> */}
              <div className="signatory">
                <style>{`@media print{.signatory{display:none;}}`}</style>
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
              </div>
              {/* <p className={classes.printImage}></p> */}
              <FormHelperText error={!!signatoryError?.error}>
                {signatoryError?.msg}
              </FormHelperText>
              {selectedSignatory && (
                <>
                  <p className={classes.printImage}></p>
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

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.subHeading}>
                तारीख / DATE
              </Typography>
              <br />
              <br />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              {
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
                        setData({
                          ...data,
                          inoteDate: e.target.value,
                        });
                        console.log("date", e.target.value);
                      }}
                      // onChange={e => onChange(setSelectedDate(e.target.value))}
                      value={value ? moment(value).format("yyyy-MM-DD") : null}
                      type="date"
                      size="small"
                      required
                    />
                  )}
                />
              }
            </Grid>
          </Grid>
          <br />
          <br />
          <div class="pagebreak"> </div>
          <FormProvider {...methods}>
            <InspectionTestCertificateTable
              existing={data?.existing}
              data={data?.inoteLineItems}
              num={data?.inoteNo}
              date={data?.inoteDate}
            />
          </FormProvider>
          <Grid container>
            <Grid item xs={7} sm={7} md={7} lg={7} xl={7} align="left" />
            <Grid item xs={5} sm={5} md={5} lg={5} xl={5} align="left">
              {/* <Typography className={classes.subHeading}>Sunil Kumar</Typography>
              <Typography className={classes.subHeading}> SSO-II</Typography>
              <Typography className={classes.subHeading}>ACQAO</Typography>
              <Typography className={classes.subHeading}>For Senior Quality Assurance Officer</Typography> */}
              {selectedSignatory && (
                <>
                  <p className={classes.printImage}></p>
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
        </div>
        <Grid
          container
          spacing={1}
          justifyContent="flex-end"
          style={{ marginTop: "20px" }}
        >
          <Grid item align="right" alignItems="center">
            {loggedInUser?.orgTypeId == 1 && (
              <Button
                variant="contained"
                color="primary"
                className="printbtn"
                disabled={roleId == 7}
                onClick={handleSubmit(saveINote)}
              >
                {data?.existing ? "Update" : "Save"}
              </Button>
            )}
          </Grid>
          <Grid item alignItems="center" align="center">
            <Button
              variant="contained"
              color="primary"
              className="printbtn"
              //disabled={!data?.existing}
              onClick={() =>
                generatePDF(
                  selectedSignatory,
                  records,
                  data,
                  rec,
                  remarks,
                  INote
                )
              }
            >
              Export PDF
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

function generatePDF(
  selectedSignatory,
  records,
  data,
  firstTableRec,
  remarks,
  INote
) {
  axios({
    method: "post",
    url: PDF_SERVER + "formiv", // Change this to your actual server endpoint
    data: { selectedSignatory, records, data, firstTableRec, remarks, INote },
    responseType: "blob", // Important to tell axios to expect a blob (binary data)
  })
    .then((response) => {
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      saveAs(pdfBlob, "generated_report.pdf"); // Saves the PDF with the given name
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    });
}
