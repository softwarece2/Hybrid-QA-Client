/** @format */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import {
  fagEndNoticeGetFagEndNotice,
} from "pages/Services/URLs";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { selectItem } from "Redux/Actions/SelectTreeItem";
// import cqaenavy from "../../assets/Images/CQAE_NAVY_logo.png";
// import cqaeISO from "../../assets/Images/CqaeISO.png";
import AutoCompleteNew from "components/AutoCompleteNew";
import { getINoteSignatoryList } from "Redux/Actions/Enclosure/INoteAction";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  textField: {
    // textDecoration: "underline",
    fontStyle: "italic",
    fontSize: "17px",
    fontWeight: 600,
    color: "black",
  },
  container: {
    display: "flex",
    // flexWrap: "wrap",
    justifyContent: "space-between",
    // border: "1px solid grey",
    // borderRadius: 4,
    padding: "0 8px 8px",
    // [theme.breakpoints.down("sm")]: {
    //   display: "block",
    // },
  },
}));
export default function FagEndNotice({ row }) {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const classes = useStyles();
  const [responseData, setResponseData] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [signatoryList, setSignatoryList] = useState([]);
  const [selectedSignatory, setSelectedSignatory] = useState(null);
  const [signatoryError, setSignatoryError] = useState(null);
  const [isSignatoryDirty, setIsSignatoryDirty] = useState(false);

  const getSignatories = () => {
    getINoteSignatoryList(loggedInUser?.orgId)
      .then((res) => setSignatoryList(res))
      .catch((err) => toast.error("Something went wrong"));
  };

  const getData = async () => {
    try {
      setLoadingData(true);
      const { data } = await axiosInstance.get(
        fagEndNoticeGetFagEndNotice + row?.id
      );
      setResponseData(data);
    } catch (error) {
      toast.error("Failed to get Data");
      setLoadingData(false);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    getData();
    getSignatories();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // const req = {
      //   id: responseData?.id || 0,
      //   supplyOrderId: responseData?.supplyOrderId,
      //   offerLetterId: row?.id,
      //   empId: selectedSignatory?.id,
      //   orderNo: responseData?.orderNo,
      //   orderDate: responseData?.orderDate,
      //   olNumber: responseData?.olNumber,
      //   offerDate: responseData?.offerDate,
      //   recievedDate: responseData?.recievedDate,
      //   description: responseData?.description,
      //   dd: responseData?.dd,
      //   createdBy: loggedInUser.empId,
      // };
      // const data = await axiosInstance.post(fagEndNoticeSubmit, req);
      setOpenAlert(false);
      getData();
      toast.success("Successfully Saved");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={12} align="left">
          <Button
            type="Close"
            onClick={() => {
              dispatch(selectItem(<InspectOLTable />));
            }}
            variant="contained"
            color="Secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          // disabled={loading || !isDirty}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <Paper elevation={2} style={{ padding: "10px" }}>
        <div ref={componentRef} style={{ padding: "30px" }}>
          <div className={classes.container}>
            <div className="print-header">
              <p className="print-p">
                {" "}
                Tel: {responseData?.soOrganizationDto?.phone}
              </p>
              {/* <p className="print-p">
          {" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;080-2219 5493
        </p> */}
              <p className="print-p">
                Fax:{responseData?.soOrganizationDto?.faxNo}
              </p>
              <br />
              <br />
              <p className="print-p">www.dgqadefence.gov.in</p>
              <p className="print-p">
                email: {responseData?.soOrganizationDto?.email}
              </p>
              <p className="print-p">
                Mobile: {responseData?.soOrganizationDto?.mobileNo}
              </p>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <img src={cqaenavy} alt="cqaeLogo" height={80} /> */}
                {responseData?.soOrganizationDto?.logo && (
                  <img
                    src={
                      "data:image/png;base64," +
                      responseData?.soOrganizationDto?.logo
                    }
                    alt="cqaeLogo"
                    height={80}
                  />
                )}

                {/* <img src={cqaeISO} alt="cqaeISO" height={60} width={180} /> */}
              </div>
            </div>
            <div>
              <p className="print-p">भारत सरकार</p>
              <p className="print-p">Government of India</p>
              <p className="print-p">रक्षा मंत्रालय</p>
              <p className="print-p">Ministry of Defence (DGQA)</p>
              <p className="print-p">वरिष्ठ् गुणता आश्वासन स्थापना (यु उ)</p>
              <p className="print-p">
                {responseData?.soOrganizationDto?.organizationName}
              </p>
              <p className="print-p">
                {responseData?.soOrganizationDto?.organizationNameHi}
              </p>
              <p className="print-p">
                {responseData?.soOrganizationDto?.address}
              </p>
              <p className="print-p">
                {responseData?.soOrganizationDto?.addressHi}
              </p>
            </div>
          </div>
          <br />
          <br />
          {loadingData && <CircularProgress />}
          <Typography>
            {responseData?.sgOrganizationDto?.organizationName}
          </Typography>
          <Typography>
            {responseData?.soOrganizationDto?.organizationNameHi}
          </Typography>
          <Typography>
            {"[Kind Attention ShriShashikantShakapur DGM(QA - NSII)] "}
          </Typography>

          <Typography> {responseData?.sgOrganizationDto?.address} </Typography>
          <Typography>{responseData?.sgOrganizationDto?.addressHi}</Typography>

          <br />
          <br />
          <Typography
            variant="h6"
            align="center"
            style={{ textDecoration: "underline" }}
          >
            SUB: FAG END NOTICE FOR CONTRACT NO. {responseData?.orderNo} DATED{" "}
            {responseData?.orderDate && moment().format("DD MMM YYYY")} FOR
            SUPPLY OF {responseData?.categoryName} FOR {responseData?.projName}
          </Typography>

          <div style={{ paddingLeft: "14px", marginTop: "12px" }}>
            <Typography variant="body1" style={{ marginBottom: "13px" }}>
              1. Ref: QA Call letter No.<span>{responseData?.olNumber}</span>
              dated&nbsp;
              <span className={classes.textField}>
                {responseData?.offerDate}
              </span>
              .
            </Typography>

            <Typography variant="body1" style={{ marginBottom: "13px" }}>
              The date of delivery in relation to the subject Contract expires
              on 10 Feb 20 and stores offered vide your above cited chaltan have
              been submitted for inspection at a very late stage and it is not
              possible to condude the inspection before the expiry of the
              delivery period. The stores offered for Inspection will, however,
              be inspected till the completion of the inspection, which can be
              after the expiry of the delivery period, but is neither intended
              nor to be construed as keeping the contract alive.
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "13px" }}>
              3. In the above context, please note that stores inspected will
              not be dispatched till such time further extension of Delivery
              period is granted by Purchase officer and accepted by you If
              stores are dispatched before obtaining extension of delivery
              period, it will be solely at your risk. The purchaser will also
              have a right to cancel the contract and it shall be no defence,
              that consignee has taken the delivery of stores without getting an
              extension letter of delivery period and therefore, the contract
              has been kept alive.
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "13px" }}>
              4. This is issued without prejudice to the right and remedies
              available to the purchaser in terms and conditions of the contract
              as applicable on behalf.
            </Typography>
          </div>

          <Grid container justifyContent="flex-end">
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              {responseData?.submittedDate ? (
                <>
                  <Typography className={classes.textSizeBold}>
                    {responseData?.issuerSignature}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {responseData?.issuerDesignation}
                  </Typography>
                </>
              ) : (
                <>
                  <AutoCompleteNew
                    labelText="Select Signatory"
                    data={signatoryList}
                    getOptionLabel={(o) => o?.ename}
                    onChange={(e, v) => {
                      setSelectedSignatory(v);
                      setIsSignatoryDirty(true);
                    }}
                    value={selectedSignatory}
                    required
                  />
                  <FormHelperText error={!!signatoryError?.error}>
                    {signatoryError?.msg}
                  </FormHelperText>{" "}
                </>
              )}
              {selectedSignatory && (
                <>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.enameHi}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.ename}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.designationHi}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.designation}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.roleNameHi}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    {selectedSignatory?.roleName}
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    वरिष्ठ् गुणवत्ता आश्वासन अधिकारी के लिए
                  </Typography>
                  <Typography className={classes.textSizeBold}>
                    For Senior Quality Assurance Officer
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>

          {/* <Typography align="right" gutterBottom>
            Signature :{" "}
            <span className={classes.textField}>
              {responseData?.issuerSignature}
            </span>
          </Typography>
          <Typography align="right" gutterBottom>
            Name :{" "}
            <span className={classes.textField}>
              {responseData?.issuerName}
            </span>
          </Typography>
          <Typography align="right" gutterBottom>
            Designation :{" "}
            <span className={classes.textField}>
              {responseData?.issuerDesignation}
            </span>
          </Typography> */}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "30px",
          }}
        >
          {responseData?.submittedDate ? (
            <Button variant="contained" color="primary" onClick={handlePrint}>
              Print
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={!responseData || responseData?.submittedDate}
              onClick={() => {
                setOpenAlert(true);
              }}
            >
              Submit
            </Button>
          )}
        </div>
      </Paper>
      <Dialog
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        maxWidth="lg"
      >
        <DialogContent>
          <Typography variant="h6">Are you sure you want to submit</Typography>
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={!responseData || responseData?.submittedDate || loading}
            size="small"
          >
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
            &nbsp; Yes
          </Button>
          <Button
            onClick={() => {
              setOpenAlert(false);
            }}
            color="secondary"
            variant="contained"
            size="small"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
