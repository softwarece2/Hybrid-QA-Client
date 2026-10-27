import { useEffect, useState } from "react";
import { Dialog, LinearProgress, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";

import { DialogActions, DialogContent, DialogTitle } from "Utils";
import Button from "components/Button";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { Visibility } from "@material-ui/icons";
export default function Rounds({rounds}){


  return(
<>

   <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>Rounds</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
           {rounds?.map((round, index) => (
      <StyledTableRow key={index}>
        <StyledTableCell>{index + 1}</StyledTableCell>
        <StyledTableCell style={{ color: "green", fontWeight: "bold" }}>
          Round:{round?.roundId}
        </StyledTableCell>
        <StyledTableCell>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              //   setOpenTestReportObservation(true);
              //   setSelectedTest(round); // Pass the current round object
            }}
          >
            <Visibility fontSize="small" />
          </Button>
        </StyledTableCell>
      </StyledTableRow>
    ))}
           {/* {rounds?.map((round1, index) => (
      <StyledTableRow key={index}>
        <StyledTableCell>{index + 1}</StyledTableCell>
        <StyledTableCell style={{ color: "green", fontWeight: "bold" }}>
          Round:{round1?.roundId}
        </StyledTableCell>
        <StyledTableCell> 
          <Button
            size="small"
            color="primary"
            onClick={() => {
              //   setOpenTestReportObservation(true);
              //   setSelectedTest(round); // Pass the current round object
            }}
          >
            <Visibility fontSize="small" />
          </Button>
        </StyledTableCell>
      </StyledTableRow>
    ))} */}
              </TableBody>
            </Table>
          </TableContainer>


</>

  ) 
}

 