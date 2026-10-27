/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";

//material ui
import { Card, CardContent, CardHeader, Dialog, Grid, ListItemText, makeStyles, MenuItem, Tooltip, Typography } from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
// import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { WING_ID } from "../../../Globals";

//icons
import VisibilityIcon from "@material-ui/icons/Visibility";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Close } from "@material-ui/icons";
import PublishIcon from "@material-ui/icons/Publish";

//redux
import Active from "components/Active";
import moment from "moment";
import Button from "components/Button";
import InActive from "components/InActive";
import TableComponent from "components/table";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { getAttachmentByOlIds, uploadTmrPdf } from "pages/Services/URLs";
import { useDispatch, useSelector } from "react-redux";
import { getInspectOL } from "Redux/Actions/Inspect/InspectOLAction";
import { getLIdetails } from "Redux/Actions/SupplyOrder/SOAction";
import axiosInstanceTran from "pages/Services/AxiosInstanceTransaction";
import ActionButton from "components/ActionButton";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { teal } from "@material-ui/core/colors";
import { DialogTitle } from "Utils";

import { viewDocument } from "pages/HomePage/UserLogin";
import { PaperComponent } from "Utils/D3Tree";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  checkbox: {
    fontWeight: "bold",
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  heading: {
    fontSize: "0.875rem",
    fontWeight: 400,
  },
  text: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: theme.palette.secondary.main,
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
}));

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
        backgroundColor: "#b3e5fc",
        fontWeight: 500,
        fontFamily: "sans-serif",
        borderRadius: "0 0 12px 12px",
        fontSize: "0.875rem",
      }}
    >
      {children}
    </Typography>
  );
}
const DownloadResponse = ({ url }) => {
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

  return (
    <Grid container spacing={0}>
      <Grid xs={4}>
        <Typography align="center" style={{ backgroundColor: "#205375", color: "white", marginTop: 8 }}>
          Uploaded TMR
        </Typography>
        {url && <button onClick={() => handleDownload(url)}>{url.split("/").pop()}</button>}
      </Grid>
    </Grid>
  );
};
const DownloadFile = ({ data }) => {
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
  return (
    <Grid container spacing={0}>
      <Grid xs={12}>
        <Typography
          align="center"
          style={{
            backgroundColor: "#205375",
            color: "white",
            marginTop: 8,
            fontSize: "0.875rem",
          }}
        >
          Uploaded Files
        </Typography>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={6} xl={6} style={{ border: "1px solid 	#D5EDFC" }}>
        <Title>Attachments</Title>
        {data?.attachments?.length ? (
          data.attachments.map((el) => {
            const fileName = el.split("/").pop(); // Extract the file name from the full path
            const parts = fileName.split("\t");
            const displayName = el.split("\t")[0];

            return (
              <StyledMenuItem style={{ padding: "0px 0px 0px 10px" }}>
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
                />

                <IconButton size="small" onClick={() => handlePdfView(displayName)}>
                  <VisibilityIcon color="primary" />
                </IconButton>

                <Tooltip title="Download File">
                  <IconButton size="small" onClick={() => handleDownload(displayName)}>
                    <GetAppIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </StyledMenuItem>
            );
          })
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={6} style={{ border: "1px solid 	#D5EDFC" }}>
        <Title>Pre Inspection Reports</Title>
        {data?.preInspectionReports?.length ? (
          data.preInspectionReports.map((el, idx) => {
            const fileName = el.split("/").pop(); // Extract file name
            const parts = fileName.split("\t"); // Split file name by tab
            const displayName = el.split("\t")[0];
            return (
              <StyledMenuItem key={idx} style={{ padding: "0px 0px 0px 10px" }}>
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
                />
                {/* Button to view PDF */}
                <IconButton size="small" onClick={() => handlePdfView(displayName)}>
                  <VisibilityIcon color="primary" />
                </IconButton>
                {/* Button to download file */}
                <Tooltip title="Download File">
                  <IconButton size="small" onClick={() => handleDownload(displayName)}>
                    <GetAppIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </StyledMenuItem>
            );
          })
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

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

const schema = yup.object().shape({});
const defaultValues = {};

const InspectionViewOL = ({ open, setOpen, data, olIds }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(false);
  const [olLineItemId, setOlLineItemId] = useState(null);
  const [openTMR, setOpenTMR] = useState(false);
  const [updatedTmrUrl, setUpdatedTmrUrl] = useState(null);
  const [responseData, setResponseData] = useState();

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  getInspectOL();

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseTMR = () => {
    setOpenTMR(false);
  };

  const [columns] = useState([
    {
      title: "Line Item/ Indent Sl No.",
      field: "lineItemNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Material No./EP Code No.",
      field: "partNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Material Description",
      field: "description",
      width: "auto",
      sorting: true,
    },
    { title: "UoM", field: "uomName", width: "auto" },
    { title: "Unit Price", field: "unitCostStr", width: "auto" },
    { title: "Item Category", field: "itemCategoryName", width: "auto" },
    { title: "Total Qty", field: "orderQty", width: "auto" },
    { title: "Remaining Qty", field: "remainingQty", width: "auto" },

    { title: "GCS", field: "gcs", width: "auto" },
    { title: "Self Certification", field: "selfCertification", width: "auto" },
    { title: "GEM", field: "gem", width: "auto" },
    { title: "Is Imported", field: "imported", width: "auto" },
    { title: "Download", field: "download", width: "auto", filtering: false },
    { title: "Upload", field: "upload", width: "auto", filtering: false },
    { title: "Actions", field: "actions", width: "auto", filtering: false },
  ]);

  const { handleSubmit } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  function handleDownload(url) {
    console.log("url", url);
    axiosInstanceTran
      .get(url, {
        responseType: "blob",
      })
      .then(({ data }) => {
        saveAs(data, url.split("/").pop());
      })
      .catch(() => toast.error("Failed to download, Please try again!"));
  }

  const handleFileInput = (e) => {
    fileInputRef.click();
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  console.log(selectedFile, "tjyrtjyrtjs");

  const fetchLI = () => {
    setLoading(true);
    dispatch(getLIdetails(olIds))
      .then((data) => {
        setRecords(
          data.map((item, i) => {
            console.log("el", item);
            return {
              ...item,
              lineItemNo: item?.soLineItemNo,
              partNo: item?.partNo,
              description: item?.description,
              unitCostStr: item?.unitCostStr,
              account: item?.account,
              orderQty: item?.orderQty,
              underWarrantyStr: item?.underWarrantyStr,
              duration: item?.duration,
              actions: item?.actions,
              warrantyStr: item?.warrantyStr,
              itemCategoryName: item?.itemCategoryName,
              gem: item?.gem,
              gcs: item?.gcs,
              imported: item?.imported ? "Yes" : "No",
              selfCertification: item?.selfCertification,
              status: item?.status === "Active" ? <Active /> : item?.status === "Inactive" ? <InActive /> : null,
              download: (
                <ActionButton
                  size="small"
                  color="primary"
                  variant="contained"
                  startIcon={<GetAppIcon />}
                  disabled={item?.tmrFileUrl == null ? true : false}
                  // disabled={(el?.tmrFileUrl === null)}
                  onClick={(el) => {
                    handleDownload(item.tmrFileUrl);
                    console.log("");
                  }}
                >
                  TMR
                </ActionButton>
              ),
              upload: (
                <ActionButton
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<PublishIcon />}
                  onClick={(e) => {
                    setOpenTMR(true);
                    setOlLineItemId(item?.id);
                    setUpdatedTmrUrl(item?.updatedTmrFileUrl);
                  }}
                >
                  TMR
                </ActionButton>
              ),
            };
          })
        );
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });

    setLoading(false);
    setRecords([]);
  };

  const onFormSubmit = () => {
    if (!selectedFile) {
      toast.error("Please select a file before submitting.");
      return;
    }
    const formData = new FormData();
    formData.append(
      "olLineItemStr",
      JSON.stringify({
        id: olLineItemId,
      })
    );
    formData.append("tmrFile", selectedFile);

    console.log(selectedFile, "tmrFile");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axiosInstanceTran
      .post(uploadTmrPdf, formData, config)
      .then(({ data }) => {
        console.log("file upload res", data);
        // setResponseData(data);
        setSelectedFile(null);

        // setStatus(data.statusVal);
        if (data !== "null") {
          toast.success("TMR uploaded successfully");
          setOpen(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      // .catch((err) => console.log("Error in uploading Supply Order attachments", err));
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  const getAttachments = (id) => {
    const queryString = olIds?.map((id) => `olIds=${id}`).join("&");
    axiosInstance
      .get(`${getAttachmentByOlIds}?${queryString}`)
      .then(({ data }) => {
        setResponseData(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    open && fetchLI();
    getAttachments(data?.id);
  }, []);

  return (
    <>
      <Dialog open={open} maxWidth="xl" fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title84" {...props} />}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title84" onClose={handleClose}>
          View {isArmy ? "QACL" : "Offering Letter"} Details
        </DialogTitle>

        <DialogContent dividers>
          <Grid
            container
            spacing={2}
            // justifyContent="center"
            // alignItems="center"
          >
            <Grid item xs={12}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    root: classes.cardHeader,
                    title: classes.cardTitle,
                  }}
                  style={{ textAlign: "left" }}
                  disableTypography
                  title={<Typography className={classes.heading}>{isArmy ? "QACL" : "OL"} Details</Typography>}
                />
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>{isArmy ? "QACL" : "OL"} Number : </span>
                        {data?.olNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>{isArmy ? "QACL" : "OL"} Date : </span>
                        {moment(data?.olDate).format("DD-MM-yyyy")}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <CardHeader
                  classes={{
                    root: classes.cardHeader,
                    title: classes.cardTitle,
                  }}
                  style={{ textAlign: "left" }}
                  disableTypography
                  title={<Typography className={classes.heading}>SO/PO Details</Typography>}
                />
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>SO Number : </span>
                        {data?.supplyOrderNo}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>SO Date : </span>
                        {moment(data?.supplyOrderDate).format("DD-MM-yyyy")}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Project Name : </span>
                        {data?.projectDescription}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Sales Group: </span>
                        {data?.salesGrpName}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <br />

          <Grid container spacing={0} alignItems="center">
            <Grid item xs={12} align="center">
              <TableComponent isLoading={loading} data={records} columns={columns} title="" />
              {responseData && <DownloadFile data={responseData} />}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Dialog open={openTMR} maxWidth="sm" fullWidth>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Upload TMR (in PDF)
          </DialogTitle>

          <DialogContent dividers>
            <Grid
              container
              spacing={2}
              // justifyContent="center"
              // alignItems="center"
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <input
                  ref={(refParam) => (fileInputRef = refParam)}
                  type="file"
                  style={{ display: "none" }}
                  accept=".pdf"
                  onChange={handleFileInput}
                />
                <Typography>
                  <Button
                    onClick={() => {
                      fileInputRef.click();
                    }}
                    className={classes.browseBtn}
                    variant="outlined"
                    size="small"
                  >
                    Upload TMR
                  </Button>
                  &nbsp;
                  {selectedFile ? (
                    <span> {selectedFile.name}</span>
                  ) : (
                    <Typography component={"span"} variant="caption" color="textSecondary">
                      No file selected.
                    </Typography>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedFile(null);
                    }}
                  >
                    <Close fontSize="small" color="action" />
                  </IconButton>
                </Typography>
              </Grid>
            </Grid>
            {updatedTmrUrl && <DownloadResponse url={updatedTmrUrl} />}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={handleSubmit(onFormSubmit)}>
              Submit
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCloseTMR}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
};

export default InspectionViewOL;
