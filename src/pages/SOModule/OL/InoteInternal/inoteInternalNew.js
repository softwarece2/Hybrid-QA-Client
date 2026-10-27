import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomizedInputs from "components/TextField";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import moment from "moment";
import { restrict } from "restrict";
import AutoCompleteNew from "components/AutoCompleteNew";
import axiosInstanceTrans from "pages/Services/AxiosInstance";
import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";
import LotDetails from "pages/InspectorModule/Lots/LotDetails";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";

// import NotifyOrAllot from "pages/SOModule/InStageQC/SubmittedSO/NotifyOrAllot";

const useStyles = makeStyles({
  table: {
    marginBottom: 20,
    width: "100%",
    "& thead tr th": {
      padding: "4px 8px",
      border: "1px solid rgb(182, 182, 182)",
      fontWeight: 600,
      background: "#f3f5f7",
      fontSize: 13,
    },
    "& tbody  tr td": {
      padding: "4px 8px",
      border: "1px solid rgb(182, 182, 182)",
      fontSize: 12,
    },
  },
  container: {
    border: "1px solid rgb(241, 241, 241)",
    padding: 16,
    marginBlock: 16,
  },
  input: {
    fontWeight: 600,
    color: "#205375",
    fontSize: 18,
  },
});

const schema = yup.object().shape({
  accepted: yup.number().typeError("Required").min(1).nullable().required("Required"),
  rejected: yup.number().typeError("Required").min(0).nullable().required("Required"),
  remarks: yup.string().nullable(),
  // rrQty: yup.number().typeError("Required").min(0).nullable().required("Required"),
});

export default function INoteInternalNew({ olId, returnTo, mergedDetails, row }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  console.log("-------" + loggedInUser);

  const seniorityId = loggedInUser?.seniority;
  const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
  const empId = loggedInUser?.empId;
  const roleId = loggedInUser?.roleId;
  console.log(mergedDetails, "mergedDetails")
  const componentRef = useRef();
  const classes = useStyles();

  const dispatch = useDispatch();
  const roleName = loggedInUser?.roleName;
  console.log("--rolename-----" + roleName);
  const ename = loggedInUser?.ename;
  console.log("--ename-----" + ename);
  const [nextEmployees, setNextEmployees] = useState([]);
  const [nextEmployeesLoading, setNextEmployeesLoading] = useState(false);
  const [iNoteDetails, setINoteDetails] = useState({});
  const [saving, setSaving] = useState(false);
  const [qccDetails, setQccDetails] = useState({});

  const mergedTestId = row?.mergeSslipId || mergedDetails?.mergedOlId;

  const iNoteLineItems = iNoteDetails.inoteLineItems?.[0] || {};

  const orderedQty = iNoteLineItems?.orderedQty || 0;

  const { control, handleSubmit, reset, formState, getValues, setValue, watch } = useForm({
    defaultValues: {
      accepted: null,
      rejected: null,
      rrQty: null,
      remarks: "",
      nextApprover: "",
      tendered: null,
      qtyAcceptedToDate: null,
    },
    resolver: yupResolver(schema),
  });

  // const remarks = watch("remarks");

  const getData = useCallback(() => {
    axiosInstance("qcc/" + mergedTestId)
      .then(({ data }) => {
        setQccDetails(data);
        reset({
          inoteNo: data.inoteNo || "",
          deviationConcession: data.deviationConcession || "",
          remarks: data.remarks || "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [mergedTestId, reset]);

  useEffect(() => {
    getData();
  }, [getData]);


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "IOL_Internal_I-Note",
  });

  const MergedTest = row?.mergeSslipId || mergedDetails?.mergedOlId
  useEffect(() => {
    axiosInstance("internalInote/getINoteBySslipId/" + MergedTest)
      .then(({ data }) => {
        setINoteDetails(data);
        const iiNoteLineItems = data.inoteLineItems?.[0] || {};

        reset({
          accepted: data.acceptedQty,
          // rejected: iiNoteLineItems.rejected,
          rejected: data.rejectedQty,
          // rrQty: iiNoteLineItems.rrQty,
          rrQty: "-",
          remarks:  "",
          tendered: iiNoteLineItems.tendered,
          qtyAcceptedToDate: iiNoteLineItems.qtyAcceptedToDate,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [olId, reset]);

  async function onSave(data) {
    setSaving(true);
    try {
      if (data.accepted !== null && data.rejected !== null && data.rrQty !== null) {
        if (data.accepted + data.rejected + data.rrQty > orderedQty) {
          toast.error("The sum of Accepted, Rejected, and R/R quantities cannot exceed the Ordered Quantity.");
          setSaving(false);
          return;
        }
      }
      const firstObj = iNoteDetails.inoteLineItems?.length ? iNoteDetails.inoteLineItems[0] : {};
      const isUpdate = !!iNoteDetails.submittedDatetime;
      const req = {
        ...iNoteDetails,
        mergeSubSlipId: mergedDetails?.mergedOlId,
        iNoteLineItems: [
          {
            ...firstObj,
            accepted: data.accepted,
            rejected: data.rejected,
            // rrQty: data.rrQty,
            remarks: data.remarks || "",
            ename: data.nextApprover?.ename,
            tendered: data.tendered,
            qtyAcceptedToDate: data.qtyAcceptedToDate,
          },
        ],

      };
      await axiosInstance.post("internalInote/saveINote", req);
      //IVNV Observation Updated Toast message Modified by:Shruti Sanjay Date:08-07-2026
      if (isUpdate) {
        toast.success("Inote Updated Successfully");
      } else {
        toast.success("Inote Saved Successfully");
      }
      const newData = await axiosInstance.get("internalInote/getINoteBySslipId/" + mergedDetails?.mergedOlId);
      setINoteDetails(newData.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to save, please try again");
    }
    setSaving(false);
  }

  // let canNotifyToHodAssembly = false;
  // console.log(roleId, USER_ROLE_ID.ROLE_HOS, departmentId, DEPARTMENT_ID.QC, records);

  // if (roleId === USER_ROLE_ID.ROLE_HOS && departmentId === DEPARTMENT_ID.QC) {
  //   canNotifyToHodAssembly = true;
  // }

  // const [openNoti, setOpenNoti] = useState(false);
  useEffect(() => {
    let url = `employee/getHosaList`;

    setNextEmployees([]);
    setNextEmployeesLoading(true);
    setValue("nextApprover", null);

    axiosInstanceTrans(url)
      .then(({ data }) => {
        setNextEmployees(data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setNextEmployeesLoading(false);
      });
  }, [departmentId, empId, roleId, seniorityId]);

  // const ishosqc = (roleId === USER_ROLE_ID.ROLE_HOS && departmentId === DEPARTMENT_ID.QC);
  const isdo = (roleId === USER_ROLE_ID.ROLE_DO && departmentTypeId === DEPARTMENT_ID.QC);

  const handleBack = () => {
    if (returnTo === "lotDetails") {
      dispatch(selectItem(<LotDetails />));
    } else if (returnTo === "table") {
      dispatch(selectItem(<INoteTable />));
    } else if (returnTo === "instrumentlist") {
      dispatch(selectItem(<DetailsINote />));
    }
    else {
      dispatch(selectItem(<LotDetails />));
    }
  };

  return (
    <div>
      {/* {openNoti && <NotifyOrAllot selectedRow={iNoteDetails} onClose={() => setOpenNoti(false)}  isINote
          refresh={()=>{}} />} */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => {
            dispatch(selectItem(<INoteTable />));
          }}
          startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
        >
          Back
        </Button> */}
        <Button
          variant="contained"
          size="small"
          color="secondary"
          // onClick={() => {
          //   isdo ? (dispatch(selectItem(<INoteTable />))) : (dispatch(selectItem(<DetailsINote />)));
          // }}
          onClick={handleBack}
          startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
        >
          Back
        </Button>

        {/* {canNotifyToHodAssembly && (
          <Button onClick={() => setOpenNoti(true)} color="Primary" variant="outlined">
            Notify
          </Button>
        )} */}
      </div>
      <div ref={componentRef} className={classes.container}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography align="center" variant="h6" color="primary" style={{ textDecoration: "underline", marginBottom: 8, flex: 1 }}>
            OPTO-ELECTRONICS FACTORY DEHRADUN (A Unit of India Optel Limited)
          </Typography>
          <Typography variant="subtitle2">
            FORM NO.- OLF/GEN/124
            <br />
            I.A.F. (DGI)-4
            <br />
            Page NO.: 1
          </Typography>
        </div>

        <div>
          <Typography variant="h6" align="center" color="primary" style={{ marginInline: "auto", marginBottom: 10 }}>
            <u>INSPECTION NOTE</u>
          </Typography>
          <Typography variant="body2"></Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">
            I/NOTE NO.: <b style={{ minWidth: 100, display: "inline-block" }}>{iNoteDetails?.inoteNo}</b>
          </Typography>
          <Typography variant="body2">FACTORY - OLF(136)</Typography>
          <Typography variant="body2">
            R.V./I.V. NO.:
            <b style={{ minWidth: 100, display: "inline-block" }}></b>
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">
            DT.:{" "}
            <b style={{ minWidth: 100, display: "inline-block" }}>
              {iNoteDetails.submittedDatetime ? moment(iNoteDetails.submittedDatetime).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")}
            </b>
          </Typography>
          <Typography variant="body2">SECTION - {iNoteDetails?.section} ({iNoteDetails?.secCode}) </Typography>
          <Typography variant="body2">
            DT.:{" "}<b style={{ minWidth: 100, display: "inline-block" }}></b>
          </Typography>
        </div>

        <Table size="small" className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell>ITEM CODE</TableCell>
              <TableCell>DESCRIPTION/CAT PAT. NO./NSN</TableCell>
              <TableCell>DRAWING NO.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>{iNoteDetails?.epCode}</TableCell>
              <TableCell className={classes.input}>{iNoteDetails?.nomenclature}{iNoteLineItems?.catPartNo}{iNoteLineItems?.nsnPartNo} </TableCell>
              <TableCell className={classes.input}>{iNoteDetails?.drawingNo}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table size="small" className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell>S.W.O. NO.</TableCell>
              <TableCell>WT. NO.</TableCell>
              <TableCell>WT.ISS.DT.</TableCell>
              <TableCell>EST. NO.</TableCell>
              <TableCell>REV. NO.</TableCell>
              <TableCell>EST DT.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>{iNoteDetails?.workOrderNo}</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.warranty}</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.wtIssueDate}</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.rfEstNo}</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.revNo}</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.estDate}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">
            IFD/IND NO.: <b style={{ minWidth: 500, display: "inline-block" }}>{iNoteDetails?.orderTypeNo}  Dt: {iNoteDetails?.orderTypeDate}</b>
          </Typography>
          <Typography variant="body2">
            SO/EXT NO.: <b style={{ minWidth: 500, display: "inline-block" }}>{iNoteDetails?.supplyOrderNo}</b>
            &nbsp;&nbsp;&nbsp;Dt:&nbsp;
            <b style={{ minWidth: 100, display: "inline-block" }}>
              {iNoteDetails?.supplyOrderDate ? moment(iNoteDetails?.supplyOrderDate).format("DD-MM-YYYY") : "--"}
            </b>
          </Typography>
          <Typography variant="body2">
            SO.SL.NO.:<b style={{ minWidth: 500, display: "inline-block" }}>{iNoteDetails?.lineItemSNo}</b>
          </Typography>
          <Typography variant="body2">
            Ord Qty. &nbsp;<b style={{ minWidth: 100, display: "inline-block" }}>{iNoteLineItems?.orderedQty}</b>
            Issued till Dt. (excl. this INote Qty.): <b style={{ minWidth: 100 }}>{iNoteLineItems?.qtyAcceptedToDate}</b>
          </Typography>

        </div>

        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>OPN NO.</TableCell>
              <TableCell>SUBMITTED FROM PROD/STOCK/DEBIT</TableCell>
              <TableCell>
                ACCPT QTY.<span style={{ color: "red" }}>*</span>
              </TableCell>
              <TableCell>
                REJ. QTY<span style={{ color: "red" }}>*</span>
              </TableCell>
              <TableCell>
                R/R QTY<span style={{ color: "red" }}>*</span>
              </TableCell>
              <TableCell>USED FOR PROOF </TableCell>
              <TableCell>REMARKS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.input}>{iNoteDetails?.operationNo}</TableCell>
              {/* <TableCell className={classes.input}>{iNoteLineItems?.tendered}</TableCell> */}
              <TableCell>
                <div>
                  <Typography className="no-display">{getValues("accepted")}</Typography>
                  <div className="no-display-on-print">
                    <Controller
                      name="accepted"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => {
                        return (
                          <CustomizedInputs
                            onInput={restrict.number}
                            placeholder="Tendered Qty"
                            required
                            inputProps={{ maxLength: 10 }}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error?.message}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <Typography className="no-display">{getValues("accepted")}</Typography>
                  <div className="no-display-on-print">
                    <Controller
                      name="accepted"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => {
                        return (
                          <CustomizedInputs
                            onInput={restrict.number}
                            placeholder="Accepted Qty"
                            required
                            inputProps={{ maxLength: 10 }}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error?.message}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                {/* <div>
                  <Typography className="no-display">{getValues("rejected")}</Typography>
                  <div className="no-display-on-print">
                    <Controller
                      name="rejected"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => {
                        return (
                          <CustomizedInputs
                            onInput={restrict.number}
                            placeholder="Rejected Qty"
                            required
                            inputProps={{ maxLength: 10 }}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error?.message}
                          />
                        );
                      }}
                    />
                  </div>
                </div> */}
              </TableCell>

              <TableCell>
                <div>

                  <Typography className="no-display">{getValues("rrQty")}</Typography>
                  <div className="no-display-on-print">
                    <Controller
                      name="rrQty"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => {
                        return (
                          <CustomizedInputs
                            onInput={restrict.number}
                            placeholder="R/R Qty"
                            required
                            value={value}
                            inputProps={{ maxLength: 10 }}
                            onChange={onChange}
                            error={!!error}
                            helperText={error?.message}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell> --</TableCell>

              <TableCell>
                <div>
                  <Typography className="no-display">{getValues("remarks")}</Typography>
                  <div className="no-display-on-print">
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => {
                        return (
                          <CustomizedInputs
                            placeholder="Remarks"
                            required 
                            value={value}
                            inputProps={{ maxLength: 100 }}
                            onChange={onChange}
                            onInput={restrict.remarks}
                            error={!!error}
                            helperText={error?.message}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="subtitle1"> Reg.No.:</Typography>

        <Typography variant="body2" color="secondary">
          {
            iNoteDetails?.registrationNo !== 3 ?

              [
                ...(iNoteDetails?.passedRegNos || []),
                // ...(iNoteDetails?.failedRegNos || []),
              ].join(", ") : "N/A"}
        </Typography>

        <Table size="small" className={classes.table} style={{ marginTop: 20 }}>
          <TableBody>
            <TableRow>
              <TableCell>DEBIT HEAD</TableCell>
              <TableCell>M. D. NO</TableCell>
              <TableCell>DRAWING NO.</TableCell>
              <TableCell>BALANCE</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>V. O. S.(1)</TableCell>
              <TableCell>P. R. P. NO</TableCell>
              <TableCell>LAST I.V NO.</TableCell>
              <TableCell>AUTHORITY</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>DEPOT & QTY (NOS.,PAIRS, SETS DOZS.) DISTRIBUTION</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>ISSUE VOUCHER NO. & DATE </TableCell>
              <TableCell colSpan={2}>
                DISPATCH: <b>{iNoteDetails?.consignee}</b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="body2" align="center">
          ISSUED BY GOODS/PASSENGERS/ROAD
        </Typography>

        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 50,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Typography variant="subtitle2">

              <b>{qccDetails.prodApprovedBy}</b>
              <br />
              (Production Officer)
              <br />
              For Chief General Manager
              <br />
              OLF,Raipur,Dehradun
            </Typography>
            {/* {iNoteDetails?.prodUserName} */}
            (FOR SHOP)


            {/* {!iNoteDetails.submittedDatetime ? (
            <Controller
              name="nextApprover"
              control={control}
              render={({ field: { onChange, value } }) => (
                <AutoCompleteNew
                  style={{ minWidth: 300 }}
                  // labelText="Select Next Approver"
                  loading={nextEmployeesLoading}
                  data={nextEmployees}
                  getOptionLabel={(o) => o?.ename}
                  required
                  value={value}
                  onChange={(event, selectedValue) => {
                    onChange(selectedValue);
                  }}
                />
              )}
            />

          ) :
            <Typography variant="body2">
              {iNoteDetails.inoteLineItems[0]?.ename}
            </Typography>
          } */}

          </div>
          <Typography variant="subtitle2" style={{ textAlign: "center" }}>
            <Typography variant="subtitle2">
              {/* {ename}<br /> */}
              {/* <b>{ ename }</b> */}
              <b>{iNoteDetails?.submittedByName}</b>
              <br />
              (Quality Control Officer)
              <br />
              For Chief General Manager
              <br />
              OLF,Raipur,Dehradun
            </Typography>

            (FOR INSPECTION)</Typography>
          <Typography variant="subtitle2" style={{ textAlign: "center" }}>
            <br />
            <br />
            <br />
            HOS
            <br />
            (FOR STORE)
          </Typography>

        </footer>
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Typography variant="body2">
            <b>Note - This document is online generated & digitally signed, physical signature is not required.</b>
          </Typography>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>

        {isdo && (
          <Button
            // disabled={!formState.isDirty || saving}
            // disabled={(!formState.isDirty && !remarks?.trim()) || saving}
            disabled={ saving}
            type="submit"
            style={{ textTransform: "capitalize" }}
            size="small"
            variant="contained"
            color={iNoteDetails.submittedDatetime ? "secondary" : "primary"}
            onClick={handleSubmit(onSave)}
          >
            {saving && <CircularProgress size={16} />}
            {iNoteDetails.submittedDatetime ? "Update" : "Submit"}
          </Button>
        )}
        <Button style={{ textTransform: "capitalize" }} onClick={handlePrint} variant="contained" color="primary" size="small">
          Print
        </Button>
      </div>
    </div>
  );
}

