import { Button, Dialog, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { ORG_TYPE } from "Globals.js";
import { useSelector } from "react-redux";


export default function PrintAllSpecs({ round, onClose, ol,regNo,allRounds,devId,regNoId,qcTest,regNos }) {
  console.log("round",round);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const hasAccessToAdd = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY;
  const SerialId = (hasAccessToAdd && !qcTest) ? regNoId : (allRounds?.subSlipSerialNoId || regNoId);

console.log("regNo",regNo);
console.log("allRounds",allRounds);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Round Specs",
  });

  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState([]);

  async function getAllSpecs() {
    setLoading(true);
    try {
      const { data: allRounds } = await axiosInstanceIol.get(`ate/getAllTestValByProdIdDevId/${SerialId}/${round.productId || ol?.productId}/${round.roundId}?${qcTest ? 'showQc=true' : 'showQa=true'}`);
      setSpecs(allRounds.testValDto || []);
  
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllSpecs();
  }, []);

  return (
    <Dialog open fullWidth maxWidth="lg">
      <DialogTitle onClose={onClose}>
       Device No. : {regNo.serialNo || ol?.serialNo}
        </DialogTitle>
      <DialogContent style={{ paddingTop: 0 }} dividers>
        <div ref={componentRef}>
            <Typography
            style={{ display: "flex", gap: 16, border: "1px solid lightgrey", padding: "8px 16px", marginBlock: 8, borderRadius: 4 }}
          >
           
            <p>Device No. : <b>{regNo.serialNo || ol?.serialNo}</b></p>
            <p>Line Item No. : <b>{ol.soLineItemNo || ol?.lineItemNo}</b></p>
            <p>Status : <b style={{ color: round.status === "pass" ? "green" : "red" }}>{round.status}</b></p>
            <p>Submitted By : <b>{round.submittedBy}</b></p>
          <p>
  Submitted Date : 
  <b>
    {round.submittedDate ? new Date(round.submittedDate).toDateString() : ""}
  </b>
</p>
          </Typography>
          <Table size="small" stickyHeader style={{minHeight:300}}>
            <TableHead>
              <TableRow>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12 }}>S.No.</TableCell>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12 }}>Test Name</TableCell>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12 }}>Parameter type</TableCell>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12, width: 300 }}>
                  Parameter description
                </TableCell>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12 }}>TY clause no</TableCell>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12 }}>Min. value</TableCell>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12 }}>Max. value</TableCell>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12 }}>Unit</TableCell>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12 }}>Observation</TableCell>
                <TableCell style={{ paddingInline: 4, backgroundColor: "#efeeee", fontSize: 12 }}>status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={10}>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {specs.map((item, specIndex) => (
                <TableRow key={specIndex}>
                  <TableCell>{specIndex + 1}</TableCell>
                  <TableCell>{item.testName}</TableCell>
                  <TableCell>{item.paramType}</TableCell>
                  <TableCell>{item.specVal}</TableCell>
                  <TableCell>{item.tyClauseNo}</TableCell>
                  <TableCell>{item.min}</TableCell>
                  <TableCell>{item.max}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <b>{item.observation}</b>
                  </TableCell>
                  <TableCell style={{ color: item.status === "Pass" ? "green" : "red" }}>{item.status || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button style={{ textTransform: "capitalize" }} variant="contained" color="primary" size="small" onClick={handlePrint}>
          Print
        </Button>
        <Button style={{ textTransform: "capitalize" }} onClick={onClose} color="secondary" size="small" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
