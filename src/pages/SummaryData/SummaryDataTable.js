import { useDispatch } from "react-redux";
import { Typography } from "@material-ui/core";
import Button from "components/Button";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import FirmData from "pages/OrgDashboard/FirmData";
import ATEFrequency from "pages/run-ate-frequency";
// import IOLDehradun from "./Iol/IOLDehradun";
import BELBgComplex from "./bel-bg-complex";
import FGKKanpur from "./FGK-Kanpur";

import Machalipatnam from "./machalipatnam";
import BemlTestSummary from "pages/Dashboard/beml";



export default function SummaryDataTable({ firm }) {
  const dispatch = useDispatch();

  function handleBack() {
    dispatch(selectItem(<FirmData />));
  }

  if (firm.orgId === 1) {
    return <BELBgComplex firm={firm} handleBack={handleBack} />;
  }

  if (firm.orgId === 247) {
    return <ATEFrequency firm={firm} handleBack={handleBack} />;
  }
  // if (firm.orgId === 254) {
  //   return <IOLDehradun firm={firm} handleBack={handleBack} />;
  // }

  if (firm.orgId === 248) {
    return <Machalipatnam firm={firm} handleBack={handleBack} />;
  }

 
 

  if (firm.orgId === 251) {
    return <FGKKanpur handleBack={handleBack} />;
  }
  if (firm.orgId === 245) {
    return <BemlTestSummary handleBack={handleBack} firm={firm} />;
  }

  console.log("test", firm?.orgId);
  return (
    <>
      <Button
        onClick={handleBack}
        size="small"
        variant="contained"
        color="secondary"
      >
        Back
      </Button>
      <Typography variant="h6" align="center" color="error">
        <b>Under Development</b>
      </Typography>
    </>
  );
}
