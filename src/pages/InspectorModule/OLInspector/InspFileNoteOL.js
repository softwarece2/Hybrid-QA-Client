/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../App.css";
//component
import MButton from "@material-ui/core/Button";
import TableComponent from "components/table/index";
import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { getInspectOLApprovalUrlV2 } from "pages/Services/URLs";
import { WING_ID } from "../../../Globals";
//material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import ActionButton from "components/ActionButton";
import Button from "components/Button";
import moment from "moment";
import InspectionFileNote from "pages/Enclosures/Enclosure11/InspectionFileNote";
import InoteNumber from "pages/Enclosures/Enclosure11/InoteNumber";

const useStyles = makeStyles((theme) => ({
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  disable: {
    color: "grey !important",
  },
  root: {
    borderRadius: 4,
    height: 25,
    textTransform: "none",
    cursor: "default",
  },
}));

export default function InspFileNoteOL() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [open, setOpen] = useState(false);
  const [openINote, setOpenINote] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [olNums, setOlNums] = useState("");

  const [columns] = useState([
    isArmy
      ? { title: "QACL Number", field: "olNumber", width: "auto" }
      : { title: "OL Number", field: "olNumber", width: "auto" },
    { title: "SO No", field: "supplyOrderNo", width: "auto" },
    { title: "Offer Date", field: "olDate", width: "auto", sorting: true },
    { title: "Sales Group", field: "salesGroupName", width: "auto" },
    { title: "Project Name", field: "projectName", width: "auto" },
    { title: "Status", field: "fileNoteStatus", width: "auto", sorting: true },
    // { title: "Action", field: "edit", width: "auto" },
    { title: "FileNote", field: "FileNote", width: "auto" },
    { title: "I-Note Nos", field: "noteNo", width: "auto" },
  ]);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);

  const handleClickClose = () => {
    setOpen(false);
  };
  const getInspectOL = () => {
    setLoading(true);
    AxiosInstanceTransaction.get(getInspectOLApprovalUrlV2 + orgId)
      .then(({ data }) => {
        // console.log("rg", data);
        setRecords(
          data.map((el) => ({
            olNumber: el?.olNumber,
            projectName: el?.projectDescription,
            salesGroupName: el?.salesGrpName,
            supplyOrderNo: el?.supplyOrderNo,
            olDate: el?.olDateStr
              ? moment(el?.olDateStr).format("DD-MM-YYYY")
              : null,
            fileNoteStatus: (el?.fileNoteStatus || "")?.includes("Pending") ? (
              <MButton
                style={{
                  color: "#cb0000",
                  backgroundColor: "#ff7d654d",
                }}
                size="small"
                classes={{
                  disabled: classes.disable,
                  root: classes.root,
                }}
              >
                {el?.fileNoteStatus || ""}
              </MButton>
            ) : (el?.fileNoteStatus || "")?.includes("Held") ? (
              <MButton
                style={{
                  color: "#F29339",
                  backgroundColor: "#F5DEB3",
                }}
                size="small"
                classes={{
                  disabled: classes.disable,
                  root: classes.root,
                }}
              >
                {el?.fileNoteStatus || ""}
              </MButton>
            ) : (el?.fileNoteStatus || "")?.includes("File") ? (
              <MButton
                style={{
                  color: "#F298750",
                  backgroundColor: "#EE99C2",
                }}
                size="small"
                classes={{
                  disabled: classes.disable,
                  root: classes.root,
                }}
              >
                {el?.fileNoteStatus || ""}
              </MButton>
            ) : (el?.fileNoteStatus || "")?.includes("Approved") ? (
              <MButton
                style={{ color: "#1b5e20", backgroundColor: "#c8e6c9" }}
                size="small"
                classes={{
                  disabled: classes.disable,
                  root: classes.root,
                }}
              >
                {el?.fileNoteStatus || ""}
              </MButton>
            ) : (el?.fileNoteStatus || "")?.includes("Returned") ? (
              <MButton
                style={{
                  color: "#36454F",
                  backgroundColor: "#C0C0C0",
                }}
                size="small"
                classes={{
                  disabled: classes.disable,
                  root: classes.root,
                }}
              >
                {el.fileNoteStatus}
              </MButton>
            ) : null,

           
            FileNote: (
              <ActionButton
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() =>
                  dispatch(
                    selectItem(
                      <InspectionFileNote
                        fileNoteId={el?.id}
                        soId={el.supplyOrderId}
                        checkEditAccess
                      />
                    )
                  )
                }
                disabled={
                  el?.isReturned ||
                  el?.fileNoteStatus == "File Note Not Generated"
                }
              >
                File Note
              </ActionButton>
            ),
            noteNo: (
              <ActionButton
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => {
                  setSelectedRow(el);
                  setOpenINote(true);
                }}
                disabled={loggedInUser?.roleId !== 2}
              >
                I-Note No
              </ActionButton>
            ),
          }))
        );
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    getInspectOL();
  }, []);

  return (
    <>
      {openINote && (
        <InoteNumber
          fileNoteId={selectedRow.id}
          onClose={() => {
            setOpenINote(false);
          }}
        />
      )}
    
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
           
            title=""
          />
        </Grid>
      </Grid>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
     
        <DialogContent>
          Are you sure you want to merge Offer Letters {olNums}?
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "primary" }}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={handleClickClose}
            variant="contained"
            color="secondary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
