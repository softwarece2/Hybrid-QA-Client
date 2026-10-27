import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from "@material-ui/core";
import { DialogTitle } from "Utils";
export default function LineItemDetails({ onClose, selectedLineItem }) {
    console.log(selectedLineItem, 'fghsg');

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                <b>Details of</b> <b>Line Item Number :</b> {selectedLineItem?.lineItemNo}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6} sm={6} md={3} lg={4} xl={4}>
                        <Typography><b>Material No./EP Code No. :</b> {selectedLineItem?.partNumberName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Item Category :</b> {selectedLineItem?.itemCategoryName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>NSN Part No. :</b> {selectedLineItem?.nsnPartNumber || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>CAT Part No. :</b> {selectedLineItem?.catPartNumber || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>UOM :</b> {selectedLineItem?.uomName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Material Description :</b> {selectedLineItem?.materialDescription || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Drawing No. :</b> {selectedLineItem?.drawingNo || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Work Order No. :</b> {selectedLineItem?.saleOrderNo || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Order Master No.:</b> {selectedLineItem?.orderMasterNo || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Inspection Agency:</b> {selectedLineItem?.inspectionAuthorityName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Supply Type:</b> {selectedLineItem?.supplyTypeName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Registration/Running No.:</b> {selectedLineItem?.registrationNoName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Unit Price:</b> {selectedLineItem?.unitCostStr || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Delivery Date:</b> {selectedLineItem?.deliveryDate ? new Date(selectedLineItem?.deliveryDate).toLocaleDateString() : 'N/A'} </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Total Quantity:</b> {selectedLineItem?.orderQty || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <Typography><b>Consignee:</b> {selectedLineItem?.consignee || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>Reference No.:</b> {selectedLineItem?.refNo || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>BID/RFP/GEM/IFD/IND TYPE:</b> {selectedLineItem?.orderTypeName || 'N/A'} </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={4} xl={4}>
                        <Typography><b>BID/RFP/GEM/IFD/IND DATE:</b> {selectedLineItem?.orderTypeDate ? new Date(selectedLineItem?.orderTypeDate).toLocaleDateString() : 'N/A'} </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography><b>BID/RFP/GEM/IFD/IND NO.:</b> {selectedLineItem?.orderTypeNo || 'N/A'} </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
