import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { WING_ID } from "../../Globals";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
//components
import { selectItem } from "Redux/Actions/SelectTreeItem";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import ViewOLScrutiny from "pages/Enclosures/Enclosure3/ViewOLScrutiny";
import Button from "components/Button";
import OLTable from "pages/Sslip/SSlipTable";
import ViewOL from "pages/SOModule/SupplyOrderDetails/View/ViewOL";
import CheckListTabsIG from "./TabsGeneral";

export default function InspectOLIG() {
  const dispatch = useDispatch();
  const obj = useSelector((state) => state?.inspectOLReducer.inspectOlNumber);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          <Grid items xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              type="Close"
              onClick={() => {
                if (user_role === 9) {
                  dispatch(selectItem(<OLTable />));
                } else if (user_role === 5 || user_role === 6 || user_role === 2) {
                  dispatch(selectItem(<ViewOL />));
                } else {
                  dispatch(selectItem(<InspectOLTable />));
                }
              }}
              variant="contained"
              color="Secondary"
              // size="small"
              startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
            >
              Back
            </Button>
          </Grid>

          <Grid items xs={12} sm={12} md={2} lg={2} xl={2}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>SO Number: </span>
              {obj.soNumber}
            </Typography>
          </Grid>
          <Grid items xs={12} sm={12} md={2} lg={2} xl={2}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>
                {isArmy ? "QACL" : "OL"}
                Number:{" "}
              </span>
              {obj.olNumber}
            </Typography>
          </Grid>
          <Grid items xs={12} sm={12} md={2} lg={2} xl={2}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>Offered Date: </span>
              {obj.offerDate}
            </Typography>
          </Grid>
          <Grid items xs={12} sm={12} md={3} lg={3} xl={3} align="right">
            <ViewOLScrutiny />
          </Grid>
        </Grid>
      </div>
      <br />
      <CheckListTabsIG />
    </div>
  );
}
