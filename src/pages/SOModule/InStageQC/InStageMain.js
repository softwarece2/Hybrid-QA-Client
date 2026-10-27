import { useState } from "react";
import { Button, Dialog, DialogContent} from "@material-ui/core";
//
import InStageSO from "./InStageSO/InStageSO";
import InStageSubmitted from "./SubmittedSO/InStageSubmitted";
import { DialogTitle } from "Utils";

export default function InStageMain() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button style={{textTransform:"capitalize"}} onClick={() => setOpen(true)} variant="contained" color="primary" size="small">
        Create Submission Slip
      </Button>

      <Dialog fullWidth  maxWidth={"lg"} open={open}>
        <DialogTitle onClose={()=>setOpen(false)}>Create Submission Slip</DialogTitle>
        <DialogContent>
          <InStageSO />
        </DialogContent>
      </Dialog>
      <InStageSubmitted />
    </>
  );
}
