/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import {
  FormControl,
  Grid,

  TableRow,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { StyledTableCell } from "Utils";
import AutoCompleteNew from "components/AutoCompleteNew";
import moment from "moment";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ApprovedLI from "./InStageSO/ApprovedLI";

const useStyles = makeStyles((theme) => ({
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
  table: {
    minWidth: "100%",
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
  subHeading: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  value: {
    fontSize: "0.875rem",
  },
  toggleSelection: {
    "&.Mui-selected": {
      color: "black",
      backgroundColor: "#B1E9AF",
    },
  },
}));


const urlGetAllApprovedSo = "supplyOrder/getApprovedSoBySalesGrp/";

const urlGetAll = "soApproval/";

function Status({ text }) {
  return (
    <div
      style={{
        color: !text ? "black" : text === "Approved" ? "#1b5e20" : "#cb0000",
        backgroundColor: !text
          ? "grey"
          : text === "Approved"
          ? "#c8e6c9"
          : "#ff7d654d",
        padding: "2px 8px",
        borderRadius: 4,
        width: 120,
        textAlign: "center",
      }}
    >
      {text || "NA"}
    </div>
  );
}

function Row({ row, index }) {
  const classes = useStyles();

  return (
    <>
      <TableRow>
        <StyledTableCell className={classes.tableCell} rowSpan={2}>
          {index}.
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>
            {moment(row.createdDate).format("DD-MM-yyyy HH:mm")}
          </Typography>
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>{row.designation}</Typography>
        </StyledTableCell>

        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>{row.createdByStr}</Typography>
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>
            {row.nextApproverName}
          </Typography>
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell}>
          <Typography className={classes.value}>
            <Status text={row.soStatusStr} />
          </Typography>
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell className={classes.tableCell} colSpan={4}>
          <Typography color="primary" className={classes.value}>
            <b>REMARKS:</b>
          </Typography>
          {row.remarks}
        </StyledTableCell>
      </TableRow>
    </>
  );
}

const defaultValues = { remarks: "" };


export default function Audit({ supplyOrderObj }) {
  const classes = useStyles();
  const [flag, setFlag] = useState(1);
  const handleChange = (val) => {
    setFlag(val);
  };
  const user = useSelector((store) => store.loggedInUser);

  const [selectedSupplyOrder, setSelectedSupplyOrder] = useState();
  const [loading, setLoading] = useState(false);

  const [supplyOrders, setSupplyOrders] = useState([]);
  const [records, setRecords] = useState();


  const handleSupplyOrderChange = async (target) => {
    const value = target;
    const selectedSupplyOrderObj = supplyOrders.find((o) => o.id === +value);
    setSelectedSupplyOrder(selectedSupplyOrderObj);

    console.log(selectedSupplyOrder, "selectedSupplyOrder");
    // if (value) {
    //   // getAllTableData(value);
    //   // console.log("dfsad");
    // }
  };

  const {

    control,

  
  } = useForm({ defaultValues });

  useEffect(() => {
    if (user) {
      setLoading(true);
      axiosInstanceTrans(urlGetAllApprovedSo + "/" + user?.salesGrpId)
        .then(({ data }) => {
          if (Array.isArray(data)) {
            setSupplyOrders(data);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  async function getAllTableData(id) {
    setLoading(true);
    try {
      const { data } = await axiosInstanceTrans(
        urlGetAll + id + "/" + user?.empId
      );
      setRecords(data);
      console.log("isEditAllowed", data?.isEditAllowed);
    } catch (error) {
      toast.error("failed to get Records");
    }
    setLoading(false);
  }

  useEffect(() => {
    //TODO: this
    // if id supply Id match the select that obj
    // setSelectedSupplyOrder(supplyOrderObj);
  }, [supplyOrderObj]);

  return (
    <div>
      <Grid xs={12} sm={6} md={6} lg={2} xl={2}>
        <Controller
          name="selectedSupplyOrder"
          control={control}
          render={({ field: { onChange, value, ...props } }) => (
            <AutoCompleteNew
              data={supplyOrders}
              value={selectedSupplyOrder?.id}
              labelText="Select Supply Order"
              getOptionLabel={(o) => o.orderNo}
              onChange={(e, v) => {
                onChange(v);
                handleSupplyOrderChange(v?.id);
                console.log("thus", v?.id);
              }}
            />
          )}
        />
      </Grid>

      {!selectedSupplyOrder ? (
        <Typography color="error" align="center" style={{ marginTop: 20 }}>
          Please select supply order
        </Typography>
      ) : (
        <>
          <FormControl style={{ padding: "14px 20px 10px 10px" }}>
            <ToggleButtonGroup
              value={flag}
              exclusive
              onChange={(e, newvalue) => {
                const val = newvalue;
                handleChange(val);
                console.log("newValue", newvalue);
              }}
              size="small"
            >
              <ToggleButton
                classes={{
                  // selected: classes.toggleSelection,
                  root: classes.leftRoot,
                }}
                color="primary"
                value={1}
                className={classes.toggleSelection}
              >
                Line Items
              </ToggleButton>
              <ToggleButton
                className={classes.toggleSelection}
                classes={{
                  // selected: classes.toggleSelection,
                  root: classes.rightRoot,
                }}
                color="primary"
                value={0}
              >
                Submitted LI
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
          {flag == 1 && (
            <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
              <ApprovedLI selectedSupplyOrder={selectedSupplyOrder} />
            </Grid>
          )}
          {flag == 0 && (
            <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
              {/* <InspFileNoteOL /> */} <Typography>sdfsddsgsbdsg</Typography>
            </Grid>
          )}
        </>
      )}
    </div>
  );
}
