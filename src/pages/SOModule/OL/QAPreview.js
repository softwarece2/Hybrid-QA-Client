import { useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@material-ui/core";
import { useReactToPrint } from "react-to-print";
import { Title } from "./QAReport";
import sqaeImg from "assets/Images/sqae_logo.png";

export default function QAPreview({ onClose, data }) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "QA Report", // Optional: sets the document title
    pageStyle: `@media print {
      .header-table {
        display: block;
      }
    }`,
    copyStyles: true,
  });

  console.log(data, "data");

  return (
    <Dialog open maxWidth="lg" fullWidth>
      <DialogContent ref={componentRef} style={{ paddingInline: 16 }}>
        <PageHeader />
        <Grid
          container
          spacing={1}
          style={{ maxWidth: 800, marginInline: "auto", marginBottom: 24 }}
        >
          <Grid item xs={12}></Grid>
          <Grid item xs={6}>
            <Typography>
              <b>A.</b> QA Call Letter
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.qaCallLetter ||
                "......................................................................" ||
                "sample"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              {" "}
              <b>B.</b> Scrutiny of QACL
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.srutnyQACL ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b>C</b>. Pre inspection Report
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.preInspReport ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              {" "}
              <b>D</b>. Guarantee Certificate / Warranty Certificate
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.gorWCert ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              {" "}
              <b>E</b>. Calibration Report of Test Eqpt
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.calibReportTest ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              {" "}
              <b>F</b>. SQAE (L) Test Results
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.sQAETestResult ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b>G</b>. QA Report
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.qaReport ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b>H</b>. Confirmatory Check Report
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.confirmatoryCheckReport ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b>J</b>. Vigilance Check Report
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.vigilanceCheckReport ||
                "......................................................................"}
            </Typography>
          </Grid>
        </Grid>

        <div style={{ pageBreakAfter: "always" }}></div>
        <PageHeader />
        <Typography
          variant="h6"
          align="center"
          style={{ textDecoration: "underline" }}
        >
          QUALITY ASSURANCE REPORTS:SQAE (L)
          <br />
          Bengaluru
        </Typography>
        <Typography variant="h7">Case/File No:</Typography>

        <Title>PART 'A' : QUALITY ASSURANCE NOTE DATA</Title>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>A.1</b> Firm's Name And Address
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.a1 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>A.2</b> SO/ AT No. & Date
            </Typography>
          </Grid>
          <Grid item xs={6} >
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.a2 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>A.3</b> Indentor
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.a3 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>A.4</b> Indent No.
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.a4 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>A.5</b> Consignee
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.a5 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>A.6</b> Stores Put up for Quality
              Assurance on dates
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.a6 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>A.7</b> Stores Quality Assured on
              dates
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.a7 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>A.8</b> Contractors QA call letter
              No & date
            </Typography>
          </Grid>
          <Grid item xs={6} style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
            <Typography>
              {data?.a8 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>A.9.a.</b>Class of deviation (if
              any)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.a9a ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>b.</b> Class of deviation (if any)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.a9b ||
                "......................................................................"}
            </Typography>
          </Grid>
          {/* TODO: make a table  */}
 
           <table className="spares-table">
              <thead>
                <tr>
                  <th>Item no.</th>
                  <th>Des. Of Eqpt/Stores/Spares</th>
                  <th>A/c Unit</th>
                  <th>Qty Unit</th>
                  <th>Qty tender</th>
                  <th>Qty Accepted</th>
                  <th>Brought to ledger</th>
                  <th>Rejected</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>

          <Grid item xs={12}>
            <Typography>
              <Typography>
                {" "}
                <b style={{ marginRight: 8 }}>Notes:</b>
              </Typography>
            </Typography> 
            <Typography>
              <b style={{ marginRight: 8 }}>1.</b> In case of any specified mode
              of payment i.e. for 80% or 98% payment same should be mentioned on
              top portion of the Inspection Note.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>2.</b> Delivery / Extended Delivery
              date valid up to{" "}
              <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.notes2a ||
                "......................................................................"}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <b style={{ marginRight: 8 }}>3.</b> QA Call letter received on{" "}
                  <span  style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
                 {data?.notes3a ||
                "......................................................................"}{" "}
              </span>
              . In view this Fag End Notice not issued / issued to firm vide
              encl 
               <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
               {" "}{data?.notes3b || "...................................."}
              </span>
              
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <b style={{ marginRight: 8 }}>4.</b> Inspection Note should be /
              should not be affixed with a stamp for franking clause.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <b style={{ marginRight: 8 }}>5.</b> Percentage to be with held
              for non supply of literature should be shown on top of portion of
              Inspection Note.
            </Typography>
          </Grid>

          <div style={{ pageBreakAfter: "always" }}></div>
          <Grid item xs={12}>
            <PageHeader />
          </Grid>
          {/* ====================== A END ====================================== */}

          <Grid item xs={12}>
            <Title>
              PART 'B' QUALITY ASSURANCE RECORDS
              <br />
              <span style={{ fontSize: 14, color: "red" }}>
                (To be completed by Officials QA Team)
              </span>
            </Title>
          </Grid>

          <Grid item xs={12}>
            <Typography>
              <b style={{ marginRight: 8 }}>B.1</b> Paper particulars
            </Typography>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(a)</b>
              &nbsp;&nbsp;&nbsp;Specification
            </Typography>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(b)</b>
              &nbsp;&nbsp;&nbsp;Drawing
            </Typography>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(b)</b>
              &nbsp;&nbsp;&nbsp;Test Schedule
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.2</b> Accepted Stores cost: Rs{" "}
              <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b2 ||
                "......................................................................"}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.3</b> Pre-inspection report of
              firm received and verified, found acceptable / comments are as per
              enclosure{" "}
              <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
                {data?.b3 ||
                "......................................................................"}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.4</b> It is verified that
              previously quality assured but not accepted and rejected stores
              kept in BondRoom were verified and found available before
              commencing the QA of present lot{" "}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.5</b> It is certified that true
              Xerox copy of Railway Receipt for dispatch of previous lot / lots
              have been –
            </Typography>
            <Typography>
              <b style={{ marginRight: 8 }}>(a)</b> already received from firm
              vide L/No{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b5a || ".........................................."}
                </span>
            </Typography>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>(b)</b> not received reasons given
              by firm attached at encl{" "}
              {data?.b5b || ".........................................."}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.6</b> Details of sampling of raw
              material, finished stores, test samples the manner in which drawn
              and their acceptance is attached at encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b6 || "................................................"}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.7</b> Draft literature copies have
              been submitted to AHSP for approval as per letter referred at encl{" "}
              {data?.b7 || "................................................"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.8</b> Draft literature has been
              approved by AHSP as per letter vide encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b8 || ".............................................."}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.9</b> Proof copy of literature was
              submitted by the firm to SQAE(L), Secunderabad for approval vide
              encl encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b9 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.10</b> Proof copy of literature
              has been verified and released for final printing with comments as
              per encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b10 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.11</b> Full qty of literature is{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b11a ||
                "......................................................................"}{" "}
                </span>
              Nos is due before 25% of bulk supplies of stores on order is{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b11b || ".............................................."}{" "}
                </span>
              Nos of copies of literature supplied and accepted vide encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b11c ||
                "......................................................................"}{" "}
                </span>
              not yet submitted / not applicable
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.12</b> Final printed copies of
              literature{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b12 ||
                "......................................................................"}
                </span>
              Nos examined as per proof approved, accepted and acceptance mark
              stamped on all copies.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.13</b> The raw materials, sub assy
              / assyetc have been inspected and accepted already vide encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b13 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.14</b> It is certified that{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b14a ||
                "......................................................................"}{" "}
                </span>
              Nos of the eqpt / stores / spares were completed quantity /
              manufacture and have been quality assured and are found fully
              confirming / not confirming to the governing specifications and
              other details in respect of dimensional, performance and testing
              and identification marking requirements. The detailed report is at
              encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b14b ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.15</b> It is certified acceptable
              stores / eqpt / spares were quality assured as per contract /
              specification eqpt and packaged as per specification eqpt details
              enclosed at{" "}
            </Typography>

             <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b15 ||
                "......................................................................"}
             </span>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.16</b> Warrantee / Guarantee
              certificate obtained in triplicate and filed at encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b16 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.17 </b>Expiry of warrantee period
              marked on the stores / eqpt for details see encl.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.18</b> Eqpt / stores / spares are
              packed into bundles/packages{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b18 ||
                "......................................................................"}{" "}
                </span>
              Nos.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.19</b> Acceptable eqpt / stores /
              spares affixed with Inspection Mark steel / Rubber for qty{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b19a ||
                "......................................................................"}{" "}
                </span>
              ( for details of marking refer to encl.{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b19b ||
                "......................................................................"}{" "}
                </span>
              )
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.20</b> It is certified that
              eqpt/stores/spares quality assured and packaged against this lot
              has been handed over to firms as per certificate as encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b20a ||
                "......................................................................"}{" "}
                </span>
              / kept in bond room as per details at encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b20b ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.21</b> Test certificate obtained
              from firm as per requirement of the contract / direction of AHSP
              are as given below and are attached at encl TODO add Table{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b21 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.22</b> Control / Class ‘C’ / Shelf
              life samples drawn and will have to be forwarded to AHSP as per
              encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b22 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.23</b> Short coming / deficiency
              noticed for smooth conduct of QA at firm’s premises is listed and
              at encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.b23 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>B.24</b> Reasons for delay in
              conduct of QA beyond the period stipulated is explained at encl
            </Typography>{" "}
              <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
            {data?.b24 ||
              "......................................................................"}
              </span>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              QA progress RedgSl No. ___________________ Group
              __________________ Month________________________{" "}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <b style={{ marginRight: 8 }}>QA Team</b>
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ marginBlock: 4 }}>
            Signature (s) : ____________________________________________
          </Grid>
          <Grid item xs={12} style={{ marginBlock: 4 }}>
            Name(s) & Desig : ____________________________________________
          </Grid>
          <Grid item xs={12} style={{ marginBlock: 4 }}>
            Inspection Mark Details :
            ____________________________________________
          </Grid>
          <Grid item xs={12} style={{ marginBlock: 4 }}>
            Date : ____________________________________________
          </Grid>
          <div style={{ pageBreakAfter: "always" }}></div>
          <Grid xs={12} item>
            <PageHeader />
          </Grid>
          <Grid item xs={12} align="center">
            {/* CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC */}

            <Title>
              PART 'C': CROSS / CONFIRMATORY CHECKS
              <br />
              <span style={{ fontSize: 14, color: "red" }}>
                (SECOND TIER QA / GROUP OFFICERS RECOMMENDATIONS)
              </span>
            </Title>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>C.1</b> Eqpt / stores / spares have
              been subjected to confirmatory /cross checks at firm’s premises
              located at{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.c1a ||
                "......................................................................"}{" "}
                </span>
              on date{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.c1b ||
                "......................................................................"}{" "}
                </span>
              during cross / confirmatory check samples have been drawn for{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.c1c ||
                "......................................................................"}
                </span>
              testing and test report enclosed at encl
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>C.2</b> Acceptance as recommended by
              QA team examined during cross / confirmatory check. Stores are
              recommended / not recommended for acceptance. For details refer to
              encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.c2 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>C.3</b> Cross check entry made in
              cross/confirmatory check register at Srl No{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.c3 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>C.4</b> Cross checked stores have
              been affixed / not affixed with acceptance mark steel / rubber.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>C.5</b> Details of laboratory test /
              performance test report received and verified and found
              conformance to specification requirement and available at encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.c5 ||
                "......................................................................"}{" "}
                </span>
              with recommendation.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>C.6</b> It is certified that
              quantity and quality of stores quality assured are found
              acceptance / not acceptance and are recommended / not recommended
              for despatch on issue of MC Note / own arrangement of the firm.
              Issue of Inspection / Rejection Note is recommended.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>C.7</b> Reasons for not accepting
              the already QA stores is enclosed at{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.c7 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>C.8</b> Various shortcomings /
              deficiencies noticed for smooth conduct of QA at firm’s premises
              noticed by inspection staff discussed with firm’s representative
              and corrective action letter being issued to firm / letter issued
              vide encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.c8 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>C.9</b> Despatch of control/ shelf
              life / Class ‘C’ samples drawn, sent to AHSP vide encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.c9 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ marginBlock: 16 }}>
            Group / section officer signature :
            ____________________________________________
          </Grid>
          <Grid item xs={12} style={{ marginBlock: 16 }}>
            Name & Designation : ____________________________________________
          </Grid>

          <Grid item xs={12} style={{ marginBlock: 16 }}>
            Date : ____________________________________________
          </Grid>
          {/* DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD */}
          <div style={{ pageBreakAfter: "always" }}></div>
          <Grid item xs={12}>
            <PageHeader />
          </Grid>
          <Grid item xs={12}>
            <Title>
              PART 'D': THIRD TIER CROSS VERIFICATION
              <br />
              FINAL APPROVAL AND REMARKS OF SQAO
            </Title>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>D.1</b> I have verified on sampling
              basis the QA records of eqpt / stores/spares prepared by Quality
              Assurance staff & Group Officer and found in order/ not in order.
              See observations Encl ---
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>D.2</b> I have examined the
              recommendation of Group officer accepting the stores / not
              accepting the stores.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>D.3</b> Tier III/ Vigilance check
              was carried out on date{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.d3a ||
                "......................................................................"}{" "}
                </span>
              by{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.d3b ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>D.4</b> Surprise check was carried
              out / not carried out, action initiated / not initiated
              separately.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>D.5</b> I have carried out third
              tier cross verification of stores personally on dated{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.d5 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>D.6</b> Eqpt/stores / spares are
              hereby cleared / not cleared.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>D.7</b> Issue of Inspection Note
              /Certificate and MC Note is hereby authorised / not authorised.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span">
              <b style={{ marginRight: 8 }}>D.8</b> The observations as a result
              of third tier cross verification is at encl{" "}
                <span style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.d8 ||
                "......................................................................"}
                </span>
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ marginBlock: 16 }}>
            Group / section officer signature :
            ____________________________________________
          </Grid>
          <Grid item xs={12} style={{ marginBlock: 16 }}>
            Name : ____________________________________________
          </Grid>

          <Grid item xs={12} style={{ marginBlock: 16 }}>
            Date : ____________________________________________
          </Grid>

          <div style={{ pageBreakAfter: "always" }}></div>
          <Grid item xs={12}>
            <PageHeader />
          </Grid>

          {/* 2nd TIER Report */}
          <Grid item xs={12}>
            <Title>REPORT ON TIER-II CHECK</Title>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>1.</b> Officer deputed by SQAO
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t21 ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>2.</b> Conducted at
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t22 ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography >
              {" "}
              <b style={{ marginRight: 8 }}>3.</b> Dated conducted
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t23 ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>4. (a)</b> Nomenclature of Store
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t24a ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(b)</b>{" "}
              Indent/Indents/SO No. & Date
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}} >
              {data?.t24b ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(c)</b>{" "}
              Quantity on order{" "}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t24c ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(d)</b>{" "}
              Total Cost{" "}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t24d ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>5.</b> Instructions received from
              SQAO
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t25 ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>6. (a)</b> Whether the sample was
              picked up from the : Accepted lot or from the rejected lot or both
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t26a ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(b)</b>{" "}
              Challan No. & Date
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t26b ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(c) </b>No
              of samples drawn
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t26c ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>7. (a)</b> Details of Stores
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t27a ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {" "}
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(b)</b>{" "}
              Scope of tests
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t27b ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(c)</b>{" "}
              Reason for omitting or not conducting : Certain tests
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t27c ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>8. (a)</b> Results
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t28a ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(b)</b>{" "}
              Comments on the comparison of test results : of the samples and
              the bulk
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t28b ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={12} style={{ marginBlock: 16 }}>
            Date : ____________________________________________
          </Grid>
          <Grid
            item
            xs={12}
            style={{ marginBlock: 16, pageBreakAfter: "always" }}
          >
            Officer-in-Charge ____________________________________________
          </Grid>

          <div style={{ pageBreakAfter: "always" }}></div>
          <Grid item xs={12}>
            <PageHeader />
          </Grid>

          {/* 3rd TIER Report */}
          <Grid item xs={12}>
            <Title>REPORT ON TIER-III CHECK</Title>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>1. </b>Officer deputed by SQAO
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t31 ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}> 2.</b> Conducted at
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t32 ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              {" "}
              <b style={{ marginRight: 8 }}>3.</b> Dated conducted
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t33 ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>4.</b> Instructions received from
              SQAO
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t34 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>5. (a)</b> Whether the sample was
              picked up from the : Accepted lot or from the rejected lot or both
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t35a ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(b)</b> No
              of samples drawn
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t35b ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography >
              {" "}
              <b style={{ marginRight: 8 }}>6. (a)</b> Nomenclature of the Store
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t36a ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(b)</b>{" "}
              Scope of tests
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t36b ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(c)</b>{" "}
              Reason for omitting or not conducting : Certain tests
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t36c ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>7. (a)</b> Results (Satisfactory/Not
              Satisfactory)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t37a ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;<b style={{ marginRight: 8 }}>(b)</b>{" "}
              Comments on the comparison of test results : of the samples and
              the bulk
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t37b ||
                "......................................................................"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>8.</b> Inference
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t38 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>9.</b> Any other details of
              clarification
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t39 ||
                "......................................................................"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b style={{ marginRight: 8 }}>10.</b> Suggestion and
              recommendation
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{color:'blue', fontWeight:"bold", textDecoration:"underline",}}>
              {data?.t310 ||
                ".............................................................."}{" "}
            </Typography>
          </Grid>

          <Grid item xs={12} style={{ marginBlock: 16 }}>
            Date : ____________________________________________
          </Grid>
          <Grid item xs={12} style={{ marginBlock: 16 }}>
            Name and Signature of the Officer
            ____________________________________________
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
        <Button
          size="small"
          style={{ marginLeft: 16 }}
          variant="outlined"
          color="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function PageHeader() {
  return (
    <div className="header-table">
      <table>
        <thead>
          <tr>
            <th
              rowSpan={4}
              style={{
                width: 100,
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <img alt="logo" src={sqaeImg} />
            </th>
            <th
              rowSpan={2}
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Senior Quality Assurance Establishment
              <br />
              (Electronics)
              <br />
              Bengaluru
            </th>
            <th>SQAE(L)/BG/QMS</th>
          </tr>

          <tr>
            <th>Issue No. :08</th>
          </tr>

          <tr>
            <th
              rowSpan={2}
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Quality Management System Manual
              <br />
              ISO 9001 : 2015
            </th>
            <th>Rev. No. :00</th>
          </tr>
          <tr>
            <th>Date: {new Date().toLocaleDateString()}</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
