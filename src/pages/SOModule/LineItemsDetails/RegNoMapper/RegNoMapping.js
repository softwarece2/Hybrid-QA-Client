import { Button, CircularProgress, Dialog, IconButton, Typography } from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
import TableComponent from "components/table";
import axiosInstance from "pages/Services/AxiosInstance";
import { useEffect, useState } from "react";
import AddRegNoMapping from "./AddRegNoMapping";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { toast } from "react-toastify";

const columns = [
  {
    title: "Running Number",
    field: "registerNo",
  },
  {
    title: "Status",
    field: "status",
  },
];
export default function RegNoMapping() {
  const [loading, setLoading] = useState(false);
  const [mappedRegNos, setMappedRegNos] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [loadingDelete, setLoadingDelete] = useState(false);

  function getAllMapped() {
    setLoading(true);
    axiosInstance("getAllMapped")
      .then(({ data }) => {
        setMappedRegNos(data);
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getAllMapped();
  }, []);

  const actions = [
    // {
    //   icon: () => (
    //     <IconButton size="small">
    //       <EditOutlined color="primary" />
    //     </IconButton>
    //   ),
    //   onClick: (event, rowData) => {
    //     setSelectedRow(rowData);
    //     setOpenRegNoEdit(true);
    //     onRegChange(rowData.registerNo);
    //   },
    //   hidden: disableActions,
    // },
    {
      icon: () => (
        <IconButton size="small">
          <DeleteOutline color="error" />
        </IconButton>
      ),
      onClick: (_, rowData) => {
        setSelectedRow(rowData);
        setOpenDelete(true);
      },
    },
  ];

  async function handleDelete() {
    setLoadingDelete(true);
    try {
      await axiosInstance.delete("/deptProdMap/deleteById/" + selectedRow?.id);
      toast.success("Deleted Successfully");
      setOpenDelete(false);
      getAllMapped();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete");
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <>
      {openAdd && (
        <AddRegNoMapping
          onClose={() => {
            setOpenAdd(false);
            setSelectedRow(null);
          }}
          refresh={getAllMapped}
        />
      )}

      <TableComponent
        title={
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenAdd(true);
            }}
            style={{ textTransform: "capitalize" }}
          >
            Map Registration to Warrant
          </Button>
        }
        data={mappedRegNos}
        actions={actions}
        columns={columns}
        isLoading={loading}
        options={{ filtering: false }}
      />

      {openDelete && (
        <Dialog open fullWidth maxWidth="xl">
          <DialogTitle onClose={() => setOpenDelete(false)}>Delete</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">Are you sure. You want to delete?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={loadingDelete}
              type="submit"
              size="small"
              variant="contained"
              color="primary"
              onClick={handleDelete}
              style={{ textTransform: "capitalize" }}
            >
              {loadingDelete && <CircularProgress size={16} />}
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
      )}
    </>
  );
}
