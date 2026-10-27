/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { Box, Grid } from "@material-ui/core";
import Paper from "./Paper";
import Button from "components/Button";
import { RESET_COLOR } from "Redux/Types";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { PRIMARY_COLOR } from "Redux/Types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  btn: {
    "& > *": {
      margin: theme.spacing(1),
    },
    alignContent: "right",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(0.1),
    color: theme.palette.primary.contrastText,
  },
}));

export default function SimpleTabs(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const primaryColor = useSelector((store) => store.selectedTheme.primary);

  const [value, setValue] = React.useState(0);
  const [lastAppliedPrimaryColor, setLastAppliedPrimaryColor] = React.useState(
    primaryColor
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClose = () => {
    dispatch({ type: PRIMARY_COLOR, payload: lastAppliedPrimaryColor });
    props.onClose();
  };

  useEffect(() => {
    setLastAppliedPrimaryColor(primaryColor);
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Grid container spacing={0}>
          <Grid items xs={11}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Primary Color" {...a11yProps(0)} />
              <Tab label="Secondary Color" {...a11yProps(1)} />
            </Tabs>
          </Grid>
          <Grid items xs={1}>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Paper color="primary" />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Paper color="secondary" />
      </TabPanel>

      <Grid item xs={12} align="right" className={classes.btn}>
        <Button color="primary" onClick={props.onClose} variant="contained">
          Apply
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: RESET_COLOR });
            props.onClose();
          }}
          color="primary"
          variant="outlined"
        >
          Reset
        </Button>
      </Grid>
    </div>
  );
}
