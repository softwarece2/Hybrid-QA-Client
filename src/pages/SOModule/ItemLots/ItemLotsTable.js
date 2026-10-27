/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import "../../../App.css";

//pages
import ItemLotsForm from "./ItemLotsForm";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";

//component
import TableComponent from "components/table/index";
import moment from "moment";


//material-ui
import { Dialog, Grid, IconButton} from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import {useSelector } from "react-redux";
import NoteAddIcon from "@material-ui/icons/NoteAdd";

//icons

import { DialogTitle } from "Utils";
import { getILBySoId } from "pages/Services/URLs";
import { PaperComponent } from "Utils/D3Tree";
import { AMENDMENT_LETTER_TYPE } from "Globals.js";





const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function ItemLotsTable({ getSoBySoId }) {

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const soId = useSelector((store) => store.soReducer.selectedSoId);
  const soNum = useSelector((store) => store.soReducer.selectedSoOrderNO);

  const [columns] = useState([
    { title: "Lot Number", field: "lotNo", width: "auto", filtering: true },
    {
      title: "Letter Number",
      field: "ilLetterNo",
      width: "auto",
      sorting: true,
    },
    { title: "Letter Date", field: "ilLetterDate", width: "auto" },
    { title: "Item Lots Uploads ", field: "fileDownloadUri", width: "auto" },
    ]);

  const handleClose = () => {
    setOpen(false);
  };
  const getIL = () => {
    setLoading(true);
    console.log("fjghfgfgiur");
    axiosInstanceT
      .get(`${getILBySoId}/type/${AMENDMENT_LETTER_TYPE.SUPPLY_ORDER}/id/${soId}`)  // type: SO = 1
      .then(({ data }) => {
        setRecords(
          data.map((e1, i) => ({
            ...e1,
            ilLetterDate: e1?.ilLetterDate
              ? moment(e1?.ilLetterDate).format("DD-MM-yyyy")
              : "",
            ilLetterNo: e1?.ilLetterNo,
            lotNo: e1?.lotNo,
            status: e1?.status,
            /*
            Fix for IV&V Testlog_13 Sl. 92.1
            API returns [URL, Filename, URL, Filename...]. 
            Filter for odd indexes to show only the Filenames.
            Modified By: Chirag
            */
            fileDownloadUri: e1?.fileDownloadUri
            ?.filter((_, index) => index % 2 !== 0)    // Keep only odd indexes (1, 3, 5...)
            ?.join(", ") || "",
          }))
        );
        console.log("records", records);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  React.useEffect(() => {
    getIL();
    console.log("fjghiur");
  }, [soId]);
  return (
    <>
      <IconButton
        onClick={(e) => {
          setOpen(true);
          getIL();
        }}
        style={{ marginTop: 14 }}>
        <NoteAddIcon />
      </IconButton>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        maxWidth="lg"
        fullWidth
        open={open}
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title30" {...props} />
        )}>
        <DialogTitle
          // id="customized-dialog-title"
          style={{ position: "sticky", top: 0, zIndex: 2, cursor: "move" }}
          onClose={handleClose}
          id="draggable-dialog-title30">
          Supply Order Number : {soNum}
        </DialogTitle>

        <DialogContent dividers style={{ position: "relative" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
              <ItemLotsForm getIL={getIL} getSoBySoId={getSoBySoId} />
            </Grid>

            <Grid item xs={12} align="center">
              <TableComponent
                isLoading={loading}
                data={records}
                columns={columns}
                title=""
                // options={{ filtering: false, sorting: false }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
