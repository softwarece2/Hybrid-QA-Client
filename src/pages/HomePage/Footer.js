import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export default function Footer() {
  return (
    <Grid item xs={12} align="center" style={{ backgroundColor: "#15133C" }}>
      <Typography style={{ color: "white", fontSize: "14px" }}>
        Designed &amp; developed by{" "}
        <a
          rel="noreferrer"
          style={{ textDecoration: "none" }}
          target="_blank"
          href="https://bel-india.in/"
        >
          <span style={{ color: "#ffcb32" }}>
            Bharat Electronics Limited (Software SBU)
          </span>
        </a>
      </Typography>
    </Grid>
  );
}
