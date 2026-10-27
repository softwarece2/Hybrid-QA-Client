import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, CircularProgress, Dialog, FormControl, Select } from "@material-ui/core";
import { useSelector } from "react-redux";

//local imports
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceMaster from "pages/Services/AxiosInstance";

export function AllotOrForward({ onClose,  olDetails, type, refresh }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  // console.log(olDetails, "olDetails",  loggedInUser);

  function onSave() {
    if(!selected){
      toast.error('Before submitting, please select an officer.')
      return
    }
    setSubmitting(true);
    let url = "allot/qar/allotSubordinate";
    let req = {
      id: 0,
      offerLetterId: olDetails.id,
      offerLetterName: olDetails.olNumber,
      allotedBy: loggedInUser.empId,
      allotedTo: selected,
      isDeligation: false,
      section:type
    };

    axiosInstance
      .post(url, req)
      .then(() => {
        setSelected(null);
        onClose();
        toast.success("Saved successfully");
        refresh()
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to save");
      }).finally(()=>{
        setSubmitting(false)
      });
  }

  useEffect(() => {
    axiosInstanceMaster(
      "employee/getAllActiveEmpsByOrgId/" +
        loggedInUser?.empId +
        "/" +
        loggedInUser?.orgId
    )
      .then(({ data }) => {
        setList(data);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to get users");
      });
  }, [loggedInUser]);

  return (
    <Dialog open >
      <DialogTitle onClose={onClose}>Allot</DialogTitle>
      <DialogContent>
        <FormControl size="small">
          <Select
            native
            labelId="firm-select-label"
            id="firm-select"
            value={selected}
            variant="outlined"
            style={{ minWidth: 300 }}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select</option>

            {list.map((firm) => (
              <option key={firm.id} value={firm.id}>
                {firm.ename}
              </option>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={onSave}
          disabled={isSubmitting}
        >
          {isSubmitting && <CircularProgress size={24} /> }  Submit
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
