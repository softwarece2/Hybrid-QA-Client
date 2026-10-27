import { Container, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { ArrowBack } from "@material-ui/icons";
import Button from "components/Button";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  tableDesign: {
    width: "100%",
    borderCollapse: "collapse",
    "& tbody tr td": {
      border: "none",
      padding: "8px 2px",
      fontSize: "14px",
      fontWeight: 300,
      textAlign: "left",
      verticalAlign: "top",
    },
  },
  textFontSize: {
    fontSize: "14px",
    fontWeight: 300,
    marginTop: "0px",
    textAlign: "justify",
  },
  noMargin: {
    margin: 0,
    fontWeight: 300,
  },
}));

export default function Qcc({ row, olId }) {
  const classes = useStyles();
  const printRef = useRef();
  const dispatch = useDispatch();
  const [qccDetails, setQccDetails] = useState({});
  const iNoteLineItems = qccDetails.inoteLineItems?.[0] || {};
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  console.log(formattedDate);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const { reset } = useForm({
    defaultValues: {
      accepted: null,
      rejected: null,
      rfr: null,
      remarks: "",
    },
  });
  useEffect(() => {
    axiosInstance("internalInote/getINoteByOlId/" + olId)
      .then(({ data }) => {
        setQccDetails(data);
        const iNoteLineItems = data.inoteLineItems?.[0] || {};

        reset({
          accepted: iNoteLineItems.accepted,
          rejected: iNoteLineItems.rejected,
          rfr: iNoteLineItems.rfr,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [olId, reset]);

  return (
    <Container>
      <Button
        startIcon={<ArrowBack />}
        variant="contained"
        color="secondary"
        style={{ marginBottom: "12px" }}
        onClick={() => {
          dispatch(selectItem(<INoteTable />));
        }}
      >
        Back
      </Button>
      <div ref={printRef}>
        <Grid container>
          <Grid xs={6}>
            <p className={classes.textFontSize}>
              Quality Confirmation Certificate
            </p>
          </Grid>
          <Grid xs={6}>
            <p className={classes.textFontSize}>OFD/QCF/001</p>
          </Grid>
          <Grid xs={6}>
            <p className={classes.textFontSize}>Ordnance Factory, Dehradun</p>
          </Grid>
          <Grid xs={6}>
            <p className={classes.textFontSize}>Dated :{formattedDate}</p>
          </Grid>
        </Grid>
        <table className={classes.tableDesign} style={{ marginBottom: "12px" }}>
          <tbody>
            <tr style={{ borderBottom: "1px dashed black" }}>
              <td style={{ width: "35%" }}>WO NO : {qccDetails.workOrderNo}</td>
              <td colSpan={2}>WT NO : {qccDetails.warrantyNo}</td>
              <td colSpan={2}>Section : </td>
            </tr>
            <tr style={{ borderBottom: "1px dashed black" }}>
              <td style={{ width: "35%" }}>DESCRIPTION</td>
              <td>
                <br />
                Specification Number
              </td>
              <td>Qty Tendered</td>
              <td style={{ width: "15%" }}>
                Deviation Concessions on components with details & Pt.Nos.
              </td>
              <td>Remarks</td>
            </tr>
            <tr style={{ borderBottom: "1px dashed black" }}>
              <td style={{ width: "35%" }}>{iNoteLineItems.description}</td>
              <td>
              
                <br />
              
              </td>
              <td>{iNoteLineItems.tendered}</td>
              <td></td>
              <td>{iNoteLineItems.remarks}</td>
            </tr>
            <tr style={{ borderBottom: "1px dashed black" }}>
              <td colSpan={1}>
                {" "}
                {/* Use colSpan=1 to take up only one cell */}
                REGD NOs. :-
                <br /> {iNoteLineItems.regNos && Array.isArray(iNoteLineItems.regNos)
                ? iNoteLineItems.regNos.join(", ")
                : "No registration numbers available"}
              </td>
            </tr>
          </tbody>
        </table>

        <p className={classes.textFontSize}>
          1. Certified that above stores/assembly has been manufactured from
          specified materials and all components are as per
          drawing/specification, except deviation/concessions under column 5 and
          meet quality standard to design & inspection requirements. Necessary
          inspection report as listed below are attached.
        </p>
        <p className={classes.textFontSize}>
          2. All accessories provided/supplied with above store are purchased /
          Inspected by OFD, D. {iNoteLineItems.accepted} are found of acceptable
          standard.
        </p>
        <p className={classes.textFontSize}>
          3. The manufacturer warranty for 18 months for above devices is
          provided from date of issue Voucher for trouble free operation subject
          to proper storage and use of products / periodic
          maintenance/handling/transportation.
        </p>
        <br />
        <div style={{ display: "flex", gap: "12px" }}>
          <p className={classes.textFontSize}>Encls:</p>
          <p className={classes.textFontSize}>
            1) I/Note NO :{qccDetails.inoteNo} dtd : {formattedDate}
            <br /> 2) Inspection Report
            <br />
            3) Transmission Slip
          </p>
        </div>
        <br />
        <p className={classes.textFontSize}>
          It is certified that all raw material/components MTC have been
          uploaded in NQDBMS .
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "30px",
          }}
        >
          <p className={classes.textFontSize}>
            for GENERAL MANAGER
            <br /> ORDNANCE FACTORY
            <br />
            DEHRADUN
          </p>
        </div>

        <div style={{ width: "40%", fontSize: "14px" }}>
          <p className={classes.noMargin} style={{ textAlign: "right" }}>
            TRANSMISSION SLIP
            <br />
            _____________________
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={classes.noMargin}>WO No : {qccDetails.workOrderNo}</p>
            <p className={classes.noMargin}>WT No : {qccDetails.warrantyNo}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={classes.noMargin}>I-Note NO : {qccDetails.inoteNo}</p>
            <p className={classes.noMargin}>
              I-Note DT: {qccDetails.inoteDate}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "left" }}>
            <p className={classes.noMargin}>NOMENCLATURE : {iNoteLineItems.description}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p className={classes.noMargin}>
              REGD NOs. & TRANSMISSION Value (In %):
            </p>
            <p className={classes.noMargin}>
              --------------------------------------
            </p>
            <p className={classes.noMargin}>
              {iNoteLineItems.regNos && Array.isArray(iNoteLineItems.regNos)
                ? iNoteLineItems.regNos.join(", ")
                : "No registration numbers available"}
            </p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handlePrint}
        >
          Print
        </Button>
      </div>
    </Container>
  );
}
