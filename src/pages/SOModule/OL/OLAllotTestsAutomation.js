/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */

import React, { useEffect, useState } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
//material-ui
import {
  CircularProgress,
  Dialog,
  Grid,
  LinearProgress,
  ListItemText,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
// import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { DialogTitle } from "Utils";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";

import { makeStyles } from "@material-ui/core/styles";

//components
import Button from "components/Button";
import MultilineTextField from "components/MultilineTextField";
import TextField from "../../../components/TextField";

//redux
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
//icons
import { teal } from "@material-ui/core/colors";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getTests,
  saveLineItemTests,
  getTestsByLineItemsId,
} from "Redux/Actions/SupplyOrder/LIAction";
import { Autocomplete } from "@material-ui/lab";
import { PaperComponent } from "Utils/D3Tree";
import { Close } from "@material-ui/icons";
import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { useTranslation } from "react-i18next";

// const req = {
//   applicableTestDtos: [
//     {
//       applicableTestId: 1,
//       remarks: "sadasd",
//       olLineItemId: 213,
//       attachmentIds: [1, 2],
//     },
//     {
//       applicableTestId: 2,
//       remarks: "sfsdf",
//       olLineItemId: 213,
//       attachmentIds: [3, 4],
//     },
//   ],
//   olLineItemId: 213,
//   createdBy: "Firm",
// };
const useStyles = makeStyles((theme) => ({
  radioBtn: {
    "& .MuiTypography-body1": {
      fontSize: "0.875rem",
    },
  },
  remarks: {
    width: 600,
    [theme.breakpoints.down("lg")]: {
      width: 400,
    },
  },
  subHeading: {
    fontWeight: 400,
    fontSize: "0.875rem",
  },
  card: {
    maxWidth: "100%",
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "1rem",
  },
  cardContent: {
    textAlign: "left",
    // padding: 16,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
  icon: {
    color: "#ff3000",
    fontSize: "18px",
  },
  buttonProgress: {
    color: "green",
  },
}));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
  },
}))(MenuItem);

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const arraySchema = yup.object().shape({
  testName: yup.object().required("Required").typeError("required"),
});
const schema = yup.object().shape({
  applicableTestsMap: yup.array().of(arraySchema).required("Must have fields"),
});

const defaultArray = () => ({
  id: "",
  testName: "",
  remarks: "",
  images: null,
});

const defaultValues = {
  applicableTestsMap: [defaultArray],
  olLineItemId: 0,
};



export default function OLAllotTestsAutomation({
  open,
  setOpen,
  rowData,
  olNumber,
}) {
 
  const { t } = useTranslation();
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState([]);


  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [data, setData] = useState([]);
  const [selectedFileToUpload, setSelectedFileToUpload] = useState([]);
  const roleId = useSelector((state) => state?.loggedInUser?.roleId);
  const {

    watch,
    handleSubmit,

    reset,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const dispatch = useDispatch();

  const [inputList, setInputList] = useState([
    {
      data: "",
    },
  ]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "applicableTestsMap",
  });

  const onFormSubmit = (data) => {
    // setLoadingDraft(true);
    let formData = new FormData();
    let req = [];
    let count = 0;
    let collectUnique = [];
    let duplicate = false;

    data?.applicableTestsMap?.forEach((el) => {
      for (let j = 0; j < el?.images?.length || 0; j++) {
        if (collectUnique.includes(el?.images[j]?.name)) {
          duplicate = true;
          break;
        } else {
          collectUnique.push(el?.images[j].name);
        }
      }
    });

    if (!duplicate) {
      setLoadingDraft(true);
      data?.applicableTestsMap?.forEach((el) => {
        let newArr = [];
        for (let i = 0; i < el?.images?.length || 0; i++) {
          count += 1;
          newArr.push(count);
          formData.append(
            `attachments`,
            el?.images[i],
            el?.images[i]?.name + "__" + count
          );
        }

        req.push({
          applicableTestId: el.testName.id,
          remarks: el.remarks,
          olLineItemId: rowData?.id,
          attachmentIds: newArr,
        });
      });
      formData.append(
        "applicableTestDtoStr",
        JSON.stringify({
          applicableTestDtos: req,
          olLineItemId: rowData.id,
          createdBy: roleId === 7 ? "Inspector" : "Firm",
        })
      );
      dispatch(saveLineItemTests(formData))
        .then((res) => {
          setLoadingDraft(false);
          getByOlId();
          // setOpen(false);
          reset(defaultValues);
        })
        .catch((err) => {
          console.log(err);
          setLoadingDraft(false);
        })
        .finally(() => {
          setLoadingDraft(false);
        });
    } else {
      toast.error("Remove duplicates files");
    }
    collectUnique.length = 0;
    duplicate = false;
  };

  const fetchLITests = () => {
    setLoading(true);
    getTests()
      .then((data) => {
        console.log("this is function");
        setRecords(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));

    setRecords([]);
  };

  const getByOlId = () => {
    setLoading(true);
    getTestsByLineItemsId(rowData?.id)
      .then((data) => {
        setData(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLITests();
    getByOlId();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleFileChange = (files, index) => {
    const newArr = [];
    const currentFiles = getValues(`applicableTestsMap[${index}].images`) || [];
    for (let i = 0; i < files.length; i++) {
      newArr.push(files[i]);
    }
    setValue(`applicableTestsMap[${index}].images`, [
      ...newArr,
      ...currentFiles,
    ]);
  };
  const deleteFile = (index, name) => {
    const filterFile = watch(`applicableTestsMap[${index}].images`)?.filter(
      (el) => el.name !== name
    );
    setValue(`applicableTestsMap[${index}].images`, filterFile);
  };
  const handleDeleteInspectorFile = (key, name) => {
    console.log(key, name);
    const filterFile = selectedFileToUpload[key].filter(
      (el) => el.name !== name
    );
    setSelectedFileToUpload((ps) => ({ ...ps, [key]: filterFile }));
  };
  const handleDownload = async (name, url) => {
    if (url) {
      const config = {
        method: "GET",
        url: url,
        responseType: "arraybuffer",
      };
      try {
        const response = await axiosInstance(config);
        const outputFilename = `${name || "document"}`;
        const url = URL.createObjectURL(new Blob([response.data]));

        if (response.data.byteLength !== 0) {
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", outputFilename);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          toast.info(t("Data Not Found"));
        }
      } catch (error) {
        console.log(error);
        toast.error(t("Failed to Download"));
      }
      setLoading(false);
    } else {
      toast.error(t("Missing Download Path"));
    }
  };
  const handleUploadImage = (e) => {
    const files = e.target.files;

    const newArr = [];
    for (let i = 0; i < files.length; i++) {
      newArr.push(files[i]);
    }
    const key = e.target.name + "_" + e.target?.attributes?.dataid?.nodeValue;
    const currentFiles = selectedFileToUpload[key] || [];
    setSelectedFileToUpload((ps) => ({
      ...ps,
      [key]: [...newArr, ...currentFiles],
    }));
  };

  const handleSubmitFormRoleInspector = () => {
    let formData = new FormData();
    let req = [];
    let count = 0;
    let collectUnique = [];
    let duplicate = false;

    Object.values(selectedFileToUpload)?.forEach((el) => {
      for (let j = 0; j < el?.length || 0; j++) {
        if (collectUnique.includes(el[j]?.name)) {
          duplicate = true;
          break;
        } else {
          collectUnique.push(el[j]?.name);
        }
      }
    });
    if (!duplicate) {
      setLoadingDraft(true);
      Object.entries(selectedFileToUpload).forEach(([key, value]) => {
        let newArr = [];
        for (let i = 0; i < value.length || 0; i++) {
          count += 1;
          newArr.push(count);
          formData.append(
            `attachments`,
            value[i],
            value[i].name + "__" + count
          );
        }
        console.log(key);
        req.push({
          id: key.split("_")[1],
          applicableTestId: key.split("_")[0],
          olLineItemId: rowData?.id,
          attachmentIds: newArr,
        });
      });

      formData.append(
        "applicableTestDtoStr",
        JSON.stringify({
          applicableTestDtos: req,
          olLineItemId: rowData.id,
          createdBy: "Inspector",
        })
      );
      dispatch(saveLineItemTests(formData))
        .then((res) => {
          setLoadingDraft(false);
          getByOlId();
          // setOpen(false);
          setSelectedFileToUpload({});
          setLoadingDraft(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingDraft(false);
        })
        .finally(() => {
          setLoadingDraft(false);
        });
    } else {
      toast.error("Remove duplicates files");
    }
    collectUnique.length = 0;
    duplicate = false;
  };
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title12" {...props} />
        )}
      >
        <DialogTitle id="draggable-dialog-title12" style={{ cursor: "move" }}>
          OL Number: {olNumber}
        </DialogTitle>
        <DialogContent dividers style={{ padding: 12, position: "relative" }}>
          <div>
            <Grid container spacing={0}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                align="center"
                style={{ margin: "auto", overflowX: "auto" }}
              >
                {roleId === 9 && (
                  <TableContainer style={{ maxHeight: "300px" }}>
                    {loading && <LinearProgress />}
                    <Table
                      style={{
                        position: "relative",
                        border: "1px solid lightgrey",
                      }}
                      size="small"
                      aria-label="simple table"
                      id="data-table-cleanliness-report"
                      stickyHeader
                    >
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell>Sl.No</StyledTableCell>
                          <StyledTableCell>Test</StyledTableCell>
                          <StyledTableCell>Remarks</StyledTableCell>
                          <StyledTableCell>Attach</StyledTableCell>
                          <StyledTableCell>
                            <IconButton
                              color="default"
                              title="Add New Row"
                              size="small"
                              onClick={() => {
                                append(defaultArray);
                              }}
                              disabled={
                                inputList.length + 1 <= records.length
                                  ? false
                                  : true
                              }
                            >
                              <AddCircleIcon style={{ color: "white" }} />
                            </IconButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableHead>

                      <TableBody>
                        {fields?.map((item, index) => (
                          <StyledTableRow key={item.id}>
                            <StyledTableCell className={classes.remarks}>
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                name={`applicableTestsMap[${index}].testName`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Autocomplete
                                    // id="combo-box-demo"
                                    options={records}
                                    onChange={(e, v) => {
                                      e.preventDefault();
                                      onChange(v);
                                      if (v) {
                                        console.log(getValues(), "getValues");
                                        console.log(v);
                                        setValue(
                                          `applicableTestsMap[${index}].id`,
                                          v?.id
                                        );
                                      }
                                    }}
                                    getOptionDisabled={(option) =>
                                      watch("applicableTestsMap").some(
                                        (el) => el.id === option.id
                                      )
                                    }
                                    value={value}
                                    getOptionLabel={(option) => option.testName}
                                    style={{ width: 180 }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        error={
                                          !!errors?.applicableTestsMap?.[index]
                                            ?.testName
                                        }
                                        helperText={
                                          errors?.applicableTestsMap?.[index]
                                            ?.testName?.message
                                        }
                                      />
                                    )}
                                  />
                                )}
                              />
                              {/* <TextField placeholder="112188022156AD" size="small" /> */}
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                name={`applicableTestsMap[${index}].remarks`}
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                  return (
                                    <MultilineTextField
                                      size="small"
                                      style={{ paddingTop: 10, width: 200 }}
                                      onChange={onChange}
                                      value={value}
                                      error={
                                        !!errors?.applicableTestsMap?.[index]
                                          ?.remarks
                                      }
                                      helperText={
                                        errors?.applicableTestsMap?.[index]
                                          ?.remarks?.message
                                      }
                                    />
                                  );
                                }}
                              ></Controller>
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                name={`applicableTestsMap[${index}].images`}
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                  return (
                                    <>
                                      <TextField
                                        size="small"
                                        style={{ paddingTop: 10, width: 200 }}
                                        // value={value}
                                        onChange={(e) => {
                                          // onChange(e.target.files);
                                          handleFileChange(
                                            e.target.files,
                                            index
                                          );
                                        }}
                                        type="file"
                                        multiple="multiple"
                                        inputProps={{ multiple: "multiple" }}
                                      />
                                    </>
                                  );
                                }}
                              ></Controller>
                              <div>
                                {(() => {
                                  const arr = [];
                                  for (
                                    let i = 0;
                                    i <
                                      watch(
                                        `applicableTestsMap[${index}].images`
                                      )?.length || 0;
                                    i++
                                  ) {
                                    arr.push(
                                      <div>
                                        <StyledMenuItem>
                                          <ListItemText
                                            disableTypography
                                            primary={
                                              <Typography variant="body2">
                                                {
                                                  watch(
                                                    `applicableTestsMap[${index}].images`
                                                  )[i]?.name
                                                }
                                              </Typography>
                                            }
                                          />
                                          <IconButton
                                            size="small"
                                            onClick={() => {
                                              deleteFile(
                                                index,
                                                watch(
                                                  `applicableTestsMap[${index}].images`
                                                )[i]?.name
                                              );
                                            }}
                                          >
                                            <Close
                                              fontSize="small"
                                              color="action"
                                            />
                                          </IconButton>
                                        </StyledMenuItem>
                                      </div>
                                    );
                                  }
                                  return arr;
                                })()}
                              </div>
                            </StyledTableCell>

                            <StyledTableCell className={classes.remarks}>
                              {index === 0 ? null : (
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  onClick={() => remove(index)}
                                >
                                  <DeleteIcon className={classes.icon} />
                                </IconButton>
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* {empId !== 9 && ( */}
                <TableContainer style={{ marginTop: roleId === 9 ? 100 : 0 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          rowSpan={roleId === 7 ? 3 : 2}
                          style={{ width: 100 }}
                        >
                          Sl.No
                        </StyledTableCell>
                        <StyledTableCell
                          rowSpan={roleId === 7 ? 3 : 2}
                          className={classes.remarks}
                        >
                          Automation Test
                        </StyledTableCell>
                        <StyledTableCell
                          rowSpan={roleId === 7 ? 3 : 2}
                          className={classes.remarks}
                        >
                          Remarks
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan={roleId === 7 ? 3 : 2}
                          align="center"
                          className={classes.remarks}
                        >
                          Attachments
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell className={classes.remarks}>
                          By Firm
                        </StyledTableCell>
                        <StyledTableCell className={classes.remarks}>
                          By Inspector
                        </StyledTableCell>
                        {roleId === 7 && (
                          <StyledTableCell className={classes.remarks}>
                            Attach More
                          </StyledTableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.applicableTestDtos &&
                      data?.applicableTestDtos.length > 0 ? (
                        data?.applicableTestDtos?.map((input, index) => (
                          <StyledTableRow>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              <Typography className={classes.subHeading}>
                                {input?.testName}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              <Typography className={classes.subHeading}>
                                {input?.remarks}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              {Object.entries(input?.firmAttachmentURLs)?.map(
                                ([key, value]) => (
                                  <React.Fragment key={value}>
                                    <StyledMenuItem>
                                      <ListItemText
                                        disableTypography
                                        onClick={() => {
                                          handleDownload(key, value);
                                        }}
                                        primary={
                                          <Typography variant="body2">
                                            {key}
                                          </Typography>
                                        }
                                      />
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          handleDownload(key, value);
                                        }}
                                      >
                                        <GetAppIcon />
                                      </IconButton>
                                    </StyledMenuItem>
                                  </React.Fragment>
                                )
                              )}
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              {Object.entries(
                                input?.inspectorAttachmentURLs
                              )?.map(([key, value]) => (
                                <React.Fragment key={value}>
                                  <StyledMenuItem>
                                    <ListItemText
                                      disableTypography
                                      onClick={() => {
                                        handleDownload(key, value);
                                      }}
                                      style={{ maxWidth: 200 }}
                                      primary={
                                        <Typography
                                          variant="body2"
                                          style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                          title={key}
                                        >
                                          {key}
                                        </Typography>
                                      }
                                    />
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        handleDownload(key, value);
                                      }}
                                    >
                                      <GetAppIcon />
                                    </IconButton>
                                  </StyledMenuItem>
                                </React.Fragment>
                              ))}
                            </StyledTableCell>
                            {roleId === 7 && (
                              <StyledTableCell className={classes.remarks}>
                                <TextField
                                  name={input.applicableTestId}
                                  type="file"
                                  inputProps={{
                                    dataId: input.id,
                                    multiple: "multiple",
                                  }}
                                  onChange={(e) => {
                                    handleUploadImage(e);
                                  }}
                                />
                                {selectedFileToUpload[
                                  input?.applicableTestId + "_" + input?.id
                                ]?.map((el, index) => (
                                  <div key={index}>
                                    <StyledMenuItem>
                                      <ListItemText
                                        disableTypography
                                        primary={
                                          <Typography
                                            variant="body2"
                                            style={{
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                            }}
                                            title={el?.name}
                                          >
                                            {el?.name}
                                          </Typography>
                                        }
                                        style={{ maxWidth: 200 }}
                                      />
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          handleDeleteInspectorFile(
                                            input?.applicableTestId +
                                              "_" +
                                              input?.id,
                                            el?.name
                                          );
                                        }}
                                      >
                                        <Close
                                          fontSize="small"
                                          color="action"
                                        />
                                      </IconButton>
                                    </StyledMenuItem>
                                  </div>
                                ))}
                              </StyledTableCell>
                            )}
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={6} align="center">
                            No Records To display
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* )} */}
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          {roleId === 9 ? (
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={handleSubmit(onFormSubmit)}
              disabled={record.length !== 0}
            >
              {loadingDraft && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                  color="primary"
                />
              )}
              &nbsp; Submit
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleSubmitFormRoleInspector();
              }}
              disabled={
                Object.values(selectedFileToUpload).length === 0 || loadingDraft
              }
              variant="contained"
              color="secondary"
            >
              {loadingDraft && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                  color="primary"
                />
              )}
              Submit
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            type="submit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
