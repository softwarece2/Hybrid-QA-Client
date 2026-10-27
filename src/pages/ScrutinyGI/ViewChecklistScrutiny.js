/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import "jspdf-autotable";

import {
  Dialog,
  Grid,
  Paper,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
} from "@material-ui/core";

//redux
import { useDispatch } from "react-redux";
import { getCheckScrutinyView } from "../../../../Reduxs/Actions/Enclosure/CheckScrutinyAction";

//components

import TableComponent from "components/table";

import Button from "components/Button";
import { PaperComponent } from "Utils/D3Tree";
import axiosInstance from "pages/Services/AxiosInstance";
import { checklistScrutinyTenderGetAll } from "pages/Services/URLs";
import { toast } from "react-toastify";
import { WING_ID } from "Globals.js";

export default function ViewChecklistScrutiny({ selectedSoObj, onClose }) {
  const dispatch = useDispatch();
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

  const fetchScrutinyTenderCheckList = () => {
    if (selectedSoObj?.inspOrgWingId === WING_ID.NAVY) {
      setLoading(true);
      dispatch(getCheckScrutinyView())
        .then((res) => {
          setRecords(res);
          setLoading(false);
        })
        .catch((error) => {
          toast.error("Failed to get data");
          setLoading(false);
        });

      return;
    }
    setLoading(true);
    axiosInstance(checklistScrutinyTenderGetAll)
      .then(({ data }) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to get data");
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchScrutinyTenderCheckList();
  }, [selectedSoObj]);

  console.log(loading, "selectedSoObj");

  return (
    <div>
      <Dialog
        open
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-titlecheckList" {...props} />
        )}
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-titlecheckList"
        >
          {selectedSoObj.inspOrgWingId === WING_ID.NAVY ? (
            <Typography>
              Checklist for Scrutiny of supply order: IS/CKL/001
            </Typography>
          ) : (
            <>
              <Typography
                variant="subtitle2"
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                SQAEL/SEC/ANVIII/7.5.3/FRM-28444
              </Typography>
              <Typography
                variant="subtitle2"
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                Scrutiny of Supply Order/Acceptance of Tender/Contracts
              </Typography>
            </>
          )}
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
            onClick={onClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
