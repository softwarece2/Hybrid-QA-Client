import { makeStyles } from "@material-ui/core/styles";
// import React from "react";
import React, { useEffect, useRef, useState } from "react";

//material-ui
import { CardContent, CardHeader, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";

//components
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import {ListItemText,Typography, MenuItem,} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { Close } from "@material-ui/icons";
import { grey, teal } from "@material-ui/core/colors";
//pages
import { ITEM_LOT_DATE, ITEM_LOT_NO } from "Redux/Types";

//icons
import { saveILData } from "Redux/Actions/SupplyOrder/SOAction";
import { restrict } from "restrict";
import { toast } from "react-toastify";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { AMENDMENT_LETTER_TYPE } from "Globals.js";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    [theme.breakpoints.down("xl")]: {
      maxWidth: "50%",
    },
    [theme.breakpoints.down("lg")]: {
      maxWidth: "80%",
    },
    [theme.breakpoints.down("md")]: {
      maxWidth: "85%",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%",
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "0.875rem",
  },
  cardContent: {
    textAlign: "left",
    padding: 16,
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
    marginRight: "5px",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  searchInput: {
    width: "30%",
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

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
  },
}))(MenuItem);

const defaultValues = {
  ilLetterDate: "",
  ilLetterNo: "",
  lotNo: "",
  status: "",
  supplyOrderId: "",
  itemlots: [],
};
const schema = yup.object().shape({
  lotNo: yup
    .string()
    .typeError("required")
    .required(" required"),
  ilLetterNo: yup
    .string()
    .typeError("required")
    .required(" required"),
  ilLetterDate: yup
    .string()
    .typeError("required")
    .required(" required"),
});

export default function ItemLotsForm({ getIL, getSoBySoId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const soId = useSelector((store) => store.soReducer.selectedSoId);

  let fileInputLot = useRef(null);
  let fileInputAmendment = useRef(null);
  const [lotInput, setLotInput] = useState(null);
  const [selectedFileLot, setSelectedFileLot] = useState([]);
  const [itemLotInput, setItemLotInput] = useState(null);
  const fileInputRef = useRef(null); 


  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 250 * 1024 * 1024;
  const MAX_FILE_COUNT = 13;
  const invalidExtensions = [
    ".ps1",
    ".exe",
    ".msi",
    ".dll",
    ".vbs",
    ".js",
    ".lnk",
    ".jar",
    ".zip",
    ".rar",
  ];
  const {
 
    handleSubmit,
    reset,
  
    control,

    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const deleteFileItemLot = (id) => {
    let randomString = Math.random().toString(36);
    const filteredListItemLots = selectedFileLot?.filter((item, index) => index !== id);
    setItemLotInput(randomString);
    setSelectedFileLot(filteredListItemLots);
    console.log("file filteredList", filteredListItemLots);

    console.log("file filteredList", filteredListItemLots);
  };
  const handleFileInputLot = (e) => {
    const files = Array.from(e.target.files);
    let newFiles = [];
    let totalSize = 0;

    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        if (totalSize + file.size <= MAX_TOTAL_SIZE) {
          if (selectedFileLot.length + newFiles.length < MAX_FILE_COUNT) {
            newFiles.push(file);
            totalSize += file.size;
          }
        } else {
          toast.error("Adding this file exceeds the total size limit of 250MB");
        }
      } else {
        toast.error(`Please select a file less than 100MB.`);
      }
    });

    const hasInvalidExtension = Array.from(files).some((file) =>
      invalidExtensions.some((extension) =>
        file.name.toLowerCase().endsWith(extension)
      )
    );
    if (hasInvalidExtension) {
      toast.error("Invalid file format.");
      e.target.value = null; // Clear the input
      return;
    }
    setSelectedFileLot([...selectedFileLot, ...newFiles]);
  };
  console.log(selectedFileLot,"files");

  const deleteFileLot = (id) => {
    const filteredList = selectedFileLot.filter((_, index) => index !== id);
    setSelectedFileLot(filteredList);


    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
  };

    //Upload Files to Backend
  // const uploadFiles = async () => {
  //   try {
  //     const formData = new FormData();
  //     selectedFileLot.forEach((file) => {
  //       formData.append("itemlots", file); // Or whatever field your API expects
  //     });

  //     const response = await axiosInstanceT.post("/uploadItemLots", formData);
  //     if(response.status === 200){
  //         console.log("Uploaded files successfully")
  //     }
  //   } catch (error) {
  //     console.error("Error uploading files:", error);
  //     toast.error("Failed to upload files.");
  //     return false;
  //   }
  //   return true;
  // };

//   const onFormSubmit = async (data) => {
//   // if (await uploadFiles()) {
//     dispatch({
//       type: ITEM_LOT_NO,
//       payload: data.lotNo,
//     });
//     dispatch({
//       type: ITEM_LOT_DATE,
//       payload: data.ilLetterDate,
//     });
//       const value = {
//       ilLetterDate: data.ilLetterDate,
//       ilLetterNo: data.ilLetterNo,
//       lotNo: data.lotNo,
//       status: data.status,
//       supplyOrderId: soId,
//       itemlots: selectedFileLot.map(file => file.name), // Send file names
//     };

//     dispatch(saveILData(value)) //expecting to save in redux
//     .then((res) => {
//       reset(defaultValues);
//       getIL();
//       getSoBySoId(soId);
//       setSelectedFileLot([]);
//     })
//     .catch((error) => {
//       console.log("error", error);
//     });
  
// };

 const onFormSubmit = async (data) => {
    const formData = new FormData();
    const req = {"ilLetterDate": data.ilLetterDate,
   "ilLetterNo": data.ilLetterNo,
   "lotNo": data.lotNo,
   "status": data.status,
   "supplyOrderId": soId,
  "type": AMENDMENT_LETTER_TYPE.SUPPLY_ORDER,
}
   formData.append("itemLotsDtoStr", JSON.stringify(req));

   for (let i = 0; i < selectedFileLot.length; i++) {
    formData.append('itemlots', selectedFileLot[i]); // 'images' is the key
  }

    
    // formData.append("itemlots", selectedFileLot); // Append the stringified array

    try {
      const response = await axiosInstanceT.post("/soItemLots/saveItemLots", formData,{  headers: {
        "Content-Type": "multipart/form-data",
      },});
      
        toast.success("Item lots Successfully Submitted.");
        console.log("Uploaded successfully!");
  // const res = response.data;
   
    
   
        dispatch({
          type: ITEM_LOT_NO,
          payload: data.lotNo,
        });
        dispatch({
          type: ITEM_LOT_DATE,
          payload: data.ilLetterDate,
        });

        const value = {
          ilLetterDate: data.ilLetterDate,
          ilLetterNo: data.ilLetterNo,
          lotNo: data.lotNo,
          status: data.status,
          supplyOrderId: soId,
          itemlots: selectedFileLot.map(file => file.name),
          type: AMENDMENT_LETTER_TYPE.SUPPLY_ORDER
        };

        dispatch(saveILData(value))
          .then(() => {
            reset(defaultValues);
          getIL()
            getSoBySoId(soId);
          
            setSelectedFileLot([]);
          })
          .catch((error) => {
            console.error("Error dispatching saveILData:", error);
          });
    
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("item lot Letter date already exist.");
    }
  };
  return (
    <div align="center">
      <Card className={classes.card}>
        <CardHeader
          classes={{
            root: classes.cardHeader,
            title: classes.cardTitle,
          }}
          style={{ textAlign: "left" }}
          title="Item Lot"
        />

        <CardContent className={classes.cardContent}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Grid
              container
              spacing={2}
              style={{ padding: "28px 18px 0px 18px" }}
            >
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                {" "}
                {/* Lot Number */}
                <Controller
                  name="lotNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="Lot Number"
                      placeholder="Enter Lot Number"
                      size="small"
                      {...props}
                      onChange={onChange}
                      value={value}
                      required
                      inputProps={{ maxLength: 50 }}
                      onInput={restrict.number}
                      error={!!errors.lotNo}
                      helperText={errors.lotNo?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                {" "}
                {/* Letter Number */}
                <Controller
                  name="ilLetterNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="Letter Number"
                      placeholder="Enter Letter Number"
                      size="small"
                      {...props}
                      onChange={onChange}
                      value={value}
                      required
                       onInput={restrict.number}
                      error={!!errors.ilLetterNo}
                      helperText={errors.ilLetterNo?.message}
                      inputProps={{ maxLength: 50 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                {" "}
                {/* Letter Date */}
                <Controller
                  name="ilLetterDate"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      type="date"
                      labelText="Letter Date"
                      placeholder="Enter Letter Date"
                      size="small"
                      {...props}
                      inputProps={{
                        max: moment(new Date()).format("YYYY-MM-DD"),
                      }}
                      onKeyDown={(e) => e.preventDefault()}
                      onChange={onChange}
                      value={value}
                      required
                      error={!!errors.ilLetterDate}
                      helperText={errors.ilLetterDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3} >
             
                <Grid container spacing={1} style={{ marginTop: '15px' }} >
                  <Grid item xs={12}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleFileInputLot}
                    />
                    <Button
                      onClick={() => {
                        fileInputRef.current.click();
                      }}
                      className={classes.browseBtn}
                      variant="outlined"
                      size="small"
                      
                    >
                      Upload Item Lots
                    </Button>
                    {/* {selectedFileLot.length > 0 && (
                      <Typography variant="caption">
                        Selected Files:{" "}
                        {selectedFileLot.map((file, index) => (
                          <span key={index}>{file.name}, </span>
                        ))}
                          <IconButton
                      size="small"
                      onClick={() => {
                        deleteFileLot();
                      }}
                    >
                      <Close fontSize="small" color="action" />
                    </IconButton>
                      </Typography>
                    )} */}


    {selectedFileLot ? (
                selectedFileLot?.map((item, id) => (
                  <StyledMenuItem>
                    <ListItemText disableTypography primary={<Typography variant="body2" noWrap>{item?.name}</Typography>} />
                    <IconButton
                      size="small"
                      onClick={() => {
                        deleteFileLot(id);
                      }}
                    >
                      <Close fontSize="small" color="action" />
                    </IconButton>
                  </StyledMenuItem>
                ))
              ) : (
                <Typography component={"span"} variant="caption" color="textSecondary">
                  No file selected.
                </Typography>
              )}
</Grid>
                </Grid>
              </Grid>
            </Grid>


            
            <Grid container spacing={2}>
              <Grid item xs={12} xl={12} align="center">
                <Button className={classes.button} onClick={handleSubmit(onFormSubmit)} type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
