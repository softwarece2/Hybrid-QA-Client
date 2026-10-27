/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../App.css";

//component
import TableComponent from "components/table/index";
import { WING_ID } from "../../../../Globals";
//material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,

  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import ActionButton from "components/ActionButton";
import Button from "components/Button";
import { Controller, useForm, useWatch } from "react-hook-form";

import { USER_ROLE_ID } from "../../../../Globals";

//icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import { getOLs } from "pages/Services/URLs";
import Edit from "pages/SOModule/OL/Edit";
import OLReview from "pages/SOModule/OL/OLReview";
import { toast } from "react-toastify";
import { saveAllotOlSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { PaperComponent } from "Utils/D3Tree";

import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { MoreActionButtons } from "pages/Sslip/SSlipTable";
import { useGetCommonActionMenus } from "hook/useGetCommonActionMenus";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { restrict } from "restrict";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogTitle as CustomDialogTitle } from "Utils/index";
import { DialogContent as CustomDialogContent } from "Utils/index";
import { DialogActions as CustomDialogActions } from "Utils/index";
// import Checkbox from "components/controls/Checkbox";

const useStyles = makeStyles((theme) => ({
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  completed: {
    "& + .MuiFormControlLabel-label": {
      color: "green",
    },
    "&.Mui-checked": {
      " &, & + .MuiFormControlLabel-label": {
        color: "green",
        //  backgroundColor: "#b2d2a4",
        // /opacity: 1,
      },
    },
  },
  inProgress: {
    "& + .MuiFormControlLabel-label": {
      color: "#19325E",
    },
    "&.Mui-checked": {
      color: "#19325E",
    },
  },
  pending: {
    " & + .MuiFormControlLabel-label": {
      color: "#E31717",
    },
    "&.Mui-checked": {
      color: "#E31717",
    },
  },
  leftRoot: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    minWidth: 80,
    fontSize: 12,
    padding: 5,
  },
  rightRoot: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    minWidth: 80,
    fontSize: 12,
    padding: 5,
  },
  acceptColor: {
    "&.Mui-selected": {
      color: "black",
      backgroundColor: "#B1E9AF",
    },

    "&:hover": {
      backgroundColor: "#B1E9AF !important",
      color: "black",
    },
  },
  rejectColor: {
    "&.Mui-selected": {
      backgroundColor: "#E9AFAF",
      color: "black",
    },
    "&:hover": {
      backgroundColor: "#E9AFAF !important",
      color: "black",
    },
  },
}));
const getColor = (value) => {
  if (value === "Pending") {
    return "#ff4040";
  } else if (value === "Cleared") {
    return "green";
  } else if (value === "Completed") {
    return "#5757d0";
  } else if (value === "Returned") {
    return "grey";
  } else if (value === "Approved") {
    return "#ca8cc9";
  } else if (value === "In Progress") {
    return "#d0882a";
  } else if (value === "Rejected") {
    return "rgb(30, 5, 5)";
  }
  return "yellow";
};

export default function ViewOfferLetters() {

  const dispatch = useDispatch();

  const {

    control,
    setValue,

  } = useForm({
    mode: "onChange",
  });



  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);

  const roleId = useSelector((state) => state?.loggedInUser?.roleId);
  const supplyOrderIdWatcher = useWatch({ control, name: "supplyOrderId" });
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [supplyOrderId, setSupplyOrderId] = useState("");
  const [obj, setObj] = useState({});
  const [saleOrderId, setSaleOrderId] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [openDial, setOpenDial] = useState(false);



  const [openINoteApproval, setOpenINoteApproval] = useState(false);
  const moreActions = useGetCommonActionMenus();
  const [columns] = useState([
    isArmy
      ? { title: "QACL Number", field: "olNumber", width: "auto" }
      : { title: "OL Number", field: "olNumber", width: "auto" },
    { title: "Offered Date", field: "offerDate", width: "auto" },
    { title: "Received Date", field: "receivedDate", width: "auto" },
    { title: "SO Number", field: "soNumber", width: "auto" },
    { title: "Work Order No.", field: "saleOrderNoStr", width: "auto" },
    {
      title: "Status",
      field: "fileNoteStatus",
      width: "auto",
      render: (rowData) =>
        rowData?.fileNoteStatus && (
          <Button
            variant="text"
            style={{
              background: getColor(rowData.fileNoteStatus),
              color: "white",
              textTransform: "unset",
              fontSize: "12px",
            }}
          >
            {rowData.fileNoteStatus}
          </Button>
        ),
    },
  ]);

  const [dialogCol] = useState([
    isArmy
      ? { title: "QACL Number", field: "olNumber", width: "auto" }
      : { title: "OL Number", field: "olNumber", width: "auto" },
    { title: "Offered Date", field: "offerDate", width: "auto" },
  ]);

  useEffect(() => {
    if (!supplyOrderIdWatcher) {
      setSaleOrderId(null);
      setValue("saleOrderId", null);
      dispatch({ type: "SALE_ORDER", payload: [] });
    }
  }, [supplyOrderIdWatcher]);

  useEffect(() => {
    // fetchOLCount();
    // setValue("pending", true);
    getOlData();
  }, []);



  const handleClose = () => {
    setOpen(false);
  };

  const getOlData = () => {
    setLoading(true);
    axiosInstanceTrans
      .get(getOLs + orgId)
      .then(({ data }) => {
        setValue("supplyOrderId", null);
        setValue("saleOrderId", null);
        setSupplyOrderId(null);
        setSaleOrderId(null);
        setRecords(data);

        console.log(data, "data");
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAllotJC = (obj) => {
    const data = {
      offerLetterId: obj?.id,
      offerLetterName: obj?.olNumber,
      allotedBy: loggedInUser?.empId,
      allotedTo: loggedInUser?.reportingOfficerId,
    };
    saveAllotOlSubordinate(data)
      .then((res) => {
        toast.success("Notified QAO");
        getOlData();
      })
      .catch((err) => toast.error(err));
  };
  const detailPanel = [
    {
      tooltip: "View",
      render: (rowData) => {
        return (
          <div
            style={{
              border: "1px solid #43A047",
              maxWidth: 1400,
              marginInline: "auto",
            }}
          >
            <Edit soObj={rowData} getOlData={getOlData} />
          </div>
        );
      },
    },
  ];

  const updatedAction = [
    ...moreActions,
    {
      label: "I-Note Approval",
      onClick: (rowData) => {
        setOpenINoteApproval(true);
        setObj(rowData);
      },
      tooltip: "I-Note Approval",
    },
  ];
  const actions = [
    (data) =>
      roleId === USER_ROLE_ID?.ROLE_OIC_ADMIN
        ? {
            icon: () => (
              <ActionButton
                variant="contained"
                color="secondary"
                startIcon={<NotificationsIcon />}
                onClick={() => handleAllotJC(data)}
                disabled={data?.isNotified}
              >
                {/* JE */}
                Inspector
              </ActionButton>
            ),
            tooltip: "Notify Inspector",
            // onClick: (event, rowData) => {
            //   setSoObj(rowData);
            // },
          }
        : null,
    (data) => ({
      icon: (el) => (
        <MoreActionButtons actions={updatedAction} rowData={data} />
      ),
    }),
  ];

  return (
    <>
      {openINoteApproval && (
        <INoteApproval
          obj={obj}
          onClose={() => {
            setOpenINoteApproval(false);
          }}
          refresh={getOlData}
        />
      )}
      {openDial && (
        <OLReview
          openDial={openDial}
          setOpenDial={setOpenDial}
          obj={obj}
          supplyOrderId={supplyOrderId}
          // fetchOL={fetchOL}
        />
      )}

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={actions}
            detailPanel={detailPanel}
            // options={{ filtering: false, sorting: false }}
          />

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="md"
            PaperComponent={(props) => (
              <PaperComponent id="draggable-dialog-title404" {...props} />
            )}
          >
            <DialogTitle
              style={{ cursor: "move" }}
              id="draggable-dialog-title404"
            >
              Scrutiny {isArmy ? "QACL" : "OL"} Details
            </DialogTitle>
            <DialogContent>
              <Grid item xs={12} align="center">
                <TableComponent
                  isLoading={loading}
                  data={records}
                  columns={dialogCol}
                  title=""
                />
              </Grid>
            </DialogContent>
            <DialogActions>
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
        </Grid>
      </Grid>
    </>
  );
}

const schema = yup.object().shape({
  inoteApproval: yup.string().required("Required").nullable(),
  inoteApprovalRemarks: yup.string(),
});
const INoteApproval = ({ onClose, refresh, obj }) => {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const classes = useStyles();
  const defaultValues = {
    inoteApproval: obj.inoteApproval ? 1 : 2,
    inoteApprovalRemarks:
      obj.fileNoteStatus !== "Pending" ? obj.inoteApprovalRemarks : "",
  };
  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const onFormSave = async (data) => {
    try {
      const req = {
        id: obj?.id,
        inoteApprovalRemarks: data.inoteApprovalRemarks,
        inoteApproval: data.inoteApproval == "1" ? true : false,
        approvedBy: loggedInUser?.empId,
      };
      const { data: responseData } = await axiosInstanceTrans.post(
        "inote/updateQaclForInote",
        req
      );
      refresh();
      onClose();
      toast.success("I Note approved successfully.");
    } catch (error) {
      toast.error("Failed to approved i note");
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <CustomDialogTitle>I Note Approval : {obj?.olNumber}</CustomDialogTitle>
      <CustomDialogContent>
        {obj.fileNoteStatus !== "Pending" ? (
          <>
            {" "}
            <Typography
              variant="body1"
              gutterBottom
              style={{ wordBreak: "break-all" }}
            >
              <b>SQAO Remarks :</b> {watch("inoteApprovalRemarks")}
            </Typography>
            <Typography variant="body1">
              <b>Status : </b>
              {watch("inoteApproval") == "2" ? (
                <span style={{ color: "red" }}>Rejected</span>
              ) : (
                <span style={{ color: "green" }}>Approved</span>
              )}
            </Typography>{" "}
          </>
        ) : (
          <form onSubmit={handleSubmit(onFormSave)}>
            <Typography>SQAO Remarks</Typography>
            <TextField
              {...register("inoteApprovalRemarks")}
              disabled={obj.fileNoteStatus !== "Pending"}
              labelText="Remarks"
              placeholder="Enter Remarks"
              multiline
              minRows={4}
              required
              maxRows={10}
              variant="outlined"
              fullWidth
              onInput={restrict.general}
              error={!!errors?.remarks}
              helperText={errors.remarks?.message}
            />
            <div style={{ margin: "18px 0px 0px 0px" }}>
              <Controller
                name="inoteApproval"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Typography>
                      Status <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl>
                      <ToggleButtonGroup
                        exclusive
                        onChange={(_, value) => {
                          onChange(value);
                        }}
                        size="small"
                        value={value}
                      >
                        <ToggleButton
                          classes={{
                            // selected: classes.toggleSelection,
                            root: classes.leftRoot,
                          }}
                          disabled={obj.fileNoteStatus !== "Pending"}
                          className={classes.acceptColor}
                          value={1}
                        >
                          Accept
                        </ToggleButton>
                        <ToggleButton
                          disabled={obj.fileNoteStatus !== "Pending"}
                          classes={{
                            root: classes.rightRoot,
                          }}
                          className={classes.rejectColor}
                          value={2}
                        >
                          Reject&nbsp;
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </FormControl>

                    <FormHelperText error={!!errors.inoteApproval}>
                      {errors.inoteApproval?.message}
                    </FormHelperText>
                  </>
                )}
              />
            </div>
          </form>
        )}
      </CustomDialogContent>
      <CustomDialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
        {obj.fileNoteStatus === "Pending" && (
          <Button
            onClick={handleSubmit(onFormSave)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        )}
      </CustomDialogActions>
    </Dialog>
  );
};
