import React from "react";

import CustomTab from "components/Tab";

import ReportDetails from "./Details";
import ReportSummary from "./Summary";
import { Container } from "@material-ui/core";

export default function Reports({ title }) {
  
  const tabList = [
  { label: "Details", component: <ReportDetails /> },
  { label: "Summary", component: <ReportSummary /> },
];
   return (
    <>
  
      <Container style={{ padding: 16 }}>
        <CustomTab tabList={tabList} />
      </Container>
  
    </>
  );
}
