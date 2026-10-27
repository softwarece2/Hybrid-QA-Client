import React, { useEffect, useState } from "react";
import TableComponent from "components/table/index";
import { Button, CircularProgress, Dialog, IconButton, Typography } from "@material-ui/core";
//
// import Active from "components/Active";
// import InActive from "components/InActive";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { DeleteOutline, EditOutlined } from "@material-ui/icons";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { toast } from "react-toastify";
import DepartmentToProductMappingForm from "./DepartmentToProductMappingForm";

const columns = [
  {
    title: "Department Name",
    field: "departmentName",
  },
  {
    title: "Product",
    field: "productName",
  },
  {
    title: "Material No./EP Code No.",
    field: "partNo",
    hidden:true
  },
  {
    title: "CAT Part No.",
    field: "catPartNo",
    hidden:true
  },
  {
    title: "NSN Part No.",
    field: "nsnPartNo",
    hidden:true
  },
  {
    title: "Material Description",
    field: "materialDescription",
    hidden:true
  },

];

export default function DepartmentToProductMapping() {
  const [records, setRecords] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
const[edit,setEdit]=useState(false)
  async function getAllMapped() {
    setLoading(true);
    try {
      const { data } = await axiosInstanceAte("deptProdMap/getAllWithEpCode");
      setRecords(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllMapped();
  }, []);

  async function handleDelete() {
    setLoadingDelete(true);
    try {
      await axiosInstanceAte.delete("/deptProdMap/deleteById/" + openDelete?.id);
      toast.success("Deleted Successfully");
      setOpenDelete(null);
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
      <DepartmentToProductMappingForm refresh={getAllMapped} selectedRow={selectedRow} setSelectedRow={setSelectedRow} edit={edit} setEdit={setEdit}/>

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        actions={[
          {
            icon: () => (
              <IconButton variant="outlined" size="small" color="primary">
                <EditOutlined />
              </IconButton>
            ),
            onClick: (_, rowData) => {
              setSelectedRow(rowData);
              setEdit(true)
            },
          },
          {
            icon: () => (
              <IconButton variant="outlined" size="small" color="secondary">
                <DeleteOutline />
              </IconButton>
            ),
            onClick: (_, rowData) => {
              setSelectedRow(rowData);
              setOpenDelete(rowData);
            },
          },
        ]}
      />

      {!!openDelete && (
        <Dialog open={true}>
          <DialogTitle onClose={() => setOpenDelete(null)}>Delete</DialogTitle>
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
              {loadingDelete && <CircularProgress size="24px" />}
              Yes
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => setOpenDelete(null)}
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
