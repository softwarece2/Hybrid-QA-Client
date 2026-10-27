import { useEffect, useState, } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardHeader, Typography } from "@material-ui/core";

// import Main from "../OrgDashboard/Main";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    width: "100%",
    height: "400px",
    marginTop: 8,
  },
  chartRoot: {
    minHeight: 235,
    width: "100%",
    textAlign: "center",
  },
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function UploadedImage() {
  const classes = useStyles();

  const [image, setImage] = useState('')
  useEffect(() => {
    const config = {
      method: "GET",
      url: "upload/getLatest",
      responseType: "arraybuffer",
    };
    axiosInstance(config).then((response) => {
      const url = URL.createObjectURL(new Blob([response.data]));
      setImage(url)
    }).catch(console.log)
  }, [])

  return (
    <>
     
        <Card className={classes.chartRoot}>
          <CardHeader
            className={classes.card}
            disableTypography
            title={<Typography style={{ fontSize: "0.875rem", paddingLeft: "1rem" }}>Photogeomtory Image</Typography>}
          />

         {image ?<img src={image} alt="Photogeomtory" />:'Chart Not Available'}
        </Card>
      
    </>

  );
}
