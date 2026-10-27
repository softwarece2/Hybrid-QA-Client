import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Ballot from "@material-ui/icons/Ballot";
import Home from "@material-ui/icons/Home";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LineItemsTable from "../../SOModule/LineItemsDetails/LineItemsTable";
import SbuSoTable from "../../SOModule/SupplyOrderDetails/SbuSO/SbuSoTable";
import SbuDashBoardMain from "pages/Dashboard/SbuDashboard/SbuDashBoardMain";
// import SbuDashboardMain1 from "pages/Dashboard/SbuDashboard/SbuDashboardMain1";

import SONotification from "pages/Notifications/SONotification/SONotification";
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";
// import InspectionReportEntry from "../../SOModule/LineItemsDetails/InspectionReportEntry";
import MasterPartNo from "pages/MasterPartNo";
import ProductToPartNoMapping from "pages/ProductToPartNoMapping";
import IOLDehradun from "pages/SummaryData/IOL/IOLDehradun";
import EpcodeTable from "pages/SOModule/LineItemsDetails/EpcodeTable";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import DepartmentToProductMapping from "pages/DepartmentToProductMapping";
import WarrantDetailsTable from "pages/SOModule/LineItemsDetails/WarrantDetailsTable";
import TableQACL from "pages/SOModule/OL/TableQACL.js";
import { useNotification } from "context/notification";
import { StyledListItem } from "./SuperAdminTreeView";
import { ORG_TYPE} from "../../../Globals.js";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
export default function PlannerTreeView() {
  const dispatch = useDispatch();
  const { notificationCategories } = useNotification();
  const [selectedItem, setSelectedItem] = useState(1);
  const hasLatestSO = notificationCategories?.SO?.hasLatest || notificationCategories?.SO_ALLOTMENT?.hasLatest;
   const loggedInUser = useSelector((store) => store.loggedInUser);
const QAAgency = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY 
  useEffect(() => {
    dispatch(selectItem(<SbuDashBoardMain />));
  }, []);

  const items = [
    {
      id: 1,
      label: "Dashboard",
      header: true,
      child: [{ id: 2, label: `Product Dashboard `, Icon: Home, component: <IOLDehradun /> }],
    },

    {
      id: 30,
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
      ],
    },
    {
      id: 101,
      label: "Notification(Sent)",
      header: true,
      child: [{ id: 100, label: `SO/PO`, Icon: Home, component: <SONotification id={100} /> }],
    },

    {
      id: 5,
      label: "Supply Order Module",
      header: true,
      child: [
        { id: 6, label: `SO/PO Details`, Icon: Ballot, component: <SbuSoTable /> },
        { id: 7, label: `Line Items Details`, Icon: Home, component: <LineItemsTable /> },
        { id: 8, label: `Warrant Details`, Icon: Home, component: <WarrantDetailsTable /> },
      ],
    },
    // {
    //   id: 23,
    //   label: "QACL Module ",
    //   header: true,
    //   child: [{ id: "partNo", label: `QACL`, Icon: Ballot, component: <TableQACL IsOl={true} /> }],
    // },
    //     {
    //       id: 9,
    //       label: "Registers",
    //       header: true,
    //       child: [
    //         { id: 'partNo1', label: `SO Register`, Icon: LibraryBooks, component: <PORegister/> },
    //         { id: 'A1', label: `OL Register`, Icon: LibraryBooks, component: <OLRegister/> },
    //         { id: 'A2', label: `I-Note Register`,  Icon: LibraryBooks, component: <INoteRegister/> },

    // ],
    //     },

    {
      id: 10,
      label: "Products",
      header: true,
      child: [
        { id: 13, label: "Material No./EP Code No", Icon: Ballot, component: <MasterPartNo /> },
        { id: 14, label: "Product to Material No./EP Code No mapping", Icon: Ballot, component: <ProductToPartNoMapping /> },
        { id: 15, label: "Department to Product Mapping", Icon: Ballot, component: <DepartmentToProductMapping /> },
        // { id:16, label: "Reg. No. Mapping", Icon: Home, component: <RegNoMapping /> },
        { id: 17, label: "EP Code Details", Icon: Home, component: <EpcodeTable /> },
      ],
    },

    {
      id: 18,
      label: "INote Details",
      header: true,
      child: [
        { id: 19, label: "Instrument List(OLF)", Icon: SupervisorAccountIcon, component: <DetailsINote /> },
         { id: 20, label: "Instrument List(CQAI)", Icon: SupervisorAccountIcon, component: <CQAIDetailsINote /> },
        // { id: 20, label: "Warrant Certificate", Icon:Ballot, component: <WarrentCertificate /> }
      ],
    },
  ];
  return (
    <div style={{ backgroundColor: "#fafafa", minHeight: "calc(100% - 109px)", padding: 4 }}>
      {items.map((item) => (
        <StyledListItem key={item.id} item={item} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      ))}
    </div>
  );
}
