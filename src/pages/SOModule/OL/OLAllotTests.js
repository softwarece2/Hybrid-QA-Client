/** @format */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useEffect, useState } from "react";
//material-ui
import {
  Checkbox,
  CircularProgress,
  Dialog,
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
import AddIcon from "@material-ui/icons/Add";
import PublishIcon from "@material-ui/icons/Publish";
// import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { DialogTitle } from "Utils";

import { makeStyles } from "@material-ui/core/styles";

//components
import Button from "components/Button";
import MultilineTextField from "components/MultilineTextField";
import TextField from "../../../components/TextField";

//redux
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
//icons
import { teal } from "@material-ui/core/colors";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
import { useDispatch, useSelector } from "react-redux";

import { Close } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { toast } from "react-toastify";
import { saveLineItemTests } from "Redux/Actions/SupplyOrder/LIAction";
import { PaperComponent } from "Utils/D3Tree";

import axiosInstanceMaster from "pages/Services/AxiosInstance";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";

import { getAllActiveAppTestBySalesGrpId } from "pages/Services/URLs";




import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import axios from "axios";
import { VIRTUALQA_API_MCP } from "config";
import WebCam from "meet";
// import { TOGGLE_RI } from "Redux/Types";
import VideoInspection from "video/cv2";

import ManualTMR from "./TMR/ManualTMR";
import ColdTest from "excel-upload/ColdTest";
import SightPeriScope from "pages/SightPeriScope";


import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";
import { OPEN_RI } from "Redux/Types";



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
  isAte: false,
  isRmt: false,
  remarks: "",
  images: null,
});

const defaultValues = {
  applicableTestsMap: [defaultArray],
  olLineItemId: 0,
};

export default function OLAllotTests({ open, setOpen, rowData, olNumber, productId, olId, offerLetterId, applicableTestDtos }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const roleId = loggedInUser?.roleId;
  const departmentId = loggedInUser?.departmentId;

  const isExaminerQc = roleId === USER_ROLE_ID.ROLE_EXAMINER && departmentId === DEPARTMENT_ID.QC;

  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [data, setData] = useState([]);
  const [selectedFileToUpload, setSelectedFileToUpload] = useState([]);
  // const [selectedFileToUploadReport, setSelectedFileToUploadReport] = useState(
  //   []
  // );

  const [testId, setTestId] = useState(false);
  const [openCam, setOpenCam] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [openUpload, setOpenUpload] = useState(false);
  const [selectedUploadRow, setSelectedUploadRow] = useState(null);

  const [productData, setProductData] = useState([]);
  const [productDataLogin1, setProductDataLogin1] = useState([]);
  const [productDataLogin2, setProductDataLogin2] = useState([]);
  const [error, setError] = useState(null);

  const sales_group_id = useSelector((state) => state?.loggedInUser?.salesGrpId);
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
          formData.append(`attachments`, el?.images[i], el?.images[i]?.name + "__" + count);
        }

        req.push({
          applicableTestId: el.testName.id,
          isAte: el.isAte,
          isRmt: el.isRmt,
          remarks: el.remarks,
          olLineItemId: rowData?.id,
          attachmentIds: newArr,
        });
      });
      // console.log(req,rowData,data,'req....')
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
    axiosInstanceMaster(getAllActiveAppTestBySalesGrpId + sales_group_id)
      .then(({ data }) => {
        setRecords(data || []);
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  const getByOlId = async () => {
    if (productId) {
      setLoading(true);
      try {
        const endpoint = "spec/getStdOrtApplicableTests";
        const url = `${endpoint}?olLineItemId=${rowData?.id}&productId=${productId}`;

        const { data } = await axiosInstanceAte.get(url);

        const combinedTests = [...(data?.applicableTestDtos || []), ...(data?.stdProdctTest || [])];
        console.log(combinedTests, "djd");

        setData(combinedTests);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please map the Product");
    }
  };

  useEffect(() => {
    getByOlId();
  }, []);

  useEffect(() => {
    if (rowData) {
      fetchLITests();
    }
  }, [rowData?.id]);

  const fetchRunAte = (input) => {
    console.log(input);
    axiosInstance("run/execute/" + input.id)
      .then((data) => {
        console.log("this is function");
      })
      .catch((e) => {
        console.log(e);
        console.log("Hitting Service");
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstanceAte(`/spec/getSpecsByProdId/${productId}`);
        // Separate the data based on logInId
        const login1Data = response?.data.filter((item) => item.logInId === 1);
        const login2Data = response?.data.filter((item) => item.logInId === 2);
        setProductDataLogin1(login1Data);
        setProductDataLogin2(login2Data);
        // setProductData(response.data);

        // setProduct10Data(login1Data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstanceAte(`/spec/getProductTestDet/${productId}`);

        setProductData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  // const fetchAllTestValues = async () => {
  //   try {
  //     const { data } = await axiosInstanceAte("/teleAssault/getTeleAssaultRecDashDet/10");
  //     const deviceIds = data?.map(item => item.devId);
  //     const devId = deviceIds && deviceIds.length > 0 ? deviceIds[0] : null;
  //     console.log(devId,"uusi");
  //     setDevId(devId);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };
  // useEffect(() => {
  //   fetchAllTestValues();
  // }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (files, index) => {
    const newArr = [];
    const currentFiles = getValues(`applicableTestsMap[${index}].images`) || [];
    for (let i = 0; i < files.length; i++) {
      newArr.push(files[i]);
    }
    setValue(`applicableTestsMap[${index}].images`, [...newArr, ...currentFiles]);
  };
  const deleteFile = (index, name) => {
    const filterFile = watch(`applicableTestsMap[${index}].images`)?.filter((el) => el.name !== name);
    setValue(`applicableTestsMap[${index}].images`, filterFile);
  };

  // const deleteReport = (name) => {
  //   const filterFile = selectedFileToUploadReport.filter(
  //     (el) => el.name !== name
  //   );
  //   setSelectedFileToUploadReport(filterFile);
  // };
  const handleDeleteInspectorFile = (key, name) => {
    console.log(key, name);
    const filterFile = selectedFileToUpload[key].filter((el) => el.name !== name);
    setSelectedFileToUpload((ps) => ({ ...ps, [key]: filterFile }));
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

  // const handleUploadReport = (e) => {
  //   try {
  //     const files = e.target.files;
  //     const newArr = [];
  //     for (let i = 0; i < files.length; i++) {
  //       newArr.push(files[i]);
  //     }
  //     setSelectedFileToUploadReport((ps) => [...ps, ...newArr]);
  //   } catch (error) {
  //     console.log("svcd");
  //   }
  // };

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
          formData.append(`attachments`, value[i], value[i].name + "__" + count);
        }
        console.log(key);
        req.push({
          id: key.split("_")[1],
          applicableTestId: key.split("_")[0],
          isAte: true,
          isRmt: true,
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

  const [openManualTMR, setOpenManualTMR] = useState(false);
  const [mcpApiUser, setMcpApiUser] = useState(false);

  useEffect(() => {
    handelLogin();
  }, []);

  const handelLogin = async () => {
    const formData = new FormData();
    formData.append("username", "admin");
    formData.append("password", "Admin@123");
    formData.append("grant_type", "password");
    formData.append("scope", "");
    formData.append("client_id", "string");
    formData.append("client_secret", "string");

    await axios({
      method: "post",
      url: `${VIRTUALQA_API_MCP}/token/`,
      data: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then((res) => {
      setMcpApiUser(res.data);
      axios.get(VIRTUALQA_API_MCP + "/registeruser/verify/" + res.data?.access_token).then((res) => {
        toast.success("Api Login Successfully");
      });
    });
  };

  function handleCloseVideo() {
    setOpenDialog(false);
  }

  return (
    <>
      {openManualTMR && (
        <ManualTMR onClose={() => setOpenManualTMR(false)} rowData={rowData} olNumber={olNumber} selectedUploadRow={selectedUploadRow} />
      )}

      
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Dialog open={open} maxWidth="lg" fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title12" {...props} />}>
          <DialogTitle id="draggable-dialog-title12" style={{ cursor: "move" }}>
            Submission Slip No.: {olNumber}
          </DialogTitle>
          <DialogContent dividers style={{ padding: 12, position: "relative" }}>
            {isExaminerQc && (
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
                      {/* <StyledTableCell>Sl.No</StyledTableCell> */}
                      <StyledTableCell>Test</StyledTableCell>
                      <StyledTableCell>ATE</StyledTableCell>
                      <StyledTableCell>Remote</StyledTableCell>
                      <StyledTableCell>Remarks</StyledTableCell>
                      <StyledTableCell>Attach Files</StyledTableCell>
                      {/* <StyledTableCell>TMR</StyledTableCell> */}
                      <StyledTableCell>
                        <IconButton
                          color="default"
                          title="Add New Row"
                          size="small"
                          onClick={() => {
                            append(defaultArray);
                          }}
                        >
                          <AddCircleIcon style={{ color: "white" }} />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    {fields?.map((item, index) => (
                      <StyledTableRow key={item.id}>
                        {/* <StyledTableCell className={classes.remarks}>
                              {index + 1}
                            </StyledTableCell> */}
                        <StyledTableCell className={classes.remarks}>
                          <Controller
                            name={`applicableTestsMap[${index}].testName`}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Autocomplete
                                // id="combo-box-demo"
                                options={records || []}
                                onChange={(e, v) => {
                                  e.preventDefault();
                                  onChange(v);
                                  if (v) {
                                    console.log(getValues(), "getValues");
                                    console.log(v);
                                    setValue(`applicableTestsMap[${index}].id`, v?.id);
                                  }
                                }}
                                getOptionDisabled={(option) => watch("applicableTestsMap").some((el) => el.id === option.id)}
                                value={value}
                                getOptionLabel={(option) => option.testName}
                                style={{ width: 180 }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    error={!!errors?.applicableTestsMap?.[index]?.testName}
                                    helperText={errors?.applicableTestsMap?.[index]?.testName?.message}
                                  />
                                )}
                              />
                            )}
                          />
                          {/* <TextField placeholder="112188022156AD" size="small" /> */}
                        </StyledTableCell>
                        <StyledTableCell className={classes.remarks}>
                          <Controller
                            name={`applicableTestsMap[${index}].isAte`}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Checkbox
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                                inputProps={{
                                  "aria-label": "primary checkbox",
                                }}
                              />
                            )}
                          />
                          {/* <TextField placeholder="112188022156AD" size="small" /> */}
                        </StyledTableCell>
                        <StyledTableCell className={classes.remarks}>
                          <Controller
                            name={`applicableTestsMap[${index}].isRmt`}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Checkbox
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                                inputProps={{
                                  "aria-label": "primary checkbox",
                                }}
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
                                  style={{ width: 200 }}
                                  onChange={onChange}
                                  value={value}
                                  error={!!errors?.applicableTestsMap?.[index]?.remarks}
                                  helperText={errors?.applicableTestsMap?.[index]?.remarks?.message}
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
                                    style={{ width: 230 }}
                                    // value={value}
                                    onChange={(e) => {
                                      // onChange(e.target.files);
                                      handleFileChange(e.target.files, index);
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
                              for (let i = 0; i < watch(`applicableTestsMap[${index}].images`)?.length || 0; i++) {
                                arr.push(
                                  <div>
                                    <StyledMenuItem>
                                      <ListItemText
                                        disableTypography
                                        primary={
                                          <Typography variant="body2">{watch(`applicableTestsMap[${index}].images`)[i]?.name}</Typography>
                                        }
                                      />
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          deleteFile(index, watch(`applicableTestsMap[${index}].images`)[i]?.name);
                                          // setOpenCam(true);
                                          // setSelectedUploadRow(input);
                                        }}
                                        variant="contained"
                                        // onClick={(e) => {
                                        //   setOpenCam(true);
                                        //   setSelectedUploadRow(input);
                                        //   // if (
                                        //   //   !(
                                        //   //     input.applicableTestId ===
                                        //   //       24 ||
                                        //   //     input.applicableTestId === 25
                                        //   //   )
                                        //   // ) {
                                        //   //   fetchRunAte(input);
                                        //   // }
                                        // }}
                                      >
                                        <Close fontSize="small" color="action" />
                                      </IconButton>
                                    </StyledMenuItem>
                                  </div>
                                );
                              }
                              return arr;
                            })()}
                          </div>
                        </StyledTableCell>

                        {/* <StyledTableCell className={classes.remarks}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => setOpenAtr(true)}
                          >
                            Create TMR
                          </Button>
                        </StyledTableCell> */}

                        <StyledTableCell className={classes.remarks}>
                          {index === 0 ? null : (
                            <IconButton aria-label="delete" size="small" onClick={() => remove(index)}>
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

            {isExaminerQc && (
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={handleSubmit(onFormSubmit)}
                  disabled={record.length !== 0}
                >
                  {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} />}
                  &nbsp; Submit
                </Button>
              </div>
            )}
            {/* {empId !== 9 && ( */}
            <TableContainer style={{ marginTop: isExaminerQc ? 10 : 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell rowSpan={roleId === 7 || roleId === 17 ? 3 : 2} style={{ width: 100 }}>
                      Sl.No
                    </StyledTableCell>
                    <StyledTableCell rowSpan={roleId === 7 || roleId === 17 ? 3 : 2} className={classes.remarks}>
                      Applicable Test
                    </StyledTableCell>
                    <StyledTableCell rowSpan={roleId === 7 || roleId === 17 ? 3 : 2} className={classes.remarks}>
                      ATE
                    </StyledTableCell>
                    <StyledTableCell rowSpan={roleId === 7 || roleId === 17 ? 3 : 2} className={classes.remarks}>
                      RMT
                    </StyledTableCell>
                    <StyledTableCell rowSpan={roleId === 7 || roleId === 17 ? 3 : 2} className={classes.remarks}>
                      Remarks
                    </StyledTableCell>
                    <StyledTableCell colSpan={roleId === 7 || roleId === 17 ? 3 : 2} align="center" className={classes.remarks}>
                      Attachments
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell className={classes.remarks}>By Firm</StyledTableCell>
                    <StyledTableCell className={classes.remarks}>By Inspector</StyledTableCell>
                    {(roleId === 7 || roleId === 17) && <StyledTableCell className={classes.remarks}>Attach More</StyledTableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data?.length > 0 ? (
                    data?.map((input, index) => (
                      <StyledTableRow>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell className={classes.remarks}>
                          <Typography className={classes.subHeading}>{input?.testName || input?.proudctName}</Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography className={classes.subHeading}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              {input?.isAteStr === "Yes" || input?.logInId ? (
                                <>
                                  {/* <Button
                                    size="small"
                                    style={{
                                      backgroundColor: "green",
                                      color: "white",
                                    }}
                                    variant="contained"
                                    onClick={(e) => {
                                      setOpenCam(true);
                                      setSelectedUploadRow(input);
                                      if (
                                        !(
                                          input.applicableTestId === 24 ||
                                          input.applicableTestId === 25
                                        )
                                      ) {
                                        fetchRunAte(input);
                                      }
                                    }}
                                  >
                                    Run ATE/RI
                                  </Button> */}
                                  <Button
                                    size="small"
                                    style={{
                                      backgroundColor: "green",
                                      color: "white",
                                    }}
                                    variant="contained"
                                    onClick={(e) => {
                                      setOpenCam(true);
                                      setSelectedUploadRow(input);
                                      if (!(input?.applicableTestId === 24 || input?.applicableTestId === 25)) {
                                        fetchRunAte(input);
                                      }
                                    }}
                                  >
                                    Run RI
                                  </Button>

                                  <Button
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    startIcon={<PublishIcon />}
                                    onClick={(e) => {
                                      setOpenUpload(true);
                                      setSelectedUploadRow(input);
                                    }}
                                  >
                                    Report
                                  </Button>
                                </>
                              ) : null}
                              {!input?.logInId ? (
                                <Button
                                  size="small"
                                  color="primary"
                                  variant="contained"
                                  startIcon={<AddIcon />}
                                  onClick={() => {
                                    console.log(input);
                                    if (input?.applicableTestId === 17) {
                                      setOpenManualTMR(true);
                                    } else {
                                      setOpenManualTMR(true);
                                    }
                                    setSelectedUploadRow(input);
                                  }}
                                >
                                  TMR
                                </Button>
                              ) : null}
                              {input?.isAteStr !== "Yes" && input?.applicableTestId === 23 && (
                                <Button
                                  size="small"
                                  color="primary"
                                  variant="contained"
                                  startIcon={<PublishIcon />}
                                  onClick={(e) => {
                                    setOpenUpload(true);
                                    setSelectedUploadRow(input);
                                  }}
                                >
                                  Report
                                </Button>
                              )}
                              {!input?.logInId ? (
                                <Button
                                  size="small"
                                  style={{
                                    backgroundColor: "blue",
                                    color: "white",
                                  }}
                                  startIcon={<VideocamOutlinedIcon />}
                                  variant="contained"
                                  onClick={(e) => {
                                    setOpenDialog(true);
                                    dispatch({ type: OPEN_RI });
                                  }}
                                >
                                  Video
                                </Button>
                              ) : null}
                            </div>
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell className={classes.remarks}>
                          <Typography className={classes.subHeading}>{input?.isRmtStr}</Typography>
                        </StyledTableCell>
                        <StyledTableCell className={classes.remarks}>
                          <Typography className={classes.subHeading}>{input?.remarks}</Typography>
                        </StyledTableCell>
                        <StyledTableCell className={classes.remarks}>
                          {/* {Object.entries(input?.firmAttachmentURLs)?.map(
                            ([key, value]) => (
                              <React.Fragment key={value}>
                                <StyledMenuItem>
                                  <ListItemText
                                    disableTypography
                                    onClick={() => {
                                      handleDownload(key, value);
                                    }}
                                    style={{ maxWidth: 150 }}
                                    primary={
                                      <Typography
                                        variant="body2"
                                        style={{
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
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
                            )
                          )} */}
                        </StyledTableCell>
                        <StyledTableCell className={classes.remarks}>
                          {/* {Object.entries(input?.inspectorAttachmentURLs)?.map(
                            ([key, value]) => (
                              <React.Fragment key={value}>
                                <StyledMenuItem>
                                  <ListItemText
                                    disableTypography
                                    onClick={() => {
                                      handleDownload(key, value);
                                    }}
                                    style={{ maxWidth: 100 }}
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
                            )
                          )} */}
                        </StyledTableCell>
                        {(roleId === 7 || roleId === 17) && (
                          <StyledTableCell className={classes.remarks}>
                            <TextField
                              name={input?.applicableTestId}
                              type="file"
                              inputProps={{
                                dataId: input?.id,
                                multiple: "multiple",
                              }}
                              onChange={(e) => {
                                handleUploadImage(e);
                              }}
                            />
                            {selectedFileToUpload[input?.applicableTestId + "_" + input?.id]?.map((el, index) => (
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
                                    style={{ maxWidth: 100 }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      handleDeleteInspectorFile(input?.applicableTestId + "_" + input?.id, el?.name);
                                    }}
                                  >
                                    <Close fontSize="small" color="action" />
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
                        No Record To display
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* )} */}
          </DialogContent>

          <DialogActions>
            {roleId !== 9 && (
              <Button
                onClick={() => {
                  handleSubmitFormRoleInspector();
                }}
                disabled={Object.values(selectedFileToUpload).length === 0 || loadingDraft}
                variant="contained"
                color="secondary"
              >
                {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} />}
                Submit
              </Button>
            )}

            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </form>

      {openUpload && (
        <UploadDialog
          setOpenUpload={setOpenUpload}
          selectedUploadRow={selectedUploadRow}
          rowData={rowData}
          productId={productId}
          productDataLoginWise={selectedUploadRow?.logInId === 1 ? productDataLogin1 : productDataLogin2}
          devId={rowData?.id}
          olId={olId}
        />
      )}
      {openCam && (
        <Dialog open maxWidth={"lg"} fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title14" {...props} />}>
          <DialogTitle id="draggable-dialog-title14" onClose={() => setOpenCam(false)} style={{ cursor: "move" }}>
            {!(selectedUploadRow?.applicableTestId === 24 || selectedUploadRow?.applicableTestId === 25)
              ? "Video Cam"
              : selectedUploadRow?.testName}
          </DialogTitle>
          <DialogContent>
            {/* 
         {selectedUploadRow?.applicableTestId === 1 && <Tvnem1 user={mcpApiUser} />}
         {selectedUploadRow?.applicableTestId === 2 && <Tvnem2 user={mcpApiUser} />}
         {selectedUploadRow?.applicableTestId === 6 && <Tvnem3 user={mcpApiUser} />} */}
          </DialogContent>
        </Dialog>
      )}
      {openCam && (
        <Dialog open maxWidth={"lg"} fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title14" {...props} />}>
          <DialogTitle id="draggable-dialog-title14" onClose={() => setOpenCam(false)} style={{ cursor: "move" }}>
            {!(selectedUploadRow?.applicableTestId === 24 || selectedUploadRow?.applicableTestId === 25)
              ? "Video Cam"
              : selectedUploadRow?.testName}
          </DialogTitle>
          <DialogContent>
            {!(selectedUploadRow?.applicableTestId === 24 || selectedUploadRow?.applicableTestId === 25) && (
              <WebCam rowData={rowData} selectedUploadRow={selectedUploadRow} olNumber={olNumber} />
            )}

            {/* {selectedUploadRow?.applicableTestId === 1 && <MechanicalTest user={mcpApiUser} />}
            {selectedUploadRow?.applicableTestId === 2 && <ElectricalTest user={mcpApiUser} />}
            {selectedUploadRow?.applicableTestId === 6 && <OpticalTest user={mcpApiUser} />}
            {selectedUploadRow?.applicableTestId === 24 && <FrequencyBitesTest rowData={rowData} selectedUploadRow={selectedUploadRow} />}
            {selectedUploadRow?.applicableTestId === 25 && <ACdCTest rowData={rowData} selectedUploadRow={selectedUploadRow} />} */}
          </DialogContent>
        </Dialog>
      )}
      {openDialog && (
        <Dialog
          aria-labelledby="manage-table-columns"
          open
          maxWidth="lg"
          fullWidth
          PaperComponent={(props) => <PaperComponent id="draggable-dialog-title12" {...props} />}
        >
          <DialogTitle id="draggable-dialog-title12" style={{ fontSize: "12px", cursor: "move" }}>
            Video Inspection
          </DialogTitle>
          <DialogContent>
            {/* <Typography>Under Development</Typography> */}
            {/* {toggleRI && (
              <Widget
                onClose={() => {
                  dispatch({ type: TOGGLE_RI });
                }}
                title="Video Inspection"
              >
                {" "} */}
            <VideoInspection olNumber={olNumber} lineItemNo={rowData?.soLineItemNo} />
            {/* </Widget>
            )} */}
          </DialogContent>
          <DialogActions>
            <Button size="small" variant="contained" color="secondary" onClick={() => handleCloseVideo()}>
              close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

const UploadDialog = ({ setOpenUpload, selectedUploadRow, rowData, productId, productDataLoginWise, devId, olId }) => {
  const handleClose = () => {
    setOpenUpload(false);
  };

  const RenderContent1 = () => {
    if (!productId) return null;

    switch (productId) {
      // case 15:
      case 16:
        return <ColdTest isHotTest={selectedUploadRow.applicableTestId === 16} selectedUploadRow={selectedUploadRow} rowData={rowData} />;
      case 19:
      case 27:
      case 28:
        return <SightPeriScope selectedUploadRow={selectedUploadRow} rowData={rowData} />;
      case 91:
      case 29:
      case 30:
        return <SightPeriScope selectedUploadRow={selectedUploadRow} rowData={rowData} final />;
      
          
      default:
        return <Typography align="center">TMR upload of the {selectedUploadRow.testName} is under progress</Typography>;
    }
  };

  return (
    <Dialog
      open={true}
      maxWidth={selectedUploadRow?.applicableTestId === 32 || selectedUploadRow?.applicableTestId === 34 ? "xl" : "lg"}
      fullWidth
      PaperComponent={(props) => <PaperComponent id="draggable-dialog-title14" {...props} />}
    >
      <DialogTitle id="draggable-dialog-title14" onClose={handleClose} style={{ cursor: "move", height: "15px" }}>
        {selectedUploadRow?.testName}
      </DialogTitle>
      <DialogContent>{RenderContent1()}</DialogContent>
      {/* <DialogActions>
        <Button variant="contained" color="secondary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};
