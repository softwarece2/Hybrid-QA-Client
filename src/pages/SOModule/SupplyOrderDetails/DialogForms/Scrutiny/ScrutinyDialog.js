import React, { useState } from "react";

//material-ui
import { Dialog, Grid, IconButton} from "@material-ui/core";
import { default as MuiDialogContent } from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";

//icons
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import TableComponent from "components/table";
import ScrutinyForm from "./ScrutinyForm";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";



const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function ScrutinyDialog() {
  

  const [open, setOpen] = React.useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [columns] = useState([
    { title: "Letter No", field: "article", width: "auto", sorting: true },
    { title: "Letter Date", field: "precedence", width: "auto" },
    { title: "Subject", field: "precedence", width: "auto" },
    { title: "Amendments", field: "precedence", width: "auto" },
    { title: "Amendments of", field: "precedence", width: "auto" },
    { title: "Remarks", field: "precedence", width: "auto" },
  ]);

  return (
    <>
      <IconButton
        onClick={(e) => {
          setOpen(true);
        }}
        style={{ marginTop: 14 }}>
        <AssignmentTurnedInOutlinedIcon />
      </IconButton>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        maxWidth="lg"
        fullWidth
        open={open}
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title101" {...props} />
        )}>
        <DialogTitle
          id="draggable-dialog-title101"
          onClose={handleClose}
          style={{ cursor: "move" }}>
          SO/PO Number :
        </DialogTitle>

        <DialogContent dividers style={{ position: "relative" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
              <ScrutinyForm />
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
