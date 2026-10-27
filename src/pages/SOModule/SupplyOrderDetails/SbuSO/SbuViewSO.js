/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
//material-ui
import { Card, CardContent, CardHeader, Dialog, Grid, ListItemText, MenuItem, Tooltip, Typography } from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { DialogTitle } from "Utils";
// import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";

//icons

import VisibilityIcon from "@material-ui/icons/Visibility";
import GetAppIcon from "@material-ui/icons/GetApp";

//color
import { teal } from "@material-ui/core/colors";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";

//redux

import TableComponent from "components/table";
import { ViewSoScrutiny } from "pages/Services/URLs";
import axiosInstanceTran from "pages/Services/AxiosInstanceTransaction";

//pages

//components
import ViewChecklistScrutiny from "pages/Enclosures/Enclosure1/Checklist1/ViewChecklistScrutiny";
import Button from "../../../../components/Button";
import { viewDocument } from "pages/HomePage/UserLogin";
import { PaperComponent } from "Utils/D3Tree";
import LineItemView from "pages/SOModule/LineItemsDetails/LineItemView";

const useStyles = makeStyles((theme) => ({
  browseBtnWrapper: {
    border: "1px solid",
    borderColor: teal[100],
    borderRadius: "4px",
    display: "inline-block",
    borderBlockStyle: "ridge",
    minWidth: 300,
  },
  browseBtnContainer: {
    display: "flex",
    alignItems: "center",
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
  autoComplete: {
    padding: "12px 8px 8px 4px",
  },
  browse: {
    padding: "12px 0px 8px 4px",
  },
  checkbox: {
    "& .MuiTypography-body1": {
      fontSize: "0.875rem",
    },
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

      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <Title>Amendments</Title>
        {data?.amendments?.length > 0 ? (
          data.amendments.map((el) => (
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
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
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
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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

export default function SbuViewSO({ open, setOpen, soObj }) {
  const classes = useStyles();

  const [openView, setOpenView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordsA, setRecordsA] = useState([]);
  const [recordsB, setRecordsB] = useState([]);
  const [recordsC, setRecordsC] = useState([]);
  const [records, setRecords] = useState({});

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
      .get(ViewSoScrutiny + soObj?.id)
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
    <Dialog open={open} maxWidth="lg" fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title305" {...props} />}>
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title305">
        SO/PO Details
        {/* <span style={{ color: "#4A4A4A" }}>SO/PO Details</span> */}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
            <Typography className={classes.text}>
              <span style={{ fontWeight: 400, color: "#4A4A4A" }}>SO/PO Number: </span>
              {soObj?.orderNo ? soObj.orderNo : "-"}
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
                      {records?.indenterName ? records.indenterName : "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Supplier : </span>
                      {records?.supplierName ? records.supplierName : "-"}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Consignee : </span>
                      {records?.consigneeName ? records.consigneeName : "-"}
                    </Typography>
                  </Grid> */}
                  <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Delivery Date : </span>
                      {records?.dd ? moment(records?.dd).format("DD-MM-YYYY") : "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Account Type : </span>
                      {records?.acctName ? records.acctName : "-"}
                    </Typography>
                  </Grid>

                  {/* <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>
                        Supply Type :{" "}
                      </span>
                      {records?.soTypeName ? records.soTypeName : "-"}
                    </Typography>
                  </Grid> */}
                  {/* <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>
                        INote Type:{" "}
                      </span>
                      {records?.inoteTypeName ? records.inoteTypeName : "-"}
                    </Typography>
                  </Grid> */}
                  <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>No. Of Line-Items : </span>
                      {records?.noOfItems ? records.noOfItems : "-"}
                    </Typography>
                  </Grid>

                  {/* <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>
                        Total Quantity :{" "}
                      </span>
                      {records?.totalQty ? records.totalQty : "-"}
                    </Typography>
                  </Grid> */}

                  <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>SO Description : </span>
                      {records?.description ? records.description : "-"}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>
                        Total Value :{" "}
                      </span>
                      {records?.value ? records.value : "-"}
                    </Typography>
                  </Grid> */}
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
                title={<Typography className={classes.heading}>Line Items Details</Typography>}
              />
              <cardContent>
                <LineItemView soId={soObj.id} />
              </cardContent>
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
                  {/* <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Lot Number : </span>
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Letter Date : </span>
                    </Typography>
                  </Grid> */}

                  {recordsC.length !== 0 ? (
                    <Grid item xs={12} align="center">
                      <TableComponent
                        isLoading={loading}
                        data={recordsC}
                        columns={columnsc}
                        title=""
                        // options={{ filtering: false, sorting: false }}
                      />
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
                  {/* <Grid item xs={4}>
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: 400, color: "#4A4A4A" }}>Any Amendments : </span>
                    </Typography>
                  </Grid> */}
                  {recordsB.length !== 0 ? (
                    <Grid item xs={12} align="center">
                      <TableComponent
                        isLoading={loading}
                        data={recordsB}
                        columns={columnsB}
                        title=""
                        // options={{ filtering: false, sorting: false }}
                      />
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
              {records && <DownloadResponse data={records} />}
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {/* <Button
          align="left"
          variant="contained"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={() => {
            setOpenView(true);
          }}
          type="submit">
          View Checklist Scrutiny
        </Button> */}

        <Button variant="contained" color="primary" onClick={() => setOpen(false)} type="submit">
          Close
        </Button>
      </DialogActions>
      <ViewChecklistScrutiny openView={openView} setOpenView={setOpenView} />
    </Dialog>
  );
}
