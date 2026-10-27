/** @format */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { toast } from "react-toastify";


import axiosInstance from "pages/Services/AxiosInstanceTransaction";

import { useReactToPrint } from "react-to-print";

import SQAE from "assets/Images/sqae_logo.png";
import moment from "moment";
import { PaperComponent } from "Utils/D3Tree";

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
    gap: 10,
    // [theme.breakpoints.down("sm")]: {
    //   display: "block",
    // },
  },
  tableDesign: {
    fontSize: "12px",
    width: "100%",
    // border: "1px solid grey",
    borderCollapse: "collapse",
    "& thead tr td": {
      border: "1px solid grey",
      padding: "0px 2px",
      color: "#205375",
      backgroundColor: "#f6fbff",
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "center",
    },
    "& tbody tr td": {
      border: "1px solid grey",
      padding: "0px 8px",
      fontSize: "13px",
      textAlign: "left",
    },
  },
}));
export default function FagEndNoticeNew({ row, soObj, open, setOpen }) {

  const componentRef = useRef();
  const classes = useStyles();
  const [responseData, setResponseData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const getData = async () => {
    try {
      setLoadingData(true);
      console.log(soObj, "soObj111");
      const { data } = await axiosInstance.get("supplyOrder/" + soObj?.id);
      setResponseData(data);
    } catch (error) {
      console.log(soObj, "soObj111");
      toast.error("Failed to get Data");
      setLoadingData(false);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      {/* <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={12} align="left">
          <Button
            type="Close"
            onClick={() => {
              dispatch(selectItem(<InspectOLTable />));
            }}
            variant="contained"
            color="Secondary"
            size="small"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          // disabled={loading || !isDirty}
          >
            Back
          </Button>
        </Grid>
      </Grid> */}
      <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title305" {...props} />
        )}
      >
        <DialogTitle
          style={{ cursor: "move", fontSize: "0.875rem" }}
          id="draggable-dialog-title305"
        >
          FAG END Notice for SO Number : {soObj.orderNo}
          {/* <span style={{ color: "#4A4A4A" }}>SO/PO Details</span> */}
        </DialogTitle>

        <DialogContent dividers>
          <Paper elevation={2} style={{ padding: "10px" }}>
            <div ref={componentRef} style={{ padding: "30px" }}>
              <div className={classes.container}>
                <div className="print-header">
                  <p className="print-p">दूरभाषा:080-23332890</p>
                  <p className="print-p">Phone:080-23332890</p>
                  <p className="print-p">फ़ैक्स/Fax:080-23332022</p>
                  <p className="print-p">ईमेल/Email: sqaelbg-dgqa@nic.in</p>
                  <p className="print-p">
                    वेबसाइट/website: www.dgqadefence.gov.in
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
                    <img src={SQAE} alt="cqaeLogo" width={80} />

                    {/* <img src={cqaeISO} alt="cqaeISO" height={60} width={180} /> */}
                  </div>
                </div>
                <div>
                  <p className="print-p">भारत सरकार/Government of India</p>

                  <p className="print-p">
                    रक्षा मंत्रालय (डी जी क्यू ए)/Ministry of Defence (DGQA)
                  </p>
                  <p className="print-p">
                    वरिष्ठ गुणता आश्वासन स्थापना (इलेक्ट्रॉनिक्स)
                  </p>
                  <p className="print-p">
                    Senior Quality Assurance Establishment (Eletronics)
                  </p>
                  <p className="print-p">एस. के. गार्डन, बेंसन टाउन डाकघर</p>
                  <p className="print-p">S K Garden, Benson Town PO</p>
                  <p className="print-p">बेंगलुरु-560046/Bangalore-560046</p>
                  <p className="print-p">तारीख / Dt</p>
                </div>
              </div>
              <br />
              <br />
              {loadingData && <CircularProgress />}
              <Typography>No.</Typography>
              <Typography>General Manager</Typography>
              <Typography>Bharat Eletronics</Typography>
              <Typography>Jalahalli PO</Typography>
              <Typography>Bangalore-560046</Typography>
              <Typography align="right" style={{ fontWeight: "600" }}>
                (Kind Attention : {responseData?.salesGroupName})
              </Typography>

              <br />
              <br />
              <Typography
                variant="h6"
                align="center"
                style={{ textDecoration: "underline" }}
              >
                FAG END NOTICE ON DP EXPIRING SUPPLY ORDER(s)
              </Typography>

              <Typography variant="body1">
                1. It is informed that the delivery period (DP) for supply order
                of stores against Supply Orders listed below is expiring withing
                45 days from this day. Your are therefore requested to offer the
                stores well in advance such that this establishment has
                reasonable time to complete QA and acceptance acivities well
                withing the delivery period.
              </Typography>

              <table
                style={{ marginBlock: "28px" }}
                className={classes.tableDesign}
              >
                <thead>
                  <tr>
                    <td>SI No.</td>
                    <td>SO/Indent No.& Date</td>
                    <td>DP</td>
                    <td>Main Eqpt</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      {responseData?.orderNo},{responseData?.indentNo ?? "NA"} ,{" "}
                      {responseData?.indentDate ?? "NA"}
                    </td>
                    <td>
                      {responseData?.dd &&
                        moment(responseData?.dd).format("DD-MMMM-YY")}
                    </td>
                    <td>NA</td>
                  </tr>
                </tbody>
              </table>

              <Typography variant="body1" style={{ marginBottom: "13px" }}>
                2. This fag end notice is issued as the reminder, without
                prejudice to the term and conditions of the Supply Order please.
              </Typography>
            </div>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handlePrint}
          >
            Print
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => setOpen(false)}
            type="submit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
