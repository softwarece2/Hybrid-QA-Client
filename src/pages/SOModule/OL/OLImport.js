/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import { ExcelDateToJSDate, failedMsg } from "Globals.js";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { readExcelPD } from "../ReadExcel/readExcel";
import { WING_ID } from "../../../Globals";
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
import Button from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { getConsignee } from "Redux/Actions/Inspect/InspectOLAction";
import { getLvlOfInsp } from "Redux/Actions/SupplyOrder/OLAction";
import { saveOLImportDetails } from "Redux/Actions/SupplyOrder/OLImportAction";
import { getAllSaleOrderList } from "Redux/Actions/SupplyOrder/SaleOrderAction";
import { getAllSaleOrderDetails } from "Redux/Actions/SupplyOrder/SOAction";
import { SELECTED_SO_ID } from "Redux/Types";
// import { getAllSaleOrderDetails } from "Redux/Actions/SupplyOrder/SaleOrderAction";

const usersSchema = yup.object().shape({
  offerLetterNo: yup.string().trim(),
  soLineItemNo: yup.string().trim(),
  offeredQty: yup.string().trim(),
  issueLevel: yup.string().trim(),
  priority: yup.string().trim(),
  offerDate: yup.string(),
});

const requiredColumns = ["OL Number", "Line Item Number", "Qty Offered", "Issue Level", "Priority", "Offered Date"];

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
  { label: "OL Number", required: true },
  { label: "Line Item Number", required: true },
  { label: "Qty Offered", required: true },
  { label: "Issue Level", required: true },
  { label: "Priority", required: true },
  { label: "Offered Date", required: true },
];

const OLImport = ({ setIsSubmit }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let fileInputRef = useRef(null);

  const supplyDetails = useSelector((store) => store.soReducer.soBySalesGroup);
  const saleOrderList = useSelector((store) => store.soReducer.saleOrders);
  const consigneeDetails = useSelector((store) => store.inspectOLReducer.consigneeBySO);
  const lvlOfInspDetails = useSelector((store) => store.inspectOLReducer.lvlOfInsp);

  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [supplyOrderId, setSupplyOrderId] = useState([]);

  const [consigneeId, setConsigneeId] = useState([]);

  const [saleOrderId, setSaleOrderId] = useState([]);


 
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

  const defaultValues = { users: [] };

  const schema = yup.object().shape({
    users: yup
      .array()
      .of(usersSchema)
      .min(1),
    // supplyOrderId: yup
    //   .string()
    //   .typeError("required")
    //   .required("Please select the required field"),
    // saleOrderNo: yup
    //   .string()
    //   .typeError("required")
    //   .required("Please select the required field"),
    // consigneeId: yup
    //   .string()
    //   .typeError("required")
    //   .required("Please select the required field"),
  });

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

  // useEffect(() => {
  //   dispatch(getAllSaleOrderDetails);
  // }, []);

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
          if (isValidColumns) {
            if (file.size / 1000 > 1024) {
              toast.info("File size cannot exceed more than 1MB");
            } else {
              const mappedUsers = excelUserData?.map((user, id) => ({
                id,
                offerLetterNo: user["OL Number"],
                soLineItemNo: user["Line Item Number"],
                offeredQty: user["Qty Offered"],
                issueLevel: user["Issue Level"],
                priority: user["Priority"],
                offerDate: moment(ExcelDateToJSDate(user["Offered Date"])).format("DD-MM-yyyy"),
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
          return innerEl.soLineItemNo === el.soLineItemNo;
        }
      })
    );

    if (isDuplicate) {
      toast.warn("Duplicate Offering Letter Details is present in excel");
      return;
    }
    console.log("out selectedFile", selectedFile);
    if (selectedFile) {
      const req = data.users.map((user) => {
        return {
          offerLetterNo: user.offerLetterNo,
          soLineItemNo: user.soLineItemNo,
          offeredQty: user.offeredQty,
          issueLevel: user.issueLevel,
          priority: user.priority,
          offerDate: moment(user.offerDate, "DD-MM-yyyy").format("yyyy-MM-DD"),
        };
      });
   
      const dataVal = {
        saleOrderNo: saleOrderId,
        consigneeId: consigneeId,
        inspectionLevelId: getValues("lvlOfInspId"),
        employeeId: loggedInUser?.empId,
        olLineItemDtos: req,
      };
      dispatch(saveOLImportDetails(dataVal, supplyOrderId, handleClose, setLoading));

      // .then((data) => {
      // if (res === true) {
      //   reset();
      //   setSelectedFile(null);
      //   setOpen(false);
      //   setIsSubmit(true);
      //   // refresh();
      //   // onClose();
      // } else {
      //   // refresh();
      //   // toast.warn(JSON.stringify(data.data),{style:{minWidth:600},position:"bottom-left",autoClose:false,closeButton:true});
      //   setDuplicate(true);
      //   setDuplicateRecord(userList.filter((item) => Object.keys(res?.data)?.includes(item?.orderNo)));
      // }
      // }
      // .catch((e) => {
      //   console.log(e);
      //   toast.error("Failed to upload!");
      // });
    }
  };
  const fetchSaleOrders = (id) => {
    if (id !== undefined) {
      dispatch({
        type: SELECTED_SO_ID,
        payload: id,
      });
      dispatch(getAllSaleOrderDetails(id));
    }
  };

  const fetchConsignee = (id) => {
    if (id !== undefined) {
      dispatch(getConsignee(id));
    }
  };

  useEffect(() => {
    dispatch(getAllSaleOrderList());
    dispatch(getLvlOfInsp());
  }, []);

  const resetImport = () => {
    reset(defaultValues);
  };


  return (
    <>
      <Button
        variant="contained"
        color="primary"
        // size="small"
        // className={classes.buttonImport}
        endIcon={<CloudDownloadIcon />}
        onClick={(e) => {
          setOpen(true);
        }}
      >
        Import {isArmy ? "QACL" : "OL"}
      </Button>

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
              />

              <div className={classes.browseBtnContainer}>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} className={classes.autoComplete}>
                    <Controller
                      name="supplyOrderId"
                      control={control}
                      render={({ field: { onChange, value, ...props } }) => (
                        <AutoCompleteNew
                          data={supplyDetails}
                          required
                          value={value}
                          labelText="Enter/ Search Supply Order"
                          getOptionLabel={(o) => o.orderNo}
                          onChange={(e, v) => {
                            onChange(v);
                            setSupplyOrderId(v?.id);
                            fetchSaleOrders(v?.id);
                            fetchConsignee(v?.id);
                          }}
                          // error={!!errors.supplyOrderId}
                          // helperText={errors.supplyOrderId?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} className={classes.autoComplete}>
                    <Controller
                      name="saleOrderNo"
                      control={control}
                      render={({ field: { onChange, value, ...props } }) => (
                        <AutoCompleteNew
                          data={saleOrderList}
                          required
                          labelText="Enter/ Search Sale Order"
                          getOptionLabel={(o) => o.saleOrderNo}
                          onChange={(e, v) => {
                            if (v === null) {
                              setShow(true);
                            } else {
                              setShow(false);
                            }
                            onChange(v);
                            setSaleOrderId(v?.id);
                          }}
                          // error={!!errors.saleOrderNo}
                          // helperText={errors.saleOrderNo?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} className={classes.autoComplete}>
                    <Controller
                      name="consigneeId"
                      control={control}
                      render={({ field: { onChange, value, ...props } }) => (
                        <AutoCompleteNew
                          data={consigneeDetails}
                          required
                          labelText="Enter/ Search Consignee "
                          getOptionLabel={(o) => o.name}
                          onChange={(e, v) => {
                            if (v === null) {
                              setShow(true);
                            } else {
                              setShow(false);
                            }
                            onChange(v);
                            setConsigneeId(v?.id);
                          }}
                          // error={!!errors.consigneeId}
                          // helperText={errors.consigneeId?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} className={classes.autoComplete}>
                    <Controller
                      name="lvlOfInspId"
                      control={control}
                      render={({ field: { onChange, value, ...props } }) => (
                        <AutoCompleteNew
                          data={lvlOfInspDetails}
                          required
                          value={lvlOfInspDetails?.find((item) => item?.id == value) || ""}
                          labelText="Enter/ Search Level of Inspection"
                          getOptionLabel={(o) => o.name}
                          onChange={(e, v) => {
                            onChange(v?.id);
                          }}
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
                        className={classes.browseBtn}
                        disabled={show}
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
                      <TableCell className={classes.tableCell}>{item.offerLetterNo}</TableCell>
                      <TableCell className={classes.tableCell}>{item.soLineItemNo}</TableCell>
                      <TableCell className={classes.tableCell}>{item.offeredQty}</TableCell>
                      <TableCell className={classes.tableCell}>{item.issueLevel}</TableCell>
                      <TableCell className={classes.tableCell}>{item.priority}</TableCell>
                      <TableCell className={classes.tableCell}>{item.offerDate}</TableCell>
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

export default OLImport;
