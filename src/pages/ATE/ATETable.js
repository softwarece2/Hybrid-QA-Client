import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TableComponent from "components/table/index";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReactPlayer from "react-player";
import { GetApp } from "@material-ui/icons";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import { StyledTableRow, StyledTableCell } from "components/UseTable";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceMaster from "pages/Services/AxiosInstance";
import { toast } from "react-toastify";
import { getOlATE } from "pages/Services/URLs";
import { getTestsByLineItemsId } from "Redux/Actions/SupplyOrder/LIAction";
import VideoList from "./VideoList";
import ColdTest from "excel-upload/ColdTest";
import SightPeriScope from "pages/SightPeriScope";

// import TestResult from "pages/gear-box-test/TestResult";
import { DialogTitle } from "Utils";
const columns = [
  {
    title: "Line Item No",
    field: "lineItemNo",
    width: "auto",
  },
  {
    title: "Tests",
    field: "test_name",
    width: "auto",
    filtering: false,
    render: (rowData) => (
      <div>{rowData.testDtos.map((el) => el.testname).toString()} </div>
    ),
  },
];
const applicableTestIds = [15, 16, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30, 31, 32, 33, 34];
export default function ATETable() {
  const olId = useSelector((store) => store.inspectOLReducer.inspectOlId);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function fetchATE(id) {
      setLoading(true);
      axiosInstanceMaster
        .get(getOlATE + id)
        .then(({ data }) => {
          setRecords(data);
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => setLoading(false));
    }

    if (olId) {
      fetchATE(olId);
    }
  }, [olId]);

  const detailPanel = useMemo(() => {
    return [
      {
        tooltip: "Show Details",
        render: (rowData) => {
          return (
            <div
              style={{
                maxWidth: 1400,
                marginInline: "auto",
              }}
            >
              <ViewTMR selectedRow={rowData} />
            </div>
          );
        },
      },
    ];
  }, []);

  return (
    <TableComponent
      isLoading={loading}
      columns={columns}
      data={records}
      detailPanel={detailPanel}
      options={{ detailPanelType: "single" }}
      // options={{ ...defaultOptions,}}
      title=""
    />
  );
}

const TMRInitaial = {
  leakTestResultDtos: [],
  resultDtos: [],
  photogrammetryDtos: [],
};

function ViewTMR({ selectedRow }) {
  const [records, setRecords] = useState([]);
  const [recordsTMR, setTMRRecords] = useState(TMRInitaial);
  const [testId, setTestId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTestRow, setSelectedTestRow] = useState(false);
  const [openTestVideo, setOpenTestVideo] = useState(false);
  const [selectedTestVideo, setSelectedTestVideo] = useState(null);
  const [openTMRIOL, setOpenTMRIOL] = useState(false);

  const handleDownload = async (name, url) => {
    if (url) {
      const config = {
        method: "GET",
        url: url,
        responseType: "arraybuffer",
      };
      try {
        const response = await axiosInstance(config);
        const outputFilename = `${name || "document"}`;
        const url = URL.createObjectURL(new Blob([response.data]));

        if (response.data.byteLength !== 0) {
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", outputFilename);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          toast.info("Data Not Found");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to Download");
      }
      setLoading(false);
    } else {
      toast.error("Missing Download Path");
    }
  };

  function getLeakTestRecord(test) {
    setTestId(test.applicableTestId);
    setSelectedTestRow(test);
    setLoading(true);
    axiosInstance("tmrResult/viewTmr/" + test.applicableTestId)
      .then(({ data }) => {
        setTMRRecords({
          leakTestResultDtos: data.leakTestResultDtos || [],
          resultDtos: data.resultDtos || [],
          photogrammetryDtos: data.photogrammetryDtos || [],
        });
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getTestsByLineItemsId(selectedRow.ollineItemId)
      .then((data) => {
        setRecords(data || []);
      })
      .catch(console.log);
  }, [selectedRow]);

  const handleCloseTestVideo = () => {
    setOpenTestVideo(false);
    setSelectedTestVideo(null);
  };

  return (
    <>
      {/* Attached Files */}
      {Object.entries(selectedRow?.firmAttachmentURLs || {})?.map(
        ([key, value]) => (
          <React.Fragment key={value}>
            <ListItem
              style={{
                width: 220,
                wordBreak: "keep-all",
                whiteSpace: "nowrap",
              }}
            >
              <ListItemText
                disableTypography
                onClick={() => {
                  handleDownload(key, value);
                }}
                primary={
                  <Typography
                    variant="body2"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={key}
                  >
                    {key}
                  </Typography>
                }
              />
              <IconButton
                size="small"
                onClick={() => {
                  handleDownload(key, value);
                }}
              >
                <GetApp />
              </IconButton>
            </ListItem>
          </React.Fragment>
        )
      )}

      {/* Attached Files */}
      {Object.entries(selectedRow?.inspectorAttachmentURLs || {})?.map(
        ([key, value]) => (
          <React.Fragment key={value}>
            <ListItem
              style={{
                width: 220,
                wordBreak: "keep-all",
                whiteSpace: "nowrap",
              }}
            >
              <ListItemText
                disableTypography
                onClick={() => {
                  handleDownload(key, value);
                }}
                primary={
                  <Typography
                    variant="body2"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={key}
                  >
                    {key}
                  </Typography>
                }
              />
              <IconButton
                size="small"
                onClick={() => {
                  handleDownload(key, value);
                }}
              >
                <GetApp />
              </IconButton>
            </ListItem>
          </React.Fragment>
        )
      )}

      {openTMRIOL && (
        <TMRIol
          selectedUploadRow={selectedTestRow}
          setOpenTMRIOL={setOpenTMRIOL}
          rowData={{ id: selectedRow.ollineItemId, isView: true }}
        />
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ width: 100 }}>Sl.No</StyledTableCell>
              <StyledTableCell>Applicable Test</StyledTableCell>
              <StyledTableCell>Remarks</StyledTableCell>
              <StyledTableCell align="center">Attachments</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records?.applicableTestDtos ? (
              records.applicableTestDtos.map((test, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{test?.testName}</StyledTableCell>
                  <StyledTableCell>{test?.remarks || "NA"}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        if (applicableTestIds.includes(test.applicableTestId)) {
                          setSelectedTestRow(test);
                          setOpenTMRIOL(true);
                        } else {
                          getLeakTestRecord(test);
                        }
                      }}
                    >
                      View TMR
                    </Button>
                    &nbsp;
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      // onClick={() => {
                      //   setOpenTestVideo(true);
                      //   setSelectedTestRow(test);
                      // }}
                      // disabled={!test?.videoFileLinks}
                    >
                      Test Videos
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  No Record To display
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <TMRReport
          loading={loading}
          id={testId}
          recordsTMR={recordsTMR}
          row={selectedTestRow}
        />
        <ManualTMR loading={loading} recordsTMR={recordsTMR.resultDtos} />
      </div>
      <Dialog
        open={openTestVideo}
        onClose={handleCloseTestVideo}
        maxWidth="md"
        fullWidth
      >
        <DialogContent style={{ minHeight: 500 }}>
          <Grid container spacing={1} justifyContent="space-between">
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <VideoList
                linkList={selectedTestRow?.videoFileLinks}
                setSelectedTestVideo={setSelectedTestVideo}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
              <ReactPlayer
                url={selectedTestVideo || ""}
                muted={true}
                playing
                controls
                width="100%"
                height="100%"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleCloseTestVideo}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function TMRIol({ setOpenTMRIOL, selectedUploadRow, rowData }) {

  const renderContent = () => {
    if (!selectedUploadRow) return null;

    switch (selectedUploadRow.applicableTestId) {
      case 15:
      case 16:
        return (
          <ColdTest
            isHotTest={selectedUploadRow.applicableTestId === 16}
            selectedUploadRow={selectedUploadRow}
            rowData={rowData}
          />
        );
      case 19:
      case 27:
      case 28:
        return <SightPeriScope selectedUploadRow={selectedUploadRow} rowData={rowData} />;
      case 26:
      case 29:
      case 30:
        return <SightPeriScope selectedUploadRow={selectedUploadRow} rowData={rowData} final />;
      
      default:
        return <Typography align="center">TMR upload of the {selectedUploadRow.testName} is under progress</Typography>;
    }
  };

  return (
    <Dialog open={true} maxWidth="lg" fullWidth>
      <DialogTitle id="draggable-dialog-title14" onClose={() => setOpenTMRIOL(false)} style={{ cursor: "move" }}>
        {selectedUploadRow?.testName}
      </DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
}

function TMRReport({ loading, id, recordsTMR, row }) {
  const handleExport = () => {
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: [300, 297] });
    doc.text(`TMR Of ${row?.testName}`, 300 / 2 - 25, 10);
    autoTable(doc, {
      html: "#tmr",
      useCss: true,
      startY: 15,
      margin: 0,
      bodyStyles: { overflow: "linebreak" },
    });
    doc.save("TMR-TEST-SUMMARY.pdf");
  };
  if (id === 5) {
    return (
      <>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExport}
          size="small"
          startIcon={<GetAppOutlinedIcon />}
          style={{ maxWidth: "200px", marginLeft: "auto", marginTop: "10px" }}
        >
          Export to Pdf
        </Button>
        <Table
          size="small"
          stickyHeader
          id="tmr"
          style={{ borderLeft: "1px solid lightgrey", marginTop: 12 }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Test Name</StyledTableCell>
              <StyledTableCell>Comp Type</StyledTableCell>
              <StyledTableCell>Lo</StyledTableCell>
              <StyledTableCell>Result</StyledTableCell>
              <StyledTableCell>Hi</StyledTableCell>
              <StyledTableCell>Units</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <StyledTableCell colSpan={11} style={{ padding: 0 }}>
                {loading && <LinearProgress />}
              </StyledTableCell>
            </TableRow>
            {recordsTMR.leakTestResultDtos.slice(0, -3).map((r, i) => (
              <TableRow key={i}>
                <StyledTableCell>{r.testName}</StyledTableCell>
                <StyledTableCell>{r.compType}</StyledTableCell>
                <StyledTableCell>{r.lo}</StyledTableCell>
                <StyledTableCell>{r.result}</StyledTableCell>
                <StyledTableCell>{r.hi}</StyledTableCell>
                <StyledTableCell>{r.units}</StyledTableCell>
                <StyledTableCell>{r.status}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }

  if (id === 4) {
    return (
      <>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExport}
          size="small"
          startIcon={<GetAppOutlinedIcon />}
          style={{ maxWidth: "200px", marginLeft: "auto", marginTop: "10px" }}
        >
          Export to Pdf
        </Button>
        <Table
          size="small"
          stickyHeader
          style={{ borderLeft: "1px solid lightgrey", marginTop: 12 }}
          id="tmr"
        >
          <TableHead>
            {/* <TableRow>
        <StyledTableCell colSpan={11} align="center">
          <b>Vector Group</b>
          <br />
          <b>A:: VG: nodecoded.txt</b>
        </StyledTableCell>
      </TableRow> */}
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell colSpan={3} align="center">
                <b>Begin</b>
              </StyledTableCell>
              <StyledTableCell colSpan={3} align="center">
                <b>End</b>
              </StyledTableCell>
              <StyledTableCell colSpan={3} align="center">
                <b>Delta</b>
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>X1(mm)</StyledTableCell>
              <StyledTableCell>Y1(mm)</StyledTableCell>
              <StyledTableCell>Z1(mm)</StyledTableCell>

              <StyledTableCell>X2(mm)</StyledTableCell>
              <StyledTableCell>Y2(mm)</StyledTableCell>
              <StyledTableCell>Z2(mm)</StyledTableCell>

              <StyledTableCell>dX(mm)</StyledTableCell>
              <StyledTableCell>dY(mm)</StyledTableCell>
              <StyledTableCell>dz(mm)</StyledTableCell>
              <StyledTableCell>Mag(mm)</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <StyledTableCell colSpan={11} style={{ padding: 0 }}>
                {loading && <LinearProgress />}
              </StyledTableCell>
            </TableRow>
            {recordsTMR.photogrammetryDtos.map((r, i) => (
              <TableRow key={i}>
                <StyledTableCell>{r.name}</StyledTableCell>
                <StyledTableCell>{r.beginX1}</StyledTableCell>
                <StyledTableCell>{r.beginY1}</StyledTableCell>
                <StyledTableCell>{r.beginZ1}</StyledTableCell>
                <StyledTableCell>{r.endX2}</StyledTableCell>
                <StyledTableCell>{r.endY2}</StyledTableCell>
                <StyledTableCell>{r.endZ2}</StyledTableCell>
                <StyledTableCell>{r.deltaDx}</StyledTableCell>
                <StyledTableCell>{r.deltaDy}</StyledTableCell>
                <StyledTableCell>{r.deltaDz}</StyledTableCell>
                <StyledTableCell>{r.mag}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }

  if (!id) {
    return <Typography align="center">No Test Selected</Typography>;
  }

  return <Typography align="center">No Upload TMR found!</Typography>;
}

function ManualTMR({ recordsTMR, loading }) {
  console.log("---", recordsTMR);

  return (
    <table style={{ borderCollapse: "collapse", marginTop: 20 }}>
      <thead>
        <tr>
          <td
            style={{
              border: "1px solid grey",
              padding: "6px 12px",
              color: "white",
              backgroundColor: "#205375",
            }}
          >
            Parameter
          </td>
          <td
            style={{
              border: "1px solid grey",
              padding: "6px 12px",
              color: "white",
              backgroundColor: "#205375",
            }}
          >
            Excepted O/P
          </td>
          <td
            style={{
              border: "1px solid grey",
              padding: "6px 12px",
              color: "white",
              backgroundColor: "#205375",
            }}
          >
            Observed O/P
          </td>
          <td
            style={{
              border: "1px solid grey",
              padding: "6px 12px",
              color: "white",
              backgroundColor: "#205375",
            }}
          >
            Test Result
          </td>

          <td
            style={{
              border: "1px solid grey",
              padding: "6px 12px",
              color: "white",
              backgroundColor: "#205375",
            }}
          >
            Remarks
          </td>
        </tr>
      </thead>
      <tbody>
        <td colSpan={10}>{loading && <LinearProgress />}</td>
        {recordsTMR.map((item) => (
          <tr key={item.id}>
            <td
              style={{
                border: "1px solid grey",
                padding: "6px 12px",
              }}
            >
              {item.parameter}
            </td>
            <td
              style={{
                border: "1px solid grey",
                padding: "6px 12px",
              }}
            >
              {item.expectedMin}
            </td>
            <td
              style={{
                border: "1px solid grey",
                padding: "6px 12px",
              }}
            >
              {item.expectedMax}
            </td>
            <td
              style={{
                border: "1px solid grey",
                padding: "6px 12px",
              }}
            >
              {item.result}
            </td>
            <td
              style={{
                border: "1px solid grey",
                padding: "6px 12px",
              }}
            >
              {item.inspAgencyRemarks}
            </td>
          </tr>
        ))}
        {recordsTMR.length === 0 && (
          <tr>
            <td colSpan={6} align="center">
              No Manual TMR records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
