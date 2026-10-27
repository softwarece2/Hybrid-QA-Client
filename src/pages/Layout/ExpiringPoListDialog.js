import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "components/Button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getExpiryLists } from "Redux/Actions/SupplyOrder/LIAction";
import { getListExpiringOrdersByOrgId } from "Redux/Actions/SupplyOrder/SOAction";
import { StyledTableCell } from "Utils";

 const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

export default function ExpiringPoListDialog({ open, onClose }) {
  const [poList, setPoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soList, setSoList] = useState([]);
  const empId = useSelector((store) => store.loggedInUser?.empId);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);

  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoading(true);
      try {
        const [poData, soData] = await Promise.all([
          empId ? getExpiryLists(empId) : Promise.resolve([]),
          orgId ? getListExpiringOrdersByOrgId(orgId) : Promise.resolve([]),
        ]);
        setPoList(poData);
        setSoList(soData);
      } catch (error) {
        console.error("Error fetching PO/SO list:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, empId, orgId]);

 

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Fag End / Expiring PO</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : poList.length === 0 && soList.length === 0 ? (
          <Typography>No expiring POs found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Sl. No.</StyledTableCell>
                <StyledTableCell>Order No</StyledTableCell>
                <StyledTableCell>DD</StyledTableCell>
                <StyledTableCell>Extended DD</StyledTableCell>
                <StyledTableCell>Days Remaining</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...poList, ...soList].map((po, index) => (
                <TableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{po.orderNo}</StyledTableCell>
                  <StyledTableCell>{formatDate(po.originalDd)}</StyledTableCell>
                  <StyledTableCell>
                    {formatDate(po.latestNewDd)}
                  </StyledTableCell>
                  <StyledTableCell>{po.daysRemaining}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
