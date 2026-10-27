/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogActions, DialogContent } from "Utils";

//material-ui
import {
  Typography,
  IconButton,
  TableBody,
  TableCell,
  Table,
  TableHead,
  TableRow,
  TablePagination,
  TableContainer,
  Dialog,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { teal } from "@material-ui/core/colors";
import Button from "components/Button";
import {  Close } from "@material-ui/icons";
import { readExcelPD } from "../../../../../SOModule/ReadExcel/readExcel";
import { failedMsg } from "Globals.js";
import { saveISIBMain } from "Redux/Actions/Enclosure/EnclosureISIBAction";

const usersSchema = yup.object().shape({
  slNo: yup.string().trim(),

  reference: yup.string(),

  remarks: yup.string(),
});
const requiredColumns = ["S.No", "Applicable checks"];

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
  browse: {
    padding: "12px 0px 8px 4px",
  },
}));

const headCell = [
  { label: "S.No", required: true },
  { label: "Applicable checks", required: true },
  { label: "Remarks", required: false },
];

const ISIBImport = ({ open, setOpen, idVal }) => {
  const classes = useStyles();
  let fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [duplicateRecord, setDuplicateRecord] = useState([]);

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
    users: yup
      .array()
      .of(usersSchema)
      .min(1),
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
          console.log("excelUserData", excelUserData[0]);
          const isValidColumns = requiredColumns.every((el) => el.trim() in excelUserData[0]);

          if (isValidColumns) {
            if (file.size / 1000 > 1024) {
              toast.info("File size cannot exceed more than 1MB");
            } else {
              const mappedUsers = excelUserData?.map((user, id) => ({
                id,
                slNo: user["S.No"],
                reference: user["Applicable checks"],
                remarks: user["Remarks"],
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
          return innerEl.slNo === el.slNo;
        }
      })
    );

    if (isDuplicate) {
      toast.warn("Duplicate is present in excel");
      return;
    }
    console.log("out selectedFile", selectedFile);
    if (selectedFile) {
      console.log("selectedFile", data.users);
      const value = {
        id: idVal,
        offerLetterId: 1,
        createdBy: 1,
        modifiedBy: 1,
        inspectedBy: 1,
        signedBy: 1,
        inspPhyIbDetDtos: data.users?.map((item) => ({
          id: item.id,
          slNo: item.slNo,
          checklistId: item.checklistId,
          remarks: item.remarks,
        })),
      };

      const userList = data?.users;
      saveISIBMain(value)
        .then((data) => {
          if (data === true) {
            toast.success("Saved Successfully");
            reset();
            setSelectedFile(null);
            setOpen(false);

            // refresh();
            // onClose();
          } else {
            // refresh();
            toast.info(data.message, {
              style: { minWidth: 600 },
              position: "bottom-left",
              autoClose: false,
              closeButton: true,
            });
            // toast.warn(JSON.stringify(data.data),{style:{minWidth:600},position:"bottom-left",autoClose:false,closeButton:true});
            setDuplicate(true);
            setDuplicateRecord(userList.filter((item) => Object.keys(data?.data)?.includes(item?.orderNo)));
          }
        })
        .catch((e) => {
          console.log(e);
          toast.error("Failed to upload!");
        });
    }
  };

  return (
    <>
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
                  <Grid item xs={12} className={classes.browse}>
                    <Typography>
                      <Button
                        onClick={() => {
                          fileInputRef.click();
                        }}
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
                  {fields?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                    <TableRow key={item.id}>
                      {/* <TableCell style={{ width: "10px" }}>{index + 1}</TableCell> */}
                      <TableCell className={classes.tableCell}>{item.slNo}</TableCell>
                      <TableCell className={classes.tableCell}>{item.reference}</TableCell>
                      <TableCell className={classes.tableCell}>{item.remarks}</TableCell>
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
            <Button variant="contained" color="primary" onClick={handleSubmit(handleSave)} type="submit">
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

export default ISIBImport;
