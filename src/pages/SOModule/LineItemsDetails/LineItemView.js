/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../../App.css";
//component
import TableComponent from "components/table/index";

//material-ui
import Divider from "@material-ui/core/Divider";
import { useDispatch } from "react-redux";
import { getLineItemsById } from "Redux/Actions/SupplyOrder/LIAction";


const columns = [
  {
    title: "Work Order No.",
    field: "saleOrderNo",
    width: "auto",
    filtering: true,
  },
  {
    title: "Line Item/ Indent Sl No.",
    field: "lineItemNo",
    width: "auto",
    filtering: true,
  },
  {
    title: "Material No./EP Code No.",
    field: "partNo",
    width: "auto",
    filtering: true,
  },
  {
    title: "CAT Part Number",
    field: "catPartNumber",
    width: "auto",
    filtering: true,
  },
  {
    title: "NSN Part Number",
    field: "nsnPartNumber",
    width: "auto",
    filtering: true,
  },
  {
    title: "Material Description",
    field: "materialDescription",
    width: "auto",
    sorting: true,
  },
  { title: "UoM", field: "uomName", width: "auto" },
  { title: "Unit Price", field: "unitCostStr", width: "auto" },
  { title: "Item Category", field: "itemCategoryName", width: "auto" },
  { title: "Total Qty", field: "orderQty", width: "auto" },
  { title: "Remaining Qty", field: "remainingQty", width: "auto" },
  { title: "Inspection Authority ", field: "inspectionAuthorityName", width: "auto" },
  // { title: "GCS", field: "isGcs", width: "auto" },
  // { title: "Is Imported", field: "imported", width: "auto" },
  //   {
  //     title: "Actions",
  //     field: "actions",
  //     width: "auto",
  //     filtering: false,
  //     sorting: false,
  //   },
];
export default function LineItemView({ soId }) {
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (soId != null) { 
      setLoading(true);

      dispatch(getLineItemsById(soId)) 
        .then((data) => {
          setRecords(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching line items:", error);
          setLoading(false);
        });
    } else {
      setRecords([]);
      setLoading(false);
    }
  }, [soId]);

  return (
    <>
      <Divider />
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
