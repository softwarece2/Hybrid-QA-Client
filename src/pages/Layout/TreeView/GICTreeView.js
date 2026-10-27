import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ORG_TYPE, USER_DEPARTMENT, USER_ROLE_ID } from "../../../Globals.js";

//material-ui icons
import Ballot from "@material-ui/icons/Ballot";
import Home from "@material-ui/icons/Home";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import SbuDashBoardMain from "pages/Dashboard/SbuDashboard/SbuDashBoardMain";
import OLNotification from "pages/Notifications/OLNotification/OLNotification";
import SONotification from "pages/Notifications/SONotification/SONotification";
import OLTable from "pages/Sslip/SSlipTable.js";
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";
import ApprovalCycleSslip from "pages/ApprovalCycleOL/ApprovalCycleSslip.js";
import SbuSoTable from "pages/SOModule/SupplyOrderDetails/SbuSO/SbuSoTable";
import CameraMappingTable from "pages/VideoInspection/Sbu/CameraMappingTable.js";
import IOLDehradun from "pages/SummaryData/IOL/IOLDehradun.js";
import AteDrilldownDashboard from "pages/SummaryData/IOL/drilldown-dashboard";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote.js";
import WarrantDetailsTable from "pages/SOModule/LineItemsDetails/WarrantDetailsTable.js";
import WarrantCertificateTable from "pages/SOModule/LineItemsDetails/WarrantCertificateTable.js";
import InoteToggle from "pages/InspectorModule/INote/InoteToggle.js";
import WarrantNotification from "pages/Notifications/WarrantNotification/WarrantNotification.js";
import TableQACL from "pages/SOModule/OL/TableQACL.js";
import QAOLApprovalCycle from "pages/QAOLApprovalCycle/index.js";
import { useNotification } from "context/notification.js";
import { StyledListItem } from "./SuperAdminTreeView.js";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote.js";

const IsOl = true;

export default function GICTreeView() {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(1);
  const { notificationCategories } = useNotification();

  const loggedInUser = useSelector((store) => store.loggedInUser);

  const isAssemblyEmp =
    (loggedInUser.roleId === USER_ROLE_ID.ROLE_GIC || loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS) &&
    loggedInUser.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;
  const isHosqc =
    (loggedInUser.roleId === USER_ROLE_ID.ROLE_GIC || loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS) &&
    loggedInUser.departmentTypeId === USER_DEPARTMENT.QC;
    const QAAgency = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY 

 const hasLatestOL = notificationCategories?.OL?.hasLatest || notificationCategories?.OL_ALLOTMENT?.hasLatest;
  const hasLatestSO = notificationCategories?.SO?.hasLatest || notificationCategories?.SO_ALLOTMENT?.hasLatest;
  const hasLatestWarrant = notificationCategories?.WARRANT_ALLOTMENT_TYPE?.hasLatest;

  useEffect(() => {
    dispatch(selectItem(<SbuDashBoardMain />));
  }, []);

  const items = [
    {
      id: 1,
      label: "Dashboard",
      header: true,
      child: [
        { id: 1, label: `Dashboard `, Icon: Home, component: <IOLDehradun /> },
        { id: "ate-quality-drilldown", label: `Quality Analytics (Drilldown)`, Icon: Home, component: <AteDrilldownDashboard /> },
      ],
    },

    {
      id: 2,
      label: "Notification(Received)",
      header: true,
      child: [
        {
          id: 3,
          label: `SO/PO (${QAAgency 
  ? 
  (notificationCategories?.SO_ALLOTMENT?.count || 0)
  : (notificationCategories?.SO?.count || 0)
})`,
          Icon: Home,
           isActive:hasLatestSO,
          component: <SONotification id={3} />,
        },
        ...(isHosqc
          ? []
          : [
              {
                id: 5,
                label: `Warrants (${notificationCategories?.WARRANT_ALLOTMENT_TYPE?.count})`,
                Icon: SupervisorAccountIcon,
                 isActive:hasLatestWarrant,
                component: <WarrantNotification id={5} />,
              },
            ]),
        {
          id: 4,
          label: `S.Slip/OL(${QAAgency 
  ? 
  ( notificationCategories?.OL_ALLOTMENT?.count || 0)
  : (notificationCategories?.OL?.count || 0)
})`,
 Icon: Home,
          isActive: hasLatestOL,

          Icon: SupervisorAccountIcon,
           isActive:hasLatestOL,

          component: <OLNotification id={4} />,
        },

      
      ],
    },


    
    {
      id: 101,
      label: "Notification(Sent)",
      header: true,
      child: [
        { id: 100, label: `SO/PO`, Icon: Home, component: <SONotification id={100} /> },
        ...(isHosqc ? [] : [{ id: 200, label: `Warrants`, Icon: SupervisorAccountIcon, component: <WarrantNotification id={200} /> }]),
        { id: 300, label: `S.Slip/OL`, Icon: SupervisorAccountIcon, component: <OLNotification id={300} /> },

      ],
    },
    {
      id: 5,
      label: "Supply Order Module",
      header: true,
      child: [
        { id: 15, label: `SO/PO Details`, Icon: Home, component: <SbuSoTable /> },
        { id: 6, label: "Warrant Details", Icon: Ballot, component: <WarrantDetailsTable /> },
      ],
    },

    {
      id: 7,
      label: "Submission Slip Module",
      header: true,
      child: [
        { id: 8, label: `Submission Slip `, Icon: SupervisorAccountIcon, component: <OLTable isSample={true} /> },
        ...(isHosqc ? [{ id: 9, label: `S.Slip Approval Cycle `, Icon: Home, component: <ApprovalCycleSslip /> }] : []),
        // { id: 10, label: `RFR / RR `, Icon:  Ballot, component: <ReturnedOL/> },
        ...(isHosqc ? [] : [{ id: 11, label: `Lot Details `, Icon: Ballot, component: <InoteToggle /> }]),
        // { id: 12, label: `Warranty Certificate `, Icon: Ballot, component: <WarrantCertificateTable /> },
      ],
    },
    // {
    //   id: 50,
    //   label: "QACL Module",
    //   header: true,
    //   child: [
    //     { id: "partNo", label: `Offer Letter`, Icon: Ballot, component: <TableQACL IsOl={true} /> },
    //     { id: "A1", label: `QACL Approval Cycle `, Icon: Ballot, component: <QAOLApprovalCycle /> },
    //   ],
    // },
    {
      id: 13,
      label: "INote Details",
      header: true,
      child: [{ id: 19, label: "Instrument List(OLF)", Icon: SupervisorAccountIcon, component: <DetailsINote /> },
      { id: 20, label: "Instrument List(CQAI)", Icon: SupervisorAccountIcon, component: <CQAIDetailsINote /> },],
    },
    {
      id: 14,
      label:"Remote Inspection", //IVNV Observation Added label for Camera. Modified by:Shruti Sanjay Date:07-07-2026
      child: [{ id: 14, label: `SBU Camera Mapping`, Icon: Ballot, component: <CameraMappingTable /> }],
    },
  ];
  return (
    <div style={{ backgroundColor: "#fafafa", minHeight: "calc(100% - 109px)", padding: 4 }}>
      {items
        .filter((item) => (isAssemblyEmp ? true : item.id !== 5))
        .map((item) => (
          <StyledListItem key={item.id} item={item} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        ))}
    </div>
  );
}
