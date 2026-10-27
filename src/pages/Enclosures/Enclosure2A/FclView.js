/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { Dialog, DialogActions, Typography } from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { getFclSo } from "Redux/Actions/Enclosure/FclAction";
import { DialogContent, DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import Button from "components/Button";
import HeaderFCL from "pages/Layout/HeaderFCL";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: "12px 12px 12px 12px",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 500,
  },
  print: {
    backgroundColor: indigo[800],
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: indigo[800],
      color: theme.palette.common.white,
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
  icon: {
    color: "#ff3000",
    fontSize: "18px",
  },
}));

export default function FclView({ soId, setOpen, open }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // const fclData = useSelector(store => store.fclReducer.fclData);
  const componentRef = React.useRef();

  const [fclData, setFclData] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  React.useEffect(() => {
    dispatch(getFclSo(soId)).then((res) => setFclData(res));
  }, []);

  console.log("fclData", fclData);

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        maxWidth="lg"
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title10" {...props} />
        )}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title10"
        >
          CONTRACT NO. {fclData?.soOrderNo} DATED {fclData?.soDate} FOR SUPPLY
          OF {fclData?.projectName}
        </DialogTitle>

        <DialogContent dividers style={{ padding: 12, position: "relative" }}>
          <div ref={componentRef}>
            <HeaderFCL fclData={fclData} />
            <Typography>Dear Sir,</Typography>

            <ol>
              <li>
                <Typography>Refer to the subject order.</Typography>
              </li>
              <li>
                <Typography align="justify">
                  This establishment been nominated as the inspecting Agency
                  against the subject PO.In order to avoid delay in inspection
                  and clearance of stores, it is requested that the following
                  actions be taken at your end:-
                </Typography>
              </li>
              <div>
                <ol type="a">
                  <li>
                    <Typography align="justify">
                      The stores are to be manufactured strictly as per
                      drawing/specification /details mentioned in PO and the
                      criteria viz. characteristics, quantum/severities of
                      inspection /checks of stores will be strictly as per
                      approved Quality Assurance Plan (QAP)/ Acceptance Test
                      Procedure (ATP).In case approved QAP for the subject store
                      does not exist,you are requested to forward draft QAP in
                      soft copy to this establishment in MS Word format as per
                      the standard format (A broad structure of QAP placed at
                      the Enclosure-1, wherein only relevant serials are to be
                      selected for a particular store) for scrutiny and onward
                      submission to HQ DQA (N), New Delhi for approval. On
                      approval, the QAP would be converted in PDF format and
                      promulgated by DQA(N). It is brought out that draft QAP
                      would be accepted for vetting only in soft copy and in MS
                      Word 2007 or latest format.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      The stores ,when ready ,be tendered to this Establishment
                      through inspection call letter for inspection and
                      acceptance. A Specimen of inspection call letter is
                      enclosed for your ready reference.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      The stores be delivered to the Consignee only after they
                      are inspected and Inspection Note is issued by this
                      Establishment.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      The Stores offered for inspection are expected to be
                      pre-inspected by you for description,pattern number,
                      specifications, drawings and details mentioned in the
                      relevant purchase orders to ensure that the stores are of
                      specified and acceptable quality before tendering for
                      inspection at this establishment. This would minimize
                      chances of delay, rejection, etc. Pre-inspection report as
                      per the format attached is to be enclosed with your
                      inspection call letter. A declaration by you that such
                      pre-inspection has been carried out on the stores tendered
                      shall be enclosed with each inspection call letter (i.e.
                      challan). The pre-inspection report shall indicate details
                      of checks and tests carried out and the results /
                      observations made. Inspection call letters (Challans)
                      received without pre-inspection reports will be disposed
                      off without inspection of stores.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      Intimate the name and address of the actual manufacturer
                      of the subject items, in case the OEM is other than your
                      firm, in such case the stores should be offered for
                      inspection at OEM's manufacturing plant/ premises to
                      facilitate proper inspection and testing as per relevant
                      drawings/specifications.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      In case the items are imported, copy of the following
                      documents be submitted (originals of documents to be
                      produced for verification during inspection):-
                    </Typography>
                  </li>
                  <div>
                    <ol type="i">
                      <li>
                        <Typography align="justify">
                          Copy of one among Bill of Lading / Shipping
                          Bill/Airway Bill(A document issued by the transporter
                          of the equipment which clearly indicates the
                          description,quantity,port of collection and port of
                          discharge).
                        </Typography>
                      </li>
                      <li>
                        <Typography align="justify">
                          Invoice by OEM of Country of Origin certificate of the
                          equipment with packing list.
                        </Typography>
                      </li>
                      <li>
                        <Typography align="justify">
                          Bill of Entry to warehouse.
                        </Typography>
                      </li>
                      <li>
                        <Typography align="justify">
                          The Certificate of Conformity (CoC) indicating
                          governing specifications and values to which the items
                          are tested along with Original Equipment Manufacturer
                          (OEM) test certificates/test reports/ Catalogue /Data
                          Sheet.
                        </Typography>
                      </li>
                      <li>
                        <Typography align="justify">
                          Guarantee/ Warrantee certificate from the supplier/
                          OEM as per Supply Order.
                        </Typography>
                      </li>
                    </ol>
                  </div>
                  <li>
                    <Typography align="justify">
                      In case of items falling under the category of
                      bouught-out/COTS,OEM's test certificate / conformance
                      certificate and test reports(in original / scanned /
                      computer-generated form) will required for review.The
                      certificates should be relevant to the stores/lot/batch
                      being offered for inspection.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      In case of spare parts, OEM's certificate conforming that
                      spare are tested and suitable for fitment on main
                      equipment for which spares are ordered along with relevant
                      portion of parts catalogue /operators manuals be enclosed
                      with inspection call letter to facilitate identification
                      of spare parts.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      Warranty Certificate to be submitted.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      Inter Changeability Certificate be submitted in case Part
                      No. or designation of item being supplied is different
                      from Part No. designation mentioned in PO.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      Stores are to be tendered for inspection well within the
                      delivery period, so as to reach the consignee on or before
                      the stipulated DP after completion of inspection. In case
                      delivery date has expired, extension of delivery dates
                      should be obtained from the indenting / ordering
                      authority. Inspection may be undertaken and Inspection
                      Note issued based on provisional DP extension by the
                      indenting / ordering authority.
                    </Typography>
                  </li>
                  <li>
                    <Typography align="justify">
                      Please forward a copy of specification / technical leaflet
                      of the subject item for our reference.
                    </Typography>
                  </li>

                  <li>
                    <Typography align="justify">
                      The preferred mode of receipt of Inspection Call letters
                      and pre-inspection reports is by e-mail. In case email
                      facility is not available, hard copy may be faxed and
                      ink-signed pre-inspection report be produced at the time
                      of inspection.
                    </Typography>
                  </li>
                </ol>
              </div>
              <li>
                <Typography align="justify">
                  Stores will taken up for inspection only on meeting the above
                  requirements.
                </Typography>
              </li>
              <li>
                <Typography align="justify">
                  It is requested that all test facilities required to carry out
                  inspection/ checks/ tests on stores be provided to facilitate
                  thorough inspection. It may please be ensured that
                  instruments/ test jigs/ gauges are calibrated and in-date. In
                  case testing facility is not available with the firm, the same
                  would be carried out at NABL-accredited laboratory and the
                  testing charges shall be borne by the firm.
                </Typography>
              </li>
              <li>
                <Typography align="justify">
                  It may be noted that QA personnel deputed for raw material
                  inspection/in process checks and final inspection prior
                  clearance of item/issue of inspection Note are entitled for
                  TA/DA for carrying out official duty of inspection.It is not
                  incumbent for the firm to provide transport/accommodation for
                  the QA personnel during the process of Quality Assurance
                  activities.
                </Typography>
              </li>
              <li>
                <Typography align="justify">
                  In view of the above,First Contact Meeting to be scheduled
                  within one week on receipt of this letter.
                </Typography>
              </li>
              <li>
                <Typography align="justify">
                  In case any irregularities are noticed on the part of QA
                  personnel on soliciting any demand/favour for carrying out QA
                  activities or involving corrupt practices, the firm may
                  approach Vigilance Officer of this office as well as DQA (N)
                  HQs,New Delhi. The details of Vigilance department are as
                  below:-
                </Typography>
              </li>

              {fclData?.fclVigDtoList?.map((input, index) => (
                <li>
                  <Typography style={{ whiteSpace: "pre-line" }}>
                    {input?.vigilance}
                  </Typography>
                </li>
              ))}
            </ol>
            <p> Thanking You.</p>
            <p align="right">Yours faithfully,</p>
            {/* <p align="right">{fclData?.signedBy} </p> */}
          </div>
        </DialogContent>

        <DialogActions>
          {/* <Button
            variant="contained"
            color="primary"
            // onClick={handleSubmit(handleSave)}
            type="submit"
          >
            Print
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOpen(false)} type="submit">
            Close
            
          </Button> */}
          {/* <ReactToPrint
            trigger={() => (
              <Button variant="contained" className={classes.print}>
                Print
              </Button>
            )}
            content={() => componentRef}
          /> */}
          <Button variant="contained" color="primary" onClick={handlePrint}>
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
    </div>
  );
}
