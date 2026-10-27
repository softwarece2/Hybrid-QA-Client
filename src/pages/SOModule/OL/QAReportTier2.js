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
  createPayloadTier2,
  tier2,
} from "./constants";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Title } from "./QAReport";
import { useSelector } from "react-redux";
import ViewOL from "../SupplyOrderDetails/View/ViewOL";
import ViewOfferLetters from "../SupplyOrderDetails/View/ViewOfferLetters";
import OLTable from "../../Sslip/SSlipTable";

const useStyles = makeStyles({
  text: {
    fontSize: "0.875rem",
  },
});

export default function QAReportTier2({ olId }) {
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
    resolver: yupResolver(tier2),
  });

  console.log(olId, errors, "===");

  async function onSubmit(data) {
    setSaving(true);
    // console.log(createFormReqBody(data, getValues('id')))
    try {
      await axiosInstance.post(
        "qarSqae/submitQarSqae",
        createPayloadTier2(data, getValues("id"), olId)
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
        "qarSqae/saveQarSqae",
        createPayloadTier2(getValues(), getValues("id"), olId)
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
        console.log(data, "===");

        const formData = setFormData(data);
        // console.log(formData, "=== form data");

        reset(formData);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [reset, olId]);

  console.log(getValues('qarSqaePartCDto'), "===");


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
          <Grid item xs={12} align="center">
            <Title>
              PART 'C': CROSS / CONFIRMATORY CHECKS
              <br />
              <span style={{ fontSize: 14, color: "red" }}>
                (SECOND TIER QA / GROUP OFFICERS RECOMMENDATIONS)
              </span>
            </Title>
          </Grid>

          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>C.1</b> Eqpt / stores / spares have
              been subjected to confirmatory /cross checks at firm’s premises
              located at
            </Typography>{" "}
            <Controller
              name="c1a"
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
              on date
            </Typography>{" "}
            <Controller
              name="c1b"
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
              during cross / confirmatory check samples have been drawn for
              testing and test report enclosed at encl
            </Typography>{" "}
            <Controller
              name="c1c"
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
              <b style={{ marginRight: 8 }}>C.2</b> Acceptance as recommended by
              QA team examined during cross / confirmatory check. Stores are
              recommended / not recommended for acceptance. For details refer to
              encl{" "}
            </Typography>
            <Controller
              name="c2"
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
              <b style={{ marginRight: 8 }}>C.3</b> Cross check entry made in
              cross/confirmatory check register at Srl No
            </Typography>
            <Controller
              name="c3"
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
              <b style={{ marginRight: 8 }}>C.4</b> Cross checked stores have
              been affixed / not affixed with acceptance mark steel / rubber.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>C.5</b> Details of laboratory test /
              performance test report received and verified and found
              conformance to specification requirement and available at encl
            </Typography>{" "}
            <Controller
              name="c5"
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
              with recommendation.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>C.6</b> It is certified that
              quantity and quality of stores quality assured are found
              acceptance / not acceptance and are recommended / not recommended
              for despatch on issue of MC Note / own arrangement of the firm.
              Issue of Inspection / Rejection Note is recommended.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="span" className={classes.text}>
              <b style={{ marginRight: 8 }}>C.7</b> Reasons for not accepting
              the already QA stores is enclosed at
            </Typography>{" "}
            <Controller
              name="c7"
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
              <b style={{ marginRight: 8 }}>C.8</b> Various shortcomings /
              deficiencies noticed for smooth conduct of QA at firm’s premises
              noticed by inspection staff discussed with firm’s representative
              and corrective action letter being issued to firm / letter issued
              vide encl
            </Typography>{" "}
            <Controller
              name="c8"
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
              <b style={{ marginRight: 8 }}>C.9</b> Despatch of control/ shelf
              life / Class ‘C’ samples drawn, sent to AHSP vide encl
            </Typography>{" "}
            <Controller
              name="c9"
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
            Name & Designation : ____________________________________________
          </Grid>

          <Grid item xs={12} className={classes.text}>
            Date : ____________________________________________
          </Grid>

          {/* 2nd TIER Report */}

          <Grid item xs={12}>
            <Title>REPORT ON TIER-II CHECK</Title>
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.text}>
              {" "}
              <b style={{ marginRight: 8 }}>1.</b> Officer deputed by SQAO
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t21"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Officer deputed by SQAO"
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
              <b style={{ marginRight: 8 }}>2.</b> Conducted at
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t22"
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
              name="t23"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Dated conducted"
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
              <b style={{ marginRight: 8 }}>4. (a)</b> Nomenclature of Store
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t24a"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Nomenclature of Store"
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
              <b style={{ marginRight: 8 }}>(b)</b> Indent/Indents/SO No. & Date
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t24b"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Indent/Indents/SO No. & Date"
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
              &nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(c)</b> Quantity on order{" "}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t24c"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder="Quantity on order"
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
              &nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(d)</b> Total Cost{" "}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t24d"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Total Cost"
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
              <b style={{ marginRight: 8 }}>5.</b> Instructions received from
              SQAO
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t25"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Instructions received from SQAO"
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
              <b style={{ marginRight: 8 }}>6. (a)</b> Whether the sample was
              picked up from the : Accepted lot or from the rejected lot or both
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t26a"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder="Whether the sample was
                picked up from the"
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
              &nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(b)</b> Challan No. & Date
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t26b"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder=" Challan No. & Date"
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
              &nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(c) </b>No of samples drawn
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t26c"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="No of samples drawn"
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
              <b style={{ marginRight: 8 }}>7. (a)</b> Details of Stores
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t27a"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Details of Stores"
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
              &nbsp;&nbsp;&nbsp;&nbsp;
              <b style={{ marginRight: 8 }}>(b)</b> Scope of tests
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t27b"
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
              name="t27c"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder=" Reason for omitting or not conducting"
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
              <b style={{ marginRight: 8 }}>8. (a)</b> Results
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="t28a"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Results"
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
              name="t28b"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Comments on the comparison"
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
              <b style={{ marginRight: 8 }}>9. </b> Inference
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="t29"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Comments on the comparison"
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
              <b style={{ marginRight: 8 }}>10. </b> Any other details of
              clarification
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="t210"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Comments on the comparison"
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
              <b style={{ marginRight: 8 }}>11. </b> Suggestion and
              recommendation
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="t211"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Comments on the comparison"
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
            Officer-in-Charge ____________________________________________
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
          disabled={saving || getValues('qarSqaePartCDto.submittedDate')}
          variant="contained"
          color="primary"
          size="small"
          onClick={onSaveAsDraft}
        >
          Save as Draft
        </Button>
        <Button
          disabled={saving || getValues('qarSqaePartCDto.submittedDate')}
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
