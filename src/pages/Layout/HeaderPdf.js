import { makeStyles } from "@material-ui/core/styles";

//material-ui
//logo
import { Grid, Typography } from "@material-ui/core";
import CQAElogo from "../../assets/Images/CQAElogo.png";



const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 8px 8px",
    // flexWrap: "wrap",
    // border: "1px solid grey",
    // borderRadius: 4,
    // [theme.breakpoints.down("sm")]: {
    //   display: "block",
    // },
  },
  heading: {
    borderTop: "1px solid",
    borderBottom: "1px solid",
    borderRight: "1px solid",
  },
  subHeading: {
    borderBottom: "1px solid",
    borderRight: "1px solid",
    padding: "13px",
  },
  doc: {
    borderTop: "1px solid",
    borderRight: "1px solid",
    paddingLeft: "4px",
  },
  version: {
    borderTop: "1px solid",
    borderRight: "1px solid",
    paddingLeft: "4px",
  },
  issueDate: {
    borderTop: "1px solid",
    borderRight: "1px solid",
    paddingLeft: "4px",
  },
  page: {
    borderTop: "1px solid",
    borderBottom: "1px solid",
    borderRight: "1px solid",
    paddingLeft: "4px",
  },
}));

export default function HeaderPdf({ headerValue }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container spacing={0} justifyContent="center">
        <Grid xs={2} style={{ border: "1px solid" }} align="center">
          <img src={CQAElogo} alt="CQAElogo" height={70} />
          <Typography style={{ fontSize: "0.875rem" }}>SQAE(L)</Typography>
        </Grid>

        <Grid xs={5}>
          <Grid container spacing={0}>
            <Grid xs={12} className={classes.heading}>
              <Typography align="center">Departmental Operational</Typography>
              <Typography align="center">Procedure</Typography>
            </Grid>
            <Grid xs={12} className={classes.subHeading}>
              <Typography align="center" alignItems="center">
                {headerValue?.subHeading}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid xs={2} align="left">
          <Grid xs={12} className={classes.doc}>
            <Typography>DOC</Typography>
          </Grid>
          <Grid xs={12} className={classes.version}>
            <Typography>Version</Typography>
          </Grid>
          <Grid xs={12} className={classes.issueDate}>
            <Typography>Issue Date</Typography>
          </Grid>
          <Grid xs={12} className={classes.page}>
            <Typography>Page</Typography>
          </Grid>
        </Grid>
        <Grid xs={2} align="left">
          <Grid xs={12} className={classes.doc}>
            <Typography>{headerValue?.doc}</Typography>
          </Grid>
          <Grid xs={12} className={classes.version}>
            <Typography>{headerValue?.version}</Typography>
          </Grid>
          <Grid xs={12} className={classes.issueDate}>
            <Typography>{headerValue?.issueDate}</Typography>
          </Grid>
          <Grid xs={12} className={classes.page}>
            <Typography>{headerValue?.page}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
