/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../App.css";
import { WING_ID } from "../../../Globals";
import TableComponent from "components/table/index";
import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { getInspectOLUrl } from "pages/Services/URLs";
import { Grid} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import ActionButton from "components/ActionButton";
import OLWorkLoadAssessment from "pages/Enclosures/Enclosure16/OLWorkLoadAssessment";

export default function OLWL() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [columns] = useState([
    isArmy
      ? { title: "QACL Number", field: "name", width: "auto" }
      : { title: "OL Number", field: "name", width: "auto" },
    { title: "SO Number ", field: "soNumber", width: "auto" },
    { title: "SBU", field: "salesGroupName", width: "auto" },
    { title: "Project Name", field: "projectName", width: "auto" },

    { title: "Date", field: "soDate", width: "auto", sorting: true },
  ]);

  const getInspectOL = () => {
    setLoading(true);
    AxiosInstanceTransaction.get(getInspectOLUrl + loggedInUser?.empId)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
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
    console.log("inside sbu so import");
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
            actions={[
              (rowData) => ({
                icon: () => (
                  <ActionButton
                    variant="outlined"
                    size="small"
                    color="secondary"
                    obs={"obs"}
                    // onClick={() => dispatch(selectItem(<CheckScrutinyTable soObj={rowData}/>))}
                  >
                    Work Load
                  </ActionButton>
                ),
                onClick: () => {
                  dispatch(selectItem(<OLWorkLoadAssessment olId={rowData?.id} />));
                },
              }),
            ]}
            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}
