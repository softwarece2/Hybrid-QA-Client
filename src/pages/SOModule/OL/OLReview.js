/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, {  useState, useMemo } from "react";
// import { useEffect, useRef, useState } from "react";

//material-ui
import {
  Dialog,
  DialogActions,
  Grid,
 
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DialogContent, DialogTitle } from "Utils";

//components
import Button from "components/Button";

import MultilineTextField from "components/MultilineTextField";

//redux
import { useDispatch, useSelector } from "react-redux";
import AutoCompleteNew from "components/AutoCompleteNew";
import { restrict } from "restrict";
import { Controller, useForm } from "react-hook-form";
import { updateOL } from "Redux/Actions/SupplyOrder/OLAction";
import { PaperComponent } from "Utils/D3Tree";
import { Typography } from "antd";
import { getConsignee } from "Redux/Actions/Inspect/InspectOLAction";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "95%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "95%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  size: {
    width: 15,
    height: 15,
  },
  browseBtnContainer: {
    display: "flex",
    alignItems: "center",
  },
  autoComplete: {
    padding: "12px 8px 8px 4px",
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
}));

const defaultValues = {
  remarks: "",
  storesDescription: "",
};
export default function OLReview({ openDial, setOpenDial, obj, getInspectOL }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const consigneeDetails = useSelector(
    (store) => store.inspectOLReducer.consigneeBySO
  );


  const [show, setShow] = useState(true);
  const [consigneeId, setConsigneeId] = useState([]);

  const memoizedConsignee = useMemo(() => consigneeId, [consigneeId]);
  const {
    handleSubmit,
    reset,
    control,
 

  } = useForm({
    defaultValues: defaultValues,
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const fetchConsignee = (id) => {
    dispatch(getConsignee(id));
  };

  React.useEffect(() => {
    console.log("wre4reew4rertwr", obj);
    setConsigneeId(obj?.consigneeId);
    fetchConsignee(obj?.soId);
    reset({
      remarks: obj?.remarks
        ? obj?.remarks
        : "Hologram Seal No:10↑ \nHologram Sl.Nos:",
      storesDescription: obj?.storesDescription,
    });
  }, [reset, obj]);

  const onFormSubmit = (data) => {
    console.log("drfgrhfg");
    const value = {
      id: obj?.id,
      consigneeId: consigneeId,
      storesDescription: data.storesDescription,
      remarks: data.remarks,
      employeeId: loggedInUser?.empId,
    };

    dispatch(updateOL(value))
      .then((res) => {
        reset();
        getInspectOL();
        console.log("res", res);
        setOpenDial(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <Dialog open={openDial} maxWidth="xl">
      {(props) => <PaperComponent id="draggable-dialog-title34" {...props} />}
      <DialogTitle
        style={{ fontSize: "0.875rem", cursor: "move" }}
        onClose={() => setOpenDial(false)}
        id="draggable-dialog-title34"
      >
        Offer Leter Update : {obj?.name}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className={classes.browseBtnContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={12} lg={12} xl={12}>
                <Typography>Change Consignee</Typography>
                <Controller
                  name="consigneeId"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => {
                    return (
                      <AutoCompleteNew
                        data={consigneeDetails}
                        value={
                          consigneeDetails.find(
                            (consignee) => consignee.id === memoizedConsignee
                          ) || ""
                        }
                        getOptionLabel={(o) => o.name}
                        onChange={(e, v) => {
                          onChange(v);
                          setConsigneeId(v?.id || null);
                          setShow(v ? true : false);
                        }}
                        {...props}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography>Store Description</Typography>
                <Controller
                  control={control}
                  name="storesDescription"
                  render={({ field: { value, onChange } }) => (
                    <MultilineTextField
                      rows={5}
                      value={value}
                      placeholder="Store Description"
                      onChange={(e) => {
                        onChange(e);
                      }}
                      onInput={restrict.remarks}
                      inputProps={{
                        maxLength: 500,
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography>Hologram Remarks</Typography>
                <Controller
                  control={control}
                  name="remarks"
                  render={({ field: { value, onChange } }) => (
                    <MultilineTextField
                      rows={5}
                      value={value}
                      placeholder="Hologram Remarks"
                      onInput={restrict.remarks}
                      inputProps={{
                        maxLength: 500,
                      }}
                      onChange={(e) => {
                        onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit(onFormSubmit)}
          //   text="Print"
          variant="contained"
          color="primary"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
