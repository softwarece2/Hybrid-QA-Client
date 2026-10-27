import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
} from "@material-ui/core";
import * as yup from "yup";

import { StyledTableCell, StyledTableCellPrint } from "components/UseTable";

import olfdn from "assets/Images/olf_dn_logo.png";
import iol from "assets/Images/IOL_logo.png";
import { Controller, useForm } from "react-hook-form";
import AutoCompleteNew from "components/AutoCompleteNew";
import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { StyledTableRow } from "Utils";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWatch } from "react-hook-form";
import { USER_DEPARTMENT, USER_ROLE_ID } from "Globals.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
const useStyles = makeStyles((theme) => ({
  size: {
    width: 15,
    height: 15,
  },
  table: {
    width: "70%",
    margin: "0 auto",
  },
  tableCell: {
    border: "1px solid black",
  },
  textSizeBold: {
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  subHeading: {
    fontSize: "0.8rem",
    fontWeight: 600,
 
  },
  subTitleHeading: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    wordBreak: "none",
  },
  dateMargin: {
    marginLeft: "250px",
    textAlign: "left",  
    display: "block",
    width: "100%",
    "@media print": {
      marginLeft: "200px !important",
      textAlign: "left !important",
      width: "100% !important",
      display: "block !important",
    },
  },
}));

const defaultValues = [
  {
    id: 2,
    name: "CQAE Admin",
  },
];

const schema = yup.object().shape({
  warrantDuration: yup
    .object()
    .typeError("Warrant Duration is required")
    .required("required"),
});

export function WarrentCertificate({ olId, internalinote }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [Warranttype, setWarranttype] = useState(false);
  const empId = useSelector((state) => state?.loggedInUser?.empId);

  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const isHOS =
    loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS &&
    loggedInUser.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;
  const isDOA = loggedInUser.roleId === USER_ROLE_ID.ROLE_DOA;

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      warrantDuration: null,
    },
    mode: "onChange",
  });
  const [saving, setSaving] = useState(false);
  const [noteData, setNoteData] = useState([]);
  const watchedRoleId = watch("roleId");
  const printRef = useRef();
  const handleDataChange = (item, value) => {
    const newData = [...noteData];
    newData[item].data = value;
    setNoteData(newData);
  };
async function getAllname() {
    try {
      const { data } = await axiosInstance(`/warrantType/getAll`);
      setWarranttype(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllname();
  }, [olId]);

  async function getWarrant() {
    try {
      const url = internalinote
        ? `warrantCertificate/getWarrantCertificateDetailsInternal/${olId}`
        : `warrantCertificate/getWarrantCertificateDetails/${olId}`;

      const { data } = await axiosInstanceTrans(url);
      setNoteData(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getWarrant();
  }, []);

  const [selectedWarrantType, setSelectedWarrantType] = useState(null);
  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const req = {
        warrantType: data?.warrantDuration?.id,
        inoteId: olId,
        startDate: data?.startDate,
        endDate: data?.endDate,
        authorityId: empId,
        createdBy: empId,
      };
      await axiosInstanceTrans.post("warrantCertificate/save", req);
      toast.success("Submitted Successfully");
      reset();
      // setTimeout(() => {
      getWarrant();
      // }, 2000);
    } catch (error) {
      toast.error("Failed to Submit");
    } finally {
      setSaving(false);
    }
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const watchedStartDate = useWatch({
    control,
    name: "startDate",
  });

  const handleApprove = async () => {
    try {
      await axiosInstanceTrans.post(`warrantCertificate/${olId}/approve`);
      toast.success("Approved Successfully");
      getWarrant();
    } catch (error) {
      toast.error("Failed to Approve");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={() => dispatch(selectItem(<DetailsINote />))}
        startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
        style={{ marginLeft: "15%", marginBottom: "10px" }}
      >
        Back
      </Button>
      <div ref={printRef}>
        <Grid container spacing={2} className={classes.table}>
          <Grid
            item
            xs={3}
            sm={3}
            md={3}
            lg={3}
            xl={3}
            className={classes.tableCell}
          >
            <img
              src={iol}
              alt="olf-Logo"
              height={130}
              align="center"
              style={{ margin: "auto", marginBottom: "8px" }}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            align="center"
            className={classes.tableCell}
          >
            <Typography style={{ fontWeight: "bold" }}>
              ऑप्टो इलेक्ट्रॉनिक्स फैक्ट्री
            </Typography>
            <Typography variant="subtitle2">
              (इंडिया ऑप्टेल लिमिटेड की इकाई)
            </Typography>
            <Typography variant="subtitle2">
              (भारत सरकार का उपक्रम, रक्षा मंत्रालय)
            </Typography>

            <Typography style={{ fontWeight: "bold", marginTop: "10px" }}>
              Opto Electronics Factory
            </Typography>
            <Typography variant="subtitle2">
              (A Unit of INDIA OPTEL LIMITED)
            </Typography>
            <Typography variant="subtitle2">
              (A Govt of India Enterprises, Ministry of Defence)
            </Typography>
          </Grid>

          <Grid
            item
            xs={3}
            sm={3}
            md={3}
            lg={3}
            xl={3}
            align="center"
            className={classes.tableCell}
          >
            <img
              src={olfdn}
              alt="olf-Logo"
              height={130}
              style={{ margin: "auto", marginBottom: "8px" }}
            />
          </Grid>
        </Grid>
        <Typography
          variant="h4"
          align="center"
          color="primary"
          style={{
            fontWeight: "bold",
            marginBottom: "10px",
            marginTop: "20px",
          }}
        >
          <u>Warranty Certificate</u>
        </Typography>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          align="center"
          style={{ margin: "auto", overflowX: "auto" }}
        >
          <Grid container>
            {loading && <LinearProgress />}
            <Table className={classes.table} size="small">
              <TableBody>
                {noteData && noteData.length > 0 ? (
                  <React.Fragment key={noteData[0].id}>
                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          Item Code
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          {noteData[0].itemCode}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          Nomenclature of Store
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          {noteData[0].nomenclature}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          Drawing No
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          {noteData[0].drawingNo}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          Indent / IFD / Deemed Contract No with Date
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          {noteData[0].contractNo}  {", "}Dt-{noteData[0].contractDate}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          I-Note No and Date
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          {noteData[0].inoteNo} {", "}Dt-
                          {noteData[0].inoteDate
                            ? moment(noteData[0].inoteDate).format("DD-MM-YYYY")
                            : ""}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          Quantity tendered on I-Note (with / without Regd. No)
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.subHeading}>
                          {noteData[0].qty},({noteData[0].regNos1})
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  </React.Fragment>
                ) : (
                  <TableRow>
                    <StyledTableCell colSpan={2} align="center">
                      No Data Found
                    </StyledTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        {noteData[0]?.id ? (
          <Typography style={{ marginTop: "30px", marginLeft: "250px" }}>
            Warrant Duration:{noteData[0]?.warrantTypeName}
          </Typography>
        ) : (
          <Grid container className={classes.table}>
            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              lg={3}
              xl={3}
              style={{ marginTop: "30px" }}
            >
              <Controller
                name="warrantDuration"
                control={control}
                render={({ field }) => (
                  <AutoCompleteNew
                    data={Warranttype}
                    value={field.value}
                    labelText=" Select Warrant Duration"
                    labelPlacement="left"
                    getOptionLabel={(o) => o?.warrantType || ""}
                    isOptionEqualToValue={(o, v) => o?.id === v?.id}
                    disabled={isDOA || noteData[0]?.id}
                    onChange={(e, v) => {
                      field.onChange(v);
                      setSelectedWarrantType(v);
                    }}
                    error={!!errors.warrantDuration}
                    helperText={errors.warrantDuration?.message}
                    required
                  />
                )}
              />
            </Grid>
          </Grid>
        )}
        {noteData[0]?.startDate || noteData[0]?.endDate ? (

          <Typography
           className={classes.dateMargin} 
            style={{
              fontWeight: "bold",
            }}
          >
            Start Date:{" "}
            {noteData[0]?.startDate
              ? moment(noteData[0]?.startDate).format("DD-MM-YYYY")
              : "N/A"}
            {"  |  "}
            End Date:{" "}
            {noteData[0]?.endDate
              ? moment(noteData[0]?.endDate).format("DD-MM-YYYY")
              : "N/A"}
          </Typography>
        ) : (
          selectedWarrantType?.warrantType === "Custom Date" && (
            <Grid
              container
              className={classes.table}
              style={{ marginTop: "20px" }}
            >
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Start Date"
                      type="date"
                      variant="outlined"
                      size="small"
                      fullWidth
                      onKeyDown={
                        (e) => e.preventDefault() //IVNV Observation Modified by:Pooja Kariger Date:07-07-2026
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} style={{ marginLeft: "20px" }}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="End Date"
                      type="date"
                      fullWidth
                      size="small"
                      variant="outlined"
                      onKeyDown={
                        (e) => e.preventDefault() //IVNV Observation Modified by:Pooja Kariger Date:07-07-2026
                      }
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        min: watchedStartDate ? watchedStartDate : "",
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )
        )}
        <Grid container className={classes.table}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ marginTop: "30px" }}
          >
            <Typography>
              Above detailed item shall deem to bear a warranty for a period of
              one / two year from the date of receipt of item by consignee.
              During this period if any item is found to be defective due to
              manufacturing defect subjected to the required condition of
              storage , use & maintenance are fulfilled , the same shall be
              repaired / replaced by OLF , Dehradun.
            </Typography>
          </Grid>
  
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ marginTop: "30px" }}
          >
            <Typography
              style={{
                fontWeight: 600,
                marginTop: "1px",
                float: "right",
                align: "center",
              }}
            >
               {noteData[0]?.doaApproverName}
              <br />
              (Production Officer)
              <br />
              For Chief General Manager
              <br />
              OLF, Raipur, Dehradun
            </Typography>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <Typography align="center"><b>Note:This Document is Online Generated and Digitally Signed. Physical Signature is not required.</b></Typography>

          
          </Grid>
        </Grid>
      </div>
      {/* <div style={{ textAlign: "center", marginTop: "12px" }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                    <Button
                      type="submit"
                       variant="contained"
                      color="secondary"
                      onClick={handleSubmit(onSubmit)}
                      disabled={noteData[0]?.approvalDate}
                      style={{ marginRight: '12px' }}
                     >
                      Submit
                    </Button>
                    <Button
          type="submit"
          variant="contained"
         color="secondary"
          onClick={handlePrint}
         disabled={!noteData[0]?.approvalDate}
        >
          Print
        </Button>
                  </Grid>
        
      </div> */}

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          {isHOS ? (
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              onClick={handleSubmit(onSubmit)}
              disabled={noteData[0]?.id}
              style={{ marginRight: "12px" }}
            >
              Generate
            </Button>
          ) : isDOA && noteData[0]?.id && !noteData[0]?.isDoaApproved ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleApprove}
              disabled={!noteData[0]?.id}
              style={{ marginRight: "12px" }}
            >
              Approve
            </Button>
          ) : null}

          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={handlePrint}
            disabled={!noteData[0]?.approvalDate || !noteData[0]?.isDoaApproved}
          >
            Print
          </Button>

          {isDOA && !noteData[0]?.id ? (
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontWeight: "bold", marginTop: "10px", color: "orange" }}
            >
              (Warranty certificate has not been generated yet.)
            </Typography>
          ) : (
            noteData[0]?.id &&
            !noteData[0]?.isDoaApproved &&
            !isDOA && (
              <Typography
                variant="subtitle1"
                align="center"
                style={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  color: "orange",
                }}
              >
                (Awaiting DOA approval)
              </Typography>
            )
          )}
        </Grid>
      </div>
    </div>
  );
}
