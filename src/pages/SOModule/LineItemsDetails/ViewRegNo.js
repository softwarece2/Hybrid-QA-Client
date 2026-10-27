import { Button, CircularProgress, Dialog, IconButton, Typography } from "@material-ui/core";
import { DeleteOutline, EditOutlined } from "@material-ui/icons";
import TableComponent from "components/table";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import React, { useEffect, useState } from "react";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { toast } from "react-toastify";
import CustomizedInputs from "components/TextField";
import { useDispatch, useSelector } from "react-redux";
import { REG_NO_GET_DATA, REG_NO_LOADING_TRUE, REG_NO_LOADING_FALSE } from "Redux/Types";

export default function ViewRegNo({  disableActions, isRegNo, selectedYear }) {
  const registrationNumber = useSelector((store) => store.registrationNumber);
  const dispatch = useDispatch();
  const [openRegNoEdit, setOpenRegNoEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [regValue, onRegChange] = useState("");

  async function getRegNo(id) {
    if (id) {
       dispatch({ type: REG_NO_LOADING_TRUE, payload:{id}});
      try {
        const { data } = await axiosInstance.get("lineItemLots/register/lineItemLot/" + id);
        dispatch({ type: REG_NO_GET_DATA, payload: { data, id } });
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data || "failed to add please try again");
      } finally {
       dispatch({ type: REG_NO_LOADING_FALSE,  payload:{id} });
      }
    }
  }

  useEffect(() => {
    getRegNo(selectedYear.id);
  }, []);

  const actions = [
    {
      icon: () => (
        <IconButton size="small">
          <EditOutlined color="primary" />
        </IconButton>
      ),
      onClick: (event, rowData) => {
        setSelectedRow(rowData);
        setOpenRegNoEdit(true);
        onRegChange(rowData.registerNo);
      },
      hidden: disableActions,
    },
    {
      icon: () => (
        <IconButton size="small">
          <DeleteOutline color="error" />
        </IconButton>
      ),
      onClick: (event, rowData) => {
        setSelectedRow(rowData);
        setOpenDelete(true);
      },
      hidden: disableActions,
    },
  ];

  async function handleDelete() {
    setLoading(true);
    try {
      await axiosInstance.delete("/lineItemLots/register/delete/" + selectedRow.id);
      toast.success("Deleted Successfully");
      setOpenDelete(false);
      getRegNo(selectedYear.id);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit() {
    setLoadingEdit(true);
    try {
      await axiosInstance.post("/lineItemLots/register/update/" + selectedRow.id, { registerNo: regValue });
      toast.success("Updated successfully");
      setOpenRegNoEdit(false);
      getRegNo(selectedYear.id);
    } catch (err) {
      console.log(err);
      toast.error("Registration No. Already Exists");
    } finally {
      setLoadingEdit(false);
    }
  }
  const columns = [
    {
      title: isRegNo ? "Registration Number" : "Running Number",
      field: "registerNo",
    },
    {
      title: "Status",
      field: "status",
    },
  ];

  return (
    <>
      <TableComponent
        data={registrationNumber?.[selectedYear.id]?.data || []}
        actions={actions}
        columns={columns}
        isLoading={registrationNumber?.[selectedYear.id]?.loading}
        options={{ filtering: false }}
        title=""
      />

      <Dialog open={openDelete}>
        <DialogTitle onClose={() => setOpenDelete(false)}>Delete</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Are you sure. You want to delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            type="submit"
            size="small"
            variant="contained"
            color="primary"
            onClick={handleDelete}
            style={{ textTransform: "capitalize" }}
          >
            {loading && <CircularProgress size="24px" />}
            Yes
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => setOpenDelete(false)}
            style={{ textTransform: "capitalize" }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      {openRegNoEdit && (
        <Dialog open={true}>
          <DialogTitle onClose={() => setOpenRegNoEdit(false)}>Edit</DialogTitle>
          <DialogContent>
            <CustomizedInputs
              placeholder="Enter Registration No."
              labelText="Registration No."
              onChange={(e) => onRegChange(e.target.value)}
              value={regValue}
              size="small"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={loadingEdit}
              type="submit"
              size="small"
              variant="contained"
              color="primary"
              onClick={handleEdit}
              style={{ textTransform: "capitalize" }}
            >
              {loadingEdit && <CircularProgress size="24px" />}
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
