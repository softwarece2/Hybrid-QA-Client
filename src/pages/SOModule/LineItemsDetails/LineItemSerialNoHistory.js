import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { DialogTitle } from "Utils";
import TableComponent from 'components/table';
import { toast } from 'react-toastify';

import axiosInstance from 'pages/Services/AxiosInstanceTransaction';
export default function LineItemSerialNoHistory({ onClose, reg }) {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  console.log("row:", reg);
  

  const columns = [
    { title: "Remark", field: "remark", width: "auto" },
    { title: "Time & Date", field: "createdAt", width: "auto" },
    { title: "Status", field: "status", width: "auto" },
  ];

  const fetchData = async(regNoId) => {
    try {
      setLoading(true);
      const {data } = await axiosInstance.get(`/lineItemLots/register/${regNoId}/history`);
      setData(data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data || "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(reg?.id);
  }, [])

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              <b>History of Serial No: {reg?.serialNo}</b>
            </DialogTitle>
            <DialogContent>
                <TableComponent
                  isLoading={loading}
                  data={data}
                  columns={columns}
                  title=""
                  options={{
                    search : false,
                    paging: false,
                  }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
