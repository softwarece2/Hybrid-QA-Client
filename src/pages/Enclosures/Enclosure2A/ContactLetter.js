/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { cyan, indigo } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "components/Button";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import FclView from "./FclView";
import {
  getFclSo,
  saveFcl,
  submitFcl,
} from "Redux/Actions/Enclosure/FclAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { restrict } from "restrict";
import MultilineTextField from "components/MultilineTextField";
import InspectSOArmyTable from "pages/InspectSoArmy/InspectSOArmyTable";

const useStyles = makeStyles((theme) => ({
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
  paper: {
    padding: "12px 12px 12px 12px",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 400,
  },
  color: {
    color: theme.palette.primary.light,
  },
  subject: {
    fontSize: "0.875rem",
  },
  btn: {
    backgroundColor: cyan[800],
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: cyan[800],
      color: theme.palette.common.white,
    },
  },
  print: {
    backgroundColor: indigo[800],
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: indigo[800],
      color: theme.palette.common.white,
    },
  },
  draft: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
  icon: {
    color: "#ff3000",
    fontSize: "18px",
  },
}));
const defaultValues = {
  inspContactMainDet: [],
};
const newField = {
  idd: 0,
  vigilance: "",
};

export default function ContactLetter({ soObj }) {
  let componentRef = useRef();
  const classes = useStyles();
  const dispatch = useDispatch();


  const [fclDetails, setFclDetails] = useState(null);

  const [openFclView, setOpenFclView] = useState(false);
  const [soId, setSoId] = React.useState(null);

  const [idVal, setIdVal] = React.useState(null);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const roleId = useSelector((store) => store.loggedInUser?.roleId);


  const [inputList, setInputList] = useState([
    {
      data: "",
    },
  ]);

  const [deletedVigList, setDeletedVigList] = useState([]);

  const {
    handleSubmit,

    control,
    setValue,
    getValues,

  } = useForm({
    defaultValues,
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inspContactMainDet",
  });

  React.useEffect(() => {
    dispatch(getFclSo(soObj?.id))
      .then((res) => {
        setFclDetails(res);
        // setRecords(res?.fclVigDtoList);
        setIdVal(res?.id);
        setSoId(soObj?.id);
        console.log("res", res);
        setInputList(res?.fclVigDtoList);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    // setRecords(fclDetails?.fclVigDtoList);
    const MappedData = fclDetails?.fclVigDtoList?.map((item) => ({
      idd: item.id,
      vigilance: item.vigilance,
      // deletedVigList: item.deletedVigList,
    }));
    console.log(MappedData, "ad");
    setValue("inspContactMainDet", MappedData);
    if (fclDetails?.submittedDate == null && fclDetails?.id == 0)
      append({
        idd: 0,
        vigilance:
          "Contact Persons: ",
      });
    setIdVal(fclDetails?.id);
  }, [fclDetails]);

  // React.useEffect(() => {
  //   const MappedData = records?.map((item) => ({
  //     idd: item.id,
  //     vigilance: item.vigilance,
  //     // deletedVigList: item.deletedVigList,
  //   }));
  //   console.log(MappedData, records, "ad");
  //   setValue("inspContactMainDet", MappedData);
  // }, [records, setValue]);

  const onFormSave = (data) => {
    console.log("saving fcl...", data.inspContactMainDet);
    const value = {
      id: idVal,
      supplyOrderId: soObj?.id,
      createdBy: loggedInUser?.empId,
      deletedVigList,
      fclVigDtoList: data.inspContactMainDet?.map((item) => ({
        id: item.idd ?? 0,
        vigilance: item.vigilance,
        // deletedVigList: item.deletedVigList,
      })),
    };
    console.log("saving fcl payload...", value);
    dispatch(saveFcl(value))
      .then((res) => {
        setDeletedVigList([]);
        setFclDetails(res);
      })
      .catch((err) => console.log(err));
  };

  const onFormSubmit = (data) => {
    console.log("submit fcl...", data.inspContactMainDet);
    const value = {
      id: idVal,
      supplyOrderId: soObj?.id,
      createdBy: loggedInUser?.empId,

      fclVigDtoList: data.inspContactMainDet?.map((item) => ({
        id: item.idd ?? 0,
        vigilance: item.vigilance,

        // deletedVigList: item.deletedVigList,
      })),
    };

    dispatch(submitFcl(value))
      .then((res) => {
        setDeletedVigList([]);
        setFclDetails(res);
      })
      .catch((err) => console.log(err));
  };

  const handleRemoveItem = (index, input) => {
    // const newList = [...inputList];
    // newList.splice(index, 1);
    // setInputList(newList);
    console.log("deleted input...", input?.idd, index);

    if (!!input.idd) {
      setDeletedVigList((ps) => [...ps, input.idd]);
    }

    remove(index);
  };

  // console.log(deletedVigList);
  console.log("inspContactMainDet", getValues("inspContactMainDet"), fields);
  const handleListAdd = () => {
    // setInputList([
    //   ...inputList,
    //   {
    //     data: "",
    //   },
    // ]);
    append(newField);
  };

  return (
    <div className={classes.root}>
      {openFclView && (
        <FclView
          soId={soId}
          fclData={fclDetails}
          open={openFclView}
          setOpen={setOpenFclView}
        />
      )}
      <Grid container>
        <Grid item xs={12} align="left">
          {" "}
          <Button
            type="submit"
            onClick={() => dispatch(selectItem(<InspectSOArmyTable />))}
            variant="contained"
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>{" "}
      </Grid>{" "}
      <div id="print" ref={(el) => (componentRef = el)}>
        <Paper className={classes.paper}>
          <Typography className={classes.heading} align="center">
            <h4>
              CONTRACT NO.{" "}
              <span className={classes.color}>{fclDetails?.soOrderNo}</span>{" "}
              DATED <span className={classes.color}>{fclDetails?.soDate}</span>{" "}
              FOR SUPPLY OF{" "}
              <span className={classes.color}>{fclDetails?.projectName}</span>
            </h4>
          </Typography>

          <Typography className={classes.subject}>Dear Sir,</Typography>

          <ol className={classes.subject}>
            <li>
              <Typography className={classes.subject}>
                Refer to the subject order.
              </Typography>
            </li>

            <li>
              <Typography align="justify" className={classes.subject}>
                This establishment been nominated as the inspecting Agency
                against the subject PO.In order to avoid delay in inspection and
                clearance of stores, it is requested that the following actions
                be taken at your end:-
              </Typography>
            </li>

            <div>
              <ol type="a" className={classes.subject}>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    The stores are to be manufactured strictly as per
                    drawing/specification /details mentioned in PO and the
                    criteria viz. characteristics, quantum/severities of
                    inspection /checks of stores will be strictly as per
                    approved Quality Assurance Plan (QAP)/ Acceptance Test
                    Procedure (ATP).In case approved QAP for the subject store
                    does not exist,you are requested to forward draft QAP in
                    soft copy to this establishment in MS Word format as per the
                    standard format (A broad structure of QAP placed at the
                    Enclosure-1, wherein only relevant serials are to be
                    selected for a particular store) for scrutiny and onward
                    submission to HQ DQA (N), New Delhi for approval. On
                    approval, the QAP would be converted in PDF format and
                    promulgated by DQA(N). It is brought out that draft QAP
                    would be accepted for vetting only in soft copy and in MS
                    Word 2007 or latest format.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    The stores ,when ready ,be tendered to this Establishment
                    through inspection call letter for inspection and
                    acceptance. A Specimen of inspection call letter is enclosed
                    for your ready reference.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    The stores be delivered to the Consignee only after they are
                    inspected and Inspection Note is issued by this
                    Establishment.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    The Stores offered for inspection are expected to be
                    pre-inspected by you for description,pattern number,
                    specifications, drawings and details mentioned in the
                    relevant purchase orders to ensure that the stores are of
                    specified and acceptable quality before tendering for
                    inspection at this establishment. This would minimize
                    chances of delay, rejection, etc. Pre-inspection report as
                    per the format attached is to be enclosed with your
                    inspection call letter. A declaration by you that such
                    pre-inspection has been carried out on the stores tendered
                    shall be enclosed with each inspection call letter (i.e.
                    challan). The pre-inspection report shall indicate details
                    of checks and tests carried out and the results /
                    observations made. Inspection call letters (Challans)
                    received without pre-inspection reports will be disposed off
                    without inspection of stores.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    Intimate the name and address of the actual manufacturer of
                    the subject items, in case the OEM is other than your firm,
                    in such case the stores should be offered for inspection at
                    OEM's manufacturing plant/ premises to facilitate proper
                    inspection and testing as per relevant
                    drawings/specifications.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    In case the items are imported, copy of the following
                    documents be submitted (originals of documents to be
                    produced for verification during inspection):-
                  </Typography>
                </li>
                <div>
                  <ol type="i">
                    <li>
                      <Typography align="justify" className={classes.subject}>
                        Copy of one among Bill of Lading / Shipping Bill/Airway
                        Bill(A document issued by the transporter of the
                        equipment which clearly indicates the
                        description,quantity,port of collection and port of
                        discharge).
                      </Typography>
                    </li>
                    <li>
                      <Typography align="justify" className={classes.subject}>
                        Invoice by OEM of Country of Origin certificate of the
                        equipment with packing list.
                      </Typography>
                    </li>
                    <li>
                      <Typography align="justify" className={classes.subject}>
                        Bill of Entry to warehouse.
                      </Typography>
                    </li>
                    <li>
                      <Typography align="justify" className={classes.subject}>
                        The Certificate of Conformity (CoC) indicating governing
                        specifications and values to which the items are tested
                        along with Original Equipment Manufacturer (OEM) test
                        certificates/test reports/ Catalogue /Data Sheet.
                      </Typography>
                    </li>
                    <li>
                      <Typography align="justify" className={classes.subject}>
                        Guarantee/ Warrantee certificate from the supplier/ OEM
                        as per Supply Order.
                      </Typography>
                    </li>
                  </ol>
                </div>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    In case of items falling under the category of
                    bouught-out/COTS,OEM's test certificate / conformance
                    certificate and test reports(in original / scanned /
                    computer-generated form) will required for review.The
                    certificates should be relevant to the stores/lot/batch
                    being offered for inspection.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    In case of spare parts, OEM's certificate conforming that
                    spare are tested and suitable for fitment on main equipment
                    for which spares are ordered along with relevant portion of
                    parts catalogue /operators manuals be enclosed with
                    inspection call letter to facilitate identification of spare
                    parts.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    Warranty Certificate to be submitted.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    Inter Changeability Certificate be submitted in case Part
                    No. or designation of item being supplied is different from
                    Part No. designation mentioned in PO.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    Stores are to be tendered for inspection well within the
                    delivery period, so as to reach the consignee on or before
                    the stipulated DP after completion of inspection. In case
                    delivery date has expired, extension of delivery dates
                    should be obtained from the indenting / ordering authority.
                    Inspection may be undertaken and Inspection Note issued
                    based on provisional DP extension by the indenting /
                    ordering authority.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify" className={classes.subject}>
                    Please forward a copy of specification / technical leaflet
                    of the subject item for our reference.
                  </Typography>
                </li>

                <li>
                  <Typography align="justify" className={classes.subject}>
                    The preferred mode of receipt of Inspection Call letters and
                    pre-inspection reports is by e-mail. In case email facility
                    is not available, hard copy may be faxed and ink-signed
                    pre-inspection report be produced at the time of inspection.
                  </Typography>
                </li>
              </ol>
            </div>
            <li>
              <Typography align="justify" className={classes.subject}>
                Stores will taken up for inspection only on meeting the above
                requirements.
              </Typography>
            </li>
            <li>
              <Typography align="justify" className={classes.subject}>
                It is requested that all test facilities required to carry out
                inspection/ checks/ tests on stores be provided to facilitate
                thorough inspection. It may please be ensured that instruments/
                test jigs/ gauges are calibrated and in-date. In case testing
                facility is not available with the firm, the same would be
                carried out at NABL-accredited laboratory and the testing
                charges shall be borne by the firm.
              </Typography>
            </li>
            <li>
              <Typography align="justify" className={classes.subject}>
                It may be noted that QA personnel deputed for raw material
                inspection/in process checks and final inspection prior
                clearance of item/issue of inspection Note are entitled for
                TA/DA for carrying out official duty of inspection.It is not
                incumbent for the firm to provide transport/accommodation for
                the QA personnel during the process of Quality Assurance
                activities.
              </Typography>
            </li>
            <li>
              <Typography align="justify" className={classes.subject}>
                In view of the above,First Contact Meeting to be scheduled
                within one week on receipt of this letter.
              </Typography>
            </li>
            <li>
              <Typography align="justify" className={classes.subject}>
                In case any irregularities are noticed on the part of QA
                personnel on soliciting any demand/favour for carrying out QA
                activities or involving corrupt practices, the firm may approach
                Vigilance Officer of this office as well as DQA (N) HQs,New
                Delhi. The details of Vigilance department are as below:
              </Typography>
            </li>

            {roleId === 7 && fclDetails?.submittedDate === null ? (
              <Grid xs={8} align="right">
                <Button
                  startIcon={<AddCircleIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleListAdd}
                >
                  Add
                </Button>
              </Grid>
            ) : null}

            {fields?.map((input, index) => (
              <li>
                <Grid container spacing={0}>
                  <Grid xs={6} align="right">
                    <Controller
                      name={`inspContactMainDet[${index}].vigilance`}
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MultilineTextField
                            size="small"
                            // style={{ paddingTop: 10 }}
                            maxRows={5}
                            multiline
                            onChange={onChange}
                            value={value}
                            inputProps={{
                              readOnly: fclDetails?.submittedDate,
                            }}
                            onInput={restrict.remarks}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>
                  <Grid xs={1} align="left">
                    {fclDetails?.submittedDate === null ? (
                      <IconButton
                        style={{ paddingTop: 8 }}
                        aria-label="delete"
                        onClick={() => handleRemoveItem(index, input)}
                      >
                        <DeleteIcon className={classes.icon} />
                      </IconButton>
                    ) : null}
                  </Grid>
                </Grid>
              </li>
            ))}
          </ol>

          <p className={classes.subject}> Thanking You.</p>
          <p align="right" className={classes.subject}>
            Yours faithfully,
          </p>
        </Paper>
      </div>
      <div className={classes.space} align="center">
        {roleId === 7 && fclDetails?.submittedDate === null ? (
          <Button
            type="submit"
            onClick={handleSubmit(onFormSave)}
            variant="contained"
            className={classes.draft}
          // disabled={loading || !isDirty}
          >
            Save Drafts
          </Button>
        ) : null}

        {roleId === 7 && fclDetails?.submittedDate === null ? (
          <Button
            type="submit"
            onClick={handleSubmit(onFormSubmit)}
            variant="contained"
            color="primary"
          // disabled={loading || !isDirty}
          >
            Submit
          </Button>
        ) : null}
        {/* <Grid item style={{ padding: 8 }} xs={3} sm={3} md={3} lg={1} xl={1} align="left"> */}

        {roleId === 7 && fclDetails?.submittedDate !== null ? (
          <Button
            type="submit"
            onClick={() => setOpenFclView(true)}
            variant="contained"
            className={classes.btn}
          >
            Preview
          </Button>
        ) : null}

        {/* </Grid> */}
        {/* <ReactToPrint
          trigger={() => (
            <Button variant="contained" className={classes.print}>
              Print
            </Button>
          )}
          content={() => componentRef}
        /> */}
      </div>
    </div>
  );
}
