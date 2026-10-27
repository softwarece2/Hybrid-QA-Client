import { makeStyles } from "@material-ui/core/styles";
import { saveAs } from "file-saver";
import React, { useEffect, useRef, useState } from "react";

//material-ui
import {
  CircularProgress,
  Dialog,
  FormControl,
  FormControlLabel,
  Grid,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
  InputLabel,
} from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import FormLabel from "@material-ui/core/FormLabel";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Delete from "@material-ui/icons/Delete";
import { DialogTitle } from "Utils";
import DateFnsUtils from "@date-io/date-fns";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { restrict } from "restrict";

//redux
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
//pages
import { PaperComponent } from "Utils/D3Tree";

//components
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";
import MultilineTextField from "../../../../components/MultilineTextField";

//icon
import { grey, teal } from "@material-ui/core/colors";
import { Close } from "@material-ui/icons";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import moment from "moment";
import { viewDocument } from "pages/HomePage/UserLogin";
import { default as axiosInstanceTran, default as axiosInstanceTrans } from "pages/Services/AxiosInstanceTransaction";
import { saveSOAttachments } from "pages/Services/URLs";
import { toast } from "react-toastify";
import { getInspectionAgencyDetailsAndFirmDetails, getInspectionAgencyDetailsOfFirm } from "pages/UserManagement/FirmInspAgencyAction";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
  },
  card: {
    maxWidth: "100%",
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "1rem",
  },
  cardContent: {
    textAlign: "left",
    // padding: 16,
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  DialogTitle: {
    backgroundColor: "#205375",
    color: "white",
    padding: "4px",
    zIndex: 1,
    fontSize: "0.875rem",
  },
  asterisk: {
    color: "red",
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
  },
}))(MenuItem);

const defaultValues = {
  // orderNo: "",
  // orderDate: "",
  // receiptDate: "",
  // description: "",
  remarks: "",
  // status: "",
  // isGcc: "",
  // inspectionAgencyIds: "",
};
const schema = yup.object().shape({
  // orderNo: yup.string().typeError("Required").required(" Required"),
  // orderDate: yup.string().typeError("Required").required(" Required"),
  // receiptDate: yup.string().typeError("Required").required(" Required"),
  // description: yup.string().nullable().typeError("Required").required(" Required"),
  // inspectionAgencyIds: yup.object().typeError("Required").required("Inspection Agency Required"),
});

function Title({ children }) {
  return (
    <Typography
      color="primary"
      style={{
        paddingLeft: 20,
        backgroundColor: grey[200],
        fontWeight: 500,
        fontFamily: "sans-serif",
        borderRadius: "0 0 12px 12px",
      }}
    >
      {children}
    </Typography>
  );
}

const DownloadResponse = ({ data, soId, soObj, deleteFileQap, getSoAttachmentsFn }) => {
  function handlePdfView(url) {
    axiosInstanceTran
      .get(url, {
        responseType: "blob",
      })
      .then(({ data }) => {
        viewDocument(data, url.split("/").pop());
      })
      .catch(() => toast.error("Failed to download, Please try again!"));
  }

  function handleDownload(url) {
    axiosInstanceTran
      .get(url, {
        responseType: "blob",
      })
      .then(({ data }) => {
        saveAs(data, url.split("/").pop());
      })
      .catch(() => toast.error("Failed to download, Please try again!"));
  }
  const [deleteReqbody, setDeleteReqbody] = useState();

  const [openDeleteDialog, setDeleteDialog] = React.useState(false);
  const handleCloseDialog = () => {
    setDeleteDialog(false);
  };
  console.log("kfjrjkfh", data);
  const handleOpenDialog = (el,fileName) => {
    setDeleteReqbody({ id: el?.id, name: fileName });
    setDeleteDialog(true);
  };

  const remove = async () => {
    try {
      await axiosInstanceTrans
        .post(`supplyOrder/deleteSoAttachment`, deleteReqbody)
        .then((res) => {
          setDeleteDialog(false);
          console.log(res?.data);

          toast.success("File Successfully Deleted");
          deleteFileQap(1);
          getSoAttachmentsFn(soObj);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid container spacing={0}>
      <Grid xs={12}>
        <Typography align="center" style={{ backgroundColor: "#546e7a", color: "white", marginTop: 8 }}>
          Uploaded Files
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={4} xl={4} style={{ border: "1px solid #B2BEB5" }}>
      <Title>Amendments</Title>
      {data?.amendments && data.amendments.length > 0 ? (
        data.amendments.map((el) => {
          // Determine if el is an object or a string
          const fileUrl = typeof el === 'object' ? el.url : el;
          const fileName = typeof el === 'object' ? el.fileName : el.split("/").pop();

          return (
            <StyledMenuItem key={el.id || fileUrl} style={{ padding: "0px 0px 0px 10px" }}>
              <ListItemText
                disableTypography
                primary={<Typography variant="body2">{fileName}</Typography>}
              />
              <Tooltip title="View File">
                <IconButton size="small" onClick={() => handlePdfView(fileUrl)}>
                  <VisibilityIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download File">
                <IconButton size="small" onClick={() => handleDownload(fileUrl)}>
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete File">
                <IconButton onClick={() => handleOpenDialog(el,fileName)}>
                  <Delete color="error" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          );
        })
      ) : (
        <Typography align="center" style={{ fontSize: "0.875rem" }}>No files found</Typography>
      )}
    </Grid>
    <Grid item xs={12} sm={6} md={6} lg={4} xl={4} style={{ border: "1px solid #B2BEB5" }}>
      <Title>Attachments</Title>
      {data?.attachments && data.attachments.length > 0 ? (
        data.attachments.map((el) => {
          const fileUrl = typeof el === 'object' ? el.url : el;
          const fileName = typeof el === 'object' ? el.fileName : el.split("/").pop();

          return (
            <StyledMenuItem key={fileUrl} style={{ padding: "0px 0px 0px 10px" }}>
              <ListItemText
                disableTypography
                primary={<Typography variant="body2" onClick={() => handlePdfView(fileUrl)}>{fileName}</Typography>}
              />
              <Tooltip title="View File">
                <IconButton size="small" onClick={() => handlePdfView(fileUrl)}>
                  <VisibilityIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download File">
                <IconButton size="small" onClick={() => handleDownload(fileUrl)}>
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete File">
                <IconButton onClick={() => handleOpenDialog(el,fileName)}>
                  <Delete color="error" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          );
        })
      ) : (
        <Typography align="center" style={{ fontSize: "0.875rem" }}>No files found</Typography>
      )}
    </Grid>
    <Grid item xs={12} sm={6} md={6} lg={4} xl={4} style={{ border: "1px solid #B2BEB5" }}>
      <Title>SO</Title>
      {data?.poFiles && data.poFiles.length > 0 ? (
        data.poFiles.map((el) => {
          const fileUrl = typeof el === 'object' ? el.url : el;
          const fileName = typeof el === 'object' ? el.fileName : el.split("/").pop();

          return (
            <StyledMenuItem key={fileUrl} style={{ padding: "0px 0px 0px 10px" }}>
              <ListItemText
                disableTypography
                primary={<Typography variant="body2">{fileName}</Typography>}
              />
              <Tooltip title="View File">
                <IconButton size="small" onClick={() => handlePdfView(fileUrl)}>
                  <VisibilityIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download File">
                <IconButton size="small" onClick={() => handleDownload(fileUrl)}>
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete File">
                <IconButton onClick={() => handleOpenDialog(el,fileName)}>
                  <Delete color="error" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          );
        })
      ) : (
        <Typography align="center" style={{ fontSize: "0.875rem" }}>No files found</Typography>
      )}
    </Grid>
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog} maxWidth="sm">
        <DialogTitle>Delete Uploaded File</DialogTitle>
        <DialogContent>Are you sure you want to delete this file?</DialogContent>
        <DialogActions>
          <Button color="secondary" variant="contained" onClick={() => remove()}>
            Yes
          </Button>
          <Button onClick={handleCloseDialog} color="primary" variant="contained">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default function SbuSOForm({ setOpen, soObj, fetchSO, getSoAttachmentsFn }) {
  console.log("soObj", soObj);
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.loggedInUser);

  let fileInputRef = useRef(null);
  let fileInputAmendment = useRef(null);
  let fileInputSO = useRef(null);

  const [remarks, setRemarks] = React.useState("");
  const [description, setDescription] = React.useState("");
  // const [status, setStatus] = React.useState("");

  const [selectedFileQap, setSelectedFileQap] = useState([]);
  const [selectedAmendment, setSelectedAmendment] = useState([]);
  const [selectedFileAtp, setSelectedFileAtp] = useState([]);
  const [selectedFileDraw, setSelectedFileDraw] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedFileSO, setSelectedSO] = useState([]);
  const [responseData, setResponseData] = useState();
  const [loading, setLoading] = useState(false);

  const [qapInput, setQapInput] = useState(null);
  const [atpInput, setAtpInput] = useState(null);
  const [attachmentInput, setAttachmentInput] = useState(null);
  const [amendmentInput, setAmendmentInput] = useState(null);
  const [soInput, setSOInput] = useState(null);

  const [initialFilesSnapshot, setInitialFilesSnapshot] = useState({
    amendments: [],
    attachments: [],
    soFiles: []
  });

  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 250 * 1024 * 1024;
  const MAX_FILE_COUNT = 13;
  const invalidExtensions = [".ps1", ".exe", ".msi", ".dll", ".vbs", ".js", ".lnk", ".jar", ".zip", ".rar"];

  const handleFileInputAmendment = (e) => {
    const files = Array.from(e.target.files);
    let newFiles = [];

    let totalSize = 0;
    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        if (totalSize + file.size <= MAX_TOTAL_SIZE) {
          if (selectedFile.length + newFiles.length < MAX_FILE_COUNT) {
            newFiles.push(file);
            totalSize += file.size;
          }
        } else {
          toast.error("Adding this file exceeds the total size limit of 250MB");
        }
      } else {
        toast.error(`Please select a file less than 100MB.`);
      }
    });
    const hasInvalidExtension = Array.from(files).some((file) =>
      invalidExtensions.some((extension) => file.name.toLowerCase().endsWith(extension))
    );
    if (hasInvalidExtension) {
      toast.error("Invalid file format.");

      encodeURIComponent.target.value = null;
      return;
    }

    setSelectedAmendment([...selectedAmendment, ...newFiles]);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    let newFiles = [];

    let totalSize = 0;
    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        if (totalSize + file.size <= MAX_TOTAL_SIZE) {
          if (selectedFile.length + newFiles.length < MAX_FILE_COUNT) {
            newFiles.push(file);
            totalSize += file.size;
          }
        } else {
          toast.error("Adding this file exceeds the total size limit of 250MB");
        }
      } else {
        toast.error(`Please select a file less than 100MB.`);
      }
    });
    const hasInvalidExtension = Array.from(files).some((file) =>
      invalidExtensions.some((extension) => file.name.toLowerCase().endsWith(extension))
    );
    if (hasInvalidExtension) {
      toast.error("Invalid file format.");

      encodeURIComponent.target.value = null;
      return;
    }

    setSelectedFile([...selectedFile, ...newFiles]);
  };
  const handleFileInputSO = (e) => {
    const files = Array.from(e.target.files);
    let newFiles = [];

    let totalSize = 0;
    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        if (totalSize + file.size <= MAX_TOTAL_SIZE) {
          if (selectedFile.length + newFiles.length < MAX_FILE_COUNT) {
            newFiles.push(file);
            totalSize += file.size;
          }
        } else {
          toast.error("Adding this file exceeds the total size limit of 250MB");
        }
      } else {
        toast.error(`Please select a file less than 100MB.`);
      }
    });
    const hasInvalidExtension = Array.from(files).some((file) =>
      invalidExtensions.some((extension) => file.name.toLowerCase().endsWith(extension))
    );
    if (hasInvalidExtension) {
      toast.error("Invalid file format.");
      // Clear the input
      encodeURIComponent.target.value = null;
      return;
    }
    setSelectedSO([...selectedFileSO, ...newFiles]);
  };
  const deleteFileQap = (id) => {
    let randomString = Math.random().toString(36);
    const filteredListQap = selectedFileQap?.filter((item, index) => index !== id);
    setSelectedFileQap(filteredListQap);
    setQapInput(randomString);
    console.log("file filteredList", filteredListQap);
  };

  const deleteFileAmendment = (id) => {
    let randomString = Math.random().toString(36);
    const filteredListAmendment = selectedAmendment?.filter((item, index) => index !== id);
    setAmendmentInput(randomString);
    setSelectedAmendment(filteredListAmendment);
    console.log("file filteredList", filteredListAmendment);

    console.log("file filteredList", filteredListAmendment);
  };
  const deleteFile = (id) => {
    let randomString = Math.random().toString(36);
    const filteredList = selectedFile?.filter((item, index) => index !== id);
    setAttachmentInput(randomString);
    setSelectedFile(filteredList);
    console.log("file filteredList", filteredList);
  };

  const deleteFileSO = (id) => {
    let randomString = Math.random().toString(36);
    const filteredList = selectedFileSO?.filter((item, index) => index !== id);
    setSOInput(randomString);
    setSelectedSO(filteredList);
    console.log("file filteredList", filteredList);
  };
  console.log("qapInput", selectedFileQap);
  const {
    handleSubmit,
    reset,
    getValues,

    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onFormSubmit = (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "supplyOrderDtoStr",
      JSON.stringify({
        id: soObj?.id,
        // orderNo: data.orderNo,
        // orderDate: data.orderDate,
        // receiptDate: data.receiptDate,
        // description: data.description,
        remarks: data.remarks,
        // status: data.status,
        // isGcc: data.isGcc,
        // organizationId: getValues("inspectionAgencyIds")?.id,
      })
    );
    console.log(data.status, "status");
    selectedFileQap.forEach((item) => formData.append("qapFiles", item));
    selectedFileDraw.forEach((item) => formData.append("drawings", item));
    selectedFileAtp.forEach((item) => formData.append("atp", item));
    selectedAmendment.forEach((item) => formData.append("amendments", item));
    console.log("amendments", selectedAmendment);
    selectedFile.forEach((item) => formData.append("others", item));
    selectedFileSO.forEach((item) => formData.append("po", item));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axiosInstanceTran
      .post(saveSOAttachments, formData, config)
      .then(({ data }) => {
        console.log("file upload res", data);
        setResponseData(data);
        setSelectedFile([]);
        setSelectedFileDraw([]);
        setSelectedFileAtp([]);
        setSelectedFileQap([]);
        setSelectedAmendment([]);
        setSelectedSO([]);
        // setDescription(data.description);
        setRemarks(data.remarks);
        // setStatus(data.statusVal);
        if (data !== "null") {
          toast.success("SO details updated successfully");
          setOpen(false);
          fetchSO();
        } else {
          console.log("Error Occured")
          toast.error("Something went wrong");
        }
      })

      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  const isFileChanged = () => {
    // Check Amendments
    const amendmentChanged = selectedAmendment?.length !== initialFilesSnapshot.amendments.length ||
      selectedAmendment?.some(file => !initialFilesSnapshot.amendments.includes(file.name));
  
    // Check Attachments
    const attachmentChanged = selectedFile?.length !== initialFilesSnapshot.attachments.length ||
      selectedFile?.some(file => !initialFilesSnapshot.attachments.includes(file.name));
  
    // Check SO Files
    const soFileChanged = selectedFileSO?.length !== initialFilesSnapshot.soFiles.length ||
      selectedFileSO?.some(file => !initialFilesSnapshot.soFiles.includes(file.name));
  
    return amendmentChanged || attachmentChanged || soFileChanged;
  };

  const inspectionAgencyDetailsOfFirm = useSelector((store) => store.orgReducer.inspectionAgencyTypeOfFirm);
  useEffect((id) => {
    dispatch(getInspectionAgencyDetailsAndFirmDetails(loggedInUser?.orgId));
  }, []);

  useEffect(() => {
    if (soObj) {
      // Map the existing files from your API response to a simple array of names or IDs
      // Adjust 'responseData.files...' based on your actual API structure
      setInitialFilesSnapshot({
        amendments: soObj.amendments?.map(f => f.name) || [],
        attachments: soObj.attachments?.map(f => f.name) || [],
        soFiles: soObj.soFiles?.map(f => f.name) || []
      });
    }
  }, [soObj]);
  
  useEffect(() => {
    console.log(soObj, "ppp");
    if (soObj) {
      const status = soObj.status;
      const normalizedStatus = typeof status === "string" ? status.trim().toLowerCase() : null;
      reset({
        // orderNo: soObj?.orderNo,
        // orderDate: soObj?.orderDate,
        // receiptDate: soObj?.receiptDate,
        // description: soObj?.description,
        remarks: soObj?.remarks,
        // status: normalizedStatus === "active" ? "Active" : normalizedStatus === "inactive" ? "Inactive" : null,
        // isGcc: soObj?.isGcc ? "true" : "false",
        // inspectionAgencyIds: findInspectionAgency(soObj?.organizationId, inspectionAgencyDetailsOfFirm),
      });
      setResponseData(soObj);
    }
  }, [soObj, inspectionAgencyDetailsOfFirm, reset]);

  const findInspectionAgency = (organizationId, agencies) => {
    if (!organizationId || !agencies) {
      return null;
    }
    const agency = agencies.find((agency) => agency.id === organizationId);
    return agency;
  };
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Dialog open={true} maxWidth="lg" fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title1" {...props} />}>
        <DialogTitle className={classes.DialogTitle} style={{ cursor: "move" }} id="draggable-dialog-title1">
          <span>Upload Files (SO No. : {soObj?.orderNo})</span>
        </DialogTitle>
        <DialogContent dividers style={{ padding: 12, position: "relative" }}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Controller
                name="orderNo"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="SO/PO Number"
                    placeholder="Enter SO/PO Number"
                    size="small"
                    {...props}
                    onChange={onChange}
                    value={value}
                    required
                    inputProps={{ maxLength: 100 }}
                    error={!!errors.orderNo}
                    helperText={errors.orderNo?.message}
                  />
                )}
              />
            </Grid> */}

            {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}> */}
            {/* <Typography variant="body2">Supply Order Date</Typography> */}
            {/* <Controller
                name="orderDate"
                control={control}
                // value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      variant="dialog"
                      format="dd/MM/yyyy"
                      autoOk
                      id="date-picker-inline"
                      value={value}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      onChange={onChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      clearable
                      size="small"
                      inputVariant={"outlined"}
                      disableFuture
                      error={!!errors.orderDate}
                      helperText={errors.orderDate?.message}
                    />
                  </MuiPickersUtilsProvider>
                )}
              /> */}
            {/* <Controller
                name="orderDate"
                control={control}
                // value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="SO/PO Date"
                    placeholder="SO/PO date"
                    onChange={onChange}
                    value={moment(value).format("YYYY-MM-DD")}
                    type="date"
                    size="small"
                    required
                    onKeyDown={(e) => e.preventDefault()}
                    // {...props}
                    // inputProps={{
                    //   min: moment(new Date()).format("YYYY-MM-DD"),
                    // }}
                    error={!!errors.orderDate}
                    helperText={errors.orderDate?.message}
                  />
                )}
              />
            </Grid> */}

            {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={classes.padding}> */}
            {/* <Controller
                name="receiptDate"
                control={control}
                // value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      variant="dialog"
                      format="dd/MM/yyyy"
                      autoOk
                      id="date-picker-inline"
                      // label="Start Date"
                      value={value}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      onChange={onChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      clearable
                      size="small"
                      inputVariant={"outlined"}
                      disableFuture
                      error={!!errors.receiptDate}
                      helperText={errors.receiptDate?.message}
                    />
                  </MuiPickersUtilsProvider>
                )}
              /> */}
            {/* <Controller
                name="receiptDate"
                control={control}
                // value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="Receipt Date"
                    // <span style={{ fontWeight: 600 }}>Receipt Date:</span> {moment(soObj?.receiptDate).format("DD-MM-YYYY")}
                    placeholder="Receipt date"
                    onChange={onChange}
                    value={moment(value).format("YYYY-MM-DD")}
                    type="date"
                    size="small"
                    required
                    onKeyDown={(e) => e.preventDefault()}
                    // {...props}
                    // inputProps={{
                    //   min: moment(new Date()).format("YYYY-MM-DD"),
                    // }}
                    error={!!errors.receiptDate}
                    helperText={errors.receiptDate?.message}
                  />
                )}
              />
            </Grid> */}
            {/* <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <Controller
                name="inspectionAgencyIds"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <>
                      <InputLabel
                        classes={{
                          asterisk: classes.asterisk,
                          root: classes.root,
                        }}
                        required={true}
                      >
                        Inspection Agency
                      </InputLabel>
                      <Autocomplete
                        fullWidth
                        size="small"
                        id="checkboxes-tags-demo"
                        value={value}
                        onChange={(e, v) => {
                          onChange(v);
                        }}
                        getOptionSelected={(option, value) => option.id === value?.id}
                        options={inspectionAgencyDetailsOfFirm}
                        // disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            error={!!errors.inspectionAgencyIds}
                            helperText={errors.inspectionAgencyIds?.message}
                          />
                        )}
                      />
                    </>
                  );
                }}
              />
            </Grid> */}
            {/* <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <MultilineTextField
                    rows={3}
                    labelText="SO/PO Description"
                    placeholder="Enter SO/PO Description"
                    size="small"
                    {...props}
                    onChange={onChange}
                    value={value}
                    required
                    onInput={restrict.general}
                    inputProps={{ maxLength: 500 }}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid> */}

            <Grid item xs={12} sm={6} md={8} lg={8} xl={8}>
              <Controller
                name="remarks"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <MultilineTextField
                    maxRows={4}
                    labelText="Remarks"
                    placeholder="Enter Remarks"
                    size="small"
                    {...props}
                    onChange={onChange}
                    value={value}
                    inputProps={{ maxLength: 200 }}
                  />
                )}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6} md={2} lg={2} xl={2} className={classes.padding}>
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => {
                  console.log("value", value);
                  return (
                    <FormControl component="fieldset">
                      <FormLabel component="legend" style={{ fontSize: "0.875rem" }}>
                        Status
                      </FormLabel>
                      <RadioGroup row size="small" value={value}>
                        <FormControlLabel value="Active" onChange={onChange} control={<Radio size="small" />} label="Active" />
                        <FormControlLabel value="Inactive" onChange={onChange} control={<Radio size="small" />} label="Inactive" />
                      </RadioGroup>
                    </FormControl>
                  );
                }}
              />
            </Grid> */}

            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} className={classes.padding}>
              <input
                ref={(refParam) => (fileInputAmendment = refParam)}
                type="file"
                multiple
                style={{ display: "none" }}
                key={amendmentInput}
                // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileInputAmendment}
              />
              <Button
                onClick={() => {
                  fileInputAmendment.click();
                }}
                className={classes.browseBtn}
                variant="outlined"
                size="small"
              >
                Upload Amendments
              </Button>
              {selectedAmendment ? (
                selectedAmendment?.map((item, id) => (
                  <StyledMenuItem>
                    <ListItemText disableTypography primary={<Typography variant="body2">{item?.name}</Typography>} />
                    <IconButton
                      size="small"
                      onClick={() => {
                        deleteFileAmendment(id);
                      }}
                    >
                      <Close fontSize="small" color="action" />
                    </IconButton>
                  </StyledMenuItem>
                ))
              ) : (
                <Typography component={"span"} variant="caption" color="textSecondary">
                  No file selected.
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} className={classes.padding}>
              <input
                ref={(refParam) => (fileInputRef = refParam)}
                type="file"
                multiple
                style={{ display: "none" }}
                key={attachmentInput}
                // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileInput}
              />
              <Button
                onClick={() => {
                  fileInputRef.click();
                }}
                className={classes.browseBtn}
                variant="outlined"
                size="small"
              >
                Upload Attachments
              </Button>
              {selectedFile ? (
                selectedFile?.map((item, id) => (
                  <StyledMenuItem>
                    <ListItemText disableTypography primary={<Typography variant="body2">{item?.name}</Typography>} />
                    <IconButton
                      size="small"
                      onClick={() => {
                        deleteFile(id);
                      }}
                    >
                      <Close fontSize="small" color="action" />
                    </IconButton>
                  </StyledMenuItem>
                ))
              ) : (
                <Typography component={"span"} variant="caption" color="textSecondary">
                  No file selected.
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} className={classes.padding}>
              <input
                ref={(refParam) => (fileInputSO = refParam)}
                type="file"
                multiple
                style={{ display: "none" }}
                key={atpInput}
                // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileInputSO}
              />
              <Button
                onClick={() => {
                  fileInputSO.click();
                }}
                className={classes.browseBtn}
                variant="outlined"
                size="small"
              >
                Upload SO
              </Button>
              {selectedFileSO ? (
                selectedFileSO?.map((item, id) => (
                  <StyledMenuItem>
                    <ListItemText disableTypography primary={<Typography variant="body2">{item?.name}</Typography>} />
                    <IconButton
                      size="small"
                      onClick={() => {
                        deleteFileSO(id);
                      }}
                    >
                      <Close fontSize="small" color="action" />
                    </IconButton>
                  </StyledMenuItem>
                ))
              ) : (
                <Typography component={"span"} variant="caption" color="textSecondary">
                  No file selected.
                </Typography>
              )}
            </Grid>
          </Grid>

          {responseData && (
            <DownloadResponse
              data={responseData}
              soId={soObj?.id}
              soObj={soObj}
              deleteFileQap={deleteFileQap}
              getSoAttachmentsFn={getSoAttachmentsFn}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" type="submit" disabled={loading || !isFileChanged()} onClick={handleSubmit(onFormSubmit)}>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />}
            Update
          </Button>
          <Button variant="contained" color="primary" onClick={() => setOpen(false)} type="submit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
