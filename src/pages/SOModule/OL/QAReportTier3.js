import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  LinearProgress,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
//
import { selectItem } from "Redux/Actions/SelectTreeItem";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import {
  qaDefaultValues,

  setFormData,
  createPayloadTier3,
  tier3,
} from "./constants";
import { useSelector } from "react-redux";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Title } from "./QAReport";
import ViewOfferLetters from "../SupplyOrderDetails/View/ViewOfferLetters";
import ViewOL from "../SupplyOrderDetails/View/ViewOL";
import OLTable from "../../Sslip/SSlipTable";

const useStyles = makeStyles({
  text: {
    fontSize: "0.875rem",
  },
});

export default function QAReportTier3({ olId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: qaDefaultValues,
    resolver: yupResolver(tier3),
  });

  console.log(olId, errors, "===");

  async function onSubmit(data) {
    setSaving(true);
    // console.log(createFormReqBody(data, getValues('id')))
    try {
      await axiosInstance.post(
        "qarSqae/submitQarSqae",
        createPayloadTier3(data, getValues("id"), olId)
      );
      toast.success("Submitted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit, plz try again");
    }
    setSaving(false);
  }

  async function onSaveAsDraft() {
    setSaving(true);
    // console.log(createFormReqBody(getValues(), getValues('id')),)
    try {
      await axiosInstance.post(
        "qarSqae/submitQarSqae",
        createPayloadTier3(getValues(), getValues("id"), olId)
      );
      toast.success("Saved Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save, plz try again");
    }
    setSaving(false);
  }

  useEffect(() => {
    setLoading(true);
    axiosInstance("qarSqae/ol/" + olId)
      .then(({ data }) => {
        const formData = setFormData(data);
        // console.log(formData, "=== form data");

        reset(formData);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [reset, olId]);

  console.log(getValues('qarSqaePartDdto.submittedDate'), "===");


  return (
    <>
      <Button
        type="Close"
        onClick={() => {
          if (user_role === 2 || user_role === 4 || user_role === 6) {
            dispatch(selectItem(<ViewOL />));
          } else if (user_role === 9) {
            dispatch(selectItem(<OLTable />));
          } else if (user_role === 3) {
            dispatch(selectItem(<ViewOfferLetters />));
          } else {
            dispatch(selectItem(<InspectOLTable />));
          }
        }}
        size="small"
        variant="contained"
        color="Secondary"
        startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
      // disabled={loading || !isDirty}
      >
        Back
      </Button>

      {loading && <LinearProgress color="primary" />}

      <div
        style={{
          overflowY: "auto",
          paddingInline: 16,
          height: 700,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Title>
              PART 'D': THIRD TIER CROSS VERIFICATION
              <br />
              FINAL APPROVAL AND REMARKS OF SQAO
            </Title>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>D.1</b> I have verified on sampling
              basis the QA records of eqpt / stores/spares prepared by Quality
              Assurance staff & Group Officer and found in order/ not in order.
              See observations Encl ---
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>D.2</b> I have examined the
              recommendation of Group officer accepting the stores / not
              accepting the stores.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>D.3</b> Tier III/ Vigilance check
              was carried out on date
            </Typography>{" "}
            <Controller
              name="d3a"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />{" "}
            <Typography component="span" className={classes.text}>
              by
            </Typography>{" "}
            <Controller
              name="d3b"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>D.4</b> Surprise check was carried
              out / not carried out, action initiated / not initiated
              separately.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>D.5</b> I have carried out third
              tier cross verification of stores personally on dated
            </Typography>{" "}
            <Controller
              name="d5"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>D.6</b> Eqpt/stores / spares are
              hereby cleared / not cleared.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>D.7</b> Issue of Inspection Note
              /Certificate and MC Note is hereby authorised / not authorised.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>D.8</b> The observations as a result
              of third tier cross verification is at encl
            </Typography>{" "}
            <Controller
              name="d8"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} className={classes.text}>
            Group / section officer signature :
            ____________________________________________
          </Grid>
          <Grid item xs={12} className={classes.text}>
            Name : ____________________________________________
          </Grid>

          <Grid item xs={12} className={classes.text}>
            Date : ____________________________________________
          </Grid>

          <Grid item xs={12} className={classes.text}>
            <Title>REPORT ON TIER-III CHECK</Title>
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.text}>
              {" "}
              <b style={{ marginRight: 8 }}>1. </b>Officer deputed by SQAO
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t31"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder="Officer deputed by SQAO"
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.text}>
              <b style={{ marginRight: 8 }}> 2.</b> Conducted at
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t32"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder="Conducted at"
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.text}>
              {" "}
              <b style={{ marginRight: 8 }}>3.</b> Dated conducted
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t33"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder="Dated conducted"
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.text}>
              <b style={{ marginRight: 8 }}>4.</b> Instructions received from
              SQAO
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t34"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder="Instructions received from SQAO "
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.text}>
              <b style={{ marginRight: 8 }}>5. (a)</b> Whether the sample was
              picked up from the : Accepted lot or from the rejected lot or both
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t35a"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Whether the sample was
                picked up from the..."
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.text}>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(b)</b> No of samples drawn
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t35b"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder=" No
                of samples drawn"
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.text}>
              {" "}
              <b style={{ marginRight: 8 }}>6. (a)</b> Nomenclature of the Store
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t36a"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Nomenclature of the
                Store"
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.text}>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(b)</b> Scope of tests
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t36b"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Scope of tests"
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.text}>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(c)</b> Reason for omitting or not
              conducting : Certain tests
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t36c"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Reason for omitting or not conducting"
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.text}>
              <b style={{ marginRight: 8 }}>7. (a)</b> Results (Satisfactory/Not
              Satisfactory)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t37a"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Satisfactory/Not Satisfactory"
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.text}>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(b)</b> Comments on the comparison
              of test results : of the samples and the bulk
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t37b"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder="Comments on the comparison of test results"
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.text}>
              <b style={{ marginRight: 8 }}>8.</b> Inference
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t38"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Inference"
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.text}>
              <b style={{ marginRight: 8 }}>9.</b> Any other details of
              clarification
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t39"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Any other details of
                clarification"
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.text}>
              <b style={{ marginRight: 8 }}>10.</b> Suggestion and
              recommendation
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t310"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Suggestion and
                recommendation"
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  size="small"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} className={classes.text}>
            Date : ____________________________________________
          </Grid>
          <Grid item xs={12} className={classes.text}>
            Name and Signature of the Officer
            ____________________________________________
          </Grid>
        </Grid>
      </div>

      <div
        style={{
          textAlign: "center",
          borderTop: "1px dashed grey",
          paddingBlock: 8,
          backgroundColor: "#f1f1f1",
        }}
      >
        {saving && (
          <Typography variant="body1">Please wait saving form</Typography>
        )}
        <Button
          style={{ marginRight: 12 }}
          disabled={saving || getValues('qarSqaePartDdto.submittedDate')}
          variant="contained"
          color="primary"
          size="small"
          onClick={onSaveAsDraft}
        >
          Save as Draft
        </Button>
        <Button
          disabled={saving || getValues('qarSqaePartDdto.submittedDate')}
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </div>
    </>
  );
}
