/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import "../../../App.css";
import { useSelector } from "react-redux";
import TableComponent from "components/table/index";
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";
import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { getInspectSOUrl } from "pages/Services/URLs";
import FCMTable from "pages/Enclosures/Enclosure2B/FirstContactMeeting/FCMTable";
import Contactletter from "pages/Enclosures/Enclosure2A/ContactLetter";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import CheckScrutinyTable from "pages/Enclosures/Enclosure1/Checklist1/CheckScrutinyTable";
import ActionButton from "components/ActionButton";
import FileClosingForm from "pages/Enclosures/Enclosure17/FileClosingForm";
import GIScrutiny from "pages/ScrutinyGI/GIScrutiny";

export default function InspectSOTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [columns] = useState([
    { title: "SO Number", field: "orderNo", width: "auto" },
    { title: "File No", field: "fileNo", width: "auto" },
    { title: "SBU", field: "salesGroupName", width: "auto" },
    { title: "Alloted By", field: "allotedBy", width: "auto" },
    { title: "Project Name", field: "projectName", width: "auto" },
    {
      title: "Date and Time",
      field: "orderDateStr",
      width: "auto",
      filtering: true,
    },
  ]);

  const getInspectSO = () => {
    setLoading(true);
    AxiosInstanceTransaction.get(getInspectSOUrl + loggedInUser?.empId)
      .then(({ data }) => {
        setRecords(data);
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
                  >
                    Scrutiny
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  dispatch(selectItem(<CheckScrutinyTable soObj={rowData} />));
                },
              },
              {
                icon: () => (
                  <ActionButton
                    variant="outlined"
                    size="small"
                    color="secondary"
                  >
                    ScrutinyGI
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  dispatch(selectItem(<GIScrutiny soObj={rowData} />));
                },
              },
              {
                icon: () => (
                  <ActionButton
                    variant="outlined"
                    size="small"
                    color="secondary"
                    // onClick={() => dispatch(selectItem(<Contactletter soObj={rowData} />))}
                  >
                    FCL
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  dispatch(selectItem(<Contactletter soObj={rowData} />));
                },
              },
              {
                icon: () => (
                  <ActionButton
                    variant="outlined"
                    size="small"
                    color="secondary"
                  >
                    FCM
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  dispatch(selectItem(<FCMTable soObj={rowData} />));
                },
              },
              {
                icon: () => (
                  <ActionButton
                    variant="outlined"
                    size="small"
                    color="secondary"
                  >
                    FileClose
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  dispatch(selectItem(<FileClosingForm soObj={rowData} />));
                },
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
}
