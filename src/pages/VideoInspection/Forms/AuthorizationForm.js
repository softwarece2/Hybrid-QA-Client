import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    width: "100%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "80%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  padding: {
    paddingBottom: 10,
  },
}));

export default function AuthorizationForm() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} align="right">
            <Typography style={{ fontWeight: "bold" }}>Appx 'B'</Typography>
            <Typography style={{ fontWeight: "bold" }}>
              (Refers to Para 6 of SOP)
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography style={{ fontWeight: "bold" }}>
              <u> Authorization by SQAO for Virtual Inspection</u>
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>Authorization No…………………</Typography>
          </Grid>

          <Grid item xs={6} align="right">
            <Typography>Date……………………</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography>M/s………………………………………</Typography>
            <Typography>……………………………………………</Typography>
            <Typography>……………………………………………</Typography>
            <Typography>……………………………………………</Typography>
          </Grid>

          <Grid className={classes.paper}>
            1. Ref: Your Inspection Request No……………………………..dt………………….
          </Grid>

          <Grid className={classes.paper}>
            2. Your request for the Virtual inspection has been received and
            accepted.
          </Grid>

          <Grid className={classes.paper}>
            3. Having found Shri …………………………………………...of your firm suitable for
            virtual inspection. He/ She is nominated as Inspection coordinator
            and authorized for undertaking sampling and stamping on behalf of
            DGQA. Inspection Coordinator will represent DGQA on ground without
            any bias.
          </Grid>

          <Grid className={classes.paper}>
            4. He/ She will coordinator sealing of samples in tempered proof
            sealing bags and ensure that the same are forwarded to any NABL
            accredited Lab/ Govt Lab by firm.
          </Grid>

          <Grid className={classes.paper}>
            5. He/ She will contact the inspecting officer and confirm
            arrangements made including mode of final identification marking
            (stamping/ holographic sticker/ bar code) prior to undertaking
            virtual inspection.
          </Grid>

          <Grid className={classes.paper}>
            6. Every eventuality (viz promotion, change in employment)
            concerning the “inspection coordinator” will be communicated to
            Inspecting officer of DGQA.
          </Grid>

          <Grid className={classes.paper}>
            7. This authorization can be withdrawn without assigning any reasons
            by the inspecting officer.
          </Grid>

          <Grid className={classes.paper}>
            8. This authorization is valid for one year.
          </Grid>
        </Grid>
        <Grid item xs={12} align="right">
          <Typography>Name and Sign of SQAO with seal</Typography>
        </Grid>
      </Paper>
    </div>
  );
}
