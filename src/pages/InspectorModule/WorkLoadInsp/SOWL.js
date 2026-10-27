/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../App.css";
import TableComponent from "components/table/index";
import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { getInspectSOUrl } from "pages/Services/URLs";

//material-ui
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";

import { selectItem } from "Redux/Actions/SelectTreeItem";

import ActionButton from "components/ActionButton";
import SOWorkLoadAssessment from "pages/Enclosures/Enclosure16/SOWorkLoadAssessment";

export default function SOWL() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [columns] = useState([
    { title: "SO Number ", field: "orderNo", width: "auto" },
    { title: "Order Master No.", field: "fileNo", width: "auto" },
    { title: "SBU", field: "salesGroupName", width: "auto" },

    { title: "Project Name", field: "projectName", width: "auto" },

    {
      title: "Date",
      field: "orderDateStr",
      width: "auto",
      sorting: true,
    },

  ]);

  const getInspectSO = () => {
    setLoading(true);
    AxiosInstanceTransaction.get(getInspectSOUrl + loggedInUser?.empId)
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
    getInspectSO();
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
              {
                icon: () => (
                  <ActionButton
                    variant="outlined"
                    size="small"
                    color="secondary"
                    obs={"obs"}
                   
                  >
                    Work Load
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  dispatch(
                    selectItem(<SOWorkLoadAssessment soId={rowData?.id} />)
                  );
                },
              },
            ]}

            
          />
        </Grid>
      </Grid>
    </>
  );
}
