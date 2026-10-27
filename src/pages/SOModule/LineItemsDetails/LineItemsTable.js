/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState, useRef } from "react";
import "../../../App.css";

//globals
import { DEPARTMENT_ID, USER_ROLE_ID } from "../../../Globals";

//pages
import LineImport from "./LineImport";
import LineItemsForm from "./LineItemsForm";

//componentAdd
import TableComponent from "components/table/index";

//material-ui
import { Button,IconButton, MenuItem, Popover, Typography } from "@material-ui/core";
import AutoCompleteNew from "components/AutoCompleteNew";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import myFile from "../../../assets/Files/Excels/LineItems.xlsx";
//icons
import ActionButton from "components/ActionButton";
import Active from "components/Active";
import InActive from "components/InActive";
import { getLineItemsById, getOLBySaleOrder } from "Redux/Actions/SupplyOrder/LIAction";
import { saveLineImportDetailsReset } from "Redux/Actions/SupplyOrder/LineImportAction";
import { getAllSaleOrderDetails, getAllSOBySalesGrp } from "Redux/Actions/SupplyOrder/SOAction";
import LineItemCreate from "./LineItemCreate";
import { Add, Delete, Edit, MoreVert, RemoveRedEye } from "@material-ui/icons";
import LineItemDelete from "./LineItemDelete";
import AddUpdateLot from "./add-update-lot";
import LineItemLots from "./lineitem-lots";
import AddRegNo from "./addRegNo";
import ProjectDetailsTable from "pages/SOModule/ProjectDetails/ProjectDetailsTable";
import { SELECTED_SO_ID, SELECTED_SO_NUMBER } from "Redux/Types";
import { getEditId } from "Redux/Actions/SupplyOrder/LIAction";
import LineItemDetails from "./LineItemDetails";
import LineItemLotsTable from "../ItemLots/LineItemLotsTable";
import LIDeliveryDateDialog from "../SupplyOrderDetails/DialogForms/DeliveryDate/LIDeliveryDateDialog";
import LIAmendmentsDialog from "../SupplyOrderDetails/DialogForms/Amendments/LIAmendmentDialog";
import { StatusChips } from "Utils";

export default function LineItemsTable(getSoBySoId) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const user_role = loggedInUser?.roleId;
  const supplyDetails = useSelector((store) => store.soReducer?.soBySalesGroup);
  const empId = useSelector((state) => state?.loggedInUser?.empId);
  const selectedSO = useSelector((store) => store.pdReducer.selectedSoInLi);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [openAllotQty, setOpenAllotQty] = useState(false);
  const [dataVal, setDataVal] = useState({});
  const [supplyOrderId, setSupplyOrderId] = useState("");
  const [saleOrderId, setSaleOrderId] = useState("");
  const [supplyOrder, setSupplyOrder] = useState("");
  const [openAddRegNo, setOpenAddRegNo] = useState(false);
  const [openSoWoMapper, setOpenSoWoMapper] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState({});
  const [ItemAllotView, setItemAllotView] = useState(false);
  const [viewDD, setViewDD] = useState(false);
  const [viewAmendment, setViewAmendment] = useState(false);

  const { control, setValue } = useForm({
    mode: "onChange",
  });

  const supplyOrderIdWatcher = useWatch({ control, name: "supplyOrderId" });
  const isInitialRender = useRef(true);
  console.log(selectedLineItem, "selectedLineItem");
  const columns = [
    {
      title: "Material No./EP Code No.",
      field: "partNo",
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
      title: "Work Order No.",
      field: "saleOrderNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "OLF Order Master No.",
      field: "orderMasterNo",
      width: "auto",
      // filtering: true,
    },
    {
      title: "Delivery Date",
      field: "deliveryDt",
      // filtering: true,
    },

    {
      title: "Consignee",
      field: "consignee",
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
    { title: "Item Category", field: "itemCategoryName", width: "auto" },
    { title: "Total Qty", field: "orderQty", width: "auto" },
    {
      title: "Warrant",
      field: "mapper",
      render: (rowData) => {
        return (
          <ActionButton
            size="small"
            color="secondary"
            variant="outlined"
            onClick={() => {
              setOpenSoWoMapper(true);
              setSelectedRow(rowData);
            }}
          >
            Warrant
          </ActionButton>
        );
      },
      width:"auto",
      
    },
    
    { title: "Remaining Qty", field: "remainingQty", width: "auto" },
    { title: "Inspection Authority", field: "inspectionAuthorityName", width: "auto" },
    {
      title: "LI Status",
      field: "status",
      render: (el) => <StatusChips status={el.status} />,
    },
    ];
  useEffect(() => {
    if (supplyDetails?.length > 0 && !supplyOrderId) {
      const firstSO = supplyDetails[0];
      setValue("supplyOrderId", firstSO);
      setSupplyOrder(firstSO)
      setSupplyOrderId(firstSO.id);
      setSaleOrderId(firstSO.id);
      fetchLI(firstSO.id);
      isInitialRender.current = false;
    }
  }, [supplyDetails, supplyOrderId, isInitialRender]);

  const fetchLI = (id) => {
    if (id) {
      setLoading(true);
      dispatch(getLineItemsById(id))
        .then((data) => {
          setRecords(
            data.map((el, i) => ({
              ...el,
              imported: el?.imported ? "Yes" : "No",
              gcs: el?.gcs ? "true" : "false",
              isGcs: el?.gcs ? "Yes" : "No",
              
              // actions: (
              //   <div style={{ display: "flex", gap: 4 }}>
              //     <ActionButton
              //       variant="contained"
              //       size="small"
              //       color="primary"
              //       obs={"line"}
              //       startIcon={<Add fontSize="small" />}
              //       onClick={() => {
              //         setOpenAllotQty(true);
              //         setDataVal(el);
              //       }}
              //     >
              //       Year-wise
              //     </ActionButton>
              //     <ActionButton
              //       variant="contained"
              //       size="small"
              //       color="primary"
              //       startIcon={<EditIcon />}
              //       onClick={() => {
              //         setOpen(true);
              //         setDataVal(el);
              //       }}
              //     >
              //       Edit
              //     </ActionButton>
              //     <IconButton
              //       variant="contained"
              //       size="small"
              //       color="secondary"
              //       onClick={() => {
              //         setOpenDel(true);
              //         setDataVal(el);
              //       }}
              //     >
              //       <Delete />
              //     </IconButton>
              //   </div>
              // ),
            }))
          );
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
    // setLoading(false);
    setRecords([]);
  };

  const fetchSO = () => {
    setLoading(true);
    dispatch(getAllSOBySalesGrp(empId))
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
      setRecords(
        data.map((el, i) => ({
          ...el,
          imported: el?.imported ? "Yes" : "No",
          gcs: el?.gcs ? "true" : "false",
          isGcs: el?.gcs ? "Yes" : "No",
          status: el?.status === "Active" ? <Active /> : el?.status === "Inactive" ? <InActive /> : null,

          // actions: (
          //   <div style={{ display: "flex", gap: 4 }}>
          //     <ActionButton
          //       variant="contained"
          //       size="small"
          //       color="primary"
          //       startIcon={<Add fontSize="small" />}
          //       onClick={() => {
          //         setOpenAllotQty(true);
          //         setDataVal(el);
          //       }}
          //     >
          //       Lot
          //     </ActionButton>
          //     <ActionButton
          //       variant="contained"
          //       size="small"
          //       color="primary"
          //       startIcon={<EditIcon />}
          //       onClick={() => {
          //         setOpen(true);
          //         setDataVal(el);
          //       }}
          //     >
          //       Edit
          //     </ActionButton>
          //     <IconButton
          //       variant="contained"
          //       size="small"
          //       color="secondary"
          //       onClick={() => {
          //         setOpenDel(true);
          //         setDataVal(el);
          //       }}
          //     >
          //       <Delete />
          //     </IconButton>
          //   </div>
          // ),
        }))
      );
      setLoading(false);
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
    }
    // fetchLiBySale();
  }, [saleOrderId]);

  useEffect(() => {
    const obj = supplyDetails.find((item) => item.id === selectedSO);
    if (obj) {
      setValue("supplyOrderId", obj);
      setSupplyOrderId(obj?.id);
      setSaleOrderId(obj?.id);
      fetchLI(obj?.id);
    }

    return () => dispatch(saveLineImportDetailsReset());
  }, [selectedSO]);

  const actions = [
    {
      icon: () => (
        <Controller
          name="supplyOrderId"
          control={control}
          render={({ field: { onChange, value, ...props } }) => (
            <AutoCompleteNew
              data={supplyDetails}
              value={value || ""}
              labelText="Enter/ Search Supply Order"
              getOptionLabel={(o) => o.orderNo}
              onChange={(e, v) => {
                onChange(v);
                setSupplyOrderId(v?.id);
                setSupplyOrder(v);
                // fetchSaleOrders(v?.id);
                // setValue("saleOrderId", null);
                fetchLI(v?.id);
              }}
              minWidth={300}
            />
          )}
        />
      ),
      isFreeAction: true,
      onClick: (event, rowData) => {
        // setOpenAddOrEdit(true);
      },
    },

    (row)=> ({
      
      icon: () => (
        <Button style={{ minWidth: 100, textTransform: "capitalize" }} size="small" color="primary" variant="contained" startIcon={<Add />}>
          {row.isRegistrationNo === null ? "AddReg No." : row.isRegistrationNo ? "Reg No." : "Running No."}
        </Button>
      ),
      hidden:loggedInUser?.departmentTypeId === DEPARTMENT_ID.ASSEMBLY || row.registrationNo===3,
      onClick: (_, rowData) => {
       setOpenAddRegNo(true);
       setDataVal(rowData)
      },
    }),
    {
      icon: () => (
        <Button variant="contained" size="small" color="primary" startIcon={<Add fontSize="small" />} style={{textTransform:"capitalize",minWidth:110 }}>
          Year-wise
        </Button>
      ),
      onClick: (event, rowData) => {
        setOpenAllotQty(true);
        setDataVal(rowData);
      },
    },
    {
      icon: () => (
        <IconButton color="primary">
          <RemoveRedEye />
        </IconButton>
      ),
      onClick: (_, rowData) => {
        setOpenDetails(true); 
        setSelectedLineItem(rowData);
      },
    },
    {
      icon: () => (
        <IconButton color="primary">
          <Edit />
        </IconButton>
       
      ),
      onClick: (event, rowData) => {
         dispatch({
                  type: SELECTED_SO_ID,
                  payload: supplyOrder?.id,
                });
                dispatch({
                  type: SELECTED_SO_NUMBER,
                  payload: supplyOrder?.orderNo,
                });
        // setOpen(true);
        // setDataVal(rowData);
        dispatch(getEditId(rowData.id))
        .then(() => {
          setOpen(true);
          setDataVal(rowData);
        })
        .catch((error) => {
          console.error("Error fetching edit data:", error);
        });
      },
    },

    {
      icon: () => (
        <IconButton variant="contained" size="small" color="secondary" >
          <Delete/>
        </IconButton>
      ),
      onClick: (event, rowData) => {
        setOpenDel(true);
        setDataVal(rowData);
      },
    },    
  ];

  const actions1 = [
    {
      label: "Item Lots",
      onClick: (rowData) => {
        setItemAllotView(true);
        setSelectedLineItem(rowData);
      },
      tooltip: "View Item Lots",
    },
    // {
    //   label: "Delivery Date",
    //   tooltip: "Add/Edit SO Details",
    //   onClick: (rowData) => {
    //     setOpen(true);
    //     // getSoAttachmentsFn(rowData);
    //     // setSelectedRow(rowData);
    //     // setSoObj(rowData);
    //   },
    //   // hidden: () => {
    //   //   return !isPlanner;
    //   // },
    //   tooltip: "Edit SO Details",
    // },
    {
      label: "DD Extension",
      onClick: (rowData) => {
        setViewDD(true);
        setSelectedLineItem(rowData);

      },
      tooltip: "View DD Details",
    },
    // {
    //   label: "Amendments",
    //   onClick: (rowData) => {
    //     // setViewScrutiny(true);
    //     // setValueId(rowData?.id);
    //     // setSoObj(rowData);
    //   },
    //   tooltip: "View SO Scrutiny Details",
    // },
    {
      label: "Amendments",
      onClick: (rowData) => {
        setViewAmendment(true);
        setSelectedLineItem(rowData);
     
        // setSoObj(rowData);
      },
      tooltip: "View Amendments",
    },
  ];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = myFile;
    link.download = "Line Item Excel.xlsx";
    link.click();
  };

  const detailPanel = [
    {
      tooltip: "Show Details",
      render: (rowData) => {
        return (
          <div
            style={{
              border: "1px solid lightgrey",
              maxWidth: 1200,
              marginInline: "auto",
            }}
          >
            <LineItemLots selectedLineItem={rowData} />
          </div>
        );
      },
    },
  ];

  return (
    <>
       
      {openAllotQty && (
        <AddUpdateLot
          fetchRecords={fetchLiBySale}
          onClose={() => {
            setOpenAllotQty(false);
          }}
          selectedLineItem={dataVal}
        />
      )}
        { openAddRegNo  &&<AddRegNo onClose={() =>{ setOpenAddRegNo(false); setDataVal(null)  } } selectedLineItem={dataVal}  />}
      {user_role === USER_ROLE_ID.ROLE_FIRM_ADMIN || user_role === USER_ROLE_ID.ROLE_PLANNER ? (
        <div style={{ display: "flex", gap: 8, paddingInline: 8, marginBottom: 16, justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <LineImport />
            {/* <LineItemCreate /> */}
            <LineItemCreate supplyDetails={supplyDetails} refresh={fetchLI} setSupplyOrder={setSupplyOrder} />
          </div>

          {/* <Button variant="contained" color="primary" size="small" onClick={handleDownload}>
            Download LI Excel
          </Button> */}
        </div>
      ) : null}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        // detailPanel={detailPanel}
        // actions={actions}
        actions={[
          ...(actions),
          (data) => ({
            icon: (el) => (
              <MoreActionButtons actions={actions1} rowData={data} />
            ),
          }),
        ]}
        options={{ filtering: true, search: false }}
      />
       {openSoWoMapper && <ProjectDetailsTable onClose={() => setOpenSoWoMapper(false)} selectedRow={selectedRow} />}
     
      {ItemAllotView && <LineItemLotsTable selectedLineItem={selectedLineItem} open={ItemAllotView} setOpen={setItemAllotView} />}     
      {viewDD && <LIDeliveryDateDialog open={viewDD} setOpen={setViewDD} selectedLineItem={selectedLineItem}
      //  soObj={soObj}
        />}
      {viewAmendment && <LIAmendmentsDialog open={viewAmendment} setOpen={setViewAmendment} selectedLineItem={selectedLineItem}
      // soObj={soObj} 
      />}
     
      <LineItemsForm
        soObj={supplyOrder}
        open={open}
        setOpen={setOpen}
        dataVal={dataVal}
        fetchRecords={saleOrderId ? fetchLiBySale : () => fetchLI(supplyOrderId)}
      />
      <LineItemDelete
        open={openDel}
        onClose={() => {
          setOpenDel(false);
          fetchLI(supplyOrderId);
        }}
        dataVal={dataVal}
        fetchRecords={saleOrderId ? fetchLiBySale : () => fetchLI(supplyOrderId)}
      />
       {openDetails && (
          <LineItemDetails
            onClose={() => setOpenDetails(false)} 
            selectedLineItem={selectedLineItem}
          />
        )}
    </>
  );
}
const MoreActionButtons = ({ rowData, actions }) => {
  // const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVert />
      </IconButton>
      <Popover
        disableScrollLock
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // classes={{ paper: classes.popoverRoot }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {actions.map((el) => (
          <MenuItem
            key={el.label}
            onClick={() => {
              el.onClick(rowData);
            }}
            style={{
              display: el?.hidden && el?.hidden(rowData) ? "none" : "block",
              textAlign: "left",
            }}
            disabled={el?.disabled ? el?.disabled(rowData) : false}
            divider
          >
            <Typography variant="body2">{el.label}</Typography>
          </MenuItem>
        ))}
      </Popover>
    </>
  );
};

