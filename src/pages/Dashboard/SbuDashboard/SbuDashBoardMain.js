import { Grid } from "@material-ui/core";
import CqaoINoteGraph from "../CqaoDash/INoteGraph/CqaoINoteGraph";


export default function SbuDashBoardMain() {

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
    

      <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
        <CqaoINoteGraph />
      </Grid>

    
    </Grid>
  );
}
