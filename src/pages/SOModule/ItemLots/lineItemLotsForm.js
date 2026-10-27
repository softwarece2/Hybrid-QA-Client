import { makeStyles } from "@material-ui/core/styles";
// import React from "react";
import React, { useRef, useState } from "react";

//material-ui
import { CardContent, CardHeader, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";

//components
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import { ListItemText, Typography, MenuItem, } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { Close } from "@material-ui/icons";
import { teal } from "@material-ui/core/colors";
//pages
import { ITEM_LOT_DATE, ITEM_LOT_NO } from "Redux/Types";

//icons
import { saveILData } from "Redux/Actions/SupplyOrder/SOAction";
import { restrict } from "restrict";
import { toast } from "react-toastify";
import { AMENDMENT_LETTER_TYPE } from "Globals.js";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    [theme.breakpoints.down("xl")]: {
      maxWidth: "50%",
    },
    [theme.breakpoints.down("lg")]: {
      maxWidth: "80%",
    },
    [theme.breakpoints.down("md")]: {
      maxWidth: "85%",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%",
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "0.875rem",
  },
  cardContent: {
    textAlign: "left",
    padding: 16,
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
    marginRight: "5px",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  searchInput: {
    width: "30%",
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
  },
}))(MenuItem);

const defaultValues = {
  ilLetterDate: "",
  ilLetterNo: "",
  lotNo: "",
  status: "",
  soLiId: "",
  itemlots: [],
};
const schema = yup.object().shape({
  lotNo: yup
    .string()
    .typeError("required")
    .required(" required"),
  ilLetterNo: yup
    .string()
    .typeError("required")
    .required(" required"),
  ilLetterDate: yup
    .string()
    .typeError("required")
    .required(" required"),
});

export default function LineItemLotsForm({ getIL, getSoBySoId, selectedLineItem }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const soId = useSelector((store) => store.soReducer.selectedSoId);

  let fileInputLot = useRef(null);
  const [selectedFileLot, setSelectedFileLot] = useState([]);
  const [itemLotInput, setItemLotInput] = useState(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 250 * 1024 * 1024;
  const MAX_FILE_COUNT = 13;
  const invalidExtensions = [
    ".ps1",
    ".exe",
    ".msi",
    ".dll",
    ".vbs",
    ".js",
    ".lnk",
    ".jar",
    ".zip",
    ".rar",
  ];
  const {

    handleSubmit,
    reset,

    control,

    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const handleFileInputLot = (e) => {
    const files = Array.from(e.target.files);
    let newFiles = [];
    let totalSize = 0;

    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        if (totalSize + file.size <= MAX_TOTAL_SIZE) {
          if (selectedFileLot.length + newFiles.length < MAX_FILE_COUNT) {
            newFiles.push(file);
            totalSize += file.size;
          }
        } else {
          toast.error("Adding this file exceeds the total size limit of 250MB");
        }
      } else {
        toast.error(`Please select a file less than 100MB.`);
      }
    });

    const hasInvalidExtension = Array.from(files).some((file) =>
      invalidExtensions.some((extension) =>
        file.name.toLowerCase().endsWith(extension)
      )
    );
    if (hasInvalidExtension) {
      toast.error("Invalid file format.");
      e.target.value = null; // Clear the input
      return;
    }
    setSelectedFileLot([...selectedFileLot, ...newFiles]);
  };
  console.log(selectedFileLot, "files");

  const deleteFileLot = (id) => {
    const filteredList = selectedFileLot.filter((_, index) => index !== id);
    setSelectedFileLot(filteredList);

  };

  const onFormSubmit = async (data) => {
    const formData = new FormData();
    const req = {
      "ilLetterDate": data.ilLetterDate,
      "ilLetterNo": data.ilLetterNo,
      "lotNo": data.lotNo,
      "status": data.status,
      "soLiId": selectedLineItem?.id,
      "type": AMENDMENT_LETTER_TYPE.SO_LINE_ITEM,
    }
    console.log(selectedLineItem?.id, "77y878");
    formData.append("itemLotsDtoStr", JSON.stringify(req));

    for (let i = 0; i < selectedFileLot.length; i++) {
      formData.append('itemlots', selectedFileLot[i]);
    }

    try {
      dispatch({
        type: ITEM_LOT_NO,
        payload: data.lotNo,
      });
      dispatch({
        type: ITEM_LOT_DATE,
        payload: data.ilLetterDate,
      });
      dispatch(saveILData(formData))
        .then(() => {
          reset(defaultValues);
          getIL();
          getSoBySoId(soId);
          setSelectedFileLot([]);
        })
        .catch((error) => {
          console.error("Error dispatching saveILData:", error);
        });

    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("item lot Letter date already exist.");
    }
  };
  return (
    <div align="center">
      <Card className={classes.card}>
        <CardHeader
          classes={{
            root: classes.cardHeader,
            title: classes.cardTitle,
          }}
          style={{ textAlign: "left" }}
          title="Item Lot"
        />

        <CardContent className={classes.cardContent}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Grid
              container
              spacing={2}
              style={{ padding: "28px 18px 0px 18px" }}
            >
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                {" "}
                {/* Lot Number */}
                <Controller
                  name="lotNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="Lot Number"
                      placeholder="Enter Lot Number"
                      size="small"
                      {...props}
                      onChange={onChange}
                      value={value}
                      required
                      inputProps={{ maxLength: 50 }}
                      onInput={restrict.number}
                      error={!!errors.lotNo}
                      helperText={errors.lotNo?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                {" "}
                {/* Letter Number */}
                <Controller
                  name="ilLetterNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="Letter Number"
                      placeholder="Enter Letter Number"
                      size="small"
                      {...props}
                      onChange={onChange}
                      value={value}
                      required
                      onInput={restrict.number}
                      error={!!errors.ilLetterNo}
                      helperText={errors.ilLetterNo?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                {" "}
                {/* Letter Date */}
                <Controller
                  name="ilLetterDate"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      type="date"
                      labelText="Letter Date"
                      placeholder="Enter Letter Date"
                      size="small"
                      {...props}
                      inputProps={{
                        max: moment(new Date()).format("YYYY-MM-DD"),
                      }}
                      onKeyDown={(e) => e.preventDefault()}
                      onChange={onChange}
                      value={value}
                      required
                      error={!!errors.ilLetterDate}
                      helperText={errors.ilLetterDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3} >

                <Grid container spacing={1} style={{ marginTop: '15px' }} >
                  <Grid item xs={12}>
                    <input
                      ref={(refParam) => (fileInputLot = refParam)}
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleFileInputLot}
                    />
                    <Button
                      onClick={() => {
                        fileInputLot.click();
                      }}
                      className={classes.browseBtn}
                      variant="outlined"
                      size="small"

                    >
                      Upload Item Lots
                    </Button>

                    {selectedFileLot ? (
                      selectedFileLot?.map((item, id) => (
                        <StyledMenuItem>
                          <ListItemText disableTypography primary={<Typography variant="body2">{item?.name}</Typography>} />
                          <IconButton
                            size="small"
                            onClick={() => {
                              deleteFileLot(id);
                            }}
                          >
                            <Close fontSize="small" color="action" />
                          </IconButton>
                        </StyledMenuItem>
                      ))
                    ) : (
                      <Typography component={"span"} variant="caption" color="textSecondary">
                        No file selected.
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>



            <Grid container spacing={2}>
              <Grid item xs={12} xl={12} align="center">
                <Button className={classes.button} onClick={handleSubmit(onFormSubmit)} type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
