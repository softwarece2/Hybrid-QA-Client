import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ORG_TYPE } from "../../../Globals.js";
//material-ui
//redux
import OLNotification from "pages/Notifications/OLNotification/OLNotification";
import SONotification from "pages/Notifications/SONotification/SONotification";
import OLTable from "pages/Sslip/SSlipTable";
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";
import ApprovalCycleSslip from "pages/ApprovalCycleOL/ApprovalCycleSslip";
import IOLDehradun from "pages/SummaryData/IOL/IOLDehradun";
import AteDrilldownDashboard from "pages/SummaryData/IOL/drilldown-dashboard";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import { Home, LayersOutlined, ListAlt, SupervisorAccount } from "@material-ui/icons";
import { useNotification } from "context/notification";
import { StyledListItem } from "./SuperAdminTreeView";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote.js";

export default function EXTreeView() {
  const dispatch = useDispatch();
   const loggedInUser = useSelector((store) => store.loggedInUser);
  const { notificationCategories } = useNotification();
  const [selectedItem, setSelectedItem] = useState(1);
 const hasLatestOL = notificationCategories?.OL?.hasLatest || notificationCategories?.OL_ALLOTMENT?.hasLatest;
  const hasLatestSO = notificationCategories?.SO?.hasLatest || notificationCategories?.SO_ALLOTMENT?.hasLatest;
const QAAgency = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY 

  

  useEffect(() => {
    dispatch(selectItem(<OLTable />));
  }, []);

  const items = [
    {
      id: 1,
      label: "Dashboard",
      child: [
        {
          id: 1,
          label: "Dashboard",
          Icon: LayersOutlined,
          component: <IOLDehradun />,
        },
        {
          id: "ate-quality-drilldown",
          label: "Quality Analytics (Drilldown)",
          Icon: LayersOutlined,
          component: <AteDrilldownDashboard />,
        },
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
        {
          id: 4,
         label: `S.Slip/OL(${QAAgency 
  ? 
  ( notificationCategories?.OL_ALLOTMENT?.count || 0)
  : (notificationCategories?.OL?.count || 0)
})`,
          Icon: SupervisorAccount,
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
        {
          id: 100,
          label: `SO/PO `,
          Icon: Home,
          component: <SONotification id={100} />,
        },
        {
          id: 300,
          label: `S.Slip/QACL`,
          Icon: SupervisorAccount,
          component: <OLNotification id={300} />,
        },
      ],
    },

    {
      id: 5,
      label: "Submission Slip Module",
      header: true,
      child: [
        // {
        //   id: 6,
        //   label: "Alloted Registration",
        //   Icon: SupervisorAccount,
        //   component: <ExaminerAllotedTest />,
        // },
        {
          id: 7,
          label: "Submission Slip Details",
          Icon: SupervisorAccount,
          component: <OLTable />,
        },
        {
          id: 8,
          label: "S.Slip Approval-Cycle",
          Icon: ListAlt,
          component: <ApprovalCycleSslip />,
        },
        // {
        //   id: 9,
        //   label: "RFR/RR",
        //   Icon: Ballot,
        //   component: <ReturnedOL />,
        // },
      ],
    },
    {
      id: 5,
      label: "INote Details",
      header: true,
      child: [
        {
          id: 10,
          label: "Instrument List(OLF)",
          Icon: SupervisorAccount,
          component: <DetailsINote />,
        },
        {
          id: 11,
          label: "Instrument List(CQAI)",
          Icon: SupervisorAccount,
          component: <CQAIDetailsINote />,
        },
      ],
    },
  ];
  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        minHeight: "calc(100% - 109px)",
        padding: 4,
      }}
    >
      {items.map((item) => (
        <StyledListItem key={item.id} item={item} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      ))}
    </div>
  );
}
