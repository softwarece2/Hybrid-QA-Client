/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { USER_DEPARTMENT } from "../../../Globals";
//pages
//redux
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";

import CqaoDashboardMain from "pages/Dashboard/CqaoDash/CqaoDashboardMain";
import ReturnedOL from "pages/EnclosuresTable/ReturnedOL";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import OLNotification from "pages/Notifications/OLNotification/OLNotification";
import SONotification from "pages/Notifications/SONotification/SONotification";
import { ORG_TYPE} from "../../../Globals.js";
import AllotOfficers from "pages/SOModule/Allot/AllotOfficers";
import ViewSO from "pages/SOModule/SupplyOrderDetails/View/ViewSO";

//Icons
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import InsertChartRoundedIcon from "@material-ui/icons/InsertChartRounded";
import StorageSharpIcon from "@material-ui/icons/StorageSharp";
import ApprovalCycleje from "pages/ApprovalCycle/ApprovalCycleje";
// import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";
import QAOLApprovalCycle from "pages/QAOLApprovalCycle";
import IOLDehradun from "pages/SummaryData/IOL/IOLDehradun";
import AteDrilldownDashboard from "pages/SummaryData/IOL/drilldown-dashboard";
import { Ballot, Home } from "@material-ui/icons";
import QAAgencyAllotOl from "pages/SOModule/Allot/QAAgencyAllotOl";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { useNotification } from "context/notification";
import { StyledListItem } from "./SuperAdminTreeView";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";

export default function DACTreeViews() {
  const dispatch = useDispatch();
  const { notificationCategories } = useNotification();

  const [selectedItem, setSelectedItem] = useState(1);

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isAssemblyEmp = loggedInUser?.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;
  const hasLatestOL = notificationCategories?.OL?.hasLatest || notificationCategories?.OL_ALLOTMENT?.hasLatest;
  const hasLatestSO = notificationCategories?.SO?.hasLatest || notificationCategories?.SO_ALLOTMENT?.hasLatest;
const QAAgency = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY 
  useEffect(() => {
    dispatch(selectItem(<CqaoDashboardMain />));
  }, []);

  const items = [
    {
      id: 1,
      label: "Dashboard",
      header: true,
      child: [
        { id: 1, label: `Dashboard `, Icon: Home, component: <IOLDehradun /> },
        { id: "ate-quality-drilldown", label: `Quality Analytics (Drilldown)`, Icon: InsertChartRoundedIcon, component: <AteDrilldownDashboard /> },
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
          isActive: hasLatestSO,
          component: <SONotification id={3} />,
        },
        {
          id: 4,
         label: `QACL(${QAAgency 
  ? 
  ( notificationCategories?.OL_ALLOTMENT?.count || 0)
  : (notificationCategories?.OL?.count || 0)
})`,
          Icon: Home,
          isActive: hasLatestOL,
          component: <OLNotification id={4} />,
        },
      ],
    },
    {
      id: 20,
      label: "Notification(Sent)",
      header: true,
      child: [
        { id: 100, label: `SO`, Icon: Home, component: <SONotification id={100} /> },
        { id: 300, label: `QACL `, Icon: Home, component: <OLNotification id={300} /> },
      ],
    },

    {
      id: 3,
      label: "Allot",
      header: true,
      child: [
        { id: 40, label: `SO Allot `, Icon: StorageSharpIcon, component: <AllotOfficers /> },
        { id: 5, label: `QACL Allot`, Icon: StorageSharpIcon, component: <QAAgencyAllotOl /> },

        // { id: 400, label: `SO Allot `, Icon: StorageSharpIcon, component: <AllotOfficers /> },
        // { id: 500, label:  `QACL Allot`, Icon: StorageSharpIcon, component: <AllotOfficers /> },
      ],
    },
    {
      id: 4,
      label: "Supply Order Module ",
      header: true,
      child: [
        { id: 6, label: `SO Details `, Icon: Home, component: <ViewSO /> },
        { id: 7, label: `SO Scrutiny Cycle `, Icon: AssignmentTurnedInIcon, component: <ApprovalCycleje /> },
      ],
    },

    {
      id: 6,
      // label: isArmy ? "QACL Module" : "OL Module",
      label: "QACL Module",
      header: true,
      child: [
        // { id: 8, label: isArmy? `QACL Details` : `Ol Details`, Icon: InsertChartRoundedIcon, component: <ViewOL /> },
        { id: 8, label: `QACL  Details`, Icon: InsertChartRoundedIcon, component: <InspectOLTable /> },
        { id: 9, label: `QACL  Approval Cycle`, Icon: AssignmentTurnedInIcon, component: <QAOLApprovalCycle /> },
        // { id: 10, label: isArmy ? `Returned QACL`: `Returned OL`, Icon: Ballot, component: <ReturnedOL /> },
        { id: 10, label: `Returned OL`, Icon: Ballot, component: <ReturnedOL /> },
        { id: 11, label: `I-Note`, Icon: Home, component: <INoteTable /> },
      ],
    },
    {
      id: 13,
      label: "INote Details",
      header: true,
      child: [{ id: 19, label: "Instrument List(OLF)", Icon: SupervisorAccountIcon, component: <DetailsINote /> },
      { id: 20, label: "Instrument List(CQAI)", Icon: SupervisorAccountIcon, component: <CQAIDetailsINote /> },],
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
