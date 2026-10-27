import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//material-ui
import { USER_DEPARTMENT } from "../../../Globals";
//pages
import SbuDashBoardMain from "pages/Dashboard/SbuDashboard/SbuDashBoardMain";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import OLNotification from "pages/Notifications/OLNotification/OLNotification";
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";
import IOLDehradun from "pages/SummaryData/IOL/IOLDehradun";
import AteDrilldownDashboard from "pages/SummaryData/IOL/drilldown-dashboard";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import CameraMappingTable from "pages/VideoInspection/Sbu/CameraMappingTable.js";
import LotDetails from "pages/InspectorModule/Lots/LotDetails";
import { Ballot, Home } from "@material-ui/icons";
import TableQACL from "pages/SOModule/OL/TableQACL";
import { useNotification } from "context/notification";
import { StyledListItem } from "./SuperAdminTreeView";
import { ORG_TYPE } from "../../../Globals.js";
import FishBone from "pages/SummaryData/IOL/fish-bone";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import CQAEDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
import ObservationForm from "pages/EnclosuresTable/ObservationForm";
import SOObservationTable from "pages/SOModule/SupplyOrderDetails/SOObservation/SOObservationTable";
import QccNotification from "pages/Notifications/QCCNotification/QccNotification";

export default function DOTreeView() {
  const dispatch = useDispatch();
  const { notificationCategories } = useNotification();

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isAssemblyEmp = loggedInUser?.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;
  const [selectedItem, setSelectedItem] = useState(1);
  const hasLatestOL = notificationCategories?.OL?.hasLatest || notificationCategories?.OL_ALLOTMENT?.hasLatest;
const QAAgency = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY 

  useEffect(() => {
    dispatch(selectItem(<SbuDashBoardMain />));
  }, [dispatch]);

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
      id: 1,
      label: "Fish-Bone Diagram",
      header: true,
      child: [{ id: 11, label: "Fish-Bone Diagram", Icon: Home, component: <FishBone /> }],
    },
    {
      id: 2,
      label: "Notification(Received)",
      header: true,
      child: [
        {
          id: 4,
         label: `S.Slip/OL(${QAAgency 
  ? 
  ( notificationCategories?.OL_ALLOTMENT?.count || 0)
  : (notificationCategories?.OL?.count || 0)
})`,
          Icon: Home,
          isActive: hasLatestOL,
          component: <OLNotification id={4} />,
        },
        {
                  id: 5,
                  label: `QCC Notification(${QAAgency 
          ? 
          ( notificationCategories?.QCC?.count || 0)
          : (notificationCategories?.QCC?.count || 0)
        })`,
                  Icon: Home,
                   isActive:hasLatestOL,
                  component: <QccNotification id={4} />,
                },
      ],
      
    },
    
    {
      id: 101,
      label: "Notification(Sent)",
      header: true,
      child: [
        {
          id: 300,
          label: `S.Slip/QACL`,
          Icon: Home,
          component: <OLNotification id={300} />,
        },
        // { id: 9, label: `Lots `, Icon: Ballot },
      ],
    },

    {
      id: 3,
      label: "Submission Slip Module",
      header: true,
      child: [
        { id: 3, label: `Lot Details `, Icon: Ballot, component: <LotDetails /> },
        { id: 40, label: `Challan`, Icon: Ballot, component: <INoteTable /> },
        // { id: 6, label: `Warrant Certificate`, Icon: Ballot, component: <INoteTable /> },
      ],
    },
    {
      id: 6,
      label: "QACL Module",
      header: true,
      child: [
        { id: 7, label: `Offer Letter`, Icon: Ballot, component: <TableQACL IsOl={true} /> },
        // { id: 8, label: `External INote`, Icon: Ballot,},
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
      id: 4,
      label: "INote Details ",
      header: true,
      child: [
        { id: 19, label: "Instrument List(OLF)", Icon: SupervisorAccountIcon, component: <DetailsINote /> },
         { id: 20, label: "Instrument List(CQAI)", Icon: SupervisorAccountIcon, component: <CQAIDetailsINote /> },
      ],
    },
     //IVNV Observation Added Different Module For Camera Modified by:Shruti Sanjay Date:07-07-2026
    {
      id: 15,
      label: "Remote Inspection",
      header: true,
      child: [
        {
          id: "v5",
          label: `SBU Camera Mapping `,
          Icon: Ballot,
          component: <CameraMappingTable />,
        },
      ],
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
