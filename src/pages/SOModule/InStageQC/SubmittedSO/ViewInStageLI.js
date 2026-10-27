/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
//material-ui
import { Typography } from "@material-ui/core";
//redux

//component
import TableComponent from "components/table/index";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import OLAllotTests from "pages/SOModule/OL/OLAllotTests";
import ActionButton from "components/ActionButton";
import { Visibility } from "@material-ui/icons";
// import Edit from "./Edit";

export default function ViewInStageLI({ selectedRow }) {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recordData, setRecordData] = useState(null);
  const [selectedLineItem, setSelectedLineItem] = useState(null);
  const [openDlg, setOpenDlg] = useState(false);

  const [columns] = useState([
    { title: "Line Item No.", field: "soLineItemNo", width: "auto" },
    // { title: "Serial No.", field: "serialNo", width: "auto" },
    { title: "Material No.", field: "partNo", width: "auto" },
    { title: "Material Desc", field: "description", width: "auto" },
    { title: "Offered Qty", field: "offeredQty", width: "auto" },
    { title: "Issue Level", field: "issueLevel", width: "auto" },
    { title: "Priority", field: "priority", width: "auto" },
  ]);


  const fetchByLineItemObsId = () => {
    setLoading(true);
    axiosInstance("internalOfferLetter/getInternalOlByOlId/" + selectedRow?.id)
      .then(({ data }) => {
        setRecords(data?.olLineItemDtos || []);
        setRecordData(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchByLineItemObsId();
  }, [selectedRow]);

  const actions = [
    {
      icon: () => (
        <ActionButton
          variant="contained"
          size="small"
          color="primary"
          startIcon={<Visibility />}
        >
          Test
        </ActionButton>
      ),
      onClick: (event, rowData) => {
        setOpenDlg(true);
        setSelectedLineItem(rowData)
      },
    },
  ];

  return (
    <div
      style={{
        border: "1px solid #43A047",
        maxWidth: 1400,
        marginInline: "auto",
      }}


    >

      {openDlg && (
        <OLAllotTests
          open={openDlg}
          setOpen={setOpenDlg}
          rowData={selectedLineItem}
          olNumber={recordData?.olNumber}
           productId={recordData?.productId}
          olId={recordData?.id}
        />
      )}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title={<Typography variant="body1" style={{ paddingLeft: 16 }} color="primary" align="center">
          In Stage QC Details (Ol Number .:-<b>{recordData?.olNumber}</b>)
        </Typography>}
        options={{ filtering: false, sorting: false }}
        actions={actions}
     
      />
     
    </div>
  );
}
