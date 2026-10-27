/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import "jspdf-autotable";
import React, { useState } from "react";
import { useReactToPrint } from "react-to-print";
import * as yup from "yup";

//material-ui
import {
  Dialog,
  DialogActions,
  Paper,
  Table,
  TableBody,
  Typography
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { DialogContent, DialogTitle } from "Utils";

//redux
import { headerValue } from "Globals.js";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  
  getFileClosingForms
} from "Redux/Actions/Enclosure/FileClosingFormAction";
//pages
import HeaderPdf from "pages/Layout/HeaderPdf";

//components
import Button from "components/Button";
import useTable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/UseTable";

//icons
import { PaperComponent } from "Utils/D3Tree";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    // padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 500,
  },
  subHeading: {
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  remarks: {
    width: 300,
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  space: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  tableCell: {
    border: "1px solid lightgrey",
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
  remarks: yup.string().trim().required("Required").typeError("Required"),
});

const defaultArray = () => ({
  id: 0,
  slNo: "",
  checklistId: "",
  obsSts: "",
  split: "false",
  remarks: "",
});

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { id: "claimId", label: "SL.No", align: "left", disableSorting: true },
  {
    id: "claimDate",
    label: "Check of Item",
    align: "left",
    disableSorting: true,
  },
  {
    id: "claimStatus",
    label: "Status",
    align: "left",
    disableSorting: true,
  },
  {
    id: "totalClaimedAmount",
    label: "Remarks",
    align: "left",
    disableSorting: true,
  },
];
const schema = yup.object().shape({
  fileDet: yup.array().of(arraySchema).required("Must have fields"),
});

export default function ViewFileClosing({ soObj, open, setOpen, fileDet }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const componentRef = React.useRef();

  const [records, setRecords] = useState([]);
  const [idVal, setIdVal] = React.useState(null);

  const checklists = useSelector(
    (store) => store.checklistFileCloseReducer.getCheckfile
  );
  const [filterFn, setFilterFn] = useState({
    fn: (items) => items,
  });
  const defaultValues = {
    fileDet: [defaultArray],
  };
  const {
    TblContainer,
    TblHead,
  
  } = useTable(records, headCells, filterFn);

  const {
  
    control,
    setValue,
 

  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { fields} = useFieldArray({
    control,
    name: "fileDet",
  });
  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item.id,
      slNo: item.slNo,
      checklistId: item.checklistId,
      remarks: item.remarks,
      reference: item.reference,
      split: item.split,
      obsSts: item.obsSts,
      obsType: item.obsType,
    }));
    // console.log(MappedData, records, "ad");
    setValue("fileDet", MappedData);
  }, [records, setValue]);

  React.useEffect(() => {
    dispatch(getFileClosingForms(soObj?.id))
      .then((res) => {
        setIdVal(res?.id);
        setRecords(res?.detDtos);
        setValue("fileDet", res?.detDtos);
        console.log("res", res);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

 


  console.log("CheckFile", checklists);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        maxWidth="lg"
        align="center"
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title9" {...props} />
        )}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title9"
        >
          File closing Form:IS/FRM/002
        </DialogTitle>
        {/* <DialogContent dividers style={{ padding: 12, position: "relative" }}
            <div ref={componentRef}> */}
        <DialogContent>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("fileClose")} />
            <Paper>
              <TblContainer style={{ maxHeight: "600px" }}>
                {loading && <LinearProgress />}
                <Table
                  style={{
                    position: "relative",
                    border: "1px solid lightgrey",
                  }}
                  size="small"
                  aria-label="simple table"
                  id="data-table-cleanliness-report"
                >
                  <TblHead />
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

                          <StyledTableCell className={classes.tableCell}>
                            <Controller
                              control={control}
                              name={`fileDet[${index}].obsSts`}
                              render={({ field: { value, onChange } }) => (
                                <Typography>{value}</Typography>
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <Controller
                              control={control}
                              name={`fileDet[${index}].remarks`}
                              render={({ field: { value, onChange } }) => (
                                <Typography>{value}</Typography>
                              )}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
                {/* {recordsAfterPagingAndSorting()?.length != 0 &&
                recordsAfterPagingAndSorting()?.length != undefined ? (
                  <TblPagination />
                ) : (
                  ""
                )} */}
              </TblContainer>
            </Paper>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary" space="2">
                Print
              </Button>
            )}
            content={() => componentRef}
          /> */}
          <Button
            text="Print"
            variant="contained"
            // className={classes.print}
            onClick={handlePrint}
            color="primary"
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
