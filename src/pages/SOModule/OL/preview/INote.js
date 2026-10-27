/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import "jspdf-autotable";
import React, { useEffect, useState } from "react";

//material-ui
import {
  Dialog,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DialogContent, DialogTitle } from "Utils";

//components
import Button from "components/Button";
import {
  StyledTableCell,
  StyledTableCellPrint,
} from "../../../../components/UseTable";

import MultilineTextField from "components/MultilineTextField";

//icons

//pages

//redux
import { Divider } from "antd";
import axios from "axios";
import AutoCompleteNew from "components/AutoCompleteNew";
import { PDF_SERVER } from "config";
import { saveAs } from "file-saver";
import moment from "moment";
import ReceiptCertificate from "pages/Enclosures/Enclosure12/ReceiptCertificate";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getINoteSignatoryList } from "Redux/Actions/Enclosure/INoteAction";
import { PaperComponent } from "Utils/D3Tree";

function generatePDF(selectedSignatory, inoteDate, records, INote) {
  axios({
    method: "post",
    url: PDF_SERVER + "inote", // Change this to your actual server endpoint
    data: { selectedSignatory, inoteDate, records, INote },
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
    position: 'relative',
    zIndex: 10,
    overflow: 'hidden'
  },
  draftDesign: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: 0,
    margin: 'auto',
    textAlign: 'center',
    fontSize: '32px',
    transform: 'rotate(-30deg)',
    width: 'fit-content',
    zIndex: -1,
    color: '#d5d7d8',
    opacity: 0.4

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
    // textDecoration: "underline",
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
    wordBreak: "none",
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
    width: "250px",
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
    width: "150px",
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
export default function INotePreview({ soObj, onClose }) {
  const classes = useStyles();

  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const roleId = useSelector((state) => state?.loggedInUser?.roleId);

  const [open, setOpen] = React.useState(false);

  const componentRef = React.useRef();
  const [records, setRecords] = useState(null);

  const [signatoryList, setSignatoryList] = useState([]);
  const [selectedSignatory, setSelectedSignatory] = useState(null);
  const [INote, setINote] = useState("");
  const [Amendment, setAmendment] = useState("");
  const { reset, control } = useForm({
    defaultValues,
    mode: "onChange",
  });

  var converter = require("number-to-words");

  const getINoteByOlId = () => {
    if (soObj) {
      axiosInstance("offerLetter/getINoteByOLId/" + soObj?.id)
        .then(({ data }) => {
          const newres = {
            ...data,
            inoteDate: data?.existing
              ? data?.inoteDate
              : data?.cqaoApprovalDate,
            remarks: (
              <span>
                a) Previous Inspection Note No.:
                <br />
                <b>{data?.prevINoteNo ?? "NIL"}</b>
                <br />
                {data?.prevINoteNo ? (
                  <>
                    <b>Dated {data?.prevINoteDate}</b>
                    <br />
                  </>
                ) : (
                  ""
                )}
                <br />
                b) Inspected & accepted Items are marked with Hologram Seal Nos.
                {data?.sealNo}
              </span>
            ),
          };
          setRecords(newres);
          reset(data);
        })
        .catch((err) => console.log("getINoteDetailsByOlId out error", err));
      // reset({
      //   newDd: moment(records?.createdDate).format("YYYY-MM-DD"),
      // });
      console.log("records", records?.createdDate);
    }
  };

  const getINoteSignatories = () => {
    getINoteSignatoryList(loggedInUser?.orgId)
      .then((res) => setSignatoryList(res))
      .catch((err) => toast.error("Something went wrong"));
  };

  useEffect(() => {
    getINoteByOlId();
    getINoteSignatories();
  }, [soObj]);

  const updaterecordsLineItems = (remarks, id) => {
    console.log(id, remarks);
    const newArr = records?.inoteLineItems?.map((item, idx) => {
      if (idx === id) {
        return {
          ...item,
          itemRemarks: remarks,
        };
      }
      return item;

      // accepted: id === idx ? accepted : item?.accepted,
    });
    setRecords({ ...records, inoteLineItems: newArr });
  };

  useEffect(() => {
    setINote(records?.inoteNo);
    setAmendment(records?.amendment);
  }, [records?.inoteNo]);

  let draftText = [];
  for (let i = 0; i < 10; i++) {
    draftText.push(<p>{'Draft '.repeat(6)}</p>);
  }

  return (
    <Dialog open maxWidth="xl" fullWidth onClose={onClose}>
      <DialogContent dividers>
        <Paper className={classes.paper}>
          <span className={classes.draftDesign}>
            {draftText}
          </span>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.headingLeft}>
                भारत सरकार
              </Typography>
              <Typography className={classes.headingLeft}>
                GOVERNMENT OF INDIA
              </Typography>

              <Typography className={classes.subHeading}>
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
                INSPECTION NOTE
              </Typography>

              <Typography className={classes.subHeading}>
                निरीक्षण प्रमाण पत्र
              </Typography>
              <Typography
                className={classes.subHeading}
                style={{ padding: "0px 0px 10px 0px" }}
              >
                I-INSPECTION CERTIFICATE
              </Typography>
              <Typography className={classes.subHeading}>
                <span style={{ color: "red" }}>*</span>
                <span
                  className={
                    records?.typeOfDeliveryINote !== "Full"
                      ? classes.strikethrough
                      : ""
                  }
                >
                  पूरी
                </span>
                <span>/</span>
                <span
                  className={
                    records?.typeOfDeliveryINote !== "Part"
                      ? classes.strikethrough
                      : ""
                  }
                >
                  आंशिक
                </span>
                <span>/</span>
                <span
                  className={
                    records?.typeOfDeliveryINote !== "Further Part"
                      ? classes.strikethrough
                      : ""
                  }
                >
                  अतिरिक्त आंशिक
                </span>
                <span>/</span>
                <span
                  className={
                    records?.typeOfDeliveryINote !== "Completion"
                      ? classes.strikethrough
                      : ""
                  }
                >
                  समापन
                </span>
                <span>सुपुर्दगी</span>
              </Typography>
              <Typography className={classes.subHeading}>
                <span style={{ color: "red" }}>*</span> <span>Delivery in</span>
                <span
                  className={
                    records?.typeOfDeliveryINote !== "Full"
                      ? classes.strikethrough
                      : ""
                  }
                >
                  Full
                </span>
                <span>/</span>
                <span
                  className={
                    records?.typeOfDeliveryINote !== "Part"
                      ? classes.strikethrough
                      : ""
                  }
                >
                  Part
                </span>
                <span>/</span>
                <span
                  className={
                    records?.typeOfDeliveryINote !== "Further Part"
                      ? classes.strikethrough
                      : ""
                  }
                >
                  Further Part
                </span>
                <span>/</span>
                <span
                  className={
                    records?.typeOfDeliveryINote !== "Completion"
                      ? classes.strikethrough
                      : ""
                  }
                >
                  Completion
                </span>
              </Typography>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography
                className={classes.headingRight}
                style={{ padding: "0px 0px 4px 0px" }}
              >
                <span style={{ fontWeight: 600 }}>
                  म.नि.पू.नि.(एस) / ln lieu of D.G.S & D.(S)-84
                </span>
              </Typography>
              <Typography className={classes.textSize}></Typography>
              <Typography
                className={classes.textSize}
                style={{
                  padding: "0px 0px 10px 0px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                निरीक्षण पत्र सं / Inspection Note No:&nbsp;
                {records?.existing == true ? (
                  <Typography style={{ fontWeight: 600 }}>{INote}</Typography>
                ) : (
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
                  />
                )}
                {/* <span style={{ fontWeight: "bold" }}>{records?.inoteNo}</span> */}
              </Typography>
              <Grid container>
                <Grid item xs={7} align="left">
                  <Grid container>
                    <Grid item xs={3} align="left">
                      <Typography className={classes.subHeading}>
                        फाइल सं.
                      </Typography>
                      <Typography className={classes.subHeading}>
                        File No.
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
                  <Grid container>
                    <Grid item xs={6} align="left">
                      <Typography className={classes.subHeading}>
                        प्रति सं.
                      </Typography>
                      <Typography className={classes.subHeading}>
                        Copy No.
                      </Typography>
                    </Grid>
                    <Grid item xs={6} align="left">
                      <Typography className={classes.subHeading}>
                        <span style={{ fontWeight: 600 }}> </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={5} align="left">
                  <Grid container>
                    <Grid item xs={6} align="left">
                      <Typography className={classes.subHeading}>
                        प्रतियों की सं
                      </Typography>
                      <Typography className={classes.subHeading}>
                        No. of Copies
                      </Typography>
                    </Grid>
                    <Grid item xs={6} align="left">
                      <Typography className={classes.subHeading}>
                        <span style={{ fontWeight: 600 }}>8</span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
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
                पूर्ति आदेश सं. और तारीख
              </Typography>
              <Typography className={classes.textSize}>
                Supply order No. and date
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSizeBold}>
                {/* <span style={{ fontWeight: "bold" }}> */}:&nbsp;
                {records?.supplyOrderNo} dated &nbsp;
                {records?.supplyOrderDate
                  ? moment(records?.supplyOrderDate).format("DD-MM-YYYY")
                  : "NA"}{" "}
                &nbsp;&amp; Amdt.dated&nbsp;
                {records?.amendmentDate
                  ? moment(records?.amendmentDate).format("DD-MM-YYYY")
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
                4. मांग पत्र सं. और तारीख / Indent No. and date
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
                : {records?.consignee}
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
                as shown by &nbsp;
                <span style={{ fontWeight: 600 }}>{records?.orgName}</span>
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.textSize}>
                7. (क)
                <span style={{ fontWeight: 600 }}>
                  {records?.offerLetterDate
                    ? moment(records?.offerLetterDate).format("DD-MM-YYYY")
                    : ""}
                  &nbsp;
                </span>
                तारीख को सुपुर्द किये गए/रेल पर रखे गए/निरीक्षण के लिए रखे गए
                सामान
              </Typography>
              <Typography className={classes.textSize}>
                &nbsp;&nbsp;&nbsp;&nbsp;(a) Stores delivered / put on rail /put
                up for inspection on &nbsp; &nbsp; &nbsp;
                <span style={{ fontWeight: 600 }}>
                  :
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
                (b)Stores Inspected on: &nbsp; &nbsp;
                <span style={{ fontWeight: 600 }}>
                  {records?.inspectionStart ?? "-"} to &nbsp;
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
                : {records?.offerLetterNo} dated &nbsp;
                {records?.olDateStr &&
                  moment(
                    records?.olDateStr
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
                authority/reference made to supply Officer regarding penalty :
              </Typography>
              {records?.existing ? (
                <Typography
                  className={classes.textSizeBold}
                  style={{ marginLeft: "18px" }}
                >
                  {records?.amendment}
                </Typography>
              ) : (
                <TextField
                  onChange={(e) => {
                    setAmendment(e.target.value);
                  }}
                  inputProps={{ maxLength: 500 }}
                  style={{
                    width: "1050px",
                    fontSize: "11px",
                    marginLeft: "20px",
                  }}
                  value={Amendment}
                  InputProps={{ classes: { input: classes.textSizeBold } }}
                  variant="outlined"
                  size="small"
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.textSize}>
                {records?.newDdDate && (
                  <span style={{ fontWeight: "bold" }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DD Extn Letter :
                    Provisional DD extended upto {records?.newDdDate} Amendment
                    Letter accorded by IHQ MoD (N)/ DWE vide Fax
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
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        align="center"
                        colSpan={9}
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
                          {/* निविदा स्वीकृति में मद सं. / */}
                          Page No. Item No. in A/T
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          <span style={{ fontWeight: 600 }}>
                            <u>
                              {/* सामान का विवरण / */}
                              Description of stores
                            </u>
                          </span>
                        </Typography>
                        <hr />

                        <Typography className={classes.subHeading}>
                          Total quantity ordered
                        </Typography>
                        <hr />
                        <Typography className={classes.subHeading}>
                          {/* कुल कितनी मात्रा में आर्डर दिया जहाँ डिब्बे में सामान
                          भेजा जाना हो वहाँ निरीक्षक को इस बात का संकेत देना
                          चाहिए कि क्या पूर्ति विक्रेता / क्रेता के डिब्बे में
                          की गई है / */}
                          The Inspector should indicate whether the supply has
                          been made in seller's/buyer's containers.Where stores
                          are required to be supplied in the containers
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        {/* <Typography className={classes.subHeading}>
                          लेखा एकक /
                        </Typography> */}
                        <Typography className={classes.subHeading}>
                          Accounting Unit
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        {/* <Typography className={classes.subHeading}>
                          टेंडर किया गया /
                        </Typography> */}
                        <Typography className={classes.subHeading}>
                          Tendered
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        {/* <Typography className={classes.subHeading}>
                          स्वीकॄत /
                        </Typography> */}
                        <Typography className={classes.subHeading}>
                          Accepted
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        {/* <Typography className={classes.subHeading}>
                          खाता पन्ना में दर्ज किया गया
                        </Typography>
                        <hr />
                        <Typography className={classes.subHeading}>
                          आज की तारीख तक स्वीकृत कुल मात्रा
                        </Typography>
                        <hr /> */}
                        <Typography className={classes.subHeading}>
                          Brought to account in ledger folio
                        </Typography>
                        <hr />
                        <Typography className={classes.subHeading}>
                          Total Quantity Accepted to date
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        {/* <Typography className={classes.subHeading}>
                          अस्वीकृति /
                        </Typography> */}
                        <Typography className={classes.subHeading}>
                          Rejected
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        {/* <Typography className={classes.subHeading}>
                          डी.जी.आई.एस.एम. लंदन या विदेश के किसी दूसरे प्राधिकारी
                          द्वारा जारी किए (यदि कोई हों) निरीक्षण प्रमाण की सं.
                          और तारीख /
                        </Typography> */}
                        <Typography className={classes.subHeading}>
                          No. date of inspection certificate(if any) issued by
                          D.G.I.S.M London or other inspection Authority abroad
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className={classes.tableCell}
                      >
                        {/* <Typography className={classes.subHeading}>
                          अभियुक्तियाँ /
                        </Typography> */}
                        <Typography className={classes.subHeading}>
                          Remarks
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
                        <Typography
                          className={classes.stores}
                          style={{ textDecoration: "underline" }}
                        >
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
                              {item?.indentNo ?? "-"}
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
                            {/* ) : (
                              <TextField
                                variant="outlined"
                                className={classes.textfield}
                                onChange={(e) => {
                                  updaterecordsLineItems(
                                    e.target.value,
                                    item?.remarks,
                                    id
                                  );
                                }}
                                value={item?.accepted}
                                onInput={restrict?.dose}
                              />
                            )} */}
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className={classes.tableCell}
                          >
                            <Typography className={classes.subHeading}>{`${item?.ledgerFolio
                              }/${records?.existing
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
                                {item?.itemRemarks ?? "-"}
                              </Typography>
                            ) : (
                              <MultilineTextField
                                className={classes.textArea}
                                onChange={(e) => {
                                  updaterecordsLineItems(e.target.value, id);
                                }}
                                value={item?.itemRemarks}
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
              TOTAL INSPECTED ITEMS-
              <span style={{ textTransform: "uppercase" }}>{`${records?.inoteLineItems?.length
                ? converter.toWords(records?.inoteLineItems?.length)
                : "ZERO"
                }`}</span>
              ONLY
            </span>
          </Typography>
          <br />
          <br />

          <Grid container>
            <Grid
              item
              xs={4}
              sm={4}
              md={4}
              lg={4}
              xl={4}
              className={classes.box}
              align="left"
            >
              <Typography
                className={classes.subHeading}
                style={{ padding: 4, fontStyle: "italic", fontWeight: 600 }}
              >
                {`"This I-Note is valid till 
             ${moment(records?.inoteDate)
                    .add(1, "M")
                    .format("DD-MM-YYYY")}, for the purpose of
                despatch only."`}
              </Typography>
            </Grid>
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
                  स्थान / Station :
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
                          // onChange={e => onChange(setSelectedDate(e.target.value))}
                          value={value}
                          type="date"
                          size="small"
                          required
                        // variant="outlined"
                        //

                        // error={!!errors.dd}
                        // helperText={errors.dd?.message}
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
                  }}
                  value={selectedSignatory}
                  required
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
            </Grid>
          </Grid>

          <Grid align="center"></Grid>
        </Paper>
        <br />
        <Grid container spacing={2} align="left">
          {/* <Grid item xs={1} align="right">
            <Button
              type="submit"
              //disabled={!records?.existing}
              onClick={() => setOpen(true)}
              variant="contained"
              className={classes.btn}
            >
              Preview
            </Button>
          </Grid> */}

          <Dialog
            open={open}
            // onClose={onClose}
            maxWidth="lg"
            align="center"
            PaperComponent={(props) => (
              <PaperComponent id="draggable-dialog-title78" {...props} />
            )}
          >
            <DialogTitle
              style={{ fontSize: "0.875rem", cursor: "move" }}
              onClose={() => setOpen(false)}
              id="draggable-dialog-title78"
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
                      INSPECTION NOTE
                    </Typography>

                    <Typography className={classes.subHeading}>
                      निरीक्षण प्रमाण पत्र
                    </Typography>
                    <Typography
                      className={classes.subHeading}
                      style={{ padding: "0px 0px 10px 0px" }}
                    >
                      I-INSPECTION CERTIFICATE
                    </Typography>

                    <Typography className={classes.subHeading}>
                      <span style={{ color: "red" }}>*</span>
                      <span
                        className={
                          records?.typeOfDeliveryINote !== "Full"
                            ? classes.strikethrough
                            : ""
                        }
                      >
                        पूरी
                      </span>
                      <span>/</span>
                      <span
                        className={
                          records?.typeOfDeliveryINote !== "Part"
                            ? classes.strikethrough
                            : ""
                        }
                      >
                        आंशिक
                      </span>
                      <span>/</span>
                      <span
                        className={
                          records?.typeOfDeliveryINote !== "Further Part"
                            ? classes.strikethrough
                            : ""
                        }
                      >
                        अतिरिक्त आंशिक
                      </span>
                      <span>/</span>
                      <span
                        className={
                          records?.typeOfDeliveryINote !== "Completion"
                            ? classes.strikethrough
                            : ""
                        }
                      >
                        समापन
                      </span>
                      <span>सुपुर्दगी</span>
                    </Typography>
                    <Typography className={classes.subHeading}>
                      <span style={{ color: "red" }}>*</span>
                      <span>Delivery in</span>
                      <span
                        className={
                          records?.typeOfDeliveryINote !== "Full"
                            ? classes.strikethrough
                            : ""
                        }
                      >
                        Full
                      </span>
                      <span>/</span>
                      <span
                        className={
                          records?.typeOfDeliveryINote !== "Part"
                            ? classes.strikethrough
                            : ""
                        }
                      >
                        Part
                      </span>
                      <span>/</span>
                      <span
                        className={
                          records?.typeOfDeliveryINote !== "Further Part"
                            ? classes.strikethrough
                            : ""
                        }
                      >
                        Further Part
                      </span>
                      <span>/</span>
                      <span
                        className={
                          records?.typeOfDeliveryINote !== "Completion"
                            ? classes.strikethrough
                            : ""
                        }
                      >
                        Completion
                      </span>
                    </Typography>
                  </Grid>

                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
                    <Typography
                      className={classes.headingRight}
                      style={{ padding: "0px 0px 4px 0px" }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        म.नि.पू.नि.(एस) / ln lieu of D.G.S & D.(S)-84
                      </span>
                    </Typography>
                    <Typography className={classes.textSize}>
                      निरीक्षण पत्र सं /
                    </Typography>
                    <Typography
                      className={classes.textSize}
                      style={{ padding: "0px 0px 10px 0px" }}
                    >
                      Inspection Note No.
                      <span style={{ fontWeight: "bold" }}>{INote}</span>
                    </Typography>
                    <Grid container>
                      <Grid item xs={7} align="left">
                        <Grid container>
                          <Grid item xs={3} align="left">
                            <Typography className={classes.subHeading}>
                              फाइल सं.
                            </Typography>
                            <Typography className={classes.subHeading}>
                              File No.
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
                        <Grid container>
                          <Grid item xs={6} align="left">
                            <Typography className={classes.subHeading}>
                              प्रति सं.
                            </Typography>
                            <Typography className={classes.subHeading}>
                              Copy No.
                            </Typography>
                          </Grid>
                          <Grid item xs={6} align="left">
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}></span>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={5} align="left">
                        <Grid container>
                          <Grid item xs={6} align="left">
                            <Typography className={classes.subHeading}>
                              प्रतियों की सं
                            </Typography>
                            <Typography className={classes.subHeading}>
                              No. of Copies
                            </Typography>
                          </Grid>
                          <Grid item xs={6} align="left">
                            <Typography className={classes.subHeading}>
                              <span style={{ fontWeight: 600 }}>8</span>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    align="left"
                  >
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
                      पूर्ति आदेश सं. और तारीख
                    </Typography>
                    <Typography className={classes.textSize}>
                      Supply order No. and date
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                    <Typography className={classes.textSizeBold}>
                      {/* <span style={{ fontWeight: "bold" }}> */}:
                      {records?.supplyOrderNo} dated
                      {records?.supplyOrderDate
                        ? moment(records?.supplyOrderDate).format("DD-MM-YYYY")
                        : "NA"}
                      &amp; Amdt.dated
                      {records?.amendmentDate
                        ? moment(records?.amendmentDate).format("DD-MM-YYYY")
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
                      :
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
                      4. मांग पत्र सं. और तारीख / Indent No. and date
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                    <Typography className={classes.textSizeBold}>
                      :
                      {records?.indentNo
                        ? `${records?.indentNo} Dated `
                        : "NIL"}
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
                      : {records?.consignee}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    align="left"
                  >
                    <Typography className={classes.textSize}>
                      6. प्रमाणित किया जाता है कि नीचे और इसी क्रम में संलग्न
                      पत्र में दर्ज माल का निरीक्षण किया जा चुका है और परिणाम इस
                      प्रकार है
                    </Typography>
                    <Typography className={classes.textSize}>
                      &nbsp;&nbsp;&nbsp;&nbsp;Certified that stores noted below
                      and in the continuation sheets attached have been
                      inspected with result as shown by
                      <span style={{ fontWeight: 600 }}>
                        {records?.orgName}
                      </span>
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                    <Typography className={classes.textSize}>
                      7. (क)
                      <span style={{ fontWeight: 600 }}>
                        {records?.offerLetterDate
                          ? moment(records?.offerLetterDate).format(
                            "DD-MM-YYYY"
                          )
                          : ""}
                        &nbsp;
                      </span>
                      तारीख को सुपुर्द किये गए/रेल पर रखे गए/निरीक्षण के लिए रखे
                      गए सामान
                    </Typography>
                    <Typography className={classes.textSize}>
                      &nbsp;&nbsp;&nbsp;&nbsp;(a) Stores delivered / put on rail
                      /put up for inspection on: &nbsp;&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {records?.offerLetterDate
                          ? moment(records?.offerLetterDate).format(
                            "DD-MM-YYYY"
                          )
                          : ""}
                      </span>
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                    <Typography className={classes.textSize}>
                      (क) सामान निरीक्षण् करने की तारीख &nbsp; &nbsp; &nbsp;
                    </Typography>
                    <Typography className={classes.textSize}>
                      (b)Stores Inspected on: &nbsp; &nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {records?.inspectionStart ?? "-"} To
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
                      : {records?.offerLetterNo} dated{"  "}&nbsp;
                      {records?.olDateStr &&
                        moment(
                          records.olDateStr
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
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    align="left"
                  >
                    <Typography className={classes.textSize}>
                      9. अनुबद्ध समय के अंदर अथवा सक्षम प्राधिकारी द्वारा बढ़ाए
                      गए समय के अंदर मदों की पूर्ति की गई/नहीं की गई दण्ड के लिए
                      पूर्ति अधिकारी को भेजी गई सूचना
                    </Typography>
                    <Typography className={classes.textSize}>
                      &nbsp;&nbsp;&nbsp;&nbsp;The items were/were not supplied
                      within the stipulated time or as extended by the competent
                      authority/reference made to supply Officer regarding
                      penalty :
                    </Typography>
                    <Typography
                      className={classes.textSizeBold}
                      style={{ marginLeft: "18px" }}
                    >
                      {records?.amendment}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    align="left"
                  >
                    <Typography className={classes.textSize}>
                      {records?.newDdDate && (
                        <span style={{ fontWeight: "bold" }}>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DD Extn Letter :
                          Provisional DD extended upto {records?.newDdDate}
                          Amendment Letter accorded by IHQ MoD (N)/ DWE vide Fax
                          {records?.ddExtLetterNo} Dated
                          {records?.ddExtLetterDate}
                        </span>
                      )}
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
                      <Table className={classes.table} size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCellPrint
                              align="center"
                              colSpan={9}
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
                                {/* निविदा स्वीकृति में मद सं. / */}
                                Page No. Item No. in A/T
                              </Typography>
                            </StyledTableCellPrint>
                            <StyledTableCellPrint
                              align="center"
                              className={classes.tableCell}
                            >
                              <Typography className={classes.subHeading}>
                                <span style={{ fontWeight: 600 }}>
                                  <u>
                                    {/* सामान का विवरण / */}
                                    Description of stores
                                  </u>
                                </span>
                              </Typography>
                              <hr />
                              <Typography className={classes.subHeading}>
                                Total quantity ordered
                              </Typography>
                              <hr />
                              <Typography className={classes.subHeading}>
                                {/* कुल कितनी मात्रा में आर्डर दिया जहाँ डिब्बे में
                              सामान भेजा जाना हो वहाँ निरीक्षक को इस बात का
                              संकेत देना चाहिए कि क्या पूर्ति विक्रेता / क्रेता
                              के डिब्बे में की गई है / */}
                                The Inspector should indicate whether the supply
                                has been made in seller's/buyer's
                                containers.Where stores are required to be
                                supplied in the containers
                              </Typography>
                            </StyledTableCellPrint>
                            <StyledTableCellPrint
                              align="center"
                              className={classes.tableCell}
                            >
                              {/* <Typography className={classes.subHeading}>
                              लेखा एकक /
                            </Typography> */}
                              <Typography className={classes.subHeading}>
                                Accounting Unit
                              </Typography>
                            </StyledTableCellPrint>
                            <StyledTableCellPrint
                              align="center"
                              className={classes.tableCell}
                            >
                              {/* <Typography className={classes.subHeading}>
                              टेंडर किया गया /
                            </Typography> */}
                              <Typography className={classes.subHeading}>
                                Tendered
                              </Typography>
                            </StyledTableCellPrint>
                            <StyledTableCellPrint
                              align="center"
                              className={classes.tableCell}
                            >
                              {/* <Typography className={classes.subHeading}>
                              स्वीकॄत /
                            </Typography> */}
                              <Typography className={classes.subHeading}>
                                Accepted
                              </Typography>
                            </StyledTableCellPrint>
                            <StyledTableCellPrint
                              align="center"
                              className={classes.tableCell}
                            >
                              {/* <Typography className={classes.subHeading}>
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
                            <hr /> */}
                              <Typography className={classes.subHeading}>
                                Total Quantity Accepted to date
                              </Typography>
                            </StyledTableCellPrint>
                            <StyledTableCellPrint
                              align="center"
                              className={classes.tableCell}
                            >
                              {/* <Typography className={classes.subHeading}>
                              अस्वीकृति /
                            </Typography> */}
                              <Typography className={classes.subHeading}>
                                Rejected
                              </Typography>
                            </StyledTableCellPrint>
                            <StyledTableCellPrint
                              align="center"
                              className={classes.tableCell}
                            >
                              {/* <Typography className={classes.subHeading}>
                              डी.जी.आई.एस.एम. लंदन या विदेश के किसी दूसरे
                              प्राधिकारी द्वारा जारी किए (यदि कोई हों) निरीक्षण
                              प्रमाण की सं. और तारीख /
                            </Typography> */}
                              <Typography className={classes.subHeading}>
                                No. date of inspection certificate(if any)
                                issued by D.G.I.S.M London or other inspection
                                Authority abroad
                              </Typography>
                            </StyledTableCellPrint>
                            <StyledTableCellPrint
                              align="center"
                              className={classes.tableCell}
                            >
                              {/* <Typography className={classes.subHeading}>
                              अभियुक्तियाँ /
                            </Typography> */}
                              <Typography className={classes.subHeading}>
                                Remarks
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
                              {/* <Typography className={classes.stores}> */}
                              {/* SPARES FOR SONAR PAYAL SYSTEM */}
                              {records?.description ? (
                                <Typography
                                  className={classes.stores}
                                  style={{ textDecoration: "underline" }}
                                >
                                  {records?.description ?? "-"}
                                </Typography>
                              ) : (
                                "-"
                              )}
                              {/* --------------to get from svc----------------- */}
                              {/* </Typography> */}
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
                                  <Typography className={classes.subHeading}>
                                    {item?.indentNo ?? "-"}
                                  </Typography>
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
                                    Total Quantity Ordered :
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
                                  <Typography
                                    style={{ fontSize: "0.875rem" }}
                                  >{`${item?.ledgerFolio}/${records?.existing
                                    ? +item?.qtyAcceptedToDate
                                    : +item?.qtyAcceptedToDate +
                                    +item?.accepted
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
                                    {item?.itemRemarks ?? "-"}
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
                    TOTAL INSPECTED ITEMS-
                    <span style={{ textTransform: "uppercase" }}>{`${records?.inoteLineItems?.length
                      ? converter.toWords(records?.inoteLineItems?.length)
                      : "ZERO"
                      }`}</span>
                    ONLY
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
                    className={classes.box}
                    align="left"
                  >
                    <Typography
                      className={classes.subHeading}
                      style={{
                        padding: 4,
                        fontStyle: "italic",
                        fontWeight: 600,
                      }}
                    >
                      {`"1This I-Note is valid till...
                ${moment(records?.inoteDate)
                          .add(1, "M")
                          .format("DD-MM-YYYY")}, for the purpose of
                despatch only."`}
                      {/* "This I-Note is valid till..... 26-May-23, for the purpose of despatch only. " */}
                    </Typography>
                  </Grid>
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
                        स्थान / Station :
                        <span style={{ fontWeight: 600 }}>Bangalore</span>
                      </Typography>
                      <Typography className={classes.subHeading}>
                        तारीख / Dated&nbsp; :
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

                <Divider></Divider>
                <br />
                <br />
                <div class="pagebreak"> </div>
                <Grid align="center">
                  <ReceiptCertificate />
                </Grid>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  generatePDF(
                    selectedSignatory,
                    records?.inoteDate,
                    records,
                    INote
                  );
                }}
                text="Print"
                variant="contained"
                color="primary"
              >
                Export Pdf
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
