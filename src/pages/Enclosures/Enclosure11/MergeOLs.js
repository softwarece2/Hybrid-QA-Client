/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../App.css";

//globals

//pages
//component
import TableComponent from "components/table/index";
import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { getOLSUrl } from "pages/Services/URLs";
import { WING_ID } from "../../../Globals";
//material-ui
import { Dialog, DialogActions, DialogContent, Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { getAllSOBySalesGrp } from "Redux/Actions/SupplyOrder/SOAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";

import ActionButton from "components/ActionButton";
import InspectionFileNote from "pages/Enclosures/Enclosure11/InspectionFileNote";
import Button from "components/Button";
import { toast } from "react-toastify";
import moment from "moment";

export default function MergeOLs() {
  const dispatch = useDispatch();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOl, setSeletcedOl] = useState([]);

  const empId = useSelector((state) => state?.loggedInUser?.empId);
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [open, setOpen] = useState(false);
  const [olNums, setOlNums] = useState("");

  const [columns] = useState([
    isArmy ? { title: "QACL Number", field: "name", width: "auto" } : { title: "OL Number", field: "name", width: "auto" },
    { title: "SO No", field: "soNumber", width: "auto" },
    { title: "Sales Group", field: "salesGroupName", width: "auto" },
    { title: "Project Name", field: "projectName", width: "auto" },
    // { title: "Env Request NO", field: "Env Request NO", width: "auto" },
    { title: "Offer Date", field: "offerDate", width: "auto", sorting: true },
    // { title: "Status", field: "fileNoteStatus", width: "auto", sorting: true },
    { title: "FileNote", field: "FileNote", width: "auto", sorting: true },
  ]);

  const fetchSO = () => {
    setLoading(true);
    dispatch(getAllSOBySalesGrp(empId))
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
    console.log("ghghf");
  };

  const handleClick = () => {
    console.log("awj", selectedOl, selectedOl[0]?.soId);
    const names = selectedOl.map((item) => item.name).join(", ");
    setOlNums(names);
    setOpen(true);
  };

  const handleChange = (val) => {
    const idsArray = selectedOl.map((obj) => obj.id);

    dispatch(selectItem(<InspectionFileNote olIds={idsArray} soId={selectedOl[0]?.soId} />));
  };

  const handleClickClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    fetchSO();
  }, []);
  const getInspectOL = () => {
    setLoading(true);
    // const url = getInspectOLApprovalUrl;
    AxiosInstanceTransaction.get(getOLSUrl)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            offerDate: el?.offerDate ? moment(el?.offerDate).format("DD-MM-YYYY") : null,
            FileNote: (
              <ActionButton
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => {
                  const id = el?.id;
                  const idsArray = [id];
                  dispatch(selectItem(<InspectionFileNote olIds={idsArray} soId={el?.soId} />));
                  console.log("sdsdsd", el, i);
                }}
                disabled={el?.isReturned || el?.fileNoteStatus == "File Note Not Generated"}
              >
                File Note
              </ActionButton>
            ),
            //   onClick: (event, rowData) => {
            //     dispatch(selectItem(<InspectionFileNote data={rowData} />))
            //     console.log("sdsdsd", rowData);
            //   },
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
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            options={{
              selection: true,
            }}
            onSelectionChange={(e, rows) => {
              // setSelectedSoNumbers(e[0].soNumber)
              if (!e.every((obj) => obj?.soId === e[0]?.soId)) {
                toast.error(`Plz select OLs which belong to same supply order`);
              }
              setSeletcedOl(e);
            }}
            actions={[
              {
                tooltip: "Merge OL",
                // icon:'Merge OL',
                icon: () => (
                  <ActionButton
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={handleClick}
                    disabled={selectedOl?.length < 2 || selectedOl?.some((val) => val?.soId !== selectedOl[0]?.soId)}
                  >
                    Merge OL
                  </ActionButton>
                ),
              },
            ]}
          />
        </Grid>
      </Grid>
      <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="sm">
        <DialogContent>Are you sure you want to merge Offer Letters {olNums}?</DialogContent>
        <DialogActions>
          <Button onClick={handleChange} style={{ color: "primary" }} variant="contained" color="primary">
            Yes
          </Button>
          <Button onClick={handleClickClose} variant="contained" color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
