import { Badge, ListItemSecondaryAction } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Mail from "@material-ui/icons/Mail";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    minWidth: 250,
    minHeight: "96%",
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: "white",
    borderRadius: 10,
    // padding: theme.spacing(1),
  },

  item: {
    borderRadius: 10,
    // padding: theme.spacing(1),
  },
}));

export default function UserList({
  indianNames,
  selectedUser,
  handleListItemClick,
}) {
  const classes = useStyles();
  return (
    <div style={{ maxHeight: "54vh", overflow: "auto" }}>
      {" "}
      <List
        // dense
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        {indianNames?.map((item, index) => (
          <ListItem
            button
            key={index}
            className={classes.item}
            classes={{ selected: classes.selected }}
            selected={selectedUser === item?.id}
            onClick={() => handleListItemClick(item.id)}
          >
            <ListItemText primary={item?.ename} />
            <ListItemSecondaryAction>
              <Badge
                badgeContent={item?.count}
                color="primary"
                overlap="rectangular"
              >
                {selectedUser !== item?.id ? (
                  <Mail fontSize="small" />
                ) : (
                  <Mail fontSize="small" style={{ color: "#fff" }} />
                )}
              </Badge>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
