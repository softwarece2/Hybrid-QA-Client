/** @format */

import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { DialogActions, DialogContent } from "Utils";
import * as yup from "yup";

//material-ui
import {
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/Button";
//icons
import { Close } from "@material-ui/icons";
//pages
import { failedMsg } from "Globals.js";
import { readExcelPD } from "pages/SOModule/ReadExcel/readExcel";
//redux
// import { useSelector } from "react-redux";
const usersSchema = yup.object().shape({
  slNo: yup.string().trim(),

  reference: yup.string(),

  remarks: yup.string(),
});

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



const ImportCheckList = ({
  onClose,
  url,
  refresh,
  onSubmit,
  isLoading,
  columns,
}) => {
  const classes = useStyles();
  let fileInputRef = useRef(null);
  // const user = useSelector((store) => store.loggedInUser);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
    control,
    setValue,
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control,
    name: "users",
  });

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    setLoading(true);
    readExcelPD(file)
      .then((d) => {
        if (Array.isArray(d)) {
          const excelUserData = d;
          if (file.size / 1000 > 1024) {
            toast.info("File size cannot exceed more than 1MB");
          } else {
            const mappedUsers = excelUserData?.map((user, id) => {
              const mappedItem = {};
              columns.forEach((cell) => {
                // if(cell.label===user[cell.label]){
                mappedItem[cell.id] = user[cell.label];
                // }
              });
              return mappedItem;
            });
            console.log(excelUserData, "mappedUsers");
            setValue("users", mappedUsers);
            setSelectedFile(file);
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

  const handleSave = (data) => {
    if (selectedFile) {
      onSubmit(data?.users);
    }
  };

  return (
    <>
      {/* {duplicate && <DuplicateRecord rowData={duplicateRecord} open={true} onClose={()=>{setDuplicate(false)}} headCell={headCell} annexure="Appx F"/>} */}
      <form onSubmit={handleSubmit(handleSave)}>
        <Dialog open maxWidth='md' fullWidth onClose={onClose}>
          <DialogContent dividers style={{ padding: 0, position: "relative" }}>
            <div style={{ marginLeft: 12 }}>
              <input
                ref={(refParam) => (fileInputRef = refParam)}
                type='file'
                style={{ display: "none" }}
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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
                        variant='outlined'
                        size='small'>
                        Browse
                      </Button>
                      &nbsp;
                      {selectedFile ? (
                        <span> {selectedFile.name}</span>
                      ) : (
                        <Typography
                          component={"span"}
                          variant='caption'
                          color='textSecondary'>
                          No file selected.
                        </Typography>
                      )}
                      <IconButton
                        size='small'
                        onClick={() => {
                          setSelectedFile(null);
                          //   reset(isNodal ? defaultValuesNodal : defaultValues);
                        }}>
                        <Close fontSize='small' color='action' />
                      </IconButton>
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </div>
            <TableContainer>
              {loading && <div>Loading..</div>}
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    {columns &&
                      columns?.map((item) => (
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
                        {columns.map((cell) => (
                          <TableCell key={cell.id}>{item[cell.id]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component='div'
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
              variant='contained'
              color='primary'
              onClick={handleSubmit(handleSave)}
              type='submit'
              disabled={isLoading || !selectedFile}>
              {isLoading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}{" "}
              Upload
            </Button>
            <Button variant='contained' color='secondary' onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
};

export default ImportCheckList;
