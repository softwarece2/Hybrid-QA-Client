/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import "../../../App.css";
//globals
import { WING_ID } from "../../../Globals.js";
//material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputLabel,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import Button from "components/Button";
import { DialogTitle } from "Utils";
import { toast } from "react-toastify";
import * as yup from "yup";
import moment from "moment";

//icons
import { yupResolver } from "@hookform/resolvers/yup";
import { saveAllotOlSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { PaperComponent } from "Utils/D3Tree";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    padding: 2,
  },
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  DialogTitle: {
    backgroundColor: "#205375",
    color: "white",
    padding: "4px",
    zIndex: 1,
  },
  asterisk: {
    color: theme.palette.error.dark,
  },
}));

const schema = yup.object().shape({
  // allotedTo: yup.string().typeError("Required").required("Required"),
  allotedTo: yup
    .array()
    .min(1, "Required")
    .typeError("Required")
    .required("Required"),
});

export default function AllotOLSubordinateDialog({
  roleId,
  ol,
  subList,
  fetchAllotOL,
  deligation,
  onClose,
}) {
  const classes = useStyles();

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const defaultValues = {
    id: 0,
    offerLetterId: ol?.offerLetterId,
    offerLetterName: ol?.offerLetterName,
    allotedBy: loggedInUser?.empId,
    allotedTo: null,
    isDeligation: false,
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const [subordinateList, setSubordinateList] = useState([]);

  useEffect(() => {
    setSubordinateList(subList);
  }, [subList]);

  const handleAllot = (data) => {
    console.log("hfbs", data);
    const value = {
      id: 0,
      offerLetterId: ol?.offerLetterId,
      offerLetterName: ol?.offerLetterName,
      allotedBy: loggedInUser?.empId,
      allotedTo: data?.allotedTo,
      isDeligation: deligation,
    };
    saveAllotOlSubordinate(value)
      .then((res) => {
        fetchAllotOL();
        onClose();
        const successMessage = deligation 
        ? "QACL Re-allotted Successfully" 
        : "QACL Allotted Successfully";
      toast.success(successMessage);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const role = "Officer";
  const dialogTitleText = deligation ? `Re Allot ${role}` : `Allot ${role}`;
  return (
    <>
      <Dialog
        open
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title25" {...props} />
        )}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title25">
        {dialogTitleText} 
        </DialogTitle>
        <DialogContent dividers style={{ padding: 12, position: "relative" }}>
          <Grid container spacing={1} style={{ marginTop: "15px" }}>
            <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
              <Typography>
                <b>{isArmy ? "QACL" : "OL"} Number&nbsp;:&nbsp;</b>
                {ol?.offerLetterName}
              </Typography>
            </Grid>

            <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
              <Typography>
                <b>Date&nbsp;:&nbsp;</b>
                {moment(ol?.offerLetterDate).format("DD-MM-yyyy")}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={0} style={{ marginTop: "20px" }}>
            {/* <Grid xs={6}>
              <Typography>{labelText}</Typography>
            </Grid> */}
            <Grid item xs={12} sm={8}>
              <Controller
                name="allotedTo"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <>
                      <InputLabel
                        classes={{
                          asterisk: classes.asterisk,
                          root: classes.root,
                        }}
                        style={{ fontSize: "0.875rem" }}
                        required={true}
                      >
                        {"Select Officer"}
                      </InputLabel>
                      <Autocomplete
                        multiple
                        options={subordinateList}
                        value={
                          subordinateList?.filter((item) =>
                            value?.includes(item?.id)
                          ) || ""
                        }
                        onChange={(e, v) => {
                          const data = v?.map((item) => item?.id);
                          onChange(data);
                        }}
                        // getOptionValue={(option) => option["id"]}
                        getOptionLabel={(option) =>
                           option?.ename || option?.name
                        }
                        disableCloseOnSelect
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            variant="outlined"
                            {...params}
                            InputProps={{
                              ...params.InputProps,
                              classes: {
                                input: classes.input,
                                root: classes.textFieldRoot,
                              },
                            }}
                            size="small"
                            error={!!errors.allotedTo}
                            helperText={errors.allotedTo?.message}
                          />
                        )}
                      />
                    </>
                  );
                }}
              />
              {/* <Controller
                name="allotedTo"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <AutoCompleteNew
                    // labelText={labelText}
                    data={subordinateList}
                    getOptionLabel={(option) =>
                      option.roleId !== 2 && option.ename ? option.ename : ""
                    }
                    onChange={(e, el) => {
                      onChange(el?.id);
                      setEmpVal(el?.id);
                    }}
                    value={subordinateList?.find((item) => item?.id === empVal)}
                    error={!!errors.allotedTo}
                    helperText={errors.allotedTo?.message}
                  />
                )}
              /> */}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<SupervisorAccountIcon />}
            onClick={handleSubmit(handleAllot)}
          >
            {deligation ? "Re-Allot" : "Allot"}
          </Button>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
