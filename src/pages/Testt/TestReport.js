import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import moment from "moment";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
import {Publish} from "@material-ui/icons";
import ColdTest from "excel-upload/ColdTest";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { useSelector } from "react-redux";
import {
  ORG_TYPE,
  PRODUCT_ID,
  TEST_ID,
  USER_DEPARTMENT,
  USER_ROLE_ID,
} from "../../../src/Globals";
import Product105 from "./products/Product105";
import PrintAllSpecs from "./printAllSpecs";

import axiosInstance from "pages/Services/AxiosInstanceTransaction";
const MAX_TRY = 2;
export const labelStyle = {
  padding: "5px 10px",
  borderRadius: "5px",
  fontSize: "0.9em",
  display: "inline-block",
  minWidth: "40px",
  textAlign: "center",
  backgroundColor: "lightgrey",
};
export const passStyle = {
  ...labelStyle,
  textAlign: "center",
  backgroundColor: "green",
  color: "white",
  paddingInline: 8,
  paddingBlock: 4,
};
export const failStyle = {
  ...labelStyle,
  textAlign: "center",
  backgroundColor: "#d10404",
  color: "white",
  paddingInline: 8,
  paddingBlock: 4,
};
export default function NewOLAllotTests({
  open,
  setOpen,
  regNo,
  ol,
  olNum,
  isFai,
  IsOl,
  rowData,
  samples,
  qcTest,
  setQcTest,
  registers,
  sampleRegisters,
  othersampleRegno,
  regNos
}) {
  console.log("ol",ol);
  console.log("regno",regNo);
  console.log("olnum new ol allot test",olNum);
  // console.log("lineItemNum",rowData.soLineItemNo);
  const [applicableTest, setApplicableTest] = useState([]);
  const [applicableTestFai, setApplicableTestFai] = useState([]);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const devId = regNo.id;
  const maxTried = useRef(0);
  const [applicableTestLoading, setApplicableTestLoading] = useState(false);
  const [openTestReportObservation, setOpenTestReportObservation] =
    useState(false);
  const [loadingRounds, setLoadingRounds] = useState(false);
  const [applicableTestFaiLoading, setApplicableTestFaiLoading] =
    useState(false);
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedRoundForPrint, setSelectedRoundForPrint] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [openRound, setOpenRound] = useState(false);
  const [creatingRound, setCreatingRound] = useState(false);
  const [status, setStatus] = useState([]);
  const [allRoundsList, setAllRoundsList] = useState([]);
  const isQa = true;
  const hasAccessToAdd = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY;
  const Firm = loggedInUser?.orgTypeId === ORG_TYPE.FIRM;
  const regId = samples?.map((number) => number?.regId);
  const prod = samples?.map((number1) => number1.productId);
    const roleId = loggedInUser?.roleId;
   const isDO= roleId === USER_ROLE_ID.ROLE_DO;
  async function createRound() {
    try {
      setCreatingRound(true);
      let url = `/ate/getNextRoundId/${regNo.serialNoId}/${ol.productId}/subSlipLineItem/${ol.id}`;
      if (hasAccessToAdd || isDO) {
        url = `/ate/getNextRoundId/${regNo.serialNoId}/${rowData.productId}/${ol.id}/${isQa}`;
      }
      await axiosInstanceIol(url);

      getRounds(qcTest);
      setOpenRound(false);
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingRound(false);
    }
  }
  useEffect(() => {
    console.log(qcTest, "qcTest");
  }, [qcTest]);

  const productId = ol.productId || rowData.productId; // Displaying in Sample product and expanded Products
  const regNoId = regNo.serialNoId || regNo.id; // // Displaying in Sample product and expanded Products

  async function getRounds(qcTest) {
    setLoadingRounds(true);
    try {
      let url = `/ate/getListofRoundIds/${regNo.id}/${ol.productId}/subSlipLineItem/${ol.id}`; //Submission Slip url
      if (qcTest) {
        url = `/olLineItem/getDataByOlLiId/${ol.id}`;//Displaying QC Report in QA
      } else {
        if (
          loggedInUser.roleId === USER_ROLE_ID.ROLE_INSPECTOR ||
          loggedInUser.roleId === USER_ROLE_ID.ROLE_DC ||
          loggedInUser.roleId === USER_ROLE_ID.ROLE_AC ||
          loggedInUser.roleId === USER_ROLE_ID.ROLE_DAC ||
          loggedInUser.roleId === USER_ROLE_ID.ROLE_AE ||
          loggedInUser.roleId === USER_ROLE_ID.ROLE_JE || isDO
        ) {
          url = `/ate/getListofRoundIds/${regNoId}/${productId}/${ol.id}/${isQa}`; //Sample Selection Url
        } else if (
          loggedInUser.roleId === USER_ROLE_ID.ROLE_DC ||
          loggedInUser.roleId === USER_ROLE_ID.ROLE_AC ||
          loggedInUser.roleId === USER_ROLE_ID.ROLE_DAC ||
          loggedInUser.roleId === USER_ROLE_ID.ROLE_AE ||
          loggedInUser.roleId === USER_ROLE_ID.ROLE_JE
        ) {
          url = `/ate/getListofRoundIds/${regNo.id}/${prod}/${ol.id}/${isQa}`; //View Sample Url
        }
      }

      console.log("url: ", url);

      const { data: allRounds } = qcTest
        ? await axiosInstance.get(url)
        : await axiosInstanceIol(url);
      console.log(allRounds, "allRounds");
      setAllRoundsList(allRounds);
      if (allRounds.length === 0 && maxTried.current < MAX_TRY) {
        createRound();
        maxTried.current += 1;
      } else {
        setSelectedRound(allRounds[0]);
        if (!isFai) {
          getApplicableTest(allRounds[0]);
        } else {
          getApplicableTestFai(allRounds[0]);
        }

        getStatus(allRounds[0]);
        setRounds(allRounds);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRounds(false);
    }
  }

  async function getApplicableTest(allRound) {
    setApplicableTestLoading(true);
    const roundId = allRound.roundId;
    try {
      let url = `ate/getAllTestListByPrdId/${devId}/${ol.productId}/ssLiId/${ol.id}/${roundId}`; //Submission Slip url
      if (qcTest) {
        url = `ate/getAllTestListByPrdId/${allRound?.subSlipSerialNoId}/${ol.productId}/ssLiId/${allRound?.ssLiId}/${roundId}?showQa=false`;//Displaying QC Report in QA
      } else if (
        loggedInUser.roleId === USER_ROLE_ID.ROLE_INSPECTOR ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_DC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_DAC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AE ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_JE || isDO
      ) {
        url = `ate/getAllTestListInQa/${regNoId}/${productId}/${ol.id}/${roundId}`; //Sample Selection Url
      } else if (
        loggedInUser.roleId === USER_ROLE_ID.ROLE_DC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_DAC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AE ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_JE
      ) {
        url = `ate/getAllTestListInQa/${regId}/${prod}/${ol.id}/${roundId}`; ////View Sample Url
      }

      const { data } = await axiosInstanceIol(url);
      setApplicableTest(data);
    } catch (error) {
      console.log(error);
    } finally {
      setApplicableTestLoading(false);
    }
  }
  useEffect(() => {
    getRounds(qcTest);
    // getApplicableTest();
  }, []);

  async function getStatus(allRound) {
    const roundId = allRound.roundId;
    console.log(qcTest,"qcTest");
    try {
      let url = `/ate/getAllSubmittedTestStatusByProdIdDevId/${devId}/${ol.productId}/${ol.id}/${roundId}`; //Submission Slip url
      if (qcTest) {
 url = `/ate/getAllSubmittedTestStatusByProdIdDevId/${allRound?.subSlipSerialNoId}/${ol.productId}/${allRound?.ssLiId}/${roundId}?showQa=false`;//Displaying QC Report in QA
      }else
      if (
        loggedInUser.roleId === USER_ROLE_ID.ROLE_INSPECTOR ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_DC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_DAC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AE ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_JE || isDO
      ) {
        url = `/ate/getAllSubmittedTestStatusByProdIdDevId/${regNoId}/${productId}/${ol.id}/${roundId}/?showQa=true`; //Sample Selection Url
      } else if (
        loggedInUser.roleId === USER_ROLE_ID.ROLE_DC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_DAC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AE ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_JE
      ) {
        url = `/ate/getAllSubmittedTestStatusByProdIdDevId/${regId}/${prod}/${ol.id}/${roundId}`; ////View Sample Url
      }
      const { data } = await axiosInstanceIol(url);
    console.log(url,"url");
      setStatus(data);
    } catch (err) {
      console.log("error", err);
    }
  }

  async function getApplicableTestFai(allRound) {
    const roundId = allRound.roundId;
    setApplicableTestFaiLoading(true);
    console.log("isfai", isFai);
    try {
      let url = `ate/getAllTestListByPrdIdIsFai/${regNo.serialNoId}/${ol.productId}/${ol.id}/${roundId}`; //Submission Slip url
      if ( loggedInUser.roleId === USER_ROLE_ID.ROLE_DC ||loggedInUser.roleId === USER_ROLE_ID.ROLE_INSPECTOR ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_DAC ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_AE ||
        loggedInUser.roleId === USER_ROLE_ID.ROLE_JE ||  loggedInUser.roleId === USER_ROLE_ID.ROLE_DO) {
        url = `ate/getAllTestListByPrdIdIsFai/${regNo.serialNoId}/${rowData.productId}/${ol.id}/${roundId}`; //Sample Selection Url
      }
      const { data } = await axiosInstanceIol(url);
      setApplicableTestFai(data);
    } catch (error) {
      console.log(error);
    } finally {
      setApplicableTestFaiLoading(false);
    }
  }
 
  const isReportEnabled = (currentTest, allTests, statusList) => {
    
    const statusMap = new Map(statusList.map(s => [s.testId, s.testStatus]));
  
    const minSequence = Math.min(...allTests.map(t => t.sequence));
    if (currentTest.sequence === minSequence) {
      return true;
    }
    return allTests
      .filter(t => t.sequence < currentTest.sequence)
      .every(t => statusMap.get(t.testId) === "Pass");
  };
  return (
    <>
      <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
  {loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY ? (
    qcTest ? (
      <>
        Submission Slip No.: {ol?.offerLetterNo || olNum?.name}, Line Item No. : {ol?.soLineItemNo}, EP Code : {ol?.partNo}
      </>
    ) : (
      <>
        Offer Letter: {olNum?.name||ol?.olNum?.name || ol?.olNum?.olNumber || olNum?.olNumber}, Line Item No. : {olNum?.soLineItemNo || ol?.olNum?.soLineItemNo || ol?.lineItemNo || ol?.soLineItemNo}, EP Code : {ol?.partNumberId|| ol?.olNum?.epCode}
      </>
    )
  ) : (IsOl?
   ( <>
      Offer Letter No.: {olNum?.olNumber }, Line Item No. : {ol?.soLineItemNo}, EP Code : {ol?.partNo}
    </>):(<>
      Submission Slip No.: {ol?.offerLetterNo}, Line Item No. : {ol?.soLineItemNo}, EP Code : {ol?.partNo}
    </>)
  )}
</DialogTitle>

        <DialogContent dividers>
          Registration No:{" "}
          <b style={{ color: "#205375" }}> { regNo.registrationNo!== 3 ? regNo?.serialNo : "N/A"}</b>
          
          {/* <TableContainer
            style={{
              maxWidth: 600,
              maxHeight: 300,
              marginTop: 10,
              overflow: "hidden",
              marginInline: "auto",
              border: "1px solid lightgrey",
            }}
          > */}
            {/* {(loggedInUser.roleId === USER_ROLE_ID.ROLE_EXAMINER ||
              (loggedInUser.roleId === USER_ROLE_ID.ROLE_GIC &&
                departmentTypeId === USER_DEPARTMENT.QC)) && (
              <div style={{ textAlign: "right" }}>
                <Button
                  startIcon={<AddIcon />}
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={creatingRound || loadingRounds}
                  style={{ textTransform: "capitalize", marginBottom: 8 }}
                  onClick={() => setOpenRound(true)}
                >
                  Add Round
                </Button>
              </div>
            )} */}
            {/* <Table size="small" stickyHeader> */}
              {/* <TableHead>
                <TableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Round</StyledTableCell>

                  <StyledTableCell>Action</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead> */}
              {/* <TableBody>
                {loadingRounds && (
                  <StyledTableRow>
                    <StyledTableCell colSpan={3}>
                      <LinearProgress />
                    </StyledTableCell>
                  </StyledTableRow>
                )}
                {rounds.map((round, index) => (
                  <StyledTableRow
                    key={index}
                    style={{
                      backgroundColor:
                        round.roundId === selectedRound?.roundId
                          ? "#d4f2ff"
                          : "initial",
                    }}
                  >
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell
                      style={{ color: "green", fontWeight: "bold" }}
                    >
                      Round:{round?.roundId}
                    </StyledTableCell>
                    <StyledTableCell>
                      <div style={{ display: "flex", gap: 8 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            if (round?.roundId !== selectedRound?.roundId) {
                              getApplicableTest(round?.roundId);
                              getApplicableTestFai(round?.roundId);
                              getStatus(round?.roundId);
                            }
                            setSelectedRound(round);
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => {
                            setSelectedRoundForPrint(round);
                          }}
                        >
                          <Print fontSize="small" />
                        </IconButton>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody> */}
            {/* </Table> */}
          {/* </TableContainer> */}
          <Divider style={{ marginBlock: 12 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Applicable Test</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                  <StyledTableCell>Submitted By </StyledTableCell>
                  <StyledTableCell>Submitted Date(Time) </StyledTableCell>

                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicableTestLoading && (
                  <StyledTableRow>
                    <StyledTableCell colSpan={3}>
                      <LinearProgress />
                    </StyledTableCell>
                  </StyledTableRow>
                )}
                {applicableTest?.map((input, index) => (
                  <StyledTableRow>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell> {input?.testName}</StyledTableCell>

                    <StyledTableCell>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Publish />}
                        style={{
                          textTransform: "capitalize",

                          backgroundColor:
                            status &&
                            status.length > 0 &&
                            (status.find((s) => s.testId === input.testId)
                              ? status.find((s) => s.testId === input.testId)
                                  ?.testStatus === "Pass"
                                ? "#4caf50"
                                : "#f44336"
                              : ""),
                        }}
                        onClick={() => {
                          setOpenTestReportObservation(true);
                          setSelectedTest(input);
                        }}
                        disabled={!isReportEnabled(input, applicableTest, status || [])}
                      >
                        Report
                      </Button>
                    </StyledTableCell>

                    <>
                      <StyledTableCell>
                        {status &&
                          status.length > 0 &&
                          (status.find((s) => s.testId === input.testId)
                            ? status.find((s) => s.testId === input.testId)
                                ?.submittedBy
                            : "")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {status &&
                          status.length > 0 &&
                          (status.find((s) => s.testId === input.testId)
                            ? moment(
                                status.find((s) => s.testId === input.testId)
                                  .submitDate,
                                "DD-MM-YYYY hh:mm a"
                              ).format("DD-MM-YYYY(hh:mm a)")
                            : "")}
                      </StyledTableCell>

                      <StyledTableCell>
                        {status &&
                          status.length > 0 &&
                          (status.find((s) => s.testId === input.testId) ? (
                            status.find((s) => s.testId === input.testId)
                              ?.testStatus === "Pass" ? (
                              <span style={passStyle}>Pass</span>
                            ) : (
                              <span style={failStyle}>Fail</span>
                            )
                          ) : (
                            ""
                          ))}
                      </StyledTableCell>
                    </>
                    {/*                    
{status?.map((item, index) => (   
 <StyledTableCell> {item?.testStatus}</StyledTableCell>
))}   */}
                  </StyledTableRow>
                ))}
                {applicableTestFaiLoading && (
                  <StyledTableRow>
                    <StyledTableCell colSpan={3}>
                      <LinearProgress />
                    </StyledTableCell>
                  </StyledTableRow>
                )}
                {applicableTestFai?.map((input, index) => (
                  <StyledTableRow>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell> {input?.testName}</StyledTableCell>

                    <StyledTableCell>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Publish />}
                        style={{
                          textTransform: "capitalize",

                          backgroundColor:
                            status &&
                            status.length > 0 &&
                            (status.find((s) => s.testId === input.testId)
                              ? status.find((s) => s.testId === input.testId)
                                  ?.testStatus === "Pass"
                                ? "#4caf50"
                                : "#f44336"
                              : ""),
                        }}
                        onClick={() => {
                          setOpenTestReportObservation(true);
                          setSelectedTest(input);
                        }}
                      >
                        Report
                      </Button>
                    </StyledTableCell>

                    <>
                      <StyledTableCell>
                        {status &&
                          status.length > 0 &&
                          (status.find((s) => s.testId === input.testId)
                            ? status.find((s) => s.testId === input.testId)
                                ?.submittedBy
                            : "")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {status &&
                          status.length > 0 &&
                          (status.find((s) => s.testId === input.testId)
                            ? moment(
                                status.find((s) => s.testId === input.testId)
                                  .submitDate,
                                "DD-MM-YYYY hh:mm a"
                              ).format("DD-MM-YYYY(hh:mm a)")
                            : "")}
                      </StyledTableCell>

                      <StyledTableCell>
                        {status &&
                          status.length > 0 &&
                          (status.find((s) => s.testId === input.testId) ? (
                            status.find((s) => s.testId === input.testId)
                              ?.testStatus === "Pass" ? (
                              <span style={passStyle}>Pass</span>
                            ) : (
                              <span style={failStyle}>Fail</span>
                            )
                          ) : (
                            ""
                          ))}
                      </StyledTableCell>
                    </>

                    {/*                    
{status?.map((item, index) => (   
 <StyledTableCell> {item?.testStatus}</StyledTableCell>
))}   */}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions>
          {rounds.length > 0 && (
    <Button
      variant="contained"
      size="small"
      color="secondary"
      style={{ textTransform: "capitalize" }}
      onClick={() => {
 
        setSelectedRoundForPrint(rounds[0]);
      }}
    >
      Print
    </Button>
  )}
          <Button
            variant="contained"
            size="small"
            color="secondary"
            style={{ textTransform: "capitalize" }}
           
            onClick={async () => { 
              try {
                if (typeof sampleRegisters === 'function') {
                  await sampleRegisters(); 
                }
                if (typeof registers === 'function') {
                  await registers();
                }
                if (typeof othersampleRegno === 'function') {
                  await othersampleRegno();
                }
                setOpen(false);
                setQcTest(false);
                
              } catch (err) {
                console.error("Error refreshing data:", err);
              }
            }}
          >
            Close
          </Button>
          
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRound}
        // onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Add Rounds</DialogTitle>
        <DialogContent>
          <b>Are you sure you want to add Inspection rounds?</b>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ textTransform: "capitalize" }}
            variant="contained"
            size="small"
            color="secondary"
            onClick={createRound}
          >
            Yes
          </Button>
          <Button
            style={{ textTransform: "capitalize" }}
            variant="contained"
            size="small"
            color=""
            onClick={() => setOpenRound(false)}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      {openTestReportObservation && (
        <TestReport
          setOpenTestReportObservation={setOpenTestReportObservation}
          selectedTest={selectedTest}
          regNo={regNo}
          ol={ol}
          olNum={olNum}
          roundTest={selectedRound}
          applicableTest={applicableTest}
          applicableTestFai={applicableTestFai}
          onClose={() => getRounds(qcTest)}
          rowData={rowData}
          samples={samples}
          productId={productId}
          regNoId={regNoId}
          setQcTest={setQcTest}
          qcTest={qcTest}
        />
      )}
      {selectedRoundForPrint && (
        <PrintAllSpecs
          ol={ol}
          onClose={() => setSelectedRoundForPrint(null)}
          round={selectedRoundForPrint}
          regNo={regNo}
          regNoId={regNoId}
          qcTest={qcTest}
          allRounds={allRoundsList[0]}
        />
      )}
    </>
  );
}

const TestReport = ({
  setOpenTestReportObservation,
  selectedTest,
  regNo,
  ol,
  roundTest,
  setStatus,
  onClose,
  rowData,
  samples,
  productId,
  regNoId,
  setQcTest,
  olNum,
  qcTest,
}) => {
  console.log("roundTest===", olNum);

  const renderContent = () => {
    if (ol.productId === PRODUCT_ID.TPDK) {
      switch (selectedTest.testId) {
        case TEST_ID.TPDK_HOT:
          return (
            <ColdTest
              isHotTest
              selectedTest={selectedTest}
              regNo={regNo}
              ol={ol}
              olNum={olNum}
              roundTest={roundTest}
              rowData={rowData}
            />
          );
        case TEST_ID.TPDK_COLD:
          return (
            <ColdTest
              selectedTest={selectedTest}
              regNo={regNo}
              ol={ol}
              olNum={olNum}
              roundTest={roundTest}
              rowData={rowData}
                qcTest={qcTest}
            />
          );
        default:
          return (
            <Product105
              selectedTest={selectedTest}
              regNo={regNo}
              ol={ol}
              olNum={olNum}
              roundTest={roundTest}
              rowData={rowData}
              regNoId={regNoId}
              qcTest={qcTest}
            />
          );
      }
    }

    return (
      <Product105
        selectedTest={selectedTest}
        regNo={regNo}
        ol={ol}
        roundTest={roundTest}
        rowData={rowData}
        olNum={olNum}
        samples={samples}
        productId={productId}
        regNoId={regNoId}
       qcTest={qcTest} 
       
      />
    );
  };

  const handleCLose = () => {
    onClose();
    setOpenTestReportObservation(false);
  };

  return (
    <Dialog open fullScreen fullWidth>
      <DialogTitle onClose={handleCLose}>{selectedTest?.testName}</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
};
