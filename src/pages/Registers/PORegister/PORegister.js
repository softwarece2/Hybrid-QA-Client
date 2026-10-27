/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

//material-ui
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GetAppIcon from "@material-ui/icons/GetApp";
import DateFnsUtils from "@date-io/date-fns";
//components
import Button from "components/Button";
import TableComponent from "components/table";


//excel
import Excel from "exceljs";
import FileSaver from "file-saver";
import moment from "moment";

//redux

import { useDispatch, useSelector } from "react-redux";
import { getSupplyOrderRegisterByDate } from "Redux/Actions/SupplyOrder/RegistersAction";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

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
  dateCss: {
    "&.ant-upload .ant-upload-select-picture-card": {
      marginRight: 0,
      marginBottom: 0,
      height: "60px",
      /* max-width: 200px; */
      width: "100%",
    },
    "&.ant-upload-list-picture-card-container": {
      paddingBottom: "8px",
    },
    "&.ant-picker:hover .ant-picker-focused": {
      borderColor: "#9d378e",
    },
    "&.ant-picker-focused": {
      boxShadow: "0 0 0 2px rgba(143, 24, 255, 0.2)",
    },
    "&.ant-picker-range .ant-picker-active-bar": {
      backgroundColor: "purple",
    },
    "&.ant-picker-range": {
      height: "40px",
      borderRadius: "4px",
    },
    "&.ant-upload-list-text .ant-upload-list-item-name .ant-upload-list-picture .ant-upload-list-item-name":
      {
        fontSize: "1.2rem !important",
      },
    "&.ant-upload-list-text .ant-upload-list-item-card-actions .ant-upload-list-picture .ant-upload-list-item-card-actions":
      {
        fontSize: "1.2rem",
      },
  },
}));



export default function PORegister() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orgId = useSelector((store) => store.loggedInUser?.orgId);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printData, setPrintData] = React.useState([]);

  const [startDate, setStartDate] = useState(
    `${moment(new Date()).subtract(1, "M").format("YYYY-MM-DD")}`
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );



  const [columns] = useState([
    {
      title: "Sl. No",
      field: "fileNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Indentor",
      field: "indentorName",
      width: "auto",
      filtering: true,
    },
    {
      title: "Supplier",
      field: "supplierName",
      width: "auto",
      filtering: true,
    },
    {
      title: "Description",
      field: "description",
      width: "auto",
      filtering: true,
    },
    {
      title: "SO/PO No",
      field: "orderNo",
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
      title: "Date Received",
      field: "receiptDate",
      width: "auto",
      filtering: false,
    },
    {
      title: "Item",
      field: "noOfItems",
      width: "auto",
      filtering: false,
    },
    {
      title: "Qty",
      field: "totalQty",
      width: "auto",
      filtering: false,
    },
    {
      title: "Value in (Rs)",
      field: "value",
      width: "auto",
      filtering: false,
    },
    {
      title: "Del Date",
      field: "dd",
      width: "auto",
      filtering: false,
    },
    {
      title: "Section",
      field: "section",
      width: "auto",
      filtering: false,
    },
    {
      title: "File No.",
      field: "fileNo",
      width: "auto",
      filtering: false,
    },
  ]);

  const getData = () => {
    setLoading(true);
    dispatch(
      getSupplyOrderRegisterByDate(
        orgId,
        moment(startDate).format("YYYY-MM-DD"),
        moment(endDate).format("YYYY-MM-DD")
      )
    )
      .then((res) => {
        setRecords(
          res?.soregisters?.map((el, i) => ({
            ...el,
            orderDate: el?.orderDate
              ? moment(el?.orderDate).format("DD-MM-yyyy")
              : null,
            receiptDate: el?.receiptDate
              ? moment(el?.receiptDate).format("DD-MM-yyyy")
              : null,
            dd: el?.dd ? moment(el?.dd).format("DD-MM-yyyy") : "",
          }))
        );
        setPrintData({
          ...res,
          soregisters: res?.soregisters?.map((el, i) => ({
            ...el,
            orderDate: el?.orderDate
              ? moment(el?.orderDate).format("DD-MM-yyyy")
              : null,
            receiptDate: el?.receiptDate
              ? moment(el?.receiptDate).format("DD-MM-yyyy")
              : null,
            dd: el?.dd ? moment(el?.dd).format("DD-MM-yyyy") : "",
          })),
        });
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
            id="date-picker-inline"
            style={{ marginBottom: 8 }}
            label="Start Date"
            value={startDate}
            autoOk
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            onChange={handleChangeStartDate}
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            variant="dialog"
            format="dd/MM/yyyy"
            id="date-picker-inline"
            label="End Date"
            value={endDate}
            autoOk
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            style={{ marginBottom: 8 }}
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

  const printExcel = () => {
    const wb = new Excel.Workbook();
    const reportName = "PD Register - Report";
    const now = moment(new Date()).format("DD-MM-YYYY");
    const time = new Date().toLocaleTimeString();

    const [setStartDate, setEndDate] = [startDate, endDate].map((d) =>
      moment(d).format("DD-MM-YYYY")
    );
    const data = printData?.soregisters?.map((d) => [
      // d.fileNo,
      d.indentorName ?? "-",
      d.supplierName ?? "-",
      d.description ?? "-",
      d.orderNo ?? "-",
      d.orderDate ?? "-",
      d.receiptDate ?? "-",
      d.noOfItems ?? "-",
      d.totalQty ?? "-",
      d.value ?? "-",
      d.dd ?? "-",
      d.section ?? "-",
      d.fileNo ?? "-",
    ]);

    const sheet = wb.addWorksheet("PO Report");

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
        "Indentor",
        "Supplier",
        "Description",
        "SO/PO No",
        "Order Date",
        "Date Received",
        "Item",
        "Qty",
        "Value in (Rs)",
        "Del Date",
        "Section",
        "File No.",
      ],
      ...tableData,
    ];

    sheet.columns = [
      { width: 6 },
      { width: 12 },
      { width: 18 },
      { width: 24 },
      { width: 18 },
      { width: 12 },
      { width: 14 },
      { width: 8 },
      { width: 6 },
      { width: 14 },
      { width: 12 },
    ];

    sheet.addRows(wsData);

  

    ["A1:M1", "A2:M2", "A3:B3", "A4:B4", "A5:M5", "C3:M3", "C4:M4"].forEach(
      (m) => sheet.mergeCells(m)
    );

    ["A1", "A2"].forEach(
      (m) =>
        (sheet.getCell(m).alignment = {
          vertical: "middle",
          horizontal: "center",
        })
    );

    //style for all rows
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

    ["A1", "A2", "A3", "A4"].forEach(
      (e) => (sheet.getCell(e).font = { ...sheet.getCell(e).font, bold: true })
    );

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
      FileSaver.saveAs(blob, `PO Register -${now}.xlsx`);
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
            <Typography
              style={{ fontSize: "0.875rem" }}
              className={classes.card}>
              SO Register
            </Typography>
          </Grid>
        </Grid>
        <br />

        <Grid
          container
          spacing={0}
          alignItems="center"
          className={classes.paper}>
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
        <Grid
          container
          spacing={1}
          alignItems="right"
          style={{ marginTop: "15px" }}>
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
