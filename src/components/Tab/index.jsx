import { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 32,
  },
  rootTab: {
    minHeight: 32,
    backgroundColor: theme.palette.grey[400],
    color: theme.palette.common.black,
  },
  selectedTab: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ border: "1px solid lightgrey" }}
      role="tabpanel"
      hidden={value !== index}
      id={`hmis-tabpanel-${index}`}
      aria-labelledby={`hmis-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function BasicTabs({ tabList }) {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        component={Paper}
        variant="fullWidth"
        value={value}
        onChange={handleChange}
        aria-label="hmis tabs"
        classes={{ root: classes.root }}
      >
        {tabList.map(({ label }) => (
          <Tab
            classes={{ selected: classes.selectedTab, root: classes.rootTab }}
            key={label}
            label={label}
          />
        ))}
      </Tabs>
      {tabList.map(({ component }, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {component}
        </CustomTabPanel>
      ))}
    </>
  );
}
