import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import React, { useRef, useState } from "react";

//material-ui
import { CardContent, CardHeader, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import * as yup from "yup";

//components
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { saveDdExtensionData } from "Redux/Actions/SupplyOrder/SOAction";
import { DD_LETTER_DATE, DD_LETTER_NUMBER } from "Redux/Types";
import Button from "../../../../../components/Button";
import MultilineTextField from "../../../../../components/MultilineTextField";
import TextField from "../../../../../components/TextField";
import { restrict } from "restrict";
import { ListItemText, Typography, MenuItem, } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import { teal } from "@material-ui/core/colors";
import { toast } from "react-toastify";
import { AMENDMENT_LETTER_TYPE } from "Globals.js";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    [theme.breakpoints.down("xl")]: {
      maxWidth: "70%",
    },
    [theme.breakpoints.down("lg")]: {
      maxWidth: "70%",
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
}));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
  },
}))(MenuItem);

const defaultValues = {
  letterNo: "",
  letterDate: "",
  newDdDate: "",
  remarks: "",
  soLiId: "",
  ddFile: [],
};
const schema = yup.object().shape({
  letterNo: yup
    .string()
    .typeError("required")
    .required(" required"),
  letterDate: yup
    .string()
    .typeError("required")
    .required(" required"),
  newDdDate: yup
    .string()
    .typeError("required")
    .required(" required"),
});

export default function LIDeliveryDateForm({ getDDbyLI, getSoBySoId, selectedLineItem }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedSoId = useSelector((store) => store.soReducer.selectedSoId);
  let fileInputDD = useRef(null);
  const [selectedDD, setSelectedDD] = useState([]);
  const [ddInput, setDDInput] = useState(null);

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
  const deleteFileDD = (id) => {
    let randomString = Math.random().toString(36);
    const filteredItemDD = selectedDD?.filter((item, index) => index !== id);
    setDDInput(randomString);
    setSelectedDD(filteredItemDD);
    console.log("file filteredList", filteredItemDD);

    console.log("file filteredList", filteredItemDD);
  };
  const handleFileInputDD = (e) => {

    const files = Array.from(e.target.files);
    let newFiles = [];

    let totalSize = 0;
    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        if (totalSize + file.size <= MAX_TOTAL_SIZE) {
          if (selectedDD.length + newFiles.length < MAX_FILE_COUNT) {
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
      // Clear the input
      encodeURIComponent.target.value = null;
      return;
    }
    setSelectedDD([...selectedDD, ...newFiles]);
  };

  const deleteFileLot = (id) => {
    const filteredList = selectedDD.filter((_, index) => index !== id);
    setSelectedDD(filteredList);
  };

  const onFormSubmit = async (data) => {
    const formData = new FormData();
    const req = {
      "letterNo": data.letterNo,
      "letterDate": data.letterDate,
      "newDdDate": data.newDdDate,
      "remarks": data.remarks,
      "soLiId": selectedLineItem?.id,
      "type": AMENDMENT_LETTER_TYPE.SO_LINE_ITEM,
    }
    formData.append("ddExtensionDtoStr", JSON.stringify(req));

    for (let i = 0; i < selectedDD.length; i++) {
      formData.append('ddFile', selectedDD[i]); // 'images' is the key
    }


    try {
      dispatch({
        type: DD_LETTER_NUMBER,
        payload: data.letterNo,
      });
      dispatch({
        type: DD_LETTER_DATE,
        payload: data.letterDate,
      });
       dispatch(saveDdExtensionData(formData))
        .then((res) => {
          reset(defaultValues);
          getDDbyLI();
          getSoBySoId(selectedSoId);
          setSelectedDD([]);
        })
        .catch((error) => {
          console.log("error", error);
        });

    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("DD Extension date already exist..");
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
          title="DD Extension"
        />

        <CardContent className={classes.cardContent}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={classes.padding}>
              <Controller
                name="letterNo"
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
                    inputProps={{ maxLength: 200 }}
                    onInput={restrict.number}
                    error={!!errors.letterNo}
                    helperText={errors.letterNo?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Controller
                name="letterDate"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="Letter Date"
                    placeholder="Letter date"
                    type="date"
                    size="small"
                    {...props}
                    inputProps={{
                      max: moment(new Date()).format("YYYY-MM-DD"),
                    }}
                    onKeyUp={(e) => {
                      e.preventDefault();
                      e.target.value = '';
                    }}
                    onChange={onChange}
                    value={value}
                    required
                    error={!!errors.letterDate}
                    helperText={errors.letterDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Controller
                name="newDdDate"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="New DD Date"
                    placeholder="New DD date"
                    type="date"
                    size="small"
                    {...props}
                    inputProps={{
                      min: moment(new Date()).format("YYYY-MM-DD"),
                    }}
                    onKeyUp={(e) => {
                      e.preventDefault();
                      e.target.value = '';
                    }}
                    onChange={onChange}
                    value={value}
                    required
                    error={!!errors.newDdDate}
                    helperText={errors.newDdDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.padding}>
              <Controller
                name="remarks"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <MultilineTextField
                    rows={3}
                    labelText="Remarks"
                    placeholder="Enter Remarks"
                    size="small"
                    {...props}
                    inputProps={{ maxLength: 500 }}
                    onInput={restrict.general}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} className={classes.padding}>
              <input
                ref={(refParam) => (fileInputDD = refParam)}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleFileInputDD}
              />
              <Button
                onClick={() => {
                  fileInputDD.click();
                }}
                className={classes.browseBtn}
                variant="outlined"
                size="small"
              >
                Upload DD
              </Button>
              {selectedDD ? (
                selectedDD?.map((item, id) => (
                  <StyledMenuItem>
                    <ListItemText disableTypography primary={<Typography variant="body2">{item?.name}</Typography>} />
                    <IconButton
                      size="small"
                      onClick={() => {
                        deleteFileDD(id);
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




            <Grid item xs={12} xl={12} align="center">
              <Button className={classes.button} onClick={handleSubmit(onFormSubmit)} type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
