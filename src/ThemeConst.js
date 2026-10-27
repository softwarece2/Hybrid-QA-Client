export const warning = "#FFC260";
export const success = "#3CD4A0";
export const info = "#9013FE";
export const btn = "#FCA804";
export const lightenRate = 15.5;
export const darkenRate = 15;
export const printButton = "#0C51B8";

export const overrides = {
  typography: {
    h1: {
      fontSize: "3rem", //48px
    },
    h2: {
      fontSize: "2rem", //32px
    },
    h3: {
      fontSize: "1.64rem", //approx 26px
    },
    h4: {
      fontSize: "1.5rem", //24px
    },
    h5: {
      fontSize: "1.285rem", //approx 20px
    },
    h6: {
      fontSize: "1.142rem", //approx 18px
    },
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },

  MuiBackdrop: {
    root: {
      backgroundColor: "#4A4A4A1A",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 992,
      lg: 1300,
      xl: 1985,
    },
  },

  MuiMenu: {
    paper: {
      boxShadow: "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    },
  },

  MuiSelect: {
    icon: {
      color: "#B9B9B9",
    },
  },

  MuiListItem: {
    root: {
      "&$selected": {
        backgroundColor: "#F3F5FF !important",
        "&:focus": {
          backgroundColor: "#F3F5FF",
        },
      },
    },
    button: {
      "&:hover, &:focus": {
        backgroundColor: "#F3F5FF",
      },
    },
  },

  MuiTouchRipple: {
    child: {
      backgroundColor: "white",
    },
  },

  MuiTableCell: {
    root: {
      borderBottom: "1px solid rgba(224, 224, 224, .5)",
      // paddingLeft: 24,
    },
    head: {
      fontSize: "0.95rem",
    },
    body: {
      fontSize: "0.95rem",
    },
  },

  PrivateSwitchBase: {
    root: {
      marginLeft: 10,
    },
  },
};
