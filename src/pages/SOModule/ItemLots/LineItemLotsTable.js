/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import "../../../App.css";

//pages
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";

//component
import TableComponent from "components/table/index";
import moment from "moment";

//material-ui
import { Dialog, Grid} from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import {useSelector } from "react-redux";
import { AMENDMENT_LETTER_TYPE } from "Globals.js";
//icons
import { DialogTitle } from "Utils";
import { getILBySoId } from "pages/Services/URLs";
import { PaperComponent } from "Utils/D3Tree";
import LineItemLotsForm from "./lineItemLotsForm";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function LineItemLotsTable({ getSoBySoId ,open,setOpen, selectedLineItem  }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const soId = useSelector((store) => store.soReducer.selectedSoId);

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
    axiosInstanceT
      .get(`${getILBySoId}/type/${AMENDMENT_LETTER_TYPE.SO_LINE_ITEM}/id/${selectedLineItem?.id}`)
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
  React.useEffect(() => {
    getIL();
  }, [soId]);
  return (
    <>
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
          style={{ position: "sticky", top: 0, zIndex: 2, cursor: "move" }}
          onClose={handleClose}
          id="draggable-dialog-title30">
          Line Item No.:{selectedLineItem?.lineItemNo}
        </DialogTitle>

        <DialogContent dividers style={{ position: "relative" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
              <LineItemLotsForm getIL={getIL} getSoBySoId={getSoBySoId} selectedLineItem={selectedLineItem} />
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
