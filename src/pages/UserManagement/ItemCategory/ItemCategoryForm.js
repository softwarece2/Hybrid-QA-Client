/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

//hooks
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//redux
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { restrict } from "../../../restrict";

//material-ui
import {
    Card,
    CardHeader,
    Grid,
    CardContent,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//components
import TextField from "../../../components/TextField";

import Button from "../../../components/Button";

//actions
import {
    saveItemCategoryDetails,
    updateItemCategoryDetails,
} from "../../../Redux/Actions/UserManagement/ItemCategoryAction";

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: "100%",
        [theme.breakpoints.down("xl")]: {
            maxWidth: "50%",
        },
        [theme.breakpoints.down("lg")]: {
            maxWidth: "60%",
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
    button: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        "&:hover, &:focus": {
            color: theme.palette.secondary.contrastText,
            background: theme.palette.secondary.main,
        },
    },
    disabledButton: {
        backgroundColor: "#D3D3D3",
    },
    reset: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        "&:hover, &:focus": {
            color: theme.palette.primary.contrastText,
            background: theme.palette.primary.main,
        },
    },
}));

const schema = yup.object().shape({
    category: yup
        .string()
        .trim()
        .min(2, "Category is atleast 2 characters")
        // .matches(/^[A-Z 0-9a-z\s+&-]*$/, "Please enter valid category")
        .typeError("Item Category is required")
        .required("Item Category is required"),
    active: yup.boolean().required("Status is required"),
});

export default function ItemCategoryForm({ fetch, itemCatDetails, records }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false);
    const user_emp = useSelector((store) => store.loggedInUser?.empId);

    let defaultValues = {
        category: "",
        active: "true",
        createdBy: "",
    };

    const {

        handleSubmit,
        reset,
        control,
        getValues,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const executeSubmit = (data) => {
        const value = {
            createdBy: user_emp,
            category: data.category,
            active: data.active,
            id: data.id,
        };


        if (edit) {
            const otherRecords = records.filter((item) => item.id !== data.id);

            const existing = otherRecords.findIndex(
                (r) => r.category?.toLowerCase() === data.category?.toLowerCase()
            );
            if (existing === -1) {
                dispatch(saveItemCategoryDetails(value))
                    .then((res) => {
                        if (res.status === 200 || res.status === 201) {
                            const str = "Data Successfully Updated.";
                            fetch();
                            toast.success(str);
                            resetForm();
                        } else if (res.response.status === 409) {
                            toast.warning(res.response.data);
                        }
                    })
                    .catch((error) => {
                        toast.error("Something went wrong");
                    });
            } else {
                toast.error("Record already exists");
            }
        } else {
            const existing = records.findIndex(
                (r) => r.category?.toLowerCase() === data.category?.toLowerCase()
            );
            if (existing === -1) {
                dispatch(saveItemCategoryDetails(value))
                    .then((res) => {
                        if (res.status === 200 || res.status === 201) {
                            const str = "Data Successfully Submitted.";
                            fetch();
                            toast.success(str);
                            resetForm();
                        } else if (res.response.status === 409) {
                            toast.warning(res.response.data);
                        }
                    })
                    .catch((error) => {
                        toast.error("Something went wrong");
                    });
            } else {
                toast.error("Record already exists");
            }
        }
    };

    const executeUpdate = (data) => {
        const value = {
            id: data?.id,
            category: data?.category,
            active: data?.active,
        };
        console.log("value", value);
        dispatch(updateItemCategoryDetails(value))
            .then((res) => {
                console.log("it is coming");
                if (res.status === 200 || res.status === 201) {
                    console.log("abcd", res.response);
                    const str = `${edit ? "Data Successfully Updated." : "Data Successfully Submitted."
                        }`;
                    fetch();
                    toast.success(str);
                    // reset(defaultValues);
                    resetForm();
                } else if (res.response.status === 409) {
                    toast.warning(res.response.data);
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error("Something went wrong");
            });
        setEdit(false);
    };

    const resetForm = () => {
        reset(defaultValues);
        // setEdit(false);
    };

    useEffect(() => {
        Object.keys(itemCatDetails).length === 0 ? setEdit(false) : setEdit(true);
        console.log("itemCatDetails values", itemCatDetails);
        reset(itemCatDetails);
    }, [itemCatDetails]);

    console.log("values", getValues());

    return (
        <div align="center">
            <form onSubmit={handleSubmit(executeSubmit)}>
                <Card className={classes.card}>
                    <CardHeader
                        classes={{
                            root: classes.cardHeader,
                            title: classes.cardTitle,
                        }}
                        style={{ textAlign: "left" }}
                        title={!edit ? "Item Category Form" : "Edit Item Category Form"}
                    />

                    <CardContent className={classes.cardContent}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span>Item Category <span style={{ color: "red" }}>*</span> :</span>

                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <TextField
                                                    placeholder={"Item Category"}
                                                    required
                                                    //   disabled={isDirty}
                                                    inputProps={{ maxLength: 100 }}
                                                    onInput={restrict.itemcategory}
                                                    value={value}
                                                    onChange={onChange}
                                                    error={!!errors.category}
                                                    helperText={errors.category?.message}
                                                    style={{ marginLeft: '8px', width: '400%' }}  // Add margin for spacing

                                                />
                                            );
                                        }}
                                    ></Controller>
                                </div>
                            </Grid>

                            {edit ? (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <Controller
                                        name="active"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <RadioGroup
                                                    name="radio-buttons-group"
                                                    onChange={onChange}
                                                    row
                                                    defaultValue={value}
                                                    value={value}
                                                >
                                                    <FormControlLabel
                                                        value="true"
                                                        control={<Radio size="small" />}
                                                        label="Active"
                                                    />
                                                    <FormControlLabel
                                                        value="false"
                                                        control={<Radio size="small" />}
                                                        label="Inactive"
                                                    />
                                                </RadioGroup>
                                            );
                                        }}
                                    ></Controller>
                                </Grid>
                            ) : null}
                            <Grid container spacing={2}>
                                <Grid item xs={6} xl={6} align="right">
                                    {edit ? (
                                        <Button
                                            className={
                                                !isDirty ? classes.disabledButton : classes.button
                                            }
                                            disabled={!isDirty}
                                            onClick={handleSubmit(executeUpdate)}
                                        >
                                            Update
                                        </Button>
                                    ) : (
                                        <Button
                                            className={classes.button}
                                            onClick={handleSubmit(executeSubmit)}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item xs={6} xl={6} align="left">
                                    <Button
                                        className={classes.reset}
                                        onClick={(e) => {
                                            resetForm();
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
