/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { useSelector } from "react-redux";
import {
  Chip, LinearProgress,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import { Accordion, AccordionDetails, AccordionSummary, StyledTableCell } from "Utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import moment from "moment";
import Button from "components/Button";
import AutoCompleteNew from "components/AutoCompleteNew";
import { CloudDownload, ExpandMore } from "@material-ui/icons";
import { USER_ROLE_ID } from "Globals.js";
import { handleDownload } from "pages/ApprovalCycle/ApprovalCycleje";
import Edit from "pages/SOModule/OL/Edit";
import ApprovalRemarksForm from "./ApprovalRemarksForm";
import ApprovalRfrForm from "./ApprovalRfrForm";

const headers = ["Sl.No", "Date", "Designation", "Name", "Next Approver", "Status"];

function Status({ text }) {
  return (
    <div
      style={{
        color: !text ? "grey" : text === "Approved" ? "#327642" : "#d32f2f",
        backgroundColor: !text ? "#f0f0f0" : text === "Approved" ? "#d0f0d0" : "#ffe0e0",
        padding: "2px 6px",
        borderRadius: 4,
        width: 120,
        textAlign: "center",
        fontWeight: "500",
        border: "1px solid #ccc",
      }}
    >
      {text || "NA"}
    </div>
  );
}

function Row({ row, index }) {

  return (
    <>
    
      <TableRow>
        <StyledTableCell rowSpan={2}>{index}.</StyledTableCell>
        <StyledTableCell>
          <Typography>{moment(row.createdDate).format("DD-MM-yyyy HH:mm")}</Typography>
        </StyledTableCell>
        <StyledTableCell>
          <Typography>{row.designation}</Typography>
        </StyledTableCell>

        <StyledTableCell>
          <Typography>{row.createdByStr}</Typography>
        </StyledTableCell>
        <StyledTableCell>
          <Typography>{row.nextApproverName}</Typography>
        </StyledTableCell>
        <StyledTableCell>
          <Typography>
            <Status text={row.olStatusStr} />
          </Typography>
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell>
          <Typography color="primary"><b>REMARKS:</b></Typography>
          {row.remarks}
        </StyledTableCell>
        <StyledTableCell colSpan={3}>
          {row?.uploadedFiles?.length > 0 && (
            <>
              <Typography color="primary">
                <b>Attachments:</b>
              </Typography>
              {row?.uploadedFiles?.map((file) => {
                const fileName = file.split("files/");
                return (
                  <Chip
                    label={fileName[1] ?? "olms-uploads"}
                    key={file}
                    onDelete={() => {
                      handleDownload(fileName[1], file);
                    }}
                    deleteIcon={<CloudDownload />}
                    style={{ marginInline: "4px" }}
                  />
                );
              })}
            </>
          )}
        </StyledTableCell>
      </TableRow>
    </>
  );
}

export default function ApprovalCycleSslip({subslip,sslip,getAllTableData}) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const orgId = loggedInUser?.orgId;
  const empId = loggedInUser?.empId;
  const roleId = loggedInUser?.roleId;

  const [loading, setLoading] = useState(false);
  const [offerLetters, setOfferLetters] = useState([]);
  const [records, setRecords] = useState({});
  const [openRemarksForm, setOpenRemarksForm] = useState(false);
  const [openRemarksRfrForm, setOpenRemarksRfrForm] = useState(false);
  const { control, watch } = useForm({ defaultValues: { offerLetter: null } });
console.log("sslip",sslip);
console.log("subslip",subslip);
  // useEffect(() => {
  //   if (loggedInUser) {
  //     setLoading(true);
  //     // let url = "subSlip/getAllottedSubSlipsByStatusForFirm/" + orgId + "/" + empId;
  //           let url = "subSlip/getAllottedSubSlipsApprovalByStatusForFirm/" + orgId + "/" + empId;

  //     axiosInstanceTrans(url)
  //       .then(({ data }) => {
  //         if (Array.isArray(data)) {
  //           setOfferLetters(data);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [loggedInUser]);
  const getSubSlips = async () => {
  if (!loggedInUser) return;

  setLoading(true);

  try {
    const url =
      `subSlip/getAllottedSubSlipsApprovalByStatusForFirm/${orgId}/${empId}`;

    const { data } = await axiosInstanceTrans(url);

    if (Array.isArray(data)) {
      setOfferLetters(data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  getSubSlips();
}, [loggedInUser]);

  async function getAllTableData(id) {
    if (id) {
      setLoading(true);
      try {
        const { data } = await axiosInstanceTrans("subSlipApproval/" + id + "/" + loggedInUser?.empId);
        setRecords(data);
      } catch (error) {
        toast.error("failed to get Records");
      }
      setLoading(false);
    }
  }
  useEffect(() => {
    if (subslip) {
      getAllTableData(sslip.id);
    }
  }, [sslip,subslip]);
  const watchOfferLetter = watch("offerLetter");

  return (
    <div>
      {openRemarksForm && (
        <ApprovalRemarksForm offerLetter={watchOfferLetter} sslip={sslip} getAllTableData={getAllTableData} onClose={() => setOpenRemarksForm(false)} getSubSlips={getSubSlips} />
      )}

        {openRemarksRfrForm && (
        <ApprovalRfrForm offerLetter={watchOfferLetter} getAllTableData={getAllTableData} onClose={() => setOpenRemarksRfrForm(false)} />
      )}

      <div>
      {!subslip ?( <div style={{ maxWidth: 300 }}>
          <Controller
            name="offerLetter"
            control={control}
            render={({ field: { onChange, value } }) => (
              <AutoCompleteNew
                minWidth={300}
                data={offerLetters || []}
                getOptionSelected={(o, v) => o.id === v.id}
                value={value}
                labelText="Select Submission Slip No."
                getOptionLabel={(o) => o.olNumber}
                onChange={(e, v) => {
                  onChange(v);
                  getAllTableData(v?.id);
                }}
              />
            )}
          />
        </div>):null}

        {watchOfferLetter && (
          <Accordion style={{ marginBlock: 10 }}>
            <AccordionSummary title={"View Details"} expandIcon={<ExpandMore />}>
              Submission Slip Details
            </AccordionSummary>
            <AccordionDetails style={{ display: "block" }}>
              <Edit soObj={watchOfferLetter} getOlData={() => {}} olCycle />
            </AccordionDetails>
          </Accordion>
        )}

        {roleId !== USER_ROLE_ID.ROLE_AC && (
          <Button
            style={{ marginBlock: 8, textTransform: "capitalize" }}
            disabled={!watchOfferLetter || subslip}
            onClick={() =>{
              if(records.soApprovalDtos?.[records.soApprovalDtos?.length-1]?.isRfr){
                setOpenRemarksRfrForm(true)
              }else{
                setOpenRemarksForm(true)
              }
              }}
            color="Primary"
            variant="contained"
          >
            Enter Remarks
          </Button>
        )}

        <TableContainer style={{ maxHeight: "600px" }}>
          {loading && <LinearProgress />}
          <Table
            style={{
              position: "relative",
              border: "1px solid lightgrey",
            }}
            size="small"
            aria-label="simple table"
            id="data-table-cleanliness-report"
          >
            <TableHead>
              <TableRow>
                {headers.map((label) => (
                  <StyledTableCell key={label}>
                    <Typography>{label}</Typography>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>

            {(subslip ||watchOfferLetter)&&(<TableBody>
              {records.sslipApprovalDtos?.map((row, i) => (
                <Row row={row} key={row.id} index={i + 1} />
              ))}
            </TableBody>)}
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
