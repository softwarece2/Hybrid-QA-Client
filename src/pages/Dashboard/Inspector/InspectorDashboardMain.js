//Material ui-core
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
//Component
import InspectorOLGraph from "./InspectorGraph/InspectorOLGraph";
import InspectorSOGraph from "./InspectorGraph/InspectorSOGraph";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 400,
  },
}));

export default function InspectorDashboardMain() {
  const classes = useStyles();

  return (
    <div className={classes.root} align="center">
      {/* <Typography className={classes.cardTitle} x><b><u>POs/ Contracts
</u></b>
</Typography> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} align="center">
          <InspectorSOGraph />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} align="center">
          <InspectorOLGraph />
        </Grid>
      </Grid>
    </div>
  );
}
