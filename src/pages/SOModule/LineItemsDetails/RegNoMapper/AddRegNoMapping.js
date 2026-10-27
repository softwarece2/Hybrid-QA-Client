import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  LinearProgress,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import HistoryIcon from "@material-ui/icons/History";
import { Delete, Save, Search } from "@material-ui/icons";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { DialogTitle } from "Utils";
import * as yup from "yup";
import RegNoUnmap from "./RegNoUnmap";
import moment from "moment/moment";
import LineItemSerialNoHistory from "../LineItemSerialNoHistory";
import { REGISTRATION_NUMBER_STATUS } from "../../../../Globals";

const schema = yup.object().shape({
  regNos: yup.array(),
});
export default function AddRegNoMapping({ onClose, selectedRow, refresh, fetchLI}) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMapped, setLoadingMapped] = useState(false);
  const [mappedRegNos, setMappedRegNos] = useState([]);
  const [mappedFilteredRegNos, setMappedFilteredRegNos] = useState([]);
  const [selectedQty, setSelectedQty] = useState(0);
  const [openDel, setOpenDel] = useState(false);
  const [dataVal, setDataVal] = useState({});
  const [qty, setQty] = useState(0);
  const [mappedSearchTerm, setMappedSearchTerm] = useState("");
  const [unMappedSearchTerm, setUnMappedSearchTerm] = useState("");
  const warrantId = selectedRow?.id;
  const [allChecked, setAllChecked] = useState(false);
  const [masterCheckboxDisabled, setMasterCheckboxDisabled] = useState(true);
  const [historyTabOpen, setHistoryTabOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    rfrChip: {
      backgroundColor: "orange",
      height: "18px !important", 
      fontSize: "0.65rem !important",
      fontWeight: "bold",
      fontStyle: "italic",
      borderRadius: "12px",
      "& .MuiChip-label": {
        paddingLeft: "8px !important", 
        paddingRight: "8px !important",
      },
    },
  }));
const[error,setError]=useState(false);
  const { handleSubmit, watch, setValue, control } = useForm({
    defaultValues: { regNos: [] },
    resolver: yupResolver(schema),
  });

  const classes = useStyles();

  const { fields } = useFieldArray({
    control,
    name: "regNos",
  });
  useEffect(() => {
    setMasterCheckboxDisabled(fields.length === 0);
  }, [fields]);

  // useEffect(() => {
  //   setSelectedQty(0);
  // }, [selectedRow]);

  useEffect(() => {
    setQty(mappedRegNos.length);
  }, [mappedRegNos]);

  function getMappedReg() {
    setLoadingMapped(true);
    axiosInstance("warrant/getRegs/" + selectedRow.soLiId, {
      params: {
        type: "mapped",
        warrantId: warrantId,
      },
    })
      .then(({ data }) => {
        setMappedRegNos(data);
        setMappedFilteredRegNos(data);
      })
      .catch(console.log)
      .finally(() => setLoadingMapped(false));
  }
  console.log("mappedRegNos",mappedRegNos);
  console.log("mappedRegNoslength",mappedRegNos.length);
  function getUnMappedReg() {
    setLoading(true);
    axiosInstance("warrant/getRegs/" + selectedRow.soLiId, {
      params: {
        type: "unmapped",
      },
    })
      .then(({ data }) => {
        setValue(
          "regNos",
          data.map((d) => ({ ...d, checked: false }))
        );
        setAllChecked(false);
        setSelectedQty(0);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getMappedReg();
    getUnMappedReg();
  }, []);

  function onSubmit(data) {
    if (error) {
      toast.error(`Please select up to ${selectedRow?.qty} registration numbers only`);
      return; 
    }
  
    const req = {
      categoryId: selectedRow?.id,
      lineItemSerialNoIds: data.regNos
        .filter((r) => r.checked)
        .map((r) => r.id), 
      // lineItemSerialNoId : data.regNos.filter((r) => r.checked).map((r) => r.id),
    };
    setSaving(true);
    axiosInstance
      .post("warrant/save", req)
      .then(({ data }) => {
        toast.success("Successfully saved.");
        getMappedReg();
        getUnMappedReg();
        // onClose();
      })
      .catch((e) => {
        console.log(e);
        toast.error("Please Select Registration Number.");
      })
      .finally(() => {
        setSaving(false);
      });
  }
  const watchedFields = watch("regNos");
  const validMappedCount = mappedRegNos?.filter(
  reg => reg.status !== "RFR"
).length || 0;

const maxAllowed = (selectedRow?.qty || 0) - validMappedCount;
// const maxAllowed =(selectedRow?.qty-mappedRegNos.length) || 0;
  const handleCheckboxChange = (index, checked) => {
    setValue(`regNos.${index}.checked`, checked);
    setSelectedQty((prevQty) => (checked ? prevQty + 1 : prevQty - 1));

    const totalItems = watchedFields.length;
    const currentlyCheckedCount = watchedFields.filter((f) => f.checked).length;
    console.log("currentlyCheckedCount",currentlyCheckedCount);
    if(currentlyCheckedCount>maxAllowed){
       setError(true);
    }
    else{
     setError(false);
    }
    if (totalItems > 0 && currentlyCheckedCount === totalItems) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }

  };

  const handleMasterCheckboxChange = (event) => {
    setAllChecked(event.target.checked);
    console.log(allChecked,"allchecked")
    fields.forEach((field, index) => {
      setValue(`regNos.${index}.checked`, event.target.checked);
    });
    setSelectedQty(event.target.checked ? fields.length : 0);
    console.log("fieldslength",fields.length);
    if (!allChecked) {
      if (fields.length > maxAllowed) {
        setError(true);
        return; 
      }
    }
    else{
      setError(false);
    }
    
  };

  const handleDeleteClick = (row) => {
    setDataVal(row);
    setOpenDel(true);
  };

  // Function to handle search input change for mapped registration numbers
  const handleMappedSearchChange = (event) => {
    setMappedSearchTerm(event.target.value);
  };

  const handleUnMappedSearchChange = (event) => {
    setUnMappedSearchTerm(event.target.value);
  };

  const handleHistoryClick = (row) => {
    setSelectedReg(row);
    setHistoryTabOpen(true);
  }

  useEffect(() => {
    if (mappedSearchTerm) {
      setMappedFilteredRegNos(
        mappedRegNos.filter((regNo) =>
          regNo.serialNo.toLowerCase().includes(mappedSearchTerm.toLowerCase())
        )
      );
    } else {
      setMappedFilteredRegNos(mappedRegNos);
    }
  }, [mappedRegNos, mappedSearchTerm]);

  return (
    <>
      <Dialog open fullWidth maxWidth="md">
        <DialogTitle onClose={() => {
            fetchLI();
            onClose();
        }}>
          Reg No. to Warrant No. Mapping{" "}
          <b>
            (WT.No : {selectedRow?.categoryName}, EP Code: {selectedRow?.partNo}
            )
          </b>
        </DialogTitle>
        {error && (
  <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' }}>
            {/* Error: You can only select up to {maxAllowed} registration numbers . */}
            Error:The quantity of registration numbers selected exceeds the warrant Qty limit
  </div>
)}
        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" color="secondary">
              <b>
                Select Register Nos to Map
                <span
                  style={{ marginLeft: "190px" }}
                  variant="subtitle2"
                  color="secondary"
                >
                  Selected Qty : {selectedQty}
                </span>
              </b>
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search Unmapped Reg. no."
              onChange={handleUnMappedSearchChange}
              InputProps={{
                startAdornment: (
                  <IconButton size="small" position="start">
                    <Search fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </div>

          <TableContainer
            style={{
              maxHeight: 250,
              maxWidth: 600,
              marginInline: "auto",
              outline: "1px solid lightgrey",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ padding: 2, fontWeight: 600 }}>
                    All
                    <Checkbox
                      checked={allChecked}
                      onChange={handleMasterCheckboxChange}
                      disabled={masterCheckboxDisabled}
                    />
                  </TableCell>
                  <TableCell
                    style={{
                      padding: 2,
                      fontWeight: 600,
                      color: "rgb(32, 83, 117)",
                    }}
                  >
                    Registration Number
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                )}

                {fields
                  .filter((regNo) =>
                    regNo.serialNo
                      .toLowerCase()
                      .includes(unMappedSearchTerm.toLowerCase())
                  )
                  .map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell style={{ padding: 2 }}>
                        <Controller
                          name={`regNos.${i}.checked`}
                          control={control}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <Checkbox
                              size="small"
                              color="primary"
                              onChange={(e) => {
                                handleCheckboxChange(i, e.target.checked);

                                onChange(e.target.checked);
                              }}
                              checked={value}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell style={{ padding: 2 }}>
                        <div className={classes.container}>
                          {row.serialNo}
                          {row?.status?.toLowerCase() ===
                            REGISTRATION_NUMBER_STATUS.RFR && (
                            <Chip
                              label="RFR"
                              color="warning"
                              className={classes.rfrChip}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <Button
              disabled={saving}
              onClick={handleSubmit(onSubmit)}
              size="small"
              style={{ textTransform: "capitalize" }}
              startIcon={<Save />}
              variant="contained"
              color="primary"
            >
              {saving && <CircularProgress size={16} />} Save
            </Button>
          </div>
          <Divider style={{ marginBlock: 12 }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" color="secondary">
              <b>
                Mapped Registration Nos.{" "}
                <span
                  variant="subtitle2"
                  color="secondary"
                  style={{ marginLeft: "190px" }}
                >
                  Total Mapped Qty : {mappedRegNos.length}
                </span>
              </b>
            </Typography>

            <TextField
              size="small"
              variant="outlined"
              placeholder="Search Mapped Reg. no."
              value={mappedSearchTerm}
              onChange={handleMappedSearchChange}
              InputProps={{
                startAdornment: (
                  <IconButton size="small" position="start">
                    <Search fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </div>

          <TableContainer
            style={{
              maxHeight: 250,
              outline: "1px solid lightgrey",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ padding: 2, fontWeight: 600 }}>
                    S.No.
                  </TableCell>
                  <TableCell
                    style={{
                      padding: 2,
                      fontWeight: 600,
                      color: "rgb(32, 83, 117)",
                    }}
                  >
                    Registration Number
                  </TableCell>
                  <TableCell
                    style={{
                      padding: 2,
                      fontWeight: 600,
                      color: "rgb(32, 83, 117)",
                    }}
                  >
                    Mapped By
                  </TableCell>
                  <TableCell
                    style={{
                      padding: 2,
                      fontWeight: 600,
                      color: "rgb(32, 83, 117)",
                    }}
                  >
                    Mapped Date
                  </TableCell>
                  <TableCell
                    style={{
                      padding: 2,
                      fontWeight: 600,
                      color: "rgb(32, 83, 117)",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{
                      padding: 2,
                      fontWeight: 600,
                      color: "rgb(32, 83, 117)",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingMapped && (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                )}

                {mappedFilteredRegNos.map((row, i) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ padding: 2 }}> {i + 1}</TableCell>
                    <TableCell style={{ padding: 2 }}>{row.serialNo}</TableCell>
                    <TableCell style={{ padding: 2 }}>
                      {row.createdBy}
                    </TableCell>
                    <TableCell style={{ padding: 2 }}>
                      {moment(row.createdDateTime).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: 2,
                        color: row.status === "Mapped" ? "orange" : "green",
                      }}
                    >
                      <Typography
                        size="small"
                        style={{
                          textTransform: "capitalize",
                          color: row.status === "Mapped" ? "blue" : "green",
                        }}
                        variant="contained"
                      >
                        {row.status}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ padding: 2 }}>
                      
                        <Button
                          size="small"
                          style={{ textTransform: "capitalize" }}
                          disabled={row.status !== "Mapped"}
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteClick(row)}
                        >
                          UnMapp
                        </Button>
                     
                    </TableCell>
                    <TableCell style={{ padding: 2 }}>
                      <IconButton
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleHistoryClick(row)}
                        title="History"
                      >
                        <HistoryIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        {/* <DialogActions>
        <Button onClick={onClose} size="small" variant="contained" color="secondary" style={{ textTransform: "capitalize" }}>
          Close
        </Button>
      </DialogActions> */}
      </Dialog>
      <RegNoUnmap
        open={openDel}
        onClose={() => setOpenDel(false)}
        dataVal={dataVal}
        warrantId={warrantId}
        fetchRecords={() => {
          getMappedReg();
          getUnMappedReg();
        }}
        warrantName={selectedRow?.categoryName}
      />

      {historyTabOpen && (
        <LineItemSerialNoHistory
          onClose={() => setHistoryTabOpen(false)}
          reg={selectedReg}
        />
      )}
    </>
  );
}
