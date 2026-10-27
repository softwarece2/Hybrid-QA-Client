/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect,  useState } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";

//material-ui
import {
  CircularProgress,
  Dialog,
  Grid,
  Table,
  TableBody,
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
import useTable, { StyledTableCell, StyledTableRow } from "components/UseTable";
import {
  getOlConcessionById,
  saveOLConcession,
} from "Redux/Actions/SupplyOrder/OLAction";
import { useDispatch, useSelector } from "react-redux";
import { USER_ROLE_ID } from "../../../Globals";
import { PaperComponent } from "Utils/D3Tree";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  radioBtn: {
    "& .MuiTypography-body1": {
      fontSize: "0.875rem",
    },
  },
  remarks: {
    // width: 600,
    [theme.breakpoints.down("xl")]: {
      // width: 400,
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
}));

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
  concession: yup.string().required("Required").typeError("Required"),
  affectedItemRef: yup.string().required("Required").typeError("Required"),
  concessionDetails: yup.string().required("Required").typeError("Required"),
  authority: yup.string().required("Required").typeError("Required"),
});
const schema = yup.object().shape({
  concessionTableDet: yup.array().of(arraySchema).required("Must have fields"),
});

const defaultArray = () => ({
  concession: "",
  affectedItemRef: "",
  concessionDetails: "",
  authority: "",
  offerLetterId: "",
  createdBy: "",
});

const defaultValues = {
  concessionTableDet: [defaultArray],
};

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },

  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    label: "OL Number",
    field: "olNumber",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Concession/Deviations",
    field: "concession",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Affected Items Ref and Drg. No.",
    field: "affectedItemRef",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Brief Details of Concession/Deviations",
    field: "concessionDetails",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Authority for concessions/Deviations and Date",
    field: "authority",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    // label: "Authority for concessions/Deviations and Date",
    // field: "authority",
    align: "left",
    disableSorting: true,
  },
];

export default function ConcessionTable({ open, setOpen, olIds, olNumber,ols }) {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState([]);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const {

    handleSubmit,
    trigger,

    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const dispatch = useDispatch();
  const {
    TblContainer,
    TblHead,
  } = useTable(records, headCells);
  const [inputList, setInputList] = useState([
    {
      data: "",
    },
  ]);

  const count = 1;
  const { remove } = useFieldArray({
    control,
    name: "concessionTableDet",
  });

  const onFormSubmit = (data) => {
    console.log("saving fcl...", data);
    const value = data.concessionTableDet?.map((item) => ({
      concession: item?.concession,
      affectedItemRef: item?.affectedItemRef,
      concessionDetails: item?.concessionDetails,
      authority: item?.authority,
      offerLetterId: item?.offerLetterId?.id,
      createdBy: loggedInUser?.empId,
    }));

    console.log("saving concession payload...", value,ols);
    dispatch(saveOLConcession(value))
      .then((res) => {
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
    remove(index, 1);
    //resetform();
  };
  console.log("rhrhr", inputList);
  const handleListAdd = () => {
    console.log("rhrhr", inputList);
    setInputList([
      ...inputList,
      {
        data: "",
        count: count + 1,
      },
    ]);
  };

  useEffect(() => {const queryString = olIds?.map(id => `olIds=${id}`).join('&');
    dispatch(getOlConcessionById(queryString)).then((data) => {
      console.log("dgshgdshe", data);
      setRecord(data);
      // reset(data)
    });
  }, []);
  console.log("getvalues", getValues(), errors);
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title2" {...props} />
        )}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title2">
          Offer Letter Number: {olNumber}
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
                style={{ margin: "auto", overflowX: "auto" }}>
                <TblContainer style={{ maxHeight: "600px" }}>
                  {/* {loading && <LinearProgress />} */}
                  <Table
                    style={{
                      position: "relative",
                      border: "1px solid lightgrey",
                    }}
                    size="small"
                    aria-label="simple table"
                    id="data-table-cleanliness-report">
                    {" "}
                    <TblHead />
                    {record?.length === 0 &&
                    loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR ? (
                      <TableBody>
                        {inputList?.map((input, index) => (
                          <StyledTableRow>
                            <StyledTableCell className={classes.remarks}>
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                            <Controller
                              name={`concessionTableDet[${index}].offerLetterId`}
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  // id="combo-box-demo"
                                  options={ols}
                                  onChange={(e, v) => {
                                    // e.preventDefault();
                                    onChange(v);
                                   
                                  }}
                                  value={value}
                                  getOptionLabel={(option) => option?.olNumber	}
                                  style={{ width: 200 }}
                                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                                />
                              )}
                            />
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                name={`concessionTableDet[${index}].concession`}
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                  return (
                                    <MultilineTextField
                                      size="small"
                                      style={{ paddingTop: 10 }}
                                      onChange={onChange}
                                      value={value}
                                      error={
                                        !!errors?.concessionTableDet?.[index]
                                          ?.concession
                                      }
                                      helperText={
                                        errors?.concessionTableDet?.[index]
                                          ?.concession?.message
                                      }
                                    />
                                  );
                                }}></Controller>
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                name={`concessionTableDet[${index}].affectedItemRef`}
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                  return (
                                    <MultilineTextField
                                      size="small"
                                      style={{ paddingTop: 10 }}
                                      onChange={onChange}
                                      value={value}
                                      error={
                                        !!errors?.concessionTableDet?.[index]
                                          ?.affectedItemRef
                                      }
                                      helperText={
                                        errors?.concessionTableDet?.[index]
                                          ?.affectedItemRef?.message
                                      }
                                    />
                                  );
                                }}></Controller>
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                name={`concessionTableDet[${index}].concessionDetails`}
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                  return (
                                    <MultilineTextField
                                      size="small"
                                      style={{ paddingTop: 10 }}
                                      onChange={onChange}
                                      value={value}
                                      error={
                                        !!errors?.concessionTableDet?.[index]
                                          ?.concessionDetails
                                      }
                                      helperText={
                                        errors?.concessionTableDet?.[index]
                                          ?.concessionDetails?.message
                                      }
                                    />
                                  );
                                }}></Controller>
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                name={`concessionTableDet[${index}].authority`}
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                  return (
                                    <MultilineTextField
                                      size="small"
                                      style={{ paddingTop: 10 }}
                                      onChange={onChange}
                                      value={value}
                                      error={
                                        !!errors?.concessionTableDet?.[index]
                                          ?.authority
                                      }
                                      helperText={
                                        errors?.concessionTableDet?.[index]
                                          ?.authority?.message
                                      }
                                    />
                                  );
                                }}></Controller>
                            </StyledTableCell>
                            <StyledTableCell className={classes.remarks}>
                              {index === 0 ? null : (
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => handleRemoveItem(index)}>
                                  <DeleteIcon className={classes.icon} />
                                </IconButton>
                              )}
                              {index + 1 !== count ? null : (
                                <Button
                                  startIcon={<AddCircleIcon />}
                                  variant="contained"
                                  color="primary"
                                  onClick={handleListAdd}>
                                  {" "}
                                  Add
                                </Button>
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <>
                        {record.length !== 0 ? (
                          <TableBody>
                            {record?.map((input, index) => (
                              <StyledTableRow>
                                <StyledTableCell className={classes.remarks}>
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  <Typography className={classes.subHeading}>
                                    {input?.olNumber}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  <Typography className={classes.subHeading}>
                                    {input?.concession}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  <Typography className={classes.subHeading}>
                                    {input?.affectedItemRef}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  <Typography className={classes.subHeading}>
                                    {input?.concessionDetails}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  <Typography className={classes.subHeading}>
                                    {input?.authority}
                                  </Typography>
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        ) : (
                          <StyledTableCell
                            className={classes.remarks}
                            colSpan={4}
                            align="center">
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              align="center">
                              <Typography className={classes.text}>
                                No Records To Display
                              </Typography>
                            </Grid>
                          </StyledTableCell>
                        )}{" "}
                      </>
                    )}
                  </Table>

                
                </TblContainer>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          {loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR && (
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={() => {
                console.log("triggerValidationres");
                trigger().then((res) => {
                  console.log("triggerValidation", res);
                  if (res) {
                    setOpenDialog(true);
                  }
                });
                //   setSelectedFile(null);
              }}
              disabled={record.length !== 0}>
              Submit
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpen(false);
              //   setSelectedFile(null);
            }}
            type="submit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={setOpenDialog} maxWidth="lg">
        <DialogContent>
          <Typography variant="h6">
            Are you sure you want to submit the data?
          </Typography>
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button
            onClick={handleSubmit(onFormSubmit)}
            color="primary"
            variant="contained"
            size="small"
            disabled={loadingDraft}>
            {loadingDraft && (
              <CircularProgress
                size={24}
                className={classes.buttonProgress}
                color="primary"
              />
            )}
            &nbsp; Yes
          </Button>
          <Button
            onClick={() => {
              setOpenDialog(false);
              //   setSelectedFile(null);
            }}
            color="secondary"
            variant="contained"
            size="small">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
