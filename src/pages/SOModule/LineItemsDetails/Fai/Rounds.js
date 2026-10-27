import { Button, Dialog, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, withStyles } from "@material-ui/core";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, StyledTableRow } from "Utils";
import { AddOutlined, ArrowBack } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import OLTable from "pages/Sslip/SSlipTable";
import FaiEntry from "./FaiEntry";
import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";
import AddRound from "./AddRound";
import ViewRegistrationNos from "./ViewRegistrationNos";

export const StyledTableCellFai = withStyles((theme) => ({
  body: {
    fontSize: 12,
    padding: 4,
  },
  head: {
    backgroundColor: "#205375",
    color: theme.palette.primary.contrastText,
    fontSize: 14,
    padding: "2px 8px",
  },
}))(TableCell);

export function FaiRound({ ol, olCycle, onCloseFai }) {
  const user = useSelector((store) => store.loggedInUser);
  const dispatch = useDispatch();
  const empId = user?.empId;

  const roleId = user?.roleId;
  const departmentId = user?.departmentId;

  const [loading, setLoading] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [openAddRound, setOpenAddRound] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedRoundForAdd, setSelectedRoundForAdd] = useState(null);
  const [startInspection, setStartInspection] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [openViewDetails, setOpenViewDetails] = useState(null);

  async function getFaiDetails() {
    setLoading(true);
    try {
      const { data } = await axiosInstanceAte("faiDetails/getByOlId/" + ol?.id);
      const result = data.map((r) => {
        const faiDetails = Object.values(
          r.faiDetails.reduce((acc, { pageNo, regNo, regName }) => {
            if (!acc[pageNo]) {
              acc[pageNo] = {
                pageNo,
                regNos: [],
              };
            }
            acc[pageNo].regNos.push({ regNo, regName });
            return acc;
          }, {})
        ).sort((a, b) => a.pageNo - b.pageNo);

        return {
          ...r,
          pages: Array.from({ length: faiDetails.length })
            .map((_, i) => i + 1)
            .join(", "),
          faiDetails,
        };
      });

      setRounds(result);
    } catch (error) {
      console.log(error);
      toast.error("Failed to get rounds");
    } finally {
      setLoading(false);
    }
  }

  async function getSpec() {
    if (ol.productId) {
      try {
        const { data } = await axiosInstanceAte.get("spec/getFaiSpecsByProdId", {
          params: {
            productId: ol.productId,
          },
        });
        setSpecs(data?.specDtos || []);
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Failed to get specs, productId is not mapped with OL line item");
    }
  }

  useEffect(() => {
    getFaiDetails();
    getSpec();
  }, []);

  const content = (
    <>
      {openAddRound && (
        <AddRound
          onClose={() => {
            setOpenAddRound(false);
            setSelectedRoundForAdd(null);
          }}
          ol={ol}
          empId={empId}
          refresh={getFaiDetails}
          rounds={rounds}
          selectedRound={selectedRoundForAdd}
        />
      )}

      {!!openViewDetails && <ViewRegistrationNos onClose={() => setOpenViewDetails(null)} details={openViewDetails} />}

      <Button
        style={{ textTransform: "capitalize", opacity: olCycle ? 0 : 1 }}
        size="small"
        startIcon={<ArrowBack />}
        variant="contained"
        color="secondary"
        onClick={() => dispatch(selectItem(<OLTable />))}
      >
        Back
      </Button>

      <div style={{ maxWidth: 1000, marginInline: "auto", marginTop: -32 }}>
        <Button
          disabled={!(USER_ROLE_ID.ROLE_GIC === roleId && DEPARTMENT_ID.QC === departmentId) || loading}
          style={{ textTransform: "capitalize" }}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddOutlined />}
          onClick={() => setOpenAddRound(true)}
        >
          Add Round
        </Button>
        <TableContainer style={{ maxHeight: 150, overflow: "auto", border: "1px solid lightgrey" }}>
          <Table stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCellFai>S.No.</StyledTableCellFai>
                <StyledTableCellFai>Name</StyledTableCellFai>
                <StyledTableCellFai>Page</StyledTableCellFai>
                <StyledTableCellFai>Remarks</StyledTableCellFai>
                <StyledTableCellFai>Action</StyledTableCellFai>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <StyledTableRow>
                  <StyledTableCellFai colSpan={5}>
                    <LinearProgress />
                  </StyledTableCellFai>
                </StyledTableRow>
              )}
              {rounds.map((r, i) => (
                <StyledTableRow key={i.id} style={{ backgroundColor: r.id === selectedRound?.id ? "lightgrey" : "initial" }}>
                  <StyledTableCellFai>{i + 1}</StyledTableCellFai>
                  <StyledTableCellFai style={{ width: 200 }}>{r.name}</StyledTableCellFai>
                  <StyledTableCellFai style={{ width: 200 }}>{r.pages}</StyledTableCellFai>
                  <StyledTableCellFai style={{ width: 200 }}>{r.remarks}</StyledTableCellFai>
                  <StyledTableCellFai>
                    <div style={{ display: "flex", gap: 8, width: 350 }}>
                      <Button
                        color="primary"
                        style={{ textTransform: "capitalize" }}
                        variant="contained"
                        size="small"
                        onClick={() => {
                          if (!specs.length) {
                            toast.error("Can't open FAI, Specification not loaded");
                          } else {
                            setSelectedRound(r);
                            setStartInspection(true);
                          }
                        }}
                      >
                        Start Inspection
                      </Button>
                      <Button
                        style={{ textTransform: "capitalize" }}
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setSelectedRoundForAdd(r);
                          setOpenAddRound(true);
                        }}
                      >
                        Add Reg. No.
                      </Button>
                      <Button
                        style={{ textTransform: "capitalize" }}
                        variant="contained"
                        size="small"
                        onClick={() => setOpenViewDetails(r)}
                      >
                        View Reg. No.
                      </Button>
                    </div>
                  </StyledTableCellFai>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {startInspection && specs.length ? <FaiEntry ol={ol} selectedRound={selectedRound} specs={specs} empId={empId} /> : null}
    </>
  );
  if (olCycle) {
    return (
      <Dialog maxWidth="xl" fullWidth open>
        <DialogContent style={{ minHeight: 600 }}>{content}</DialogContent>
        <DialogActions>
          <Button style={{ textTransform: "capitalize" }} onClick={onCloseFai} variant="contained" color="secondary" size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return content;
}
