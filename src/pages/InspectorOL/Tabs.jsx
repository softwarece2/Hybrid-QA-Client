/** @format */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
//
import ISIB from "pages/Enclosures/Enclosure7/Checklist7/PhysicalInspection/ISIB/ISIB";
import PCB from "pages/Enclosures/Enclosure7/Checklist7/PhysicalInspection/PCB/PCB";
import SCM from "pages/Enclosures/Enclosure7/Checklist7/PhysicalInspection/SCM/SCM";
//
import ElectricalInspection from "pages/Enclosures/Enclosure9/Checklist9/ElectricalInspection";
import CablesInspection from "pages/Enclosures/Enclosure10/Checklist10/CablesInspection";

import PreDispatchInspection from "pages/Enclosures/Enclosure14/Checklist14/PreDispatchInspection";
import InspectionSpares from "pages/Enclosures/Enclosure14/Checklist14/InspectionSpares";

import { useSelector } from "react-redux";
import { WING_ID } from "Globals.js";
import ScrutinyThreeTierReport from "pages/scrutiny-3-TIER REPORT";
import PreInspection from "pages/Pre-Inspection/PreInspection";

import ATETable from "pages/ATE/ATETable";
import FAI from "excel-upload/FAI";
import QaSpares from "pages/QASpares";

const components = [
  { name: "Enclosure-7", subName: "ISIBddd", element: <ISIB /> },
  { name: "Enclosure-7", subName: "PCB", element: <PCB /> },
  { name: "Enclosure-7", subName: "SCM", element: <SCM /> },
  {
    name: "Enclosure-9",
    subName: "Elec Insp",
    element: <ElectricalInspection />,
  },
  {
    name: "Enclosure-10",
    subName: "Cables Insp",
    element: <CablesInspection />,
  },
  {
    name: "Enclosure-14",
    subName: "PDI Main",
    element: <PreDispatchInspection />,
  },
  {
    name: "Enclosure-14",
    subName: "PDI Spares",
    element: <InspectionSpares />,
  },
  {
    name: "ATE",
    subName: "ATE",
    element: <ATETable />,
  },
];
const armyTabs = [
  {
    name: "preInspection",
    subName: "Pre-Inspection",
    element: <PreInspection />,
  },
  {
    name: "3Tier",
    subName: "3-Tier Report",
    element: <ScrutinyThreeTierReport />,
  },

   {
    name: "Spares",
    subName: "Spares",
    element: <QaSpares />,
  },

];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  selectedTab: {
    backgroundColor: "#BFE9FB",
    color: theme.palette.primary.dark,
  },
}));

export default function CheckListTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [roleWiseTabs, setRoleWiseTabs] = React.useState([]);
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const obj = useSelector((state) => state?.inspectOLReducer.inspectOlNumber);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const isNavy = obj.inspOrgWingId === WING_ID?.NAVY;

  useEffect(() => {
    if (loggedInUser?.roleId === 9) {
      if (obj?.inspOrgWingId === WING_ID?.NAVY) {
        setRoleWiseTabs(components);
      } else {
        setRoleWiseTabs(armyTabs);
      }
    } else {
      if (loggedInUser?.wingId === WING_ID?.NAVY) {
        setRoleWiseTabs(components);
      } else {
        setRoleWiseTabs(armyTabs);
      }
    }
  }, [obj, loggedInUser]);

  console.log("Tabs-----");
  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Tabs
          value={value}
          onChange={handleChange}
          // indicatorColor='secondary'
          textColor="white"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          classes={{
            indicator: classes.indicator,
          }}
        >
          {roleWiseTabs?.map((t, i) => (
            <Tab
              label={t.subName}
              classes={{
                selected: classes.selectedTab,
              }}
              {...a11yProps(i)}
            />
          ))}
        </Tabs>
      </AppBar>
      {roleWiseTabs?.map((t, i) => (
        <TabPanel value={value} index={i}>
          {t.element}
        </TabPanel>
      ))}
    </div>
  );
}
