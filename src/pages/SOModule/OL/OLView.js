/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  LinearProgress,
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { WING_ID } from "../../../Globals";
import { headerValue } from "Globals.js";
import { indigo, teal } from "@material-ui/core/colors";
import Button from "components/Button";
import { StyledTableCell } from "components/UseTable";
import HeaderPdf from "pages/Layout/HeaderPdf";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { olDetails } from "pages/Services/URLs";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { getInspectOL } from "Redux/Actions/Inspect/InspectOLAction";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    padding: "15px 15px 15px 15px",
    [theme.breakpoints.down("lg")]: {
      width: "98%",
    },
    [theme.breakpoints.down("md")]: {
      width: "93%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "88%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "83%",
    },
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
  subHeading: {
    fontSize: "12px",
    fontWeight: 400,
  },
  headingNote: {
    fontWeight: 600,
  },
  textSize: {
    fontSize: "0.875rem",
  },
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  checkbox: {
    fontWeight: "bold",
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  text: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: theme.palette.secondary.main,
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  print: {
    " &:page": {
      size: "portrait",
    },
    backgroundColor: indigo[800],
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: indigo[800],
      color: theme.palette.common.white,
    },
  },
}));

const OLView = ({ openDialog, setOpenDialog, id }) => {
  const classes = useStyles();
  const inspectOlId = useSelector(
    (store) => store.inspectOLReducer.inspectOlNumber
  );
  const [value, setValue] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  getInspectOL();
  const handleClose = () => {
    setOpenDialog(false);
  };
  const fetchLI = () => {
    setLoading(true);
    axiosInstanceTrans
      .get(olDetails + id)
      .then(({ data }) => {
        setValue(inspectOlId);
        setRecords(data);

        console.log("efwut", records);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });

    setLoading(false);
    setRecords([]);
  };

  useEffect(() => {
    openDialog && fetchLI();
  }, []);

  // useEffect(() => {
  //   if (inspectOlId) {
  //     fetchLI(inspectOlId);
  //   }
  // }, [inspectOlId]);
  // useEffect(()=> {
  //   fetchSOPODetails();
  // },[]);

  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      <Dialog
        open={openDialog}
        maxWidth="xl"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title37" {...props} />
        )}
      >
        <DialogTitle
          id="draggable-dialog-title37"
          onClose={handleClose}
          style={{ cursor: "move" }}
        >
          {isArmy ? "QACL" : "OL"} for Customer Inspection
        </DialogTitle>

        <DialogContent dividers>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("a")} />

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
              <Typography className={classes.subHeading}>
                ग्राहक निरीक्षण के लिए प्रस्ताव पत्र/ OFFERING LETTER FOR
                CUSTOMER INSPECTION
              </Typography>
              <br />
            </Grid>
            <Grid container spacing={0} align="center">
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                <Typography className={classes.subHeading}>
                  नियंत्रण सं /{" "}
                  <span style={{ fontWeight: 400 }}>
                    {" "}
                    CONTROL NO : {records?.olNumber}
                  </span>
                </Typography>
                <Typography className={classes.subHeading}>
                  ओएल दिनांक /{" "}
                  <span style={{ fontWeight: 400 }}>
                    {" "}
                    {isArmy ? "QACL" : "OL"} DATE : {records?.offerDate}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                <Typography className={classes.subHeading}>
                  प्रति /{" "}
                  <span style={{ fontWeight: 400 }}>
                    TO : {records?.organizationName}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={0} align="center">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
                <Typography className={classes.subHeading}>
                  महोदय / <span style={{ fontWeight: 400 }}>Dear Sir ,</span>
                </Typography>

                <Typography className={classes.subHeading}>
                  नीचे दर्शित उपस्करों / सहायक उपकरणों / पुर्जों का निरीक्षण
                  किया गया है और उन्हें ठेके में उल्लिखित विनिर्देशों / आरेखणों
                  के अनुरूप पाया गया है. मद / मदें आपके निरीक्षण तथा स्वीकृति
                  हेतु प्रस्तुत हैं :
                </Typography>
                <Typography className={classes.subHeading}>
                  <span style={{ fontWeight: 400 }}>
                    {" "}
                    Equipment/Accessories/Spares shown below have been inspected
                    and found conforming to specification/drawings mentioned in
                    the contract. The item(s) is/are offered for your inspection
                    and clearance :
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={0}>
              <Grid
                item
                xs={4}
                align="left"
                style={{ padding: "0px 0px 0px 0px" }}
              >
                <Typography className={classes.subHeading}>
                  इंडेंट सं /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Indent No : {records?.soNumber}
                  </span>
                </Typography>
                <Typography className={classes.subHeading}>
                  इंडेंट दिनांक /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Indent Date : {records?.indentDate}
                  </span>
                </Typography>
                <Typography className={classes.subHeading}>
                  परियोजना का नाम /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Project Name : {records?.projectName}
                  </span>
                </Typography>
                <Typography className={classes.subHeading}>
                  विक्रय आदेश सं /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Sale Order : {records?.saleOrderNoStr}
                  </span>
                </Typography>
                <Typography className={classes.subHeading}>
                  आई नोट सं /{" "}
                  <span style={{ fontWeight: 400 }}>Inote No :</span>
                </Typography>
                <Typography className={classes.subHeading}>
                  आई नोट दिनांक /{" "}
                  <span style={{ fontWeight: 400 }}>Inote Date :</span>
                </Typography>
                <Typography className={classes.subHeading}>
                  सुपुर्दगी दिनांक /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Delivery Date : {records?.offerDate}
                  </span>
                </Typography>
              </Grid>

              <Grid item xs={3} align="left">
                <Typography className={classes.subHeading}>
                  प्रेषिती /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Consignee : {records?.consigneeAddress}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={3} align="left">
                <Typography className={classes.subHeading}>
                  निरीक्षण का स्तर /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Level of Insp : {records?.inspectionLevelStr}
                  </span>
                </Typography>
                <Typography className={classes.subHeading}>
                  निरीक्षण की स्थिति /{" "}
                  <span style={{ fontWeight: 400 }}>Stage of Insp :</span>
                </Typography>
                <Typography className={classes.subHeading}>
                  निरीक्षण की प्रकृति /{" "}
                  <span style={{ fontWeight: 400 }}>Nature of Insp :</span>
                </Typography>
              </Grid>
            </Grid>
            <br />

            <Grid container spacing={0} alignItems="center">
              <TableContainer>
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
                    <TableRow>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          {" "}
                          क्. सं / Sl.No <br /> इंडेंट क् / Ind sl
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          बीइएल पाटं सं / <br /> BEL Part No
                          <br /> सीएटी पाटं सं / <br /> CAT Part No
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          विवरण / Description
                          <br />
                          ग्राहक सामग्री विवरण / <br /> Cast Material Desc
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left" colSpan={1}>
                        <Typography className={classes.subHeading}>
                          आदाशत मात्रा / <br /> Qty Ordered
                          <br /> सुपुर्द मात्रा / <br /> Qty Delivered
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          प्रस्तुत मात्रा /<br /> Qty Offered
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          यूओएम /
                          <br />
                          UOM
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          आइएसएस स्तर /<br />
                          Issue Level
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          स्वीकृत मात्रा /<br />
                          Qty Accepted
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          अस्वीकृत मात्रा /
                          <br />
                          Qty Rejected
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          इकाई मूल्य / <br />
                          Unit Price
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          कुल मूल्य / <br />
                          Total Value
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Typography className={classes.subHeading}>
                          प्राथमिकता / <br />
                          Priority
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records?.olLineItemDtos?.length >= 0
                      ? records?.olLineItemDtos?.map((input, index) => (
                          <TableRow key={index}>
                            <StyledTableCell>
                              {index + 1}
                              <br />
                              {input?.soLineItemNo}
                            </StyledTableCell>
                            <StyledTableCell>{input?.partNo}</StyledTableCell>
                            <StyledTableCell>
                              {input?.description}
                            </StyledTableCell>
                            <StyledTableCell>
                              {input?.orderedQty}
                              <br />
                              {input?.deliveredQty}
                            </StyledTableCell>
                            <StyledTableCell>
                              {input?.offeredQty}
                            </StyledTableCell>
                            <StyledTableCell>{input?.uomName}</StyledTableCell>
                            <StyledTableCell>
                              {input?.issueLevel}
                            </StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell>{input?.unitCost}</StyledTableCell>
                            <StyledTableCell>
                              {input?.itemValue}
                            </StyledTableCell>
                            <StyledTableCell>{input?.priority}</StyledTableCell>
                          </TableRow>
                        ))
                      : ""}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <br />

            <Grid container spacing={0} align="right">
              <Grid item xs={4} align="left">
                <Typography className={classes.subHeading}>
                  कुल रिकॉर्ड सं /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Total No Of Records :{" "}
                  </span>
                </Typography>
                <Typography className={classes.subHeading}>
                  उपरोक्त मदों का कुल मूल्य /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Total Value : {records?.itemValue}
                  </span>
                </Typography>
                <Typography className={classes.subHeading}>
                  अभियुक्तियाँ /{" "}
                  <span style={{ fontWeight: 400 }}>
                    Remarks : {records?.remarks}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={8} align="right">
                <Typography className={classes.subHeading}>
                  भवदीय /{" "}
                  <span style={{ fontWeight: 400 }}>Yours Faithfully</span>
                </Typography>
                <Typography className={classes.subHeading}>
                  कृते भारत इलेक्ट्रॉनिक्स लिमिटेड /{" "}
                  <span style={{ fontWeight: 400 }}>
                    For Bharat Electronics Ltd.
                  </span>
                </Typography>
              </Grid>
              <br />
              <Grid item xs={12}>
                <Typography className={classes.subHeading}>
                  हस्ताक्षर व मोहर /{" "}
                  <span style={{ fontWeight: 400 }}>Sign and Stamp</span>
                </Typography>
                <Typography className={classes.subHeading}>
                  बी ई एल के निरीक्षक /{" "}
                  <span style={{ fontWeight: 400 }}>BEL Inspector</span>
                </Typography>
                <Typography className={classes.subHeading}>
                  दिनांक / <span style={{ fontWeight: 400 }}>Date</span>
                </Typography>
              </Grid>
              <Grid item xs={12} align="right">
                {/* <Typography className={classes.subHeading}>
                  HEMANTH KUMAR
                </Typography>
                <Typography className={classes.subHeading}>
                  VENKATESH
                </Typography>*/}
                <Typography className={classes.subHeading}>APPROVED</Typography>
                {/* <Typography className={classes.subHeading}>
                  12-01-2023
                </Typography>  */}
              </Grid>
            </Grid>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            className={classes.print}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OLView;
