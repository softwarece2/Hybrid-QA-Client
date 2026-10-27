import React from "react";
//material-ui

import { Grid, Paper, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import "jspdf-autotable";
import { useDispatch } from "react-redux";
import EnvironmentalTest from "pages/Enclosures/Enclosure6/EnvironmentalTest";
import { selectItem } from "Redux/Actions/SelectTreeItem";

//icons
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/Button";

//pages

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  paper: {
    width: "95%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "95%",
    },
    [theme.breakpoints.down("md")]: {
      width: "95%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "95%",
    },
  },
  size: {
    width: 15,
    height: 15,
  },
  box: {
    border: "1px solid black",
  },
  table: {
    minWidth: "100%",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 500,
  },
  subHeading: {
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  textSize: {
    fontSize: "0.875rem",
  },
  labelNote: {
    fontSize: "12px",
    // color: "grey",
  },
}));

export default function InspectionTestCertificate() {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <>
      <Grid Container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid Items xs={12} Align="left">
          <Button
            type="Button"
            size="small"
            onClick={() => dispatch(selectItem(<EnvironmentalTest />))}
            className={classes.button}
            variant="outlined"
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>
      </Grid>{" "}
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
            <Typography className={classes.subHeading}>EMC TEST CENTRE</Typography>
            <Typography className={classes.subHeading}>(QA DIVISION)</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid align="center">
            <Typography style={{ border: "1px solid black", padding: 8, fontWeight: 600 }}>
              TEST REQUEST REVIEW
            </Typography>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              Notification Number : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>1000170176</span>
            </Typography>
            <br />
          </Grid> */}
        </Grid>
        <br />
        <Grid container spacing={2} className={classes.box}>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>
              Request No : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>4000265722</span> {""}{" "}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>
              Date : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>01/09/2022</span>{" "}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>
              WO/SO/WBS No : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>NSCO-21RD-03-ENV</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>
              Cost Centre No : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>11208012</span>
            </Typography>
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid container spacing={2} className={classes.box}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="left">
            <Typography className={classes.subHeading}>
              User Dept. : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Internal</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="left">
            <Typography className={classes.subHeading}>
              Dept.Name : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>D & E-CS/NS</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="left">
            <Typography className={classes.subHeading}>
              Part No : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>1121 879 038 16</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="left">
            <Typography className={classes.subHeading}>
              Equipment Name :{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Ethernet Edge Switch VSP-26Port</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="left">
            <Typography className={classes.subHeading}>Equipment Sl.No : 149 </Typography>
            <Typography className={classes.labelNote}>
              {" "}
              <span style={{ color: "red" }}>*</span>(If Sl.No. exceeds then enter the value in Brief Description text
              box )
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="left"></Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              Application Platform : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Surface Ships</span>{" "}
              Below deck, SDN P15B
            </Typography>
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid container spacing={2} className={classes.box}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              Brief Description of the Equipment :{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>
                Ethernet Edge Switch VSP 26 Port is designed based on 5420M-48W-4YE COTS module. This switch has
                complete layer 2 switching capabilities. This switch provide 22no's of POE ports supporting
              </span>
            </Typography>
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid container spacing={2} className={classes.box}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>Operating modes of EUT :</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={5} xl={5} align="left">
            <Typography className={classes.subHeading}>
              IP Power requirements of EUT :{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Source AC Freq. 50 Hz</span>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={2} xl={2} align="left">
            <Typography className={classes.subHeading}>
              Voltage : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>230V</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={5} xl={5} align="left">
            <Typography className={classes.subHeading}>
              Power consumption : 500 Watts{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Source AC Freq. 50 Hz</span>
            </Typography>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid align="center">
            <Typography style={{ border: "1px solid black", padding: 8, fontWeight: 600 }}>
              TESTS AS PER MIL-STD: 461F
            </Typography>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={2} className={classes.box}>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="left">
            <Typography className={classes.subHeading}>
              Conducted Emission(CE) :{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>CE101 CE102 Nil Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="left">
            <Typography className={classes.subHeading}>
              Radiated Emission(RE) :{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>RE101 RE 102-18GHz Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              Conducted Susceptibility :{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>
                CS101 CS106 CS114 CS115 CS116 Nil Nil Nil Nil Nil Nil{" "}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="left">
            <Typography className={classes.subHeading}>
              Radiated Susceptibility :{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>RS101 RS103 UPTO 40GHz Nil Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="left">
            <Typography className={classes.subHeading}>
              MIL-STD-1275 : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="left">
            <Typography className={classes.subHeading}>
              PCI (188-125-1/2) : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="left">
            <Typography className={classes.subHeading}>
              MIL-STD-704 :{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>
                Nil Nil Nil Nil Nil Nil Nil Nil Nil Nil Nil
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>Shielding Effectiveness : </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={3} xl={3} align="left">
            <Typography>
              Frequency - <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3} align="left">
            <Typography>
              Magnetic Field Dynamic Range - <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3} align="left">
            <Typography>
              Electric Field Dynamic Range- <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>Specific Requirements :</Typography>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid align="center">
            <Typography style={{ border: "1px solid black", padding: 8, fontWeight: 600 }}>COMMERCIAL TESTS</Typography>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={2} className={classes.box}>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>
              Conducted Emission(CE) : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={9} xl={9} align="left">
            <Typography className={classes.subHeading}>
              Radiated Emission(RE) : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              IEC 61000 STD :{" "}
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}> Nil Nil Nil Nil Nil Nil Nil Nil Nil </span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>
              Level : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>For ESD : Contact : Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>
              Air : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>
              For Surge : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3} align="left">
            <Typography className={classes.subHeading}>
              For Surge : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              On I/O Signal, data : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>Nil</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              Other Specific Requirements : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}></span>
            </Typography>
            <Typography className={classes.labelNote}>
              {" "}
              <span style={{ color: "red" }}>*</span>(If level x- then enter the value in adjacent text box provided)
            </Typography>
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid container spacing={2} className={classes.box}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              MANUFACTURED BY : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}></span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              SUBMITTED BY : <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}></span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.labelNote}>
              {" "}
              <span style={{ color: "red" }}>*</span>Provide Name of Company with Full Postal Address in both the above
              fields (Same will be printed on the compliance test report)
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
