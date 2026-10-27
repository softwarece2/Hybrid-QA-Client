import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableHead,
  makeStyles,
  Paper,
  Tabs,
  Tab,
  FormControl,
  Select,
  TableCell,
  CircularProgress,
  TableRow,
  Tooltip,
  withStyles,
  Menu,
  MenuItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import logo from "assets/Images/sqae_logo.png";
//
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

import { formatToINR } from "Utils";
import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceRPT from "pages/Services/AxiosInstanceRpt";
import MonthWiseQA from "./MonthWiseQA";
import AutomatedProgress from "./AutomatedProgress";
import { toast } from "react-toastify";
import { Skeleton } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import SummaryDataTable from "pages/SummaryData/SummaryDataTable";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { MoreVert } from "@material-ui/icons";
import { CV2_IP, MCH_IP_ADDR, MCH_IP_CAM_ADDR, SOLARS_CAM } from "config.js";
import { TOGGLE_RI } from "Redux/Types";
import ReactPlayer from "react-player";
import VideoList from "pages/ATE/VideoList";
import AxiosInstanceVideo from "pages/Services/AxiosInstanceVideo";
import OLTable from "pages/Sslip/SSlipTable";
import FrequencyReport from "pages/run-ate-frequency/FrequencyReport";

export const StyledTableCell = withStyles({
  head: {
    backgroundColor: "aliceblue",
    // fontSize: "1rem",
    padding: "2px 8px",
  },
  body: {
    fontSize: 14,
    padding: "2px 8px",
  },
})(TableCell);

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 0,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  tabsRoot: {
    minHeight: 32,
    backgroundColor: theme.palette.grey[100],
    border: "1px solid lightgrey",
    borderRadius: 4,
  },
  tabRoot: {
    minHeight: 32,
    paddingInline: 16,
    margin: 0,

    color: theme.palette.primary.main,
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.light,
      color: "white",
    },
  },
  tabLabel: {
    fontSize: "0.75rem", // Optional: adjust text size to match the dense layout
  },
}));

const months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, index) => {
  const year = currentYear - index;
  return { label: year.toString(), value: year };
});

export default function FirmData() {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const classes = useStyles();
  const [cardView, setCardView] = useState(true);
  const [value, setValue] = useState(0);
  //
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [firmData, setFarmData] = useState([]);
  const [loadingFirm, setLoadingFarm] = useState(false);
  const isFirm = loggedInUser?.roleName === "Firm Admin";
  const orgTypeId = useSelector((store) => store.loggedInUser?.orgTypeId);

  // console.log(loggedInUser, "loggedInUser",firmData, singleFirm, loggedInUser?.roleName);

  useEffect(() => {
    setLoadingFarm(true);
    axiosInstanceTrans("dashFirm/getAllDashFirms")
      .then(({ data }) => {
        console.log(data, "data");
        setFarmData(data);
      })
      .catch(console.log)
      .finally(() => setLoadingFarm(false));
  }, [loggedInUser]);

  if (cardView) {
    return (
      <>
        <div
          style={{
            display: "grid",
            placeContent: isFirm ? undefined : "center",
            gridTemplateColumns: isFirm
              ? undefined
              : "repeat(auto-fit, minmax(400px, 1fr))",
            gap: 16,
          }}
        >
          {/* CARD */}
          {!isFirm ? (
            <div
              style={{
                border: "1px solid skyblue",
                borderRadius: 8,
                backgroundColor: "aliceblue",
                padding: 8,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                  gap: 16,
                }}
              >
                {loadingFirm &&
                  Array.from({ length: 6 }, (_, index) => index).map((e) => (
                    <Loader key={e} />
                  ))}

                {firmData.slice(0, 6).map((firm) => (
                  <FirmCard
                    loggedInUser={loggedInUser}
                    key={firm.orgId}
                    firm={firm}
                  />
                ))}
              </div>
              {/* CARD View Details */}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  {firmData.slice(6, 10).map((firm) => (
                    <FirmSmallCard
                      key={firm.orgId}
                      firm={firm}
                      setCardView={setCardView}
                    />
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Button
                  size="small"
                  onClick={() => setCardView(false)}
                  variant="outlined"
                  color="secondary"
                >
                  View Details
                </Button>
              </div>
            </div>
          ) : (
            <>
              {!loadingFirm ? (
                <FirmCard
                  isFirm={isFirm}
                  loggedInUser={loggedInUser}
                  firm={
                    firmData.find((f) => f.orgId === loggedInUser.orgId) || {}
                  }
                />
              ) : (
                <Loader />
              )}
            </>
          )}

          {/* CHART */}
          <div
            style={{
              border: "1px solid skyblue",
              borderRadius: 8,
              padding: 8,
              backgroundColor: "aliceblue",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Tabs
                value={value}
                indicatorColor="primary"
                TabIndicatorProps={{ style: { display: "none" } }}
                textColor="primary"
                onChange={(_, newValue) => setValue(newValue)}
                aria-label="disabled tabs example"
                classes={{
                  root: classes.tabsRoot,
                  indicator: classes.indicator,
                }}
              >
                <Tab
                  label="Month-wise QA"
                  classes={{
                    root: classes.tabRoot,
                    labelIcon: classes.tabLabel,
                  }}
                />
                <Tab
                  label="Month-wise SO"
                  classes={{
                    root: classes.tabRoot,
                    labelIcon: classes.tabLabel,
                  }}
                />
              </Tabs>
              <div>
                <FormControl
                  style={{ minWidth: 100, marginRight: 4 }}
                  variant="outlined"
                  size="small"
                >
                  {/* <Typography id="firm-select-label" color="primary">
                Year <span style={{ color: "red" }}>*</span>
              </Typography> */}
                  <Select
                    native
                    labelId="firm-select-label"
                    id="firm-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Select year</option>

                    {years.map((firm) => (
                      <option key={firm.label} value={firm.value}>
                        {firm.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  style={{ minWidth: 100, marginRight: 16 }}
                  variant="outlined"
                  size="small"
                >
                  {/* <Typography id="project-select-label" color="primary">
                Month <span style={{ color: "red" }}>*</span>
              </Typography> */}
                  <Select
                    native
                    labelId="project-select-label"
                    id="project-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Select Month</option>
                    {months.map((month) => (
                      <option key={month.label} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {value === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: isFirm ? "row" : "column",
                  justifyContent: "space-between",
                }}
              >
                <MonthWiseQA
                  type="QA"
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
                <AutomatedProgress
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: isFirm ? "row" : "column",
                  justifyContent: "space-between",
                }}
              >
                <MonthWiseQA
                  type="SO"
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
                <AutomatedProgress
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              </div>
            )}
          </div>
          {/* </Card> */}
        </div>

        {/* Project Wise Summarized information */}
        <Card style={{ marginBlock: 16 }}>
          <CardHeader
            className={classes.card}
            disableTypography
            title={
              <Typography variant="subtitle1" style={{ paddingLeft: 16 }}>
                Project Wise Summarized information
              </Typography>
            }
          />
          <div style={{ padding: 8 }}>
            <ProjectWiseSummarizedInformation />
          </div>
        </Card>
        <Card style={{ marginBlock: 16 }}>
          <CardHeader
            className={classes.card}
            disableTypography
            title={
              <Typography variant="subtitle1" style={{ paddingLeft: 16 }}>
                Highlights
              </Typography>
            }
          />
          <div
            style={{
              paddingInline: 16,
              paddingBlock: 8,
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            }}
          >
            {/* ===========QA========== */}
            <HighlightsCard title="QA" />

            {/* ===========INotes========== */}
            <HighlightsCard title="INotes" />

            {/* ===========SO========== */}
            <HighlightsCard title="SO" />
          </div>
        </Card>
      </>
    );
  }

  return (
    <FirmDetailsView
      setCardView={setCardView}
      firmData={firmData}
      FirmDetailsView={FirmDetailsView}
    />
  );
}

//Highlights CARD
function HighlightsCard({ title }) {
  const [state, setState] = useState({
    noOfSo: "",
    valueOfSo: "",
    noOfOl: "",
    valueOfOl: "",
    inoteCount: "",
    inoteAccepted: "",
  });

  useEffect(() => {
    if (title === "QA") {
      axiosInstanceRPT("olDashboard/getoldetails")
        .then(({ data }) => {
          setState((ps) => ({ ...ps, ...data }));
        })
        .catch(console.log);
    } else if (title === "SO") {
      axiosInstanceRPT("soDashboard/getsodetails")
        .then(({ data }) => {
          setState((ps) => ({ ...ps, ...data }));
        })
        .catch(console.log);
    } else if (title === "INotes") {
      axiosInstanceRPT("dashboard/Inotedetails")
        .then(({ data }) => {
          setState((ps) => ({ ...ps, ...data }));
        })
        .catch(console.log);
    }
  }, [title]);

  if (title === "QA") {
    return (
      <div style={{ border: "1px solid", borderColor: "aliceblue" }}>
        <Typography
          variant="body2"
          style={{ backgroundColor: "aliceblue", paddingLeft: 8 }}
        >
          {title}
        </Typography>
        <div style={{ padding: 8 }}>
          <Typography variant="body2">
            <FiberManualRecordIcon
              color="primary"
              style={{ marginBottom: -4 }}
              fontSize="small"
            />
            No. of items QA completed : <b>{state.noOfOl}</b>
          </Typography>
          <Typography variant="body2">
            <FiberManualRecordIcon
              color="primary"
              style={{ marginBottom: -4 }}
              fontSize="small"
            />
            values of QA completed:{" "}
            <Tooltip title={formatToINR(state.valueOfOl, true)}>
              <b>{formatToINR(state.valueOfOl)}</b>
            </Tooltip>
          </Typography>
        </div>
      </div>
    );
  }

  if (title === "INotes") {
    return (
      <div style={{ border: "1px solid", borderColor: "aliceblue" }}>
        <Typography
          variant="body2"
          style={{ backgroundColor: "aliceblue", paddingLeft: 8 }}
        >
          {title}
        </Typography>
        <div style={{ padding: 8 }}>
          <Typography variant="body2">
            <FiberManualRecordIcon
              color="primary"
              style={{ marginBottom: -4 }}
              fontSize="small"
            />
            Count of I-Note Generated : <b>{state.inoteCount}</b>
          </Typography>
          <Typography variant="body2">
            <FiberManualRecordIcon
              color="primary"
              style={{ marginBottom: -4 }}
              fontSize="small"
            />
            value for Accepted and Rejected I-Notes: &nbsp;
            <Tooltip title={formatToINR(state.inoteAccepted, true)}>
              <b>{formatToINR(state.inoteAccepted)}</b>
            </Tooltip>
          </Typography>
        </div>
      </div>
    );
  }

  if (title === "SO") {
    return (
      <div style={{ border: "1px solid", borderColor: "aliceblue" }}>
        <Typography
          variant="body2"
          style={{ backgroundColor: "aliceblue", paddingLeft: 8 }}
        >
          {title}
        </Typography>
        <div style={{ padding: 8 }}>
          <Typography variant="body2">
            <FiberManualRecordIcon
              color="primary"
              style={{ marginBottom: -4 }}
              fontSize="small"
            />
            No. of SO completed : <b>{state.noOfSo}</b>
          </Typography>
          <Typography variant="body2">
            <FiberManualRecordIcon
              color="primary"
              style={{ marginBottom: -4 }}
              fontSize="small"
            />
            values of SO completed:{" "}
            <Tooltip title={formatToINR(state.valueOfSo, true)}>
              <b>{formatToINR(state.valueOfSo)}</b>
            </Tooltip>
          </Typography>
        </div>
      </div>
    );
  }

  return null;
}

//=======================================Project Wise Summarized information ===============================
function ProjectWiseSummarizedInformation() {
  const [loading, setLoading] = useState(false);

  const [firms, setFirms] = useState([]);
  const [selectedFirm, setSelectedFirm] = useState("");

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [projectDetails, setProjectDetails] = useState([]);

  const handleSearch = () => {
    if (!selectedProject) {
      toast.error("please fill required field");
      return;
    }

    setLoading(true);
    axiosInstanceTrans("project/getProjectSummaryByPoId/" + selectedProject)
      .then(({ data }) => {
        setProjectDetails(data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    axiosInstance("organization/getAllFirms")
      .then(({ data }) => {
        setFirms(data || []);
      })
      .catch(console.log);
  }, []);

  // console.log(projectDetails, "projectDetails");

  useEffect(() => {
    if (selectedFirm) {
      axiosInstanceTrans("project/getAllByFirmId/" + selectedFirm)
        .then(({ data }) => {
          setProjects(data);
        })
        .catch(console.log);
    } else {
      setProjects([]);
    }
  }, [selectedFirm]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <FormControl style={{ minWidth: 300 }} variant="outlined" size="small">
          {/* <Typography id="firm-select-label" color="primary">
            Firm <span style={{ color: "red" }}>*</span>
          </Typography> */}
          {/* {firmId: 245, firmNm: "BEML, Bengaluru"} */}

          <Select
            native
            labelId="firm-select-label"
            // variant="outlined"
            id="firm-select"
            value={selectedFirm}
            onChange={(e) => setSelectedFirm(e.target.value)}
          >
            <option value="">Select Firm</option>

            {firms?.map((firm) => (
              <option key={firm.firmId} value={firm.firmId}>
                {firm.firmNm}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 300 }} variant="outlined" size="small">
          {/* <Typography id="project-select-label" color="primary">
            Project <span style={{ color: "red" }}>*</span>
          </Typography> */}
          <Select
            native
            labelId="project-select-label"
            id="project-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Select Project</option>
            <option value={-1}>All</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button
          onClick={handleSearch}
          disabled={loading}
          variant="contained"
          color="primary"
          size="small"
        >
          {loading && <CircularProgress size={24} />} Search
        </Button>
      </div>

      <Table
        size="small"
        stickyHeader
        style={{ borderLeft: "1px solid lightgrey", marginTop: 16 }}
      >
        <TableHead>
          <TableRow>
            <StyledTableCell>OPA</StyledTableCell>
            <StyledTableCell>Project Value</StyledTableCell>
            <StyledTableCell>Alert</StyledTableCell>
            <StyledTableCell>Total Line Items</StyledTableCell>
            <StyledTableCell>Total Tests</StyledTableCell>
            <StyledTableCell>Test Through Ind 4.0(Nos)</StyledTableCell>
            <StyledTableCell>Current Lot</StyledTableCell>
            <StyledTableCell>QACL Nos</StyledTableCell>
            <StyledTableCell>No. Of RFR</StyledTableCell>
            <StyledTableCell>Value Of Quality Cleared</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projectDetails?.map((r, i) => (
            <TableRow key={i}>
              <StyledTableCell>{r.opa}</StyledTableCell>
              <StyledTableCell>{r.prVal}</StyledTableCell>
              <StyledTableCell>{r.alert ? "yes" : "No"}</StyledTableCell>
              <StyledTableCell>{r.totalLineItems}</StyledTableCell>
              <StyledTableCell>{r.valTtlTe}</StyledTableCell>
              <StyledTableCell>{r.testThrInd}</StyledTableCell>
              <StyledTableCell>{r.valCLot}</StyledTableCell>
              <StyledTableCell>{r.qaclNo}</StyledTableCell>
              <StyledTableCell>{r.nuRfr}</StyledTableCell>
              <StyledTableCell>{r.valClQty}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

//========================================TABLE VIEW==============================================
function FirmDetailsView({ setCardView, firmData, loggedInUser }) {
  return (
    <>
      <Button
        onClick={() => setCardView(true)}
        variant="contained"
        size="small"
        color="secondary"
      >
        Back
      </Button>
      <div
        style={{
          border: "1px solid skyblue",
          borderRadius: 8,
          backgroundColor: "aliceblue",
          padding: 16,
          marginTop: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: 16,
          }}
        >
          {firmData.map((firm) => (
            <FirmCard
              loggedInUser={loggedInUser}
              key={firm.orgId}
              firm={firm}
            />
          ))}
        </div>
      </div>
    </>
  );
}

//=========================================CARD===================================================
function FirmCard({ firm, loggedInUser, isFirm }) {
  return (
    <Paper style={{ borderRadius: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // paddingBottom: 8,
          backgroundColor: "#a7ddf5",
          paddingInline: 8,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <img
          src={(firm.logo && "data:image/png;base64," + firm.logo) || logo}
          alt="firmLogo"
          height={40}
        />
        {!isFirm ? (
          <Typography
            variant="subtitle1"
            style={{ color: "#1a546e", display: "flex" }}
            component="span"
          >
            <b>{firm.orgName}</b>
            <DropDown firm={firm} loggedInUser={loggedInUser} />
          </Typography>
        ) : (
          <>
            <b>{firm.orgName}</b>
            <DropDown firm={firm} loggedInUser={loggedInUser} />
          </>
        )}
      </div>
      <div style={{ padding: 16 }}>
        <Typography variant="subtitle2" style={{ lineHeight: 2.0 }}>
          Project Name : <b>{firm.projName}</b>
        </Typography>

        <Typography variant="subtitle2" style={{ lineHeight: 2.0 }}>
          Total QA completed : <b>{firm.countOl || "--"}</b>
        </Typography>

        <Typography variant="subtitle2" style={{ lineHeight: 2.0 }}>
          Success Rate :{" "}
          <b style={{ color: "green" }}> {firm.successRate || "--"} %</b>
        </Typography>
      </div>
    </Paper>
  );
}

//========================================SMALL CARD==============================================
function FirmSmallCard({ firm, setCardView }) {
  return (
    <Paper style={{ backgroundColor: "#a7ddf5", color: "#1a546e" }}>
      <div
        onClick={() => setCardView(false)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          paddingInline: 8,
        }}
      >
        {/* <img src={firm.logo} alt="firmLogo" height={60} /> */}

        <img
          src={(firm.logo && "data:image/png;base64," + firm.logo) || logo}
          alt="firmLogo"
          height={40}
        />

        <Typography variant="subtitle1">
          <b>{firm.orgName}</b>
        </Typography>
      </div>
    </Paper>
  );
}

// =====================================LOADER==================================================
function Loader() {
  return (
    <div>
      <Skeleton variant="circle" width={40} height={40} />
      <Skeleton variant="rect" width={310} height={118} />
    </div>
  );
}

const StyledMenu = withStyles({
  paper: {
    border: "1px solid lightgrey",
    // padding: 0,
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    paddingBlock: 0,
    paddingInline: 4,
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function DropDown({ firm, loggedInUser }) {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openSavedVideo, setOpenVidePlayer] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {openSavedVideo && (
        <VideoPlayer
          onClose={() => setOpenVidePlayer(false)}
          loggedInUser={loggedInUser}
        />
      )}

      <IconButton
        size="small"
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert
          color="secondary"
          style={{ backgroundColor: "whitesmoke", borderRadius: 100 }}
        />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ disablePadding: true }}
        // classes={{paper:{}}}
      >
        {firm.orgId === 248 && (
          <StyledMenuItem>
            <ListItemText
              primaryTypographyProps={{ variant: "body2" }}
              primary="All Tests"
              onClick={() => window.open(MCH_IP_ADDR, "OpenWikipediaWindow")}
            />
          </StyledMenuItem>
        )}

        <StyledMenuItem>
          <ListItemText
            primaryTypographyProps={{ variant: "body2" }}
            primary={firm.orgId !== 247 ? "Summary Data" : "Frequency Feed"}
            onClick={() =>
              dispatch(selectItem(<SummaryDataTable main firm={firm} />))
            }
          />
        </StyledMenuItem>

        <StyledMenuItem>
          <ListItemText
            primaryTypographyProps={{ variant: "body2" }}
            primary={firm.orgId === 247 ? "Report" : "Video"}
            onClick={() => {
              if (firm.orgId === 248) {
                window.open(MCH_IP_CAM_ADDR, "OpenWikipediaWindow");
              } else if (firm.orgId === 253) {
                window.open(SOLARS_CAM, "OpenWikipediaWindow");
              } else if (firm.orgId === 247) {
                dispatch(selectItem(<FrequencyReport />));
              } else {
                dispatch({ type: TOGGLE_RI });
              }
              handleClose();
            }}
          />
        </StyledMenuItem>

        {firm.orgId !== 248 && (
          <StyledMenuItem>
            <ListItemText
              primaryTypographyProps={{ variant: "body2" }}
              primary="Saved Videos"
              onClick={() => {
                setOpenVidePlayer(true);
                handleClose();
              }}
            />
          </StyledMenuItem>
        )}

        {firm.orgId !== 248 &&
          firm.orgId !== 247 &&
          loggedInUser?.roleName !== "Inspector" && (
            <StyledMenuItem>
              <ListItemText
                primaryTypographyProps={{ variant: "body2" }}
                primary="ATE"
              />
            </StyledMenuItem>
          )}
        <StyledMenuItem>
          <ListItemText
            primaryTypographyProps={{ variant: "body2" }}
            onClick={() => dispatch(selectItem(<OLTable />))}
            primary="OL"
          />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}

function VideoPlayer({ onClose, loggedInUser }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [allVideo, setAllVideo] = useState({});

  useEffect(() => {
    const req = {
      client_address: loggedInUser.username,
    };

    AxiosInstanceVideo.post("/fetch_saved_data", req)
      .then(({ data }) => {
        setAllVideo(data);
      })
      .catch(console.log);
  }, [loggedInUser.username]);

  let url = "";

  if (selectedVideo) {
    const [site_address, time, date] = selectedVideo.split("_");

    const params = {
      client_address: loggedInUser.username,
      date,
      site_address,
      time,
    };

    const queryParams = new URLSearchParams(params).toString();
    url = CV2_IP + "/replay?" + queryParams;
  }

  console.log(url);

  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogContent>
        <div style={{ display: "flex", gap: 2, minHeight: 500 }}>
          <VideoList
            allVideo={allVideo}
            setSelectedVideo={setSelectedVideo}
            selectedVideo={selectedVideo}
          />
          <div style={{ flex: 1 }}>
            {selectedVideo ? (
              <ReactPlayer
                url={url}
                muted={true}
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
                  borderLeft: "1px solid lightgrey",
                }}
              >
                No Video
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
