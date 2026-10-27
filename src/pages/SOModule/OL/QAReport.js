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
import { useSelector, useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
//
import { selectItem } from "Redux/Actions/SelectTreeItem";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import {
  qaDefaultValues,
  oicSchema,
  createPayload,
  setFormData,
  inspectorSchema,
  qaoSchema,
  vigilanceSchema,
  sqaoSchema,
} from "./constants";
import QAPreview from "./QAPreview";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { USER_ROLE_ID } from "../../../Globals.js";
import ViewOL from "../SupplyOrderDetails/View/ViewOL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import ViewOfferLetters from "../SupplyOrderDetails/View/ViewOfferLetters";
import OLTable from "../../Sslip/SSlipTable";
// import { generatePdf } from "./QaPdf";

const useStyles = makeStyles({
  text: {
    fontSize: "0.875rem",
  },
});

export function Title({ children }) {
  return (
    <Typography
      align="center"
      variant="h6"
      style={{
        backgroundColor: "aliceblue",
        border: "1px solid",
        // borderColor: "royalblue",
        // color: "royalblue",
        marginTop: 24,
        borderRadius: 4,

        marginBottom: 8,
      }}
    >
      {children}
    </Typography>
  );
}

export default function QAReport({ olId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const roleId = useSelector((store) => store.loggedInUser?.roleId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: qaDefaultValues,
    resolver: yupResolver(
      roleId === USER_ROLE_ID.ROLE_INSPECTOR
        ? inspectorSchema
        : roleId === USER_ROLE_ID.ROLE_QAO || roleId === USER_ROLE_ID.ROLE_AQAO
          ? qaoSchema
          : roleId === USER_ROLE_ID.ROLE_VIGILANCE
            ? vigilanceSchema
            : roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
              roleId === USER_ROLE_ID.ROLE_QAO
              ? oicSchema
              : sqaoSchema
    ),
  });

  console.log(olId, roleId, errors, "===");

  async function onSubmit(data) {
    setSaving(true);
    // console.log(createFormReqBody(data, getValues('id')))
    try {
      await axiosInstance.post(
        "qarSqae/submitQarSqae",
        createPayload(data, getValues("id"), olId, roleId)
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
        createPayload(getValues(), getValues("id"), olId, roleId)
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
        console.log(formData, "=== form data");

        reset(formData);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [reset, olId]);
  console.log(getValues("qarSqaePartADto.submittedDate"), "====>");

  return (
    <div
      style={{
        maxWidth: 1600,
        marginInline: "auto",
      }}
    >
      <Button
        type="Close"
        onClick={() => {
          if (roleId === 3) {
            dispatch(selectItem(<ViewOfferLetters />));
          } else if (roleId === 4 || roleId === 6) {
            dispatch(selectItem(<ViewOL />));
          } else if (roleId === 9) {
            dispatch(selectItem(<OLTable />));
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
      {openPreview && (
        <QAPreview onClose={() => setOpenPreview(false)} data={getValues()} />
      )}

      {loading && <LinearProgress color="primary" />}
      <div
        style={{
          maxWidth: 1600,
          marginInline: "auto",
          marginTop: 8,
          border: "1px solid #ebebeb",
          borderRadius: 4,
        }}
      >
        <div
          style={{
            overflowY: "auto",
            paddingInline: 16,
            height: 700,
          }}
        >
          <Typography
            variant="h6"
            align="center"
            style={{ textDecoration: "underline" }}
          >
            QA CHECK REPORT OF
          </Typography>
          <Grid
            container
            spacing={1}
            style={{ maxWidth: 800, marginInline: "auto", marginBottom: 24 }}
          >
            <Grid item xs={12}>
              <Typography className={classes.text} style={{ marginTop: 24 }}>
                S.No:_______________________________________
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.text}>
                <b>A.</b> QA Call Letter
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="qaCallLetter"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b>B.</b> Scrutiny of QACL
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="srutnyQACL"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.text}>
                <b>C</b>. Pre inspection Report
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="preInspReport"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b>D</b>. Guarantee Certificate / Warranty Certificate
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="gorWCert"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b>E</b>. Calibration Report of Test Eqpt
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="calibReportTest"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b>F</b>. SQAE (L) Test Results
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="sQAETestResult"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.text}>
                <b>G</b>. QA Report
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="qaReport"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.text}>
                <b>H</b>. Confirmatory Check Report
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="confirmatoryCheckReport"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.text}>
                <b>J</b>. Vigilance Check Report
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="vigilanceCheckReport"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>
          <hr />

          <Typography
            variant="h6"
            align="center"
            style={{ textDecoration: "underline" }}
          >
            QUALITY ASSURANCE REPORTS:SQAE (L)
            <br />
            Bengaluru
          </Typography>
          <Typography variant="h7">Case/File No:</Typography>

          <Title>PART 'A' : QUALITY ASSURANCE NOTE DATA</Title>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                <b style={{ marginRight: 8 }}>A.1</b> Firm's Name And Address
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a1"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b style={{ marginRight: 8 }}>A.2</b> SO/ AT No. & Date
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a2"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b style={{ marginRight: 8 }}>A.3</b> Indentor
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a3"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b style={{ marginRight: 8 }}>A.4</b> Indent No.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a4"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b style={{ marginRight: 8 }}>A.5</b> Consignee
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a5"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b style={{ marginRight: 8 }}>A.6</b> Stores Put up for Quality
                Assurance on dates
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a6"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b style={{ marginRight: 8 }}>A.7</b> Stores Quality Assured on
                dates
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a7"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b style={{ marginRight: 8 }}>A.8</b> Contractors QA call letter
                No & date
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a8"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                {" "}
                <b style={{ marginRight: 8 }}>A.9.a.</b>Class of deviation (if
                any)
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a9a"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b style={{ marginRight: 8 }}>b.</b> Class of deviation (if any)
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="a9b"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            {/* TODO: make a table in preview also  */}

            {
              <table className="spares-table">
                <thead>
                  <tr>
                    <th>Item no.</th>
                    <th>Des. Of Eqpt/Stores/Spares</th>
                    <th>A/c Unit</th>
                    <th>Qty Unit</th>
                    <th>Qty tender</th>
                    <th>Qty Accepted</th>
                    <th>Brought to ledger</th>
                    <th>Rejected</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Controller
                        name="itemNo"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            InputProps={{
                              style: { color: "blue" },
                            }}
                            multiline
                            minRows={4}
                            maxRows={4}
                            disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name="eqptDesc"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            InputProps={{
                              style: { color: "blue" },
                            }}
                            multiline
                            minRows={4}
                            maxRows={4}
                            disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name="accUnit"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            InputProps={{
                              style: { color: "blue" },
                            }}
                            multiline
                            minRows={4}
                            maxRows={4}
                            disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name="qtyUnit"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            InputProps={{
                              style: { color: "blue" },
                            }}
                            multiline
                            minRows={4}
                            maxRows={4}
                            disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name="tenderQty"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            InputProps={{
                              style: { color: "blue" },
                            }}
                            multiline
                            minRows={4}
                            maxRows={4}
                            disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name="acceptedQty"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            InputProps={{
                              style: { color: "blue" },
                            }}
                            multiline
                            minRows={4}
                            maxRows={4}
                            disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name="broughtToLedger"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            InputProps={{
                              style: { color: "blue" },
                            }}
                            multiline
                            minRows={4}
                            maxRows={4}
                            disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name="rejected"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            InputProps={{
                              style: { color: "blue" },
                            }}
                            multiline
                            minRows={4}
                            maxRows={4}
                            disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                          />
                        )}
                      />
                    </td>
                    <td>
                      <Controller
                        name="remarks"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            InputProps={{
                              style: { color: "blue" },
                            }}
                            multiline
                            minRows={4}
                            maxRows={4}
                            disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                          />
                        )}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            }
            <Grid item xs={12}>
              <Typography>
                <Typography className={classes.text}>
                  {" "}
                  <b style={{ marginRight: 8 }}>Notes:</b>
                </Typography>
              </Typography>
              <Typography className={classes.text}>
                <b style={{ marginRight: 8 }}>1.</b> In case of any specified
                mode of payment i.e. for 80% or 98% payment same should be
                mentioned on top portion of the Inspection Note.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>2.</b> Delivery / Extended
                Delivery date valid up to{" "}
              </Typography>
              <Controller
                name="notes2a"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>3.</b> QA Call letter received on{" "}
              </Typography>
              <Controller
                name="notes3a"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <Typography component="span" className={classes.text}>
                {" "}
                . In view of this Fag End Notice not issued / issued to firm
                vide encl{" "}
              </Typography>
              <Controller
                name="notes3b"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.text}>
                <b style={{ marginRight: 8 }}>4.</b> Inspection Note should be /
                should not be affixed with a stamp for franking clause.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.text}>
                <b style={{ marginRight: 8 }}>5.</b> Percentage to be with held
                for non supply of literature should be shown on top of portion
                of Inspection Note.
              </Typography>
            </Grid>
            {/* ====================== A END ====================================== */}

            <Grid item xs={12}>
              <Title>
                PART 'B' QUALITY ASSURANCE RECORDS
                <br />
                <span style={{ fontSize: 14, color: "red" }}>
                  (To be completed by Officials QA Team)
                </span>
              </Title>
            </Grid>

            <Grid item xs={12}>
              <Typography className={classes.text}>
                <b style={{ marginRight: 8 }}>B.1</b> Paper particulars
              </Typography>
              <Typography className={classes.text}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b style={{ marginRight: 8 }}>(a)</b>
                &nbsp;&nbsp;&nbsp;Specification
              </Typography>
              <Typography className={classes.text}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b style={{ marginRight: 8 }}>(b)</b>
                &nbsp;&nbsp;&nbsp;Drawing
              </Typography>
              <Typography className={classes.text}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b style={{ marginRight: 8 }}>(b)</b>
                &nbsp;&nbsp;&nbsp;Test Schedule
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.2</b> Accepted Stores cost: Rs{" "}
              </Typography>
              <Controller
                name="b2"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.3</b> Pre-inspection report of
                firm received and verified, found acceptable / comments are as
                per enclosure{" "}
              </Typography>
              <Controller
                name="b3"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.4</b> It is verified that
                previously quality assured but not accepted and rejected stores
                kept in BondRoom were verified and found available before
                commencing the QA of present lot{" "}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.5</b> It is certified that true
                Xerox copy of Railway Receipt for dispatch of previous lot /
                lots have been –
              </Typography>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>(a)</b> already received from firm
                vide L/No
              </Typography>{" "}
              <Controller
                name="b5a"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>(b)</b> not received reasons given
                by firm attached at encl
              </Typography>{" "}
              <Controller
                name="b5b"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.6</b> Details of sampling of raw
                material, finished stores, test samples the manner in which
                drawn and their acceptance is attached at encl{" "}
              </Typography>
              <Controller
                name="b6"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.7</b> Draft literature copies
                have been submitted to AHSP for approval as per letter referred
                at encl{" "}
              </Typography>
              <Controller
                name="b7"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.8</b> Draft literature has been
                approved by AHSP as per letter vide encl{" "}
              </Typography>
              <Controller
                name="b8"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.9</b> Proof copy of literature
                was submitted by the firm to SQAE(L), Bengaluru for approval
                vide encl encl{" "}
              </Typography>
              <Controller
                name="b9"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.10</b> Proof copy of literature
                has been verified and released for final printing with comments
                as per encl{" "}
              </Typography>
              <Controller
                name="b10"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.11</b> Full qty of literature is{" "}
              </Typography>
              <Controller
                name="b11a"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <Typography component="span" className={classes.text}>
                Nos is due before 25% of bulk supplies of stores on order is
              </Typography>{" "}
              <Controller
                name="b11b"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <Typography component="span" className={classes.text}>
                Nos of copies of literature supplied and accepted vide encl
              </Typography>
              <Controller
                name="b11c"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <Typography component="span" className={classes.text}>
                not yet submitted / not applicable
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.12</b> Final printed copies of
                literature{" "}
              </Typography>
              <Controller
                name="b12"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />{" "}
              <Typography component="span" className={classes.text}>
                Nos examined as per proof approved, accepted and acceptance mark
                stamped on all copies.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.13</b> The raw materials, sub
                assy / assyetc have been inspected and accepted already vide
                encl{" "}
              </Typography>
              <Controller
                name="b13"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.14</b> It is certified that{" "}
              </Typography>
              <Controller
                name="b14a"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <Typography component="span" className={classes.text}>
                Nos of the eqpt / stores / spares were completed quantity /
                manufacture and have been quality assured and are found fully
                confirming / not confirming to the governing specifications and
                other details in respect of dimensional, performance and testing
                and identification marking requirements. The detailed report is
                at encl
              </Typography>
              <Controller
                name="b14b"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.15</b> It is certified
                acceptable stores / eqpt / spares were quality assured as per
                contract / specification eqpt and packaged as per specification
                eqpt details enclosed at{" "}
              </Typography>
              <Controller
                name="b15"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.16</b> Warrantee / Guarantee
                certificate obtained in triplicate and filed at encl{" "}
              </Typography>
              <Controller
                name="b16"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.17 </b>Expiry of warrantee
                period marked on the stores / eqpt for details see encl.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.18</b> Eqpt / stores / spares
                are packed into bundles/packages{" "}
              </Typography>
              <Controller
                name="b18"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <Typography component="span" className={classes.text}>
                Nos.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.19</b> Acceptable eqpt / stores
                / spares affixed with Inspection Mark steel / Rubber for qty
              </Typography>{" "}
              <Controller
                name="b19a"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <span>(</span>
              <Typography component="span" className={classes.text}>
                for details of marking refer to encl.
              </Typography>{" "}
              <Controller
                name="b19b"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <span>)</span>
            </Grid>

            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.20</b> It is certified that
                eqpt/stores/spares quality assured and packaged against this lot
                has been handed over to firms as per certificate as encl{" "}
              </Typography>
              <Controller
                name="b20a"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
              <Typography component="span" className={classes.text}>
                {" "}
                / kept in bond room as per details at encl
              </Typography>{" "}
              <Controller
                name="b20b"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.21</b> Test certificate obtained
                from firm as per requirement of the contract / direction of AHSP
                are as given below and are attached at encl TODO add Table
              </Typography>{" "}
              <Controller
                name="b21"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.22</b> Control / Class ‘C’ /
                Shelf life samples drawn and will have to be forwarded to AHSP
                as per encl
              </Typography>{" "}
              <Controller
                name="b22"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.23</b> Short coming / deficiency
                noticed for smooth conduct of QA at firm’s premises is listed
                and at encl
              </Typography>{" "}
              <Controller
                name="b23"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="span" className={classes.text}>
                <b style={{ marginRight: 8 }}>B.24</b> Reasons for delay in
                conduct of QA beyond the period stipulated is explained at encl
              </Typography>{" "}
              <Controller
                name="b24"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    disabled={roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.text}>
                QA progress RedgSl No. ___________________ Group
                __________________ Month________________________{" "}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.text}>
                {" "}
                <b style={{ marginRight: 8 }}>QA Team</b>
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.text}>
              Sigurature (s) : ____________________________________________
            </Grid>
            <Grid item xs={12} className={classes.text}>
              Name(s) & Desig : ____________________________________________
            </Grid>
            <Grid item xs={12} className={classes.text}>
              Inspection Mark Details :
              ____________________________________________
            </Grid>
            <Grid item xs={12} className={classes.text}>
              Date : ____________________________________________
            </Grid>
            {/* CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC */}
            {roleId !== USER_ROLE_ID.ROLE_INSPECTOR &&
              (roleId !== USER_ROLE_ID.ROLE_AQAO ||
                roleId !== USER_ROLE_ID.ROLE_QAO ||
                roleId !== USER_ROLE_ID.ROLE_OIC_ADMIN ||
                roleId === USER_ROLE_ID.ROLE_SQAO) && (
                <>
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
                      <b style={{ marginRight: 8 }}>C.1</b> Eqpt / stores /
                      spares have been subjected to confirmatory /cross checks
                      at firm’s premises located at
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
                          disabled={
                            roleId !== USER_ROLE_ID.ROLE_AQAO &&
                            roleId !== USER_ROLE_ID.ROLE_QAO
                          }
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
                          disabled={
                            roleId !== USER_ROLE_ID.ROLE_AQAO &&
                            roleId !== USER_ROLE_ID.ROLE_QAO
                          }
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          size="small"
                        />
                      )}
                    />{" "}
                    <Typography component="span" className={classes.text}>
                      during cross / confirmatory check samples have been drawn
                      for testing and test report enclosed at encl
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
                          disabled={
                            roleId !== USER_ROLE_ID.ROLE_AQAO &&
                            roleId !== USER_ROLE_ID.ROLE_QAO
                          }
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          size="small"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography component="span" className={classes.text}>
                      <b style={{ marginRight: 8 }}>C.2</b> Acceptance as
                      recommended by QA team examined during cross /
                      confirmatory check. Stores are recommended / not
                      recommended for acceptance. For details refer to encl{" "}
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
                          disabled={
                            roleId !== USER_ROLE_ID.ROLE_AQAO &&
                            roleId !== USER_ROLE_ID.ROLE_QAO
                          }
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="span" className={classes.text}>
                      <b style={{ marginRight: 8 }}>C.3</b> Cross check entry
                      made in cross/confirmatory check register at Srl No
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
                          disabled={
                            roleId !== USER_ROLE_ID.ROLE_AQAO &&
                            roleId !== USER_ROLE_ID.ROLE_QAO
                          }
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="span" className={classes.text}>
                      <b style={{ marginRight: 8 }}>C.4</b> Cross checked stores
                      have been affixed / not affixed with acceptance mark steel
                      / rubber.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="span" className={classes.text}>
                      <b style={{ marginRight: 8 }}>C.5</b> Details of
                      laboratory test / performance test report received and
                      verified and found conformance to specification
                      requirement and available at encl
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
                          disabled={
                            roleId !== USER_ROLE_ID.ROLE_AQAO &&
                            roleId !== USER_ROLE_ID.ROLE_QAO
                          }
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
                      acceptance / not acceptance and are recommended / not
                      recommended for despatch on issue of MC Note / own
                      arrangement of the firm. Issue of Inspection / Rejection
                      Note is recommended.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="span" className={classes.text}>
                      <b style={{ marginRight: 8 }}>C.7</b> Reasons for not
                      accepting the already QA stores is enclosed at
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
                          disabled={
                            roleId !== USER_ROLE_ID.ROLE_AQAO &&
                            roleId !== USER_ROLE_ID.ROLE_QAO
                          }
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          size="small"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography component="span" className={classes.text}>
                      <b style={{ marginRight: 8 }}>C.8</b> Various shortcomings
                      / deficiencies noticed for smooth conduct of QA at firm’s
                      premises noticed by inspection staff discussed with firm’s
                      representative and corrective action letter being issued
                      to firm / letter issued vide encl
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
                          disabled={
                            roleId !== USER_ROLE_ID.ROLE_AQAO &&
                            roleId !== USER_ROLE_ID.ROLE_QAO
                          }
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="span" className={classes.text}>
                      <b style={{ marginRight: 8 }}>C.9</b> Despatch of control/
                      shelf life / Class ‘C’ samples drawn, sent to AHSP vide
                      encl
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
                          disabled={
                            roleId !== USER_ROLE_ID.ROLE_AQAO &&
                            roleId !== USER_ROLE_ID.ROLE_QAO
                          }
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
                    Name & Designation :
                    ____________________________________________
                  </Grid>

                  <Grid item xs={12} className={classes.text}>
                    Date : ____________________________________________
                  </Grid>
                  {/* DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD */}
                  {roleId === USER_ROLE_ID.ROLE_VIGILANCE || roleId === USER_ROLE_ID.ROLE_SQAO && (
                    <>
                      <Grid item xs={12}>
                        <Title>
                          PART 'D': THIRD TIER CROSS VERIFICATION
                          <br />
                          FINAL APPROVAL AND REMARKS OF SQAO
                        </Title>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography component="span" className={classes.text}>
                          <b style={{ marginRight: 8 }}>D.1</b> I have verified
                          on sampling basis the QA records of eqpt /
                          stores/spares prepared by Quality Assurance staff &
                          Group Officer and found in order/ not in order. See
                          observations Encl ---
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography component="span" className={classes.text}>
                          <b style={{ marginRight: 8 }}>D.2</b> I have examined
                          the recommendation of Group officer accepting the
                          stores / not accepting the stores.
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography component="span" className={classes.text}>
                          <b style={{ marginRight: 8 }}>D.3</b> Tier III/
                          Vigilance check was carried out on date
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
                              // disabled={roleId !== USER_ROLE_ID.ROLE_VIGILANCE}
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
                              // disabled={roleId !== USER_ROLE_ID.ROLE_VIGILANCE}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography component="span" className={classes.text}>
                          <b style={{ marginRight: 8 }}>D.4</b> Surprise check
                          was carried out / not carried out, action initiated /
                          not initiated separately.
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography component="span" className={classes.text}>
                          <b style={{ marginRight: 8 }}>D.5</b> I have carried
                          out third tier cross verification of stores personally
                          on dated
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
                              // disabled={roleId !== USER_ROLE_ID.ROLE_VIGILANCE}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography component="span" className={classes.text}>
                          <b style={{ marginRight: 8 }}>D.6</b> Eqpt/stores /
                          spares are hereby cleared / not cleared.
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography component="span" className={classes.text}>
                          <b style={{ marginRight: 8 }}>D.7</b> Issue of
                          Inspection Note /Certificate and MC Note is hereby
                          authorised / not authorised.
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography component="span" className={classes.text}>
                          <b style={{ marginRight: 8 }}>D.8</b> The observations
                          as a result of third tier cross verification is at
                          encl
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
                              // disabled={roleId !== USER_ROLE_ID.ROLE_VIGILANCE}
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

                    </>
                  )}




                  {/* 2nd TIER Report */}
                  {(roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                    roleId === USER_ROLE_ID.ROLE_QAO ||
                    roleId === USER_ROLE_ID.ROLE_SQAO) && (
                      <>
                        <Grid item xs={12}>
                          <Title>REPORT ON TIER-II CHECK</Title>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography className={classes.text}>
                            {" "}
                            <b style={{ marginRight: 8 }}>1.</b> Officer
                            deputed by SQAO
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
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>3.</b> Dated
                            conducted
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t23"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>4. (a)</b>{" "}
                            Nomenclature of Store
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t24a"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>(b)</b>{" "}
                            Indent/Indents/SO No. & Date
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t24b"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>(c)</b> Quantity on
                            order{" "}
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
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>5.</b> Instructions
                            received from SQAO
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t25"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>6. (a)</b> Whether
                            the sample was picked up from the : Accepted lot
                            or from the rejected lot or both
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t26a"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                placeholder="Whether the sample was  picked up from the"
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>(b)</b> Challan No.
                            & Date
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t26b"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>(c) </b>No of
                            samples drawn
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t26c"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>7. (a)</b> Details
                            of Stores
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t27a"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>(b)</b> Scope of
                            tests
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t27b"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>(c)</b> Reason for
                            omitting or not conducting : Certain tests
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t27c"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>(b)</b> Comments on
                            the comparison of test results : of the samples
                            and the bulk
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name="t28b"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>10. </b> Any other details of clarification
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Controller
                            name="t210"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                            <b style={{ marginRight: 8 }}>11. </b> Suggestion and recommendation
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Controller
                            name="t211"
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                disabled={
                                  !(
                                    roleId === USER_ROLE_ID.ROLE_OIC_ADMIN ||
                                    roleId === USER_ROLE_ID.ROLE_QAO
                                  )
                                }
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
                          Officer-in-Charge
                          ____________________________________________
                        </Grid>

                        {/* 3rd TIER Report */}
                        {roleId === USER_ROLE_ID.ROLE_SQAO && (
                          <>
                            <Grid item xs={12} className={classes.text}>
                              <Title>REPORT ON TIER-III CHECK</Title>
                            </Grid>

                            <Grid item xs={6}>
                              <Typography className={classes.text}>
                                {" "}
                                <b style={{ marginRight: 8 }}>1. </b>Officer
                                deputed by SQAO
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
                                <b style={{ marginRight: 8 }}> 2.</b>{" "}
                                Conducted at
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
                                <b style={{ marginRight: 8 }}>3.</b> Dated
                                conducted
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
                                <b style={{ marginRight: 8 }}>4.</b>{" "}
                                Instructions received from SQAO
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
                                <b style={{ marginRight: 8 }}>5. (a)</b>{" "}
                                Whether the sample was picked up from the :
                                Accepted lot or from the rejected lot or both
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
                                <b style={{ marginRight: 8 }}>(b)</b> No of
                                samples drawn
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
                                <b style={{ marginRight: 8 }}>6. (a)</b>{" "}
                                Nomenclature of the Store
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
                                <b style={{ marginRight: 8 }}>(b)</b> Scope of
                                tests
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
                                <b style={{ marginRight: 8 }}>(c)</b> Reason
                                for omitting or not conducting : Certain tests
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
                                <b style={{ marginRight: 8 }}>7. (a)</b>{" "}
                                Results (Satisfactory/Not Satisfactory)
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
                                <b style={{ marginRight: 8 }}>(b)</b> Comments
                                on the comparison of test results : of the
                                samples and the bulk
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
                                <b style={{ marginRight: 8 }}>9.</b> Any other
                                details of clarification
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
                                <b style={{ marginRight: 8 }}>10.</b>{" "}
                                Suggestion and recommendation
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
                              Date :
                              ____________________________________________
                            </Grid>
                            <Grid item xs={12} className={classes.text}>
                              Name and Signature of the Officer
                              ____________________________________________
                            </Grid>
                          </>
                        )}

                      </>
                    )}
                </>
              )}
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
            disabled={saving || (roleId === USER_ROLE_ID.ROLE_INSPECTOR && getValues("qarSqaePartADto.submittedDate")) || (roleId === USER_ROLE_ID.ROLE_QAO && getValues("qarSqaePartCDto.submittedDate")) || (roleId === USER_ROLE_ID.ROLE_SQAO && getValues("crossCheckTier3Dto.submittedDate"))}
            variant="contained"
            color="primary"
            size="small"
            onClick={onSaveAsDraft}
          >
            Save as Draft
          </Button>
          {!getValues("submittedDateTime") ? (
            <Button
              disabled={saving || (roleId === USER_ROLE_ID.ROLE_INSPECTOR && getValues("qarSqaePartADto.submittedDate")) || (roleId === USER_ROLE_ID.ROLE_QAO && getValues("qarSqaePartCDto.submittedDate")) || (roleId === USER_ROLE_ID.ROLE_SQAO && getValues("crossCheckTier3Dto.submittedDate"))}
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => setOpenPreview(true)}
            >
              Preview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
