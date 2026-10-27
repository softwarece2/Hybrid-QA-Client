import { withStyles } from "@material-ui/core/styles";
import { Typography, IconButton,makeStyles,Chip } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { TableCell, TableRow } from "@material-ui/core";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";

import { Close } from "@material-ui/icons";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(0.5),
    top: theme.spacing(0.5),
    color: theme.palette.primary.contrastText,
  },
});

export const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, id, ...other } = props;
  return (
    <MuiDialogTitle id={id} disableTypography className={classes.root} {...other}>
      <Typography align="left" style={{ fontSize: "0.875rem" }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton size="small" className={classes.closeButton} onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    fontSize: "1rem",
    padding: "2px 8px",
  },
  body: {
    fontSize: 14,
    padding: "2px 8px",
  },
  
}))(TableCell);
const useStyles = makeStyles(() => ({
  /* Status.css */
  status: {
    borderRadius: 2,
    display: "inline-block",
    color: "white",
    fontSize: 14,
    fontWeight: 600,
  },

  Success: {
    backgroundColor: "#a8e6cf", // Pale Green
    color: "#274930", // Dark Forest Green
  },
  Error: {
    backgroundColor: "#f2d7d5", // Light Red
    color: "#493021", // Dark Maroon
  },
  Warning: {
    backgroundColor: "#ffe494", //  Pale Yellow
    color: "#6b4729", // Dark Brownish-Orange
  },
  Info: {
    backgroundColor: "#cce2ff", //  Very Light Blue
    color: "#2b5b88", //  Dark Navy
  },
  Primary: {
    backgroundColor: "#d0e8ff", //Light Blue
    color: "#1a4372", // Dark Blue
  },
  Pass:{
    backgroundColor: "#a8e6cf", // Pale Green
    color: "#274930", // Dark Forest Green
  },
  Fail:{
    backgroundColor: "#f2d7d5", // Light Red
    color: "#493021", // Dark Maroon
  },
  Warning1: {
    backgroundColor: "#ffcccc", // Light Red 
    color: "#000000", // Black
  },
  Primary1: {
    backgroundColor: "#90ee90", // Light Green
    color: "#006400", // Dark Green
  },
  Primary2: {
    backgroundColor: "#FF9800", // Orange
    color: "white",  
  },
  Primary3: {
    backgroundColor: "#F44336", // Red
    color: "white", 
  },
  Primary4: {
    backgroundColor: "#E8F5E9", //   light green  
    color: "#4CAF50", //green
  },
  
  Default: {
    backgroundColor: "#e9ecef", // Light Gray
    color: "#343a40", // Dark Gray
  },
}));

export const StyledTableRow = withStyles((theme) => ({
  root: {
    // "&:nth-of-type(odd)": {
    //   backgroundColor: theme.palette.action.hover,
    // },
  },
}))(TableRow);

export const pdfStyle = {
  cellPadding: 1, // a number, array or object (see margin below)
  fontSize: 8,
  font: "helvetica", // helvetica, times, courier
  lineWidth: 0.01,
  lineColor: 127,
  fontStyle: "normal", // normal, bold, italic, bolditalic
  overflow: "linebreak", // visible, hidden, ellipsize or linebreak
  fillColor: false, // false for transparent or a color as described below
  textColor: 0,
  halign: "left", // left, center, right
  valign: "middle", // top, middle, bottom
  cellWidth: "auto", // 'auto', 'wrap' or a number
};

export const Accordion = withStyles((theme) => ({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: 8,
    boxShadow: "none",
    borderRadius: 8,
    color:"white"
   
  },
  expanded: {},
}))(MuiAccordion);
export const AccordionSummary = withStyles((theme) => ({
  root: {
    fontWeight: 500,
    backgroundColor:"#317fb3",
  },
  expandIcon: {
    padding: 4,
    color:'white'
  },
  expanded: {
    backgroundColor:"#317fb3" // Add bgcolor when expanded
  }
}))(MuiAccordionSummary);
export const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    // backgroundColor: "#FAFAFA",
    // color: "#666666",
  },
}))(MuiAccordionDetails);

export function formatToINR(number, isFull) {
  if (!number) {
    return "NA";
  }

  // Helper function to format number to Indian Rupee format
  const formatRupee = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // If number is less than 1 lakh, format it normally
  if (number < 100000 || isFull) {
    return formatRupee(number);
  }
  const inrSymbol = "₹";
  // Otherwise, format it with appropriate suffix (L for lakh, Cr for crore)
  const units = [
    { value: 1e7, symbol: "Cr" },
    { value: 1e5, symbol: "L" },
  ];
  for (let i = 0; i < units.length; i++) {
    if (number >= units[i].value) {
      return (
        inrSymbol +
        (number / units[i].value).toFixed(2).replace(/\.0+$/, "") +
        " " +
        units[i].symbol
      );
    }
  }
  return formatRupee(number);
}

export function StatusChips({ status }) {
  const classes = useStyles();
  const statusColors = {
    accepted: "Success",
    rejected: "Error",
    rfr: "Warning",
    pending: "Info",
    "in-process": "Primary",
    "In-Progress": "Warning",
    pass: "Pass",
    Completed: "Pass",
    fail: "Fail",
    Scrutiny:"Primary",
    Read: "Primary1",
    Unread: "Warning1",
    Approved: "Warning",
    "Pending For Approval": "Error",
    Cleared: "Success",
    "OL Created":"Primary",
    Created :"Primary2",
    "OL Generated" : "Primary",
    "int-iNote Generated":"Success",
    "QCC Generated":"Warning",
    "DOA Approved QCC":"Pass",
    "DO_QC_Approved QCC":"Pass",
    "I Note Generated":"Success",
    "Notified":"Success",
    "Recieved":"Warning",
    "Notified\n":"Success",
    "Notified_to_HOSA":"Success",
    "Received":"Primary2",
    "Notified_to_GICA":"Success"



  };
  const statusClass = statusColors[status] || "Default";

  return <Chip size="small" className={`${classes.status} ${classes[statusClass]}`} label={status} />;
}

