import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { restrict } from "restrict";
import Button from "components/Button";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import ViewOL from "pages/SOModule/SupplyOrderDetails/View/ViewOL";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import ViewOfferLetters from "pages/SOModule/SupplyOrderDetails/View/ViewOfferLetters";
import OLTable from "pages/Sslip/SSlipTable";

const useStyles = makeStyles({
  field: {
    display: "flex",
    marginBottom: 8,
  },
  section: {
    border: "1px solid #205375",
    marginBlock: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 16,
  },
  header: {
    backgroundColor: "#205375",
    textDecoration: "underline",
    color: "white",
    paddingInline: 16,
    paddingBlock: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

const schema = yup.object().shape({
  qtyOnOrder: yup.string().typeError().required(),
  qtyOffered: yup.string().typeError().required(),
  requiresGroupBTest: yup.string().typeError().required(),
  offeredEarlier: yup.string().typeError().required(),

  offeredEarlierQty: yup.string(),
  offeredEarlierDate: yup.string(),

  qats: yup.string().typeError().required(),
  avalWithFirm: yup.string().typeError().required(),
  avalSpec: yup.string().typeError().required(),
  totalQtyOffered: yup.string().typeError().required(),
  lotSize: yup.string().typeError().required(),
  sampleSize: yup.string().typeError().required(),

  testCarriedOut: yup.string().typeError().required(),
  spec: yup.string().typeError().required(),
  result: yup.string().typeError().required(),
  remarks: yup.string().typeError().required(),

  qaChecksCommencedOn: yup.string().typeError().required(),
  qaChecksCompletedOn: yup.string().typeError().required(),
  quantity: yup.string().typeError().required(),
  totalValueAccepted: yup.string().typeError().required(),

  requirementOfSealedSamples: yup.string().typeError().required(),
  requirementOfSealedSamplesOty: yup.string().typeError(),
  requirementOfSealedSamplesNos: yup.string().typeError(),

  inspectionNoteNo: yup.string().typeError(),
  inspectionNoteDate: yup.string().typeError(),

  inspectionMark: yup.string().typeError(),
});

schema.when("offeredEarlier", {
  is: "yes",
  then: (schema) =>
    schema.shape({
      offeredEarlierQty: yup.string().typeError().required(),
      offeredEarlierDate: yup.string().typeError().required(),
    }),
});

schema.when("watchRequirementOfSealedSamples", {
  is: "yes",
  then: (schema) =>
    schema.shape({
      offeredEarlierQty: yup.string().typeError().required(),
      offeredEarlierDate: yup.string().typeError().required(),
    }),
});

const defaultValues = {
  qtyOnOrder: "",
  qtyOffered: "",
  requiresGroupBTest: "",
  offeredEarlier: "",
  offeredEarlierQty: "",
  offeredEarlierDate: "",
  qats: "",
  avalWithFirm: "",
  avalSpec: "",
  totalQtyOffered: "",
  lotSize: "",
  sampleSize: "",

  testCarriedOut: "",
  spec: "",
  result: "",
  remarks: "",

  qaChecksCommencedOn: "",
  qaChecksCompletedOn: "",
  quantity: "",
  totalValueAccepted: "",

  requirementOfSealedSamples: "",
  requirementOfSealedSamplesOty: "",
  requirementOfSealedSamplesNos: "",

  inspectionNoteNo: "",
  inspectionNoteDate: "",

  inspectionMark: "",
};

export default function QaSpares({ olId }) {
  const classes = useStyles();

  const {
    handleSubmit,
    control,
    getValues,

    watch,

  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const roleId = useSelector((store) => store.loggedInUser?.roleId);
  const dispatch = useDispatch();
  const watchOfferedEarlier = watch("offeredEarlier");
  const watchRequirementOfSealedSamples = watch("requirementOfSealedSamples");

  const [saving, setSaving] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);



  async function onSubmit(data) {
    setSaving(true);
    // console.log(createFormReqBody(data, getValues('id')))
    try {
      await axiosInstance.post("qarSqae/submitQarSqae");
      toast.success("Submitted successfully.");
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
      await axiosInstance.post("qarSqae/saveQarSqae");
      toast.success("Saved Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save, plz try again");
    }
    setSaving(false);
  }

  return (
    <div style={{ paddingBlockEnd: "20rem" }}>
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
      <div>
        <Typography
          variant="h6"
          color="primary"
          style={{ textDecoration: "underline" }}
          align="center"
        >
          <b>QUALITY ASSURANCE TEST REPORTS OF SPARES</b>
        </Typography>
        <div>
          <Typography component="span"> 1. Indent No. & Date</Typography>
          <span>:_________________</span>
        </div>
        <div>
          <Typography component="span"> 2. Delivery Date</Typography>
          <span>:_________________</span>
        </div>
        <div>
          <Typography component="span"> 3. OL No. & Date</Typography>
          <span>:_________________</span>
        </div>
      </div>

      <div className={classes.section}>
        <Typography className={classes.header} variant="h6">
          4. VETTING DETAILS
        </Typography>
        <div className={classes.content}>
          <Typography color="secondary" variant="subtitle1">
            <b>Description of item</b>
          </Typography>
          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              Quantity on Order
            </Typography>
            <Controller
              name="qtyOnOrder"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Quantity on Order"
                  style={{ maxWidth: 300 }}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="small"
                />
              )}
            />
          </div>

          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              Quantity Offered
            </Typography>
            <Controller
              name="qtyOffered"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder="Quantity Offered"
                  style={{ maxWidth: 300 }}
                  {...field}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="small"
                />
              )}
            />
          </div>

          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              Does the total quantity in in dent required Group "B" Test
            </Typography>
            <Controller
              name="requiresGroupBTest"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                  <RadioGroup aria-label="qtyOffered" {...field} row>
                    <FormControlLabel
                      control={<Radio size="small" color="primary" />}
                      value="yes"
                      label="Yes"
                    />
                    <FormControlLabel
                      control={<Radio size="small" color="primary" />}
                      value="no"
                      label="No"
                    />
                  </RadioGroup>
                  {fieldState.error && (
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>
          <div>
            <div className={classes.field}>
              <Typography style={{ flex: 1, flexBasis: "50%" }}>
                Was this item (of same indent) offered earlier (if Yes Quantity
                And Date)
              </Typography>
              <Controller
                name="offeredEarlier"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl error={!!fieldState.error}>
                    <RadioGroup aria-label="offeredEarlier" {...field} row>
                      <FormControlLabel
                        control={<Radio size="small" color="primary" />}
                        value="yes"
                        label="Yes"
                      />
                      <FormControlLabel
                        control={<Radio size="small" color="primary" />}
                        value="no"
                        label="No"
                      />
                    </RadioGroup>
                    {fieldState.error && (
                      <FormHelperText>
                        {fieldState.error?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
            <div style={{ paddingLeft: 32 }}>
              {watchOfferedEarlier === "yes" && (
                <div className={classes.field}>
                  <Typography style={{ flex: 1, flexBasis: "50%" }}>
                    Quantity :
                  </Typography>
                  <Controller
                    name="offeredEarlierQty"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        style={{ maxWidth: 300 }}
                        InputProps={{
                          style: { color: "blue" },
                        }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </div>
              )}

              {watchOfferedEarlier === "yes" && (
                <div className={classes.field}>
                  <Typography style={{ flex: 1, flexBasis: "50%" }}>
                    Date :
                  </Typography>
                  <Controller
                    name="offeredEarlierDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          autoOk
                          size="small"
                          placeholder="DD-MM-YYYY"
                          // inputVariant="outlined"
                          format="dd/MM/yyy"
                          id="date-picker-outlined"
                          value={field.value}
                          onChange={field.onChange}
                          KeyboardButtonProps={{
                            "#0B9CAB": "change date",
                          }}
                          error={!!fieldState?.error}
                          helperText={fieldState.error?.message}
                        />
                      </MuiPickersUtilsProvider>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.header}>
          5. QA DETAILS
        </Typography>
        <div className={classes.content}>
          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              QA procedure covered by QATS
            </Typography>
            <Controller
              name="qats"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                  <RadioGroup aria-label="qtyOffered" {...field} row>
                    <FormControlLabel
                      control={<Radio size="small" color="primary" />}
                      value="yes"
                      label="Yes"
                    />
                    <FormControlLabel
                      control={<Radio size="small" color="primary" />}
                      value="no"
                      label="No"
                    />
                  </RadioGroup>
                  {fieldState.error && (
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>

          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              All tests facilities available with firm
            </Typography>
            <Controller
              name="avalWithFirm"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                  <RadioGroup aria-label="qtyOffered" {...field} row>
                    <FormControlLabel
                      control={<Radio size="small" color="primary" />}
                      value="yes"
                      label="Yes"
                    />
                    <FormControlLabel
                      control={<Radio size="small" color="primary" />}
                      value="no"
                      label="No"
                    />
                  </RadioGroup>
                  {fieldState.error && (
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>

          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              All tests facilities available with firm
            </Typography>
            <Controller
              name="avalSpec"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                  <RadioGroup aria-label="qtyOffered" {...field} row>
                    <FormControlLabel
                      control={<Radio size="small" color="primary" />}
                      value="yes"
                      label="Yes"
                    />
                    <FormControlLabel
                      control={<Radio size="small" color="primary" />}
                      value="no"
                      label="No"
                    />
                  </RadioGroup>
                  {fieldState.error && (
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.header}>
          6. Total Quantity
        </Typography>

        <div className={classes.content}>
          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              Total quantity offered
            </Typography>
            <Controller
              name="totalQtyOffered"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  placeholder="Total quantity offered"
                  {...field}
                  style={{ maxWidth: 300 }}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="small"
                />
              )}
            />
          </div>

          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              Lot Size
            </Typography>
            <Controller
              name="lotSize"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Lot Size"
                  style={{ maxWidth: 300 }}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="small"
                />
              )}
            />
          </div>

          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              Sample Size
            </Typography>
            <Controller
              name="sampleSize"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Sample Size"
                  style={{ maxWidth: 300 }}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="small"
                />
              )}
            />
          </div>
          <table className="spares-table">
            <thead>
              <th>Details of test carried out</th>
              <th>Specification</th>
              <th>Result</th>
              <th>Remarks</th>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Controller
                    name="testCarriedOut"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        multiline
                        minRows={4}
                        maxRows={4}
                        style={{ maxWidth: 300 }}
                        InputProps={{
                          style: { color: "blue" },
                        }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </td>

                <td>
                  <Controller
                    name="spec"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        multiline
                        minRows={4}
                        maxRows={4}
                        style={{ maxWidth: 300 }}
                        InputProps={{
                          style: { color: "blue" },
                        }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </td>

                <td>
                  <Controller
                    name="result"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        multiline
                        minRows={4}
                        maxRows={4}
                        style={{ maxWidth: 300 }}
                        InputProps={{
                          style: { color: "blue" },
                        }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
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
                        multiline
                        minRows={4}
                        maxRows={4}
                        style={{ maxWidth: 300 }}
                        InputProps={{
                          style: { color: "blue" },
                        }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" className={classes.header}>
          7. QA Checks
        </Typography>

        <div className={classes.content}>
          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              (a) Commenced on:
            </Typography>
            <Controller
              name="qaChecksCommencedOn"
              control={control}
              render={({ field, fieldState }) => (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    autoOk
                    size="small"
                    placeholder="DD-MM-YYYY"
                    // inputVariant="outlined"
                    format="dd/MM/yyy"
                    id="date-picker-outlined"
                    value={field.value}
                    onChange={field.onChange}
                    KeyboardButtonProps={{
                      "#0B9CAB": "change date",
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState.error?.message}
                  />
                </MuiPickersUtilsProvider>
              )}
            />
          </div>

          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              (b) Completed on:
            </Typography>
            <Controller
              name="qaChecksCompletedOn"
              control={control}
              render={({ field, fieldState }) => (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    autoOk
                    size="small"
                    placeholder="DD-MM-YYYY"
                    // inputVariant="outlined"
                    format="dd/MM/yyy"
                    id="date-picker-outlined"
                    value={field.value}
                    onChange={field.onChange}
                    KeyboardButtonProps={{
                      "#0B9CAB": "change date",
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState.error?.message}
                  />
                </MuiPickersUtilsProvider>
              )}
            />
          </div>
        </div>
      </div>

      <div className={classes.field}>
        <Typography style={{ flex: 1, flexBasis: "50%" }}>
          8. Quantity
        </Typography>
        <Controller
          name="qaChecksCommencedOn"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error}>
              <RadioGroup aria-label="qaChecksCommencedOn" {...field} row>
                <FormControlLabel
                  control={<Radio size="small" color="primary" />}
                  value="accepted"
                  label="Accepted"
                />
                <FormControlLabel
                  control={<Radio size="small" color="primary" />}
                  value="rejected"
                  label="Rejected"
                />
                <FormControlLabel
                  control={<Radio size="small" color="primary" />}
                  value="balance"
                  label="Quantity Balance"
                />
              </RadioGroup>
              {fieldState.error && (
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>

      <div className={classes.field}>
        <Typography style={{ flex: 1, flexBasis: "50%" }}>
          9. Total Value of accepted stores Rs.
        </Typography>
        <Controller
          name="totalValueAccepted"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              placeholder="Total Value of accepted"
              {...field}
              style={{ maxWidth: 300 }}
              onInput={restrict.number}
              InputProps={{
                style: { color: "blue" },
              }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              size="small"
            />
          )}
        />
      </div>
      <div>
        <div className={classes.field}>
          <Typography style={{ flex: 1, flexBasis: "50%" }}>
            10. Required of seal sample Yes/No,(If yes Quantity and Nos.)
          </Typography>
          <Controller
            name="requirementOfSealedSamples"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error}>
                <RadioGroup aria-label="offeredEarlier" {...field} row>
                  <FormControlLabel
                    control={<Radio size="small" color="primary" />}
                    value="yes"
                    label="Yes"
                  />
                  <FormControlLabel
                    control={<Radio size="small" color="primary" />}
                    value="no"
                    label="No"
                  />
                </RadioGroup>
                {fieldState.error && (
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        <div style={{ paddingLeft: 32 }}>
          {watchRequirementOfSealedSamples === "yes" && (
            <div className={classes.field}>
              <Typography style={{ flex: 1, flexBasis: "50%" }}>
                Quantity :
              </Typography>
              <Controller
                name="offeredEarlierQty"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    style={{ maxWidth: 300 }}
                    InputProps={{
                      style: { color: "blue" },
                    }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </div>
          )}

          {watchRequirementOfSealedSamples === "yes" && (
            <div className={classes.field}>
              <Typography style={{ flex: 1, flexBasis: "50%" }}>
                Date :
              </Typography>
              <Controller
                name="offeredEarlierDate"
                control={control}
                render={({ field, fieldState }) => (
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      autoOk
                      size="small"
                      placeholder="DD-MM-YYYY"
                      // inputVariant="outlined"
                      format="dd/MM/yyy"
                      id="date-picker-outlined"
                      value={field.value}
                      onChange={field.onChange}
                      KeyboardButtonProps={{
                        "#0B9CAB": "change date",
                      }}
                      error={!!fieldState?.error}
                      helperText={fieldState.error?.message}
                    />
                  </MuiPickersUtilsProvider>
                )}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <Typography> 11. Inspection Note No. and Date</Typography>
        <div style={{ paddingLeft: 32 }}>
          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>
              Note No.
            </Typography>
            <Controller
              name="inspectionNoteNo"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  style={{ maxWidth: 300 }}
                  InputProps={{
                    style: { color: "blue" },
                  }}
                  placeholder="Note No."
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="small"
                />
              )}
            />
          </div>

          <div className={classes.field}>
            <Typography style={{ flex: 1, flexBasis: "50%" }}>Date </Typography>
            <Controller
              name="inspectionNoteDate"
              control={control}
              render={({ field, fieldState }) => (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    autoOk
                    size="small"
                    // inputVariant="outlined"
                    placeholder="DD-MM-YYYY"
                    format="dd/MM/yyy"
                    id="date-picker-outlined"
                    value={field.value}
                    onChange={field.onChange}
                    KeyboardButtonProps={{
                      "#0B9CAB": "change date",
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState.error?.message}
                  />
                </MuiPickersUtilsProvider>
              )}
            />
          </div>
        </div>
      </div>

      <div>
        <Typography>12. Inspection Mark/Hologram No. </Typography>

        <div className={classes.field} style={{ paddingLeft: 32 }}>
          <Typography style={{ flex: 1, flexBasis: "50%" }}>
            Hologram No.
          </Typography>
          <Controller
            name="inspectionMark"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                placeholder="Hologram No."
                style={{ maxWidth: 300 }}
                InputProps={{
                  style: { color: "blue" },
                }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          />
        </div>
      </div>

      <Typography>
        13. Certified that the quantity assurance checks were carried out as per
        the laid down procedure.
      </Typography>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Button
          style={{ marginRight: 12 }}
          disabled={saving}
          variant="contained"
          color="primary"
          onClick={onSaveAsDraft}
        >
          Save as Draft
        </Button>
        {!getValues("submittedDateTime") ? (
          <Button
            disabled={saving}
            variant="contained"
            color="secondary"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenPreview(true)}
          >
            Preview
          </Button>
        )}
      </div>

      <div style={{ paddingTop: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 100,
          }}
        >
          <Typography>
            <b>QA Check by</b>
          </Typography>
          <Typography>
            <b>Officer-in-charge</b>
          </Typography>
        </div>
        <Typography style={{ marginBottom: 100 }}>
          <b>Cross Check</b>
        </Typography>
        <Typography style={{ marginBottom: 100 }}>
          <b>Vigilance check/surprise check </b>
        </Typography>
        <Typography style={{ marginBottom: 100 }}>
          <b>AQAO/QAOs</b>
        </Typography>
        <Typography style={{ marginBottom: 100 }}>
          <b>SQAO</b>
        </Typography>
      </div>
    </div>
  );
}
