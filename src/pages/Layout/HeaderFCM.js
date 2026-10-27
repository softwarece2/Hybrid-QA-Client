import { makeStyles } from "@material-ui/core/styles";

//material-ui
//logo
import cqaenavy from "../../assets/Images/CQAE_NAVY_logo.png";
import azadiLogo from "../../assets/Images/azadiLogo.png";
import { Typography } from "antd";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 8px 8px",
    fontSize: "0.875rem",
  },
}));

export default function HeaderFCM() {
  const classes = useStyles();

  return (
    <>
      <Typography align="center" style={{ fontWeight: 600 }}>
        <u>FIRST CONTACT MEETING WITH FIRM -IS/FRM/011</u>
      </Typography>
      <br />
      <div className={classes.container}>
        <div>
          <img src={azadiLogo} alt="cqaeISO" height={60} width={160} />
        </div>

        <div>
          <Typography align="center" style={{ marginBottom: 8 }}>
            <u>CQAE (WE) / ISO 9001:2015 / NABL (TC-7418)</u>
          </Typography>

          <Typography align="center">
            <u> वरिष्ठ् गुणता आश्वासन स्थापना (यु उ), बैंगलुरू</u>
          </Typography>
          <Typography align="center">
            <u>Senior  QUALITY ASSURANCE ESTT (WE),</u>
          </Typography>

          <Typography align="center" style={{ marginBottom: 8 }}>
            <u>BENGALURU</u>
          </Typography>

          <Typography align="center">
            <u>FIRST CONTACT MEETING WITH FIRM ON RECEIPT</u>
          </Typography>

          <Typography align="center" style={{ marginBottom: 8 }}>
            <u>OF PURCHASE ORDER</u>
          </Typography>

          <Typography align="center">
            <u>DATE OF MEETING: </u> &nbsp;......................
          </Typography>
        </div>

        <div style={{ width: "160px" }} align="right">
          <img src={cqaenavy} alt="cqaeLogo" height={80} />
        </div>
      </div>
      <br />
    </>
  );
}
