/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import TableComponent from "components/table";
import { useEffect, useState } from "react";
import { WING_ID } from "../../../Globals";
//component
import Controls from "components/controls/Controls";
import { PaperComponent } from "Utils/D3Tree";
import TextField from "../../../../components/TextField";
import ViewSO from "../View/ViewSO";
import { useSelector } from "react-redux";

const ApprovalTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSODialog, setOpenSODialog] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [openRemarksDialog, setOpenRemarksDialog] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [columns] = useState([
    {
      title: "Inspector",
      field: "inspector",
      width: "auto",
      filtering: true,
    },
    {
      title: "SBU",
      field: "sbu",
      width: "auto",
      sorting: true,
    },
    isArmy ? { title: "SO/QACL", field: "so", width: "auto" } : { title: "SO/OL", field: "so", width: "auto" },
    {
      title: "View",
      field: "view",
      width: "auto",
      filtering: false,
      sorting: false,
    },
    {
      title: "Actions",
      field: "actions",
      width: "auto",
      filtering: false,
      sorting: false,
    },
  ]);

  const fields = [
    {
      inspector: "Inspector 1",
      sbu: "ADSN",
      so: "sadhgs321312",
    },
    {
      inspector: "Inspector 2",
      sbu: "ADSN",
      so: "dsfa1231212",
    },
    {
      inspector: "Inspector 3",
      sbu: "ADSN",
      so: "fsdasfd2342134",
    },
    {
      inspector: "Inspector 4",
      sbu: "NS1",
      so: "fdhg435345",
    },
    {
      inspector: "Inspector 5",
      sbu: "NS2",
      so: "ghdfgh23423141234",
    },
  ];

  useEffect(() => {
    const data = fields.map((item) => ({
      ...item,
      view: <Controls.Button text="View" color="default" size="small" onClick={handleOpenSODialog} />,
      actions: (
        <>
          <Controls.Button text="Approve" color="primary" size="small" onClick={handleApprove} />
          <Controls.Button text="Reject" color="secondary" size="small" onClick={handleReject} />
        </>
      ),
    }));
    setRecords(data);
  }, []);

  const handleOpenSODialog = (e) => {
    setOpenSODialog(true);
  };

  const handleCloseSODialog = (e) => {
    setOpenSODialog(false);
  };

  const handleOpenRemarksDialog = (e) => {
    setOpenRemarksDialog(true);
  };

  const handleCloseRemarksDialog = (e) => {
    setOpenRemarksDialog(false);
  };

  const handleApprove = () => {
    handleOpenRemarksDialog();
    setIsApproved(true);
  };

  const handleReject = () => {
    handleOpenRemarksDialog();
    setIsApproved(false);
  };

  const handleSubmit = () => {
    handleCloseRemarksDialog();
    handleCloseSODialog();
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent isLoading={loading} data={records} columns={columns} title="" />
        </Grid>
      </Grid>

      {/*-----------------------View SO Dialog---------------------------- */}
      <Dialog
        open={openSODialog}
        onClose={handleCloseSODialog}
        maxWidth="lg"
        PaperComponent={(props) => <PaperComponent id="draggable-dialog-title43" {...props} />}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title43">
          Supply Order Details
        </DialogTitle>
        <DialogContent>
          <ViewSO />
        </DialogContent>

        <DialogActions>
          <Controls.Button text="Close" color="primary" size="small" onClick={handleCloseSODialog} />
          {/* <Controls.Button
            text="Reject"
            color="default"
            size="small"
            onClick={handleReject}
          />
          <Controls.Button
            text="Approve"
            color="secondary"
            size="small"
            onClick={handleApprove}
          /> */}
        </DialogActions>
      </Dialog>

      {/*-----------------------Remarks Dialog---------------------------- */}
      <Dialog open={openRemarksDialog} onClose={handleCloseRemarksDialog} maxWidth="lg">
        <DialogTitle>{isApproved ? "Approval Remarks" : "Rejection Remarks"}</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => {
              setRemarks(e.target.value);
            }}
            multiline
            // rows={4}
            value={remarks}
            size="small"
            placeholder="Remarks"
          />
        </DialogContent>
        <DialogActions>
          <Controls.Button text="Close" color="secondary" size="small" onClick={handleCloseRemarksDialog} />
          <Controls.Button text="Submit" color="primary" size="small" onClick={handleSubmit} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApprovalTable;
