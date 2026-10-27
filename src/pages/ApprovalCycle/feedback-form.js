import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@material-ui/core";
import POObsTableArmyMr from "./POObsTableArmyMr";
import { useEffect, useState } from "react";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { soApprovalFeedBackUpdateSo } from "pages/Services/URLs";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { USER_ROLE_ID } from "Globals.js";

export default function FeedbackForm({
  selectedSupplyOrder,
  onClose,
  selectedRow,
  refresh,
}) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [errors, setErrors] = useState({ error: false, message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [remarks, setRemarks] = useState("");
  const handleSubmit = () => {
    if (!remarks) {
      setErrors({ error: true, message: "Remark is required" });
      return;
    }
    const req = {
      id: selectedRow.id,
      qaoRemarks: remarks,
    };
    axiosInstance
      .post(soApprovalFeedBackUpdateSo, req)
      .then(({ data }) => {
        toast.success("Updated successfully");
        refresh();
        onClose();
      })
      .catch((err) => {
        toast.error("Failed to update!, try again");
      })
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    setRemarks(selectedRow?.qaoRemarks ?? "");
  }, [selectedRow]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <POObsTableArmyMr rowData={selectedSupplyOrder} hide feedbackForm />
        <Typography>Remarks</Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          variant="outlined"
          placeholder="Enter feedback remarks here..."
          error={errors.error}
          helperText={errors.message}
          inputProps={{
            readOnly:
              submitting ||
              selectedRow.qaoRemarks ||
              loggedInUser.roleId !== USER_ROLE_ID.ROLE_DC,
          }}
          value={remarks}
          onChange={(e) => {
            setRemarks(e.target.value);
            setErrors({ error: false, message: "" });
          }}
        />
      </DialogContent>
      <DialogActions>
        {}
        <Button
          variant="contained"
          color="primary"
          disabled={
            submitting ||
            selectedRow.qaoRemarks ||
            loggedInUser.roleId !== USER_ROLE_ID.ROLE_DC
          }
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button variant="contained" color="default" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
