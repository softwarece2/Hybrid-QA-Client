import { Button, Dialog, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { DialogActions, DialogContent, DialogTitle } from "Utils";

export default function PrintQcReport({ round, onClose, ol,regNo,data, selectedItem}) {

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Round Specs",
  });

  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState([]);
  const  sslipSerialNoId= selectedItem.sslipSerialNoId;
  const  sslipSerial= selectedItem.serialNo;
  const productId = selectedItem.productId;
  const roundId = selectedItem.roundId;
  async function getAllSpecs() {
    setLoading(true);
    try {
      const { data: allRounds } = await axiosInstanceIol.get(`ate/getAllTestValByProdIdDevId/${sslipSerialNoId}/${productId}/${roundId}?showQc=true`);
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
console.log(data,"datat")
  return (
    <Dialog open fullWidth maxWidth="lg">
      <DialogTitle onClose={onClose}>Device No. : {sslipSerial}</DialogTitle>
      <DialogContent style={{ paddingTop: 0 }} dividers>
        <div ref={componentRef}>
            
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
