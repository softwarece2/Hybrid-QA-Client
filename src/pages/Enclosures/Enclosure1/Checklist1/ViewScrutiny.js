/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState,useRef,useEffect } from "react";

//material-ui
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, Grid, FormHelperText, Radio, RadioGroup, TableContainer, Table, TableHead, TableBody, Typography, FormControlLabel, } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import "jspdf-autotable";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {  useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import * as yup from "yup";
import { USER_ROLE_ID } from "../../../../Globals.js";
//components
import Button from "components/Button";
import { restrict } from "restrict";
//redux
import { PaperComponent } from "Utils/D3Tree";
import TextField from "../../../../components/TextField";
import { StyledTableCell, StyledTableRow } from "../../../../components/UseTable";
import LinearProgress from "@material-ui/core/LinearProgress";
import axiosInstance from "pages/Services/AxiosInstanceTransaction.js";
import { scrutinyTenderTender } from "pages/Services/URLs.js";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  size: {
    width: 15,
    height: 15,
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: "100%",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  remarks: {
    width: 600,
    [theme.breakpoints.down("lg")]: {
      width: 400,
    },
  },
  tableCellRadio: {
    width: 200,
    [theme.breakpoints.down("lg")]: {
      width: 100,
    },
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  draft: {
    fontSize: "0.875rem",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
}));
 const arraySchema = yup.object().shape({
  actionReference: yup.string().trim().nullable(),
  obsSts: yup.string().trim().required("Required"),
  remarks: yup
    .string()
    .trim()
    .when("obsSts", (obsSts) => {
      if (obsSts[0] === "no") {
        return yup.string().trim().required("Required").typeError("Required");
      }
    }),
});

const schema = yup.object().shape({
  scrutinyTenderDetDtos: yup
    .array()
    .of(arraySchema)
    .required("Must have fields"),
});


const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { id: "slNo", label: "SI.No", align: "left", disableSorting: true },
  {
    id: "reference",
    label: "Aspects to be checked",
    align: "left",
    disableSorting: true,
  },
  {
    id: "obsSts",
    label: "Observation",
    align: "left",
    disableSorting: true,
  },
  {
    id: "remarks",
    label: "Remarks",
    align: "left",
    disableSorting: true,
  },
  {
    id: "actionAndRef",
    label: "Action Reference",
    align: "left",
    disableSorting: true,
  },
];

export default function ViewScrutiny({ sbuAdmin, soObj, open, setOpen, inObj }) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [openScrutinyView, setOpenScrutinyView] = useState(false);
  const componentRef = React.useRef(null);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);

  const [responseData, setResponseData] = useState(null);
  const defaultValues = {
    scrutinyTenderDetDtos: [],
  };
  const {
 
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: "scrutinyTenderDetDtos",
  });
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance(scrutinyTenderTender + inObj.id);
      reset({
        ...data, scrutinyTenderDetDtos: data.scrutinyTenderDetDtos?.map((el) => ({
          ...el,
          obsSts: el?.obsSts === "no" ? "no" : el?.obsSts === "yes" ? "yes" : "yes",
        })),
      });
      setResponseData(data);
    } catch (error) {
      console.log("error");
      console.log("errorqq", inObj);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }

    // }
  };

  React.useEffect(() => {
    getData();
  }, []);


   const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    
  });

  return (
    <div className={classes.root} >
    
      <Dialog
        open={open}
        maxWidth="lg"
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title432" {...props} />
          
      
        )}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title432"
        >
          Checklist for Scrutiny of supply order
        </DialogTitle>

        <DialogContent> 
        <div ref={componentRef}>       
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
              <Typography className={classes.heading}>
                SQAEL/SEC/ANVIII/7.5.3/FRM-28444
              </Typography>
              <Typography className={classes.heading}>
                Scrutiny of Supply Order/Acceptance of Tender/Contracts
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} style={{ paddingBlock: "15px" }}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Typography style={{ fontSize: "0.875rem" }}>
                <span style={{ fontWeight: 500 }}>File No. : </span>
                {inObj?.fileNo}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Typography style={{ fontSize: "0.875rem" }}>
                <span style={{ fontWeight: 500 }}>SO/AT No. :</span>{" "}
                {inObj?.orderNo}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography style={{ fontSize: "0.875rem" }}>
                <span style={{ fontWeight: 500 }}>Applicable To : </span>{" "}
                Army/ Air Force/ Navy/ DGOF/ DGBR/ Para Military/ Engr Regt/ Civil Govt
              </Typography>
            </Grid>
          </Grid>
          {loading && <LinearProgress />}
          {responseData && (
            <>
             
             <TableContainer
              >
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
                      {headCells.map((el) => (
                        <StyledTableCell key={el.id}>{el.label}</StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {fields?.map((item, index) => (
                      <>
                        <StyledTableRow>
                          <StyledTableCell className={classes.tableCell}>
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {item.reference}
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            style={{ width: "150px" }}
                          >
                            <Controller
                              control={control}
                              name={`scrutinyTenderDetDtos[${index}].obsSts`}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={value}
                                    row
                                    onChange={onChange}
                                  >
                                    <FormControlLabel
                                      value="yes"
                                      control={<Radio />}
                                      label="Yes"
                                      disabled={
                                        responseData?.submittedDatetime ||
                                        user_role !==
                                        USER_ROLE_ID.ROLE_INSPECTOR
                                      }
                                    />
                                    <FormControlLabel
                                      value="no"
                                      control={<Radio />}
                                      label="No"
                                      disabled={
                                        responseData?.submittedDatetime ||
                                        user_role !==
                                        USER_ROLE_ID.ROLE_INSPECTOR
                                      }
                                    />
                                  </RadioGroup>
                                  <FormHelperText
                                    error={
                                      !!errors?.scrutinyTenderDetDtos?.[index]
                                        ?.obsSts
                                    }
                                  >
                                    {
                                      errors?.scrutinyTenderDetDtos?.[index]
                                        ?.obsSts?.message
                                    }
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            style={{ width: "200px" }}
                          >
                            <Controller
                              control={control}
                              name={`scrutinyTenderDetDtos[${index}].remarks`}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  value={value}
                                  size="small"
                                  multiline
                                  disabled={sbuAdmin}
                                  inputProps={{
                                    readOnly:
                                      responseData?.submittedDatetime ||
                                      user_role !==
                                      USER_ROLE_ID.ROLE_INSPECTOR,
                                    maxLength: 500,
                                  }}
                                  placeholder="Observation"
                                  onInput={restrict.general}
                                  error={
                                    !!errors?.scrutinyTenderDetDtos?.[index]
                                      ?.remarks
                                  }
                                  helperText={
                                    errors?.scrutinyTenderDetDtos?.[index]
                                      ?.remarks?.message
                                  }
                                />
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.remarks}
                            style={{ width: "200px" }}
                          >
                            <Controller
                              control={control}
                              name={`scrutinyTenderDetDtos[${index}].actionAndRef`}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  fullWidth
                                  value={value}
                                  size="small"
                                  multiline
                                  inputProps={{
                                    readOnly:
                                      responseData?.submittedDatetime ||
                                      user_role !==
                                      USER_ROLE_ID.ROLE_INSPECTOR,
                                    maxLength: 500,
                                  }}
                                  placeholder="Action Reference"
                                  onInput={restrict.general}
                                  error={
                                    !!errors?.scrutinyTenderDetDtos?.[index]
                                      ?.actionReference
                                  }
                                  helperText={
                                    errors?.scrutinyTenderDetDtos?.[index]
                                      ?.actionReference?.message
                                  }
                                />
                              )}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid
                container
                spacing={0}
                style={{ paddingTop: 15, paddingBottom: 10 }}
              >
                <Grid item xs={7} sm={7} md={7} lg={7} xl={9} align="right" />

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">


                  {responseData?.submittedDatetime &&
                    user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setOpenScrutinyView(true);
                        }}
                      >
                        Preview
                      </Button>
                    )}
                </Grid>
              </Grid>
           </>
          )}
          </div>
        </DialogContent>

        <DialogActions>
           
          <Button
            onClick={handlePrint}
            text="Print"
            variant="contained"
            color="primary"
            type="button"
      
          >
            Print
          </Button>
           
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(false)}
            type="submit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
   
  );
}
