import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import CustomizedInputs from "components/TextField";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import moment from "moment";
// import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";
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
  remarks: yup.string().when("rejected", {
    is: (value) => value > 1,
    then: yup.string().typeError("Required").nullable().required("Required"),
  }),
  rfr: yup.number().typeError("Required").min(0).nullable().required("Required"),
});

export default function INoteInternal({ olId }) {
  const componentRef = useRef();
  // const loggedInUser = useSelector((store) => store.loggedInUser);
  const classes = useStyles();
  const dispatch = useDispatch();
  // const roleId = loggedInUser?.roleId;
  // const departmentId = loggedInUser?.departmentId;

  const [iNoteDetails, setINoteDetails] = useState({});
  const [saving, setSaving] = useState(false);

  const iNoteLineItems = iNoteDetails.inoteLineItems?.[0] || {};

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      accepted: null,
      rejected: null,
      rfr: null,
      remarks: "",
    },
    resolver: yupResolver(schema),
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Ordnance Factory Raipur, Dehradun",
  });

  useEffect(() => {
    axiosInstance("internalInote/getINoteByOlId/" + olId)
      .then(({ data }) => {
        setINoteDetails(data);
        const iiNoteLineItems = data.inoteLineItems?.[0] || {};

        reset({ accepted: iiNoteLineItems.accepted, rejected: iiNoteLineItems.rejected, rfr: iiNoteLineItems.rfr, remarks:iiNoteLineItems.remarks ||""});
      })
      .catch((error) => {
        console.log(error);
      });
  }, [olId, reset]);

  async function onSave(data) {
    setSaving(true);
    try {
      const firstObj = iNoteDetails.inoteLineItems?.length ? iNoteDetails.inoteLineItems[0] : {};
      const req = {
        ...iNoteDetails,
        inoteLineItems: [{ ...firstObj, accepted: data.accepted, rejected: data.rejected, rfr: data.rfr, remarks:data.remarks||"" }],
      };
      await axiosInstance.post("internalInote/saveINote", req);
      toast.success("Saved successful");
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

  return (
    <div>
      {/* {openNoti && <NotifyOrAllot selectedRow={iNoteDetails} onClose={() => setOpenNoti(false)}  isINote
          refresh={()=>{}} />} */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => {
            dispatch(selectItem(<INoteTable />));
          }}
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
        <Typography align="center" variant="h4" color="primary" style={{ textDecoration: "underline", marginBottom: 8 }}>
          Ordnance Factory Raipur, Dehradun
        </Typography>
        <Table size="small" className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell>SC Vr No.</TableCell>
              <TableCell>--</TableCell>
              <TableCell>SC Vr DATE</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>I-NOTE No.</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.inoteNo}</TableCell>
              <TableCell>I-NOTE DATE</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.submittedDatetime ? moment(iNoteDetails.submittedDatetime).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")}</TableCell>
              <TableCell>SECTION</TableCell>
              <TableCell>-</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>EP CODE</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.epCode}</TableCell>
              <TableCell>R.F./EST. No.</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.rfEstNo}</TableCell>
              <TableCell>GODOWN No.</TableCell>
              <TableCell>-</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>INSP. AUTH</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.orgName}</TableCell>
              <TableCell>INSPECTOR REF. No.</TableCell>
              <TableCell colSpan={3}>-</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>WARRANTY No.</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.warranty}</TableCell>
              <TableCell>WORK ORDER No.</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.workOrderNo}</TableCell>
              <TableCell>UNIT</TableCell>
              <TableCell>-</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>INDENT/EXTRACTED/IFD No.</TableCell>
              <TableCell colSpan={2}>--</TableCell>
              <TableCell>DATED</TableCell>
              <TableCell colSpan={2} className={classes.input}>
                {iNoteDetails.offerLetterDate}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>I-NOTE TYPE</TableCell>
              <TableCell colSpan={2} className={classes.input}>
                {iNoteDetails.inoteTypeName}
              </TableCell>
              <TableCell>ORDER No.</TableCell>
              <TableCell colSpan={2} className={classes.input}>
                {iNoteDetails.supplyOrderNo}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>CONTRACT-No.</TableCell>
              <TableCell className={classes.input}>{iNoteDetails.contractorName}</TableCell>
              <TableCell>CONTRACT Dt.</TableCell>
              <TableCell>-</TableCell>
              <TableCell>CONTRACT ITEM S.No.</TableCell>
              <TableCell>-</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>DETAILED NOMENCLATURE</TableCell>
              <TableCell colSpan={5} className={classes.input}>
                {iNoteDetails.projectDetails}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>CONSIGNEE</TableCell>
              <TableCell colSpan={5} className={classes.input}>
                {iNoteDetails.consignee}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Qty Submitted</TableCell>
              <TableCell>Qty Accepted</TableCell>
              <TableCell>Qty R/R</TableCell>
              <TableCell>Qty Rejected </TableCell>
              <TableCell>Reason for Rejection or other Remarks </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{iNoteLineItems.tendered}</TableCell>
              <TableCell>
                <Controller
                  name="accepted"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => {
                    return (
                      <CustomizedInputs
                        type="number"
                        placeholder="Accepted Qty"
                        required
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                      />
                    );
                  }}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name="rfr"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => {
                    return (
                      <CustomizedInputs
                        type="number"
                        placeholder="R/R Qty"
                        required
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                      />
                    );
                  }}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name="rejected"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => {
                    return (
                      <CustomizedInputs
                        type="number"
                        placeholder="Rejected Qty"
                        required
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                      />
                    );
                  }}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name="remarks"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => {
                    return (
                      <CustomizedInputs
                        placeholder="Remarks"
                        required
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error?.message}
                      />
                    );
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Typography variant="subtitle1"> Registered Nos.</Typography>

        <Table size="small" className={classes.table}>
          <TableBody>
            {iNoteLineItems.regNos
              ?.reduce(
                (acc, item, index) => {
                  const currentRow = acc[acc.length - 1] || [];
                  currentRow.push(<TableCell key={index}>{item}</TableCell>);

                  if (currentRow.length === 6) {
                    acc.push([]);
                  }

                  return acc;
                },
                [[]]
              )
              .map((row, rowIndex) => (
                <TableRow key={rowIndex}>{row}</TableRow>
              ))}
          </TableBody>
        </Table>

        <Typography variant="body2">
          Note: The Manufacture warranty for 18 months for above device is provided from date of issue Voucher for trouble free operation
          subject to proper storage and use of the product by the user in accordance with the prescribed condition of the products/periodic
          maintenance /handling/transporting
        </Typography>

        <footer style={{ display: "flex", justifyContent: "space-between", marginTop: 150 }}>
          <Typography variant="subtitle2">For Factory</Typography>
          <Typography variant="subtitle2">For Inspection Section</Typography>
          <Typography variant="subtitle2">
            Issued by
            <br />
            Goods/Passenger/Road
          </Typography>
          <Typography variant="subtitle2">For Store Section</Typography>
        </footer>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button style={{ textTransform: "capitalize" }} onClick={handlePrint} variant="contained" color="primary" size="small">
          Print
        </Button>

        <Button
          disabled={saving}
          style={{ textTransform: "capitalize" }}
          onClick={handleSubmit(onSave)}
          variant="contained"
          color={iNoteDetails.submittedDatetime ? "secondary" : "primary"}
          size="small"
        >
          {saving && <CircularProgress size={24} />} {iNoteDetails.submittedDatetime ? "Update" : "Submit"}
        </Button>
      </div>
    </div>
  );
}
