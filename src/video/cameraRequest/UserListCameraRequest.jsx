import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
// import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstance from "pages/Services/AxiosInstance";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: "1px solid",
    borderColor: "aliceblue",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    maxHeight: 300,
    overflow: "auto",
  },
  selected: {
  },
}));

export default function UserListCameraRequestusers ({ olId, checked, setChecked }) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  // console.log(olId, "ppp");

  useEffect(() => {
    axiosInstance("employee/getAllDoAndHosQc/")
      .then(({ data }) => {
        setUsers(
          data.users.map((user) => ({
            label: user.name,
            id: user.id,
          }))
        );
      })
      .catch(console.log);
  }, []);

  // (users.length!=0) ? console.log("users "+ JSON.stringify(users)) : console.log();
  // (checked.length!=0) ? console.log(" selected users "+ JSON.stringify(checked)) : console.log();

  return (
    <>
      <Typography>
        <b>Select User to send invitation:</b>
      </Typography>
      <List className={classes.root} dense>
        {users.map(({ label, id }) => {
          const labelId = `checkbox-list-label-${id}`;

          return (
            <ListItem
              style={{ borderBottom: "1px solid lightgreen" }}
              key={id}
              role={undefined}
              dense
              button
              onClick={handleToggle(id)}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={label} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
