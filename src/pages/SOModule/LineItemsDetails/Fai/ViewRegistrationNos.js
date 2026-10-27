import { Button, Dialog, Table, TableBody, TableHead } from "@material-ui/core";
import { DialogActions, DialogContent, StyledTableRow } from "Utils";
import { StyledTableCellFai } from "./Rounds";

export default function ViewRegistrationNos({ onClose, details }) {
  return (
    <Dialog open maxWidth="xs" fullWidth>
      <DialogContent >
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCellFai style={{ width: 20 }}>Page</StyledTableCellFai>
              <StyledTableCellFai>Registration</StyledTableCellFai>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {details.faiDetails.map((p) => (
              <StyledTableRow key={p.pageNo}>
                <StyledTableCellFai> {JSON.stringify(p.pageNo)}</StyledTableCellFai>
                <StyledTableCellFai>{p.regNos.map((r) => r.regName).join(",")}</StyledTableCellFai>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained" size="small" style={{ textTransform: "capitalize" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
