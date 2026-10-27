/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../App.css";
import { useSelector } from "react-redux";
import TableComponent from "components/table/index";

import {  IconButton, MenuItem, Popover, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { getInspectSOUrl } from "pages/Services/URLs";

import SOTenderContract from "pages/ScrutinyGI/SOTenderContract";
import { selectItem } from "Redux/Actions/SelectTreeItem";

import { MoreVert } from "@material-ui/icons";



export default function InspectSOArmyTable() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state?.loggedInUser);



  const getInspectSO = () => {
    setLoading(true);
    AxiosInstanceTransaction.get(getInspectSOUrl + loggedInUser?.empId)
      .then(({ data }) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    getInspectSO();
    console.log("inside sbu so import");
  }, []);

  const actions = [
    {
      label: 'Scrutiny',
      onClick: (rowData) => {
        dispatch(selectItem(<SOTenderContract inObj={rowData} />));
      },
    },
    

  ]
  const [columns] = useState([
    { title: "SO Number", field: "orderNo", width: "auto" },
    { title: "File No", field: "fileNo", width: "auto" },
    { title: "SBU", field: "salesGroupName", width: "auto" },
    { title: "Alloted By", field: "allotedBy", width: "auto" },
    { title: "Material Description", field: "projectName", width: "auto" },
    { title: "Date", field: "orderDateStr",  width: "auto", filtering: true, },
    { title: "Action",  field: "", width: "auto",  filtering: true,  sorting: false, render: (rowData) => <MoreActionButtons rowData={rowData} actions={actions} /> },
  ]);

  return (
    <>
      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
      />

    </>
  );
}

const MoreActionButtons = ({ rowData, actions }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
      >
        <MoreVert />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom',     horizontal: 'right',   }}
        transformOrigin={{  vertical: 'top',    horizontal: 'right',   }}
      >
        {actions.map((el) => (
          <MenuItem
            key={el.label}
            onClick={() => {
              el.onClick(rowData)
            }}
            disabled={el?.disabled ? el?.disabled(rowData) : false}
            divider
          >
            <Typography variant="body2">{el.label}</Typography>
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}