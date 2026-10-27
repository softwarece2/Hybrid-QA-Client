/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Divider } from "@material-ui/core";
import SightPeriScopeForm from "./SightPeriScoprForm";
import SightPeriScopeAll from "./SightPeriScopeAll";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";

export default function SightPeriScope({ rowData, selectedUploadRow, final }) {
  const [selectedForm, setSelectedForm] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  function getRecords(res) {
    setLoading(true);
    axiosInstanceIol("visualTest/getVisualTestByTestAndOlItemId/" + selectedUploadRow.id + "/" + rowData.id)          
      .then(({ data }) => {     
        if(res){
          getFormData(res);
        }
          setRecords(data);

      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }
  
  function getFormData(sRow){
    if (sRow) {
      setLoading(true);
      axiosInstanceIol(`visualTest/getVisualTestByTvneId/${sRow.id}`)
        .then(({ data }) => {
          setSelectedForm(data);  
        })
        .catch(console.log)
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    getRecords();
  }, []);


  useEffect(() => {
    getFormData(selectedRow)
  }, [selectedRow]);

  return (
    <div style={{ minHeight: 800 }}>
      <SightPeriScopeAll
        records={records}
        loading={loading}
        setSelectedRow={setSelectedRow}
        selectedRow={selectedRow}
        selectedForm={selectedForm}
      />
      <Divider style={{ marginBlock: 16 }} />
      <SightPeriScopeForm
        setSelectedRow={setSelectedForm}
        selectedRow={selectedForm}
        isSubmitted={selectedRow?.submittedDate}
        rowData={rowData}
        getRecords={getRecords}
        selectedUploadRow={selectedUploadRow}
        final={final}
        formLoading={loading}
      />

      {/* <SightPeriScopeSummary data={selectedRow} /> */}
    </div>
  );
}
