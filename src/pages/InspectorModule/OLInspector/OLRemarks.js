import React from "react";
import { Dialog, DialogActions, Grid } from "@material-ui/core";
import { DialogContent, DialogTitle } from "Utils";
import Button from "components/Button";
import MultilineTextField from "components/MultilineTextField";

import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateOLDesp } from "Redux/Actions/SupplyOrder/OLAction";
import { PaperComponent } from "Utils/D3Tree";

const defaultValues = {
  olDescription: "",
};

export default function OLRemarks({ openDial, setOpenDial, obj, callback }) {
  const dispatch = useDispatch();

  const { handleSubmit, reset, control } = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
  });

  React.useEffect(() => {
    reset({
      olDescription: obj?.olDescription,
    });
  }, [reset, obj]);

  const onFormSubmit = (data) => {
    const value = {
      id: obj?.id,
      olDescription: data.olDescription,
    };
    console.log("id", obj);
    dispatch(updateOLDesp(value))
      .then((res) => {
        reset();
        setOpenDial(false);
        callback();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <Dialog open={openDial} maxWidth="lg">
      {(props) => <PaperComponent id="draggable-dialog-title34" {...props} />}
      <DialogTitle
        style={{ fontSize: "0.875rem", cursor: "move" }}
        onClose={() => setOpenDial(false)}
        id="draggable-dialog-title34"
      >
        Offer Letter Update : {obj?.olNumber}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                control={control}
                name="olDescription"
                render={({ field: { value, onChange } }) => (
                  <MultilineTextField
                    rows={5}
                    labelText="OL Description"
                    value={value}
                    placeholder="OL Description"
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit(onFormSubmit)}
          variant="contained"
          color="primary"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
