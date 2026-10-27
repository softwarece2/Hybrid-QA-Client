import { Button, Dialog, DialogContent, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Print } from "@material-ui/icons";
import PrintQcReport from "./PrintQcTest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import { useDispatch } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import PrintQaTest from "./PrintQaTest";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";

export default function InstrumentQAReport({ olId }) {
  const [data, setData] = useState([]);
const[open,setOpen] = useState(false)
 const dispatch = useDispatch(); 
  const [selectedRoundForPrint, setSelectedRoundForPrint] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const fetchAllTestValues = async () => {
    try {
      const { data } = await axiosInstance(`offerLetter/${olId}/getRegs`);
      setData(data);
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    if (olId) {
      fetchAllTestValues();
    }
  }, [olId]);

  const handleBack = () => dispatch(selectItem(<CQAIDetailsINote />));

  const handlePrintClick = (reg,row) => {
    setSelectedRow(row);
    setSelectedRoundForPrint(reg);
  };

  return (
    <>
    <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleBack}
                startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
              >
                Back
              </Button>
{selectedRoundForPrint && (
        <PrintQaTest
          data={selectedRoundForPrint}
          // selectedItem={selectedRoundForPrint} 
          onClose={() => setSelectedRoundForPrint(null)}
        />
      )}

      <Table size="small" stickyHeader style={{ maxWidth: "1200px", marginLeft:"230px" }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>S.No.</StyledTableCell>
            <StyledTableCell>Reg No</StyledTableCell>
            <StyledTableCell>Print</StyledTableCell>
          </TableRow>
        </TableHead>

   
        <TableBody>
          {data.map((reg, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{reg.serialNo}</StyledTableCell>
              <StyledTableCell >
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={() => handlePrintClick(reg)} 
                >
                  <Print fontSize="small" />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>

    </>
  );
}