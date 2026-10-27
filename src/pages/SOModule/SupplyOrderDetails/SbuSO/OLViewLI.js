/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";

//material ui
import { Grid, ListItemText, MenuItem, Tooltip, Typography } from "@material-ui/core";
// import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
//icons
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { toast } from "react-toastify";
// import { selectItem } from "../../../Redux/Actions/SelectTreeItem";

//color

//redux
import ActionButton from "components/ActionButton";

import TableComponent from "components/table";
import { useDispatch } from "react-redux";

import { viewDocument } from "pages/HomePage/UserLogin";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { getOlAttachmentsById } from "Redux/Actions/SupplyOrder/OLAction";
// import InspectionReportEntry from "../LineItemsDetails/InspectionReportEntry";
// import { FaiRound } from "../LineItemsDetails/Fai/Rounds";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { getLIById } from "pages/Services/URLs";
import LineItemLots from "pages/SOModule/LineItemsDetails/lineitem-lots";

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
    axiosInstanceTrans
      .get(url, {
        responseType: "blob",
      })
      .then(({ data }) => {
        viewDocument(data, url.split("/").pop());
      })
      .catch(() => toast.error("Failed to download, Please try again!"));
  }

  function handleDownload(url) {
    axiosInstanceTrans
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
        {/* <Typography
          align="center"
          style={{
            backgroundColor: "#7c7c7c",
            color: "white",
            marginTop: 8,
            fontSize: "0.875rem",
          }}
        >
          Uploaded Filess
        </Typography> */}
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ border: "1px solid #D5EDFC" }} align="center">
        {/* <Title>Attachments</Title> */}
        {data?.attachments?.length ? (
          data.attachments.map((el, idx) => {
            const fileName = el.split("/").pop(); // Extract the file name from the full path
            const parts = fileName.split("\t");
            const displayName = el.split("\t")[0]; // Split the file name by tab

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
            {/* No files found */}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ border: "1px solid #D5EDFC" }} align="center">
        {/* <Title>Pre Inspection Reports</Title> */}
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
            {/* No files found */}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ border: "1px solid #D5EDFC" }} align="center">
        {/* <Title>QAP</Title> */}
        {data?.qap?.length ? (
          data.qap.map((el, idx) => {
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
            {/* No files found */}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ border: "1px solid #D5EDFC" }} align="center">
        {/* <Title>Drawings</Title> */}
        {data?.drawings?.length ? (
          data.drawings.map((el, idx) => {
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
                {/* 
                
                
                to view PDF */}
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
            {/* No files found */}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ border: "1px solid #D5EDFC" }} align="center">
        {/* <Title>ATE/ATP </Title> */}
        {data?.ateAtp?.length ? (
          data.ateAtp.map((el, idx) => {
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
            {/* No files found */}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};
const columnsRegs = [
  { title: "Registration No.", field: "registerNo", width: "auto" },
  { title: "Status", field: "status", width: "auto" },
];

const OLViewLI = ({ data }) => {
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [responseData, setResponseData] = useState();

  const getAttachments = (id) => {
    dispatch(getOlAttachmentsById(id)).then((data) => {
      setResponseData(data);
    });
  };

  async function fetchLI() {
    if (data) {
      getAttachments(data?.id);
      setLoading(true);
      try {
        const { data: responseData } = await axiosInstance.get(getLIById + data?.id);
        setRecords(responseData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchLI();
  }, [data]);

  const [columns] = useState([
    { title: "Work Order No.", field: "saleOrderNo", width: "auto" },
    { title: "Line Item/ Indent Sl No.", field: "lineItemNo", width: "auto" },
    { title: "Material No./EP Code No.", field: "partNo", width: "auto" },
    { title: " Material Description", field: "materialDescription", width: "auto" },
    { title: "Ordered Qty", field: "orderQty", width: "auto" },
    // { title: "Offered Qty", field: "offeredQty", width: "auto" },
    { title: "Unit Cost", field: "unitCostStr", width: "auto" },
    { title: "Item Value", field: "itemValue", width: "auto" },
    {
      title: "Is Imported",
      field: "imported",
      width: "auto",
      render: (rowData) => (rowData?.imported ? "Yes" : "No"),
    },
    // { title: "Status", field: "status", width: "auto", filtering: false },
  ]);

  // const actions = [
  //   (rowData) => ({
  //     icon: () => (
  //       <Button
  //         size="small"
  //         variant="contained"
  //         color="secondary"
  //         onClick={() => dispatch(selectItem(<FaiRound ol={rowData} />))}
  //       >
  //         FAI
  //       </Button>
  //     ),
  //   }),

  // ];

  const detailPanel = [
    {
      tooltip: "View Reg No.",
      render: (rowData) => (
        <div
          style={{
            border: "1px solid #43A047",
            maxWidth: 1200,
            marginInline: "auto",
          }}
        >
          <LineItemLots selectedLineItem={rowData} disableActions />
        </div>
      ),
    },
  ];

  return (
    <>
      <TableComponent isLoading={loading} data={records} columns={columns} title="" detailPanel={detailPanel} />
      {responseData && <DownloadResponse data={responseData} />}
    </>
  );
};
export default OLViewLI;
