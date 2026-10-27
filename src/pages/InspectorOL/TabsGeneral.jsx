import React from "react";
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

const components = [
  { name: "Enclosure-7", subName: "PHY IG", element: <ISIB /> },
  { name: "Enclosure-7", subName: "SPARES IG", element: <PCB /> },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`scrollable-auto-tabpanel-${index}`} aria-labelledby={`scrollable-auto-tab-${index}`} {...other}>
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

const useStyles = makeStyles(theme => ({
  selectedTab: {
    backgroundColor: "#BFE9FB",
    color: theme.palette.primary.dark,
  },
}));

export default function CheckListTabsIG() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          {components.map((t, i) => (
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
      {components.map((t, i) => (
        <TabPanel value={value} index={i}>
          {t.element}
        </TabPanel>
      ))}
    </div>
  );
}
