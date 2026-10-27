import React, { useState} from "react";
import * as yup from "yup";
import moment from "moment";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MuiButton from "@material-ui/core/Button";
import { toast } from "react-toastify";
import { Typography, Grid, CircularProgress } from "@material-ui/core";
import Button from "components/Button";
import TextField from "components/TextField";
import axiosInstance from "pages/Services/AxiosInstance";


const urlGetReport = "/report/getSummaryReport";

const reportsCategories = [
  { id: 1, name: "Online" },
  { id: 2, name: "Offline" },
];

const defaultValues = {
  event: "",
  reportType: "",
  dateRange: [],
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


export default function SummaryReports() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const { t,  } = useTranslation();

  const schema = yup.object().shape({
    event: yup
      .string()
      .typeError("Required")
      .required("Required"),
    dateRange: yup
      .array()
      .typeError("Required")
      .min(2, "Required")
      .required("Required"),
    reportType: yup
      .string()
      .typeError("Required")
      .required("Required"),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });


  //==================Start Submit function====================

  async function onFormSubmit(data) {
    const req = {
      reportType: data.reportType,
      fromDate: data.dateRange[0].format("yyyy-MM-DD 00:00:00"),
      toDate: data.dateRange[1].format("yyyy-MM-DD 23:59:59"),
      eventId: data.event,
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
      toast.error("Failed to download, try again!");
    }
    setIsLoading(false);
  }

  //==================End Submit function====================

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={3}>
            <Typography style={{ fontSize: "0.875rem" }}>
              Event<span style={{ color: "red" }}>*</span>
            </Typography>
            <Controller
              name="event"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  select
                  value={value}
                  onChange={onChange}
                  SelectProps={{ native: true }}
                  size="small"
                  variant="outlined"
                  helperText={errors.event?.message}
                  error={!!errors.event}
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {events.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3}>
            <Typography style={{ fontSize: "0.875rem" }}>
              Report Type<span style={{ color: "red" }}>*</span>
            </Typography>
            <Controller
              name="reportType"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  select
                  value={value}
                  onChange={onChange}
                  SelectProps={{ native: true }}
                  size="small"
                  variant="outlined"
                  helperText={errors.reportType?.message}
                  error={!!errors.reportType}
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {reportsCategories.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3}>
            <Typography style={{ fontSize: "0.875rem" }}>Start Date</Typography>
            <TextField type="date" />
         
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Typography style={{ fontSize: "0.875rem" }}>End Date</Typography>
            <TextField type="date" />
          </Grid>
        </Grid>

        <div style={{ textAlign: "right" }}>
          <Button
            disabled={isLoading || !isDirty}
            style={{ marginTop: 20 }}
            type="submit"
            onClick={handleSubmit(onFormSubmit)}
          >
            Submit
          </Button>

          <MuiButton
            disabled={isLoading}
            onClick={() => reset(defaultValues)}
            style={{ marginTop: 20, marginLeft: 20 }}
            variant="contained"
          >
            Reset
          </MuiButton>
        </div>
      </form>

      {isLoading && (
        <div>
          {"Generating Report, Please wait"} <CircularProgress size={24} />{" "}
        </div>
      )}
    </>
  );
}
