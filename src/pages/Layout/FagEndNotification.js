/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import {
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import Button from "components/Button";
import { useEffect, useState } from "react";
import { DialogTitle } from "Utils";
import ExpiringPoListDialog from "./ExpiringPoListDialog";
import { useSelector } from "react-redux";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { Notifications } from "@material-ui/icons";

export default function FagEndNotification() {
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const [showExpiryDialog, setShowExpiryDialog] = useState(true);
  const [count, setCount] = useState(0);
  const [showViewList, setShowViewList] = useState(false);

  const handleView = () => {
    setShowExpiryDialog(false);
    setShowViewList(true);
  };

  async function getExpiringOrdersByOrgId() {
    try {
      const { data } = await axiosInstance(
        "supplyOrder/countExpiring/org/" + orgId
      );
      setCount(data);
    } catch (error) {
      console.error("Error fetching PO count:", error);
    }
  }

  useEffect(() => {
    getExpiringOrdersByOrgId();
  }, []);

  return (
    <>
      <Badge
        badgeContent={count}
        color="secondary"
        className={count > 0 ? "pulsating-badge" : ""}
      >
        <IconButton
          size="small"
          onClick={() => setShowExpiryDialog(true)}
          style={{ color: "white" }}
        >
          <Notifications fontSize="small" />
        </IconButton>
      </Badge>

      <Dialog
        open={showExpiryDialog && count}
        onClose={() => setShowExpiryDialog(false)}
      >
        <DialogTitle onClose={() => setShowExpiryDialog(false)}>
          Fag End Notification
        </DialogTitle>
        <DialogContent>
          <Typography>
            ⚠️ {count} SO/PO are expiring in the next 45 days.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => setShowExpiryDialog(false)}
          >
            Close
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={handleView}
            disabled={count <= 0}
          >
            View
          </Button>
        </DialogActions>
      </Dialog>

      <ExpiringPoListDialog
        open={showViewList}
        onClose={() => setShowViewList(false)}
      />
    </>
  );
}
