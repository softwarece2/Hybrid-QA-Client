/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { saveAs } from "file-saver";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

//material ui
import { Card, CardContent, CardHeader, Dialog, Grid, ListItemText, makeStyles, MenuItem, Tooltip, Typography } from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";

//icons
import VisibilityIcon from "@material-ui/icons/Visibility";

//component
import Button from "components/Button";
import TableComponent from "components/table/index";

import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { ViewSoScrutiny } from "pages/Services/URLs";
import axiosInstanceTran from "pages/Services/AxiosInstanceTransaction";
import { DialogTitle } from "Utils";
import { viewDocument } from "pages/HomePage/UserLogin";
import GetAppIcon from "@material-ui/icons/GetApp";
import { PaperComponent } from "Utils/D3Tree";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
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
  checkbox: {
    "& .MuiTypography-body1": {
      fontSize: "0.875rem",
    },
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

const DownloadResponse = ({ data }) => {
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
  console.log("erfhewuithweru", data);
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
      <Grid item xs={12} sm={6} md={6} lg={6} xl={2}>
        <Title>QAP</Title>
        {data?.qapFiles?.length > 0 ? (
          data.qapFiles.map((el) => (
            <StyledMenuItem
              style={{ padding: "0px 0px 0px 10px" }}
              // onClick={() => handlePdfView(el)}
            >
              <ListItemText disableTypography primary={<Typography variant="body2">{el.split("/").pop()}</Typography>} />
              <IconButton size="small" onClick={() => handlePdfView(el)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              <Tooltip title="Download File">
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDownload(el);
                  }}
                >
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          ))
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={2}>
        <Title>Drawings</Title>
        {data?.drawings?.length > 0 ? (
          data.drawings.map((el) => (
            <StyledMenuItem
              style={{ padding: "0px 0px 0px 10px" }}
              // onClick={() => handlePdfView(el)}
            >
              <ListItemText disableTypography primary={<Typography variant="body2">{el.split("/").pop()}</Typography>} />
              <IconButton size="small" onClick={() => handlePdfView(el)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              <Tooltip title="Download File">
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDownload(el);
                  }}
                >
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          ))
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={2}>
        <Title>ATP/PTP</Title>
        {data?.atpFiles?.length > 0 ? (
          data.atpFiles.map((el) => (
            <StyledMenuItem
              style={{ padding: "0px 0px 0px 10px" }}
              // onClick={() => handlePdfView(el)}
            >
              <ListItemText disableTypography primary={<Typography variant="body2">{el.split("/").pop()}</Typography>} />
              <IconButton size="small" onClick={() => handlePdfView(el)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              <Tooltip title="Download File">
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDownload(el);
                  }}
                >
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          ))
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={2}>
        <Title>PO & Amendments</Title>
        {data?.amendments?.length > 0 ? (
          data.amendments.map((el) => (
            <StyledMenuItem
              style={{ padding: "0px 0px 0px 10px" }}
              // onClick={() => handlePdfView(el)}
            >
              <ListItemText disableTypography primary={<Typography variant="body2">{el.split("/").pop()}</Typography>} />
              <IconButton size="small" onClick={() => handlePdfView(el)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              <Tooltip title="Download File">
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDownload(el);
                  }}
                >
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          ))
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={2}>
        <Title>Attachments</Title>
        {data?.attachments?.length > 0 ? (
          data.attachments.map((el) => (
            <StyledMenuItem
              style={{ padding: "0px 0px 0px 10px" }}
              //onClick={() => handlePdfView(el)}
            >
              <ListItemText disableTypography primary={<Typography variant="body2">{el.split("/").pop()}</Typography>} />
              <IconButton size="small" onClick={() => handlePdfView(el)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              <Tooltip title="Download File">
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDownload(el);
                  }}
                >
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          ))
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={2}>
        <Title>SO</Title>
        {data?.poFiles?.length > 0 ? (
          data.poFiles.map((el) => (
            <StyledMenuItem
              style={{ padding: "0px 0px 0px 10px" }}
              //onClick={() => handlePdfView(el)}
            >
              <ListItemText disableTypography primary={<Typography variant="body2">{el.split("/").pop()}</Typography>} />
              <IconButton size="small" onClick={() => handlePdfView(el)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              <Tooltip title="Download File">
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDownload(el);
                  }}
                >
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          ))
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

const ViewSOScrutiny = ({ id1 }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [recordsA, setRecordsA] = useState([]);
  const [recordsB, setRecordsB] = useState([]);
  const [recordsC, setRecordsC] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [records, setRecords] = useState({});
  const handleClose = () => {
    setOpen(false);
  };

  const [columnsA] = useState([
    {
      title: "Letter Number",
      field: "letterNo",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Letter Date",
      field: "letterDate",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "New DD",
      field: "newDdDate",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Remarks",
      field: "remarks",
      width: "auto",
      filtering: false,
      sorting: false,
    },
  ]);
  const [columnsB] = useState([
    {
      title: "Letter No",
      field: "letterNo",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Letter Date",
      field: "letterDate",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Subject",
      field: "subject",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Amendments",
      field: "amendments",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Amendments of",
      field: "amendmentsOf",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Remarks",
      field: "remarks",
      width: "auto",
      filtering: false,
      sorting: false,
    },
  ]);
  const [columnsc] = useState([
    {
      title: "Lot Number",
      field: "lotNo",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Letter Number",
      field: "ilLetterNo",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Letter Date",
      field: "ilLetterDate",
      width: "auto",
      filtering: false,
      sorting: false,
    },
  ]);

  const viewSo = () => {
    axiosInstanceT
      .get(ViewSoScrutiny + id1)
      .then(({ data }) => {
        console.log("data", data);
        setRecords(data);
        setRecordsA(
          data.ddExtensions.map((el, i) => ({
            ...el,

            letterNo: el?.letterNo,
            letterDate: el?.letterDate ? moment(el?.letterDate).format("DD-MM-yyyy") : "NA",
            newDdDate: el?.newDdDate ? moment(el?.newDdDate).format("DD-MM-yyyy") : "NA",
          }))
        );

        setRecordsB(
          data.amendmentsLetters.map((el, i) => ({
            ...el,

            letterNo: el?.letterNo,

            letterDate: el?.letterDate ? moment(el?.letterDate).format("DD-MM-yyyy") : "NA",
            newDdDate: el?.newDdDate ? moment(el?.newDdDate).format("DD-MM-yyyy") : "NA",
            subject: el?.subject,
            amendments: el.amendments,
            amendmentsOf: el?.amendmentsOf,
            remarks: el?.amendmentsOf,
          }))
        );
        setRecordsC(
          data.itemLots.map((e1, i) => ({
            ...e1,
            ilLetterDate: e1?.ilLetterDate ? moment(e1?.ilLetterDate).format("DD-MM-yyyy") : "",
            ilLetterNo: e1?.ilLetterNo,
            lotNo: e1?.lotNo,
          }))
        );

        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });

    setLoading(false);
    // setRecordsA([]);
  };
  useEffect(() => {
    viewSo();
  }, []);
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        // size="small"
        // className={classes.buttonImport}
        startIcon={<VisibilityIcon />}
        onClick={(e) => {
          setOpen(true);
          viewSo();
        }}
      >
        View SO/PO Details
      </Button>

      <Dialog open={open} maxWidth="lg" fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title56" {...props} />}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title56">
          View SO/PO Details
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.text}>
                <span style={{ fontWeight: 400, color: "#4A4A4A" }}>SO/PO Number: </span>
                {records?.orderNo}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.text}>
                <span style={{ fontWeight: 400, color: "#4A4A4A" }}> SO/PO Date: </span>
                {moment(records?.orderDate).format("DD-MM-YYYY")}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.text}>
                <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Receipt Date: </span>
                {moment(records?.receiptDate).format("DD-MM-YYYY")}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Card className={classes.card}>
                <CardHeader
                  className={classes.cardHeader}
                  style={{ textAlign: "left" }}
                  disableTypography
                  title={<Typography className={classes.heading}>SO/PO Details</Typography>}
                />

                <CardContent className={classes.cardContent}>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Indentor : </span>
                        {records?.indenterName}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Supplier : </span>
                        {records?.supplierName}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Consignee : </span>
                        {records?.consigneeName}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Supply Type : </span>
                        {records?.soTypeName}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>INote : </span>
                        {records?.inoteTypeName}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Total Items : </span>
                        {records?.noOfItems}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Delivery Date : </span>
                        {records?.dd ? moment(records?.dd).format("DD-MM-YYYY") : ""}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Total Quantity : </span>
                        {records?.totalQty}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Acct : </span>
                        {records?.acctName}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>SO Description : </span>
                        {records?.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Total Value : </span>
                        {records?.value}
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
                  title={<Typography className={classes.heading}>Item Lots</Typography>}
                />
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={3}>
                    {recordsC.length !== 0 ? (
                      <Grid item xs={12} align="center">
                        <TableComponent isLoading={loading} data={recordsC} columns={columnsc} title="" />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography align={"center"} className={classes.text}>
                          <span style={{ fontWeight: 400, color: "#4A4A4A" }}>No Records To Display</span>
                        </Typography>
                      </Grid>
                    )}
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
                  title={<Typography className={classes.heading}>Delivery Date Extension</Typography>}
                />
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={3}>
                    {recordsA.length !== 0 ? (
                      <Grid item xs={12} align="center">
                        <TableComponent isLoading={loading} data={recordsA} columns={columnsA} title="" />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography align={"center"} className={classes.text}>
                          {" "}
                          <span style={{ fontWeight: 400, color: "#4A4A4A" }}>No Records To Display</span>
                        </Typography>
                      </Grid>
                    )}
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
                  title={<Typography className={classes.heading}>Amendments</Typography>}
                />
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={3}>
                    {recordsB.length !== 0 ? (
                      <Grid item xs={12} align="center">
                        <TableComponent isLoading={loading} data={recordsB} columns={columnsB} title="" />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography align={"center"} className={classes.text}>
                          {" "}
                          <span style={{ fontWeight: 400, color: "#4A4A4A" }}>No Records To Display</span>
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
                {records && <DownloadResponse data={records} />}
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewSOScrutiny;
