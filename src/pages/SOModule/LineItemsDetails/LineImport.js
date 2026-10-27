/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button";
import { failedMsg } from "Globals.js";
import React, { useEffect, useRef, useState } from "react";
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

//icons
import { Close } from "@material-ui/icons";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

//color
import { teal } from "@material-ui/core/colors";

//redux
import AutoCompleteNew from "components/AutoCompleteNew";
import { useDispatch, useSelector } from "react-redux";
import { saveLineImportDetails } from "Redux/Actions/SupplyOrder/LineImportAction";

const usersSchema = yup.object().shape({
  saleOrderNo: yup.string().trim(),
  lineItemNo: yup.string().trim(),
  partNo: yup.string().trim(),
  description: yup.string().trim(),
  unitCost: yup.number().typeError("Must be a number"),
  uomName: yup.string().trim(),
  itemCategoryName: yup.string().trim(),
  orderQty: yup.number().typeError("Must be a number"),
  // account: yup.string().trim(),
  // underWarranty: yup.string().trim(),
  // duration: yup.string(),
  // durationTypeStr: yup.string(),
});

const requiredColumns = [
  "Work Order No.",
  "Indent No",
  "Material No./EP Code No.",
  "Material Description",
  "Unit Price",
  "UoM",
  "Item Category",
  "Total Quantity",
  // "Acct",
  // "Under Warranty/ Guarantee",
  // "Warranty Duration",
  // "Warranty (Years/Months/Days)",
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
  { label: "Work Order No.", required: true },
  { label: "Line Item/ Indent Sl No.", required: true },
  { label: "Material No./EP Code No.", required: true },
  { label: "Material Description", required: true },
  { label: "Unit Price", required: true },
  { label: "UoM", required: true },
  { label: "Item Category", required: true },
  { label: "Total Quantity", required: true },
 
];

const LineImport = ({ setIsSubmit }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let fileInputRef = useRef(null);

  const supplyDetails = useSelector((store) => store.soReducer.soBySalesGroup);
  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [open, setOpen] = React.useState(false);
  const [show, setShow] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [supplyOrderId, setSupplyOrderId] = useState([]);
  const [invalidInput, setInvalidInput] = useState(false);
  const [incompleteInput, setIncompleteInput] = useState(false);

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

  });

  const defaultValues = { users: [] };

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
  
    formState: { errors},
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

  useEffect(() => {
    console.log("inside import");
  });

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
          const isValidColumns = requiredColumns.every((el) => el.trim() in excelUserData[0]);
          // if (unitCost === 0) {
          //   toast.info("Unit price should not be zero.");
          //   return null;
          // }
          if (isValidColumns) {
            if (file.size / 1000 > 1024) {
              toast.info("File size cannot exceed more than 1MB");
            } else {
              const mappedUsers = excelUserData?.map((user, id) => ({
                id,
                saleOrderNo: user["Work Order No."],
                lineItemNo: user["Indent No"],
                partNo: user["Material No./EP Code No."],
                description: user["Material Description"],
                unitCost: user["Unit Price"],
                uomName: user["UoM"],
                itemCategoryName: user["Item Category"],
                orderQty: user["Total Quantity"],

                // underWarranty: user["Under Warranty/ Guarantee"],
                // duration: user["Warranty Duration"],
                // durationTypeStr: user["Warranty (Years/Months/Days)"],
              }));

              console.log("mappedUsers", mappedUsers);
              setValue("users", mappedUsers);

              setSelectedFile(file);
            }
          } else {
            toast.info("Invalid format");
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

  useEffect(() => {
    getValues("users").every((ele) => {
      if (Object.keys(ele).some((key) => ele[key] === null || ele[key] === undefined || ele[key] === "")) {
        toast.info("All fields required");
        setIncompleteInput(true);
        return false;
      } else {
        setIncompleteInput(false);
        return true;
      }
    });

  }, [getValues("users")]);

  const handleSave = (data) => {


    console.log("out selectedFile", selectedFile);
    if (selectedFile) {
      console.log("selectedFile", selectedFile);
      const req = data.users.map((user) => {
        return {
          saleOrderNo: user.saleOrderNo,
          lineItemNo: user.lineItemNo,
          partNo: user.partNo,
          description: user.description,
          unitCost: user.unitCost,
          uomName: user.uomName,
          itemCategoryName: user.itemCategoryName,
          orderQty: user.orderQty,
          isImported: "true",
        
          createdBy: loggedInUser?.empId,
        };
      });

      const dataVal = {
        supplyOrderId: supplyOrderId,
        createdBy: loggedInUser?.empId,
        lineItemDtos: req,
      };
      console.log("LI", dataVal);
      setLoading(true);
      dispatch(saveLineImportDetails(dataVal, handleClose, setLoading));
   
    } else {
      toast.error("");
    }
  };



  const resetImport = () => {
    reset(defaultValues);
  };

  return (
    <>
      {/* <Button
        variant="contained"
        color="primary"
        size="small"
        // className={classes.buttonImport}
        endIcon={<CloudDownloadIcon />}
        onClick={(e) => {
          setOpen(true);
        }}
      >
        Import Line Items
      </Button> */}

      {/* {duplicate && <DuplicateRecord rowData={duplicateRecord} open={true} onClose={()=>{setDuplicate(false)}} headCell={headCell} annexure="Appx F"/>} */}
      <form onSubmit={handleSubmit(handleSave)}>
        <Dialog open={open} maxWidth="lg" fullWidth>
          <DialogContent dividers style={{ padding: 0, position: "relative" }}>
            <div style={{ marginLeft: 12 }}>
              <input
                ref={(refParam) => (fileInputRef = refParam)}
                type="file"
                style={{ display: "none" }}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileInput}
                value={""}
              />

              <div className={classes.browseBtnContainer}>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={3} className={classes.autoComplete}>
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
                        <Typography component={"span"} variant="caption" color="textSecondary">
                          No file selected.
                        </Typography>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedFile(null);
                          resetImport();
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
                  {fields?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                    <TableRow key={item.id}>
                      {/* <TableCell style={{ width: "10px" }}>{index + 1}</TableCell> */}
                      <TableCell className={classes.tableCell}>{item.saleOrderNo}</TableCell>
                      <TableCell className={classes.tableCell}>{item.lineItemNo}</TableCell>
                      <TableCell className={classes.tableCell}>{item.partNo}</TableCell>
                      <TableCell className={classes.tableCell}>{item.description}</TableCell>
                      <TableCell className={classes.tableCell}>
                        {item.unitCost}
                        {errors.users && errors.users[index]?.unitCost && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "0.8rem",
                              marginTop: "4px",
                            }}
                          >
                            {errors.users[index].unitCost.message}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className={classes.tableCell}>{item.uomName}</TableCell>
                      <TableCell className={classes.tableCell}>{item.itemCategoryName}</TableCell>
                      <TableCell className={classes.tableCell}>
                        {item.orderQty}
                        {errors.users && errors.users[index]?.orderQty && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "0.8rem",
                              marginTop: "4px",
                            }}
                          >
                            {errors.users[index].orderQty.message}
                          </div>
                        )}
                      </TableCell>

                      {/* <TableCell className={classes.tableCell}>{item.account}</TableCell> */}
                      {/* <TableCell className={classes.tableCell}>{item.underWarranty}</TableCell> */}
                      {/* <TableCell className={classes.tableCell}>{item.duration}</TableCell> */}
                      {/* <TableCell className={classes.tableCell}>{item.durationTypeStr}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
             rowsPerPageOptions={[10, 25, 50, { label: "All", value: fields.length }]}
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
              disabled={loading || incompleteInput || invalidInput}
            >
              {loading && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />} Submit
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

export default LineImport;
