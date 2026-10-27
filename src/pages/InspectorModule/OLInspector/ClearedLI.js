/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, {  useState } from "react";
import { restrict } from "restrict";
import * as yup from "yup";

//material-ui
import {
  Dialog,
  Table,
  TableBody,
  withStyles,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

//components
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button";
import "jspdf-autotable";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  getLineItemClr,
  updateClearedLI,
} from "Redux/Actions/Enclosure/CheckScrutinyOLAction";
import TextField from "../../../components/TextField";
import useTable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/UseTable";

import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import IconButton from "@material-ui/core/IconButton";
import { PaperComponent } from "Utils/D3Tree";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { DialogTitle } from "Utils";
import VideoInspection from "video/cv2";
const useStyles = makeStyles((theme) => ({
  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
}));

const headCells = [
  {
    id: "soLineItemNo",
    label: "Line Item/ Indent Sl No.",
    align: "left",
    disableSorting: true,
  },
  {
    id: "partNo",
    label: "Material Number",
    align: "left",
    disableSorting: true,
  },
  {
    id: "description",
    label: "Material Description",
    align: "left",
    disableSorting: true,
  },
  {
    id: "offeredQty",
    label: "Offered Qty",
    align: "left",
    disableSorting: true,
  },
  {
    id: "clearedQty",
    label: "Cleared Qty",
    align: "left",
    disableSorting: true,
  },
  {
    id: "video",
    label: "Video",
    align: "left",
    disableSorting: true,
  },
];
const defaultArray = {
  id: 0,
  clearedQty: "",
};
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
  clearedQty: yup
    .string()
    .trim()
    .required("Required")
    .typeError("Required")
    .when("offeredQty", (offeredQty) => {
      if (offeredQty) {
        return yup
          .number()
          .typeError("Required")
          .required("Required")
          .max(
            offeredQty,
            `Cleared Qty should be less than or equals to ${offeredQty}`
          );
        // .max(avlQty, "Total must be less than available")
      }
    }),
});

const schema = yup.object().shape({
  clearedOlLineitemDet: yup
    .array()
    .of(arraySchema)
    .required("Must have fields"),
});
const defaultValues = {
  clearedOlLineitemDet: [defaultArray],
};

const ClearedLI = ({ soObj, onClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const [records, setRecords] = useState([]);
  const [enable, setEnable] = useState();
  const [idVal, setIdVal] = React.useState(null);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [responseData, setResponseData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLI, setSelectedLI] = useState(null);

  const { TblContainer, TblHead } = useTable(records, headCells, filterFn);

  const { handleSubmit, setValue, control } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: "clearedOlLineitemDet",
  });

  const getData = () => {
    setLoading(true);
    dispatch(getLineItemClr(soObj?.id))
      .then((res) => {
        console.log("res", res);
        setIdVal(res?.id);
        setRecords(res);
        if (res !== 0) {
          const MappedData = res.map((item) => ({
            id: item.id,
            soLineItemNo: item?.soLineItemNo,
            partNo: item?.partNo,
            description: item?.description,
            offeredQty: item?.offeredQty,
            clearedQty: item.clearedQty || null,
          }));

          setValue("clearedOlLineitemDet", MappedData);
          setEnable(false);
        }
        setResponseData(res);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    getData();
  }, []);

  ////  Submit form
  const onFormSubmit = (data) => {
    const value = data.clearedOlLineitemDet?.map((item) => ({
      id: item.id,
      clearedQty: item.clearedQty,
    }));
    console.log(value);
    dispatch(updateClearedLI(value))
      .then((res) => {
        getData();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          id="draggable-dialog-title12"
          style={{ fontSize: "12px", cursor: "move" }}
        >
          Offered Qty
        </DialogTitle>
        <DialogContent>
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
                  <StyledTableRow key={item.id}>
                    <StyledTableCell className={classes.tableCell}>
                      {item.soLineItemNo}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {item.partNo}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {item.description}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {item.offeredQty}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Controller
                        control={control}
                        name={`clearedOlLineitemDet[${index}].clearedQty`}
                        render={({
                          field: { value, onChange },
                          formState: { errors },
                        }) => (
                          <TextField
                            onChange={(e) => {
                              onChange(e);
                            }}
                            value={value}
                            size="small"
                            inputProps={{
                              maxLength: 200,
                            }}
                            placeholder="Cleared Qty"
                            onInput={restrict.digit}
                            error={
                              !!errors?.clearedOlLineitemDet?.[index]
                                ?.clearedQty
                            }
                            helperText={
                              errors?.clearedOlLineitemDet?.[index]?.clearedQty
                                ?.message
                            }
                          />
                        )}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        onClick={(e) => {
                          setOpenDialog(true);
                          setSelectedLI(item);
                        }}
                        edge="start"
                        color="inherit"
                      >
                        <VideocamOutlinedIcon style={{ fontSize: "1.8rem" }} />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TblContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="default">
            Close
          </Button>
          <Button
            onClick={handleSubmit(onFormSubmit)}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {openDialog && (
        <Dialog
          aria-labelledby="manage-table-columns"
          open
          maxWidth="lg"
          fullWidth
          PaperComponent={(props) => (
            <PaperComponent id="draggable-dialog-title12" {...props} />
          )}
        >
          <DialogTitle
            id="draggable-dialog-title12"
            style={{ fontSize: "12px", cursor: "move" }}
          >
            Video Inspection
          </DialogTitle>
          <DialogContent>
            <VideoInspection
              olNumber={soObj?.name}
              lineItemNo={selectedLI?.soLineItemNo}
            />
          </DialogContent>
          <DialogActions>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => {
                setOpenDialog(false);
                setSelectedLI(null);
              }}
            >
              close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
export default ClearedLI;
