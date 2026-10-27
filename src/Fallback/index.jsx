import { Typography } from "@material-ui/core";
import Close from "@material-ui/icons/HighlightOff";
import Button from "components/Button";
import "./Fallback.css";
import somethingWentWrong from "assets/Images/something_went_wrong.svg"

const Fallback = ({ resetErrorBoundary, error }) => {
  console.log(error.stack);
  return (
    <section className="fallback">
      <header className="fallback-header">
        <img  alt="SOMETHING_WENT_WRONG" src={somethingWentWrong} style={{width:300}} />
        <div>
        <Close style={{ fontSize: "4rem" }} color="error"></Close>
        </div>
        <Typography variant="h4">Something went wrong!!</Typography>
        <Typography color="textSecondary">We are going to fix it. Try later.</Typography>
        <Typography color="textSecondary" variant="caption">
          {error.message}
        </Typography>
      </header>
      <Button color="secondary" onClick={resetErrorBoundary}>
        Retry
      </Button>
    </section>
  );
};

export default Fallback;
