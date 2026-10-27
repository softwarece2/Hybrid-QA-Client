import { saveAs } from "file-saver";
import { useEffect, useState } from "react";

import { Grid, ListItemText, MenuItem, Tooltip, Typography, Button, makeStyles, Chip, Dialog, DialogContent } from "@material-ui/core";
// import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { DEPARTMENT_ID, ORG_TYPE, USER_ROLE_ID } from "../../../Globals";
//icons
import { Delete } from "@material-ui/icons";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { toast } from "react-toastify";

//color

//redux
import ActionButton from "components/ActionButton";
import Active from "components/Active";

import InActive from "components/InActive";
import TableComponent from "components/table";
import { useDispatch, useSelector } from "react-redux";
import OLView from "./OLView";
import { viewDocument } from "pages/HomePage/UserLogin";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { getOlAttachmentsById } from "Redux/Actions/SupplyOrder/OLAction";

import { getLineItemsBySslipId } from "Redux/Actions/Sslip/SslipAction";

import OLLineItemDelete from "./OL_LineItemDelete";
import NewOLAllotTests from "pages/Testt/TestReport";
// import InspectionReportEntry from "../LineItemsDetails/InspectionReportEntry";
import { PaperComponent } from "Utils/D3Tree";
import WebCam from "meet";
import { DialogTitle } from "Utils";
import EditLineItem from "./EditLineItem";
import VideoInspection from "video/cv2";
import DraggableCompose from "widget/dragablePopper";
import Widget from "widget";
import { getAlInspectOL } from "Redux/Actions/SupplyOrder/SOAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import SampleSelection from "pages/QACLScrutiny/SampleSelection";
import { useStyles } from "pages/SummaryData/TCL-AVADI";
import FaiSamples from "pages/QACLScrutiny/OtherSample";
import { OPEN_RI } from "Redux/Types";


export const useStylesChip = makeStyles((theme) => ({
  /* Status.css */
  status: {
    borderRadius: 2,
    display: "inline-block",
    color: "orange",
    fontSize: 14,
    fontWeight: 600,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  Success: {
    backgroundColor: "#a8e6cf", // Pale Green
    color: "#274930", // Dark Forest Green
  },
  Error: {
    backgroundColor: "#f2d7d5", // Light Red
    color: "#493021", // Dark Maroon
  },
  Warning: {
    backgroundColor: "#fff2cc", //  Pale Yellow
    color: "orange", // Dark Brownish-Orange
  },
  Info: {
    backgroundColor: "#cce2ff", //  Very Light Blue
    color: "#2b5b88", //  Dark Navy
  },
  Primary: {
    backgroundColor: "#d0e8ff", //Light Blue
    color: "#1a4372", // Dark Blue
  },
  Default: {
    backgroundColor: "#e9ecef", // Light Gray
    color: "#343a40", // Dark Gray
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
      {/* <Grid xs={12}>
        <Typography
          align="center"
          style={{
            backgroundColor: "#7c7c7c",
            color: "white",
            marginTop: 8,
            fontSize: "0.875rem",
          }}
        >
          Uploaded Files
        </Typography>
      </Grid> */}

      <Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ border: "1px solid #D5EDFC" }} align="center">
        {/* <Title>Attachments</Title> */}
        {data?.attachments?.length ? (
          data.attachments.map((el, idx) => {
            const fileName = el.split("/").pop(); // Extract the file name from the full path
            const parts = fileName.split("\t");
            const displayName = el.split("\t")[0]; // Split the file name by tab

            return (
              <StyledMenuItem key={idx} style={{ padding: "0px 0px 0px 10px", color: "black" }}>
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
                        <Typography variant="body2" style={{ textAlign: "right", color: "black" }}>
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
              <StyledMenuItem key={idx} style={{ padding: "0px 0px 0px 10px", color: "black" }}>
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
                        <Typography variant="body2" style={{ textAlign: "right", color: "black" }}>
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
              <StyledMenuItem key={idx} style={{ padding: "0px 0px 0px 10px", color: "black" }}>
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
                        <Typography variant="body2" style={{ textAlign: "right", color: "black" }}>
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
              <StyledMenuItem key={idx} style={{ padding: "0px 0px 0px 10px", color: "black" }}>
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
                        <Typography variant="body2" style={{ textAlign: "right", color: "black" }}>
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
              <StyledMenuItem key={idx} style={{ padding: "0px 0px 0px 10px", color: "black" }}>
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
                        <Typography variant="body2" style={{ textAlign: "right", color: "black" }}>
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

export function RegistrationStatusChips({ status}) {
  const classes = useStylesChip();
  const statusColors = {
    accepted: "Success",
    Pass: "Success",
    pass: "Success",
    rejected: "Error",
    rfr: "Error",
    pending: "Warning",
    "in-process": "Warning",
    Fail: "Error",
    fail: "Error",
  };
  const statusClass = statusColors[status] || "Default";
  return <Chip size="small" className={`${classes.status} ${classes[statusClass]}`} label={status} />;
}

const OLViewLI = ({ data, count, olCycle,IsOl,isSample,isqacl}) => {
  const dispatch = useDispatch();
  const classes = useStylesChip();
  const [records, setRecords] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [responseData, setResponseData] = useState();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const roleId = loggedInUser?.roleId;
  const orgTypeId = loggedInUser?.orgTypeId;
  const departmentId = loggedInUser?.departmentId;

  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState(null);
  const [openCam, setOpenCam] = useState(false);
  const getAttachments = (id) => {
    dispatch(getOlAttachmentsById(id)).then((data) => {
      setResponseData(data);
    });
  };
  const Records = records.map(e=>e.registrationNo)

console.log("testttt",Records);
  const getLineItemsBySslipId1 = () => {
   getLineItemsBySslipId(data?.id || data?.offerLetterId).then((res) => {
      const data = res?.map((item) => ({
        ...item,
        imported: item?.imported ? "Yes" : "No",
        status: item?.status === "Active" ? <Active /> : item?.status === "Inactive" ? <InActive /> : null,
      }));
      setRecords(data);
    });
  };

  const getOlLineitems = (id) => {
    dispatch(getAlInspectOL(id)).then((res) => {
      const data = res?.map((item) => ({
        ...item,
        imported: item?.imported ? "Yes" : "No",
        status: item?.status === "Active" ? <Active /> : item?.status === "Inactive" ? <InActive /> : null,
      }));
      setRecords(data);
    });
  };
 

console.log(records.registrationNo,"recordssss")
console.log("data(soObj)",data);
// const olNum = (loggedInUser.orgTypeId ===  ORG_TYPE.QA_AGENCY)? data?.name: data?.olNumber;
  const handleOpenLI = () => {
   
    getAttachments(data?.id || data?.offerLetterId)
    
    getOlLineitems(data?.id || data?.offerLetterId);
    getLineItemsBySslipId1(data?.id || data?.offerLetterId)
  };
  useEffect(() => {
    handleOpenLI();
  }, [data, count]);

  const [columns] = useState([
    { title: "Line Item/ Indent Sl No.", field: "soLineItemNo", width: "auto" },
      { title: "Group", field: "itemCategoryName", width: "auto" },
    { title: "EP Code.", field: "partNo", width: "auto" },
      
    { title: " Material Description", field: "materialDescription", width: "auto" },
    { title: "Offered Qty", field: "offeredQty", width: "auto" },
    { title: "Unit Cost", field: "unitCostStr", width: "auto" },
    loggedInUser.orgTypeId ===  ORG_TYPE.QA_AGENCY
   ?(
    { title: "Sample Selected", field: "sampleSelectedCount", width: "auto" }
    ):null,
     loggedInUser.orgTypeId ===  ORG_TYPE.QA_AGENCY
   ?(
    { title: "Sample Tested ", field: "testedSampleCount", width: "auto" }
        ):null,
        loggedInUser.orgTypeId ===  ORG_TYPE.QA_AGENCY
   ?(
    { title: "Other Sample Selected ", field: "faiSampleSelectedCount", width: "auto" }
     ):null,
     loggedInUser.orgTypeId ===  ORG_TYPE.QA_AGENCY
   ?(
    { title: "Other Sample Tested ", field: "testedFaiSampleCount", width: "auto" }
          ):null,    
    loggedInUser.roleId ===  USER_ROLE_ID.ROLE_INSPECTOR ||
     loggedInUser.roleId ===  USER_ROLE_ID.ROLE_DC ||
                loggedInUser.roleId === USER_ROLE_ID.ROLE_AC ||
                loggedInUser.roleId === USER_ROLE_ID.ROLE_DAC ||
                loggedInUser.roleId === USER_ROLE_ID.ROLE_AE||
                loggedInUser.roleId === USER_ROLE_ID.ROLE_JE ||  loggedInUser.roleId === USER_ROLE_ID.ROLE_DO?(
    {
      title: "Sample Selection",
      field: "",
      width: "auto",
      filtering: true,
      sorting: false,
      render: (rowData) => (
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          onClick={() => {
            dispatch(selectItem(<SampleSelection olNum={{...data, soLineItemNo:rowData?.soLineItemNo}} rowData={rowData} records={records} isqacl={isqacl} />));
          }}
    
        >
          Sample  Selection
        </Button>
      ),
        
      tooltip: "Sample Selection",
    
    }
  
  ):null,
  loggedInUser.roleId ===  USER_ROLE_ID.ROLE_INSPECTOR ||
     loggedInUser.roleId ===  USER_ROLE_ID.ROLE_DC ||
                loggedInUser.roleId === USER_ROLE_ID.ROLE_AC ||
                loggedInUser.roleId === USER_ROLE_ID.ROLE_DAC ||
                loggedInUser.roleId === USER_ROLE_ID.ROLE_AE||
                loggedInUser.roleId === USER_ROLE_ID.ROLE_JE || loggedInUser.roleId === USER_ROLE_ID.ROLE_DO ?(
     {
      title: "Other Samples",
      field: "",
      width: "auto",
      filtering: true,
      sorting: false,
      render: (rowData) => (
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          disabled={rowData.registrationNo===3}
          onClick={() => { 
            dispatch(selectItem(<FaiSamples rowData={rowData} isqacl={isqacl} olNum={{...data}} />));
          }}
    
        >
        Other Samples
        </Button>
      ),
        
      tooltip: "Sample Selection",
    
    }
  ):null
  ]);
  

  const actions = [
    (rowData) => ({
      icon: () => (
        <Button
        disabled={true}
          size="small"
          style={{
            backgroundColor: "grey",
            color: "white",
            minWidth: 100,
          }}
          variant="contained"
          onClick={() => {                     
            if(orgTypeId === ORG_TYPE.QA_AGENCY){
              setOpenCam(true);
              setSelectedLineItem(rowData);
            }else{
              //TODO: check the rowData 
              dispatch({ type: OPEN_RI, olNumber:data.olNumber, lineItemNo: rowData?.soLineItemNo, devId: rowData.devId, testId:rowData.testId, productId:rowData.productId,  testName:rowData.testName  });

            }
          }}
        >
          Video Cam
        </Button>
      ),
      // hidden: departmentId !== USER_DEPARTMENT.QC,
    }),
  
    {
      icon: () => (
        <IconButton size="small" color="secondary" variant="contained" onClick={() => {}}>
          <Delete />
        </IconButton>
      ),
      tooltip: "Delete",
      onClick: (_, rowData) => {
        console.log("===", rowData);
        setOpenDelete(true);
        setSelectedLineItem(rowData);
      },
      hidden: !((roleId === USER_ROLE_ID?.ROLE_HOS || roleId === USER_ROLE_ID?.ROLE_GIC) && departmentId === DEPARTMENT_ID.ASSEMBLY),
    },
  ];

  const detailPanel = [
    {
      tooltip: "View Reg No.",
      render: (rowData) => (
        <div
          style={{
            border: "1px solid lightgrey",
            maxWidth: 800,
            marginInline: "auto",
          }}
        >
          <RegistraTionViewDetailPanel ol={rowData} olNum={data} IsOl={IsOl}/>
        </div>
      ),
    },
  ];

  return (
    <>
    
      {openDialog && <OLView openDialog={openDialog} setOpenDialog={setOpenDialog} id={data?.id || data?.offerLetterId} />}

      {openCam && (
        <Dialog open maxWidth={"lg"} fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title14" {...props} />}>
          <DialogTitle id="draggable-dialog-title14" onClose={() => setOpenCam(false)} style={{ cursor: "move" }}>
            Video Cam
          </DialogTitle>
          <DialogContent>
            <WebCam rowData={selectedLineItem} olNumber={data?.olNumber} />
          </DialogContent>
        </Dialog>
      )}

      <OLLineItemDelete open={openDelete} onClose={() => setOpenDelete(false)} dataVal={selectedLineItem} fetchRecords={handleOpenLI} />

      {openEdit && (
        <EditLineItem onClose={() => setOpenEdit(false)} soObj={data} selectedLineItem={selectedLineItem} fetchRecords={handleOpenLI} />
      )}

      <TableComponent
        // isLoading={loading}
        data={records}
        columns={columns}
        title=""
        actions={olCycle ? undefined : undefined}
        detailPanel={detailPanel}
        options={{ filtering: false }}
      />
      {responseData && <DownloadResponse data={responseData} />}

      {/* <Grid item xs={12} align="center" style={{ padding: "20px" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          Print Preview
        </Button>
      </Grid> */}
    </>
  );
};
export default OLViewLI;

function RegistraTionViewDetailPanel({ ol,IsOl,olNum }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [loadingRegNo, setLoadingRegNo] = useState(false);
  const [regNos, setRregNos] = useState([]);
  const [openDlg, setOpenDlg] = useState(false);
  const [rowData, setRowData] = useState({});
  const [qcTest,setQcTest] = useState(false)
  const hasAccessToAdd = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY;
const roleId = loggedInUser?.roleId===USER_ROLE_ID.ROLE_DC

const regNoss = regNos.map((e) => e.registrationNo); 
console.log(regNoss,"regNoss")
  const columnsRegs = [
    { title: "Registration No.", field: "serialNo", width: "auto",render: (rowdata) => rowdata.registrationNo === 3 ? "N/A" : rowdata.serialNo },
    hasAccessToAdd
      ? { title: "QA Status", field: "qaStatus", width: "auto", render: (rowData) => <RegistrationStatusChips status={rowData.status} /> }
      : {
          title: "Status",
          field: "finalStatus",
          width: "auto",
          render: (rowData) => <RegistrationStatusChips status={rowData.finalStatus} />,
        },
    //  loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY  && {
    //     title: "QC Status",
    //     field: "status",
    //     width: "auto",
    //     render: (rowData) => <RegistrationStatusChips status={rowData.status} />,
    //   },
  ];
  console.log("olNum Ol View Li", olNum)
const Do = loggedInUser?.roleId === USER_ROLE_ID?.ROLE_DO
  const actions = [
(loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY || Do) ? {
      icon: () => (
        <ActionButton size="small" color="primary" variant="contained" obs={"tmr"} startIcon={<VisibilityIcon />}>
          QATest
        </ActionButton>
      ),
      tooltip: "View Tests",
      onClick: (_, rowData) => {
        setOpenDlg(true);
        setRowData(rowData);
      },
    }:{
      icon: () => (
        <ActionButton size="small" color="primary" variant="contained" obs={"tmr"} startIcon={<VisibilityIcon />}>
          QCTest
        </ActionButton>
      ),
      tooltip: "View Tests",
      onClick: (_, rowData) => {
        setOpenDlg(true);
        setRowData(rowData);
      },
    },
    (loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY || Do) ? 
        {
      icon: () => (
        <ActionButton size="small" color="primary" variant="contained" obs={"tmr"} startIcon={<VisibilityIcon />}>
         QCTest
        </ActionButton>
      ),
      tooltip: "View Tests",
      onClick: (_, rowData) => {
        setQcTest(true);
        setOpenDlg(true);
        setRowData(rowData);
      },
    }:null
  ];
  const test = ol?.id;

const fetchRegistrationNumbers = async () => {
  setLoadingRegNo(true);
  try {
    const endpoint = hasAccessToAdd || IsOl
      ? `registration-numbers/getByOlLineItemId/${ol?.id}`
      : `subSlip/subSlipLineItem/${ol?.id}/registers`;

    const { data } = await axiosInstanceTrans(endpoint);
    setRregNos(data);
  } catch (error) {
    console.error("Error fetching registration numbers:", error);
  } finally {
    setLoadingRegNo(false);
  }
};
useEffect(() => {
  fetchRegistrationNumbers();
  }, [ol,ORG_TYPE.FIRM]); 
  return (
    <>
    
      {openDlg && <NewOLAllotTests   olNum={olNum} open={openDlg} setOpen={setOpenDlg} regNo={rowData} ol={ol} qcTest={qcTest} setQcTest={setQcTest} registers={fetchRegistrationNumbers} IsOl={IsOl} />}

      <TableComponent
        isLoading={loadingRegNo}
        data={regNos}
        columns={columnsRegs}
        title=""
        actions={actions}
        options={{ filtering: false, detailPanelType: "single" }}
      />
    </>
  );
}





