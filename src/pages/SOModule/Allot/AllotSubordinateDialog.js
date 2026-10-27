/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import "../../../App.css";
//globals

//material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@material-ui/core";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AutoCompleteNew from "components/AutoCompleteNew";
import Button from "components/Button";
import { DialogTitle } from "Utils";
import axiosInstance from "pages/Services/AxiosInstance";
import { getAllActiveEmpsbyOrgId } from "pages/Services/URLs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import moment from "moment";

//icons
import { yupResolver } from "@hookform/resolvers/yup";
import { saveAllotSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { PaperComponent } from "Utils/D3Tree";

const schema = yup.object().shape({
  allotedTo: yup.string().typeError("Required").required("Required"),
});
const defaultValues = {
  id: 0,
  supplyOrderId: "",
  supplyOrderName: "",
  allotedBy: "",
  allotedTo: null,
};

export default function AllotSubordinateDialog({
  open,
  setOpen,
  so,
  fetchAllotSO,
  isReAllot,
}) {
  const dispatch = useDispatch();

  //const inspectorData = useSelector((store) => store.soReducer.inspectorDetails);
  const loggedInUser = useSelector((store) => store.loggedInUser);

  //const orgId = useSelector((store) => store.loggedInUser?.orgId);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange",
  });
  const [empVal, setEmpVal] = useState(null);
  const [list, setList] = useState([]);
  const [officerRole, setOfficerRole] = useState({});

  //IVNV Observation Added reset to handle yup validation in AllotOl Modified by:Shruti Sanjay Date:09-07-2026
  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setEmpVal(null);
    } else {
      reset(defaultValues);
      setEmpVal(null);
    }
  }, [open, reset]);


  const getAllSubByRole = (orgId) => {
    axiosInstance
      .get(getAllActiveEmpsbyOrgId + `${loggedInUser?.empId}/${orgId}`)
      .then((res) => {
        if (res?.data === "" || res?.data === null) {
          console.log("List Not Found");
        } else {
          setList(res?.data);
        }

        console.log(list, "efhrugh");
      })
      .catch((err) => console.log("error in getSubDcqaoBySubRole" + err));
  };

  //   const getSubordinatesByEmpId = () => {
  //   axiosInstance
  //     .get(getSubordinatesByEmpUrl + loggedInUser?.empId)
  //     .then((res) => setSubordinateLists(res?.data || []))
  //     .catch((err) => console.log("error in getSubordinatesByEmpId" + err));
  // };

  useEffect(() => {
    getAllSubByRole(loggedInUser?.orgId);
  }, []);

  console.log("so", so);

  const handleClose = () => {
    reset(defaultValues); 
    setEmpVal(null);
    setOpen(false);
  };

  const handleAllot = (data) => {
    const value = {
      id: 0,
      supplyOrderId: so?.supplyOrderId,
      supplyOrderName: so?.supplyOrderName,
      allotedBy: loggedInUser?.empId,
      allotedTo: empVal,
    };
    dispatch(saveAllotSubordinate(value, officerRole))
      .then((res) => {
        if (res.status === 201) {
          setOpen(false);
          fetchAllotSO();
          // setEmpVal(null);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  const role = "Officer";
  // roleId === USER_ROLE_ID?.ROLE_INSPECTOR
  //   ? "Inspector"
  //   : roleId === USER_ROLE_ID?.ROLE_AQAO
  //   ? "ACQAO"
  //   : USER_ROLE_ID?.ROLE_CQAI_DC

  //   ? "DCQAO"
  //   : "";

  const labelText = "Select Officer*";

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title26" {...props} />
        )}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title26">
        {isReAllot ? `Re-Allot ${role}` : `Allot ${role}`}
        </DialogTitle>
        <DialogContent dividers style={{ position: "relative" }}>
          <Grid container spacing={0}>
            <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
              <Typography>
                <b>SO Number&nbsp;:&nbsp;</b>
                {so?.supplyOrderName}
              </Typography>
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
              <Typography>
                <b>Date&nbsp;:&nbsp;</b>
                {so?.supplyOrderDate}
                {/* {moment(so?.supplyOrderDate).format("DD-MM-yyyy")} */}
              </Typography>
            </Grid>
            <br />
            <Grid item xs={12} sm={8}>
              <Typography>{labelText}</Typography>
              <Controller
                name="allotedTo"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <AutoCompleteNew
                    // labelText={labelText}
                    data={list}
                    getOptionLabel={(option) => option.ename}
                    // getOptionLabel={(o => o.ename?o?.ename}
                    onChange={(e, el) => {
                      onChange(el?.id);
                      setEmpVal(el?.id);
                      setOfficerRole(el?.roleName);
                    }}
                    value={list?.find((item) => item?.id === empVal)}
                    error={!!errors.allotedTo}
                    helperText={errors.allotedTo?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<SupervisorAccountIcon />}
            onClick={handleSubmit(handleAllot)}
          >
             {isReAllot ? "Re-Allot" : "Allot"}
          </Button>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
