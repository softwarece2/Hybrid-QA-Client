/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../../App.css";
import { useSelector } from "react-redux";

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";

//redux
import { useDispatch } from "react-redux";
import { getLineItemsById } from "Redux/Actions/SupplyOrder/LIAction";
import { updateByRead} from "Redux/Actions/Notifications/UnreadNotificationAction";


export default function LineItemsView({ soId, recordsId}) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.loggedInUser);


  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [columns] = useState([
    { title: "Item Category", field: "itemCategoryName", width: "auto" },
    {
      title: "EP Code",
      field: "partNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Line Item Number",
      field: "lineItemNo",
      width: "auto",
      filtering: true,
    },
   
    {
      title: "Material Description",
      field: "materialDescription",
      width: "auto",
      sorting: true,
    },
    { title: "UoM(Unit)", field: "uomName", width: "auto" },
    { title: "Unit Price", field: "unitCostStr", width: "auto" },
 
    { title: "Total Qty", field: "orderQty", width: "auto" },
    { title: "Remaining Qty", field: "remainingQty", width: "auto" },
    // { title: "Acct", field: "account", width: "auto" },
    // {
    //   title: "Under Warranty/Guarantee",
    //   field: "underWarrantyStr",
    //   width: "auto",
    // },
    // { title: "Warranty Duration", field: "duration", width: "auto" },
    // {
    //   title: "Warranty in Years/Months/Days",
    //   field: "durationTypeName",
    //   width: "auto",
    // },
  ]);
  const fetchLI = (id) => {
    setLoading(true);
    if (id !== undefined) {
      dispatch(getLineItemsById(id))
        .then((data) => {
          setRecords(
            data.map((el, i) => ({
              ...el,
            }))
          );
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
    setLoading(false);
    setRecords([]);
  };

  useEffect(() => {
    fetchLI(soId);
  }, []);

  const readByData = (recordsId)=> {
    dispatch(updateByRead(recordsId, loggedInUser?.empId))
      .then((response) => {
        if (response) {
          console.log("Notification marked as read");
        } else {
          console.error("Failed to mark notification as read");
        }
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  }

useEffect(() => {
  readByData(recordsId);
}, [recordsId, loggedInUser?.empId]);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""

            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}
