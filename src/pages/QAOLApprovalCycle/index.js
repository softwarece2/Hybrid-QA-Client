/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { useSelector } from "react-redux";
import {
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  StyledTableCell,
} from "Utils";
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

const headers = [
  "Sl.No",
  "Date",
  "Designation",
  // "Role Name",
  "Name",
  "Next Approver",
  "Status",
];

function Status({ approvalStatus }) {
  return (
    <div
      style={{
        color: !approvalStatus
          ? "grey"
          : approvalStatus === 1
          ? "#327642"
          : "#d32f2f",
        backgroundColor: !approvalStatus
          ? "#f0f0f0"
          : approvalStatus === 1
          ? "#d0f0d0"
          : "#ffe0e0",
        padding: "2px 6px",
        borderRadius: 4,
        width: 120,
        textAlign: "center",
        fontWeight: "500",
        border: "1px solid #ccc",
      }}
    >
      {approvalStatus === 1
        ? "Approved"
        : approvalStatus === 2
        ? "Rejected"
        : "NA"}
    </div>
  );
}

function Row({ row, index }) {
  return (
    <>
      <TableRow>
        <StyledTableCell rowSpan={2}>{index}.</StyledTableCell>
        <StyledTableCell>
          <Typography>
            {moment(row.createdDate).format("DD-MM-yyyy HH:mm")}
          </Typography>
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
            <Status approvalStatus={row.olStatus} />
          </Typography>
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell>
          <Typography color="primary">
            <b>REMARKS:</b>
          </Typography>
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

export default function QAOLApprovalCycle({isSample}) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const orgId = loggedInUser?.orgId;
  const empId = loggedInUser?.empId;
  const roleId = loggedInUser?.roleId;
  const ref = useRef({});

  const [loading, setLoading] = useState(false);
  const [offerLetters, setOfferLetters] = useState([]);
  const [records, setRecords] = useState();
  const [openRemarksForm, setOpenRemarksForm] = useState(false);
  const [openRemarksRfrForm, setOpenRemarksRfrForm] = useState(false);
  const { control, watch, setValue } = useForm({ defaultValues: { offerLetter: null } });
const isqacl=true;
  useEffect(() => {
    if (loggedInUser) {
      setLoading(true);
      let url = `offerLetter/getAllottedOfferLettersByStatusForFirm/${orgId}/${empId}`;
      axiosInstanceTrans(url)
        .then(({ data }) => {
          if (Array.isArray(data) && data.length > 0) {
            setOfferLetters(data);
            //setValue("offerLetter", data[0]);
            //getAllTableData(data[0]?.id);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loggedInUser]);

  async function getAllTableData(id) {
    if (id) {
      setLoading(true);
      try {
        const { data } = await axiosInstanceTrans(
          "olApproval/" + id + "/" + loggedInUser?.empId
        );
        setRecords(data);
      } catch (error) {
        toast.error("failed to get Records");
      }
      setLoading(false);
    }
  }
  

  const watchOfferLetter = watch("offerLetter");

  useEffect(()=>{
    ref.current = {
                  ...watchOfferLetter,
                  internalInoteid: watchOfferLetter?.id,
                  id: undefined,
                }
  },[watchOfferLetter])

  return (
    <div>
      {openRemarksForm && (
        <ApprovalRemarksForm
          offerLetter={watchOfferLetter}
          getAllTableData={getAllTableData}
          onClose={() => setOpenRemarksForm(false)}
        />
      )}

      {openRemarksRfrForm && (
        <ApprovalRfrForm
          offerLetter={watchOfferLetter}
          getAllTableData={getAllTableData}
          onClose={() => setOpenRemarksRfrForm(false)}
        />
      )}

      <div>
        <div style={{ maxWidth: 300 }}>
          <Controller
            name="offerLetter"
            control={control}
            render={({ field: { onChange, value } }) => (
              <AutoCompleteNew
                minWidth={300}
                data={offerLetters || []}
                getOptionSelected={(o, v) => o.id === v.id}
                value={value && value.id ? value : null}
                labelText="Select QACL No."
				placeholder="Select QACL No."
                getOptionLabel={(o) => o.olNumber}
                onChange={(e, v) => {
                  onChange(v);
                  getAllTableData(v?.id);
                }}
              />
            )}
          />
        </div>

        {watchOfferLetter && (
          <Accordion defaultExpanded={true} style={{ marginBlock: 10 }}>
            <AccordionSummary
              title={"View Details"}
              expandIcon={<ExpandMore />}
            >
              QACL Details
            </AccordionSummary>
            <AccordionDetails style={{ display: "block" }}>
              <Edit
                soObj={watchOfferLetter}
                getOlData={() => {}}
                olCycle
                isSample={isSample}
                isqacl={isqacl}
              />
            </AccordionDetails>
          </Accordion>
        )}

        {/* {roleId !== USER_ROLE_ID.ROLE_AC && ( */}
          <Button
            style={{ marginBlock: 8, textTransform: "capitalize" }}
            disabled={!watchOfferLetter}
            onClick={() => {
              if (
                records.soApprovalDtos?.[records.soApprovalDtos?.length - 1]
                  ?.isRfr
              ) {
                setOpenRemarksRfrForm(true);
              } else {
                setOpenRemarksForm(true);
              }
            }}
            color="Primary"
            variant="contained"
  
          >
            Enter Remarks
          </Button>
        {/* )}  */}

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

            <TableBody>
              {records?.soApprovalDtos?.map((row, i) => (
                <Row row={row} key={row.id} index={i + 1} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
