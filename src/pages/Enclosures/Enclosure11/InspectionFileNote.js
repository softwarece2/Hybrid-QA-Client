/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import { restrict } from "restrict";
//import css
import "./InspectionFileNote.css";
//material-ui
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableRow,
  Typography,
  withStyles,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../../../components/TextField";
import { WING_ID } from "../../../Globals";

//components
import { faAngleLeft, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import InspectionViewOL from "./InspectionViewOL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectItem } from "Redux/Actions/SelectTreeItem";

import InspFileNoteOL from "pages/InspectorModule/OLInspector/InspFileNoteOL";
import useTable, { StyledTableCell } from "../../../components/UseTable";
import AddCircleIcon from "@material-ui/icons/AddCircle";

//hooks
import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@material-ui/icons";
import Loader from "Loader";
import AutoCompleteNew from "components/AutoCompleteNew";
import moment from "moment";
import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import {
  getAllActiveEmpsOfOrg,
  getAllActiveEmpsOfOrgn,
  getFileNote,
  getFileNoteApproval,
  getFileNoteById,
  saveInspectionFileV2,
  updateInspctionFileNoteV2,
} from "pages/Services/URLs";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

//icons
import { faCheckCircle } from "@fortawesome/fontawesome-free-solid";
import GetAppIcon from "@material-ui/icons/GetApp";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import ReactToPrint from "react-to-print";
import { USER_ROLE_ID } from "../../../Globals";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ActionButton from "components/ActionButton";
import ConcessionTable from "../Enclosure13/ConcessionTable";
import HologramForm from "./HologramForm";
import FileNoteTable from "./FileNoteTable";

const useStyles = makeStyles((theme) => ({
  printImage: {
    display: "none",
    "@media print": {
      display: "block",
      height: "100px",
    },
  },
  acceptColor: {
    "&.Mui-selected": {
      color: "black",
      backgroundColor: "#B1E9AF",
    },

    "&:hover": {
      backgroundColor: "#B1E9AF !important",
      color: "black",
    },
  },
  rejectColor: {
    "&.Mui-selected": {
      backgroundColor: "#E9AFAF",
      color: "black",
    },
    "&:hover": {
      backgroundColor: "#E9AFAF !important",
      color: "black",
    },
  },
  leftRoot: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    minWidth: 80,
    fontSize: 12,
    padding: 5,
  },
  rightRoot: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    minWidth: 80,
    fontSize: 12,
    padding: 5,
  },
  tableCell: {
    border: "1px solid black",
  },
  tableCellLabel: {
    border: "1px solid black",
    fontWeight: 600,
  },
  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
    border: "1px solid black",
    position: "relative",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  mt3: {
    marginTop: "20px",
  },
  hide: {
    display: "none",
    color: theme.palette.primary.contrastText,
  },
  index: {
    width: 150,
    border: "1px solid black",
    fontWeight: 600,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  buttonProgress: {
    color: "white",
  },
}));

const typeofDelivary = [
  { id: 1, title: "Part Supply" },
  { id: 2, title: "Further Part Supply" },
  { id: 3, title: "Final Supply" },
  { id: 4, title: "Full Supply" },
];

const headCells = [
  { id: "claimId", label: "SL.No", align: "left", disableSorting: true },
  {
    id: "claimStatus",
    label: "DESCRIPTION",
    align: "left",
    disableSorting: true,
  },
];

let defaultValues = {
  id: null,
  offerLetterId: null,
  createdBy: null,
  createdDatetime: null,
  olNumber: null,
  olDate: null,
  projectDescription: null,
  fileNumber: null,
  noteNo: null,
  supplyOrderNo: null,
  supplyOrderDate: null,
  originalDeliverydate: null,
  totalLineItemsPo: null,
  totalValueLineItemsPo: null,
  totalInotesCcIssued: null,
  completedLotSize: null,
  noLineItemsSupplied: null,
  noLineItemsOl: null,
  valueOfferedOl: null,
  noLineItemsClrdOl: null,
  valueClrdOl: null,
  inspectorName: null,
  inspectorDesignation: null,
  qapRef: null,
  inspDocVerify: false,
  inspElec: false,
  inspEt: false,
  inspFats: false,
  inspPdi: false,
  inspPhysical: false,
  inspEss: false,
  inspEmiEmc: false,
  inspEndurance: false,
  inspectionStartDate: null,
  inspectionCompleteDate: null,
  inspectorRemrks: null,
  acqaoRemarks: null,
  dcqaoRemarks: null,
  jcqaoRemarks: null,
  extendedDd1: null,
  extendedDd2: null,
  isFormalDd1: null,
  isFormalDd2: null,
  latestDdExtendedVide: null,
  lotSizeOriginal: null,
  lotSizeAmmended1: null,
  lotSizeAmmended2: null,
  typeOfDelivery: null,
  empId: null,
  cqaoApprovalDate: null,
  approvedBy: null,
};

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
  },
}))(MenuItem);

export default function InspectionFileNote({ olIds, soId, fileNoteId, checkEditAccess }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchFlag, setSearchFlag] = React.useState(null);
  const user = useSelector((store) => store.loggedInUser);

  const [approvedBy, setApprovedBy] = useState(1);
  const [olStatus, setOlStatus] = useState(1);
  const [record, setRecord] = useState([]);
  const [empList, setEmpList] = useState([]);

  const [records, setRecords] = useState({});
  const [nxtApprover, setNxtApprover] = useState(null);
  const [count, setCount] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [saveDraft, setSaveDraft] = React.useState(false);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [isremark, SetIsRemark] = useState(false);
  const [isRemarkEditable, setIsRemarkEditable] = useState(false);
  const [remarkList, SetRemarkList] = useState([]);
  const [designation, setDesignation] = useState(null);
  const [remarkerr, SetRemarkErr] = useState(false);
  const [displayDate, setDisplayDate] = useState(false);
  const [searchFlagErr, setFlagErr] = useState({ state: false, msg: null });
  const printref = useRef(null);
  const [openConsession, setOpenConsession] = useState(false);
  const [openDilg, setOpenDilg] = useState(false);
  const [ids, setIds] = useState([]);
  const [appvrDate, setAppvrDate] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFileQap, setSelectedFileQap] = useState([]);
  const [isAcceptSelected, setIsAcceptSelected] = useState(false);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const hasEditAccess = checkEditAccess ? remarkList.some((el) => el.nextApproverId === loggedInUser?.empId) : true;

  const hasEditAccessInspector = checkEditAccess ? records?.createdBy === loggedInUser?.empId : true;

  console.log(checkEditAccess, hasEditAccessInspector, fileNoteId, "123288");

  const schema = yup.object().shape({
    olNumber: yup
      .string()
      .trim()
      .typeError(`${isArmy ? "QACL" : "OL"} Number is require`)
      .required(`${isArmy ? "QACL" : "OL"} Number is required`),
    olDate: yup.date().required(`${isArmy ? "QACL" : "OL"} Date is required`),
    projectDescription: yup.string().trim().typeError("Project Description  is required").required("Project Description is required"),
    fileNumber: yup.string().trim().typeError("File Number is required").required("File Number is required"),
    noteNo: yup.string().typeError("Note No is required").required("Note No is required"),
    supplyOrderNo: yup.string().trim().typeError("Supply Order No is required").required("Supply Order No is required"),
    supplyOrderDate: yup.date().typeError("Supply Order Date is required").required("Supply Order Date is required"),
    originalDeliverydate: yup.string().typeError("Original Delivery Date is required").required("Original Delivery Date is required"),
    totalLineItemsPo: yup.string().typeError("Total Line Items Po is required").required("Total Line Items Po is required"),
    totalValueLineItemsPo: yup.string().typeError("Total Value Line Item Po is required").required("Total Value Line Item Po is required"),
    totalInotesCcIssued: yup.string().typeError("Total I note CC issued is required").required("Total I note CC issued is required"),
    completedLotSize: yup.string().typeError("Completed Lot Size is required").required("Completed Lot Size is required"),
    noLineItemsSupplied: yup.string().typeError("No Line Items Supplied is required").required("No Line Items Supplied is required"),
    noLineItemsOl: yup
      .string()
      .typeError(`No Line Item ${isArmy ? "QACL" : "OL"}  is required`)
      .required(`No Line Item ${isArmy ? "QACL" : "OL"}  is required`),
    valueOfferedOl: yup
      .string()
      .typeError(`Value Offered ${isArmy ? "QACL" : "OL"}  is required`)
      .required(`Value Offered ${isArmy ? "QACL" : "OL"}  is required`),
    noLineItemsClrdOl: yup
      .string()
      .typeError(`No Line Item Clrd ${isArmy ? "QACL" : "OL"}  is required`)
      .required(`No Line Item Clrd ${isArmy ? "QACL" : "OL"}  is required`),
    valueClrdOl: yup
      .string()
      .typeError(`Value of Clrd ${isArmy ? "QACL" : "OL"}  is required`)
      .required(`Value of Clrd ${isArmy ? "QACL" : "OL"}  is required`),
    inspectorName: yup.string().typeError("Inspector Name is required").required("Inspector Name is required"),
    inspectorDesignation: yup.string().typeError("Inspector Designation is required").required("Inspector Designation is required"),
    qapRef: yup.string().typeError("Qap Ref is required").required("Qap Ref is required"),
    inspDocVerify: yup.boolean(),
    inspElect: yup.boolean(),
    inspEt: yup.boolean(),
    inspFats: yup.boolean(),
    inspPdi: yup.boolean(),
    inspPhysical: yup.boolean(),
    inspEss: yup.boolean(),
    inspEmiEmc: yup.boolean(),
    inspEndurance: yup.boolean(),
    inspectionStartDate: yup.string().typeError("Inspection Start Date is required").required("Inspection Start Date is required"),
    inspectionCompleteDate: yup.string().typeError("Inspction Complete Date is required").required("Inspction Complete Date is required"),
    lotSizeOriginal: yup.string().typeError("lot Size Original is required").required("lot Size Original is required"),
    typeOfDelivery: yup.string().typeError("Type of Delivery is required").required("Type of Delivery is required"),
    empId: yup
      .object()
      .shape()
      .nullable()
      .when("obsSts", (obsSts) => {}),
    approvedBy: yup.object().shape().nullable().required("Signatory required").typeError("Signatory required"),
  });

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { TblPagination, recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);

  const setAllData = (data) => {
    const allData = {
      ...data,
      isFormalDd1: data.isFormalDd1 === null ? "" : `${data.isFormalDd1 ? "true" : "false"}`,
      isFormalDd2: data.isFormalDd2 === null ? "" : `${data.isFormalDd2 ? "true" : "false"}`,
      inspectorName: data.isSubmitted ? data.inspectorName : loggedInUser?.eName,
      inspectorDesignation: data.isSubmitted ? data.inspectorDesignation : loggedInUser?.roleName,
      inspDocVerify: data.inspDocVerify ?? false,
      inspElec: data.inspElec ?? false,
      inspEmiEmc: data.inspEmiEmc ?? false,
      inspEndurance: data.inspEndurance ?? false,
      inspEss: data.inspEss ?? false,
      inspEt: data.inspEt ?? false,
      inspFats: data.inspFats ?? false,
      inspPdi: data.inspPdi ?? false,
      inspPhysical: data.inspPhysical ?? false,
    };
    setRecords(allData);
    reset(allData);
    setLoading(false);
  };

  const getInspection = (fileNoteId) => {
    setLoading(true);
    if (fileNoteId) {
      //  getFileNoteById

      axiosInstanceTrans
        .get(getFileNoteById + fileNoteId)
        .then(({ data }) => {
          setAllData(data);
          setIds(data?.offerLetterIds);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      const queryString = olIds?.map((id) => `olIds=${id}`).join("&");
      axiosInstanceTrans
        .get(`${getFileNote}?${queryString}`)
        .then(({ data }) => {
          setAllData(data);
          if (data?.isQinCompleted === false) toast.error("Please complete QIN to proceed with File Note ");
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setLoading(false));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    // Get the plain text from the clipboard
    const text = (e.clipboardData || window.clipboardData).getData("text");

    // Insert plain text at the caret position
    document.execCommand("insertText", false, text);
  };

  const setFlagErrorTrue = () => {
    setFlagErr({ state: true, msg: "Required" });
  };

  const setFlagErrorFalse = () => {
    setFlagErr({ state: false, msg: null });
  };

  useEffect(() => {
    getInspection(fileNoteId);
    // setFnId(fileNoteId);
    getEmps();
    if (fileNoteId) {
      getRemarks(fileNoteId);
    }
    setValue("createdBy", loggedInUser?.empId);
    if (!fileNoteId) SetIsRemark(true);
    setIds(olIds);
  }, [loggedInUser]);

  useEffect(() => {
    if (Object.values(errors).length > 0) {
      if (searchFlag === null && loggedInUser?.roleId !== USER_ROLE_ID?.ROLE_INSPECTOR) {
        setFlagErrorTrue();
      }
    }
  }, [errors]);

  ////get remark history
  const getRemarks = (fileNoteId) => {
    setLoading(true);
    axiosInstanceTrans
      .get(getFileNoteApproval + fileNoteId + "/" + loggedInUser?.empId)
      .then(({ data }) => {
        setIsEdit(!data.isEditAllowed);
        setIsRemarkEditable(data?.isEditAllowed);
        SetIsRemark(data?.isEditAllowed);
        SetRemarkList(data?.soApprovalDtos);
        setAppvrDate(data?.cqaoApprovalDate);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const executeSubmit = (data) => {
    if (isremark) {
      if (editorRef.current.innerHTML.length > 0) {
        SetRemarkErr(false);
        setLoadingDraft(true);
      } else {
        SetRemarkErr(true);
        return 0;
      }
    }
    const filterLoggedInUserData = remarkList?.filter((el) => el.createdBy === loggedInUser?.empId);
    const getLoggedInUserData =
      filterLoggedInUserData?.length > 0
        ? filterLoggedInUserData?.reduce((latest, current) => {
            return new Date(current.createdDate) > new Date(latest.createdDate) ? current : latest;
          })
        : {};

    const OlApprovalDto = {
      inspectionFileNoteId: fileNoteId,
      createdBy: loggedInUser?.empId,
      approvedBy: data.approvedBy.id,
      remarks: editorRef.current.innerHTML,
      nextApproverId: data?.empId?.id || 0,
      olStatus: olStatus,
      designation: designation,
      id: isRemarkEditable && !isremark ? getLoggedInUserData?.id : undefined,
      noteNo: isRemarkEditable && !isremark ? getLoggedInUserData?.noteNo : undefined,
    };
    //formData
    const formData = new FormData();
    if (loggedInUser?.roleId === USER_ROLE_ID.ROLE_INSPECTOR) {
      data.createdBy = loggedInUser?.empId;
      data.approvedBy = approvedBy;
      data.offerLetterIds = ids;
      data.supplyOrderId = soId;
      data.isSubmitted = true;
      data.isFileNoteIdPresent = fileNoteId ? true : false;
      formData.append("inspectionFileNoteDtoStr", JSON.stringify(data));
    }
    if (records.isSubmitted && user?.roleId === USER_ROLE_ID.ROLE_SQAO && displayDate) {
      data.id = fileNoteId;
      data.cqaoApprovalDate = selectedDate;
      formData.append("inspectionFileNoteDtoStr", JSON.stringify(data));
    }
    if (user?.roleId === USER_ROLE_ID.ROLE_SQAO) {
      OlApprovalDto.cqaoApprovalDate = selectedDate;
    }

    selectedFileQap.forEach((item) => formData.append("uploads", item));
    formData.append("olApprovalDtoStr", JSON.stringify(OlApprovalDto));
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const url = isEdit && loggedInUser?.roleId === USER_ROLE_ID.ROLE_INSPECTOR ? updateInspctionFileNoteV2 : saveInspectionFileV2;
    axiosInstanceTrans
      .post(saveInspectionFileV2, formData, config)
      .then(({ data }) => {
        SetIsRemark(false);
        getRemarks(data?.inspectionFileNoteId);
        setLoadingDraft(false);
        getInspection(data?.inspectionFileNoteId);
        toast.success("Data successfully Submitted.");
        return data;
      })
      .catch((error) => {
        toast.error("Something went wrong");
      })
      .finally(() => setLoadingDraft(false));
  };

  const executeSave = (data) => {
    const OlApprovalDto = {
      inspectionfnId: fileNoteId,
      createdBy: loggedInUser?.empId,
      approvedBy: approvedBy,
      remarks: editorRef.current.innerHTML,
      nextApproverId: nxtApprover,
      olStatus: olStatus,
      designation: designation,
    };
    const formData = new FormData();
    if (!records.isSubmitted) {
      // console.log("111", data);
      data.createdBy = loggedInUser?.empId;
      data.approvedBy = approvedBy;
      data.offerLetterIds = ids;
      data.supplyOrderId = soId;
      data.isSubmitted = false;
      data.isFileNoteIdPresent = fileNoteId ? true : false;
      formData.append("inspectionFileNoteDtoStr", JSON.stringify(data));
      console.log(formData, "edfeghyeg");
    }
    if (records.isSubmitted && user?.roleId === USER_ROLE_ID.ROLE_SQAO && displayDate) {
      data.id = fileNoteId;
      data.cqaoApprovalDate = selectedDate;
      formData.append("inspectionFileNoteDtoStr", JSON.stringify(data));
      console.log(formData, "edfeghyeg", soId);
    }
    selectedFileQap.forEach((item) => formData.append("uploads", item));
    formData.append("olApprovalDtoStr", JSON.stringify(OlApprovalDto));
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axiosInstanceTrans
      .post(saveInspectionFileV2, formData, config)
      .then(({ data }) => {
        console.log("fghfh", data?.inspectionFileNoteId);
        setValue("fileNoteId", data?.inspectionFileNoteId);

        toast.success("Data Saved.");
        setSaveDraft(false);
        getInspection(data?.inspectionFileNoteId);
        // getRemarks(data?.inspectionFileNoteId);

        return data;
      })
      .catch((error) => {
        toast.error("Something went wrong");
      })
      .finally(() => setLoadingDraft(false));
  };

  let fileInputRefQap = useRef(null);

  const handleFileInputQap = (e) => {
    fileInputRefQap.click();
    const file = [...e.target.files];
    console.log("e.target.files", e.target.files);

    const restrictedFileFormat = [
      "pif",
      "exe",
      "application",
      "gadget",
      "msi",
      "msp",
      "com",
      "scr",
      "hta",
      "cpl",
      "msc",
      "jar",
      "bat",
      "cmd",
      "vb",
      "vbs",
      "vbe",
      "js",
      "jse",
      "ws",
      "wsf",
      "wsc",
      "wsh",
      "ps1",
      "ps1xml",
      "ps2",
      "ps2xml",
      "psc21",
      "psc2",
      "msh",
      "msh1",
      "msh2",
      "mshxml",
      "msh1xml",
      "msh2xml",
    ];

    let notAllowedExt = [];

    for (let i = 0; i < file.length; i++) {
      let filName = file[i].name;
      let fileExt = file[i].name.split(".").pop().toLowerCase();
      if (restrictedFileFormat.includes(fileExt)) {
        let checkIfExistAlready = notAllowedExt.findIndex((el) => el === filName);
        if (checkIfExistAlready === -1) {
          notAllowedExt.push(filName);
        }
      }
    }

    if (notAllowedExt.length > 0) {
      notAllowedExt.join(",");
      const renderFileList = notAllowedExt.map((el) => <li>{el}</li>);
      toast.error(<>The following files are not allowed{renderFileList}</>);

      return;
    }

    const existing = [...selectedFileQap, ...file];
    setSelectedFileQap(existing);
  };

  const deleteFileQap = (id) => {
    const filteredListQap = selectedFileQap?.filter((item, index) => index !== id);
    setSelectedFileQap(filteredListQap);
  };

  const DownloadResponse = ({ data }) => {
    function handleDownload(url) {
      axiosInstanceTrans
        .get(url, {
          responseType: "blob",
        })
        .then(({ data }) => {
          saveAs(data, url.split("/").pop());
        })
        .catch(() => toast.error("Failed to download, Please try again!"));
    }
    return (
      <>
        {Array.isArray(data) && data?.length > 0 && (
          <>
            <h4>ATTACHMENTS</h4>
            <p>
              {isRemarkEditable ? (
                <>
                  <input
                    ref={(refParam) => (fileInputRefQap = refParam)}
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    remarklist
                    onChange={handleFileInputQap}
                  />
                  <Button
                    onClick={() => {
                      fileInputRefQap.click();
                    }}
                    className={classes.button}
                    variant="outlined"
                    size="small"
                  >
                    Upload Files
                  </Button>
                  {selectedFileQap ? (
                    selectedFileQap?.map((item, id) => (
                      <StyledMenuItem>
                        <ListItemText disableTypography primary={<Typography variant="body2">{item?.name}</Typography>} />
                        <IconButton
                          size="small"
                          onClick={() => {
                            deleteFileQap(id);
                          }}
                        >
                          <Close fontSize="small" color="action" />
                        </IconButton>
                      </StyledMenuItem>
                    ))
                  ) : (
                    <Typography component={"span"} variant="caption" color="textSecondary">
                      No file selected.
                    </Typography>
                  )}
                </>
              ) : null}
            </p>
            <Grid container className={classes.mt3}>
              <Grid item xs={3}>
                {data &&
                  data.map((el) => (
                    <>
                      <StyledMenuItem
                        style={{
                          background: "#edf8ff",
                          justifyContent: "space-between",
                          padding: "4px",
                          border: "1px solid #205375",
                          borderRadius: "4px",
                          maxWidth: 240,
                          marginTop: "8px",
                        }}
                      >
                        <ListItemText
                          disableTypography
                          onClick={() => {
                            handleDownload(el);
                          }}
                          style={{ maxWidth: 230 }}
                          primary={
                            <Typography
                              variant="body2"
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={el.split("/").pop()}
                            >
                              {el.split("/").pop()}
                            </Typography>
                          }
                        />
                        <IconButton
                          size="small"
                          onClick={() => {
                            handleDownload(el);
                          }}
                        >
                          <GetAppIcon />
                        </IconButton>
                      </StyledMenuItem>
                    </>
                  ))}
              </Grid>
            </Grid>
          </>
        )}
      </>
    );
  };

  const displayData = (val) => {
    if (val === 1) setOlStatus(1);
    else setOlStatus(2);
    axiosInstance
      .get(getAllActiveEmpsOfOrgn + `${loggedInUser?.empId}/${loggedInUser?.orgId}`)
      .then((res) => {
        setRecord(res?.data);

        console.log(res, "efhrugh");
      })
      .catch((err) => console.log("error in getSubDcqaoBySubRole" + err));
  };

  const displayRecordsForInsp = () => {
    // displayRecords(1);
    displayData(1);
  };

  if (user?.roleId === 7 && count === false) {
    displayRecordsForInsp();
    setCount(true);
  }

  const getEmps = () => {
    axiosInstance
      .get(getAllActiveEmpsOfOrg + `${loggedInUser?.orgId}`)
      .then((res) => {
        setEmpList(res?.data);

        console.log(res, "efhrugh");
      })
      .catch((err) => console.log("error in getSubDcqaoBySubRole" + err));
  };

  const editorRef = useRef(null);
  const [bold, setBold] = useState(false);

  const handleBold = () => {
    document.execCommand("bold", false, null);
    setBold((prev) => !prev);
  };

  const handleEdit = (userType) => {
    const filterLoggedInUserData = remarkList?.filter((el) => el.createdBy === loggedInUser?.empId);
    const getLoggedInUserData =
      filterLoggedInUserData?.length > 0
        ? filterLoggedInUserData?.reduce((latest, current) => {
            return new Date(current.createdDate) > new Date(latest.createdDate) ? current : latest;
          })
        : {};
    const findApprovedBy = empList.find((el) => el.id === getLoggedInUserData?.approvedBy);
    const nextApprover = empList.find((el) => el.id === getLoggedInUserData?.nextApproverId);
    if (userType === "inspector") {
      setIsRemarkEditable(true);
      setIsEdit(false);
      setValue("approvedBy", findApprovedBy);
      setValue("empId", nextApprover);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = getLoggedInUserData?.remarks || "";
        }
      }, 0);
      return;
    }
    if (userType === "expectInspector" || userType === "CQAO") {
      setIsRemarkEditable(true);
      const isAccepted = getLoggedInUserData?.olStatusStr === "Approved";
      setValue("approvedBy", findApprovedBy);
      setValue("empId", nextApprover);
      setSearchFlag(isAccepted ? 1 : 0);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = getLoggedInUserData?.remarks || "";
        }
      }, 0);
      return;
    }
  };

  const renderContentForInspector = (
    <Grid container spacing={2} alignItems="center">
      {!appvrDate && hasEditAccessInspector && (
        <>
          {isRemarkEditable || !records.isSubmitted ? (
            <>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.mt3}>
                <input
                  ref={(refParam) => (fileInputRefQap = refParam)}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  remarklist
                  onChange={handleFileInputQap}
                />
                <Button
                  onClick={() => {
                    fileInputRefQap.click();
                  }}
                  className={classes.button + " " + `${isremark ? "" : classes.hide}`}
                  variant="outlined"
                  size="small"
                >
                  Upload Files
                </Button>

                {selectedFileQap ? (
                  selectedFileQap?.map((item, id) => (
                    <StyledMenuItem>
                      <ListItemText disableTypography primary={<Typography variant="body2">{item?.name}</Typography>} />
                      <IconButton
                        size="small"
                        onClick={() => {
                          deleteFileQap(id);
                        }}
                      >
                        <Close fontSize="small" color="action" />
                      </IconButton>
                    </StyledMenuItem>
                  ))
                ) : (
                  <Typography component={"span"} variant="caption" color="textSecondary">
                    No file selected.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} align="left">
                <Controller
                  name="approvedBy"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <>
                      <AutoCompleteNew
                        labelText="Select Signatory"
                        data={empList}
                        getOptionLabel={(o) => o?.ename}
                        onChange={(e, v) => {
                          onChange(v);
                          setApprovedBy(v?.id);
                          setDesignation(v?.roleName);
                        }}
                        value={value}
                      />
                      <FormHelperText error={!!errors.approvedBy}>{errors.approvedBy?.message}</FormHelperText>
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={6} sm={6} md={12} lg={12} xl={12}>
                <h4>{loggedInUser?.roleName.toLocaleUpperCase()}_REMARKS:</h4>
              </Grid>

              <Grid item xs={12}>
                <Button
                  size="small"
                  variant={bold ? "contained" : "outlined"}
                  onClick={handleBold}
                  style={{ marginBottom: 4, marginRight: 16 }}
                  color="secondary"
                >
                  Bold
                </Button>
                <Typography variant="caption" color="primary">
                  Select the text and click the 'BOLD' button to make it bold.
                </Typography>
                <div
                  ref={editorRef}
                  onPaste={handlePaste}
                  contentEditable
                  style={{
                    minHeight: "50px",
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                />
                {!!remarkerr && <FormHelperText error>{remarkerr ? "Remark required" : ""}</FormHelperText>}
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} align="left">
                <Controller
                  name="empId"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <>
                      <AutoCompleteNew
                        labelText="Select Next Approver"
                        data={record}
                        getOptionLabel={(o) => o?.ename}
                        onChange={(e, v) => {
                          onChange(v);
                          setNxtApprover(v?.id);
                        }}
                        value={value}
                      />
                      <FormHelperText error={!!errors.empId}>{errors.empId?.message}</FormHelperText>
                    </>
                  )}
                />
              </Grid>
            </>
          ) : null}

          <Grid item xs={12} sm={6} md={8} lg={12} xl={12} align="left"></Grid>
          {!isRemarkEditable && records.isSubmitted ? (
            <Grid xs={12} sm={6} md={6} lg={6} xl={6} align="right">
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={(e) => {
                  console.log("sdfsd");
                  e.preventDefault();
                  handleEdit("inspector");
                }}
              >
                Edit
              </Button>
            </Grid>
          ) : (
            <Grid xs={12} sm={6} md={6} lg={6} xl={6} align="right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                //validation
                disabled={loadingDraft || records?.isQinCompleted === false}
              >
                {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} />} Submit
              </Button>
            </Grid>
          )}
        </>
      )}

      <Grid item xs={12} sm={6} md={6} lg={6} xl={6} align="left">
        <ReactToPrint
          trigger={() => (
            <Button variant="contained" color="primary" className="printbtn">
              Print{" "}
            </Button>
          )}
          content={() => printref.current}
        />
      </Grid>
    </Grid>
  );

  const renderContentForExpectRoleInspector = (
    <>
      <Grid container spacing={2}>
        {isRemarkEditable && (
          <>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} align="left">
              <Controller
                name="approvedBy"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <>
                    <AutoCompleteNew
                      labelText="Select Signatory"
                      data={empList}
                      getOptionLabel={(o) => o?.ename}
                      onChange={(e, v) => {
                        onChange(v);
                        setApprovedBy(v?.id);
                        setDesignation(v?.roleName);
                      }}
                      value={value}
                    />
                    <FormHelperText error={!!errors.approvedBy}>{errors.approvedBy?.message}</FormHelperText>
                  </>
                )}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={12} lg={12} xl={12}>
              <h4>{loggedInUser?.roleName.toLocaleUpperCase()}_REMARKS:</h4>
            </Grid>

            <Grid item xs={12}>
              <Button
                size="small"
                variant={bold ? "contained" : "outlined"}
                onClick={handleBold}
                style={{ marginBottom: 4, marginRight: 16 }}
                color="secondary"
              >
                Bold
              </Button>
              <Typography variant="caption" color="primary">
                Select the text and click the 'BOLD' button to make it bold.
              </Typography>
              <div
                ref={editorRef}
                onPaste={handlePaste}
                contentEditable
                style={{
                  minHeight: "50px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
              {!!remarkerr && <FormHelperText error>{remarkerr ? "Remark required" : ""}</FormHelperText>}
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} align="middle">
              <FormControl style={{ padding: "14px 0px 0px 0px" }}>
                <ToggleButtonGroup
                  value={searchFlag}
                  exclusive
                  onChange={(e, newvalue) => {
                    if (newvalue === null) {
                      setFlagErrorTrue();
                    } else {
                      setFlagErrorFalse();
                    }

                    displayData(newvalue);
                    setIsAcceptSelected(newvalue === 1);
                    setSearchFlag(newvalue);
                    if (user?.roleId === USER_ROLE_ID.ROLE_SQAO && newvalue == 1) {
                      setNxtApprover(0);
                      setOlStatus(1);
                      setValue("empId", 0);
                    }
                    if (user?.roleId === USER_ROLE_ID.ROLE_SQAO && newvalue == 0) {
                      setOlStatus(2);
                    }
                  }}
                  size="small"
                >
                  <ToggleButton
                    classes={{
                      root: classes.leftRoot,
                    }}
                    className={classes.acceptColor}
                    value={1}
                  >
                    Accept
                  </ToggleButton>
                  <ToggleButton
                    classes={{
                      root: classes.rightRoot,
                    }}
                    className={classes.rejectColor}
                    value={0}
                  >
                    Reject&nbsp;
                  </ToggleButton>
                </ToggleButtonGroup>
                <FormHelperText error={!!searchFlagErr?.state}>{searchFlagErr?.msg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} align="left">
              <Controller
                name="empId"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <>
                    <AutoCompleteNew
                      labelText="Select Next Approver"
                      data={record}
                      getOptionLabel={(o) => o?.ename}
                      onChange={(e, v) => {
                        onChange(v);
                        setNxtApprover(v?.id);
                      }}
                      value={value}
                      disabled={isAcceptSelected && user?.roleId === 2}
                    />
                    <FormHelperText error={!!errors.empId}>{errors.empId?.message}</FormHelperText>
                  </>
                )}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
        {!appvrDate && hasEditAccess && (
          <>
            {!isRemarkEditable ? (
              <Grid xs={12} sm={6} md={6} lg={6} xl={6} align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    console.log("sdfsd");
                    e.preventDefault();
                    handleEdit("expectInspector");
                  }}
                >
                  Edit
                </Button>
              </Grid>
            ) : (
              <Grid xs={12} sm={6} md={6} lg={6} xl={6} align="right">
                <Button type="submit" variant="contained" color="primary" disabled={loadingDraft || records?.isQinCompleted === false}>
                  {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} />} Submit
                </Button>
              </Grid>
            )}
          </>
        )}

        <Grid xs={12} sm={6} md={6} lg={6} xl={6} align="left">
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary" className="printbtn" style={{ marginLeft: "10px" }}>
                Print{" "}
              </Button>
            )}
            content={() => printref.current}
          />
        </Grid>
      </Grid>
    </>
  );

  const renderForCQAORole = (
    <>
      <Grid container spacing={2}>
        {isRemarkEditable && (
          <>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} align="left">
              <Controller
                name="approvedBy"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <>
                    <AutoCompleteNew
                      labelText="Select Signatory"
                      data={empList}
                      getOptionLabel={(o) => o?.ename}
                      onChange={(e, v) => {
                        onChange(v);
                        setApprovedBy(v?.id);
                        setDesignation(v?.roleName);
                      }}
                      value={value}
                    />
                    <FormHelperText error={!!errors.approvedBy}>{errors.approvedBy?.message}</FormHelperText>
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                size="small"
                variant={bold ? "contained" : "outlined"}
                onClick={handleBold}
                style={{ marginBottom: 4, marginRight: 16 }}
                color="secondary"
              >
                Bold
              </Button>
              <Typography variant="caption" color="primary">
                Select the text and click the 'BOLD' button to make it bold.
              </Typography>
              <div
                ref={editorRef}
                onPaste={handlePaste}
                contentEditable
                style={{
                  minHeight: "50px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
              {!!remarkerr && <FormHelperText error>{remarkerr ? "Remark required" : ""}</FormHelperText>}
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} align="middle">
              <FormControl style={{ padding: "14px 0px 0px 0px" }}>
                <ToggleButtonGroup
                  value={searchFlag}
                  exclusive
                  onChange={(e, newvalue) => {
                    console.log(newvalue, "newvalue");
                    if (newvalue === null) {
                      setFlagErrorTrue();
                    } else {
                      setFlagErrorFalse();
                    }

                    displayData(newvalue);
                    setSearchFlag(newvalue);
                    if (user?.roleId === USER_ROLE_ID.ROLE_SQAO && newvalue == 1) {
                      //JCQAO User
                      setNxtApprover(0);
                      setOlStatus(1);
                      setValue("empId", 0);
                    }
                    if (user?.roleId === USER_ROLE_ID.ROLE_SQAO && newvalue == 0) {
                      setOlStatus(2);
                    }
                    setValue("cqaoApprovalDate", null);
                    setSelectedDate(null);
                  }}
                  size="small"
                >
                  <ToggleButton
                    classes={{
                      root: classes.leftRoot,
                    }}
                    className={classes.acceptColor}
                    value={1}
                  >
                    Accept
                  </ToggleButton>
                  <ToggleButton
                    classes={{
                      root: classes.rightRoot,
                    }}
                    className={classes.rejectColor}
                    value={0}
                  >
                    Reject&nbsp;
                  </ToggleButton>
                </ToggleButtonGroup>
                <FormHelperText error={!!searchFlagErr?.state}>{searchFlagErr?.msg}</FormHelperText>
              </FormControl>
            </Grid>

            {searchFlag === 1 ? (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} align="left">
                <Controller
                  name="cqaoApprovalDate"
                  control={control}
                  //value={value}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      {...props}
                      labelText="CQAO Approval Date"
                      placeholder="CQAO Approval Date"
                      onChange={(e) => {
                        onChange(e);
                        setSelectedDate(e.target.value);
                      }}
                      value={value}
                      inputProps={{
                        min: moment(records?.olDate).format("YYYY-MM-DD"),
                        max: moment(new Date()).format("YYYY-MM-DD"),
                      }}
                      type="date"
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>
            ) : searchFlag === 0 ? (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} align="left">
                <Controller
                  name="empId"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <>
                      <AutoCompleteNew
                        labelText="Select Next Approver"
                        data={record}
                        getOptionLabel={(o) => o?.ename}
                        onChange={(e, v) => {
                          onChange(v);
                          setNxtApprover(v?.id);
                        }}
                        value={value}
                      />
                      <FormHelperText error={!!errors.empId}>{errors.empId?.message}</FormHelperText>
                    </>
                  )}
                />
              </Grid>
            ) : null}
          </>
        )}
      </Grid>
      <Grid container spacing={3} alignItems="baseline">
        <Grid xs={3} sm={3} md={4} lg={4} xl={4}></Grid>
        {!appvrDate && loggedInUser?.roleId !== USER_ROLE_ID.ROLE_OIC_ADMIN && hasEditAccess && (
          <>
            {!isRemarkEditable ? (
              <Grid xs={3} sm={1} md={1} lg={1} xl={1} align="center">
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    console.log("sdfsd");
                    e.preventDefault();
                    handleEdit("CQAO");
                  }}
                >
                  Edit
                </Button>
              </Grid>
            ) : (
              <Grid xs={3} sm={1} md={1} lg={1} xl={1} align="center">
                <Button type="submit" variant="contained" color="primary" disabled={loadingDraft || records?.isQinCompleted === false}>
                  {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} />} Submit
                </Button>
              </Grid>
            )}
          </>
        )}

        <Grid item xs={3} sm={1} md={1} lg={1} xl={1} align="left">
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary" className="printbtn">
                Print{" "}
              </Button>
            )}
            content={() => printref.current}
          />
        </Grid>
      </Grid>
    </>
  );

  const renderRoleBasedContent = () => {
    switch (loggedInUser?.roleId) {
      case 7:
        return renderContentForInspector;
      case 3:
        return renderForCQAORole;

      default:
        return renderContentForExpectRoleInspector;
    }
  };

  return (
    <>
      {open && <InspectionViewOL open={open} setOpen={setOpen} data={records} olIds={ids} />}

      {openConsession && (
        <ConcessionTable open={openConsession} setOpen={setOpenConsession} olIds={ids} olNumber={records?.olNumber} ols={records?.ols} />
      )}

      {openDilg && <HologramForm OlData={records} olIds={ids} open={openDilg} setOpen={setOpenDilg} />}

      <div style={{ display: "none" }}>
        <div ref={printref} id="inspNotePrintbox">
          <div className="row-header">
            <b>
              <u>INSPECTION FILE-NOTE ISO FORM NO: IB/FRM/001</u>
            </b>
          </div>
          <table width="100%" cellpadding="3">
            <tr>
              <td>Ol Number & Date:</td>
              <td>{records.olNumber}</td>
              <td>{records.olDate ? moment(records.olDate).format("DD-MM-yyyy") : null}</td>
              <td>Type of Delivery</td>
              <td>{records.typeOfDelivery}</td>
            </tr>
            <tr>
              <td>Project Description:</td>
              <td colspan="3">{records.projectDescription}</td>
            </tr>
            <tr>
              <td>Order Master No.:</td>
              <td colspan="2">{records.fileNumber}</td>
              <td>Note No:</td>
              <td>{records.noteNo}</td>
            </tr>
            <tr>
              <td>Original Delivery Date:</td>
              <td colspan="4"> {records.originalDeliverydate ? moment(records.originalDeliverydate).format("DD-MM-yyyy") : null}</td>
            </tr>
            <tr>
              <td>Extended DD1:</td>
              <td></td>
              <td colspan="2">
                <label for="Prov_DD">Prov_DD</label>
                <input type="radio" name="isFormalDd1" value="true" checked={records.isFormalDd1 == "true" ? true : false} />
                &nbsp; &nbsp;
                <label for="Formal DD1">Formal DD1</label>
                <input type="radio" name="isFormalDd1" value="false" checked={records.isFormalDd1 == "false" ? true : false} />
              </td>
              <td rowspan="2">Latest DD Extended vide: {records.latestDdExtendedVide}</td>
            </tr>
            <tr>
              <td>Extended_DD2:</td>
              <td></td>
              <td colspan="2">
                <label for="isFormalDd2">Prov_DD</label>
                <input type="radio" name="isFormalDd2" value="true" checked={records.isFormalDd2 == "true" ? true : false} />
                &nbsp; &nbsp;
                <label for="isFormalDd2">Formal DD2</label>
                <input type="radio" name="isFormalDd2" value="false" checked={records.isFormalDd2 == "false" ? true : false} />
              </td>
            </tr>
            <tr>
              <td>Lot_Size_Original:</td>
              <td>{records.lotSizeOriginal}</td>
              <td colspan="2">Lot_Size_Amended 1: {records.lotSizeAmmended1}</td>
              <td colspan="2">Lot_Size_Amended 2: {records.lotSizeAmmended2}</td>
            </tr>
            <tr>
              <td>Total_line_items_PO:</td>
              <td>{records.totalLineItemsPo}</td>
              <td>Total_Value_line_items_PO:</td>
              <td colspan="3">{records.totalValueLineItemsPo}</td>
            </tr>
            <tr>
              <td>Total_Inotes/CC issued:</td>
              <td colspan="2">{records.totalInotesCcIssued}</td>
              <td>Completed_lot_size:</td>
              <td colspan="2">{records.completedLotSize}</td>
            </tr>
            <tr>
              <td>No_Line_items_supplied:</td>
              <td colspan="2">{records.noLineItemsSupplied}</td>
            </tr>
            <tr>
              <td>No_Line_items_in_OL:</td>
              <td colspan="2">{records.noLineItemsOl}</td>
              <td>Value_offered_in_OL:</td>
              <td colspan="2">{records.valueOfferedOl}</td>
            </tr>

            <tr>
              <td>No_Line_items_clrd_in_OL:</td>
              <td colspan="2">{records.noLineItemsClrdOl}</td>
              <td>Value_clrd_in_OL:</td>
              <td colspan="2">{records.valueOfferedOl}</td>
            </tr>
            <tr>
              <td>Inspector Name & Desig:</td>
              <td colspan="3">{records.inspectorName}</td>
              <td colspan="2">{records.inspectorDesignation}</td>
            </tr>
            <tr>
              <td>QAP_Ref:</td>
              <td colspan="2">{records.qapRef}</td>
            </tr>
            <tr>
              <td rowspan="2">Type of Inspections :</td>
              <td>
                <label for="">Insp Doc verify</label>
                <input type="checkbox" name="" checked={records.inspDocVerify} />
              </td>
              <td>
                <label for="">Insp Elec</label>
                <input type="checkbox" name="" checked={records.inspElec} />
              </td>
              <td>
                <label for="">Insp ET</label>
                <input type="checkbox" name="" checked={records.inspEt} />
              </td>
              <td>
                <label for="">Insp FATs</label>
                <input type="checkbox" name="" checked={records.inspFats} />
              </td>
            </tr>
            <tr>
              <td>
                <label for="">Insp Physical</label>
                <input type="checkbox" name="" checked={records.inspPhysical} />
              </td>
              <td>
                {" "}
                <label for="">Insp ESS</label>
                <input type="checkbox" name="" checked={records.inspEss} />
              </td>
              <td>
                {" "}
                <label for="">Insp Endurance</label>
                <input type="checkbox" name="" checked={records.inspEndurance} />
              </td>
            </tr>
            <tr>
              <td>Insp_Start :</td>
              <td>{records.inspectionStartDate ? moment(records.inspectionStartDate).format("DD-MM-yyyy") : null}</td>
              <td>Insp_Comp</td>
              <td>{records.inspectionCompleteDate ? moment(records.inspectionCompleteDate).format("DD-MM-yyyy") : null}</td>
            </tr>
          </table>

          <div className="remarklist">
            {remarkList?.map((item) => (
              <>
                <div>
                  <span>
                    {item.designation !== null ? item.designation.toLocaleUpperCase() : null}
                    _REMARKS: {"    "}
                    {item.olStatus == 1 ? (
                      <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 10, color: "#15d13a" }} />
                    ) : (
                      <FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: 10, color: "#e13333" }} />
                    )}
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      width: "96%",
                      border: "0.2px solid rgb(121, 121, 121)",
                      padding: "5px 5px 10px 5px",
                    }}
                    dangerouslySetInnerHTML={{ __html: item.remarks }}
                  ></div>
                </div>
                {/* <div>
              {item.uploadedFiles && <DownloadResponse data={item.uploadedFiles} />}
            </div> */}
                <div className={classes.printImage}></div>
                <div className="row reverse">
                  <div className="remarkleft">
                    <div className="row">OFFICER NAME : {item.approvedByStr != null ? item.approvedByStr?.toLocaleUpperCase() : null}</div>
                    <div className="row">
                      OFFICER Designation : {item.approverDesignation != null ? item.approverDesignation?.toLocaleUpperCase() : null}
                    </div>
                    <div className="row">DATE : {item.createdDate ? moment(item.createdDate).format("DD-MM-yyyy") : null}</div>
                  </div>
                </div>
              </>
            ))}
            {isremark && user?.roleId === USER_ROLE_ID.ROLE_SQAO && (
              <>
                {" "}
                <div className={classes.printImage}></div>
                <div className="row">
                  <u style={{ textDecoration: "underline", fontWeight: "bold" }}>CQAO</u>
                </div>
              </>
            )}

            <div className={classes.printImage}></div>
            <div align="center"> This is a computer generated statement </div>
          </div>
        </div>
      </div>

      <div>
        <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
          <Grid item xs={12} align="left">
            <Button
              type="Close"
              onClick={() => {
                (fileNoteId && user?.roleId === 7) || olIds
                  ? dispatch(selectItem(<FileNoteTable />))
                  : dispatch(selectItem(<InspFileNoteOL />));
              }}
              variant="contained"
              color="Secondary"
              startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
              // disabled={loading || !isDirty}
            >
              Back
            </Button>
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={(e) => {
                setOpen(true);
              }}
            >
              {isArmy ? "QACL" : "OL"} Details
            </Button>
          </Grid>
        </Grid>{" "}
        <form onSubmit={handleSubmit(executeSubmit)}>
          {loading ? (
            <Loader />
          ) : (
            <>
              <paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                    <Typography className={classes.heading}>INSPECTION FILE - NOTE ISO FORM NO: IB/FRM/001</Typography>
                  </Grid>
                </Grid>

                <br />
                <Paper container>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{ margin: "auto", overflowX: "auto" }}>
                      <Grid container>
                        <Table className={classes.table} size="small">
                          <TableBody>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Ol Number & Date :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="olNumber"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter Ol No"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.olNumber}
                                        helperText={errors.olNumber?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                                {/* {records.orderNo} */}
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="olDate"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        size="small"
                                        onChange={onChange}
                                        type="date"
                                        value={value ? moment(value).format("yyyy-MM-DD") : null}
                                        error={!!errors.olDate}
                                        helperText={errors.olDate?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCellLabel} align="center">
                                Type of Delivery
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell} align="center" colSpan={2}>
                                <Controller
                                  name="typeOfDelivery"
                                  control={control}
                                  render={({ field: { onChange, value, ...props } }) => (
                                    <AutoCompleteNew
                                      disabled={isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                                      placeholder="Select Delivery Type"
                                      data={typeofDelivary}
                                      getOptionLabel={(option) => (option.title ? option.title : "")}
                                      onChange={(e, v) => {
                                        onChange(v.title);
                                      }}
                                      value={typeof value === "string" ? typeofDelivary.find((o) => o.title === value) : value || null}
                                      error={!!errors.typeOfDelivery}
                                      helperText={errors.typeOfDelivery?.message}
                                    />
                                  )}
                                />
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Project Description :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={5}>
                                {/* {records?.projectDescription} */}
                                <Controller
                                  name="projectDescription"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.projectDescription}
                                        helperText={errors.projectDescription?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Order Master No. :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                {/* {records?.fileNumber} */}
                                <Controller
                                  name="fileNumber"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.fileNumber}
                                        helperText={errors.fileNumber?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCellLabel}>Note No :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="noteNo"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        onInput={restrict.number}
                                        value={value}
                                        error={!!errors.noteNo}
                                        helperText={errors.noteNo?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Supply Order no & Dt :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="supplyOrderNo"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.supplyOrderNo}
                                        helperText={errors.supplyOrderNo?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={3}>
                                <Controller
                                  name="supplyOrderDate"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        size="small"
                                        type="date"
                                        value={value ? moment(value).format("yyyy-MM-DD") : null}
                                        onChange={onChange}
                                        error={!!errors.supplyOrderDate}
                                        helperText={errors.supplyOrderDate?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Original Delivery Date :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={5}>
                                <Controller
                                  name="originalDeliverydate"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        size="small"
                                        type="date"
                                        value={value ? moment(value).format("yyyy-MM-DD") : null}
                                        onChange={onChange}
                                        error={!!errors.originalDeliverydate}
                                        helperText={errors.originalDeliverydate?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Extended_DD1 :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="extendedDd1"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        size="small"
                                        type="date"
                                        value={value ? moment(value).format("yyyy-MM-DD") : null}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setValue("extendedDd1", val ? moment(val).format("yyyy-MM-DD") : null);
                                        }}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="isFormalDd1"
                                  control={control}
                                  render={({ field: { onChange, value } }) => (
                                    <FormControl>
                                      <RadioGroup row value={value} onChange={onChange}>
                                        <FormControlLabel
                                          disabled={
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR
                                          }
                                          value="true"
                                          control={<Radio />}
                                          label="Prov_DD"
                                          labelPlacement="start"
                                        />
                                        <FormControlLabel
                                          disabled={
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR
                                          }
                                          value="false"
                                          control={<Radio />}
                                          label="Formal DD1"
                                          labelPlacement="start"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  )}
                                ></Controller>
                              </StyledTableCell>

                              <StyledTableCell className={classes.tableCellLabel} rowSpan={2} colSpan={2}>
                                Latest DD Extended vide :
                                <Controller
                                  name="latestDdExtendedVide"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the value"
                                        size="small"
                                        value={value}
                                        onChange={onChange}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Extended_DD2 :</StyledTableCell>

                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="extendedDd2"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        size="small"
                                        type="date"
                                        value={value ? moment(value).format("yyyy-MM-DD") : null}
                                        onChange={onChange}
                                        error={!!errors.extendedDd2}
                                        helperText={errors.extendedDd2?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="isFormalDd2"
                                  control={control}
                                  render={({ field: { onChange, value } }) => (
                                    <FormControl>
                                      <RadioGroup row value={value}>
                                        <FormControlLabel
                                          disabled={
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR
                                          }
                                          value="true"
                                          onChange={onChange}
                                          control={<Radio />}
                                          label="Prov_DD"
                                          labelPlacement="start"
                                        />
                                        <FormControlLabel
                                          disabled={
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR
                                          }
                                          value="false"
                                          onChange={onChange}
                                          control={<Radio />}
                                          label="Formal DD2"
                                          labelPlacement="start"
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  )}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Lot_Size_Original :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={1}>
                                <Controller
                                  name="lotSizeOriginal"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.lotSizeOriginal}
                                        helperText={errors.lotSizeOriginal?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCellLabel}>Lot_Size_Amended 1 :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={1}>
                                <Controller
                                  name="lotSizeAmmended1"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCellLabel}>Lot_Size_Amended 2 :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={1}>
                                <Controller
                                  name="lotSizeAmmended2"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        // error={!!errors.lotSizeAmmended2}
                                        // helperText={
                                        //   errors.lotSizeAmmended2?.message
                                        // }
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Total_line_items_PO :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="totalLineItemsPo"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.totalLineItemsPo}
                                        helperText={errors.totalLineItemsPo?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCellLabel}>Total_Value_line_items_PO :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="totalValueLineItemsPo"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.totalValueLineItemsPo}
                                        helperText={errors.totalValueLineItemsPo?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Total_Inotes/CC issued :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="totalInotesCcIssued"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        onInput={restrict.remarks}
                                        value={value}
                                        error={!!errors.totalInotesCcIssued}
                                        helperText={errors.totalInotesCcIssued?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCellLabel}>Completed_lot_size :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="completedLotSize"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        onInput={restrict.remarks}
                                        value={value}
                                        error={!!errors.completedLotSize}
                                        helperText={errors.completedLotSize?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>No_Line_items_supplied :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={5}>
                                <Controller
                                  name="noLineItemsSupplied"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.noLineItemsSupplied}
                                        helperText={errors.noLineItemsSupplied?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>No_Line_items_in_OL :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="noLineItemsOl"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.noLineItemsOl}
                                        helperText={errors.noLineItemsOl?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCellLabel}>Value_offered_in_OL :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="valueOfferedOl"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.valueOfferedOl}
                                        helperText={errors.valueOfferedOl?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>No_Line_items_clrd_in_OL :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="noLineItemsClrdOl"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.noLineItemsClrdOl}
                                        helperText={errors.noLineItemsClrdOl?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCellLabel}>Value_clrd_in_OL :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="valueClrdOl"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter the Value"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.valueOfferedOl}
                                        helperText={errors.valueOfferedOl?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Inspector Name & Desig :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={3}>
                                {" "}
                                <Controller
                                  name="inspectorName"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter Inspector Name"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.inspectorName}
                                        helperText={errors.inspectorName?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                                {/* {records?.inspectorName} */}
                              </StyledTableCell>

                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="inspectorDesignation"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter Designation"
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.inspectorDesignation}
                                        helperText={errors.inspectorDesignation?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>QAP_Ref :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={5}>
                                <Controller
                                  name="qapRef"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          readOnly:
                                            isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                        }}
                                        placeholder="Enter QAP_Ref "
                                        size="small"
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors.qapRef}
                                        helperText={errors.qapRef?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel} rowSpan={2}>
                                Type of Inspections :
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="inspDocVerify"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <FormControlLabel
                                        value="Insp Doc verify"
                                        control={
                                          <Checkbox
                                            disabled={
                                              isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR
                                            }
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                            color="secondary"
                                            checked={value}
                                          />
                                        }
                                        label="Insp Doc verify"
                                        labelPlacement="Start"
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="inspElec"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <FormControlLabel
                                        value="Insp Elec"
                                        control={
                                          <Checkbox
                                            disabled={
                                              isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR
                                            }
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                            color="secondary"
                                            checked={value}
                                          />
                                        }
                                        label="Insp Elec"
                                        labelPlacement="Start"
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="inspEt"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <FormControlLabel
                                        disabled={isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                                        value="Insp ET"
                                        control={
                                          <Checkbox
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                            color="secondary"
                                            checked={value}
                                          />
                                        }
                                        label="Insp ET"
                                        labelPlacement="Start"
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="inspFats"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <FormControlLabel
                                        disabled={isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                                        value="Insp FATs"
                                        control={
                                          <Checkbox
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                            color="secondary"
                                            checked={value}
                                          />
                                        }
                                        label="Insp FATs"
                                        labelPlacement="Start"
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="inspPdi"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <FormControlLabel
                                        disabled={isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                                        value="Insp PDI"
                                        control={
                                          <Checkbox
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                            color="secondary"
                                            checked={value}
                                          />
                                        }
                                        label="Insp PDI"
                                        labelPlacement="Start"
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="inspPhysical"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <FormControlLabel
                                        disabled={isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                                        value="Insp Physical"
                                        control={
                                          <Checkbox
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                            color="secondary"
                                            checked={value}
                                          />
                                        }
                                        label="Insp Physical"
                                        labelPlacement="Start"
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="inspEss"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <FormControlLabel
                                        disabled={isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                                        value="Insp ESS"
                                        control={
                                          <Checkbox
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                            color="secondary"
                                            checked={value}
                                          />
                                        }
                                        label="Insp ESS"
                                        labelPlacement="Start"
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name="inspEmiEmc"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <FormControlLabel
                                        disabled={isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                                        value="Insp EMI_EMC"
                                        control={
                                          <Checkbox
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                            color="secondary"
                                            checked={value}
                                          />
                                        }
                                        label="Insp EMI_EMC"
                                        labelPlacement="Start"
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="inspEndurance"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <FormControlLabel
                                        disabled={isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR}
                                        value="Insp Endurance"
                                        control={
                                          <Checkbox
                                            onChange={(e) => {
                                              onChange(e.target.checked);
                                            }}
                                            color="secondary"
                                            checked={value}
                                          />
                                        }
                                        label="Insp Endurance"
                                        labelPlacement="Start"
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                            <TableRow>
                              <StyledTableCell className={classes.tableCellLabel}>Insp_Start :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="inspectionStartDate"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          inputProps: {
                                            max: moment().format("yyyy-MM-DD"),
                                            readOnly:
                                              isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                          },
                                        }}
                                        size="small"
                                        type="date"
                                        onChange={onChange}
                                        value={value ? moment(value).format("yyyy-MM-DD") : null}
                                        error={!!errors.inspectionStartDate}
                                        helperText={errors.inspectionStartDate?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCellLabel}>Insp_Comp :</StyledTableCell>
                              <StyledTableCell className={classes.tableCell} colSpan={2}>
                                <Controller
                                  name="inspectionCompleteDate"
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextField
                                        InputProps={{
                                          inputProps: {
                                            max: moment().format("yyyy-MM-DD"),
                                            min: moment(watch("inspectionStartDate")).format("yyyy-MM-DD"),
                                            readOnly:
                                              isEdit || !hasEditAccessInspector || loggedInUser?.roleId !== USER_ROLE_ID.ROLE_INSPECTOR,
                                          },
                                        }}
                                        // InputProps={{inputProps: {max: moment().format("yyyy-MM-DD")} }}
                                        size="small"
                                        type="date"
                                        onChange={onChange}
                                        value={value ? moment(value).format("yyyy-MM-DD") : null}
                                        error={!!errors.inspectionCompleteDate}
                                        helperText={errors.inspectionCompleteDate?.message}
                                      />
                                    );
                                  }}
                                ></Controller>
                              </StyledTableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        {recordsAfterPagingAndSorting()?.length != 0 && recordsAfterPagingAndSorting()?.length != undefined ? (
                          <TblPagination />
                        ) : (
                          ""
                        )}

                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={classes.mt3} style={{ padding: "12px" }} align="right">
                          {loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR && (
                            <ActionButton
                              //  variant="contained"
                              variant="outlined"
                              size="small"
                              color="primary"
                              className={classes.button}
                              startIcon={<AddCircleIcon />}
                              onClick={() => {
                                setOpenConsession(true);
                                // console.log("soObjid", rowData.id);
                              }}
                            >
                              Add Concession Details
                            </ActionButton>
                          )}
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={classes.mt3} style={{ padding: "12px" }} align="left">
                          {loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR && (
                            <ActionButton
                              //  variant="contained"
                              variant="outlined"
                              size="small"
                              color="primary"
                              startIcon={<AddCircleIcon />}
                              className={classes.button}
                              onClick={() => {
                                setOpenDilg(true);
                                console.log("openDialog", openDilg);
                              }}
                            >
                              Add Hologram Details
                            </ActionButton>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
                <Grid xs={6} sm={6} md={6} lg={6} xl={6} align="right" style={{ marginTop: "20px" }}>
                  {loggedInUser?.roleId === 7 && (
                    <ActionButton
                      variant="contained"
                      color="primary"
                      //validation
                      disabled={saveDraft || records?.isQinCompleted === false}
                      className={isremark ? "" : classes.hide}
                      onClick={() => {
                        setIsSubmit(false);
                        executeSave(getValues());
                      }}
                    >
                      {" "}
                      {saveDraft && <CircularProgress size={24} className={classes.buttonProgress} />} &nbsp; SAVE DRAFT
                    </ActionButton>
                  )}
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  {remarkList?.map((item) => (
                    <>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                          {item.designation != null ? item.designation.toLocaleUpperCase() : null}
                          _REMARKS: {"    "}
                          {item.olStatus == 1 ? (
                            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 15, color: "#15d13a" }} />
                          ) : (
                            <FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: 15, color: "#e13333" }} />
                          )}
                        </Typography>
                        <Grid container justifyContent="flex-end">
                          <Typography variant="caption" style={{ marginRight: "30px" }}>
                            NOTE No : {item.noteNo ? item.noteNo : "NA"}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          style={{
                            border: "1px solid",
                            borderRadius: "4px",
                            padding: "8px",
                          }}
                          dangerouslySetInnerHTML={{ __html: item.remarks }}
                        ></div>
                      </Grid>
                      <Grid item xs={12}>
                        {item.uploadedFiles && <DownloadResponse data={item.uploadedFiles} />}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ paddingLeft: "70%" }}>
                        <br />
                        <br />

                        <Typography className={classes.subHeading}>
                          OFFICER NAME : {item.approvedByStr != null ? item.approvedByStr.toLocaleUpperCase() : null}
                        </Typography>
                        <Typography className={classes.subHeading}>
                          OFFICER Designation : {item.approverDesignation != null ? item.approverDesignation.toLocaleUpperCase() : null}
                        </Typography>
                        <Typography className={classes.subHeading}>
                          DATE : {item.createdDate ? moment(item.createdDate).format("DD-MM-yyyy") : null}
                        </Typography>
                      </Grid>
                    </>
                  ))}
                  {appvrDate && (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography>
                        <span style={{ fontWeight: 400 }}>Approval Date: {appvrDate ? moment(appvrDate).format("DD-MM-yyyy") : "NA"}</span>
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                {renderRoleBasedContent()}
              </paper>
            </>
          )}
        </form>
      </div>
    </>
  );
}
