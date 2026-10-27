import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

import Button from "components/Button";
import notFoundImg from "assets/Images/404.svg";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="info">
      <img className="not-found" src={notFoundImg} alt="notFound" />
      <div className="not-found-text">
        <Typography variant="h3">We can't find that page</Typography>
        <Typography variant="body1" color="textSecondary">
          The page you are looking for does not exist. But you can click the button below to go back to the homepage.
        </Typography>
      </div>
      <Button component={Link} to="/Home" color="primary" id="home-button">
        Home
      </Button>
    </div>
  );
};

export default NotFound;
