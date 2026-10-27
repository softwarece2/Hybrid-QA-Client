import React, { useState } from "react";
import { Button, CircularProgress, Dialog, Typography } from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, DialogTitle } from "Utils";

export default function LineItemDelete({ onClose, open, dataVal, fetchRecords }) {
  const [loading, setLoading] = useState(false);

  function onDelete() {
    console.log('dataval', dataVal)
    if (dataVal) {
      setLoading(true);
      axiosInstance.delete("soLineItem/delete/" + dataVal.id)
        .then(() => {
          toast.success("Line Item Deleted Successfully");
          fetchRecords();
          onClose();
        })
        .catch((e) => {
          console.log(e?.response?.data, 'error');
          toast.error(e?.response?.data || "Error deleting line item.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <Dialog open={open} maxWidth="xs">
      <DialogTitle onClose={onClose}>Delete (Line Item Number: {dataVal?.lineItemNo})</DialogTitle>
      <DialogContent>
          <Typography variant="h6">Are you sure you want to delete</Typography>
        </DialogContent>
      <DialogActions>
        <Button disabled={loading} size="small" variant="contained" color="primary" onClick={onDelete}>
          {loading && <CircularProgress size={24} />}
          Delete
        </Button>
        <Button size="small" variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
