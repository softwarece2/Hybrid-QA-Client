/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import "jspdf-autotable";
//material-ui
import {
  Dialog,
  Grid,
  Paper,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";


//redux
import { useDispatch } from "react-redux";
import { getCheckScrutinyView } from "../../../../Redux/Actions/Enclosure/CheckScrutinyAction";

//components

import TableComponent from "components/table";
import Button from "components/Button";
import { PaperComponent } from "Utils/D3Tree";





export default function ViewChecklistScrutiny({
  soObj,
  openView,
  onClose,
  setOpenView,
}) {
  
  const dispatch = useDispatch();

  // const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);


  const [records, setRecords] = useState([]);



  const componentRef = React.useRef();



 

  const [columns] = useState([
    {
      title: "Sl No",
      field: "slNo",
      minWidth: 10,
    },
    {
      title: "Reference",
      field: "reference",
      minWidth: 1100,
    },
  ]);


 

  
  React.useEffect(() => {
    dispatch(getCheckScrutinyView()).then((res) => {
      setRecords(res);
    });
  }, []);
  const handleClose = () => {
    setOpenView(false);
  };



  return (
    <div>
      <Dialog
        open={openView}
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title##" {...props} />
        )}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title##">
          Checklist for Scrutiny of supply order: IS/CKL/001
        </DialogTitle>

        <DialogContent>
          <div ref={componentRef}>
            <form>
              <Paper>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <TableComponent
                    isLoading={loading}
                    data={records}
                    columns={columns}
                    pageSize={30}
                    title=""
                  />
                </Grid>
              </Paper>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
