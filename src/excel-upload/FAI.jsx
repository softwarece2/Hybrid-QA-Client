import { useEffect, useRef, useState } from "react";
import {
  LinearProgress,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import { useReactToPrint } from "react-to-print";
import { StyledTableCell, StyledTableRow } from "Utils";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { useSelector } from "react-redux";
import Button from "components/Button";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";

//  {0:'yes',1:'No'}
const useStyles = makeStyles((theme) => ({
  toggleSelection: {
    textTransform: "unset",
    color: "grey",
    "&.Mui-selected": {
      color: "black",
      backgroundColor: "#B1E9AF",
    },
  },
  root: {
    marginTop: "12px",
    "& :hover": {
      "&.Mui-selected": {
        color: "black",
        backgroundColor: "#B1E9AF",
      },
    },
  },
}));

export default function FAI({ selectedUploadRow }) {
  const classes = useStyles();
  const obj = useSelector((state) => state?.inspectOLReducer.inspectOlNumber);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState(null);

  const componentRef = useRef();

  function getLeakTestRecord() {
    setLoading(true);
    // TODO:--- remove static ID
    axiosInstanceIol("iolFai/getIolFaiByTestId/" + obj?.id)
      .then(({ data }) => {
        setRecords(data);
        console.log(data, "data");
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }

  // const getDevices = () => {
  //   axiosInstance("iolColdTest/getSubmittedDetailsByOlId/" + obj?.id)
  //     .then(({ data }) => {
  //       data?.forEach((el) => {
  //         if (!el.submmittedDate) {
  //           setRemarks((ps) => ({ ...ps, [`remarks-${el?.id}`]: el.remarks }));
  //           setStatusValue((ps) => ({ ...ps, [`status-${el?.id}`]: el.status + '' }));
  //         }

  //       });
  //       setTestedDevice(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toast.error("Failed to get data");
  //     });
  // };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    // getDevices();
    getLeakTestRecord();
  }, []);

  // const handleChange = (event) => {
  //   setStatusValue((ps) => ({
  //     ...ps,
  //     [event.target.name]: event.target.value,
  //   }));
  // };
  // const handleChangeRemark = (event) => {
  //   setRemarks((ps) => ({ ...ps, [event.target.name]: event.target.value }));
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const req = Object.keys(remarks).map((el) => ({
  //       id: +el.split("-")[1],
  //       remarks: remarks[`remarks-${el.split("-")[1]}`],
  //       status: +statusValue[`status-${el.split("-")[1]}`],
  //     }));
  //     const reqBody = { coldTestDtos: req };
  //     const data = await axiosInstance.post(
  //       "iolColdTest/submitColdTest",
  //       reqBody
  //     );
  //     toast.success("Successfully Submitted");
  //     getDevices()
  //   } catch (error) {
  //     console.log(error, "error");
  //   }
  // };
  // const handleTabChange = (event, value) => {
  //   if (value !== null) {
  //     setSelectedTab(value);
  //   }
  // };
  return (
    <div>
      {/* <ExcelUpload
        selectedUploadRow={selectedUploadRow}
        getRecord={getLeakTestRecord}
      /> */}
      {/* {testedDevice.length !== 0 &&
        <>
          <ToggleButtonGroup
            value={selectedTab}
            exclusive
            onChange={handleTabChange}
            size="small"
            className={classes.root}
          >
            <ToggleButton value="Not Submitted" aria-label="Not Submitted" className={classes.toggleSelection}>
              Not Submitted
            </ToggleButton>
            <ToggleButton value="Submitted" aria-label="Submitted" className={classes.toggleSelection}>
              Submitted
            </ToggleButton>
          </ToggleButtonGroup>
          {selectedTab === 'Not Submitted' ?
            <form onSubmit={handleSubmit}>
              <Table style={{ marginTop: "18px" }}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Device Name</StyledTableCell>
                    <StyledTableCell>Accept/Reject</StyledTableCell>
                    <StyledTableCell>Submitted Date</StyledTableCell>
                    <StyledTableCell>Remarks</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {testedDevice?.filter((el) => !el.submmittedDate)?.map((el) => (
                    <StyledTableRow key={el.id}>
                      <StyledTableCell style={{ width: "20%" }}>
                        {el.deviceNo}
                      </StyledTableCell>
                      <StyledTableCell style={{ width: "20%" }}>
                        <RadioGroup
                          row
                          name={`status-${el?.id}`}
                          value={statusValue[`status-${el?.id}`]}
                          onChange={(e) => {
                            handleChange(e);
                          }}

                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio required />}
                            label="Accept"
                            disabled={el?.submmittedDate}
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio required />}
                            label="Reject"
                            disabled={el?.submmittedDate}
                          />
                        </RadioGroup>
                      </StyledTableCell>
                      <StyledTableCell style={{ width: "18%" }}>
                        {el?.submmittedDate || 'NA'}
                      </StyledTableCell>
                      <StyledTableCell>
                        <TextField
                          id="filled-basic"
                          variant="outlined"
                          size="small"
                          value={remarks[`remarks-${el?.id}`]}
                          placeholder="Remarks"
                          name={`remarks-${el?.id}`}
                          multiline

                          fullWidth
                          onChange={handleChangeRemark}
                          required
                          inputProps={{ maxLength: 500, readOnly: el?.submmittedDate }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  {testedDevice?.filter((el) => !el.submmittedDate).length === 0 &&
                    <StyledTableRow>
                      <StyledTableCell colSpan={4} align="center">
                        No Pending Test
                      </StyledTableCell>
                    </StyledTableRow>
                  }

                </TableBody>
              </Table>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginBlock: "12px",
                }}
              >

                <Button type="submit" variant="contained" color="secondary" disabled={testedDevice.filter((el) => !el.submmittedDate).length === 0}>
                  Submit
                </Button>

              </div>
            </form> : <Table style={{ marginTop: "18px" }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Device Name</StyledTableCell>
                  <StyledTableCell>Accept/Reject</StyledTableCell>
                  <StyledTableCell>Submitted Date</StyledTableCell>
                  <StyledTableCell>Remarks</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {testedDevice?.filter((el) => el.submmittedDate)?.map((el) => (
                  <StyledTableRow key={el.id}>
                    <StyledTableCell style={{ width: "20%" }}>
                      {el.deviceNo}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "15%" }}>
                      {el?.status === 1 ? 'Accepted' : el?.status === 0 ? 'Rejected' : 'N/A'}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "18%" }}>
                      {el?.submmittedDate || 'NA'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {el.remarks}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {testedDevice?.filter((el) => el.submmittedDate).length === 0 &&
                  <StyledTableRow>
                    <StyledTableCell colSpan={4} align="center">
                      No Record Test
                    </StyledTableCell>
                  </StyledTableRow>
                }
              </TableBody>
            </Table>}
        </>
      }
       */}
      <TableContainer>
        <Table
          size="small"
          ref={componentRef}
          style={{ border: "1px solid lightgrey",  }}
        >
          <TableHead>
            <StyledTableRow>
              <StyledTableCell
                rowSpan={records?.noOfDevice + 1}
                style={{ border: "1px solid white" }}
              >
                Param Code
              </StyledTableCell>
              <StyledTableCell
                rowSpan={records?.noOfDevice + 1}
                style={{ border: "1px solid white" }}
              >
                Main Type
              </StyledTableCell>
              <StyledTableCell
                rowSpan={records?.noOfDevice + 1}
                style={{ border: "1px solid white" }}
              >
                Parameter Type
              </StyledTableCell>
              <StyledTableCell
                rowSpan={records?.noOfDevice + 1}
                style={{ border: "1px solid white" }}
              >
                Parameter Description
              </StyledTableCell>
              <StyledTableCell
                rowSpan={records?.noOfDevice + 1}
                style={{ border: "1px solid white" }}
              >
                TY clause No.
              </StyledTableCell>
              <StyledTableCell
                rowSpan={records?.noOfDevice + 1}
                style={{ border: "1px solid white" }}
              >
                Min Val
              </StyledTableCell>
              <StyledTableCell
                rowSpan={records?.noOfDevice + 1}
                style={{ border: "1px solid white" }}
              >
                Max Val
              </StyledTableCell>
              <StyledTableCell
                rowSpan={records?.noOfDevice + 1}
                style={{ border: "1px solid white" }}
              >
                Unit
              </StyledTableCell>
              {records?.noOfDevice > 0 && (
                <StyledTableCell
                  colSpan={records?.noOfDevice + 1}
                  align="center"
                  style={{ border: "1px solid white" }}
                >
                  Observed Value
                </StyledTableCell>
              )}
            </StyledTableRow>
            <StyledTableRow>
              {records?.deviceName?.map((el) => (
                <StyledTableCell style={{ border: "1px solid white" }}>
                  {el}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <StyledTableCell colSpan={11} style={{ padding: 0 }}>
                {loading && <LinearProgress />}
              </StyledTableCell>
            </TableRow>
            {records?.faiDtos?.map((r) => (
              <TableRow key={r.id}>
                <StyledTableCell>{r.paramCode}</StyledTableCell>
                <StyledTableCell>{r.mainType}</StyledTableCell>
                <StyledTableCell>{r.paramType}</StyledTableCell>
                <StyledTableCell>{r.paramDesc}</StyledTableCell>
                <StyledTableCell>{r.tyClauseNo}</StyledTableCell>
                <StyledTableCell>{r.min}</StyledTableCell>
                <StyledTableCell>{r.max}</StyledTableCell>
                <StyledTableCell>{r.unit}</StyledTableCell>
                {records.deviceName.map((el, index) => (
                  <StyledTableCell>{r.obsValue[index] || ""}</StyledTableCell>
                ))}
              </TableRow>
            ))}

            {records?.faiDtos?.length === 0 && (
              <TableRow>
                <StyledTableCell colSpan={11} align="center">
                  No records found!
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </div>
  );
}
