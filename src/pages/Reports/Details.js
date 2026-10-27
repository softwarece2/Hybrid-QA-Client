import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import MuiButton from "@material-ui/core/Button";
import { AddCircle, Close } from "@material-ui/icons";
import CustomizedInputs from "components/TextField";
import moment from "moment";
import {  useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

//
import Button from "components/Button";
import TextField from "components/TextField";
import axiosInstance from "pages/Services/AxiosInstance";
import { useTranslation } from "react-i18next";
import { restrict } from "restrict";
import { StyledTableRow } from "Utils";



const urlGetReport = "report/getReport";

const EQUALITY = [
  {
    name: "Equal",
    id: "1",
  },
  {
    name: "Not Equal",
    id: "2",
  },
];

const YesNO = [
  {
    name: "Yes",
    id: "1",
  },
  {
    name: "No",
    id: "2",
  },
];

const OPERATOR = [
  {
    name: "And",
    id: "AND",
  },
  {
    name: "Or",
    id: "OR",
  },
];

const defaultArray = {
  fieldId: "",
  equalityId: 1,
  value: "",
  operator: "AND",
};

const defaultValues = {
  category: "",
  dateRange: [],
  searchFields: [defaultArray],
};

function downloadReport(arrayBuffer) {
  const date = moment().format("DD-MM-YYYY_hh:mm:ss");
  const outputFilename = `Report-${date}.xlsx`;
  const url = URL.createObjectURL(new Blob([arrayBuffer]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", outputFilename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}



export default function ReportDetails() {
  const [FieldsParam, setFieldsParam] = useState([]);
  const [reportsCategories, setReportsCategories] = useState([]);
  const [fieldValues, setFieldsValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingValues, setLoadingValues] = useState({});
  const { t } = useTranslation();

  const searchFieldSchema = yup.object().shape({
    fieldId: yup
      .object()
      .typeError(t("Required"))
      .required(t("Required")),
    equalityId: yup
      .string()
      .trim()
      .required(t("Required")),
    value: yup
      .string()
      .trim()
      .required(t("Required")),
    operator: yup
      .string()
      .trim()
      .required(t("Required")),
  });

  const schema = yup.object().shape({
    category: yup
      .object()
      .typeError(t("Required"))
      .shape({
        id: yup.string().required(),
        displayName: yup.string(),
        serviceName: yup.string(),
      })
      .nullable()
      .required(t("Required")),
    dateRange: yup
      .array()
      .typeError(t("Required"))
      .min(2, t("Required"))
      .required(t("Required")),

    searchFields: yup.array().of(searchFieldSchema),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "searchFields",
  });

  // useEffect(() => {
  //   axiosInstance
  //     .get(urlGelAll)
  //     .then(({ data }) => {
  //       if (Array.isArray(data)) {
  //         setReportsCategories(data);
  //         setFieldsValues({});
  //       } else {
  //         toast.error(t("failed to get report categories!"));
  //       }
  //     })
  //     .catch((err) => {
  //       toast.error(t("failed to get report categories!"));
  //       console.log(err);
  //     });
  // }, []);

  // async function onReportCategorySelect(categoryObj) {
  //   try {
  //     const { data } = await axiosInstance.get("report" + categoryObj.serviceName);
  //     if (Array.isArray(data)) {
  //       setFieldsParam(data);
  //     } else {
  //       toast.error(t("Failed to get Fields!"));
  //     }
  //   } catch (error) {
  //     toast.error(t("Failed to get Fields!"));
  //   }
  // }

  // async function onFieldSelect(fieldObj) {
  //   if (fieldObj?.serviceName && !(fieldObj.dbName in fieldValues)) {
  //     setLoadingValues((ps) => ({
  //       ...ps,
  //       [fieldObj.dbName]: true,
  //     }));
  //     try {
  //       const { data } = await axiosInstance.get(fieldObj.serviceName);
  //       if (Array.isArray(data.data)) {
  //         setFieldsValues((ps) => ({
  //           ...ps,
  //           [fieldObj.dbName]: data.data,
  //         }));
  //       } else {
  //         toast.error(t("Failed to get Fields!"));
  //       }
  //     } catch (error) {
  //       toast.error(t("Failed to get Fields!"));
  //     }
  //     setLoadingValues((ps) => ({
  //       ...ps,
  //       [fieldObj.dbName]: false,
  //     }));
  //   }
  // }

  //==================Start Submit function====================

  async function onFormSubmit(data) {
    const req = {
      categoryId: data.category.id,
      fromDate: data.dateRange[0].format("yyyy-MM-DD 00:00:00"),
      toDate: data.dateRange[1].format("yyyy-MM-DD 23:59:59"),
      searchFields: data.searchFields.map((el, i, array) => ({
        ...el,
        fieldId: el.fieldId.id,
        operator: array.length - 1 !== i ? el.operator : "",
      })),
    };
    setIsLoading(true);
    const config = {
      method: "POST",
      url: urlGetReport,
      responseType: "arraybuffer",
      headers: { "Content-Type": "application/json" },
      data: req,
    };
    try {
      const { data } = await axiosInstance(config);
      downloadReport(data);
    } catch (error) {
      console.log(error);
      toast.error(t("Failed to download, try again!"));
    }
    setIsLoading(false);
  }

  //==================End Submit function====================

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4}>
            <Typography style={{ fontSize: "0.875rem" }}>
              {t("Select Report Category")}
              <span style={{ color: "red" }}>*</span>
            </Typography>

            <Controller
              name="category"
              control={control}
              render={({ field: { value } }) => (
                <TextField
                  fullWidth
                  style={{ paddingBottom: 16 }}
                  select
                  value={value?.id || ""}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    const categoryObj = reportsCategories.find((c) => c.id === +categoryId);
                    // onReportCategorySelect(categoryObj);
                    reset({ category: categoryObj, searchFields: [defaultArray] });
                  }}
                  SelectProps={{
                    native: true,
                  }}
                  size="small"
                  variant="outlined"
                  helperText={errors.category?.message}
                  error={!!errors.category}
                >
                  <option value="" disabled>
                    {t("Select Type")}
                  </option>
                  {reportsCategories.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.displayName}
                    </option>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3}>
            <Typography style={{ fontSize: "0.875rem" }}>Start Date</Typography>
            <TextField type="date" />
            {/* <Controller
              name="dateRange"
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <Typography>
                    Date Range<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <RangePicker
                    style={{ minWidth: 500 }}
                    onChange={onChange}
                    value={value}
                    format="DD-MM-yyyy"
                    status={errors.dateRange ? "error" : ""}
                    disabledDate={isValidDate}
                  />
                  {errors.dateRange && <p style={{ fontSize: 12, color: "red" }}>{errors.dateRange?.message}</p>}
                </>
              )}
            /> */}
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Typography style={{ fontSize: "0.875rem" }}>End Date</Typography>
            <TextField type="date" />
          </Grid>
        </Grid>

        <TableContainer component={Paper} style={{ maxHeight: 400 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="report-table__header">
                  {t("Field")}
                  <span style={{ color: "red" }}>*</span>
                </TableCell>
                <TableCell className="report-table__header">{t("Equality")}</TableCell>
                <TableCell className="report-table__header">
                  {t("Value")}
                  <span style={{ color: "red" }}>*</span>
                </TableCell>
                <TableCell className="report-table__header">{t("Operator")}</TableCell>
                <TableCell className="report-table__header">
                  <IconButton size="small" title="Add Row" color="primary" onClick={() => append(defaultArray)}>
                    <AddCircle />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {fields?.map((item, index, array) => (
              <TableBody key={item.id}>
                <StyledTableRow>
                  <TableCell style={{ width: 400 }}>
                    <Controller
                      control={control}
                      name={`searchFields[${index}].fieldId`}
                      render={({ field: { onChange, value } }) => (
                        <CustomizedInputs
                          select
                          SelectProps={{ native: true }}
                          fullWidth
                          onChange={(e) => {
                            const fieldId = e.target.value;
                            const fieldObj = FieldsParam.find((c) => c.id === +fieldId);
                            onChange(fieldObj);
                            // onFieldSelect(fieldObj);
                          }}
                          value={value?.id || ""}
                          error={!!errors.searchFields?.[index]?.fieldId}
                          helperText={errors.searchFields?.[index]?.fieldId?.message}
                        >
                          <option value="">{t("Select Field")}</option>
                          {FieldsParam?.map((encl) => (
                            <option key={encl.id} value={encl.id}>
                              {encl.displayName}
                            </option>
                          ))}
                        </CustomizedInputs>
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <Controller
                      control={control}
                      name={`searchFields[${index}].equalityId`}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          style={{ minWidth: 100 }}
                          select
                          SelectProps={{ native: true }}
                          //   fullWidth
                          onChange={onChange}
                          value={value}
                          error={!!errors.searchFields?.[index]?.equalityId}
                          helperText={errors.searchFields?.[index]?.equalityId?.message}
                        >
                          {EQUALITY.map((eq) => (
                            <option key={eq.id} value={eq.id}>
                              {eq.name}
                            </option>
                          ))}
                        </TextField>
                      )}
                    />
                  </TableCell>

                  <TableCell style={{ width: 400 }}>
                    <Controller
                      control={control}
                      name={`searchFields[${index}].value`}
                      render={({ field: { onChange, value } }) => {
                        const obj = watch(`searchFields[${index}].fieldId`);
                        if (obj.dataType === 1) {
                          const list = fieldValues[obj.dbName] || [];
                          return (
                            <>
                              {loadingValues[obj.id] && (
                                <LinearProgress
                                  color="secondary"
                                  style={{ marginBottom: -4.5, marginInline: 14, borderRadius: 20 }}
                                />
                              )}
                              <CustomizedInputs
                                select
                                SelectProps={{ native: true }}
                                fullWidth
                                onChange={onChange}
                                value={value}
                                error={!!errors.searchFields?.[index]?.value}
                                helperText={errors.searchFields?.[index]?.value?.message}
                              >
                                <option value="">{t("Select")}</option>
                                {list.map((eq) => (
                                  <option key={eq.id} value={eq.id}>
                                    {eq.name || eq.type || eq.level || eq.status || eq.title}
                                  </option>
                                ))}
                              </CustomizedInputs>
                            </>
                          );
                        } else if (obj.dataType === 2) {
                          return (
                            <CustomizedInputs
                              fullWidth
                              onInput={restrict.remarks}
                              onChange={(e) => {
                                onChange(e.target.value);
                              }}
                              value={value}
                              placeholder={t("Enter Search term")}
                              inputProps={{ maxLength: 50 }}
                              error={!!errors.searchFields?.[index]?.value}
                              helperText={errors.searchFields?.[index]?.value?.message}
                            />
                          );
                        } else {
                          return (
                            <CustomizedInputs
                              select
                              SelectProps={{ native: true }}
                              fullWidth
                              onChange={onChange}
                              value={value}
                              error={!!errors.searchFields?.[index]?.value}
                              helperText={errors.searchFields?.[index]?.value?.message}
                            >
                              <option value="">{t("Select")}</option>
                              {YesNO.map((eq) => (
                                <option key={eq.id} value={eq.id}>
                                  {eq.name || eq.type || eq.level || eq.status}
                                </option>
                              ))}
                            </CustomizedInputs>
                          );
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    {array.length - 1 !== index && (
                      <Controller
                        control={control}
                        name={`searchFields[${index}].operator`}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            select
                            SelectProps={{ native: true }}
                            onChange={onChange}
                            value={value}
                            error={!!errors.searchFields?.[index]?.operator}
                            helperText={errors.searchFields?.[index]?.operator?.message}
                          >
                            {OPERATOR.map((operator) => (
                              <option key={operator.id} value={operator.id}>
                                {operator.name}
                              </option>
                            ))}
                          </TextField>
                        )}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      style={{ marginTop: 6 }}
                      disabled={index === 0}
                      size="small"
                      title={t("Delete Row")}
                      aria-label="delete"
                      onClick={() => remove(index)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              </TableBody>
            ))}
          </Table>
        </TableContainer>

        <div style={{ textAlign: "right" }}>
          <Button
            disabled={isLoading || !isDirty}
            style={{ marginTop: 20 }}
            type="submit"
            onClick={handleSubmit(onFormSubmit)}
          >
            {t("Submit")}
          </Button>

          <MuiButton
            disabled={isLoading}
            onClick={() => reset(defaultValues)}
            style={{ marginTop: 20, marginLeft: 20 }}
            variant="contained"
          >
            {t("Reset")}
          </MuiButton>
        </div>
      </form>

      {isLoading && (
        <div>
          {t("Generating Report, Please wait")} <CircularProgress size={24} />{" "}
        </div>
      )}
    </>
  );
}
