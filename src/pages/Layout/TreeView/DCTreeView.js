import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_DEPARTMENT } from "../../../Globals";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";
import CqaoDashboardMain from "pages/Dashboard/CqaoDash/CqaoDashboardMain";
import ReturnedOL from "pages/EnclosuresTable/ReturnedOL";
import OLNotification from "pages/Notifications/OLNotification/OLNotification";
import SONotification from "pages/Notifications/SONotification/SONotification";
import AllotOfficers from "pages/SOModule/Allot/AllotOfficers";
import ViewSO from "pages/SOModule/SupplyOrderDetails/View/ViewSO";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import DashboardIcon from "@material-ui/icons/Dashboard";
import StorageSharpIcon from "@material-ui/icons/StorageSharp";
import ApprovalCycleje from "pages/ApprovalCycle/ApprovalCycleje";
import PORegister from "pages/Registers/PORegister/PORegister";
import OLRegister from "pages/Registers/OLRegister/OLRegister";
import INoteRegister from "pages/Registers/INoteRegister/INoteRegister";
import QAAgencyAllotOl from "pages/SOModule/Allot/QAAgencyAllotOl";
import QAOLApprovalCycle from "pages/QAOLApprovalCycle";
import IOLDehradun from "pages/SummaryData/IOL/IOLDehradun";
import { Ballot, Home } from "@material-ui/icons";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import ExternalInoteGeneration from "pages/InspectorModule/INote/ExternalInoteGeneration";
import { useNotification } from "context/notification";
import { StyledListItem } from "./SuperAdminTreeView";
import { ORG_TYPE} from "../../../Globals.js";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
export default function DCTreeView() {
  const dispatch = useDispatch();
  const { notificationCategories } = useNotification();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [selectedItem, setSelectedItem] = useState(1);
  const isAssemblyEmp = loggedInUser?.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;
  const hasLatestOL = notificationCategories?.OL?.hasLatest || notificationCategories?.OL_ALLOTMENT?.hasLatest;
  const hasLatestSO = notificationCategories?.SO?.hasLatest || notificationCategories?.SO_ALLOTMENT?.hasLatest;

  useEffect(() => {
    dispatch(selectItem(<CqaoDashboardMain />));
  }, []);
const QAAgency = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY 
  const items = [
    {
      id: 1,
      label: "Dashboard",
      header: true,
      child: [{ id: 1, label: `Dashboard `, Icon: DashboardIcon, component: <IOLDehradun /> }],
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
  (notificationCategories?.SO?.count || 0)

  :   (notificationCategories?.SO_ALLOTMENT?.count || 0)
})`,

          Icon: Home,
          isActive: hasLatestSO,
          component: <SONotification id={3} />,
        },
        {
          id: 4,
          // label: isArmy ? `QACL (${olNotifications?.length}) ` : `OL (${olNotifications?.length})`,
         label: `OL(${QAAgency 
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
        {
          id: 300,
          // label: isArmy ? `QACL (${olSenderNotifications?.length}) ` : `OL (${olSenderNotifications?.length})`,
          label: `OL`,
          Icon: Home,
          component: <OLNotification id={300} />,
        },
      ],
    },

    {
      id: 30,
      label: "Allot",
      header: true,
      child: [
        { id: 40, label: `SO Allot`, Icon: Home, component: <AllotOfficers /> },
        {
          id: 5,
          // label: isArmy ? `QACL Allot` : `OL Allot`,
          label: `OL Allot`,
          Icon: StorageSharpIcon,
          component: <QAAgencyAllotOl />,
        },
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
      id: 15,
      // label: isArmy ? "QACL Module" : "OL Module",
      label: "QACL Module",
      header: true,
      child: [
        {
          id: 8,
          // label: isArmy ? `QACL Details` : `OL Details`,
          label: `QACL Details`,
          Icon: Home,
          component: <InspectOLTable />,
        },
        { id: 9, label: `QACL Approval Cycle`, Icon: AssignmentTurnedInIcon, component: <QAOLApprovalCycle /> },
        {
          id: "10",
          //  label: isArmy? `Returned QACL`: `Returned OL`,
          label: `Returned OL`,
          Icon: Ballot,
          component: <ReturnedOL />,
        },
        { id: "11", label: `I-Note`, Icon: Ballot, component: <ExternalInoteGeneration /> },
      ],
    },
    {
      id: 13,
      label: "INote Details",
      header: true,
      child: [{ id: 19, label: "Instrument List(OLF)", Icon: SupervisorAccountIcon, component: <DetailsINote /> },
      { id: 20, label: "Instrument List(CQAI)", Icon: SupervisorAccountIcon, component: <CQAIDetailsINote /> },],
    },
    // {
    //   id: 6,
    //   label: "Registers",
    //   header: true,
    //   child: [
    //     { id: "partNo", label: `SO Register `, Icon: LibraryBooksIcon, component: <PORegister /> },
    //     // { id: 'A1', label: isArmy? `QACL Register` : `OL Register`, Icon: LibraryBooksIcon, component: <OLRegister /> },
    //     { id: "A1", label: `OL Register`, Icon: LibraryBooksIcon, component: <OLRegister /> },
    //     { id: "A2", label: `I-Note Register`, Icon: LibraryBooksIcon, component: <INoteRegister /> },
    //   ],
    // },
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
