import { Paper, Typography, Box, Divider } from "@material-ui/core";
import React from "react";

const TableContainer = (props) => {
  const { title = "", children, ...otherProps } = props;

  return (
    <Paper component={Box} mt={0}>
      <Typography
        {...otherProps}
        variant="h5"
        color="primary"
        style={{ padding: "8px 16px", backgroundColor: "#fafafa", textAlign: "center" }}
      >
        {title}
      </Typography>
      <Divider />
      {children}
    </Paper>
  );
};

export default TableContainer;
