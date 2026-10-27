/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import TableComponent from "components/table/index";
import { Grid } from "@material-ui/core";
import Active from "components/Active";
import InActive from "components/InActive";
import { getSupplyOrderByOrgIdOptimized } from "Redux/Actions/SupplyOrder/SOAction";

export default function SODetailsTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const [columns] = useState([
    { title: "SO/PO Number", field: "orderNo", width: "auto", filtering: true },
    { title: "Order Master No.", field: "fileNo", width: "auto", sorting: true },
    { title: "No. of items", field: "noOfItems", width: "auto" },
    { title: "Total Qty", field: "totalQty", width: "auto" },
    { title: "Delivery Date", field: "dd", width: "auto" },
    { title: "Indent Date", field: "orderDate", width: "auto" },
    { title: "Status", field: "status", width: "auto", filtering: false },
  ]);

  const getAllSupplyOrder = () => {
    setLoading(true);
    getSupplyOrderByOrgIdOptimized(orgId)
      .then((data) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            orderNo: el?.orderNo,
            fileNo: el?.fileNo,
            noOfItems: el?.noOfItems,
            totalQty: el?.totalQty,
            dd: el?.dd ? moment(el?.dd).format("DD-MM-yyyy") : null,
            orderDate: el?.orderDate
              ? moment(el?.orderDate).format("DD-MM-yyyy")
              : "",
            status:
              el?.status === "Active" ? (
                <Active />
              ) : el?.status === "Inactive" ? (
                <InActive />
              ) : null,
          }))
        );

        console.log("records", records);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    getAllSupplyOrder();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            pageSize={10}
            title=""
          />
        </Grid>
      </Grid>
    </>
  );
}
