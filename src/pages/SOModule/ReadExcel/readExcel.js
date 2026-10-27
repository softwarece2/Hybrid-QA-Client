import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const EXCEL_ROW_MAX = 1000;

export const readExcel = (file) => {
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    if (!file.type || file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      toast.info("Import file must be a valid Excel file");
      reject("File must be a valid Excel file");
      return;
    }

    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      const bufferArray = e.target.result;

      const wb = XLSX.read(bufferArray, { type: "buffer" });

      const wsname = wb.SheetNames[0];

      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { range: 1 });
      // const filteredData = data.filter((el) => Object.keys(el).length > 4);
      if (data.length > EXCEL_ROW_MAX) {
        toast.warn("No. of rows should not be greater than" + EXCEL_ROW_MAX + " in excel file");
        reject("No. of rows should not be greater than" + EXCEL_ROW_MAX + " in excel file");
      }
      resolve(data);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  return promise;
};

export const readExcelPD = (file) => {
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    if (!file.type || file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      toast.info("Import file must be a valid Excel file");
      reject("File must be a valid Excel file");
      return;
    }

    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      const bufferArray = e.target.result;

      const wb = XLSX.read(bufferArray, { type: "buffer" });

      console.log("buffer", wb);

      const wsname = wb.SheetNames[0];

      const ws = wb.Sheets[wsname];
      console.log("sheet data", ws);

      const data = XLSX.utils.sheet_to_json(ws);
      console.log("data", data);
      // const filteredData = data.filter((el) => Object.keys(el).length > 4);
      if (data.length > EXCEL_ROW_MAX) {
        toast.warn("No. of rows should not be greater than" + EXCEL_ROW_MAX + " in excel file");
        reject("No. of rows should not be greater than" + EXCEL_ROW_MAX + " in excel file");
      }
      resolve(data);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  return promise;
};
