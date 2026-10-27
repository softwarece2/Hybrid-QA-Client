/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import ViewInStageLI from "./ViewInStageLI";
//component
import TableComponent from "components/table/index";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import NotifyOrAllot from "./NotifyOrAllot";
import { Notifications } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";

const columns = [
  { title: "Submission Slip No.", field: "olNumber", width: "auto" },
  { title: "Offer Date", field: "offerDate", width: "auto" },
  // { title: "Sale Order No.", field: "saleOrderNoStr", width: "auto" },
  { title: "Submitted By", field: "employee", width: "auto" },
];

export default function InStageSubmitted() {
  // const [openForm, setOpenFrom] = useState(false);
  const loggedInUser = useSelector((store) => store.loggedInUser);

  const orgId = loggedInUser?.orgId;
  const empId = loggedInUser?.empId;
  const salesGrpId = loggedInUser?.salesGrpId;
  const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
  
  const roleId = loggedInUser?.roleId;

  const [selectedRow, setSelectedRow] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowForNotify, setSelectedRowForNotify] = useState(null);
  const [openNotifyOrAllot, setOpenNotifyOrAllot] = useState(false);

  const getApprovedSO = () => {
    let url = "offerLetter/getOfferLettersByStatusForFirm/" + orgId + "/" + empId;
    if (roleId === USER_ROLE_ID.ROLE_GIC && (departmentTypeId === DEPARTMENT_ID.ASSEMBLY || departmentTypeId === DEPARTMENT_ID.QC))
      url = "offerLetter/getOfferLettersBySalesGrpId?salesGrpId=" + salesGrpId;

    setLoading(true);
    axiosInstance(url)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            orderNo: el.supplyOrderNo,
            title: el.tittle,
            submittedBy: el.createdByName,
            submittedDate: el.createdDate ? moment(el.receiptDate).format("DD-MM-yyyy") : "",
          }))
        );
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
    // setLoading(false);
  };

  useEffect(() => {
    getApprovedSO();
    // fetchSO();
  }, []);

  const actions = [
    {
      icon: (el) => (
        <IconButton variant="contained" color="primary" title="Notify/Allot" size="small">
          <Notifications />
        </IconButton>
      ),
      onClick: (_, rowData) => {
        setSelectedRowForNotify(rowData);
        setOpenNotifyOrAllot(true);
      },
    },
  ];

  const detailPanel = [
    {
      tooltip: "View",
      render: (rowData) => {
        setSelectedRow(rowData);
        return <ViewInStageLI selectedRow={rowData} />;
      },
    },
  ];

  return (
    <>
      {openNotifyOrAllot && (
        <NotifyOrAllot onClose={() => setOpenNotifyOrAllot(false)} selectedRow={selectedRowForNotify} refresh={getApprovedSO} />
      )}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        options={{
          detailPanelType: "single",
          rowStyle: (rowData) => ({
            backgroundColor: selectedRow?.id === rowData.id ? "rgb(12 255 255 / 15%)" : "#FFF",
          }),
        }}
        actions={actions}
        detailPanel={detailPanel}
        // options={{ filtering: false, sorting: false }}
      />
    </>
  );
}
