import React, { useState} from "react";
import moment from "moment";

//material-ui
import {
  Grid,
  Dialog,
  IconButton,

} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogActions";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";

//pages
import DeliveryDateForm from "./DeliveryDateForm";
import TableComponent from "components/table";
import { getDdBySO } from "pages/Services/URLs";
import { useSelector} from "react-redux";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import { AMENDMENT_LETTER_TYPE } from "Globals.js";



const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function DeliveryDateDialog({ getSoBySoId }) {


  const selectedSoId = useSelector((store) => store.soReducer.selectedSoId);
 
  const soNum = useSelector((store) => store.soReducer.selectedSoOrderNO);

  const [open, setOpen] = React.useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("this is dialogue", selectedSoId);

  const handleClose = () => {
    setOpen(false);
  };

  const [columns] = useState([
    { title: "Letter Number", field: "letterNo", width: "auto" },
    { title: "Letter Date", field: "letterDate", width: "auto" },
    { title: "New DD", field: "newDdDate", width: "auto" },
    { title: "Remarks", field: "remarks", width: "auto" },
    { title: "DD Uploads", field: "fileDownloadUri", width: "auto" },
   
  ]);

  const getBySupplyOrder = () => {
    setLoading(true);
    axiosInstanceT
      .get(`${getDdBySO}/type/${AMENDMENT_LETTER_TYPE.SUPPLY_ORDER}/id/${selectedSoId}`)  // type: SO = 1
      .then(({ data }) => {
        setRecords(
          data.map((e1, i) => ({
            ...e1,
            letterNo: e1?.letterNo,
            letterDate: e1?.letterDate
              ? moment(e1?.letterDate).format("DD-MM-yyyy")
              : "",
            newDdDate: e1?.newDdDate
              ? moment(e1?.newDdDate).format("DD-MM-yyyy")
              : "",
            remarks: e1?.remarks,
            
            /*
            Fix for IV&V Testlog_13 Sl. 96.1
            API returns [URL, Filename, URL, Filename...]. 
            Filter for odd indexes to show only the Filenames.
            Modified By: Chirag
            */
            fileDownloadUri: e1?.fileDownloadUri
            ?.filter((_, index) => index % 2 !== 0)    // Keep only odd indexes (1, 3, 5...)
            ?.join(", ") || "",
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
  // React.useEffect(() => {
  //   getBySupplyOrder();
  // }, []);

  return (
    <>
      <IconButton
        onClick={(e) => {
          setOpen(true);
          getBySupplyOrder();
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
          <PaperComponent id="draggable-dialog-title7" {...props} />
        )}>
        <DialogTitle
          id="draggable-dialog-title7"
          style={{ position: "sticky", top: 0, zIndex: 2, cursor: "move" }}
          onClose={handleClose}>
          SO/PO Number : {soNum}
        </DialogTitle>

        <DialogContent dividers style={{ position: "relative" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
              <DeliveryDateForm
                getBySupplyOrder={getBySupplyOrder}
                getSoBySoId={getSoBySoId}
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
