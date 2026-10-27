import React, { useState } from "react";
import { Button, CircularProgress, Dialog, Typography } from "@material-ui/core";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";

export default function RegNoUnmap({ onClose, open, dataVal, warrantId, fetchRecords, warrantName }) {
  const [loading, setLoading] = useState(false);
  const serialNoId = dataVal?.id;

  const handleDelete = () => {
    setLoading(true);
    axiosInstance
      .post(`/warrant/unmap/serialNo`, {
        lineItemSerialNoId: serialNoId,
        categoryId: warrantId,
      })
      .then(() => {
        toast.success("Successfully Unmapped");
        onClose();
        fetchRecords();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to unmap, please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //     Payload:
  // {
  //   lineItemSerialNoId : 1
  //   catergoryId: 1234 (warrantId)
  // }

  return (
    <Dialog open={open} maxWidth="xs">
      <DialogTitle onClose={onClose}>Unmap Reg No. from Warrant No </DialogTitle>
      <DialogContent>
        <Typography variant="h6">
          Are you sure you want to Unmap <b>Reg No: {dataVal?.serialNo}</b> from <b>Warrant No : {warrantName}</b>?{" "}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} size="small" variant="contained" color="primary" onClick={handleDelete}>
          {loading && <CircularProgress size={24} />}
          Unmap
        </Button>
        <Button size="small" variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
