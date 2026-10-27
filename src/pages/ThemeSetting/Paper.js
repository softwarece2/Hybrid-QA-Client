import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "Redux/Types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  paper: {
    cursor: "pointer",
    margin: theme.spacing(2),
    width: theme.spacing(10),
    height: theme.spacing(10),
    "&:hover": {
      boxShadow: "0 0px 10px 8px rgba(100, 100, 100, .4)",
    },
  },
}));

const colors = [
  "d8dbc4",
  "4f204b",
  "4a6163",
  "F44336",
  "E91E63",
  "9C27B0",
  "673AB7",
  "3F51B5",
  "00559d",
  "191e80",
  "0000ff",
  "2196F3",
  "03A9F4",
  "00BCD4",
  "009688",
  "4CAF50",
  "8BC34A",
  "CDDC39",
  "FFEB3B",
  "FFC107",
  "FF9800",
  "F4511E",
  "6D4C41",
  "3f2722",
  "607D8B",
  "000000",
  "222426",
  "ba68c8",
];

export default function SimplePaper({ color }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const primaryColor = useSelector((store) => store.selectedTheme.primary);
  const secondaryColor = useSelector((store) => store.selectedTheme.secondary);

  const palletTypeUI = () => {
    if (color === "primary") {
      return colors.map((el) => (
        <Paper
          key={el}
          style={{
            backgroundColor: "#" + el,
            transform: primaryColor === el ? "scale(1.5,1.5)" : "none",
          }}
          className={classes.paper}
          onClick={() => dispatch({ type: PRIMARY_COLOR, payload: el })}
        />
      ));
    } else {
      return colors.map((el) => (
        <Paper
          key={el}
          style={{
            backgroundColor: "#" + el,
            transform: secondaryColor === el ? "scale(1.5,1.5)" : "none",
          }}
          className={classes.paper}
          onClick={() => dispatch({ type: SECONDARY_COLOR, payload: el })}
        />
      ));
    }
  };

  return <div className={classes.root}>{palletTypeUI()}</div>;
}
