/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect,  useState } from "react";

//material-ui
import {
  Dialog,
  Grid,
  FormControl,
  FormControlLabel,
  CircularProgress,
} from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DialogTitle } from "Utils";

//pages

//components
import Button from "components/Button";
import TextField from "components/TextField";
import { Controller, useForm } from "react-hook-form";
// import { updateProjectDetailsById } from "Redux/Actions/SupplyOrder/PDAction";
import { PaperComponent } from "Utils/D3Tree";

//icon

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "1rem",
  },
  cardContent: {
    textAlign: "left",
    // padding: 16,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  buttonImport: {
    backgroundColor: "#E0F7FE",
    color: theme.palette.common.black,
    "&:hover, &:focus": {
      color: theme.palette.common.black,
      background: "#E0F7FE",
    },
    buttonProgress: {
      color: "white",
    },
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

const defaultValues = {
  // id: "",
  projectName: "",
  shipNo: "",
  categoryName: "",
  saleOrderNo: "",
  status: "",
};

const schema = yup.object().shape({
  projectName: yup.string().typeError("required").required(" required"),
  shipNo: yup.string().typeError("required").required(" required"),
  categoryName: yup.string().typeError("required").required(" required"),
  saleOrderNo: yup.string().typeError("required").required(" required"),
});

export default function PDForm({
  open,
  setOpen,
  soObj,
  fetchPD,
  supplyOrderId,
}) {
  const classes = useStyles();


  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  //const[statusVal,setStatusVal]=useState("");
  console.log("wuew", soObj?.projectId);
  const {
   
    handleSubmit,
    reset,
    getValues,
  
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({
      projectName: soObj?.projectName,
      shipNo: soObj?.shipNo,
      categoryName: soObj?.categoryName,
      saleOrderNo: soObj?.saleOrderNo,
      status:
        soObj?.status?.type?.name === "Active"
          ? "Active"
          : soObj?.status?.type?.name === "InActive"
          ? "Inactive"
          : null,
    });
  }, [soObj]);

  const onFormSubmit = (data) => {
    setLoading(true);
    setLoadingDraft(true);

  };
  console.log("getValues", getValues());
  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperComponent={(props) => (
        <PaperComponent id="draggable-dialog-title42" {...props} />
      )}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title42">
        Project Details Form
      </DialogTitle>
      <DialogContent dividers style={{ padding: 12, position: "relative" }}>
        <form
        // onSubmit={handleSubmit(onFormSubmit)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              {/* <TextField labelText="Project Name" placeholder="Enter Project Name" value={soObj?.projectName} /> */}
              {/* <Typography style={{ fontSize: "0.875rem" }}>
                Project Name :{" "}
                <span style={{ fontWeight: 500 }}>{soObj?.projectName}</span>
              </Typography> */}
              <Controller
                name="projectName"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="Project Name"
                    placeholder="Enter Project Name"
                    size="small"
                    {...props}
                    onChange={onChange}
                    value={value}
                    required
                    inputProps={{ maxLength: 500 }}
                    error={!!errors.projectName}
                    helperText={errors.projectName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              {/* <TextField labelText="Item No" placeholder="Enter Item No" value={soObj?.shipNo} /> */}
              {/* <Typography style={{ fontSize: "0.875rem" }}>
                Item No : <span style={{ fontWeight: 500 }}>{soObj?.shipNo}</span>
              </Typography> */}
              <Controller
                name="shipNo"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="Item No"
                    placeholder="Enter Item No"
                    size="small"
                    {...props}
                    onChange={onChange}
                    value={value}
                    required
                    inputProps={{ maxLength: 500 }}
                    error={!!errors.shipNo}
                    helperText={errors.shipNo?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              lg={3}
              xl={3}
              className={classes.padding}
            >
              {/* <TextField labelText="Item Category" placeholder="Enter Item Category" value={soObj?.categoryName} /> */}
              {/* <Typography style={{ fontSize: "0.875rem" }}>
                Item Category : <span style={{ fontWeight: 500 }}>{soObj?.categoryName}</span>
              </Typography> */}
              <Controller
                name="categoryName"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="Item Category"
                    placeholder="Enter Item Category"
                    size="small"
                    {...props}
                    onChange={onChange}
                    value={value}
                    required
                    inputProps={{ maxLength: 500 }}
                    error={!!errors.categoryName}
                    helperText={errors.categoryName?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              lg={3}
              xl={3}
              className={classes.padding}
            >
              {/* <TextField labelText="Sale Order No" placeholder="Enter Sale Order No" value={soObj?.saleOrderNo} /> */}
              {/* <Typography style={{ fontSize: "0.875rem" }}>
                Sale Order No : <span style={{ fontWeight: 500 }}>{soObj?.saleOrderNo}</span>
              </Typography> */}
              <Controller
                name="saleOrderNo"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="Work Order No."
                    placeholder="Enter Work Order No."
                    size="small"
                    {...props}
                    onChange={onChange}
                    value={value}
                    required
                    inputProps={{ maxLength: 500 }}
                    error={!!errors.saleOrderNo}
                    helperText={errors.saleOrderNo?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              lg={3}
              xl={3}
              className={classes.padding}
              align="center"
            >
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControl component="fieldset">
                    <FormLabel
                      component="legend"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Status
                    </FormLabel>
                    <RadioGroup row size="small" value={value}>
                      <FormControlLabel
                        value="Active"
                        onChange={onChange}
                        control={<Radio size="small" />}
                        label="Active"
                      />
                      <FormControlLabel
                        value="Inactive"
                        onChange={onChange}
                        control={<Radio size="small" />}
                        label="Inactive"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit(onFormSubmit)}
          type="submit"
        >
          {loadingDraft && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}{" "}
          &nbsp; Update
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(false)}
          type="submit"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
