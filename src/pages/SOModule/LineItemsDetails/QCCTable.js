import { useState, useRef } from "react";
import "../../../App.css";
//component
import TableComponent from "components/table/index";

export default function QCCTable() {
   const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: "OL No",
            field: "saleOrderNo",
            width: "auto",
            filtering: true,
          },
          {
            title: "WO NO.",
            field: "saleOrderNo",
            width: "auto",
            filtering: true,
          },
          { title: "WT. No.", field: "categoryName", width: "auto" },
          { title: "Generate", field: "categoryName", width: "auto" },

          { title: "WT. No.", field: "categoryName", width: "auto" },

  ];
 
  return (
    <>
       <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        options={{ filtering: false, search: false }}
      />
    </>
  );
}