/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../../App.css";
//component
import TableComponent from "components/table/index";

//material-ui
import Divider from "@material-ui/core/Divider";
import { useDispatch } from "react-redux";
import { getRegNoById } from "Redux/Actions/SupplyOrder/LIAction";
import { Button, Dialog, IconButton, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { getRegById } from "pages/Services/URLs";

export default function RegNoTable({ selectedLineItem }) {
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [dataVal, setDataVal] = useState(null);
console.log("dataval",dataVal);
console.log("records",records);
  const columns = [
    {
      title: "Registration / Running Numbers",
      field: "serialNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Status",
      field: "status",
      width: "auto",
      filtering: true,
      render: (rowData) => {
        let color = rowData.status === "Created" ? "orange" : "green";
        return <span style={{ color: color }}>{rowData.status}</span>;
      }
    },
  ];
  // if(dataVal?.status!=="Created"){
  //   setDisabled(true);
  // }
  const actions = [
    (rowData) => ({
    
      icon: () => (
        <IconButton variant="contained" size="small" color="secondary" disabled={rowData.status !== "Created"}>
          <Delete />
        </IconButton>
      ),
      
      onClick: () => {
        if (rowData.status === "Created") {
        setOpenDel(true);
        setDataVal(rowData);
        console.log("dataval",dataVal);
        }
      },
    
  })

  ];
  function getRegNos(){
    setLoading(true);
    axiosInstance.get(getRegById + selectedLineItem?.id + "/serialNos")
      .then(({data}) => {
        setRecords(data);
      })
      .catch((error) => {
        console.error("Error fetching line items:", error);
      }).finally(() => {
        setLoading(false);
      });
  }
  
  useEffect(() => {
    getRegNos()
  }, []);

  const handleCloseDialog = (row) => {
    setOpenDel(false);
    setDataVal(row);
  };

  const onDelete = () => {
    // setLoading(true);
    axiosInstance.post("/lineItemLots/register/delete/serialNo/" + dataVal?.id)
      .then(() => {
        toast.success("Registration No.: "+ dataVal?.serialNo + " Deleted Successfully");
        handleCloseDialog();
        getRegNos()
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error deleting Registration No.: "+ dataVal?.serialNo);
      })
      .finally(() => {
        setLoading(false);
      });

  }
  return (
    <>
        <div style={{maxWidth:800,marginInline:"auto", border:"1px solid lightgrey"}}>
          
      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        actions={actions}
        title=""
        options={{ filtering: false, search: true }}
      />
        </div>
      <Dialog open={openDel} maxWidth="xs">
        <DialogTitle onClose={() => setOpenDel(false)}>Delete (Reg No:{dataVal?.serialNo})</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Are you sure you want to delete</Typography>
        </DialogContent >
        <DialogActions>
          <Button size="small" variant="contained" color="primary" onClick={onDelete} >
            Delete
          </Button>
          <Button size="small" variant="contained" color="secondary" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>

  );
}
