import { makeStyles } from "@material-ui/core";

export const useGlobalStyles = makeStyles((theme) => ({
  iconFa: {
    color: theme.palette.primary.main,
    fontSize: "1rem",
    padding: 4,
  },
  filterHeader: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    height: 10,
  },
  filterTextField: {
    minWidth: 250,
  },
  filterButton: {
    marginTop: 20,
  },
  dashboard: {
    backgroundColor: "#fefefe",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "100vh",
  },
  logoImg: {
    height: 40,
  },
  flexHeaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexHeaderItem: {
    padding: "6px 0",
  },

  formGroup: {
    marginBottom: "15px",
  },
  inputSize: {
    border: "#828282",
    borderRadius: "14px",
    height: "25px",
  },
  formLabel: {
    color: "#666666",
    fontSize: "18px",
    marginBottom: "2px",
    display: "inline-block",
  },
  logBtn: {
    background: "#666666",
    color: "white",
    textTransform: "capitalize",
    "&:hover, &:focus": {
      color: "white",
      background: "#666666",
    },
  },

  reverseColumn: {
    alignItems: "center",

    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
      alignItems: "unset",
    },
  },
  MdPadding: {
    [theme.breakpoints.down("md")]: {
      padding: "0px 40px",
      // marginTop: "-32px",
    },
  },
  loginContainer: {
    maxWidth: "500px",
    margin: "auto",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "800px",
      width: "100%",
    },
  },
  image: {
    width: '95%',
    [theme.breakpoints.down("md")]: {
      width: 400,
    },
    [theme.breakpoints.down("sm")]: {
      width: 300,
    },
  },
  logoImgLogin: {
    [theme.breakpoints.down("sm")]: {
      width: "130px",
    },
  },
  title: {
    fontSize: "28px",
    color: "#FF9933",
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
      margin: "8px 0px 20px 0px",
      fontSize: "20px",
      letterSpacing: "1px",
    },
  },
  captcha: {
    display: "flex",
    justifyContent: "center",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
    color: "white",
  },
}));
