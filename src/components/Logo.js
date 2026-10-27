import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import { Typography, Grid, Box } from "@material-ui/core";
import emblem from "../assets/Images/logo.webp";

// const useStyles = makeStyles((theme) => ({
//   typography: {
//     color: theme.palette.primary,
//     fontSize: "0.875rem",
//     display: "inline-block",
//     fontWeight: 500,
//     [theme.breakpoints.down("md")]: {
//       fontSize: 14,
//       fontWeight: 500,
//       color: theme.palette.primary,
//     },
//     [theme.breakpoints.down("sm")]: {
//       fontSize: 12,
//       fontWeight: 500,
//       color: theme.palette.primary,
//     },
//   },

//   image: {
//     [theme.breakpoints.up("lg")]: {
//       height: 55,
//     },
//     [theme.breakpoints.down("md")]: {
//       height: 55,
//     },
//     [theme.breakpoints.down("sm")]: {
//       height: 45,
//     },
//   },
//   color: {
//     color: theme.palette.common.white,
//   },
// }));

const useStyles = makeStyles((theme) => ({
  typography: {
    color: theme.palette.primary,
    fontSize: "0.875rem",
    display: "inline-block",
    fontWeight: 500,
    [theme.breakpoints.down("lg")]: {
      fontSize: 14,
      fontWeight: 500,
      color: theme.palette.primary,
    },
    [theme.breakpoints.down("md")]: {
      fontSize: 12,
      fontWeight: 500,
      color: theme.palette.primary,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
      fontWeight: 500,
      color: theme.palette.primary,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
      fontWeight: 500,
      color: theme.palette.primary,
    },
  },

  image: {
    [theme.breakpoints.up("lg")]: {
      height: 55,
    },
    [theme.breakpoints.down("md")]: {
      height: 52,
    },
    [theme.breakpoints.down("sm")]: {
      height: 48,
    },
    [theme.breakpoints.down("xs")]: {
      height: 46,
    },
  },
  color: {
    color: theme.palette.common.white,
  },
}));

function SampleApp(props) {
  const classes = useStyles();
  // const { textColor, color } = props;

  return (
    <>
      <span style={{ marginLeft: "10px" }}>
        <img src={emblem} alt="logo" className={classes.image} />
      </span>
    </>
  );
}
export default SampleApp;
