import { makeStyles } from "@material-ui/core/styles";
// import React, { useState } from "react";
import React, { useRef, useState } from "react";

import { useSelector } from "react-redux";

//material-ui
import { CardContent, CardHeader, Checkbox, FormControlLabel, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import * as yup from "yup";

//components
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { saveAmendmentsData } from "Redux/Actions/SupplyOrder/SOAction";
import { AMENDMENT_BY_SO } from "Redux/Types";
import Button from "../../../../../components/Button";
import MultilineTextField from "../../../../../components/MultilineTextField";
import TextField from "../../../../../components/TextField";
import { restrict } from "restrict";
import { ListItemText, Typography, MenuItem, } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import { teal } from "@material-ui/core/colors";
import { toast } from "react-toastify";
import { AMENDMENT_LETTER_TYPE } from "Globals.js";


const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: "100%",
        [theme.breakpoints.down("xl")]: {
            maxWidth: "70%",
        },
        [theme.breakpoints.down("lg")]: {
            maxWidth: "70%",
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
}));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        padding: 0,
        margin: 0,
    },
}))(MenuItem);
const defaultValues = {
    letterNo: "",
    letterDate: "",
    subject: "",
    amendments: "",
    amendmentsOf: "",
    remarks: "",
    soLiId: "",
    attachments: [],
};
const schema = yup.object().shape({

    letterNo: yup

        .string()
        .typeError("required")
        .required(" required"),
    letterDate: yup
        .string()
        .typeError("required")
        .required(" required"),
    subject: yup
        .string()
        .typeError("required")
        .required(" required"),
    amendments: yup
        .string()
        .typeError("required")
        .required(" required"),
    amendmentsOf: yup
        .string()
        .typeError("required")
        .required(" required"),
});

export default function LIAmendmentsForm({ getAmendmentsIL, getSoBySoId, selectedLineItem }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [isChecked, setChecked] = useState(false);
    const selectedSoId = useSelector((store) => store.soReducer.selectedSoId);
    let fileInputAmendment = useRef(null);
    const [amendmentInput, setAmendmentInput] = useState(null);
    const [selectedFileAmendments, setSelectedFileAmendments] = useState([]);

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
    const deleteFileAmendments = (id) => {
        let randomString = Math.random().toString(36);
        const filteredListAmendment = selectedFileAmendments?.filter((item, index) => index !== id);
        setAmendmentInput(randomString);
        setSelectedFileAmendments(filteredListAmendment);
    };
    const handleFileInputAmendments = (e) => {
        const files = Array.from(e.target.files);
        let newFiles = [];
        let totalSize = 0;
        files.forEach((file) => {
            if (file.size <= MAX_FILE_SIZE) {
                if (totalSize + file.size <= MAX_TOTAL_SIZE) {
                    if (selectedFileAmendments.length + newFiles.length < MAX_FILE_COUNT) {
                        newFiles.push(file);
                        totalSize += file.size;
                    }
                } else {
                    toast.error("Adding this file exceeds the total size limit of 250MB");
                }
            } else {
                toast.error(`Please select a file less than 100MB.`);
            }
             setSelectedFileAmendments((prev) => [...prev, ...newFiles]);
      e.target.value = ""; 
        });

        const hasInvalidExtension = Array.from(files).some((file) =>
            invalidExtensions.some((extension) =>
                file.name.toLowerCase().endsWith(extension)
            )
        );
        if (hasInvalidExtension) {
            toast.error("Invalid file format.");
            // Clear the input
            encodeURIComponent.target.value = null;
            return;
        }
        setSelectedFileAmendments([...selectedFileAmendments, ...newFiles]);
    };

    const onFormSubmit = async (data) => {
        const formData = new FormData();
        const req = {
            "letterNo": data.letterNo,
            "letterDate": data.letterDate,
            "subject": data.subject,
            "amendments": data.amendments,
            "amendmentsOf": data.amendmentsOf,
            "remarks": data.remarks,
            "soLiId": selectedLineItem?.id,
            "type": AMENDMENT_LETTER_TYPE.SO_LINE_ITEM,

        };
        formData.append("amendmentsLetterDtoStr", JSON.stringify(req));

        for (let i = 0; i < selectedFileAmendments.length; i++) {
            formData.append('attachments', selectedFileAmendments[i]); // 'images' is the key
        }
        try {
            dispatch({
                type: AMENDMENT_BY_SO,
                payload: data.amendments,
            });
            dispatch(saveAmendmentsData(formData))
                .then((res) => {
                    reset(defaultValues);
                    getAmendmentsIL();
                    getSoBySoId(selectedSoId);
                    setChecked(false);
                    toast.success("Amendments added successfully");

                })
                .catch((error) => {
                    console.log("error", error);
                });
        } catch (error) {
            console.error("Error during upload:", error);
            toast.error("Letter No already exist.");
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
                    title="Letter of Amendment"
                />

                <CardContent className={classes.cardContent}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Controller
                                name="letterNo"
                                control={control}
                                render={({ field: { onChange, value, ...props } }) => (
                                    <TextField
                                        labelText="Letter No"
                                        placeholder="Enter Letter No"
                                        size="small"
                                        {...props}
                                        onChange={onChange}
                                        value={value}
                                        required
                                        onInput={restrict.number}
                                        inputProps={{
                                            maxLength: 500,
                                        }}

                                        error={!!errors.letterNo}
                                        helperText={errors.letterNo?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Controller
                                name="letterDate"
                                control={control}
                                render={({ field: { onChange, value, ...props } }) => (
                                    <TextField
                                        type="date"
                                        labelText="Letter Date"
                                        placeholder="Enter Letter Date"
                                        {...props}
                                        inputProps={{
                                            max: moment(new Date()).format("YYYY-MM-DD"),
                                        }}
                                        onkeyUp={(e) => { e.preventDefault(); e.target.value = '' }}
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={onChange}
                                        value={value}
                                        required
                                        error={!!errors.letterDate}
                                        helperText={errors.letterDate?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Controller
                                name="subject"
                                control={control}
                                render={({ field: { onChange, value, ...props } }) => (
                                    <TextField
                                        labelText="Subject"
                                        placeholder="Enter Subject"
                                        size="small"
                                        inputProps={{
                                            maxLength: 100,
                                        }}
                                        onInput={restrict.general}
                                        {...props}
                                        onChange={onChange}
                                        value={value}
                                        required
                                        error={!!errors.subject}
                                        helperText={errors.subject?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Controller
                                name="amendments"
                                control={control}
                                render={({ field: { onChange, value, ...props } }) => (
                                    <MultilineTextField
                                        rows={4}
                                        labelText="Amendments"
                                        placeholder="Enter Amendments"
                                        {...props}
                                        onChange={onChange}
                                        value={value}
                                        required
                                        onInput={restrict.remarks}
                                        inputProps={{
                                            maxLength: 200,
                                        }}
                                        error={!!errors.amendments}
                                        helperText={errors.amendments?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Controller
                                name="amendmentsOf"
                                control={control}
                                render={({ field: { onChange, value, ...props } }) => (
                                    <TextField
                                        select
                                        SelectProps={{ native: true }}
                                        labelText="Amendments of"
                                        placeholder="Select Consignee ID"
                                        {...props}
                                        onChange={onChange}
                                        value={value}
                                        required
                                        error={!!errors.amendmentsOf}
                                        helperText={errors.amendmentsOf?.message}
                                    >
                                        {/* <option></option> */}
                                        <option>Select Amendments of</option>
                                        <option>Change of QA Agency</option>
                                        <option>Others</option>
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Controller
                                name="remarks"
                                control={control}
                                render={({ field: { onChange, value, ...props } }) => (
                                    <MultilineTextField
                                        rows={4}
                                        labelText="Remarks"
                                        placeholder="Enter Remarks"
                                        size="small"
                                        inputProps={{
                                            maxLength: 500,
                                        }}
                                        onInput={restrict.remarks}
                                        {...props}
                                        onChange={onChange}
                                        value={value}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormControlLabel
                                control={<Checkbox name="checkedB" color="primary" />}
                                label="Mark it to include in Inspection Certificate"
                                checked={isChecked}
                                onChange={(event) => setChecked(event.target.checked)}
                            />
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
                                <input
                                    ref={(refParam) => (fileInputAmendment = refParam)}
                                    type="file"
                                    multiple
                                    style={{ display: "none" }}
                                    onChange={handleFileInputAmendments}
                                />
                                <Button
                                    onClick={() => {
                                        fileInputAmendment.click();
                                    }}
                                    className={classes.browseBtn}
                                    variant="outlined"
                                    size="small"
                                >
                                    Upload Amendments
                                </Button>
                                {selectedFileAmendments ? (
                                    selectedFileAmendments?.map((item, id) => (
                                        <StyledMenuItem>
                                            <ListItemText disableTypography primary={<Typography variant="body2">{item?.name}</Typography>} />
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    deleteFileAmendments(id);
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

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                            <Button className={classes.button} onClick={handleSubmit(onFormSubmit)} type="submit">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}
