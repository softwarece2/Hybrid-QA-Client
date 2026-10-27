import {  Delete, Edit } from "@material-ui/icons";
import TableComponent from "components/table";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { lineItemlotsDelete, lineItemlotsFindBySoLiId } from "pages/Services/URLs";
import { useEffect, useState } from "react";
import AddUpdateLot from "./add-update-lot";
import { Button, CircularProgress, Dialog, IconButton, Typography } from "@material-ui/core";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { toast } from "react-toastify";
import ViewRegNo from "./ViewRegNo";


const columns = [
  {
    title: "Financial Year",
    field: "financialYear",
  },
  {
    title: "Quantity Offered",
    field: "offeredQty",
  },
  {
    title: "Unit Price",
    field: "unitPrice",
  },
];
// const data = [{ financialYear: 2025, offeredQty: 10, unitPrice: 10 }];
export default function LineItemLots({ selectedLineItem, disableActions }) {
  
  const [lineItemLots, setLineItemLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAllotQty, setOpenAllotQty] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const getLineItemsLotById = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance(lineItemlotsFindBySoLiId + selectedLineItem.id);
      setLineItemLots(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await axiosInstance.delete(lineItemlotsDelete + `${selectedLineItem.id}/${selectedRow.id}`);
      toast.success("Year-wise Deleted Successfully");
      setOpenDelete(false);
      getLineItemsLotById();
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    getLineItemsLotById();
  }, []);

  const actions = [
    // {
    //   icon: () => (
    //     <Button style={{ minWidth: 120, textTransform: "capitalize" }} size="small" color="primary" variant="contained" startIcon={<Add />}>
    //       {selectedLineItem.isRegistrationNo === null ? "Add Reg No." : selectedLineItem.isRegistrationNo ? "Add Reg No." : "Running No."}
    //     </Button>
    //   ),
    //   hidden:loggedInUser?.departmentTypeId === DEPARTMENT_ID.ASSEMBLY,
    //   onClick: (_, rowData) => {
    //     dispatch({ type: REG_NO_TOGGLE_OPEN, payload: { selectedYear: rowData } });
    //   },
    // },
    {
      icon: () => (
        <IconButton size="small">
          <Edit color="primary" />
        </IconButton>
      ),
      onClick: (event, rowData) => {
        setSelectedRow(rowData);
        setOpenAllotQty(true);
      },
      hidden: disableActions,
    },
    {
      icon: () => (
        <IconButton size="small">
          <Delete color="error" />
        </IconButton>
      ),
      onClick: (event, rowData) => {
        setSelectedRow(rowData);
        setOpenDelete(true);
      },
      hidden: disableActions,
    },
  ];

  return (
    <>
      {openAllotQty && (
        <AddUpdateLot
          fetchRecords={getLineItemsLotById}
          onClose={() => setOpenAllotQty(false)}
          selectedLineItem={selectedLineItem}
          isEditMode
          formData={selectedRow}
        />
      )}

      {/* <AddRegNo onClose={() => dispatch({ type: REG_NO_TOGGLE_CLOSE })}  /> */}

      <TableComponent
        data={lineItemLots?.lineItems || []}
        columns={columns}
        isLoading={loading}
        title={""}
        actions={actions}
        // detailPanel={[
        //   {
        //     tooltip: "Show Reg Nos",
        //     render: (rowData) => {
              
        //       return (
        //         <div
        //           style={{
        //             border: "1px solid lightgrey",
        //             maxWidth: 800,
        //             marginInline: "auto",
        //           }}
        //         >
        //           <ViewRegNo
        //             selectedYear={rowData}
        //             disableActions={disableActions}
        //             isRegNo={selectedLineItem.isRegistrationNo === null}
        //           />
        //         </div>
        //       );
        //     },
        //   },
        // ]}
        options={{filtering:false, search:false}}
      />

      <Dialog open={openDelete} maxWidth="sm">
        <DialogTitle
          onClose={() => {
            setOpenDelete(false);
          }}
        >
          Delete
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6">Are you sure you want to delete record for Financial Year: <b>{selectedRow.financialYear}</b></Typography>
        </DialogContent>
        <DialogActions>
          <Button disabled={loadingDelete} type="submit" size="small" variant="contained" color="primary" onClick={handleDelete}>
            {loadingDelete && <CircularProgress size="24px" />}
            Yes
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => {
              setOpenDelete(false);
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
