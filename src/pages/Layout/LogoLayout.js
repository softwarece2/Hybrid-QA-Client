import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import cqaenavy from "../../assets/Images/CQAE_NAVY_logo.png";
import SQAE from "assets/Images/olf_dn_logo.png";

const useStyles = makeStyles((theme) => ({
  typography: {
    fontSize: "1.5rem",
    display: "inline-block",
    color: theme.palette.primary.main,
    // color: "black",
    fontWeight: 600,
    flex: 1,
  },
}));

function Layout() {
  const classes = useStyles();

  return (
    <Box style={{ display: "flex", padding: 8, alignItems: "center" }}>
      <img src={SQAE} alt="logo" height={60} width={60} />
      <Typography align="center" className={classes.typography}>
        QA 4.0
      </Typography>
    </Box>
  );
}
export default Layout;
