import {
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useForm } from "react-hook-form";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "components/Button";
import TableComponent from "components/table";
import { useDispatch, useSelector } from "react-redux";
import ViewOL from "pages/SOModule/SupplyOrderDetails/View/ViewOL";
import OLTable from "pages/Sslip/SSlipTable";
import ViewOfferLetters from "pages/SOModule/SupplyOrderDetails/View/ViewOfferLetters";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Delete } from "@material-ui/icons";
import { USER_ROLE_ID } from "Globals.js";
import ActionButton from "components/ActionButton";
import NewOLAllotTests from "pages/Testt/TestReport";
import { useStyles } from "pages/SummaryData/TCL-AVADI";
import { USER_ROLE } from "Redux/Types";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const defaultValues = {
  qty: "",
  registrations: null,
};
const schema = yup.object().shape({
  qty: yup
    .number()
    .typeError("Required")
    .required("Required")
    .min(1, "Should be more than 1"),
  registrations: yup
    .array()
    .nullable()
    .required("Required")
    .min(yup.ref("qty"), "select item should same as qty")
    .max(yup.ref("qty"), "select item should same as qty"),
});
export default function ViewSample({ rowData, records }) {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [open, setOpen] = useState(false)
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [lineItems, setLineItems] = useState([]);
  const [samples, setSamples] = useState([]);
  const [Viewsamples, setViewSamples] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [delete1, sesDelete1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [accept, setAccept] = useState([]);
  const roleIsAuthorized =  loggedInUser.roleId === 7 ||  loggedInUser.roleId === 16;
  const getAllLineItemsByOl = async () => {
    try {
      const { data } = await axiosInstance(
        "lineItemLots/register/getAllRegistrationNosByOlId/" +
        (rowData?.id)
      );
      setLineItems(data);
    } catch (error) { }
  };

function StatusChips({ status }) {
    const classes = useStyles();
    const statusColors = {
      accepted: "Success",
      rejected: "Error",
      rfr: "Warning",
      pending: "Orange",
      "in-process": "primary",
      Fail:"Error"
    };
    const statusClass = statusColors[status] || "Default";
  
    return <Chip size="small" className={`${classes.status} ${classes[statusClass]}`} label={status} />;
  }
  const getAcceptedReg = async () => {
    try {
      const { data } = await axiosInstance(
        "registration-numbers/getUnSampled/" +
        (rowData?.id)
      ); 
      setAccept(data);
    } catch (error) { }
  };
   const getAcceptedReg1 = async () => {
    try {
      const { data } = await axiosInstance(
        "lineItemLots/register/getAcceptedRegistrationNosByOlid" +
         (rowData?.offerLetterId || rowData?.id)
      ); 
      setAccept(data);
    } catch (error) { }
  };
console.log(records,"setSelectedRow")

  const getSavedSampled = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance(
        "registration-numbers/getSampled/" +
        (rowData?.id)
      );
      setSamples(data);
    } catch (error) {
      // toast.error("Failed to get details");
    } finally {
      setLoading(false);
    }
  };
const getSavedSampled1 = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance(
        "registration-numbers/getProductAndRegNoByOlId/" +
         (rowData?.offerLetterId || rowData?.id)
      );
      setSamples(data);
      setViewSamples(data)
    } catch (error) {
      // toast.error("Failed to get details");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (selectedRow) {
      setSaving(true);
      try {
        await axiosInstance.post(
          "lineItemLots/register/deleteSampleSelection?regId=" +
          selectedRow.id
        );
        toast.success("Deleted Successfully");
        setOpenDelete(false);
        getSavedSampled();
        getSavedSampled1()
        getAllLineItemsByOl();
      } catch (error) {
        toast.error("Failed to delete");
      } finally {
        setSaving(false);
      }
    }
  };
  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const req = {
        ids: data.registrations.map((el) => el.id),
        sampleQty: data.qty,
      };
      await axiosInstance.post("registration-numbers/UpdateSampledStatus", req);
      toast.success("Successfully added sample");
      reset();
      getSavedSampled();
      getSavedSampled1()
      getAllLineItemsByOl(); 
      setAccept(prevAccept => prevAccept.filter(item => !data.registrations.some(selectedItem => selectedItem.regId === item.regId)));

    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    getAllLineItemsByOl();
    getSavedSampled();
    getSavedSampled1()
    getAcceptedReg()
  }, []);
  const hasAccessToAdd =
    loggedInUser?.roleId === USER_ROLE_ID.ROLE_AE ||
    loggedInUser?.roleId === USER_ROLE_ID.ROLE_JE ||
    loggedInUser?.roleId === USER_ROLE_ID.ROLE_INSPECTOR||
    loggedInUser?.roleId === USER_ROLE_ID. ROLE_DAC||
    loggedInUser?.roleId === USER_ROLE_ID.ROLE_DC||
    loggedInUser?.roleId === USER_ROLE_ID. ROLE_AC;
   
console.log(rowData,"rowData")
console.log(records,"rescorfd")

  return (
    <Container>
      <Button
        type="Close"
        onClick={() => {
          if (
            loggedInUser.roleId === 2 ||
            loggedInUser.roleId === 3 ||
            loggedInUser.roleId === 4 ||
            loggedInUser.roleId === 5 ||
            loggedInUser.roleId === 6
          ) {
            dispatch(selectItem(<ViewOL />));
          } else if (loggedInUser.roleId === 9) {
            dispatch(selectItem(<OLTable />));
          }
          // else if ((loggedInUser.roleId === 2) === 3) {
          //   dispatch(selectItem(<ViewOfferLetters />));
          // } 
          else {
            dispatch(selectItem(<InspectOLTable />));
          }
        }}
        variant="contained"
        color="Secondary"
        startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
      // disabled={loading || !isDirty}
      >
        Back
      </Button>

      <Paper elevation={1} style={{ padding: "18px", marginTop: "18px" }}>

        <Typography
          style={{
            textDecoration: "underline",
            fontWeight: 600,
          }}
          variant="h5"
          align="center"
        >
          SAMPLE SELECTION
        </Typography>
        {roleIsAuthorized && (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            style={{ marginTop: "18px", marginBottom: "30px" }}
          >
            <Grid item xs={12} sm={5}>
              <Controller
                name="qty"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    placeholder="Enter Qty*"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12} sm={5}>
              <Controller
                name={"registrations"}
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    multiple
                    options={accept || []}
                    disableCloseOnSelect
                    onChange={(_, v) => onChange(v)}
                    value={value || []}
                    getOptionLabel={(option) => option.regNo}
                    getOptionSelected={(o, v) => o.regId === v.regId}
                    // groupBy={(o) => o.soLineItemNo}
                    renderOption={(option, { selected }) => {
                      if (option.label) {
                        // It's a group label
                        return (
                          <div
                            style={{
                              fontWeight: "bold",
                              margin: "5px 0",
                            }}
                          >
                            {option.label}
                          </div>
                        );
                      } else {
                        // It's an option within a group
                        return (
                          <>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 2 }}
                              checked={selected}
                              color="primary"
                       
                            />
                            {option.regNo}
                          </>
                        );
                      }
                    }}
                    renderTags={(v) => (
                      <span>Selected Reg nos: {v.length}</span>
                    )}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        {...params}
                        placeholder="Select Samples"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={12} sm={5}>
  <Controller
    name={"registrations"}
    control={control}
    render={({
      field: { onChange, value },
      fieldState: { error },
    }) => (
      <Autocomplete
        multiple
        options={accept || []}
        disableCloseOnSelect
        onChange={(_, v) => onChange(v)}
        value={value || []}
        getOptionLabel={(option) => option.serialNo}
        getOptionSelected={(o, v) => o.id === v.id}
        // groupBy={(o) => o.soLineItemNo}
        renderOption={(option, { selected }) => {
          if (option.label) {
            // It's a group label
            return (
              <div
                style={{
                  fontWeight: "bold",
                  margin: "5px 0",
                }}
              >
                {option.label}
              </div>
            );
          } else {
            // It's an option within a group
            return (
              <>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 2 }}
                  checked={selected}
                  color="primary"
                />
                {option.serialNo}
              </>
            );
          }
        }}
        renderTags={(v) => (
          <span>
            Selected Reg nos: {v.map(item => item.serialNo).join(', ')}
          </span>
        )}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            placeholder="Select Samples*"
            fullWidth
            size="small"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    )}
  />
</Grid>
<Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleSubmit(onSubmit)}
                disabled={saving}
              >
                {saving && <CircularProgress size={18} color="primary" />}
                Add Sample
              </Button>
            </Grid>
</Grid>
)}
{hasAccessToAdd && (
          <TableComponent
          title={""}
          data={samples}
          isLoading={loading}
         columns={[
    { field: "regNo", title: "Registration Number" },

    {
      field: "status",
      title: "Status",
     render: (rowData) => <StatusChips status={rowData.qaStatus}
     />,
  },
  ]}
          actions={

            hasAccessToAdd && [
              {
                icon: () => (
                  <ActionButton
                    size="small"
                    color="primary"
                    variant="contained"
                    obs={"tmr"}
                  // startIcon={<VisibilityIcon />}
                  >
                    Test
                  </ActionButton>
                ),
                tooltip: "View Tests",
                onClick: (_, rowData) => {
                  setOpen(true);
                  setSelectedRow(rowData)
                  
                },
              },
              {
                icon: () => (
                  <IconButton size="small">
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                ),
                onClick: (e, rowData) => {
                  setOpenDelete(true);
                  setSelectedRow(rowData);
                },
              },


            ]
          }
        />
          
        )}
</Paper>

      {open && (
        <NewOLAllotTests ol={{ ...selectedRow, id: selectedRow?.olLineItemId }} regNo={{ id: selectedRow?.id }} prdo = {{id:selectedRow?.productId}}open={open} setOpen={setOpen}rowData={rowData}samples={samples}/>
      )}
      <Dialog
        open={openDelete}
        maxWidth="lg"
        onClose={() => {
          setOpenDelete(false);
        }}
      >
        <DialogContent>
        <Typography>
      <b>Are you sure you want to delete</b>
      <br /> 
      {/* {samples.map((item, index) => (
        <Typography key={index}> 

          {item?.regNo}
        </Typography>
      ))} */}
    </Typography>
          <DialogActions>                                                                                                                                                                                                                                                                                                    
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={handleDelete}
            disabled={saving}
          >
            {saving && <CircularProgress size={18} color="primary" />}
            Delete
          </Button>
          <Button
            variant="contained"
            size="small"
            color="default"
            onClick={() => {
              setOpenDelete(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
        </DialogContent>
        
      </Dialog>
    </Container>
  );
}
