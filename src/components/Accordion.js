import React from "react";

import { Accordion, AccordionDetails } from "@material-ui/core";
import { AccordionSummary } from ".";
import { ExpandMore } from "@material-ui/icons";
import { PRIMARY_COLOR } from "../Redux/Types";

const AccordionReusable = ({ myOwnColor, children, title, tooltip }) => {
  return (
    <Accordion defaultExpanded={true} style={{ marginBottom: 10 }}>
      <AccordionSummary
        title={tooltip}
        style={{ backgroundColor: myOwnColor }}
        expandIcon={<ExpandMore style={{ color: PRIMARY_COLOR }} />}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails style={{ display: "block" }}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default AccordionReusable;
