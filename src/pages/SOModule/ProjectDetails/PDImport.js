import { yupResolver } from "@hookform/resolvers/yup";
import { failedMsg } from "Globals.js";
import React, { useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { readExcelPD } from "../ReadExcel/readExcel";

//material ui
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import Button from "components/Button";

//icons
import { Close } from "@material-ui/icons";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

//color
import { teal } from "@material-ui/core/colors";

//redux
import AutoCompleteNew from "components/AutoCompleteNew";
import { useDispatch, useSelector } from "react-redux";
import { savePDImportDetails } from "Redux/Actions/SupplyOrder/PDImportAction";

const usersSchema = yup.object().shape({
  name: yup.string().trim(),
  shipNo: yup.string().trim(),
  itemCategory: yup.string().trim(),
  saleOrderNo: yup.string().trim(),
});

const requiredColumns = [
  "Detailed Nomenclature",
  "R.F/EST.No.",
  "Warrant No.",
  "Work Order No.",
];

const required = <span style={{ color: "red" }}>*</span>;
const useStyles = makeStyles((theme) => ({
  browseBtnWrapper: {
    border: "1px solid",
    borderColor: teal[100],
    borderRadius: "4px",
    display: "inline-block",
    borderBlockStyle: "ridge",
    minWidth: 300,
  },
  browseBtnContainer: {
    display: "flex",
    alignItems: "center",
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
  autoComplete: {
    padding: "12px 8px 8px 4px",
  },
  browse: {
    padding: "12px 0px 8px 4px",
  },
  buttonProgress: {
    color: "white",
  },
}));

const headCell = [
  { label: "Detailed Nomenclature", required: true },
  { label: "R.F/EST.No.", required: true },
  { label: "Warrant No.", required: true },
  { label: "Work Order No.", required: true },
];

const PDImport = ({ onClose, refresh, selectedOrgGroup }) => {
  const classes = useStyles();
  let fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const supplyDetails = useSelector((store) => store.soReducer.soBySalesGroup);
  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [supplyOrderId, setSupplyOrderId] = useState([]);
  const [show, setShow] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setOpen(false);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const schema = yup.object().shape({
    users: yup.array().of(usersSchema).min(1),
    // supplyOrderId: yup
    // .string()
    // .typeError("required")
    // .required("Please select the required field"),
  });

  const defaultValues = { users: [] };

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control,
    name: "users",
  });

  console.log("errors", errors);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    // reset(defaultValues);
    setLoading(true);

    readExcelPD(file)
      .then((d) => {
        console.log("excelUserData d", d);
        if (Array.isArray(d)) {
          const excelUserData = d;
          console.log("excelUserData", excelUserData);
          const isValidColumns = requiredColumns.every(
            (el) => el.trim() in excelUserData[0]
          );
          if (isValidColumns) {
            if (file.size / 1000 > 1024) {
              toast.info("File size cannot exceed more than 1MB");
            } else {
              const mappedUsers = excelUserData?.map((user, id) => ({
                id,
                projectName: user["Detailed Nomenclature"],
                shipNo: user["R.F/EST.No."],
                categoryName: user["Warrant No."],
                saleOrderNo: user["Work Order No."],
              }));
              console.log("mappedUsers", mappedUsers);
              setValue("users", mappedUsers);
              setSelectedFile(file);
            }
          } else {
            toast.info("In-valid format");
          }
        } else {
          setSelectedFile(null);
          toast.error(failedMsg);
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to read file!");
      })
      .finally(() => setLoading(false));
  };
  console.log("values", getValues());

  const handleSave = (data) => {
    const isDuplicate = data.users.some((el, i) =>
      data.users.some((innerEl, j) => {
        if (i === j) {
          return false;
        } else {
          return innerEl.saleOrderNo === el.saleOrderNo;
        }
      })
    );

    if (isDuplicate) {
      toast.warn("Duplicate Sale Order Details is present in excel");
      return;
    }
    console.log("out selectedFile", selectedFile);
    if (selectedFile) {
      console.log("selectedFile", selectedFile);
      const req = data?.users.map((user) => {
        return {
          projectName: user.projectName,
          shipNo: user.shipNo,
          categoryName: user.categoryName,
          saleOrderNo: user.saleOrderNo,
        };
      });
     
      const dataVal = {
        empId: loggedInUser?.empId,
        supplyOrderId: supplyOrderId,
        dataDtos: req,
      };
      console.log("PD", dataVal);
      dispatch(savePDImportDetails(dataVal, handleClose, setLoading));
      
    }
  };

 

  const resetImport = () => {
    reset(defaultValues);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        // className={classes.buttonImport}
        endIcon={<CloudDownloadIcon />}
        onClick={(e) => {
          setOpen(true);
        }}
      >
        Import SO-WO mapping
      </Button>
      {/* {duplicate && <DuplicateRecord rowData={duplicateRecord} open={true} onClose={()=>{setDuplicate(false)}} headCell={headCell} annexure="Appx F"/>} */}
      <form onSubmit={handleSubmit(handleSave)}>
        <Dialog open={open} maxWidth="md" fullWidth>
          <DialogContent dividers style={{ padding: 0, position: "relative" }}>
            <div style={{ marginLeft: 12 }}>
              <input
                ref={(refParam) => (fileInputRef = refParam)}
                type="file"
                style={{ display: "none" }}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileInput}
              />

              <div className={classes.browseBtnContainer}>
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    className={classes.autoComplete}
                  >
                    <Controller
                      name="supplyOrderId"
                      control={control}
                      render={({ field: { onChange, value, ...props } }) => (
                        <AutoCompleteNew
                          data={supplyDetails}
                          required
                          labelText="Enter/ Search Supply Order"
                          getOptionLabel={(o) => o.orderNo}
                          onChange={(e, v) => {
                            console.log("vvvvgh", v);
                            if (v === null) {
                              setShow(true);
                            } else {
                              setShow(false);
                            }
                            onChange(v);
                            setSupplyOrderId(v?.id);
                          }}
                          // error={!!errors.supplyOrderId}
                          // helperText={errors.supplyOrderId?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.browse}>
                    <Typography>
                      <Button
                        onClick={() => {
                          fileInputRef.click();
                        }}
                        disabled={show}
                        className={classes.browseBtn}
                        variant="outlined"
                        size="small"
                      >
                        Browse
                      </Button>
                      &nbsp;
                      {selectedFile ? (
                        <span> {selectedFile.name}</span>
                      ) : (
                        <Typography
                          component={"span"}
                          variant="caption"
                          color="textSecondary"
                        >
                          No file selected.
                        </Typography>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedFile(null);
                          resetImport();
                          //   reset(isNodal ? defaultValuesNodal : defaultValues);
                        }}
                      >
                        <Close fontSize="small" color="action" />
                      </IconButton>
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </div>

            <TableContainer>
              {loading && <div>Loading..</div>}
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {headCell &&
                      headCell.map((item) => (
                        <TableCell className={classes.tableCell}>
                          {item.label}
                          {item.required ? required : ""}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {fields
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((item, index) => (
                      <TableRow key={item.id}>
                        {/* <TableCell style={{ width: "10px" }}>{index + 1}</TableCell> */}
                        <TableCell className={classes.tableCell}>
                          {item.projectName}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {item.shipNo}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {item.categoryName}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {item.saleOrderNo}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={fields.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(handleSave)}
              type="submit"
              disabled={loading}
            >
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                  color="primary"
                />
              )}
              Submit
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
};

export default PDImport;
