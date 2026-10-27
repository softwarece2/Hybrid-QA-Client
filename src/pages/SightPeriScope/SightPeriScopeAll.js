import {
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Print, Visibility } from "@material-ui/icons";
import { useState } from "react";

import { StyledTableCell, StyledTableRow } from "Utils";
import PrintPreviewVisual from "./PrintPreview";

export default function SightPeriScopeAll({
  records,
  loading,
  setSelectedRow,
  selectedRow,
  selectedForm
}) {

  const [openPrint, setOpenPrint] = useState(false);

  return (
    <>
    {openPrint && (
        <PrintPreviewVisual
          onClose={() => setOpenPrint(false)}
          selectedDevice={selectedForm}
        />
      )}
    
    <TableContainer style={{ maxHeight: 300, overflow: "auto" }}>
      <Table
        size="small"
        style={{ border: "1px solid lightgrey", marginTop: 14 }}
      >
        <TableHead>
          <StyledTableRow>
            <StyledTableCell width={250} style={{ border: "1px solid white" }}>
              Device Name
            </StyledTableCell>
            <StyledTableCell width={200} style={{ border: "1px solid white" }}>
              Submitted Date
            </StyledTableCell>
            <StyledTableCell width={200} style={{ border: "1px solid white" }}>
              Remarks
            </StyledTableCell>
            <StyledTableCell width={200} style={{ border: "1px solid white" }}>
              Status
            </StyledTableCell>
            <StyledTableCell width={200} style={{ border: "1px solid white" }}>
              Action
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5}>
                <LinearProgress />
              </TableCell>
            </TableRow>
          )}
          {records.map((l, i) => (
            <TableRow
              key={i}
              style={{
                backgroundColor:
                  selectedRow?.id === l.id ? "aliceblue" : "initial",
              }}
            >
              <StyledTableCell>{l.devName}</StyledTableCell>
              <StyledTableCell>
                {l.submittedDate || '-'}
              </StyledTableCell>
              <StyledTableCell>-</StyledTableCell>
              <StyledTableCell>-</StyledTableCell>
              <StyledTableCell>
                <IconButton
                  // disabled={!!l.submittedDate}
                  color="primary"
                  size="small"
                  onClick={() => setSelectedRow(l)}
                >
                  <Visibility fontSize="small" />
                </IconButton>
                {l?.submittedDate && (
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => {
                          setSelectedRow(l);
                          setOpenPrint(true);
                        }}
                      >
                        <Print fontSize="small" />
                      </IconButton>
                    )}
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
