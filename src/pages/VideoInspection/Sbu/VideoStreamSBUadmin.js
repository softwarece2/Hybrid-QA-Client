import { Box, Grid, makeStyles } from "@material-ui/core";


export default function VideoStreamSBUadmin(props) {
  
    const useStyles = makeStyles(() => ({
        videoLayout: {
            backgroundColor: "white",
            overflow: "auto",
            height: "83vh",
        },
    }));
 
    const classes = useStyles();
    const meetlink = `https://hmis-videocall.web.app/?id=${props.meetId}`;

    return (
        <>
            <Box>
                <Grid container spacing={2}>
                    <Grid item sm={8} xs={12} md={4} xl={12} lg={12} style={{ display: props.meetId ? "" : "none" }} >
                        <Box className={classes.videoLayout}>
                            <iframe  title="Embedded Content" allow="camera; microphone" src={meetlink} style={{ width: "100%", height: "80vh" }}></iframe>

                         

                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}