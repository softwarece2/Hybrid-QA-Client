import { Container, makeStyles, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import Button from "components/Button";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import OLTable from "../../Sslip/SSlipTable";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
const useStyles = makeStyles((theme) => ({
  tableDesign: {
    fontSize: "12px",
    width: "100%",
    // border: "1px solid grey",
    borderCollapse: "collapse",
    "& tbody tr td": {
      border: "1px solid grey",
      padding: "0px 2px",
      fontSize: "1rem",
      textAlign: "left",
    },
  },
}));

export default function QcCheck({ row }) {
  const classes = useStyles();
  const printRef = useRef();
  const dispatch = useDispatch();
  const [iNoteDetails, setINoteDetails] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    axiosInstance("internalInote/getINoteByOlId/" + row.id)
      .then(({ data }) => {
        setINoteDetails(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [row?.id]);
  return (
    <Container>
      <Button
        startIcon={<ArrowBack />}
        variant="contained"
        color="secondary"
        style={{ marginBottom: "12px" }}
        onClick={() => {
          dispatch(selectItem(<OLTable />));
        }}
      >
        Back
      </Button>

      <table className={classes.tableDesign} ref={printRef}>
        <tbody>
          <tr>
            <td colSpan={2}>
              <Typography
                align="center"
                variant="h6"
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  textDecoration: "underline",
                }}
              >
                आयुध निर्माणी रायपूर, देहरादून - 248008
                <br />
                इंडिया ऑप्टेल लिमिटेड रायपुर, देहरादून की इकाई
                <br />
                गुणता आश्वासन प्रमाणपत्र
              </Typography>
            </td>
          </tr>

          <tr>
            <td></td>
            <td>
              <b>LOT-NUMBER-05</b>
            </td>
          </tr>
          <tr>
            <td>Nomenclature of Store</td>
            <td>
              <b>OVERHAULING OF SPAV (II)</b>
            </td>
          </tr>
          <tr>
            <td>IFD/Extract No</td>
            <td>GEM CONT NO. GEMC-511687754615639 DATED 27.06.2024,</td>
          </tr>
          <tr>
            <td>Contract No</td>
            <td>27.06.2024,Date:27/06/2024</td>
          </tr>
          <tr>
            <td>Order-Qty</td>
            <td>{iNoteDetails?.inoteLineItems?.[0]?.orderedQty ?? 0}</td>
          </tr>
          <tr>
            <td>Delivery Period</td>
            <td>28/06/2025</td>
          </tr>
          <tr>
            <td>
              Details of I-note No & Date <br />
              Qty Tendered on I-note
            </td>
            <td>
              {iNoteDetails?.inoteDate},Qty-
              {iNoteDetails?.inoteLineItems?.[0]?.tendered ?? 0}
            </td>
          </tr>

          <tr>
            <td>Submission Date</td>
            <td>0.000</td>
          </tr>
          <tr>
            <td>Regd Nos.</td>
            <td>{iNoteDetails?.inoteLineItems?.[0]?.regNos.join(",")??''}</td>
          </tr>
          <tr>
            <td>Qty Accepted</td>
            <td>{iNoteDetails?.inoteLineItems?.[0]?.accepted ?? 0}</td>
          </tr>
          <tr>
            <td>Qty Rejected</td>
            <td>{iNoteDetails?.inoteLineItems?.[0]?.rejected ?? 0}</td>
          </tr>
          <tr>
            <td>Total Qty Accepted(including this QAC)</td>
            <td>{iNoteDetails?.inoteLineItems?.[0]?.tendered ?? 0}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              Certified tdat tde following have been carried out and found on
              conformity witd relevant specification <br />
              (i) Audit of input material documents <br />
              (ii) 100% Inspection as per FAI
              <br /> <br />
              <Typography>QAC No. : OFD/QCF/SPAV(II)</Typography>
              <Typography>Date : 30/06/2025</Typography>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              Seal
              <br /> <br /> <br /> <br />
              <Typography align="right" style={{ marginRight: "30px" }}>
                For General Manager
              </Typography>
              <br /> <br />
              <Typography>
                Note. : This is system generated document. No signature is
                required
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
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
