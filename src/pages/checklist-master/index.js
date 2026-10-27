/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { Box, Button, FormControlLabel, FormHelperText, IconButton, LinearProgress, Paper, Radio, RadioGroup, Table, TableBody, TableContainer, TableHead, TextField, Typography } from "@material-ui/core";
import { Delete, ListAlt } from "@material-ui/icons";
import { StyledTableCell, StyledTableRow } from "Utils";
import axiosInstance from "pages/Services/AxiosInstance";
import { checklistScrutinyGiFormGetAll, checklistScrutinyGiFormUpdate, checklistScrutinyPreInspectionGetAll, checklistScrutinyPreInspectionUpdate, checklistScrutinyQaclGetAll, checklistScrutinyQaclSparesGetAll, checklistScrutinyQaclSparesUpdate, checklistScrutinyQaclUpdate, checklistScrutinyTenderGetAll, checklistScrutinyTenderUpdate, checklistScrutinyThreeTierGetAll, checklistScrutinyThreeTierUpdate } from "pages/Services/URLs";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const checkListType = [
    { type: "Scrutiny-S", getAllUrl: checklistScrutinyQaclSparesGetAll, updateUrl: checklistScrutinyQaclSparesUpdate }, // SCRUTINY OF QACL SPARES
    { type: "Scrutiny-M", getAllUrl: checklistScrutinyQaclGetAll, updateUrl: checklistScrutinyQaclUpdate }, // SCRUTINY OF QACL
    { type: "Pre-Inspect", getAllUrl: checklistScrutinyPreInspectionGetAll, updateUrl: checklistScrutinyPreInspectionUpdate },
    { type: "Scrutiny of Supply Order", getAllUrl: checklistScrutinyTenderGetAll, updateUrl: checklistScrutinyTenderUpdate },
    { type: "Scrutiny Three Tier", getAllUrl: checklistScrutinyThreeTierGetAll, updateUrl: checklistScrutinyThreeTierUpdate },
    { type: "Scrutiny GIF", getAllUrl: checklistScrutinyGiFormGetAll, updateUrl: checklistScrutinyGiFormUpdate },
];



const defaultArray = {
    reference: "",
    status: 'true',
    type: '',
    part: '',
};
const defaultValues = {
    checklist: [defaultArray],
};

export default function CheckListMaster() {
    const [selectedType, setSelectedType] = useState({ type: "Scrutiny-S", getAllUrl: checklistScrutinyQaclSparesGetAll, updateUrl: checklistScrutinyQaclSparesUpdate });
    const [loading, setLoading] = useState(false)

    const arraySchema = yup.object().shape({
        status: yup.string().required("required"),
        reference: yup
            .string()
            .trim().required("Required"),
        part: yup.number().nullable().notRequired().when("reference", (reference) => {
            if (selectedType.type === 'Scrutiny-M') {
                return yup.number().nullable().typeError("Required").required("Required")
            }
        })
    });
    const schema = yup.object().shape({
        checklist: yup.array().of(arraySchema).required("Must have fields"),
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues,
        mode: "onSubmit",
        resolver: yupResolver(schema),
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "checklist"
    })
    const handleChange = (value) => {
        if (value !== selectedType) {
            setSelectedType(value);

        }
    };
    const fetchScrutinyChecklistBySelectedItem = useCallback(async (resetOnChange) => {
        if (selectedType) {
            setLoading(true)
            if (resetOnChange) {
                reset({ checklist: [] })
            }
            try {
                const { data } = await axiosInstance(selectedType.getAllUrl)
                const sortedData = data.sort((a, b) => (a.id - b.id)).map((el) => ({ ...el, type: 'existing', status: el?.status === false ? 'false' : 'true' }))
                reset({ checklist: sortedData })
            } catch (error) {
                reset({ checklist: [] })
            } finally {
                setLoading(false)
            }
        }
    }, [selectedType])

    const onFormSubmit = async (formData) => {
        if (selectedType?.updateUrl) {
            try {
            
                fetchScrutinyChecklistBySelectedItem()
                toast.success("Updated Successfully")
            } catch (error) {
                toast.error("Something went wrong please try again.")
            }

        }
    }

    useEffect(() => {
        fetchScrutinyChecklistBySelectedItem('resetOnChange')
    }, [fetchScrutinyChecklistBySelectedItem])

    return (
        <>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {checkListType.map((el) => (
                    <Paper
                        style={{
                            border: selectedType.type === el.type ? "1px solid #205375" : "1px solid #cdcbcb",
                            boxShadow: "rgb(237 232 232) 0px 9px 20px 0px",
                            background: selectedType.type === el.type ? "#205375" : "white",
                            color: selectedType.type === el.type ? "white" : "#4c4c4c",
                            cursor: "pointer",
                            minWidth: '150px',
                        }}
                        onClick={() => {
                            handleChange(el);
                        }}
                    >
                        <Box p={0.9} style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <ListAlt />
                            <Typography variant="subtitle2" style={{ fontSize: "15px" }}>
                                {el.type}
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </div>
            {loading && <LinearProgress />}

            <TableContainer>
                <Table
                    style={{
                        position: "relative",
                        border: "1px solid lightgrey",
                    }}
                    size="small"
                    aria-label="simple table"
                    stickyHeader
                >
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell >Sl.No</StyledTableCell>
                            <StyledTableCell >Reference</StyledTableCell>
                            {selectedType.type === 'Scrutiny-M' &&
                                <StyledTableCell >Part</StyledTableCell>
                            }
                            <StyledTableCell >Status</StyledTableCell>
                            <StyledTableCell ></StyledTableCell>

                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {fields.map((item, index) => (
                            <StyledTableRow key={item.id}>
                                <StyledTableCell style={{ width: '5%' }}>
                                    {item.type === 'new' ? <Controller
                                        control={control}
                                        name={`checklist[${index}].slNo`}
                                        render={({ field: { value, onChange } }) => (<TextField size="small" variant="standard" value={value} onChange={onChange} />
                                        )}
                                    /> : item.slNo}
                                </StyledTableCell>
                                <StyledTableCell style={{ width: '75%' }}>
                                    <Controller
                                        control={control}
                                        name={`checklist[${index}].reference`}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField size="small"
                                                variant="standard"
                                                fullWidth
                                                multiline
                                                value={value}
                                                onChange={onChange}
                                                error={!!errors?.checklist?.[index]?.reference}
                                                helperText={errors?.checklist?.[index]?.reference?.message} />
                                        )}
                                    />
                                </StyledTableCell>
                                {selectedType.type === 'Scrutiny-M' &&
                                    <StyledTableCell >
                                        <Controller
                                            control={control}
                                            name={`checklist[${index}].part`}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField size="small"
                                                    variant="standard"
                                                    select
                                                    SelectProps={{ native: true }}
                                                    fullWidth
                                                    multiline
                                                    value={value}
                                                    onChange={onChange}
                                                    error={!!errors?.checklist?.[index]?.part}
                                                    helperText={errors?.checklist?.[index]?.part?.message} >
                                                    <option></option>
                                                    <option value={1}>1</option>
                                                    <option value={2}>2</option>
                                                </TextField>
                                            )}
                                        />
                                    </StyledTableCell>
                                }
                                <StyledTableCell
                                >
                                    <Controller
                                        control={control}
                                        name={`checklist[${index}].status`}
                                        render={({ field: { value, onChange } }) => (
                                            <>
                                                <RadioGroup
                                                    value={value}
                                                    row
                                                    onChange={onChange}
                                                >
                                                    <FormControlLabel
                                                        value="true"
                                                        control={<Radio size="small" />}
                                                        label="Yes"
                                                    />
                                                    <FormControlLabel
                                                        value="false"
                                                        control={<Radio size="small" />}
                                                        label="No"
                                                    />
                                                </RadioGroup>
                                                <FormHelperText
                                                    error={!!errors?.checklist?.[index]?.status}
                                                >
                                                    {errors?.checklist?.[index]?.status?.message}
                                                </FormHelperText>
                                            </>
                                        )}
                                    />
                                </StyledTableCell>
                                <StyledTableCell >
                                    {item.type === "new" &&
                                        <IconButton
                                            onClick={() => { remove(index) }}
                                            size="small">
                                            <Delete color="error" fontSize="small" />
                                        </IconButton>}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'end', gap: '12px', marginTop: '12px' }}>
                <Button
                    disabled={loading}
                    onClick={() => {
                        append({
                            reference: "",
                            status: 'true',
                            type: 'new',
                            slNo: fields.length + 1
                        })
                    }
                    }
                    style={{ margin: "0px 8px" }}
                    variant="contained"
                    color="secondary"
                >
                    Add New
                </Button>
                <Button
                    disabled={loading || !isDirty}
                    onClick={handleSubmit(onFormSubmit)}
                    style={{ margin: "0px 8px" }}
                    variant="contained"
                    color="primary"
                >
                    Submit
                </Button>
            </div>

        </>
    )
}