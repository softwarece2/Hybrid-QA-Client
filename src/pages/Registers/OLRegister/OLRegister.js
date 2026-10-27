/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Button from "components/Button";

import TableComponent from "components/table";

import moment from "moment";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getOfferLetterRegisterByDate } from "Redux/Actions/SupplyOrder/RegistersAction";
import GetAppIcon from "@material-ui/icons/GetApp";
import DateFnsUtils from "@date-io/date-fns";
//excel
import { WING_ID } from "../../../Globals";
import Excel from "exceljs";
import FileSaver from "file-saver";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  typo: {
    fontSize: "0.875rem",
  },
  paper: {
    padding: "0px 12px 12px 12px",
  },
}));

export default function OLRegister() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printData, setPrintData] = React.useState([]);
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [startDate, setStartDate] = useState(`${moment(new Date()).subtract(1, "M").format("YYYY-MM-DD")}`);
  const [endDate, setEndDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const orgId = useSelector((store) => store.loggedInUser?.orgId);

  const [columns] = useState([
    {
      title: "Sl. No",
      field: "slNo",
      width: "auto",
      filtering: true,
    },
    {
      title: isArmy ? "QACL No" : "OL No",
      field: "olNumber",
      width: "auto",
      filtering: true,
    },
    {
      title: isArmy ? "QACL-DT" : "OL-DT",
      field: "offerDate",
      width: "auto",
      filtering: true,
    },
    {
      title: "Indent No",
      field: "indentNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Indent Date",
      field: "indentDate",
      width: "auto",
      filtering: false,
    },
    {
      title: "Order Date",
      field: "orderDate",
      width: "auto",
      filtering: false,
    },
    {
      title: "Project Description",
      field: "projectDescription",
      width: "auto",
      filtering: false,
    },
    {
      title: "Total Items",
      field: "noOfItems",
      width: "auto",
      filtering: false,
    },
    {
      title: "Total Qty",
      field: "totalQty",
      width: "auto",
      filtering: false,
    },
    {
      title: isArmy ? "Total QACL Value" : "Total OL Value",
      field: "value",
      width: "auto",
      filtering: false,
    },
    {
      title: "Delivery Date",
      field: "dd",
      width: "auto",
      filtering: false,
    },
  ]);

  const getData = () => {
    setLoading(true);
    dispatch(getOfferLetterRegisterByDate(orgId, moment(startDate).format("YYYY-MM-DD"), moment(endDate).format("YYYY-MM-DD")))
      .then((res) => {
        setRecords(
          res.map((el, i) => ({
            ...el,
            slNo: i + 1,
            orderDate: el?.orderDate ? moment(el?.orderDate).format("DD-MM-yyyy") : null,
            indentDate: el?.indentDate ? moment(el?.indentDate).format("DD-MM-yyyy") : null,
            offerDate: el?.offerDate ? moment(el?.offerDate).format("DD-MM-yyyy") : null,
            dd: el?.dd ? moment(el?.dd).format("DD-MM-yyyy") : "",
          }))
        );
        setPrintData(
          res.map((el, i) => ({
            ...el,
            orderDate: el?.orderDate ? moment(el?.orderDate).format("DD-MM-yyyy") : null,
            receiptDate: el?.receiptDate ? moment(el?.receiptDate).format("DD-MM-yyyy") : null,
            dd: el?.dd ? moment(el?.dd).format("DD-MM-yyyy") : "",
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
            id="date-picker-inline"
            style={{ marginBottom: 8 }}
            label="End Date"
            value={endDate}
            autoOk
            disabled={!startDate}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            maxDate={moment(startDate).add(12, "months")}
            minDate={moment(startDate).format("YYYY-MM-DD")}
            onChange={handleChangeEndDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            size="small"
            clearable
            inputVariant={"outlined"}
            disableFuture
          />
        </MuiPickersUtilsProvider>
      ),
      isFreeAction: true,
    },
    {
      icon: () => (
        <Button variant="contained" style={{ marginTop: 22 }} disabled={!endDate} color="primary" size="small">
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
  const printExcel = () => {
    const wb = new Excel.Workbook();
    const reportName = isArmy ? "QACL Register - Report" : "OL Register - Report";
    const now = moment(new Date()).format("DD-MM-YYYY");
    const time = new Date().toLocaleTimeString();

    const [setStartDate, setEndDate] = [startDate, endDate].map((d) => moment(d).format("DD-MM-YYYY"));
    const data = printData.map((d) => [
      // d.slNo ?? "-",
      d.olNumber ?? "-",
      d.offerDate ?? "-",
      d.indentNo ?? "-",
      d.indentDate ?? "-",
      d.orderDate ?? "-",
      d.projectDescription ?? "-",
      d.noOfItems ?? "-",
      d.totalQty ?? "-",
      d.value ?? "-",
      d.dd ?? "-",
    ]);

    const sheet = wb.addWorksheet("OL Report");

    const tableData = data.map((r, i) => [i + 1, ...r]);
    // records.forEach((record) => {
    //   const tableData = columns.map((column) => record[column.field]);
    //   sheet.addRow(tableData);
    // });

    const wsData = [
      [reportName],
      [`Report generated on: ${now} , ${time}`],
      ["From Date", null, setStartDate],
      ["To Date", null, setEndDate],
      [null],
      [
        "Sl. No",
        "OL No",
        "OL-DT",
        "Indent No",
        "Indent Date",
        "Order Date",
        "Project Description",
        "Total Items",
        "Total Qty",
        "Total OL Value",
        "Delivery Date",
      ],
      ...tableData,
    ];

    sheet.columns = [
      { width: 6 },
      { width: 12 },
      { width: 12 },
      { width: 24 },
      { width: 18 },
      { width: 12 },
      { width: 24 },
      { width: 18 },
      { width: 18 },
      { width: 14 },
      { width: 18 },
    ];

    sheet.addRows(wsData);

    ["A1:K1", "A2:K2", "A3:B3", "A4:B4", "A5:K5", "C3:K3", "C4:K4"].forEach((m) => sheet.mergeCells(m));

    ["A1", "A2"].forEach(
      (m) =>
        (sheet.getCell(m).alignment = {
          vertical: "middle",
          horizontal: "center",
        })
    );

    // style for all rows
    const last = sheet.rowCount;
    for (let i = 1; i <= last; i++) {
      sheet.getRow(i).font = { size: 9 };
    }

    [6].forEach((r) => {
      sheet.getRow(r).font = { ...sheet.getRow(r).font, bold: true };
    });

    // range(1, 4, 18).forEach(
    //   (c) =>
    //     (sheet.getColumn(c).alignment = {
    //       vertical: "middle",
    //       horizontal: "center",
    //     })
    // );

    ["A1", "A2", "A3", "A4"].forEach((e) => (sheet.getCell(e).font = { ...sheet.getCell(e).font, bold: true }));

    sheet.eachRow(function (row, rowNumber) {
      row.eachCell((cell, colNumber) => {
        if (rowNumber > 5) {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
            allBorder: { style: "thin" },
          };
        }
      });
    });

    wb.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, `OL Register -${now}.xlsx`);
    });

    // const mainHeader = [reportName, `Report generated on: ${now} , ${time}`, null, startDate, endDate];
    // // Get the headers from the columns array
    // const headers = columns.map((column) => column.title);

    // ["A1:M1"].forEach((m) => ws.mergeCells(m));

    // ws.addRow(mainHeader);

    // // Add headers with bold styling
    // ws.addRow(headers);

    // records.forEach((record) => {
    //   const rowData = columns.map((column) => record[column.field]);
    //   ws.addRow(rowData);
    // });

    // // Add an empty row as a separator
    // ws.addRow([]);
    // wb.xlsx.writeBuffer().then((buffer) => {
    //   const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    //   const url = URL.createObjectURL(blob);
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.download = "PO_Report.xlsx";
    //   FileSaver.saveAs(blob, `PO-Report ${now}.xlsx`);
    // });
  };

  return (
    <div>
      <Paper>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={12}>
            <Typography style={{ fontSize: "0.875rem" }} className={classes.card}>
              {isArmy ? "QACL" : "OL"} Register
            </Typography>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={0} alignItems="center" className={classes.paper}>
          <Grid item xs={12} align="center">
            <TableComponent
              isLoading={loading}
              data={records}
              columns={columns}
              title=""
              actions={actions}

              // options={{ filtering: false, sorting: false }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="right" style={{ marginTop: "15px" }}>
          <Grid item xs={12} align="right">
            {/* <ReactToPrint
              trigger={() => (
                <Button color="primary" variant="contained"   >
                  Print
                </Button>
              )}
              content={() => componentRef}
            /> */}
            <div style={{ paddingRight: "10px" }}>
              <Button color="primary" variant="contained" onClick={printExcel}>
                Excel <GetAppIcon style={{ fontSize: "18px" }} />
              </Button>
            </div>
            {/* <Button  color="primary"  >
                Close
              </Button> */}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
