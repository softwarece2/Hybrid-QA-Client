import React, { useState } from "react";
import { Button, CircularProgress, Dialog, Typography } from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { useSelector } from "react-redux";

export default function OLLineItemDelete({ onClose, open, dataVal, fetchRecords }) {
  const [loading, setLoading] = useState(false);
  const empId = useSelector((state) => state?.loggedInUser?.empId);

  function onDelete() {
    if (dataVal) {
      const req = {
        id: dataVal.offerLetterId,
        employeeId: empId,
        saleOrderNo: dataVal.saleOrderNo,
        olLineItemDtos: [{ id: dataVal.id }],
      };
      setLoading(true);
      axiosInstance
        .post("offerLetter/deleteLineItem", req)
        .then(() => {
          toast.success("Deleted Successfully");
          fetchRecords();
          onClose();
        })
        .catch((e) => {
          console.log(e);
          toast.error("Can't delete as this line item is in use");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle onClose={onClose}>Delete (Line Item Number: {dataVal?.lineItemNo})</DialogTitle>
      <DialogContent>
        <Typography align="center" color="error">
          Do you really want to delete?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} size="small" variant="contained" color="primary" onClick={onDelete}>
          {loading && <CircularProgress size="24px" />}
          Delete
        </Button>
        <Button size="small" variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
