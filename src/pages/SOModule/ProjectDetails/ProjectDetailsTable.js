/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import TableComponent from "components/table/index";
import { CircularProgress, Dialog, DialogActions, DialogContent, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
//colors
import IconButton from "@material-ui/core/IconButton";
import Button from "components/Button";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { deleteSaleOrder, getPDById, getwarrantBysoliId } from "pages/Services/URLs";
import { toast } from "react-toastify";
import { DialogTitle } from "Utils";
import PDCreate from "./PDCreate";
import moment from "moment";
import ActionButton from "components/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import AllotSo from "../SupplyOrderDetails/SbuSO/AllotSo";
import NotifyWarrants from "../SupplyOrderDetails/NotifyWarrants/NotifyWarrants";
import { USER_ROLE } from "Redux/Types";
import { USER_DEPARTMENT, USER_ROLE_ID } from "../../../Globals";
import { useSelector } from "react-redux";
import { getAllSupplyOrdersBySalesGrpOptimized } from "Redux/Actions/SupplyOrder/SOAction";

const columns = [
  { title: "Warrant No.", field: "categoryName", width: "auto" },
  { title: "Warrant Qty", field: "qty", width: "auto" },
  {
    title: "Wt Issue Date",
    field: "wtIssueDate",
    width: "auto",
    render: (row) => (
      <Typography variant="subtitle2">{row.wtIssueDate ? moment(row.wtIssueDate).format("DD-MM-YYYY") : "-"}</Typography>
    ),
  },
  { title: "Operation No.", field: "opNo", width: "auto", sorting: true },
  { title: "R.F/EST.No.", field: "shipName", width: "auto", sorting: true },
  {
    title: "R.F/EST Date",
    field: "estDate",
    width: "auto",
    render: (row) => <Typography variant="subtitle2">{row.estDate ? moment(row.estDate).format("DD-MM-YYYY") : "-"}</Typography>,
  },
  
  { title: "Rev Nos.", field: "revNo", width: "auto" },

];

export default function ProjectDetailsTable({ onClose, selectedRow }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [soObj, setSoObj] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAllot, setOpenAllot] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(null);

  const fetchPD = (id) => {
    // setLoading(true);
    if (id) {
      axiosInstance
        .get(getwarrantBysoliId + id)
        .then(({ data }) => {
          setRecords(data);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const isPlanner = USER_ROLE === USER_ROLE_ID.ROLE_PLANNER;
  const departmentId = useSelector((state) => state?.loggedInUser?.departmentId);
  const empId = useSelector((state) => state?.loggedInUser?.empId);
  const salesGrpId = useSelector((store) => store?.loggedInUser?.salesGrpId);
  const fetchSO = () => {
    // setLoading(true);
    // if (isPlanner && departmentId === USER_DEPARTMENT.PLANNING) {
    getAllSupplyOrdersBySalesGrpOptimized(empId)
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
    // } 
  };

  const handleDelete = (id) => {
    setLoadingDelete(true);
    axiosInstance
      .get(deleteSaleOrder + id)
      .then(() => {
        fetchPD(selectedRow.id);
        setOpenDeleteDialog(false);
        toast.success("SO-WO Mapper Deleted Successfully ");
      })
      .catch((error) => {
        toast.error("Not able to delete the Sale Order Which is present in the Offer Letter");
        console.log("error", error);
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };

  useEffect(() => {
    fetchPD(selectedRow.id);
  }, []);
  // const dynamicTitle = `Add Warrant No. (LI No. : ${selectedRow?.lineItemNo},   Work Order: ${selectedRow?.saleOrderNo || 'N/A'} ,   EP Code: ${selectedRow?.partNo || 'N/A'})`;
 
  const dynamicTitle = edit 
  ? `Edit Warrant No.(LI No. : ${selectedRow?.lineItemNo}, Work Order: ${selectedRow?.saleOrderNo || 'N/A'}, EP Code: ${selectedRow?.partNo || 'N/A'})`
  : `Add Warrant No. (LI No. : ${selectedRow?.lineItemNo}, Work Order: ${selectedRow?.saleOrderNo || 'N/A'}, EP Code: ${selectedRow?.partNo || 'N/A'})`;

 
  return (
    <>
      {openAllot && (
        <NotifyWarrants
          onClose={() => {
            setOpenAllot(false);
            setSoObj({});
          }}
          soObj={soObj}
          data={records}
          refresh={fetchPD}
        />
      )}
      <Dialog open={true} maxWidth="xl">
        <DialogTitle onClose={onClose}>{dynamicTitle}</DialogTitle>
        <DialogContent dividers>
          <PDCreate selectedRow={selectedRow} fetchPD={fetchPD} edit={edit} updateData={data} setEdit={setEdit}/>
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={[
              // (records) => ({
              //   icon: () => (
              //     <ActionButton variant="contained" color="secondary" >
              //       <FontAwesomeIcon icon={faBell} />
              //     </ActionButton>
              //   ),
              //   // hidden: user_role === USER_ROLE_ID.ROLE_QA,
              //   tooltip: "Notify Assembly",
              //   onClick: (event, records) => {

              //     setSoObj(records);
              //     setOpenAllot(true);

              //   },
              //   // hidden: isGicFromAssembly,
              // }),
              {
                icon: () => (
                  <IconButton
                    size="small"
                    color="primary"
                    text="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                ),
                tooltip: "Edit",
                onClick: (_, rowData) => {
                  console.log(rowData, 'gegeg');
                  setData(rowData);
                  setEdit(true);
                },
              },

            ]}

            // actions={[
            //   {
            //     icon: () => (
            //       <IconButton size="medium">
            //         <DeleteIcon color="error" />
            //       </IconButton>
            //     ),
            //     // hidden: user_role === USER_ROLE_ID,
            //     onClick: (_, rowData) => {
            //       setSoObj(rowData);
            //       setOpenDeleteDialog(true);
            //     },
            //   },
            // ]}
            options={{ filtering: false, search: false }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} maxWidth="xs">
        <DialogContent>
          <Typography variant="h6">Are you sure you want to delete Work Order No "{soObj?.saleOrderNo}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDelete(soObj?.saleOrderId)}
            color="primary"
            variant="contained"
            size="small"
            disabled={loadingDelete}
          >
            {loadingDelete && <CircularProgress size={24} color="primary" />}
            Yes
          </Button>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary" variant="contained" size="small">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
