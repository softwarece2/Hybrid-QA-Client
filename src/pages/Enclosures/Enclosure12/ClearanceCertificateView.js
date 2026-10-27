/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";

//material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Table,
  TableBody,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { headerValue } from "Globals.js";

//components
import Button from "components/Button";
import TextArea from "components/TextArea";
import moment from "moment";
import HeaderPdf from "pages/Layout/HeaderPdf";

import { useReactToPrint } from "react-to-print";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import useTable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/UseTable";

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
  buttonImport: {
    backgroundColor: "#E0F7FE",
    color: theme.palette.common.black,
    "&:hover, &:focus": {
      color: theme.palette.common.black,
      background: "#E0F7FE",
    },
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  remarks: {
    fontSize: "0.875rem",
    fontWeight: 400,
  },
  textArea: {
    resize: "none",
    userSelect: "none",
    pointerEvents: "none",
    border: "none",
    fontSize: "0.875rem",
    fontWeight: 300,
    // lineHeight: 1.5,
    color: "#000",
  },
  inputStyles: {
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase",
    textDecoration: "underline",
    textAlign: "center",
  },
}));
const textArea = {
  resize: "none",
  userSelect: "none",
  pointerEvents: "none",
  border: "none",
  fontSize: "0.875rem",
  fontWeight: 300,
  // lineHeight: 1.5,
  color: "#000",
};
const inputStyles = {
  fontSize: "14px",
  fontWeight: 600,
  textTransform: "uppercase",
  textDecoration: "underline",
  textAlign: "center",
};
const headCells = [
  // { id: "index", label: "S.No.", align: "left" },

  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "totalClaimedAmount",
    label: "Description",
    field: "description",
    align: "left",
    disableSorting: true,
  },
  {
    id: "claimDate",
    label: "Part No",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Unit SL .NO",
    field: "itemCategoryName",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Hologram No.10 ↑ N002 ",
    align: "left",
    disableSorting: true,
  },
  {
    label: "",
    align: "left",
    disableSorting: true,
  },
];

export default function ClearanceCertificateView({
  open,
  setOpen,
  data,
  val,
  title,
  signatory,
}) {
  const classes = useStyles();
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = React.useState(false);




  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,

  } = useTable(records, headCells);

  console.log("ghhrfg", data);
  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  return (
    <Dialog
      open={open}
      maxWidth="lg"
      fullWidth
      PaperComponent={(props) => (
        <PaperComponent id="draggable-dialog-title@aa" {...props} />
      )}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title@aa">
        CLEARANCE CERTIFICATE
      </DialogTitle>
      <DialogContent>
        <div ref={componentRef}>
          <HeaderPdf headerValue={headerValue("a")} />
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={5} lg={3} xl={3}>
              <style>
                {`@media print {.printbox,article{font-size: "0.875rem";}.MuiTypography-body1{font-size: "0.875rem" !important;} .printbox b{font-weight: 400;}  .printbox }`}
              </style>
              <TextArea
                value={data?.addressedTo}
                readOnly={true}
                placeholder="Address"
                labelText="Address"
                maxRows={45}
                variant="plain"
                style={textArea}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={6} xl={6}></Grid>
            <Grid item xs={12} sm={4} md={5} lg={3} xl={3}>
              <Typography className={classes.remarks}>
                Date :{" "}
                {data?.letterDate
                  ? moment(data?.letterDate).format("DD-MM-YYYY")
                  : ""}
              </Typography>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography style={inputStyles}> {title}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              {data?.input?.map((item, index) => (
                <>
                  <Typography className={classes.remarks}>
                    {index + 1}. {item.remarks}{" "}
                  </Typography>
                  <br />
                  {val === index + 1 && (
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

                              alignContent: "center",
                              //marginLeft:"100px",
                              maxWidth: "1000px",
                            }}
                            // padding="100px"
                            size="small"
                            aria-label="simple table"
                            id="data-table-cleanliness-report"
                          >
                            {" "}
                            <TblHead />
                            <TableBody>
                              {data?.array?.map((item, index) => (
                                <>
                                  <StyledTableRow key={index}>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {item?.description?.description}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {item?.partNo}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {item?.unitSlNo}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      className={classes.remarks}
                                    >
                                      {item?.hologramNo}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                </>
                              ))}
                            </TableBody>
                          </Table>
                          {recordsAfterPagingAndSorting()?.length != 0 &&
                            recordsAfterPagingAndSorting()?.length !=
                            undefined ? (
                            <TblPagination />
                          ) : (
                            ""
                          )}
                        </TblContainer>
                      </Grid>
                      <br />
                    </Grid>
                  )}
                </>
              ))}
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container>
            <style>
              {`@media print .pagebreak { page-break-before: always; }}`}
            </style>
            <Grid item xs={9} sm={9} md={9} lg={9} xl={9} align="left"></Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3} align="left">
              {signatory && (
                <>
                  <Typography className={classes.remarks}>
                    {signatory?.enameHi}
                  </Typography>
                  <Typography className={classes.remarks}>
                    {signatory?.ename}
                  </Typography>
                  <Typography className={classes.remarks}>
                    {signatory?.designationHi}
                  </Typography>
                  <Typography className={classes.remarks}>
                    {signatory?.designation}
                  </Typography>
                  <Typography className={classes.remarks}>
                    {signatory?.roleNameHi}
                  </Typography>
                  <Typography className={classes.remarks}>
                    {signatory?.roleName}
                  </Typography>
                  <Typography className={classes.remarks}>
                    वरिष्ठ् गुणवत्ता आश्वासन अधिकारी के लिए
                  </Typography>
                  <Typography className={classes.remarks}>
                    For Senior Quality Assurance Officer
                  </Typography>
                </>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.heading}>Copy to:-</Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <style>
                {`@media print {.printbox,article{font-size: "0.875rem";}.MuiTypography-body1{font-size: "0.875rem" !important;} .printbox b{font-weight: 450;}  .printbox }`}
              </style>
              <TextArea
                value={data?.copyTo}
                readOnly={true}
                maxRows={25}
                variant="plain"
                style={textArea}
              />
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          type="submit"
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
  );
}
