/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import "jspdf-autotable";
import axiosInstance from "pages/Services/AxiosInstance";
//material-ui
import {
  Dialog,
  Grid,
  DialogContent,
  DialogActions,
} from "@material-ui/core";


//redux
import { useDispatch } from "react-redux";
import TableComponent from "components/table";
import { DialogTitle } from "Utils";

import Button from "components/Button";
import { getViewScrutinyOl,} from "Redux/Actions/Enclosure/CheckScrutinyOLAction";
import { PaperComponent } from "Utils/D3Tree";
import { checklistScrutinyQaclGetAll } from "pages/Services/URLs";
import { toast } from "react-toastify";




export default function OLView({ soObj, open, setOpen }) {


  const [qaclCheckList, setQaclCheckList] = useState([]);
  const componentRef = React.useRef();

  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

  const [records, setRecords] = useState([]);

  console.log("sdasvygev", soObj?.id);


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
    dispatch(getViewScrutinyOl()).then((res) => {
      setRecords(res);
    });
  }, []);
  const handleClose = () => {
    setOpen(false);
  };


  const fetchScrutinyCheckList = async () => {
    try {
      const { data } = await axiosInstance.get(checklistScrutinyQaclGetAll);
      const sortedData=data.sort((a,b)=>(a.id - b.id))
      setQaclCheckList(sortedData);
    } catch (error) {
      toast.error("Failed to get ");
      setQaclCheckList([]);
    }
  };

  React.useEffect(() => {
    setLoading(false);
    dispatch(getViewScrutinyOl())
      .then((res) => {
        setRecords(res);
      })
      .catch((error) => {
        setLoading(false);
        setRecords([]);
      });
    setLoading(false);
    fetchScrutinyCheckList();
  }, []);


return (
    <div>
      <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title40" {...props} />
        )}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title40">
          Checklist for Scrutiny of Offering letter: IS(IB)/CKL/002
        </DialogTitle>

        <DialogContent>
          <div ref={componentRef}>
            <form>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TableComponent
                  isLoading={loading}
                  data={records}
                  columns={columns}
                  pageSize={30}
                  title=""
                />
              </Grid>
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
