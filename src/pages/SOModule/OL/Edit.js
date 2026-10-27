/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import {
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import IconButton from "@material-ui/core/IconButton";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { grey, teal } from "@material-ui/core/colors";
import { Add, Close, Delete, GetApp, Visibility } from "@material-ui/icons";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import { getOlAttachmentsById } from "Redux/Actions/SupplyOrder/OLAction";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import ActionButton from "components/ActionButton";
import { CV2_IP } from "config";
import { saveAs } from "file-saver";
import { viewDocument } from "pages/HomePage/UserLogin";
import axiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import AxiosInstanceVideo from "pages/Services/AxiosInstanceVideo";
import { saveOlAttachments } from "pages/Services/URLs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { USER_ROLE_ID, WING_ID, DEPARTMENT_ID, ORG_TYPE } from "../../../Globals";
import AddOrEdit from "./AddOrEdit";
import OLViewLI from "./OLViewLI";
import VideoList from "./VideoList";
import INotePreview from "./preview/INote";
import FormVIPreview from "./preview/formVI";
import axiosInstanceMaster from "pages/Services/AxiosInstance";
import DispatchNote from "pages/Enclosures/DispatchNote/DispatchNote";
import AddLineItem from "./AddLineItem";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";

const useStyles = makeStyles((theme) => ({
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
  buttonProgress: {
    color: "white",
  },
  text: {
    wordWrap: "break-word",
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

const DownloadResponse = ({ data, soId, soObj, deleteFile, getAttachments }) => {
  function handlePdfView(url) {
    axiosInstanceTransaction
      .get(url, {
        responseType: "blob",
      })
      .then(({ data }) => {
        viewDocument(data, url.split("/").pop());
      })
      .catch(() => toast.error("Failed to download, Please try again!"));
  }
  function handleDownload(url) {
    axiosInstanceTransaction
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
  const handleOpenDialog = (fileName) => {
    setDeleteReqbody({ id: soObj?.id || soObj?.offerLetterId, name: fileName });
    setDeleteDialog(true);
  };

  const remove = async () => {
    try {
      await axiosInstanceTransaction
        .post(`offerLetter/deleteOlAttachment`, deleteReqbody)
        .then((res) => {
          setDeleteDialog(false);
          // if (res.status === 200) {
          toast.success("File Successfully Deleted");
          getAttachments(soId);
          deleteFile(1);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
    // dispatch(remove);
  };

  return (
    <Grid container spacing={0}>
      <Grid xs={12}>
        <Typography align="center" style={{ backgroundColor: "#546e7a", color: "white", marginTop: 8 }}>
          Uploaded Files
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ border: "1px solid 	#B2BEB5" }}>
        <Title>Attachments</Title>
        {data?.attachments?.length ? (
          data.attachments.map((el) => {
            const fileName = el.split("/").pop(); // Extract the file name from the full path
            const parts = fileName.split("\t");
            const displayName = el.split("\t")[0]; // Split the file name by tab

            return (
              <>
                <StyledMenuItem
                  style={{ padding: "0px 0px 0px 10px" }}
                  //</>  onClick={() => handlePdfView(el)}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        {/* Left-aligned part (before the tab) */}
                        <Typography variant="body2">{parts[0]}</Typography>
                        {/* Right-aligned part (after the tab) */}
                        {parts[1] && (
                          <Typography variant="body2" style={{ textAlign: "right" }}>
                            {parts[1]}
                          </Typography>
                        )}
                      </div>
                    }
                    primaryTypographyProps={{ style: { whitespace: "normal" } }}
                    // onClick={() => handleDownload(el)}
                  />
                  <IconButton
                    size="small"
                    // style={{ paddingLeft:"200px"}}
                    onClick={() => handlePdfView(displayName)}
                  >
                    <Visibility color="primary" />
                  </IconButton>
                  <Tooltip title="Download File">
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleDownload(displayName);
                      }}
                    >
                      <GetApp fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => handleOpenDialog(displayName.split("/").pop())}>
                    <Delete title="Delete" color="error" />
                  </IconButton>
                </StyledMenuItem>
              </>
            );
          })
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ border: "1px solid 	#B2BEB5" }}>
        <Title>Pre Inspection Reports</Title>
        {data?.preInspectionReports?.length ? (
          data.preInspectionReports.map((el) => {
            const fileName = el.split("/").pop(); // Extract file name
            const parts = fileName.split("\t"); // Split file name by tab
            const displayName = el.split("\t")[0];
            return (
              <>
                <StyledMenuItem
                  style={{ padding: "0px 0px 0px 10px" }}
                  // onClick={() => handlePdfView(el)}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        {/* Left-aligned part (before tab) */}
                        <Typography variant="body2">{parts[0]}</Typography>
                        {/* Right-aligned part (after tab, if exists) */}
                        {parts[1] && (
                          <Typography variant="body2" style={{ textAlign: "right" }}>
                            {parts[1]}
                          </Typography>
                        )}
                      </div>
                    }
                    primaryTypographyProps={{ style: { paddingRight: "20px" } }}
                    // onClick={() => handleDownload(el)}
                  />
                  <IconButton size="small" onClick={() => handlePdfView(displayName)}>
                    <Visibility color="primary" />
                  </IconButton>
                  <Tooltip title="Download File">
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleDownload(displayName);
                      }}
                    >
                      <GetApp fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => handleOpenDialog(displayName.split("/").pop())}>
                    <Delete title="Delete" color="error" />
                  </IconButton>
                </StyledMenuItem>
              </>
            );
          })
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ border: "1px solid 	#B2BEB5" }}>
        <Title>QAP </Title>
        {data?.qap?.length ? (
          data.qap.map((el) => {
            const fileName = el.split("/").pop(); // Extract file name
            const parts = fileName.split("\t"); // Split file name by tab
            const displayName = el.split("\t")[0];
            return (
              <>
                <StyledMenuItem
                  style={{ padding: "0px 0px 0px 10px" }}
                  // onClick={() => handlePdfView(el)}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        {/* Left-aligned part (before tab) */}
                        <Typography variant="body2">{parts[0]}</Typography>
                        {/* Right-aligned part (after tab, if exists) */}
                        {parts[1] && (
                          <Typography variant="body2" style={{ textAlign: "right" }}>
                            {parts[1]}
                          </Typography>
                        )}
                      </div>
                    }
                    primaryTypographyProps={{ style: { paddingRight: "20px" } }}
                    // onClick={() => handleDownload(el)}
                  />
                  <IconButton size="small" onClick={() => handlePdfView(displayName)}>
                    <Visibility color="primary" />
                  </IconButton>
                  <Tooltip title="Download File">
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleDownload(displayName);
                      }}
                    >
                      <GetApp fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => handleOpenDialog(displayName.split("/").pop())}>
                    <Delete title="Delete" color="error" />
                  </IconButton>
                </StyledMenuItem>
              </>
            );
          })
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ border: "1px solid 	#B2BEB5" }}>
        <Title>Drawings </Title>
        {data?.drawings?.length ? (
          data.drawings.map((el) => {
            const fileName = el.split("/").pop(); // Extract file name
            const parts = fileName.split("\t"); // Split file name by tab
            const displayName = el.split("\t")[0];
            return (
              <>
                <StyledMenuItem
                  style={{ padding: "0px 0px 0px 10px" }}
                  // onClick={() => handlePdfView(el)}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        {/* Left-aligned part (before tab) */}
                        <Typography variant="body2">{parts[0]}</Typography>
                        {/* Right-aligned part (after tab, if exists) */}
                        {parts[1] && (
                          <Typography variant="body2" style={{ textAlign: "right" }}>
                            {parts[1]}
                          </Typography>
                        )}
                      </div>
                    }
                    primaryTypographyProps={{ style: { paddingRight: "20px" } }}
                    // onClick={() => handleDownload(el)}
                  />
                  <IconButton size="small" onClick={() => handlePdfView(displayName)}>
                    <Visibility color="primary" />
                  </IconButton>
                  <Tooltip title="Download File">
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleDownload(displayName);
                      }}
                    >
                      <GetApp fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => handleOpenDialog(displayName.split("/").pop())}>
                    <Delete title="Delete" color="error" />
                  </IconButton>
                </StyledMenuItem>
              </>
            );
          })
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ border: "1px solid 	#B2BEB5" }}>
        <Title>ATE/ATP </Title>
        {data?.ateAtp?.length ? (
          data.ateAtp.map((el) => {
            const fileName = el.split("/").pop(); // Extract file name
            const parts = fileName.split("\t"); // Split file name by tab
            const displayName = el.split("\t")[0];
            return (
              <>
                <StyledMenuItem
                  style={{ padding: "0px 0px 0px 10px" }}
                  // onClick={() => handlePdfView(el)}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        {/* Left-aligned part (before tab) */}
                        <Typography variant="body2">{parts[0]}</Typography>
                        {/* Right-aligned part (after tab, if exists) */}
                        {parts[1] && (
                          <Typography variant="body2" style={{ textAlign: "right" }}>
                            {parts[1]}
                          </Typography>
                        )}
                      </div>
                    }
                    primaryTypographyProps={{ style: { paddingRight: "20px" } }}
                    // onClick={() => handleDownload(el)}
                  />
                  <IconButton size="small" onClick={() => handlePdfView(displayName)}>
                    <Visibility color="primary" />
                  </IconButton>
                  <Tooltip title="Download File">
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleDownload(displayName);
                      }}
                    >
                      <GetApp fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => handleOpenDialog(displayName.split("/").pop())}>
                    <Delete title="Delete" color="error" />
                  </IconButton>
                </StyledMenuItem>
              </>
            );
          })
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog} maxWidth="sm">
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

export default function Edit({ soObj, getOlData, olCycle, qaSide,IsOl,isSample,isqacl }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  let attachmentsRef = useRef(null);
  let fileInputRef = useRef(null);
  let qapRef = useRef(null);
  let drawingsRef = useRef(null);
  let ateatpRef = useRef(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [attachmentsInput, setAttachmentsInput] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [qap, setqap] = useState(null);
  const [drawings, setdrawings] = useState(null);
  const [ateAtp, setateAtp] = useState(null);
  const [responseData, setResponseData] = useState({});
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState([]);
  const [selectedqap, setSelectedQap] = useState([]);
  const [selecteddrawings, setSelectedDrawings] = useState([]);
  const [selectedateAtp, setSelectedateAtp] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const orgTypeId = useSelector((state) => state?.loggedInUser?.orgTypeId);
  const departmentId = loggedInUser?.departmentId;
  const roleId = loggedInUser?.roleId;
  const [openSavedVideo, setOpenVidePlayer] = useState(false);
  const [openDispatchNote, setOpenDispatchNote] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [count, setCount] = useState(0);
  const [openAllotQar, setOpenAllotQar] = useState(false);
  const [status, setStatus] = useState(soObj?.status?.type?.name || null);

  const {
    handleSubmit,
    reset,
    control,
    // getValues,
    formState: { isDirty },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      status: soObj?.status?.type?.name === "Active" ? "Active" : soObj?.status?.type?.name === "InActive" ? "Inactive" : null,
    });
    getAttachments(soObj.id || soObj?.offerLetterId);
  }, [soObj]);

  const getAttachments = (id) => {
    dispatch(getOlAttachmentsById(id)).then((data) => {
      setResponseData(data);
    });
  };

  useEffect(() => {
    if (soObj?.status?.type?.name) {
      setStatus(soObj.status.type.name); // Update state when soObj changes
    }
  }, [soObj]);

  const handleCloseEdit = () => {
    setEditOpen(false);
  };

  const hasFilesUploaded = [selectedFile, selectedAttachment, selectedqap, selecteddrawings, selectedateAtp].some(
    (array) => array?.length > 0
  );

  const handleAttachments = (e) => {
    // attachmentsRefQap.click();
    const files = Array.prototype.slice.call(e.target.files);
    let newFiles = [];
    files.forEach((file) => {
      if (!selectedAttachment?.map((e) => e?.name).includes(file?.name)) {
        newFiles.push(file);
      }
    });
    setSelectedAttachment([...selectedAttachment, ...newFiles]);
  };
  const handleFileInput = (e) => {
    // attachmentsRefQap.click();
    const files = Array.prototype.slice.call(e.target.files);
    let newFiles = [];
    files.forEach((file) => {
      if (!selectedFile?.map((e) => e?.name).includes(file?.name)) {
        newFiles.push(file);
      }
    });
    setSelectedFile([...selectedFile, ...newFiles]);
  };
  const handleqap = (e) => {
    // attachmentsRefQap.click();
    const files = Array.prototype.slice.call(e.target.files);
    let newFiles = [];
    files.forEach((file) => {
      if (!selectedqap?.map((e) => e?.name).includes(file?.name)) {
        newFiles.push(file);
      }
    });
    setSelectedQap([...selectedqap, ...newFiles]);
  };
  const handledrawings = (e) => {
    // attachmentsRefQap.click();
    const files = Array.prototype.slice.call(e.target.files);
    let newFiles = [];
    files.forEach((file) => {
      if (!selecteddrawings?.map((e) => e?.name).includes(file?.name)) {
        newFiles.push(file);
      }
    });
    setSelectedDrawings([...selecteddrawings, ...newFiles]);
  };
  const handleateAtp = (e) => {
    // attachmentsRefQap.click();
    const files = Array.prototype.slice.call(e.target.files);
    let newFiles = [];
    files.forEach((file) => {
      if (!selectedateAtp?.map((e) => e?.name).includes(file?.name)) {
        newFiles.push(file);
      }
    });
    setSelectedateAtp([...selectedateAtp, ...newFiles]);
  };
  const deleteFile = (id) => {
    let randomString = Math.random().toString(36);
    const filteredList = selectedFile?.filter((item, index) => index !== id);
    setSelectedFile(filteredList);
    setFileInput(randomString);
  };

  const deleteFileAttachmnets = (id) => {
    let randomString = Math.random().toString(36);
    const filteredList = selectedAttachment?.filter((item, index) => index !== id);
    setSelectedAttachment(filteredList);
    setAttachmentsInput(randomString);
  };
  const deleteqap = (id) => {
    let randomString = Math.random().toString(36);
    const filteredList = selectedqap?.filter((item, index) => index !== id);
    setSelectedQap(filteredList);
    setqap(randomString);
  };

  const deletedrawings = (id) => {
    let randomString = Math.random().toString(36);
    const filteredList = selecteddrawings?.filter((item, index) => index !== id);
    setSelectedDrawings(filteredList);
    setdrawings(randomString);
  };

  const deleteateAtp = (id) => {
    let randomString = Math.random().toString(36);
    const filteredList = selectedateAtp?.filter((item, index) => index !== id);
    setSelectedateAtp(filteredList);
    setateAtp(randomString);
  };
  const onFormSubmit = (data) => {
    setLoadingDraft(true);
    const status = data?.status;
    const formData = new FormData();
    formData.append(
      "offerLetterDtoStr",
      JSON.stringify({
        id: soObj?.id || soObj?.offerLetterId,
      })
    );
    selectedFile.forEach((item) => formData.append("preInspectionReports", item));
    selectedAttachment.forEach((item) => formData.append("attachments", item));
    selectedqap.forEach((item) => formData.append("qap", item));
    selecteddrawings.forEach((item) => formData.append("drawings", item));
    selectedateAtp.forEach((item) => formData.append("ateAtp", item));
    formData.append("olStatus", status);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axiosInstanceTransaction
      .post(saveOlAttachments, formData, config)
      .then(({ data }) => {
        setResponseData(data);
        setSelectedFile([]);
        setSelectedAttachment([]);
        setSelectedQap([]);
        setSelectedDrawings([]);
        setSelectedateAtp([]);
        if (data !== "null") {
          toast.success("Files updated successfully");
          getOlData();
          // fetchSO();
          // fetchOL(supplyOrderId);
        } else {
          toast.error("Something went wrong");
        }
      })
      // .catch((err) => console.log("Error in uploading Supply Order attachments", err));
      .catch((error) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setLoadingDraft(false);
      });
  };
  const hasAccessToAdd = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY;
  return (
    <div>
      {openSavedVideo && <VideoPlayer onClose={() => setOpenVidePlayer(false)} loggedInUser={loggedInUser} olNumber={soObj?.olNumber} />}
      {openDispatchNote && (
        <DispatchNote
          // onClose={() => setOpenDispatchNote(false)}
          setOpen={setOpenDispatchNote}
          loggedInUser={loggedInUser}
          // olNumber={soObj?.olNumber}
        />
      )}
      {!olCycle && (
        <div style={{ padding: 10 }}>
          <Typography style={{ fontSize: "0.875rem", fontWeight: 500 }}>
           {!hasAccessToAdd?" Submission Slip No. ":"OfferLetterNo"}:{soObj?.olNumber ? soObj.olNumber : soObj.name}
          </Typography>
          <Grid container spacing={1} style={{ padding: 10 }} justifyContent="flex-end">
            {/* {orgTypeId === 2 && (
          <Grid item xs={1} align="center">
            <ActionButton
              title="Preview Draft I-Note"
              variant="contained"
              size="small"
              color="primary"
              startIcon={<Visibility />}
              onClick={() => setOpenPreview(true)}
              fullWidth
            >
              Preview
            </ActionButton>
          </Grid>
        )} */}

            {orgTypeId === 2 && roleId === USER_ROLE_ID.ROLE_GIC && departmentId === DEPARTMENT_ID.ASSEMBLY ? (
              <Grid item xs={1} align="center">
                <ActionButton
                  fullWidth
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => {
                    setOpenAdd(true);
                  }}
                >
                  Add
                </ActionButton>
              </Grid>
            ) : null}


            {(loggedInUser?.roleId === USER_ROLE_ID.ROLE_QAO || loggedInUser?.roleId === USER_ROLE_ID.ROLE_SQAO) && (
              <Grid item xs={1} align="center">
                <ActionButton
                  style={{ width: 110 }}
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => setOpenAllotQar(true)}
                  //disabled={soObj?.qinAvlbl === true ? false : true}
                >
                  Allot {loggedInUser?.roleId === USER_ROLE_ID.ROLE_QAO ? "(Tier-2)" : "(Tier-3)"}
                </ActionButton>
              </Grid>
            )}

           
          </Grid>
        </div>
      )}
      <OLViewLI data={soObj} count={count} olCycle={olCycle} qaSide={qaSide} IsOl={IsOl} isSample={isSample} isqacl={isqacl} />

      {/* tooltip:"Upload Documnents", */}

      <Divider style={{ marginBlock: 8 }} />
      <Dialog
        open={editOpen}
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => <PaperComponent id="draggable-dialog-title36" {...props} />}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title36">
          {isArmy ? "Submission Slip" : "OL"} Number :{""} {soObj?.olNumber}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <input
                  ref={(refParam) => (attachmentsRef = refParam)}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  key={attachmentsInput}
                  // value={qapInput}
                  // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleAttachments}
                />
                <Button
                  onClick={(e) => {
                    attachmentsRef.click();
                  }}
                  className={classes.browseBtn}
                  variant="outlined"
                  size="small"
                >
                  Upload Attachments
                </Button>
                {selectedAttachment ? (
                  selectedAttachment?.map((item, id) => (
                    <StyledMenuItem>
                      <ListItemText disableTypography primary={<Typography variant="body2">{item?.name}</Typography>} />
                      <IconButton
                        size="small"
                        onClick={() => {
                          deleteFileAttachmnets(id);
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
              <Grid item xs={4}>
                <input
                  ref={(refParam) => (fileInputRef = refParam)}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  key={fileInput}
                  // value={qapInput}
                  // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileInput}
                />
                <Button
                  onClick={(e) => {
                    fileInputRef.click();
                  }}
                  className={classes.browseBtn}
                  variant="outlined"
                  size="small"
                >
                  Upload Pre Inspection Reports
                </Button>
                {selectedFile ? (
                  selectedFile?.map((item, id) => (
                    <StyledMenuItem>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="body2" style={{ whiteSpace: "pre" }}>
                            {item?.name}
                          </Typography>
                        }
                      />
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
              <Grid item xs={4}>
                <input
                  ref={(refParam) => (qapRef = refParam)}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  key={qap}
                  // value={qapInput}
                  // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleqap}
                />
                <Button
                  onClick={(e) => {
                    qapRef.click();
                  }}
                  className={classes.browseBtn}
                  variant="outlined"
                  size="small"
                >
                  Upload QAP
                </Button>
                {selectedqap ? (
                  selectedqap?.map((item, id) => (
                    <StyledMenuItem>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="body2" style={{ whiteSpace: "pre" }}>
                            {item?.name}
                          </Typography>
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          deleteqap(id);
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
              <Grid item xs={4}>
                <input
                  ref={(refParam) => (drawingsRef = refParam)}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  key={drawings}
                  // value={qapInput}
                  // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handledrawings}
                />
                <Button
                  onClick={(e) => {
                    drawingsRef.click();
                  }}
                  className={classes.browseBtn}
                  variant="outlined"
                  size="small"
                >
                  Upload Drawing
                </Button>
                {selecteddrawings ? (
                  selecteddrawings?.map((item, id) => (
                    <StyledMenuItem>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="body2" style={{ whiteSpace: "pre" }}>
                            {item?.name}
                          </Typography>
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          deletedrawings(id);
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
              <Grid item xs={4}>
                <input
                  ref={(refParam) => (ateatpRef = refParam)}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  key={ateAtp}
                  // value={qapInput}
                  // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleateAtp}
                />
                <Button
                  onClick={(e) => {
                    ateatpRef.click();
                  }}
                  className={classes.browseBtn}
                  variant="outlined"
                  size="small"
                >
                  Upload ATE/ATP
                </Button>
                {selectedateAtp ? (
                  selectedateAtp?.map((item, id) => (
                    <StyledMenuItem>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="body2" style={{ whiteSpace: "pre" }}>
                            {item?.name}
                          </Typography>
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          deleteateAtp(id);
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
              <Grid item xs={12} style={{ paddingTop: "25px" }}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Status</FormLabel>
                      <RadioGroup row size="sm" value={value}>
                        <FormControlLabel value="Active" onChange={onChange} control={<Radio size="small" />} label="Active" />

                        <FormControlLabel value="Inactive" onChange={onChange} control={<Radio size="small" />} label="Inactive" />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            {responseData && (
              <DownloadResponse
                data={responseData}
                soId={soObj?.id || soObj?.offerLetterId}
                soObj={soObj}
                deleteFile={deleteFile}
                getAttachments={getAttachments}
              />
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            onClick={handleSubmit(onFormSubmit)}
            className={!isDirty ? classes.disabledButton : classes.button}
            disabled={!isDirty && !hasFilesUploaded}
          >
            {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />}
            Update
          </Button>
          <Button variant="contained" color="primary" onClick={handleCloseEdit}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {openAllotQar && <AllotQar loggedInUser={loggedInUser} onClose={() => setOpenAllotQar(false)} olDetails={soObj} />}

      {openAdd && (
        <AddLineItem
          onClose={() => setOpenAdd(false)}
          soObj={soObj}
          fetchRecords={() => {
            setCount((ps) => ps + 1);
          }}
        />
      )}
      {openPreview ? (
        soObj?.inoteTypeId == "2" ? (
          <FormVIPreview onClose={() => setOpenPreview(false)} soObj={soObj} />
        ) : (
          <INotePreview onClose={() => setOpenPreview(false)} soObj={soObj} />
        )
      ) : null}
      {/* <form onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <input
                ref={(refParam) => (attachmentsRef = refParam)}
                type="file"
                multiple
                style={{ display: "none" }}
                key={attachmentsInput}
                // value={qapInput}
                // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleAttachments}
              />
              <Button
                onClick={(e) => {
                  attachmentsRef.click();
                }}
                className={classes.browseBtn}
                variant="outlined"
                size="small"
              >
                Upload Attachments
              </Button>
              {selectedAttachment ? (
                selectedAttachment?.map((item, id) => (
                  <StyledMenuItem>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography variant="body2">{item?.name}</Typography>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        deleteFileAttachmnets(id);
                      }}
                    >
                      <Close fontSize="small" color="action" />
                    </IconButton>
                  </StyledMenuItem>
                ))
              ) : (
                <Typography
                  component={"span"}
                  variant="caption"
                  color="textSecondary"
                >
                  No file selected.
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <input
                ref={(refParam) => (fileInputRef = refParam)}
                type="file"
                multiple
                style={{ display: "none" }}
                key={fileInput}
                // value={qapInput}
                // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileInput}
              />
              <Button
                onClick={(e) => {
                  fileInputRef.click();
                }}
                className={classes.browseBtn}
                variant="outlined"
                size="small"
              >
                Upload Pre Inspection Reports
              </Button>
              {selectedFile ? (
                selectedFile?.map((item, id) => (
                  <StyledMenuItem>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography variant="body2">{item?.name}</Typography>
                      }
                    />
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
                <Typography
                  component={"span"}
                  variant="caption"
                  color="textSecondary"
                >
                  No file selected.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} style={{ paddingTop: "25px" }}>
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Status</FormLabel>
                    <RadioGroup row size="sm" value={value}>
                      <FormControlLabel
                        value="Active"
                        onChange={onChange}
                        control={<Radio size="small" />}
                        label="Active"
                      />
  
                      <FormControlLabel
                        value="Inactive"
                        onChange={onChange}
                        control={<Radio size="small" />}
                        label="Inactive"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          {responseData && (
            <DownloadResponse
              data={responseData}
              soId={soObj?.id}
              soObj={soObj}
              deleteFile={deleteFile}
              getAttachments={getAttachments}
            />
          )}
        </form> */}
      {/* <Grid item xs={12} style={{ padding: "25px" }}>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          onClick={handleSubmit(onFormSubmit)}
        >
          {loadingDraft && (
            <CircularProgress
              size={24}
              className={classes.buttonProgress}
              color="primary"
            />
          )}
          Update
        </Button>
        </Grid> */}
    </div>
  );
}

// export function VideoPlayer({ onClose, loggedInUser, olNumber, devId }) {
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [allVideo, setAllVideo] = useState({});

//   useEffect(() => {
//     const req = {
//       line_item_name: olNumber,
//       client_address: loggedInUser.username
//     };

//     // AxiosInstanceVideo.post("/fetch_saved_data", req)
//     //   .then(({ data }) => {
//     //     setAllVideo(data);
//     //   })
//     //   .catch(console.log);
//     AxiosInstanceVideo.post("/list_recordings", req)
//       .then(({ data }) => {
//         setAllVideo(data);
//       })
//       .catch(console.log);
//   }, [loggedInUser?.username]);

//   let url = "";

//   if (selectedVideo) {
//     const [line_item_name, site_address, time, date] = selectedVideo.split("+");

//     const params = {
//       line_item_name: line_item_name,
//       client_address: loggedInUser.username,
//       date,
//       site_address,
//       time,
//     };

//     const queryParams = new URLSearchParams(params).toString();
//     url = CV2_IP + "/replay?" + queryParams;
//   }

//   return (
//     <Dialog open maxWidth="md" fullWidth>
//       <DialogContent>
//         <div style={{ display: "flex", gap: 2, minHeight: 500 }}>
//           <VideoList allVideo={allVideo} setSelectedVideo={setSelectedVideo} selectedVideo={selectedVideo} />
//           <div style={{ flex: 1 }}>
//             {selectedVideo ? (
//               <ReactPlayer url={url} muted={true} playing controls width="100%" height="100%" />
//             ) : (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: 500,
//                   borderLeft: "1px solid lightgrey",
//                 }}
//               >
//                 No Video
//               </div>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//       <DialogActions>
//         <Button size="small" variant="outlined" color="secondary" onClick={onClose}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
export function VideoPlayer({ onClose, loggedInUser, olNumber, testId }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [allVideo, setAllVideo] = useState([]);
  const [allVideoInfo, setAllVideoInfo] = useState([]);

  useEffect(() => {
    AxiosInstanceVideo.get("list_recordings")
      .then(({ data }) => {
        console.log("list_recordings data:", data);
        setAllVideo(data || []);
      })
      .catch(console.log);

    axiosInstanceAte
      .get(`video/records?testId=${testId}`)
      .then(({ data }) => {
        console.log("video/records data:", data);
        setAllVideoInfo(data || []);
      })
      .catch(console.log);
  }, [testId]);

  // // Group videos under each record
  // const groupedVideos = useMemo(() => {
  //   return allVideoInfo.map((record) => {
  //     const videos = allVideo.filter((video) =>
  //       video.path.includes(record.path)
  //     );

  //     return {
  //       ...record,
  //       videos,
  //     };
  //   });
  // }, [allVideo, allVideoInfo]);

const groupedVideos = useMemo(() => {
  const usedVideos = new Set();

  return allVideoInfo
    .map((record) => {
      const recordDate = record.createdAt.split("_")[0];

      const videos = allVideo.filter((video, index) => {
        if (usedVideos.has(index)) return false;

        const match =
          video.path.includes(record.path) &&
          video.path.includes(`/${recordDate}/`);

        if (match) {
          usedVideos.add(index);
        }

        return match;
      });

      return {
        ...record,
        videos,
      };
    })
    .filter((record) => record.videos.length > 0);
}, [allVideo, allVideoInfo]);

  const videoUrl = selectedVideo
    ? `${CV2_IP}/video?path=${selectedVideo.path}`
    : "";

  return (
    <Dialog
      open
      maxWidth="lg"
      fullWidth
      onClose={onClose}
    >
      <DialogTitle>Video Recordings</DialogTitle>

      <DialogContent>
        <div
          style={{
            display: "flex",
            gap: 8,
            minHeight: 500,
          }}
        >
          {/* LEFT PANEL */}
          <div
            style={{
              width: 320,
              borderRight: "1px solid lightgrey",
              overflowY: "auto",
            }}
          >
            {groupedVideos.length === 0 ? (
              <div style={{ padding: 16 }}>No recordings found</div>
            ) : (
              groupedVideos.map((group) => (
                <div
                  key={group.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "10px",
                  }}
                >
                  {/* Timestamp */}
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#1976d2",
                      marginBottom: 8,
                    }}
                  >
                    {group.createdAt?.split("_")[0]}
                  </div>

                  {/* OL Number */}
                  <div
                    style={{
                      marginLeft: 15,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 500,
                        marginBottom: 6,
                      }}
                    >
                      {group.olNumber || group.sslipNum} ({group.devName || group.sslipDevName})
                    </div>

                    {/* Videos */}
                    {group.videos.length === 0 ? (
                      <div
                        style={{
                          marginLeft: 20,
                          color: "#999",
                          fontStyle: "italic",
                        }}
                      >
                        No videos
                      </div>
                    ) : (
                      group.videos.map((video) => (
                        <div
                          key={video.path}
                          onClick={() => setSelectedVideo(video)}
                          style={{
                            marginLeft: 20,
                            padding: "6px 8px",
                            cursor: "pointer",
                            borderRadius: 4,
                            background:
                              selectedVideo?.path === video.path
                                ? "#d3eaff"
                                : "transparent",
                          }}
                        >
                          {video.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* VIDEO PLAYER */}
          <div style={{ flex: 1 }}>
            {selectedVideo ? (
              <ReactPlayer
                url={videoUrl}
                playing
                controls
                width="100%"
                height="100%"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 500,
                }}
              >
                No Video Selected
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AllotQar({ onClose, loggedInUser, olDetails }) {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);

  // console.log(olDetails, "olDetails",  loggedInUser);

  function onSave() {
    let url = "allot/ol/allotForCrossCheck";
    let req = {
      id: 0,
      offerLetterId: olDetails.id,
      offerLetterName: olDetails.olNumber,
      allotedBy: loggedInUser.empId,
      allotedTo: selected,
      isDeligation: false,
    };

    if (loggedInUser.roleId === USER_ROLE_ID.ROLE_SQAO) {
      url = "allot/ol/allotForSurpriseCheck";
    }

    axiosInstanceTransaction
      .post(url, req)
      .then(({ data }) => {
        setSelected(null);
        onClose();
        toast.success("Saved successfully");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to save");
      });
  }

  useEffect(() => {
    axiosInstanceMaster("employee/getAllActiveEmpsByOrgId/" + loggedInUser?.empId + "/" + loggedInUser?.orgId)
      .then(({ data }) => {
        setList(data);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to get users");
      });
  }, [loggedInUser]);

  return (
    <Dialog open maxWidth="xs" fullWidth>
      <DialogTitle>Allot</DialogTitle>
      <DialogContent>
        <FormControl size="small">
          <Select
            native
            labelId="firm-select-label"
            id="firm-select"
            value={selected}
            variant="outlined"
            style={{ minWidth: 300 }}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select</option>

            {list.map((firm) => (
              <option key={firm.id} value={firm.id}>
                {firm.ename}
              </option>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="outlined" color="primary" onClick={onSave}>
          Submit
        </Button>

        <Button size="small" variant="outlined" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
