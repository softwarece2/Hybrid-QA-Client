/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Divider from "@material-ui/core/Divider";
import TreeView from "@material-ui/lab/TreeView";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import HomeIcon from "@material-ui/icons/Home";
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";
import MainDahsboard from "pages/Dashboard/MainDashboard/MainDahsboard";
import DGQAHierarchy from "pages/UserManagement/DGQAHierarchy/DGQAHierarchy";
import { StyledTreeItem, useTreeItemStyles } from "./InspectorTreeView";

export default function DGQATreeView() {
  const classes = useTreeItemStyles();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    console.log(e.target.nodeId);
  };

  useEffect(() => {
    dispatch(selectItem(<MainDahsboard />));
  }, []);

  return (
    <>
      <TreeView
        onNodeToggle={handleChange}
        defaultCollapseIcon={<ArrowDropDownIcon className={classes.arrowIcon} />}
        defaultExpandIcon={<ArrowRightIcon className={classes.arrowIcon} />}
        defaultEndIcon={<div style={{ width: 24 }} />}
      >
        <StyledTreeItem labelText="Admin" labelIcon="null" header />

        <StyledTreeItem nodeId="1" labelText="Dashboard" labelIcon={HomeIcon} onClick={() => dispatch(selectItem(<MainDahsboard />))} />

        <StyledTreeItem nodeId="2" labelText="Org Structure" labelIcon={HomeIcon} onClick={() => dispatch(selectItem(<DGQAHierarchy />))} />

        <Divider />
      </TreeView>
    </>
  );
}
