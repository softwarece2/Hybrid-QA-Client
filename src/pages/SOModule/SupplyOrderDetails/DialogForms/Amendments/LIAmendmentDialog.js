/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import moment from "moment";
import React, { useState } from "react";

//material-ui
import { Dialog, Grid } from "@material-ui/core";
import {

  default as MuiDialogContent,
} from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";

//icons
import TableComponent from "components/table";

//pages
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { getALBySO } from "pages/Services/URLs";
import { useSelector } from "react-redux";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import LIAmendmentsForm from "./LIAmendmentsForm";
import { AMENDMENT_LETTER_TYPE } from "Globals.js";


const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);


export default function LIAmendmentsDialog({ getSoBySoId, open, setOpen, selectedLineItem }) {
  const selectedSoId = useSelector((store) => store.soReducer.selectedSoId);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("this is dialogue", selectedSoId);
  const handleClose = () => {
    setOpen(false);
  };

  const [columns] = useState([
    { title: "Letter No", field: "letterNo", width: "auto", sorting: true },
    { title: "Letter Date", field: "letterDate", width: "auto" },
    { title: "Subject", field: "subject", width: "auto" },
    { title: "Amendments", field: "amendments", width: "auto" },
    { title: "Amendments of", field: "amendmentsOf", width: "auto" },
    { title: "Remarks", field: "remarks", width: "auto" },
    { title: "Upload Amendments", field: "fileDownloadUri", width: "auto" },
  ]);
  const getAmendmentsIL = () => {
    setLoading(true);
    axiosInstanceT
      .get(`${getALBySO}/type/${AMENDMENT_LETTER_TYPE.SO_LINE_ITEM}/id/${selectedLineItem?.id}`)

      .then(({ data }) => {
        setRecords(
          data.map((e1, i) => ({
            ...e1,
            letterNo: e1?.letterNo,
            letterDate: e1?.letterDate
              ? moment(e1?.letterDate).format("DD-MM-yyyy")
              : "",
            subject: e1?.subject,
            amendments: e1?.amendments,
            amendmentsOf: e1?.amendmentsOf,
            remarks: e1?.remarks,
            fileDownloadUri: e1?.fileDownloadUri?.join("\n") || "",
          }))
        );
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  console.log("this is get");
  React.useEffect(() => {
    getAmendmentsIL();
  }, []);

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        maxWidth="lg"
        fullWidth
        open={open}
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title45" {...props} />
        )}>
        <DialogTitle
          id="draggable-dialog-title45"
          style={{ position: "sticky", top: 0, zIndex: 2, cursor: "move" }}
          onClose={handleClose}>
          Line Item No. : {selectedLineItem?.lineItemNo}
        </DialogTitle>

        <DialogContent dividers style={{ position: "relative" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
              <LIAmendmentsForm
                getAmendmentsIL={getAmendmentsIL}
                getSoBySoId={getSoBySoId}
                selectedLineItem={selectedLineItem}
              />
            </Grid>

            <Grid item xs={12} align="center">
              <TableComponent
                isLoading={loading}
                data={records}
                columns={columns}
                title=""
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
