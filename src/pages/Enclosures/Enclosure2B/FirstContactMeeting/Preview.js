/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React from "react";
import {
  Table,
  TableBody,
  Grid,
  TableHead,
  Typography,
  TableRow,
  Dialog,
  DialogActions,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import { StyledPreviewTableCell } from "../../../../components/UseTable";
import { useStyles } from "./FCMTable";
import { DialogContent, DialogTitle } from "Utils";
import moment from "moment";
import Button from "components/Button";
import HeaderPdf from "pages/Layout/HeaderPdf";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import { getFcm } from "Redux/Actions/Inspect/InspectSOAction";
import { PaperComponent } from "Utils/D3Tree";
import { headerValue } from "Globals.js";

// const generatePdf = () => {
//   const [W, H] = [297, 210];
//   const margin = 10;
//   const X = margin;
//   let Y = margin;
//   const now = moment().format("DD-MM-YYYY, HH:mm:ss");

//   const pdf = new jsPDF("l", "mm", [W, H], true);

//   function addHeaderAndFooter(doc) {
//     var totalPages = doc.internal.getNumberOfPages();

//     for (let i = 1; i <= totalPages; i++) {
//       doc.setPage(i);
//       doc.rect(4, 4, W - 9, H - 9);
//       //HEADER
//       // doc.setFontSize(13);
//       // let splitTitle = doc.splitTextToSize("Quality Management Inspection Software", 150);
//       // doc.text(splitTitle, W / 2, margin + 4, { align: "center" });
//       // doc.setFontSize(12);
//       // doc.text("ASSIGN PASS LIST", W / 2, margin * 1.8 , {align: "center",});
//       // FOOTER
//       const str = "Page " + i + " of " + totalPages;
//       doc.setFontSize(10);
//       doc.text(str, W - 28, H - 10);
//     }

//     return doc;
//   }
//   // const pageSize = pdf.internal.pageSize;
//   // const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
//   // const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
//   let h = 50;
//   pdf.addImage(HeaderImg, 1, 6, W, h);
//   Y += h;
//   pdf.setFontSize(12);

//   pdf.autoTable({
//     // html: "#" + tableId,
//     startY: Y,
//     margin: {
//       top: margin,
//       bottom: margin,
//       left: margin,
//       right: margin,
//     },
//     theme: "grid",
//     headStyles: {
//       ...pdfStyle,
//       fontStyle: "bold",
//       fillColor: "#205375",
//       textColor: 255,

//       // lineColor: 255,
//     },
//     bodyStyles: { ...pdfStyle },
//     didDrawCell: function(data) {
//       console.log(data, "table -data");
//     },
//   });

//   let PDF = addHeaderAndFooter(pdf);

//   PDF.save(`OLMS_Report-${now}.pdf`);
// };

const Preview = ({ onClose, soObj, savedData }) => {
  const componentRef = React.useRef();
  const dispatch = useDispatch();
  const classes = useStyles();
  const getFcmById = useSelector((store) => store.inspectOLReducer.fcmById);

  React.useEffect(() => {
    dispatch(getFcm(savedData?.supplyOrderId));
  }, []);
  console.log("wrhgQHWER", getFcmById);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <Dialog
      open={true}
      maxWidth="lg"
      align="center"
      PaperComponent={(props) => (
        <PaperComponent id="draggable-dialog-title12" {...props} />
      )}
    >
      <DialogTitle
        onClose={onClose}
        style={{ fontSize: "0.875rem", cursor: "move" }}
        id="draggable-dialog-title12"
      >
        FIRST CONTACT MEETING WITH FIRM ON RECEIPT OF PURCHASE ORDER
      </DialogTitle>
      <DialogContent>
        <div ref={componentRef}>
          <HeaderPdf headerValue={headerValue("fcm")} />
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <StyledPreviewTableCell
                  align="left"
                  className={classes.tableCellHeader}
                >
                  Sl.No
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCellHeader}
                  align="left"
                >
                  DESCRIPTION
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCellHeader}
                  align="left"
                  colSpan={2}
                >
                  REMARKS
                </StyledPreviewTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  1.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  PO No.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {soObj?.orderNo}
                  {/* {soId} */}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  2.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  PO Date
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {moment(getFcmById?.soDate).format("DD-MM-YYYY")}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  3.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Date of Receipt of PO
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {/* {moment(getFcmById?.dateOfReceipt).format("DD-MM-YYYY")} */}
                  {/* savedData?.dateOfReceipt   ENter value here that is passed from the table */}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  4.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Item Description
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById?.itemDescription}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  5.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  No. of Line Items / Total Quantity
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById?.noOfItems}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  6.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Order Placing Authority
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById?.opa}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  7.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Delivery Date
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById?.deliveryDate}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  8.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  PSPP / No.of Lots
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById?.noOfLots}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  rowSpan={7}
                >
                  9.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  rowSpan={7}
                >
                  Inspection Instruction as per PO
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  Please mark the instructions as applicable-
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (a) Approved Drg and QAP
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  <Checkbox
                    checked={getFcmById.approvedDrg ? true : false}
                    color="primary"
                  />
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (b) Approved QAP
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  <Checkbox
                    checked={getFcmById.approvedQap ? true : false}
                    color="primary"
                  />
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (c) OEM Tech Specs
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  <Checkbox
                    checked={getFcmById.oemTechSpecs ? true : false}
                    color="primary"
                  />
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (d) Import Documents
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  <Checkbox
                    checked={getFcmById.importDocs ? true : false}
                    color="primary"
                  />
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (e) Special Instructions, If any
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  <Checkbox
                    checked={getFcmById.specInst ? true : false}
                    color="primary"
                  />
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (f) Discrepancy in Inspection Instruction, if any, and OPA
                  clarification awaited
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  <Checkbox
                    checked={getFcmById.inspDiscrepancy ? true : false}
                    color="primary"
                  />
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  10.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={3}
                >
                  If Inspection Instruction is as per "Approved Drg and QAP" or
                  "Approved QAP", please furnish details-
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  rowSpan={2}
                ></StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  rowSpan={2}
                >
                  Details of Drawing
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <Grid container>
                    <Grid xs={12}>
                      (a) If first time induction, date of submission of
                      approved drawing to SQAE(L),Bengaluru-
                    </Grid>
                    "newDrgDate"
                  </Grid>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <Grid container>
                    <Grid xs={12}>
                      (b) If existing approved drawing is to be used then
                      indicate concurrence details from OPA/ PD with date of
                      using the same -
                    </Grid>
                    "existDrgDate"
                  </Grid>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  rowSpan={3}
                ></StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  rowSpan={3}
                >
                  Details of QAP
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <Grid container>
                    <Grid xs={12}>
                      (a) If fresh QAP is to be made, date of submission of
                      draft QAP alongwith approved Drawings to CQAE(WE),
                      Bengaluru-
                    </Grid>
                    "freshQapDate"
                  </Grid>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <Grid container>
                    <Grid xs={12}>
                      (b) If existing QAP is to be used then indicate QAP No
                      with date. Concurrence to use the same will be sought by
                      CQAE(WE), Bengaluru from DQA(N), Delhi -
                    </Grid>
                    "existQapDate"
                  </Grid>
                </StyledPreviewTableCell>
                {/* <StyledPreviewTableCell className={classes.tableCell}>(c) QT/ Type test applicable</StyledPreviewTableCell> */}
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <Grid container>
                    <Grid xs={6}>(c) QT/ Type test applicable - </Grid>
                    <RadioGroup value={getFcmById.qtTestApplicable ? 1 : 0} row>
                      <FormControlLabel
                        value={1}
                        control={<Radio size="small" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value={0}
                        control={<Radio size="small" />}
                        label="No"
                      />
                    </RadioGroup>
                  </Grid>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  11.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={3}
                >
                  If Inspection Instruction is as per "OEM Tech Specs", please
                  furnish details-
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                ></StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Detailed Bill of Material available
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <RadioGroup value={getFcmById.detailBom ? 1 : 0} row>
                    <FormControlLabel
                      value={1}
                      control={<Radio size="small" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio size="small" />}
                      label="No"
                    />
                  </RadioGroup>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                ></StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Approved PIL available
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <RadioGroup value={getFcmById.approvedPil ? 1 : 0} row>
                    <FormControlLabel
                      value={1}
                      control={<Radio size="small" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio size="small" />}
                      label="No"
                    />
                  </RadioGroup>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  12.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={3}
                >
                  If Inspection Instruction is as per "Import Documents", please
                  furnish the availability of following documents-
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                ></StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (a) Bill of Lading/ Shipping Bill/ Air Way Bill (Any one)
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <RadioGroup value={getFcmById.billTransport ? 1 : 0} row>
                    <FormControlLabel
                      value={1}
                      control={<Radio size="small" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio size="small" />}
                      label="No"
                    />
                  </RadioGroup>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                ></StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (b) Invoice by OEM or Country of Origin certificate of
                  equipment with Packing list
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <RadioGroup
                    value={getFcmById.invoiceOemOriginCert ? 1 : 0}
                    row
                  >
                    <FormControlLabel
                      value={1}
                      control={<Radio size="small" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio size="small" />}
                      label="No"
                    />
                  </RadioGroup>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                ></StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (c) Bill of Entry into Warehouse
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <RadioGroup value={getFcmById.billEntryWarehouse ? 1 : 0} row>
                    <FormControlLabel
                      value={1}
                      control={<Radio size="small" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio size="small" />}
                      label="No"
                    />
                  </RadioGroup>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                ></StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (d) Certificate of Conformity indicating Governing
                  Specifications and values of which the item are tested
                  alongwith OEM Test cerrtificate/ Reports/ Date sheet/
                  Catalouge
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <RadioGroup value={getFcmById.certOfConfirmity ? 1 : 0} row>
                    <FormControlLabel
                      value={1}
                      control={<Radio size="small" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio size="small" />}
                      label="No"
                    />
                  </RadioGroup>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                ></StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (e)Guarantee/ Warranty
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  <RadioGroup value={getFcmById.warranty ? 1 : 0} row>
                    <FormControlLabel
                      value={1}
                      control={<Radio size="small" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio size="small" />}
                      label="No"
                    />
                  </RadioGroup>
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  rowSpan={15}
                >
                  13.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={3}
                >
                  If Inspection Instruction is as per "Import Documents", please
                  furnish the availability of following documents-
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={3}
                >
                  Raw Material Inspection
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (a) Melt/ Pouring
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.meltPouring}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (b) Sample testing (NABL)
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.sampleTestNabl}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={3}
                >
                  In Process Inspection (Component level/ Sub-assembly stage/
                  Unit Level)
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (c) Physical Checks, Functional checks, ESS, Functional checks
                  post ESS @ PCB level
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.inproInspPcb}{" "}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (d) Physical Checks, Functional checks, ESS, Functional checks
                  post ESS @ Unit level
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.inproInspUnit}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (e) NDTs, Pressure Test, ECT
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.inproInspNpe}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={3}
                >
                  Final Stage
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (f) Qualification Tests (ET, EMI/EMC)
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.finalQt}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (g) Pre-FATs, FATS, Endurance
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.finalFats}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (h) Packing & Preservation, PDI and Stam in
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.finalPacking}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (i) Issuance of I-Note/ I and TC/ Dis atch Clearance
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.finalClearance}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (j) Issuance of Vendor Ratin
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.finalVendorRating}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  (k) Dispatch to Consignee
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.finalConsignee}
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  rowSpan={4}
                >
                  14.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Sub-Order Details
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  Sub-Order Details
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Sub-Vendor Name and Address
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Item Description
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  QA Jurisdiction/ Sub-Nominated Agency
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  TextField size="small"
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  TextField size="small"
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  TextField size="small"
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  TextField
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  TextField
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  TextField
                </StyledPreviewTableCell>
              </TableRow>
              <TableRow>
                <StyledPreviewTableCell className={classes.tableCell}>
                  15.
                </StyledPreviewTableCell>
                <StyledPreviewTableCell className={classes.tableCell}>
                  Any other technical issues/ Clarifications pertaining to PO,
                  Drawings, QAP, Subnomination, Delivery Date, Offer Letter etc.
                  if any-
                </StyledPreviewTableCell>
                <StyledPreviewTableCell
                  className={classes.tableCell}
                  colSpan={2}
                >
                  {getFcmById.others}
                </StyledPreviewTableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Grid
            container
            spacing={3}
            style={{ marginTop: 8 }}
            className="sign-container"
          >
            <Grid item xs={6} align="left">
              <Typography color="primary">Signature of Firm's Rep</Typography>
            </Grid>
            <Grid item xs={6} align="left">
              <Typography color="primary">Signature of SQAE(L) Rep</Typography>
            </Grid>
            <Grid item xs={6} align="left">
              <Typography>Name: _______________________</Typography>
            </Grid>
            <Grid item xs={6} align="left">
              <Typography>Name: _______________________</Typography>
            </Grid>
            <Grid item xs={6} align="left">
              <Typography>Designation: ___________________</Typography>
            </Grid>
            <Grid item xs={6} align="left">
              <Typography>Designation: ___________________</Typography>
            </Grid>
            <Grid item xs={6} align="left">
              <Typography>Date: ___________________</Typography>
            </Grid>
            <Grid item xs={6} align="left">
              <Typography>Date: ___________________</Typography>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePrint} text="Print"></Button>
      </DialogActions>
    </Dialog>
  );
};

export default Preview;
