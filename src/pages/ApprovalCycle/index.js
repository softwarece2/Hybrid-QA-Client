import React, { useEffect, useState } from "react";
import MuiTextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { restrict } from "restrict";
import {  useSelector } from "react-redux";
import {
  Chip,
  Dialog,
  DialogActions,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { DialogContent, DialogTitle, StyledTableCell } from "Utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import moment from "moment";
import axiosInstance from "pages/Services/AxiosInstance";
import Button from "components/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import AutoCompleteNew from "components/AutoCompleteNew";
import { getAllEmpsOfOrgn } from "pages/Services/URLs";
import POObsTableArmyMr from "./POObsTableArmyMr";
import {  CloudDownload } from "@material-ui/icons";
import { handleDownload } from "./ApprovalCycleje";

const useStyles = makeStyles((theme) => ({
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
  table: {
    minWidth: "100%",
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
  heading: {
    fontSize: "0.875rem",
    textDecoration: "underline",
    fontWeight: 500,
  },
  subHeading: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },

  value: {
    fontSize: "0.875rem",
  },
}));

const urlGetSupplyOrder = "supplyOrder/getAllotedSupplyOrders/";
const urlUpdateSoApproval = "soApproval/updateSoApproval";
const urlGetAll = "soApproval/";
const headers = ["Sl.No", "Date", "Designation", "Name", "Next Approver", "Status"];

function Status({ text }) {
  return (
    <div
      style={{
        color: !text ? "black" : text === "Approved" ? "#1b5e20" : "#cb0000",
        backgroundColor: !text ? "grey" : text === "Approved" ? "#c8e6c9" : "#ff7d654d",
        padding: "2px 8px",
        borderRadius: 4,
        width: 120,
        textAlign: "center",
      }}
    >
      {text || "NA"}
    </div>
  );
}

function THeader({ label }) {
  const classes = useStyles();

  return (
    <StyledTableCell className={classes.tableCell}>
      <Typography className={classes.subHeading}>{label}</Typography>
    </StyledTableCell>
  );
}

function Row({ row, index }) {
  const classes = useStyles();

  return (
    <>
      <TableRow>
        <StyledTableCell className={classes.tableCell} rowSpan={2}>
          {index}.
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>{moment(row.createdDate).format("DD-MM-yyyy HH:mm")}</Typography>
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>{row.designation}</Typography>
        </StyledTableCell>

        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>{row.createdByStr}</Typography>
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>{row.nextApproverName}</Typography>
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>
            <Status text={row.soStatusStr} />
          </Typography>
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell className={classes.tableCell}>
          <Typography color="primary" className={classes.value}>
            <b>REMARKS:</b>
          </Typography>
          {row.remarks}
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell} colSpan={3}>
          {row?.uploadedFiles?.length > 0 &&
            <>
              <Typography color="primary" className={classes.value}>
                <b>Attachments:</b>
              </Typography>
              {row?.uploadedFiles?.map((file) => {
                const fileName = file.split("files/")
                return (
                  <Chip label={fileName[1] ?? 'olms-uploads'} key={file} onDelete={() => { handleDownload(fileName[1], file) }} deleteIcon={<CloudDownload />} style={{ marginInline: '4px' }} />
                )
              })}
            </>
          }
        </StyledTableCell>
      </TableRow>
    </>
  );
}

function Body({ records }) {
  return (
    <TableBody>
      {/* map row over data */}
      {records.map((row, i) => (
        <Row row={row} key={row.id} index={i + 1} />
      ))}
    </TableBody>
  );
}


function RemarksForm({ selectedSupplyOrder, getAllTableData, onClose }) {
  const user = useSelector((store) => store.loggedInUser);
  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);
  const [searchFlag, setSearchFlag] = React.useState();
  const empId = useSelector((state) => state?.loggedInUser?.empId);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const [val, setVal] = useState(null);
  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(false);
  const [soStatus, setSoStatus] = useState(1);
  const [isAcceptSelected, setIsAcceptSelected] = useState(false);
  const [selectedFileToUpload, setSelectedFileToUpload] = useState([])
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const onFormSave = (data) => {
    if (data.remarks.trim()) {
      setSubmitting(true);
      const req = {
        supplyOrderId: selectedSupplyOrder.id,
        createdBy: user?.empId,
        remarks: data.remarks,
        nextApproverId: val,
        soStatus: soStatus,
      };
      const formData = new FormData()
      formData.append("soApprovalDetailsStr", JSON.stringify(req));
      for (let i = 0; i < selectedFileToUpload.length; i++) {
        formData.append("attachments", selectedFileToUpload[i]);
      }

      axiosInstanceTrans
        .post(urlUpdateSoApproval, formData)
        .then(({ data }) => {
          if (data === true) {
            toast.success("Submitted successfully");
            getAllTableData(selectedSupplyOrder.id);
            reset(defaultValues);
            onClose();
          } else {
            toast.error("Failed to update!, try again");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update!, try again");
        })
        .finally(() => setSubmitting(false));
    } else {
      toast.error("Fill the Remarks");
    }
  };

  const displayRecords = (val) => {
    if (val === 1)
      setSoStatus(1);
    else setSoStatus(2);
    axiosInstance
      .get(getAllEmpsOfOrgn + `${empId}/${orgId}`).then((res) => {
        setRecords(res?.data);

        console.log(res, "efhrugh");
      })
      .catch((err) => console.log("error in getSubDcqaoBySubRole" + err));

  };
  const displayRecordsForInsp = () => {
    displayRecords(1);
  };

  if (user?.roleId === 7 && count === false) {
    displayRecordsForInsp();
    setCount(true);
  }
  const resetForm = () => {
    reset(defaultValue);
  };
  const handleUploadImage = (e) => {
    const files = e.target.files;
    const newArr = [];
    for (let i = 0; i < files.length; i++) {
      newArr.push(files[i]);
    }
    setSelectedFileToUpload((ps) => ([...ps, ...newArr]));
  };
  const handleDeleteFile = (name) => {
    const filterFile = selectedFileToUpload.filter(
      (el) => el.name !== name
    );
    setSelectedFileToUpload(filterFile);
  };

  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle onClose={onClose} style={{ fontSize: "0.875" }}>
        Enter Remarks
      </DialogTitle>
      <DialogContent>
        {submitting && <LinearProgress />}
        <form onSubmit={handleSubmit(onFormSave)}>
          <MuiTextField
            {...register("remarks", {
              maxLength: {
                message: "Char. should be less than 1000",
                value: 1000,
              },
              minLength: {
                value: 5,
                message: "Char. should be greater than 4",
              },
              required: true,
            })}
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

         
          <div style={{ margin: "12px 0px 0px 0px" }}>
           
            <Grid container spacing={2}>
              {user?.roleId !== 7 ? (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <FormControl style={{ padding: "14px 0px 0px 0px" }}>
                    <ToggleButtonGroup
                      value={searchFlag}
                      exclusive
                      onChange={(e, newvalue) => {
                        const val = newvalue;
                        resetForm();
                        console.log("newValue", newvalue);
                        setSearchFlag(newvalue);
                        if (user?.roleId === 4) {
                          //JCQAO User
                          setVal(0);
                        }
                        displayRecords(val);
                        setIsAcceptSelected(newvalue === 1);
                      }}
                      size="small"
                    >
                      <ToggleButton
                        classes={{
                          root: classes.leftRoot,
                        }}
                        className={classes.acceptColor}
                        value={1}
                        disabled={isAcceptSelected}
                      >
                        Accept
                      </ToggleButton>
                      <ToggleButton
                        classes={{
                          root: classes.rightRoot,
                        }}
                        className={classes.rejectColor}
                        value={0}
              
                      >
                        Reject&nbsp;
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </FormControl>
                </Grid>
              ) : (
                ""
              )}
              {user?.roleId !== 4 || soStatus === 2 ? (
                <Grid item xs={12} sm={8} md={6} lg={3} xl={3}>
                  <Controller
                    name="empId"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <AutoCompleteNew
                        labelText="Select Next Approver"
                        data={records}
                        getOptionLabel={(o) => o?.ename}
                        onChange={(e, v) => {
                          onChange(v);
                          setVal(v?.id);
                        }}
                      />
                    )}
                  />
                </Grid>
              ) : (
                ""
              )}


              {user && user?.roleId === 7 && (
                <Grid item xs={12} sm={8} md={6} lg={3} xl={3}>
                  <InputLabel style={{ fontSize: "0.875rem", }}>Attachment</InputLabel>
                  <MuiTextField
                    size='small'
                    variant="outlined"
                    type="file"
                    inputProps={{
                      multiple: "multiple"
                    }}
                    onChange={handleUploadImage}
                  />
                </Grid>
              )}

              {user && user?.roleId === 7 && selectedFileToUpload.length > 0 && (
                <Grid item xs={12}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {selectedFileToUpload?.map((el, index) => (
                      <Chip
                        label={<Typography
                          variant="body2"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={el?.name}
                        >
                          {el?.name}
                        </Typography>}
                        size="small"
                        onDelete={() => {
                          handleDeleteFile(
                            el?.name
                          );
                        }}
                        key={index} />
                    ))}
                  </div>
                </Grid>
              )}
             
            </Grid>
          </div>
          {/* )} */}
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          onClick={handleSubmit((data) => onFormSave(data, 1))}
          variant="contained"
          color="primary"       
        >  Submit
        </Button>
       
      </DialogActions>
    </Dialog>
  );
}

const defaultValues = { remarks: "" };
const defaultValue = { empId: "" };

export default function ApprovalCycle({ supplyOrderObj }) {
  const user = useSelector((store) => store.loggedInUser);

  const [selectedSupplyOrder, setSelectedSupplyOrder] = useState();
  const [loading, setLoading] = useState(false);

  const [supplyOrders, setSupplyOrders] = useState([]);
  const [records, setRecords] = useState();
  const [openRemarksForm, setOpenRemarksForm] = useState(false);

  useEffect(() => {
    if (supplyOrders.length > 0) {
      handleSupplyOrderChange(supplyOrders[0].id);
    }
  }, [supplyOrders]);

  const handleSupplyOrderChange = async (target) => {
    const value = target;
    const selectedSupplyOrderObj = supplyOrders.find((o) => o.id === +value);
    setSelectedSupplyOrder(selectedSupplyOrderObj);
    if (value) {
      getAllTableData(value);
    }
  };

  const {
    // register,
    // handleSubmit,
    control,
    // reset,
    // formState: { errors, isDirty },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (user) {
      setLoading(true);
      axiosInstanceTrans(urlGetSupplyOrder + user?.orgId + "/" + user?.empId)
        .then(({ data }) => {
          if (Array.isArray(data)) {
            setSupplyOrders(data);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  async function getAllTableData(id) {
    setLoading(true);
    try {
      const { data } = await axiosInstanceTrans(urlGetAll + id + "/" + user?.empId);
      setRecords(data);
      console.log("isEditAllowed", data?.isEditAllowed);
    } catch (error) {
      toast.error("failed to get Records");
    }
    setLoading(false);
  }

  useEffect(() => {
    //TODO: this
    // if id supply Id match the select that obj
    // setSelectedSupplyOrder(supplyOrderObj)
  }, [supplyOrderObj]);

  return (
    <div>
      {openRemarksForm && (
        <RemarksForm
          selectedSupplyOrder={selectedSupplyOrder}
          getAllTableData={getAllTableData}
          onClose={() => setOpenRemarksForm(false)}
        />
      )}
      <Grid xs={12} sm={6} md={6} lg={2} xl={2}>
        <Controller
          name="selectedSupplyOrder"
          control={control}
          render={({ field: { onChange, value, ...props } }) => (
            <AutoCompleteNew
              data={supplyOrders}
              value={selectedSupplyOrder?.id}
              labelText="Select Supply Order"
              getOptionLabel={(o) => o.orderNo}
              onChange={(e, v) => {
                onChange(v);
                handleSupplyOrderChange(v?.id);
                console.log("thus", v?.id);
              }}
            />
          )}
        />
      </Grid>
     

      {!selectedSupplyOrder ? (
        <Typography color="error" align="center" style={{ marginTop: 20 }}>
          Please select supply order
        </Typography>
      ) : (
        <>
          <POObsTableArmyMr rowData={selectedSupplyOrder} hide />

          <Paper style={{ marginTop: 8, textAlign: "right" }}>
            {user?.roleId !== 3 ? (
              <Button
                disabled={!records?.isEditAllowed}
                onClick={() => setOpenRemarksForm(true)}
                color="Primary"
                variant="contained"
              >
                Enter Remarks
              </Button>
            ) : (
              ""
            )}
            <TableContainer style={{ maxHeight: "600px" }}>
              {loading && <LinearProgress />}
              <Table
                style={{
                  position: "relative",
                  border: "1px solid lightgrey",
                }}
                size="small"
                aria-label="simple table"
                id="data-table-cleanliness-report"
              >
                <TableHead>
                  <TableRow>
                    {headers.map((lb) => (
                      <THeader label={lb} />
                    ))}
                  </TableRow>
                </TableHead>

                <Body records={records?.soApprovalDtos || []} />
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </div>
  );
}
