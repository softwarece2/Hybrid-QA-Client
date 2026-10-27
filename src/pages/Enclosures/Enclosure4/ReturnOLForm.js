/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";

//material-ui
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { WING_ID } from "../../../Globals";
//components
import Button from "components/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { submitScrutinyOL } from "Redux/Actions/Enclosure/CheckScrutinyOLAction";
import { PaperComponent } from "Utils/D3Tree";
import useTable, { StyledTableCell, StyledTableRow } from "../../../components/UseTable";

const useStyles = makeStyles((theme) => ({
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
 
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  buttonImport: {
    backgroundColor: "#E0F7FE",
    color: theme.palette.common.black,
    "&:hover, &:focus": {
      color: theme.palette.common.black,
      background: "#E0F7FE",
    },
  },
}));

export default function ReturnOLForm({ open, setOpen, obj, inObj, idVal, data, getData }) {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const user = useSelector((store) => store.loggedInUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [save, setSave] = useState(false);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const SetCloseDialog = () => {
    setSave(false);
  };
  console.log("hdfgw", obj);
  const { TblContainer,  TblPagination, recordsAfterPagingAndSorting} = useTable(records);
  const {
    handleSubmit,
  } = useForm({
    //  defaultValues,
    //  resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onFormSubmit = () => {
    setLoading(true);
    const value = {
      id: idVal,
      offerLetterId: inObj,
      createdBy: user.empId,
      isReturnOL: true,

      inspOlIbDetDtos: data.scrutinyOlMainDet?.map((item) => ({
        id: item.id,
        checklistId: item.checklistId,
        obsSts: item.obsSts === "true" ? "yes" : item.obsSts === "false" ? "no" : "",
        obsType: item.obsType,
        remarks: item.remarks,
      })),
    };

    dispatch(submitScrutinyOL(value))
      .then((res) => {
        setRecords(res?.inspOlIbDetDtos);
        console.log("start");
        setLoading(false);
        setSave(false);
        setOpen(false);
        getData();
        console.log("stfgrgart");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const filteredinspOlIbDetDtos = data?.scrutinyOlMainDet?.filter((item) => item.obsSts == "false");

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        PaperComponent={(props) => <PaperComponent id="draggable-dialog-title17" {...props} />}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title17">
          RETURN OF {isArmy ? "QACL" : "Offering Letter"}
        </DialogTitle>
        <DialogContent>
          <p> Sir,</p>
          <p> The above mentioned Offering Letter is hereby returned Unactioned for following reasons:-</p>

          <Paper>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                <Grid container>
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
                      <TableBody>
                        {filteredinspOlIbDetDtos?.map((item, index) => (
                          <>
                            <StyledTableRow key={index}>
                              <StyledTableCell className={classes.remarks}>{index + 1}</StyledTableCell>
                              <StyledTableCell className={classes.remarks}>{item.remarks}</StyledTableCell>
                            </StyledTableRow>
                          </>
                        ))}
                      </TableBody>

                      {/* <TableBody>
                        <StyledTableRow>
                          <StyledTableCell className={classes.tableCell}>
                            1.
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            Merged with OL 119573
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableBody> */}
                    </Table>
                    {recordsAfterPagingAndSorting()?.length != 0 &&
                    recordsAfterPagingAndSorting()?.length != undefined ? (
                      <TblPagination />
                    ) : (
                      ""
                    )}
                  </TblContainer>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <Dialog open={save} onClose={() => setOpen(false)} maxWidth="lg">
          <DialogContent>
            <Typography variant="h6">Are you sure you want to Return {isArmy ? "QACL" : "OL"}?</Typography>
          </DialogContent>
          <DialogActions classes={{ root: classes.center }}>
            <Button
              onClick={handleSubmit(onFormSubmit)}
              color="primary"
              variant="contained"
              size="small"
              disabled={loading}
            >
              {loading && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />} &nbsp; Yes
            </Button>
            <Button onClick={SetCloseDialog} color="secondary" variant="contained" size="small">
              No
            </Button>
          </DialogActions>
        </Dialog>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => setSave(true)} type="submit">
            Submit
          </Button>

          <Button variant="contained" color="primary" onClick={() => setOpen(false)} type="submit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
