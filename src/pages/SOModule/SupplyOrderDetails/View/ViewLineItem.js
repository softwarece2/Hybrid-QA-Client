/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../../../App.css";

//globals

//pages

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid} from "@material-ui/core";
import AutoCompleteNew from "components/AutoCompleteNew";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

//icons
import Active from "components/Active";
import InActive from "components/InActive";
import {
  getLineItemsById,
  getOLBySaleOrder,
} from "Redux/Actions/SupplyOrder/LIAction";
import {
  getAllSaleOrderDetails,
  getSOByOrgIdOptimized,
 
} from "Redux/Actions/SupplyOrder/SOAction";



export default function ViewLineItem() {
  
  const dispatch = useDispatch();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [supplyOrderId, setSupplyOrderId] = useState("");
  const [saleOrderId, setSaleOrderId] = useState("");

  const supplyDetails = useSelector(
    (store) => store.soReducer?.supplyOderByOrgId
  );
  const saleDetails = useSelector((store) => store.soReducer?.saleOrders);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  

  const {
    control,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  const [columns] = useState([
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
      field: "catPartNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "NSN Part Number",
      field: "nsnPartNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Material Description",
      field: "description",
      width: "auto",
      sorting: true,
    },
    { title: "UoM", field: "uomName", width: "auto" },
    { title: "Unit Price", field: "unitCostStr", width: "auto" },
    { title: "Item Category", field: "itemCategoryName", width: "auto" },
    { title: "Total Qty", field: "orderQty", width: "auto" },
    { title: "Remaining Qty", field: "remainingQty", width: "auto" },
    { title: "Is Imported", field: "imported", width: "auto" },

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
    { title: "Status", field: "status", width: "auto", filtering: false },
    // { title: "Actions", field: "actions", width: "auto", filtering: false },
  ]);

  const supplyOrderIdWatcher = useWatch({ control, name: "supplyOrderId" });
  console.log("supplyOrderIdWatcher", supplyOrderIdWatcher);

  const fetchLI = (id) => {
    setLoading(true);
    if (id) {
      dispatch(getLineItemsById(id))
        .then((data) => {
          setRecords(
            data.map((el, i) => ({
              ...el,
              imported: el?.imported ? "Yes" : "No",
              status:
                el?.status === "Active" ? (
                  <Active />
                ) : el?.status === "Inactive" ? (
                  <InActive />
                ) : null,
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
  const fetchSO = () => {
    setLoading(true);
    dispatch(getSOByOrgIdOptimized(orgId))
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const fetchLiBySale = async () => {
    if (saleOrderId) {
      const data = await getOLBySaleOrder(saleOrderId);
      console.log("data", data);
      setRecords(
        data.map((el, i) => ({
          ...el,
          imported: el?.imported ? "Yes" : "No",
          status:
            el?.status === "Active" ? (
              <Active />
            ) : el?.status === "Inactive" ? (
              <InActive />
            ) : null,
        }))
      );
    } else {
      fetchLI(supplyOrderId);
    }
  };

  useEffect(() => {
    if (!supplyOrderIdWatcher) {
      setSaleOrderId(null);
      setValue("saleOrderId", null);
      dispatch({ type: "SALE_ORDER", payload: [] });
    }
  }, [supplyOrderIdWatcher]);

  useEffect(() => {
    if (supplyDetails.length === 0) {
      fetchSO();
      console.log(supplyDetails, "supplyDetails");
    }
    fetchLiBySale();
  }, [saleOrderId]);

  useEffect(() => {
    if (saleOrderId !== "" && saleOrderId !== undefined) {
      const data = records.filter((item) => item.saleOrderNo == saleOrderId);

      setRecords(data);
    } else {
      fetchLI(supplyOrderId);
    }
  }, [saleOrderId]);
  const actions = [
    {
      icon: () => (
        <Controller
          name="supplyOrderId"
          control={control}
          render={({ field: { onChange, value, ...props } }) => (
            <AutoCompleteNew
              data={supplyDetails}
              value={value}
              labelText="Enter/ Search Supply Order"
              getOptionLabel={(o) => o.orderNo}
              onChange={(e, v) => {
                onChange(v);
                setSupplyOrderId(v?.id);
                fetchSaleOrders(v?.id);
                fetchLI(v?.id);
              }}
            />
          )}
        />
      ),
      // tooltip: "Add Bulk Pass",
      isFreeAction: true,
      onClick: (event, rowData) => {
        // setOpenAddOrEdit(true);
      },
    },
    {
      icon: () => (
        <Controller
          name="saleOrderId"
          control={control}
          render={({ field: { onChange, value, ...props } }) => (
            <AutoCompleteNew
              data={saleDetails}
              value={value || ""}
              labelText="Enter/ Search Sale Order "
              getOptionLabel={(o) => o.saleOrderNo}
              onChange={(e, v) => {
                onChange(v);
                setSaleOrderId(v?.id);
                // fetchLI(v.id);
              }}
            />
          )}
        />
      ),
      // tooltip: "Add Bulk Pass",
      isFreeAction: true,
      onClick: (event, rowData) => {
        // setOpenAddOrEdit(true);
      },
    },
  ];

  const fetchSaleOrders = (id) => {
    if (id !== undefined) {
      dispatch(getAllSaleOrderDetails(id));
    }
  };

  // useEffect(() => {
  //   fetchLI(0);
  // }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={actions}
            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}
