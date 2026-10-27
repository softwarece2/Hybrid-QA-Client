import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//pages
import Footer from "./Footer";

//component

//assets

import HybridQA from "assets/Videos/LatestHybridQA.gif";
import UserLogin from "./UserLogin";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#FBFBFB",
    minHeight: "100vh",
  },
  alignCenter: {
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
  alignCenterImage: {
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
  },
  image: {
    padding: "20px",
    [theme.breakpoints.up("md")]: {
      padding: "8px",
      height: 60,
    },
    [theme.breakpoints.down("md")]: {
      height: 55,
    },
    [theme.breakpoints.down("sm")]: {
      height: 30,
    },
  },
  typography: {
    padding: "4px",
    borderRadius: "8px",
    color: "black",
    fontSize: 24,
    fontWeight: 400,
    [theme.breakpoints.down("md")]: {
      fontSize: 24,
      fontWeight: 500,
      color: "#103A4D",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      fontWeight: 500,
      color: "#103A4D",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      fontWeight: 500,
      color: "#103A4D",
    },
  },
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
       
        <div
          style={{
            
            margin: "auto",
            padding: "80px 30px 0px 30px",
            
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
              
             
              <img
                style={{                  
                  maxHeight: "1000px",
                  height: "auto",
                  maxWidth: 1300,
                  width: "100%",
                  marginTop: 10,
                }}
                src={HybridQA}
                alt="HybridQA"
              />
            </Grid>

            <Grid
              item
              xs={12} sm={12}  md={4}   lg={4}    xl={4}
              style={{  maxHeight: "600px",  maxWidth: 1000,  margin: "auto",  }}
            >
              <UserLogin />
            </Grid>
          </Grid>
          <div
            style={{
              position: "fixed",
              left: "0px",
              right: "0px",
              bottom: "0px",
              marginBottom: "0px",
              width: "100%",
              zIndex: "999",
            }}
          >
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
