/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import "../../../App.css";
//pages

//component
import TableComponent from "components/table/index";

//material-ui

import { Grid} from "@material-ui/core";
import CrossCheckRegisterForm from "./CrossCheckRegisterForm";
import Button from "components/Button";
import { getCrossCheckListByDate } from "Redux/Actions/SupplyOrder/RegistersAction";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

//icons




export default function AddIndenterTable() {

  const dispatch = useDispatch();
  const orgId = useSelector((store) => store.loggedInUser?.orgId);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    `${moment(new Date()).subtract(1, "M").format("YYYY-MM-DD")}`
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );


  const [columns] = useState([
    {
      title: "Sl No.",
      field: "slNo",
      width: "auto",
      filtering: false,
    },
    {
      title: "Date of Inspection",
      field: "inspectionDate",
      width: "auto",
      filtering: false,
    },
    {
      title: "Firm",
      field: "firm",
      width: "auto",
      filtering: false,
    },
    {
      title: "Cross Verification By",
      field: "crossVerifyBy",
      width: "auto",
      filtering: false,
    },
    {
      title: "Item No",
      field: "itemNo",
      width: "auto",
      filtering: false,
    },
    {
      title: "Item Description",
      field: "itemDescription",
      width: "auto",
      filtering: false,
    },
    {
      title: "Supply Order No",
      field: "supplyOrderNo",
      width: "auto",
      filtering: false,
    },
    {
      title: "Individual Responsible",
      field: "individualResponsible",
      width: "auto",
      filtering: false,
    },
    {
      title: "Details Of Test Carried Out",
      field: "testCarried",
      width: "auto",
      filtering: false,
    },
    {
      title: "Cross Verification By",
      field: "crossVerifyBy",
      width: "auto",
      filtering: false,
    },
    {
      title: "Cross Verification Date",
      field: "crossVerifyDate",
      width: "auto",
      filtering: false,
    },
    {
      title: "Remarks",
      field: "remarks",
      width: "auto",
      filtering: false,
    },
  ]);
  //getCrossCheckListByDate
  const getData = () => {
    setLoading(true);
    dispatch(
      getCrossCheckListByDate(
        orgId,
        moment(startDate).format("YYYY-MM-DD"),
        moment(endDate).format("YYYY-MM-DD")
      )
    )
      .then((res) => {
        setRecords(
          res.map((el, i) => ({
            ...el,
            slNo: i + 1,
            inspectionDate: el?.inspectionDate
              ? moment(el?.inspectionDate).format("DD-MM-yyyy")
              : null,
            crossVerifyDate: el?.crossVerifyDate
              ? moment(el?.crossVerifyDate).format("DD-MM-yyyy")
              : null,
          }))
        );
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));

    // }
  };

  const handleChangeStartDate = (e) => {
    setStartDate(e);
    setEndDate(null);
  };
  const handleChangeEndDate = (e) => {
    setEndDate(e);
  };
  useEffect(() => {
    getData();
  }, []);

  const actions = [
    {
      icon: () => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            variant="dialog"
            format="dd/MM/yyyy"
            autoOk
            id="date-picker-inline"
            label="Start Date"
            value={startDate}
            style={{ marginBottom: 8 }}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            onChange={handleChangeStartDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            clearable
            size="small"
            inputVariant={"outlined"}
            disableFuture
          />
        </MuiPickersUtilsProvider>
      ),
      isFreeAction: true,
    },
    {
      icon: () => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            variant="dialog"
            format="dd/MM/yyyy"
            autoOk
            id="date-picker-inline"
            label="End Date"
            value={endDate}
            style={{ marginBottom: 8 }}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            maxDate={moment(startDate).add(12, "months")}
            minDate={moment(startDate).format("YYYY-MM-DD")}
            onChange={handleChangeEndDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            clearable
            size="small"
            inputVariant={"outlined"}
            disableFuture
          />
        </MuiPickersUtilsProvider>
      ),
      isFreeAction: true,
    },
    {
      icon: () => (
        <Button
          variant="contained"
          style={{ marginTop: 22 }}
          disabled={!endDate}
          color="primary"
          size="small">
          {" "}
          Submit
        </Button>
      ),
      onClick: (event, rowData) => {
        getData();
      },
      disabled: !endDate,
      isFreeAction: true,
    },
  ];
  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <CrossCheckRegisterForm />
        </Grid>

        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={actions}
          />
        </Grid>
      </Grid>
    </>
  );
}
