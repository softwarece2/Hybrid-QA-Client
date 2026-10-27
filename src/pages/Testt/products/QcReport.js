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
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";

export default function QcReport({ olId,returnTo}) {
  const [data, setData] = useState([]);
const[open,setOpen] = useState(false)
 const dispatch = useDispatch(); 
  const [selectedRoundForPrint, setSelectedRoundForPrint] = useState(null);

  const fetchAllTestValues = async () => {
    try {
      const { data } = await axiosInstance(`merge/sslip/${olId}/getRegs`);
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

   const handleBack = () => {
     if (returnTo === "details") {
       dispatch(selectItem(<DetailsINote />));
     } else if (returnTo === "instrList") {
       dispatch(selectItem(<CQAIDetailsINote />));
     } 
     else{
         dispatch(selectItem(<DetailsINote />));
     }
   };

  const handlePrintClick = (reg) => {

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
        <PrintQcReport
          data={data}
          selectedItem={selectedRoundForPrint} 
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