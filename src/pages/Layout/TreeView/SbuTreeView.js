/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@material-ui/icons/AddSharp";
import Divider from "@material-ui/core/Divider";
import TreeView from "@material-ui/lab/TreeView";
import { WING_ID } from "../../../Globals";
//material-ui icons
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import BallotIcon from "@material-ui/icons/Ballot";
import HomeIcon from "@material-ui/icons/Home";

import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ReturnedOL from "pages/EnclosuresTable/ReturnedOL";
//pages

import LineItemsTable from "../../SOModule/LineItemsDetails/LineItemsTable";
import ProjectDetailsTable from "../../SOModule/ProjectDetails/ProjectDetailsTable";
import SbuSoTable from "../../SOModule/SupplyOrderDetails/SbuSO/SbuSoTable";

//redux
import SbuDashBoardMain from "pages/Dashboard/SbuDashboard/SbuDashBoardMain";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import OLNotification from "pages/Notifications/OLNotification/OLNotification";
import SONotification from "pages/Notifications/SONotification/SONotification";
import OLTable from "pages/Sslip/SSlipTable";
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";
import ApplicableTestTable from "pages/ApplicableTest/ApplicableTestTable";
import UserDataTable from "pages/CqaeModule/UserDataTable";
import InStageMain from "pages/SOModule/InStageQC/InStageMain";

import CheckListMaster from "pages/checklist-master";
import MasterPartNo from "pages/MasterPartNo";
import ProductToPartNoMapping from "pages/ProductToPartNoMapping";
import IOLDehradun from "pages/SummaryData/IOL/IOLDehradun";

export default function SbuTreeView() {
  const dispatch = useDispatch();

  const notifications = useSelector((state) => state?.unreadNotificationsReducer?.unreadNotifications);

  const [soNotifications, setSoNotifications] = useState([]);
  const [olNotifications, setOlNotifications] = useState([]);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const handleChange = (e) => {
    console.log(e.target.nodeId);
  };

  useEffect(() => {
    dispatch(selectItem(<SbuDashBoardMain />));
  }, []);

  useEffect(() => {
    if (Array.isArray(notifications)) {
      let newSoNotifications = [];
      let newOlNotifications = [];
      const soNotifications = notifications?.filter((item) => item?.notificationCategory?.includes("SO"));
      const olNotifications = notifications?.filter((item) => item?.notificationCategory?.includes("OL"));

      soNotifications.forEach((element) => {
        if (!newSoNotifications?.map((item) => item?.notificationName)?.includes(element?.notificationName))
          newSoNotifications.push(element);
      });
      olNotifications.forEach((element) => {
        if (!newOlNotifications?.map((item) => item?.notificationName)?.includes(element?.notificationName))
          newOlNotifications.push(element);
      });

      setSoNotifications(newSoNotifications);
      setOlNotifications(newOlNotifications);
    }
  }, [notifications]);

  return (
    <>
     
    </>
  );
}
