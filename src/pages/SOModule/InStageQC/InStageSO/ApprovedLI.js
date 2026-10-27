/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import TableComponent from "components/table/index";
import ActionButton from "components/ActionButton";
import UpdateLineItems from "../../../Sslip/CreatT";
import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { getLIById, getRegWarrants, getwarrantBysoliId } from "pages/Services/URLs";
import { filter } from "@amcharts/amcharts4/.internal/core/utils/Iterator";

const columns = [
  { title: "Material No./EP Code No.", field: "partNo", width: "auto" },
  { title: "Work Order No.", field: "saleOrderNo", width: "auto" },
  { title: "Warrant No.", field: "categoryName", width: "auto"},
  { title: "Line Item/ Indent Sl No.", field: "lineItemNo", width: "auto" },
  { title: "Material Description", field: "description", width: "auto" },
  { title: "Remaining Qty", field: "remainingQty", width: "auto" },
  { title: "Total Qty", field: "orderQty", width: "auto" },
];

export default function ApprovedLI({ soObj }) {
  const [selectedLI, setSeletcedLI] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);


  async function fetchLI() {
    if (soObj) {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(getwarrantBysoliId  + soObj?.id);
        setRecords(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchLI();
  }, []);
  console.log(records,"records")
  const handleClick = async () => {
    if (selectedLI.length === 0) {
      console.warn("No line items selected.");
      return; 
    }

    
    const selectedIds = selectedLI.map(item => item.id);

   
    if(!selectedIds){
      console.warn("No valid ID found in selected line items.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`${getRegWarrants}${selectedIds}`);
      setRecords(data);
    } catch (error) {
      console.error("Error fetching updated line items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        options={{
          selection: true,
        }}
        onSelectionChange={(e, rows) => {
          setSeletcedLI(e);
        }}
        actions={[
          {
            tooltip: "InStage  QC",
            icon: () => (
              <ActionButton
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleClick}
                disabled={
                  selectedLI?.length < 1 ||
                  selectedLI?.some((val) => val?.soId !== selectedLI[0]?.soId)
                }
              >
                Proceed
              </ActionButton>
            ),
          },
        ]}
      />

      {open && (
        <UpdateLineItems
          selectedLI={selectedLI}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
