import React, { useState } from "react";
import { Button, CircularProgress, Dialog, Typography } from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, DialogTitle } from "Utils";

export default function OLDelete({ onClose, open, dataVal, fetchRecords }) {
  const [loading, setLoading] = useState(false);

  console.log("data", dataVal);

  function onDelete() {
    if(dataVal){
      axiosInstance("offerLetter/deleteOl/" + dataVal.id)
        .then(() => {
          toast.success("Deleted Successfully");
          fetchRecords();
          onClose();
        })
        .catch((e) => {
          console.log(e);
          toast.error("Failed to delete");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <Dialog open={open} maxWidth="xs" >
      <DialogTitle onClose={onClose}>Delete : {dataVal.olNumber}</DialogTitle>
      <DialogContent>
        <Typography align="center" color="error" style={{ fontSize: '1.1rem' }}>
          Do you really want to delete?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} size="small" variant="contained" color="primary" onClick={onDelete}>
          {loading && <CircularProgress size="24px" />}
          Yes
        </Button>
        <Button size="small" variant="contained" color="secondary" onClick={onClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
