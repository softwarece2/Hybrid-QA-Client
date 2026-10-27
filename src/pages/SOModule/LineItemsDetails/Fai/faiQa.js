import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArrowBack } from "@material-ui/icons";
import { Button, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, withStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
//
import FaiEntry from "./FaiEntry";
import ViewRegistrationNos from "./ViewRegistrationNos";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { StyledTableRow } from "Utils";

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

export function FaiQA({ ol }) {
  const user = useSelector((store) => store.loggedInUser);
  const dispatch = useDispatch();
  const empId = user?.empId;

  const [startInspection, setStartInspection] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState([]);
  const [openViewDetails, setOpenViewDetails] = useState(null);

  async function getFaiDetails() {
    setLoading(true);
    try {
      const { data } = await axiosInstanceAte("faiDetails/getByOlIdForQa/" + ol?.id);
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
        toast.error("Failed to get specs");
      }
    } else {
      toast.error("Failed to get specs, productId is not mapped with OL line item");
    }
  }

  useEffect(() => {
    getFaiDetails();
    getSpec();
  }, []);

  return (
    <>
      {!!openViewDetails && <ViewRegistrationNos onClose={() => setOpenViewDetails(null)} details={openViewDetails} />}

      <Button
        style={{ textTransform: "capitalize" }}
        size="small"
        startIcon={<ArrowBack />}
        variant="contained"
        color="secondary"
        onClick={() => dispatch(selectItem(<InspectOLTable />))}
      >
        Back
      </Button>

      <div style={{ maxWidth: 1000, marginInline: "auto", marginTop: -32 }}>
        <TableContainer style={{ maxHeight: 150, overflow: "auto", border: "1px solid lightgrey" }}>
          <Table stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCellFai style={{ width: 40 }}>S.No.</StyledTableCellFai>
                <StyledTableCellFai>Name</StyledTableCellFai>
                <StyledTableCellFai>Page</StyledTableCellFai>
                <StyledTableCellFai>Remarks</StyledTableCellFai>
                <StyledTableCellFai style={{ width: 120 }}>Action</StyledTableCellFai>
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
                  <StyledTableCellFai>{r.name}</StyledTableCellFai>
                  <StyledTableCellFai>{r.pages}</StyledTableCellFai>
                  <StyledTableCellFai>{r.remarks}</StyledTableCellFai>
                  <StyledTableCellFai>
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
                  </StyledTableCellFai>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {specs.length && startInspection ? (
        <FaiEntry ol={ol} selectedRound={selectedRound} specs={specs} empId={empId} loading={loading} />
      ) : null}
    </>
  );
}
