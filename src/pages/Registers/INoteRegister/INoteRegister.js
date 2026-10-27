/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

//material-ui
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GetAppIcon from "@material-ui/icons/GetApp";

//components
import Button from "components/Button";
import TableComponent from "components/table";
import { WING_ID } from "../../../Globals";
//excel
import Excel from "exceljs";
import FileSaver from "file-saver";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
//redux

import { useDispatch, useSelector } from "react-redux";
import { getInoteRegisters} from "Redux/Actions/SupplyOrder/RegistersAction";
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
    "&.ant-upload-list-text .ant-upload-list-item-name .ant-upload-list-picture .ant-upload-list-item-name": {
      fontSize: "1.2rem !important",
    },
    "&.ant-upload-list-text .ant-upload-list-item-card-actions .ant-upload-list-picture .ant-upload-list-item-card-actions": {
      fontSize: "1.2rem",
    },
  },
}));


export default function INoteRegister() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orgId = useSelector((store) => store.loggedInUser?.orgId);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printData, setPrintData] = React.useState([]);

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [startDate, setStartDate] = useState(
    `${moment(new Date())
      .subtract(1, "M")
      .format("YYYY-MM-DD")}`
  );
  const [endDate, setEndDate] = useState(moment(new Date()).format("YYYY-MM-DD"));

  
  const [columns] = useState([
    {
      title: "Sl. No",
      field: "slNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "Inspection note no./ File No",
      field: "fileNo",
      width: "auto",
      filtering: true,
      render: (rowData) => (
        <>
          {rowData.inoteNo}
          <br />
          {rowData.fileNo}
        </>
      ),
    },
    {
      title: "I-Note Date/ Del Date",
      field: "inoteDate",
      width: "auto",
      filtering: true,
      render: (rowData) => (
        <>
          {rowData.inoteDate}
          <br />
          {rowData.dd}
        </>
      ),
    },
    {
      title: "SO/PO No",
      field: "orderNo",
      width: "auto",
      filtering: true,
    },
    {
      title: "SO/PO Date",
      field: "orderDate",
      width: "auto",
      filtering: false,
    },
    {
      title: "Indentor",
      field: "indenter",
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
      field: "qty",
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
      title: "Del Type",
      field: "deliveryType",
      width: "auto",
      filtering: false,
    },
    {
      title: "Description",
      field: "description",
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
      title: "Division",
      field: "division",
      width: "auto",
      filtering: false,
    },
    {
      title: isArmy ? "QACL No. & date" : "OL No. & date",
      field: "olNumber",
      width: "400",
      filtering: false,
      render: (rowData) => (
        <span>
          {rowData.olNumber}
          <br />
          <span style={{ whiteSpace: "pre" }}>{moment(rowData.olDate).format("DD-MM-YYYY")}</span>
        </span>
      ),
    },
  ]);

  const getData = () => {
    setLoading(true);
    dispatch(getInoteRegisters(orgId, moment(startDate).format("YYYY-MM-DD"), moment(endDate).format("YYYY-MM-DD")))
      .then((res) => {
        setRecords(
          res?.inoteRegisterItemDtos.map((el, i) => ({
            ...el,
            slNo: i + 1,
            orderDate: el?.orderDate ? moment(el?.orderDate).format("DD-MM-yyyy") : null,
            inoteDate: el?.inoteDate ? moment(el?.inoteDate).format("DD-MM-yyyy") : null,
            dd: el?.dd ? moment(el?.dd).format("DD-MM-yyyy") : "",
          }))
        );
        setPrintData(
          // ...res,
          {
            ...res,
            inoteRegisterItemDtos: res?.inoteRegisterItemDtos.map((el, i) => ({
              ...el,
              orderDate: el?.orderDate ? moment(el?.orderDate).format("DD-MM-yyyy") : null,
              inoteDate: el?.inoteDate ? moment(el?.inoteDate).format("DD-MM-yyyy") : null,
              dd: el?.dd ? moment(el?.dd).format("DD-MM-yyyy") : "",
            })),
          }
        );
      })

      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));

    // }
  };

  console.log("printData", printData);
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
        // <TextField
        //   label="Start Date"
        //   style={{ minWidth: "200px" }}
        //   placeholder="Start Date"
        //   onChange={handleChangeStartDate}
        //   inputProps={{
        //     max: moment(new Date()).format("YYYY-MM-DD"),
        //   }}
        //   InputLabelProps={{
        //     shrink: true,
        //   }}
        //   value={moment(startDate).format("YYYY-MM-DD")}
        //   type="date"
        //   size="small"
        //   required
        // />
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
        // <TextField
        //   style={{ minWidth: "200px", marginBottom: "10px" }}
        //   label="End Date"
        //   placeholder="End Date"
        //   onChange={handleChangeEndDate}
        //   inputProps={{
        //     max: moment(startDate).add(12, "months").format("YYYY-MM-DD"),
        //     min: moment(startDate).format("YYYY-MM-DD"),
        //     shrink: true,
        //   }}
        //   InputLabelProps={{
        //     shrink: true,
        //   }}
        //   disabled={!startDate}
        //   value={moment(endDate).format("YYYY-MM-DD")}
        //   type="date"
        //   size="small"
        //   required
        // />
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
    const reportName = "I-Note Register - Report";
    const now = moment(new Date()).format("DD-MM-YYYY");
    const time = new Date().toLocaleTimeString();

    const [setStartDate, setEndDate] = [startDate, endDate].map((d) => moment(d).format("DD-MM-YYYY"));
    // const [totalINotes, noOfItems, totalQty, totalValue, ADSN] = [totalINotes, noOfItems, totalQty, totalValue, ADSN].map((d) => [
    //   d.totalINotes ?? "-",
    //   d.noOfItems ?? "-",
    //   d.totalQty ?? "-",
    //   d.totalValue ?? "-",
    //   d.ADSN ?? "-",
    // ]);

    const data = printData?.inoteRegisterItemDtos?.map((d) => [
      // d.fileNo,
      `${d.inoteNo} \n${d.fileNo}` ?? "-",
      `${d.inoteDate} \n${d.dd}` ?? "-",
      d.orderNo ?? "-",
      d.orderDate ?? "-",
      d.indenter ?? "-",
      d.noOfItems ?? "-",
      d.qty ?? "-",
      d.value ?? "-",
      d.deliveryType ?? "-",
      d.description ?? "-",
      d.section ?? "-",
      d.division ?? "-",
      `${d.olNumber} \n${d.olDate}` ?? "-",
    ]);

    const sheet = wb.addWorksheet("I-Note Report");

    const tableData = data.map((r, i) => [i + 1, ...r]);
    // records.forEach((record) => {
    //   const tableData = columns.map((column) => record[column.field]);
    //   sheet.addRow(tableData);
    // });
    const sbuWiseData = Object.keys(printData?.inoteValueMap)?.map((key) => [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      `Value of ${key}`,
      null,
      printData?.inoteValueMap[key],
    ]);

    const wsData = [
      [reportName],
      [`Report generated on: ${now} , ${time}`],
      ["From Date", null, setStartDate],
      ["To Date", null, setEndDate],
      [null],
      [
        "Sl. No",
        "Inspection note no./ File No",
        "I-Note Date/ Del Date",
        "SO/PO No",
        "SO/PO Date",
        "Indentor",
        "Item",
        "Qty",
        "Value in (Rs)",
        "Del Type",
        "Description",
        "section",
        "Division",
        "OL No. & date",
      ],
      ...tableData,
      [null],
      [
        `No of I-NOTES: ${printData?.totalINotes}`,
        null,
        null,
        `Total No of Items: ${printData?.noOfItems}`,
        null,
        null,
        `Total Qty: ${printData?.totalQty}`,
        null,
        null,
        null,
        `I-Notes Value Rs. in Crores: ${printData?.totalValue}`,
      ],
      [null],
      [null, null, null, null, null, null, null, null, null, null, "All Values in Crores of Rupees"],
      ...sbuWiseData,
    ];

    sheet.columns = [
      { width: 6 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
      { width: 12 },
      { width: 10 },
      { width: 6 },
      { width: 6 },
      { width: 18 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
    ];

    sheet.addRows(wsData);

    const lengthSBU = Object.keys(printData?.inoteValueMap)?.length;
   

    const mergeCell1 = tableData.length + 8;
    const mergeCell2 = tableData.length + 10;
    const mergeCell3 = tableData.length + 11 + lengthSBU;

    [
      "A1:N1",
      "A2:N2",
      "A3:B3",
      "A4:B4",
      "A5:N5",
      "C3:N3",
      "C4:N4",
      `A${mergeCell1}:C${mergeCell1}`,
      `D${mergeCell1}:F${mergeCell1}`,
      `G${mergeCell1}:J${mergeCell1}`,
      `K${mergeCell1}:N${mergeCell1}`,
      `K${mergeCell2}:N${mergeCell2}`,
    ].forEach((m) => sheet.mergeCells(m));

    let valueCells = [];
    for (let i = 1; i <= lengthSBU; i++) {
      const cellNum = mergeCell2 + i;
      valueCells.push(`K${cellNum}:L${cellNum}`);
      valueCells.push(`M${cellNum}:N${cellNum}`);
    }
    valueCells?.forEach((m) => sheet.mergeCells(m));

    ["A1", "A2"].forEach(
      (m) =>
        (sheet.getCell(m).alignment = {
          vertical: "middle",
          horizontal: "center",
        })
    );

    //bold
    [6, mergeCell1, mergeCell2].forEach((r) => {
      sheet.getRow(r).font = { ...sheet.getRow(r).font, bold: true };
    });

    sheet.eachRow(function(row, rowNumber) {
      row.eachCell((cell, colNumber) => {
        if (rowNumber > mergeCell2 && rowNumber < mergeCell3) {
          sheet.getRow(rowNumber).font = {
            ...sheet.getRow(rowNumber).font,
            bold: true,
          };
        }
      });
    });

    // range(1, 4, 18).forEach(
    //   (c) =>
    //     (sheet.getColumn(c).alignment = {
    //       vertical: "middle",
    //       horizontal: "center",
    //     })
    // );

    ["A1", "A2", "A3", "A4"].forEach((e) => (sheet.getCell(e).font = { ...sheet.getCell(e).font, bold: true }));

    sheet.eachRow(function(row, rowNumber) {
      row.eachCell((cell, colNumber) => {
        if (
          (rowNumber > 5 && rowNumber < tableData.length + 7) ||
          rowNumber === mergeCell1 ||
          rowNumber === mergeCell2 ||
          (rowNumber > mergeCell2 && rowNumber < mergeCell3)
        ) {
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

    //style for all rows
    const last = sheet.rowCount;
    for (let i = 6; i <= last; i++) {
      sheet.getRow(i).alignment = { wrapText: true };
    }

    wb.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, `I-Note Register -${now}.xlsx`);
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
              I-Note Register
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
