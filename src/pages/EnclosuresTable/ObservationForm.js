/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../App.css";

//globals

//pages

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";

import { useDispatch } from "react-redux";

import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";

import { getPoObservation } from "pages/Services/URLs";


import POObservationTable from "pages/Enclosures/Enclosure2C/POObservationTable";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import ActionButton from "components/ActionButton";

export default function ObservationForm() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [columns] = useState([
    { title: "SO Number", field: "soOrderNo", width: "auto" },
    { title: "SBU", field: "salesGroupName", width: "auto" },
    { title: "Project Name", field: "projectName", width: "auto" },

    {
      title: "SO/PO Order Date",
      field: "soDate",
      width: "auto",
      filtering: true,
    },
    {
      title: "Obs Created Date",
      field: "createdDatetime",
      width: "auto",
      filtering: true,
    },
    {
      title: "Obs Closure Date ",
      field: "closureDate",
      width: "auto",
      filtering: true,
    },
  ]);

  const getInspectSO = () => {
    setLoading(true);
    AxiosInstanceTransaction.get(getPoObservation + loggedInUser?.empId)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
          }))
        );
    
      })
      .catch((e) => {
        console.log(e);
   
      })
      .finally(()=>setLoading(false));
  };

  useEffect(() => {
    getInspectSO();
    console.log("inside sbu so import");
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12} align='center'>
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=''
            actions={[
              {
                icon: () => (
                  <ActionButton
                    variant='outlined'
                    size='small'
                    fullWidth
                    color='secondary'
                    obs={"obs"}
                  >
                    Observation Form
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  dispatch(
                    selectItem(<POObservationTable rowData={rowData} />)
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
