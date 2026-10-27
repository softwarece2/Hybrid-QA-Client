import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
//material-ui
import { Home, Ballot } from "@material-ui/icons";

//pages

import { USER_DEPARTMENT } from "Globals.js";
import AddOrgTable from "../../UserManagement/AddOrganization/AddOrgTable";
import AddUserTable from "../../UserManagement/AddUser/AddUserTable";
//redux
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";

import AddConsigneeTable from "pages/UserManagement/AddConsignee/AddConsigneeTable";
import AddIndenterTable from "pages/UserManagement/AddIndenter/AddIndenterTable";
import DepartmentTable from "pages/UserManagement/department/DepartmentTable";
import FirmAgencyMapTable from "pages/UserManagement/FirmAgencyMap/FirmAgencyMapTable";
import ItemCategoryTable from "pages/UserManagement/ItemCategory/ItemCategoryTable";
import SalesGroupTable from "pages/UserManagement/SalesGroup/SalesGroupTable";
import SupplierTable from "pages/UserManagement/Supplier/SupplierTable";
import UomTable from "pages/UserManagement/UOM/UomTable";
import MasterPartNo from "pages/MasterPartNo";
import ProductToPartNoMapping from "pages/ProductToPartNoMapping";
import DepartmentToProductMapping from "pages/DepartmentToProductMapping";
import AtpSchemaMapping from "pages/Dashboard/AtpSchemaMapping";
import CameraMappingTable from "pages/VideoInspection/Sbu/CameraMappingTable";

function Pulse() {
  return (
    <div className="notification">
      <div></div>
      <div></div>
    </div>
  );
}

function ListItemChild({ item, selectedItem, setSelectedItem, isLast }) {
  const dispatch = useDispatch();
  const { label, Icon, id, isActive } = item;
  const isMenuItemActive = selectedItem === id;
  
  return (
    <div
      onClick={() => {
        setSelectedItem(item.id);
        dispatch(selectItem(item.component));
      }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "4px 10px",
        minHeight: 30,
        borderBottom: isLast ? undefined : "1px solid skyblue",
        backgroundColor: isMenuItemActive ? "#205375" : "aliceblue",
        cursor: "pointer",
      }}
    >
    { Icon && <Icon style={{ fontSize: 28, paddingRight: 16, color: isMenuItemActive ? "white" : "#205375" }} />}
      <Typography
        style={{ fontWeight: isMenuItemActive ? "bold" : "normal", color: isMenuItemActive ? "white" : "#205375" }}
        variant="subtitle2"
        color="textPrimary"
      >
        {label}
      </Typography>
      {isActive && !isMenuItemActive ? <Pulse /> : ""}
    </div>
  );
}

export function StyledListItem({ item, selectedItem, setSelectedItem }) {
  const { label, child } = item;
  return (
    <>
      {!item.child ? (
        <div style={{ marginBottom: 10 }}>
          <ListItemChild item={item} selectedItem={selectedItem} setSelectedItem={setSelectedItem} isLast />
        </div>
      ) : (
        <div style={{ border: "1px solid skyblue", marginBottom: 10 }}>
          <Typography variant="subtitle1" color="primary" style={{ paddingLeft: 12, marginBottom: 0, backgroundColor: "#dbf5ff" }}>
            <b>{label}</b>
          </Typography>

          <div>
            {child?.map((c, i) => (
              <ListItemChild
                key={c.id}
                item={c}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                isLast={child?.length - 1 === i}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function SuperAdminTreeView() {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(1);

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isAssemblyEmp = loggedInUser?.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;

  useEffect(() => {
    dispatch(selectItem(<AddOrgTable />));
  }, []);

  const items = [
    {
      id: 1,
      label: "Org Set Up",
      header: true,
      child: [
        { id: 1, label: `Organization `, Icon: Home, component: <AddOrgTable /> },
        { id: 2, label: `Sales Group `, Icon: Home, component: <SalesGroupTable /> },
        { id: 21, label: `Department `, Icon: Home, component: <DepartmentTable /> },
        { id: 7, label: `Firm-Agency Mapping`, Icon: Home, component: <FirmAgencyMapTable /> },
      ],
    },

    {
      id: 2,
      label: "User Management",
      header: true,
      child: [{ id: 3, label: `User `, Icon: Home, component: <AddUserTable /> }],
    },

    {
      id: 3,
      label: "Add Details",
      header: true,
      child: [
        { id: 4, label: `Indentor `, Icon: Home, component: <AddIndenterTable /> },
        { id: 5, label: `Consignee `, Icon: Home, component: <AddConsigneeTable /> },
        { id: 6, label: `Supplier`, Icon: Home, component: <SupplierTable /> },
        { id: 9, label: `UoM`, Icon: Home, component: <UomTable /> },
        { id: 10, label: `Item Category`, Icon: Home, component: <ItemCategoryTable /> },
      ],
    },
    {
      id: 4,
      label: "Products",
      header: true,
      child: [
        { id: "partNo", label: `Material No./EP Code No `, Icon: Ballot, component: <MasterPartNo /> },
        { id: "A1", label: `Product to Material No./EP Code No mapping `, Icon: Ballot, component: <ProductToPartNoMapping /> },
        { id: "A2", label: `Department to Product Mapping`, Icon: Ballot, component: <DepartmentToProductMapping /> },
        { id: "A3", label: `Parameter Protocol`, Icon: Ballot, component: <AtpSchemaMapping /> }, //
      ],
    },
    //IVNV Observation Added Different Module For Camera Modified by:Shruti Sanjay Date:07-07-2026
    {
      id: 15,
      label: "Remote Inspection",
      header: true,
      child: [
        { id: "v4", label: `SBU Camera Mapping`, Icon: Ballot, component: <CameraMappingTable /> },
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
