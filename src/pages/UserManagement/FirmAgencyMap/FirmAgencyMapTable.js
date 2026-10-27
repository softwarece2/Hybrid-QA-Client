import React, { useEffect, useState } from "react";
import "../../../App.css";

//pages
import FirmAgencyMapForm from "./FirmAgencyMapForm";

//component
import TableComponent from "components/table/index";

//material-ui
import axiosInstance from "pages/Services/AxiosInstance";
import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "components/ActionButton";

const columns = [
  {
    title: "Firm Name",
    field: "organizationName",
    width: "auto",
    filtering: true,
  },
  {
    title: "Inspection Agency",
    field: "inspectionAgenciesText",
    width: "auto",
  },
];

export default function FirmAgencyMapTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firmAgencyObj, setFirmAgency] = useState({});



  const fetchFirmAgencyDetails = () => {
    setLoading(true);
    axiosInstance
      .get("orgCqae/getFirmAndAssociatedInspectionAgencies")
      .then(({ data }) => {
        setRecords(data.map(d=>({...d, inspectionAgenciesText:d.inspectionAgencies.map(i=> i.organizationName).join(', ')})));
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFirmAgencyDetails();
  }, []);

  return (
    <>
      <FirmAgencyMapForm
        fetch={fetchFirmAgencyDetails}
        firmAgencyObj={firmAgencyObj}
        setFirmAgency={setFirmAgency}
      />

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        actions={[
          {
            icon: () => (
              <ActionButton
                variant="contained"
                size="small"
                color="secondary"
                text="EDIT"
                startIcon={<EditIcon />}
              >
                Edit
              </ActionButton>
            ),
            onClick: (_, rowData) => {
              setFirmAgency(rowData);
            },
          },
        ]}
      />
    </>
  );
}
