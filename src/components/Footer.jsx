import React from "react";
import { Typography } from "@material-ui/core";
import { OLMS_INFO } from "Globals.js";

const Footer = () => {
  return (
    <Typography variant="caption" align="center" color="textSecondary">
      <div style={{ textAlign: "inherit" }}>{OLMS_INFO.copyrightText} All rights reserved.</div>
      <div>Content & maintenance - Ministry of Defence | Design & Development - Bharat Electronics Ltd.</div>
    </Typography>
  );
};

export default Footer;
