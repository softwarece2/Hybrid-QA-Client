/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";

//material-ui
import {
  makeStyles,
  Grid,
  Dialog,

  Typography,
  TableRow,
  Table,
  LinearProgress,
  CircularProgress,
  TableContainer,
  TextField,
  DialogActions,
  TableBody,
  TableCell
} from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";

import MuiDialogContent from "@material-ui/core/DialogActions";




//components
// import Button from "../../../components/Button";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";

//pages

import {  getInoteNos } from "pages/Services/URLs";
import { useDispatch } from "react-redux";


import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import { updateNotenos } from "Redux/Actions/SupplyOrder/OLAction";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import useTable, { StyledTableCell } from "components/UseTable";
import Button from "components/Button";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  padding: {
    [theme.breakpoints.down("sm")]: {
      padding: "4px 0px 8px 8px",
    },
    [theme.breakpoints.down("lg")]: {
      // padding: "4px 0px 8px 8px",
    },
  },
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));



const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { label: "Sl No", field: "partNo", align: "left", disableSorting: true },
  { label: "Offer Letter Number", field: "olNumbers", align: "left", disableSorting: true },
  { label: "Consignee Name", field: "consigneeName", align: "left", disableSorting: true },
  { label: "I-Note Number", field: "inoteNo", align: "left", disableSorting: true },
];
const defaultValues = {
  inoteNo: "",
};
export default function InoteNumber({ fileNoteId,onClose, }) {
  const classes = useStyles();
  const dispatch = useDispatch();


  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  // console.log("this is dialogue", selectedSoId);


  const { TblHead} = useTable(records, headCells);
  const {
    handleSubmit,
 
    setValue,
    getValues,
    control,


  } = useForm({
    defaultValues,
    //resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { fields } = useFieldArray({
    control,
    name: "inoteNumberDet",
  });

  const getBySupplyOrder = () => {
    setLoading(true);
    axiosInstanceT
      .get(getInoteNos + fileNoteId)
      .then(({ data }) => {
        const MappedData = data?.map((item) => ({
          id: item.fileNoteId,
          olNumbers: item.olNumbers,
          inoteNo: item.inoteNo,
          olIds:item.olIds	,
          consigneeName: item.consigneeName,
        }));
        setValue("inoteNumberDet", MappedData)
        setRecords(data);

        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  console.log("this is get", records);

  React.useEffect(() => {
    getBySupplyOrder();
  }, [fileNoteId]);

  const onFormSubmit = (data) => {
    setLoading(true);
    // const arrayList = inputString.split(",").map(num => parseInt(num.trim()));
    // console.log(arrayList); 
    const value = 
    
     data?.inoteNumberDet?.map((item) => ({
        fileNoteId: item?.id,
        offerLetterIds:item?.olIds.split(",").map(num => parseInt(num.trim())),
        newINoteNo: item?.inoteNo,
      }))
    ;
    dispatch(updateNotenos(value))
      .then(() => {
        onClose();
        toast.success("Data Successfully Updated.")
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));
  };
  return (

      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        maxWidth="lg"
        fullWidth
        open
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title887" {...props} />
        )}>
        <DialogTitle
          id="draggable-dialog-title887"
          style={{ position: "sticky", top: 0, zIndex: 2, cursor: "move" }}
          onClose={onClose}>
          Generated I-Note NOs:
        </DialogTitle>

        <DialogContent dividers style={{ position: "relative" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>

            </Grid>

            <TableContainer style={{ maxHeight: "600px" }}>
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
                  {records.length>0?
                fields?.map((input, index) => (
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.value}>{index + 1}</Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.value}> {input?.olNumbers}</Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <Typography className={classes.value}>{input?.consigneeName}</Typography>
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell} style={{ padding: 10 }}>
                        <Controller
                          name={`inoteNumberDet[${index}].inoteNo`}
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                size="small"
                                onChange={onChange}
                                value={value}
                              />
                            );
                          }}
                        ></Controller>{" "}
                      </StyledTableCell>

                    </TableRow>
                  )):
                  <TableRow>
                    <TableCell>I-Note number will be available once JCQAO Approves</TableCell>
                  </TableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit(onFormSubmit)}
            text="Print"
            variant="contained"
            color="primary"
            disabled={!getValues("inoteNumberDet")?.every((e) => e?.inoteNo!== "")||!records?.length>0}

          >
            {loadingDraft && (
              <CircularProgress
                size={24}
                className={classes.buttonProgress}
          
              />
            )}
            Update
          </Button>

          <Button variant="contained" color="secondary" onClick={onClose} type="submit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

  );
}
