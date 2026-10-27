import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { StyledTableRow } from "Utils";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { useReactToPrint } from "react-to-print";
import { PaperComponent } from "Utils/D3Tree";
// import belLogo from "assets/Images/bel_logo_bg.png";
import olfdn from "assets/Images/olf_dn_logo.png";

const StyledTableCell = withStyles((theme) => ({
  root: {
    borderleft: "1px solid lightgrey",
    padding: "0px 4px",
  },
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderleft: "1px solid lightgrey",
    borderBottom: "1px solid lightgrey",
  },
  border1: {
    border: "1px solid",
  },
}))(TableCell);

function ShowValue({ val, isValid = true }) {
  return <b style={{ color: isValid ? "green" : "red" }}>{val}</b>;
}

export default function PrintPreviewVisual({ selectedDevice, onClose }) {
  const componentRef = React.useRef();

  console.log(selectedDevice, "==selectedDevice==");

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Dialog
      open
      maxWidth="lg"
      onClose={onClose}
      fullWidth
      align="center"
      PaperComponent={(props) => <PaperComponent id="draggable-dialog-title15" {...props} />}
    >
      <div ref={componentRef}>
        <DialogTitle style={{ fontSize: "0.875rem", cursor: "move" }} id="draggable-dialog-title234" onClose={onClose}>
          {/* <img src={belLogo} alt="belLogo" height={40} /> */}
          <img src={olfdn} alt="olf-dn" height={40} />

        </DialogTitle>
        <DialogContent align="left">
          {selectedDevice ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell style={{ border: "1px solid black" }}>S.No.</StyledTableCell>{" "}
                    <StyledTableCell align="center" style={{ border: "1px solid black" }}>
                      Tests
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{ border: "1px solid black" }} colSpan={2}>
                      Specified Value
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{ border: "1px solid black" }}>
                      Actual Value/Result
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>1.</TableCell>
                    <TableCell align="left" style={{ border: "1px solid" }}>
                      Out ward appearance
                    </TableCell>
                    <TableCell colSpan={2} style={{ border: "1px solid" }}>
                      As PER TY
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.outwardAppear} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>2.</TableCell>
                    <TableCell align="left" style={{ border: "1px solid" }} rowSpan={2}>
                      Field of View
                    </TableCell>
                    <TableCell colSpan={2} style={{ border: "1px solid" }}>
                      Horizontal &gt; 30°
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.viewHoriz} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>3.</TableCell>

                    <TableCell colSpan={2} style={{ border: "1px solid" }}>
                      Vertical &gt; 28° But not less than 5% of 28° V FOV
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.viewVerti} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>4.</TableCell>
                    <TableCell style={{ border: "1px solid" }}>Magnification</TableCell>
                    <TableCell colSpan={2} style={{ border: "1px solid" }}>
                      1 x ± 0.1x
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.magnification} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>5.</TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      Difference in Magnification of Left and Right Eye Piece
                    </TableCell>
                    <TableCell colSpan={2} style={{ border: "1px solid" }}>
                      10% of largest value
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.diffMagLr} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell rowSpan={2} style={{ border: "1px solid" }}>
                      6.
                    </TableCell>
                    <TableCell rowSpan={2} style={{ border: "1px solid" }}>
                      Resolving Power
                    </TableCell>
                    <TableCell rowSpan={2} style={{ border: "1px solid" }}>
                      Not More than 1.7+0.1m Radian at optimal high level
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>L</TableCell>

                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.resolvingPwrL} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>R</TableCell>

                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.resolvingPwrR} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell rowSpan={2} style={{ border: "1px solid" }}>
                      7.
                    </TableCell>
                    <TableCell rowSpan={2} style={{ border: "1px solid" }}>
                      Diopter difference of both E.P
                    </TableCell>
                    <TableCell rowSpan={2} style={{ border: "1px solid" }}>
                      (-)0.5 D to (-)1.0 Diopter
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>L</TableCell>

                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.diopterAdjL} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}> R</TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.diopterAdjR} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell rowSpan={4} style={{ border: "1px solid" }}>
                      8.
                    </TableCell>
                    <TableCell rowSpan={4} style={{ border: "1px solid" }}>
                      Non Parallelism of optical axes
                    </TableCell>
                    <TableCell rowSpan={2} style={{ border: "1px solid" }}>
                      Horizontal = 3°00' to 5°30'
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>L</TableCell>

                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue
                        val={`${selectedDevice.visualTestDto.parallelHorizDegL} deg ${selectedDevice.visualTestDto.parallelHorizMinL} min`}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>R</TableCell>

                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue
                        val={`${selectedDevice.visualTestDto.parallelHorizDegR} deg ${selectedDevice.visualTestDto.parallelHorizMinR} min`}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell rowSpan={2} style={{ border: "1px solid" }}>
                      Vertical =1°(Max)
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>L</TableCell>

                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.parallelVertiL} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>R</TableCell>

                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.parallelVertiR} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>9.</TableCell>
                    <TableCell style={{ border: "1px solid" }}>Cleanliness of Optical</TableCell>
                    <TableCell colSpan={2} style={{ border: "1px solid" }}>
                      As PER TY
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.cleanOptical} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>10.</TableCell>
                    <TableCell style={{ border: "1px solid" }}>Movement of iris Diaphragm</TableCell>
                    <TableCell colSpan={2} style={{ border: "1px solid" }}>
                      Should be Smooth
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.movementIrisDiaphragm} />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ border: "1px solid" }}>11.</TableCell>
                    <TableCell style={{ border: "1px solid" }}>Range</TableCell>
                    <TableCell colSpan={2} style={{ border: "1px solid" }}>
                      150 meter analysis
                    </TableCell>
                    <TableCell style={{ border: "1px solid" }}>
                      <ShowValue val={selectedDevice.visualTestDto.range} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>Loading...</p>
          )}
        </DialogContent>
      </div>
      <DialogActions>
        <Button size="small" variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
        <Button size="small" variant="contained" color="secondary" onClick={onClose} type="submit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
