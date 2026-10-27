//material ui
import { Dialog, Grid} from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";

//components
import Button from "components/Button";
import { DialogTitle } from "Utils";

//pages
import LineItemsView from "./LineItemsView";
import SODetailsView from "./SODetailsView";
import { PaperComponent } from "Utils/D3Tree";




const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const PreviewMain = ({ open, setOpen, soId,recordsId,handleSOSenderNotification,fetchSoNotifications,props }) => {
  console.log("props",props);
  const { id } = props;
  const handleClose = () => {
    setOpen(false);
    if (id === 100){
      handleSOSenderNotification();
    }
    else{
      fetchSoNotifications();
    }
    
   
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title$6" {...props} />
        )}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span>SO/PO Details</span>
        </DialogTitle>
        <DialogContent dividers style={{ padding: 0, position: "relative" }}>
          <Grid
            container
            spacing={0}
            justifyContent="center"
            alignItems="center"
            style={{ padding: 12, position: "relative" }}>
            <Grid items xs={12}>
              <SODetailsView soId={soId} />
            </Grid>

            <Grid items xs={12}>
              <LineItemsView soId={soId} recordsId={recordsId} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default PreviewMain;
