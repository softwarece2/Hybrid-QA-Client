/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import InsertChartRoundedIcon from "@material-ui/icons/InsertChartRounded";
import NoteAddSharpIcon from "@material-ui/icons/NoteAddSharp";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { ORG_TYPE, USER_DEPARTMENT } from "../../../Globals";
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";
import ApprovalCycle from "pages/ApprovalCycle";
import ReturnedOL from "pages/EnclosuresTable/ReturnedOL";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import InspectSOArmyTable from "pages/InspectSoArmy/InspectSOArmyTable";
import OLNotification from "pages/Notifications/OLNotification/OLNotification";
import SONotification from "pages/Notifications/SONotification/SONotification";
import ViewLineItem from "pages/SOModule/SupplyOrderDetails/View/ViewLineItem";
import QAOLApprovalCycle from "pages/QAOLApprovalCycle";
import IOLDehradun from "pages/SummaryData/IOL/IOLDehradun";
import { Ballot, Home } from "@material-ui/icons";
import { useNotification } from "context/notification";
import { StyledListItem } from "./SuperAdminTreeView";
import SOObservationTable from "pages/SOModule/SupplyOrderDetails/SOObservation/SOObservationTable";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";

export default function InspectorTreeView() {
  const dispatch = useDispatch();
  const { notificationCategories } = useNotification();
  const [selectedItem, setSelectedItem] = useState(1);

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isAssemblyEmp = loggedInUser?.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;
 const hasLatestOL = notificationCategories?.OL?.hasLatest || notificationCategories?.OL_ALLOTMENT?.hasLatest;
  const hasLatestSO = notificationCategories?.SO?.hasLatest || notificationCategories?.SO_ALLOTMENT?.hasLatest;

  useEffect(() => {
    dispatch(selectItem(<InspectSOArmyTable />));
  }, []);
  const QAAgency = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY 
  

  const items = [
    {
      id: 1,
      label: "Dashboard",
      header: true,
      child: [{ id: 1, label: `Dashboard `, Icon: Home, component: <IOLDehradun /> }],
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
          // label: isArmy? `QACL (${olNotifications?.length}) `: `OL(${olNotifications?.length})`,
          label: `OL(${notificationCategories?.OL?.count +  notificationCategories?.OL_ALLOTMENT?.count})`,
          Icon: Home,
           isActive:hasLatestOL,
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
        // { id: 300, label: isArmy? `QACL (${olSenderNotifications?.length}) `: `OL(${olNotifications?.length})`, Icon: Home, component: <OLNotification id={300}/> },
        { id: 300, label: `OL`, Icon: Home, component: <OLNotification id={300} /> },
      ],
    },

    {
      id: 3,
      label: "SO Module",
      header: true,
      child: [
        { id: 40, label: `Inspect SO`, Icon: Ballot, component: <InspectSOArmyTable /> },
      //   { id: 5, label: `Line Item Details`, Icon: Home, component: <ViewLineItem /> },
      //   { id: 7, label: `SO Scrutiny Cycle`, Icon: Home, component: <ApprovalCycle /> },
       ],
    },
    // {
    //   id: 8,
    //   label: "Observation Form",
    //   header: true,
    //   child: [
    //     { id: 8, label: `Observation Form`, Icon: Ballot, component: <SOObservationTable IsOl={true} /> },
    //     // { id: 8, label: `External INote`, Icon: Ballot,},
    //   ],
    // },
    {
      id: 6,
      // label: isArmy ? "QACL Module" : "OL Module",
      label: "QACL Module",
      header: true,
      child: [
        // { id: 'partNo', label: isArmy ? `Inspect QACL` : `Inspect OL`, Icon: InsertChartRoundedIcon, component: <InspectOLTable /> },
        { id: "partNo", label: `Inspect QACL`, Icon: InsertChartRoundedIcon, component: <InspectOLTable /> },
        { id: "A1", label: `QACL Approval Cycle `, Icon: AssignmentTurnedInIcon, component: <QAOLApprovalCycle isSample={true} /> },
        // { id: 'A2', label: isArmy ?  `Returned QACL`: `Returned OL`, Icon: Ballot, component: <ReturnedOL /> },
        { id: "A2", label: `Returned OL`, Icon: Ballot, component: <ReturnedOL /> },
        { id: "A3", label: `I-Note`, Icon: NoteAddSharpIcon, component: <INoteTable /> },
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
