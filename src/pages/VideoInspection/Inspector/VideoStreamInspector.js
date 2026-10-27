import React from "react";
import { Grid, Box,  makeStyles } from "@material-ui/core";

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from 'components/Button';


export default function VideoStreamInspector() {

  const useStyles = makeStyles((theme) => ({
    videoLayout: {
      backgroundColor: 'white',
      overflow: 'auto',
      height: '83vh',
    },
    backbtn: {
      marginTop: '10px',
      marginLeft: '10px',
    },
  }));

  const classes = useStyles();
  // const params = useParams();
  const meetlink = `https://hmis-videocall.web.app/?id=112`;
  // const meetlink = `https://xenvis.in/login`;

  return (
    <>
      {' '}


      <>
        <Box className={classes.backbtn}>
          <Button
            color='secondary'
            // onClick={() => navigate('/')}
            variant='contained'
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Box>
        <Box p={5}>
          <Grid container xs={12} spacing={2}>
            <Grid item xs={12} sm={7} md={7} lg={7} xl={7} >
              <Box className={classes.videoLayout}>
                <iframe
                  title='videoModule'
                  allow='camera; microphone'
                  src={meetlink}
                  style={{ width: '100%', height: '80vh' }}
                  frameBorder='0'
                  scrolling='no'
                ></iframe>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>

    </>
  );
}
