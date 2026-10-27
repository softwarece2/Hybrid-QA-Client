import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Dialog, Typography, TextField } from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { Autocomplete } from "@material-ui/lab";

export default function OLEdit({ onClose, open, dataVal, fetchRecords }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        consignee: "", 
        date: dataVal?.offerDate || "",
    });
    const [consignees, setConsignees] = useState([]);
    const [consigneeLoading, setConsigneeLoading] = useState(false);

    console.log('form data ',formData)

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split("-");
        return `${year}-${month}-${day}`;
    };
    
    const fetchConsignees = (soId) => {
        if (soId) {
            setConsigneeLoading(true);
            axiosInstance
                .get(`supplyOrder/getConsigneesBySoId/${soId}`)
                .then((response) => {
                    setConsignees(response.data);
                })
                .catch((error) => {
                    console.error("Failed to fetch consignees", error);
                })
                .finally(() => {
                    setConsigneeLoading(false);
                });
        }
    };
   
    useEffect(() => {
        if (dataVal?.soId) {
            fetchConsignees(dataVal.soId);
        }
    }, [dataVal?.soId]);
   
    useEffect(() => {
        if (dataVal) {
            const formattedDate = dataVal.offerDate ? formatDate(dataVal.offerDate) : "";
            const selectedConsignee = consignees.find(
                (consignee) => consignee.id === dataVal.consigneeId
            );
            
            setFormData({
                offerLetterId: dataVal.id,
                consignee: selectedConsignee || "", 
                date: formattedDate, 
            });
        }
    }, [dataVal, consignees]);
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleConsigneeChange = (event, newValue) => {
        setFormData((prevState) => ({
            ...prevState,
            consignee: newValue || "", 
        }));
    };
   
    const onEdit = () => {
        setLoading(true);
        const updatedData = {
            offerLetterId: formData.offerLetterId,
            consigneeId: formData.consignee ? formData.consignee.id : "", 
            offerDate: formData.date,
        };

        axiosInstance
            .put(`offerLetter/editOl`, updatedData)
            .then(() => {
                toast.success("Updated Successfully");
                fetchRecords();
                onClose();
            })
            .catch((e) => {
                console.error(e);
                toast.error("Failed to update");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Dialog open={open} maxWidth="xs" fullWidth>
            <DialogTitle onClose={onClose}>Edit : {dataVal?.olNumber}</DialogTitle>
            <DialogContent>
                <Typography align="center" style={{ fontSize: "1.1rem", marginBottom: "16px" }}></Typography>
                
                <Autocomplete
                    options={consignees}
                    getOptionLabel={(option) => option.name || ""}
                    value={formData.consignee}
                    onChange={handleConsigneeChange}
                    loading={consigneeLoading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Change Consignee"
                            variant="outlined"
                            fullWidth
                            size="small"
                            margin="normal"
                            onInputChange={(event, value) => {
                                fetchConsignees(value);
                            }}
                        />
                    )}
                />
                
                <TextField
                    label="Offered Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size="small"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContent>

            <DialogActions>
                <Button disabled={loading} size="small" variant="contained" color="primary" onClick={onEdit}>
                    {loading && <CircularProgress size="24px" />}
                    Save
                </Button>
                <Button size="small" variant="contained" color="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
