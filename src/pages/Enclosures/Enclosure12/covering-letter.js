import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, Typography } from "@material-ui/core";
import moment from "moment";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import CLHeader from "./ClHeader";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    tableDesign: {
        fontSize: "12px",
        width: "100%",
        // border: "1px solid grey",
        borderCollapse: "collapse",
        "& thead tr th": {
            border: "1px solid grey",
            padding: "0px 2px",
            color: "black",
            backgroundColor: "white",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
        },
        "& tbody tr td, tfoot tr td": {
            border: "1px solid grey",
            padding: "0px 2px",
            fontSize: "13px",
            textAlign: "center",
        },
    },
    printImage: {
        display: "none",
        "@media print": {
            display: "block",
        },
    },
    contentEditable: {
        minHeight: '100px',
        padding: '4px',
        border: '1px solid lightgray',
        marginBlock: '12px',
        "@media print": {
            border: 'none',
            padding: '0px',
            minHeight: 'auto',
            marginBlock: '4px',
        },
    }
}));
export default function CoveringLetter({ onClose, records }) {
    const componentRef = useRef()
    const classes = useStyles()
    return (
        <Dialog open maxWidth="md">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }} >
                <DialogTitle onClose={onClose} >
                    Covering Letter
                </DialogTitle>
                <IconButton onClick={onClose} size="small"><Close /></IconButton>
            </div>

            <DialogContent>
                <div ref={componentRef}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={12}>
                            <CLHeader remove75Logo />
                        </Grid>
                        <br />
                        <Grid item xs={9} sm={9}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>क. सं. No./ {records?.fileNo}/ Amara Raja/Issue I</p>
                        </Grid>
                        <br />
                        <Grid item xs={3} sm={3}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                {records?.inoteDate ? moment(records?.inoteDate).format("DD-MM-YYYY") : ""}
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                M/s Amara Raja Batteries Ltd., Karakamaballi - 517520, Tirupati – (AP)

                            </p>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} align="center">
                            <u>
                                <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                    <b>INSPECTION OF LV6/MT4-6140-000439 BATTERY SECONDARY LEAD ACID 12V 32<br />
                                        AH AT 20 HRS RATE, SO NO 24136/TE-650/SO-74/TPC DT. 03 AUG 2017 AND<br />
                                        AMENDMENT ISSUED TO SO VIDE LETTERS OF EVEN NO. DATED 12 SEP<br />
                                        & 27 DEC 2017. - QTY ON ORDER: 3482 Nos.</b>
                                </p>
                            </u>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                1. Reference: Your Letter No. ARBL/12V32AH/Inspection/002 dt. 13 Dec 2017
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                2. Inspection of the subjects stores tendered against supply order mentioned above has been completed as per the details given below:-
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <table className={classes.tableDesign}>
                                <thead>
                                    <tr>
                                        <th align="center" >
                                            Inspection Note No. & Date
                                        </th>
                                        <th align="center" >
                                            Total Qty on Order
                                        </th>
                                        <th align="center" >
                                            Qty Tendered
                                        </th>
                                        <th align="center" >
                                            Qty Inspected
                                        </th>
                                        <th align="center" >
                                            Qty Accepted
                                        </th>
                                        <th align="center" >
                                            Qty Rejected
                                        </th>
                                        <th align="center" >
                                            Balance Qty on Order
                                        </th>
                                        <th align="center" >
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td align="center" >
                                            (1)
                                        </td>
                                        <td align="center" >
                                            (2)
                                        </td>
                                        <td align="center" >
                                            (3)
                                        </td>
                                        <td align="center" >
                                            (4)
                                        </td>
                                        <td align="center" >
                                            (5)
                                        </td>
                                        <td align="center" >
                                            (6)
                                        </td>
                                        <td align="center" >
                                            (7)
                                        </td>
                                        <td align="center" >
                                            (8)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td rowSpan={3} align="center" >
                                            {records?.inoteNo} <br />
                                            {records?.inoteDate ? moment(records?.inoteDate).format("DD-MM-YYYY") : ""}
                                        </td>
                                        <td rowSpan={3} align="center" >
                                            {records?.inoteNo} <br />(2321+ 1161*) <br />Under Option Clause
                                        </td>
                                        <td rowSpan={3} align="center" >
                                            {records?.tendered}
                                        </td>
                                        <td rowSpan={3} align="center" >
                                            {records?.tendered}
                                        </td>
                                        <td align="center" >
                                            {records?.accepted}
                                        </td>
                                        <td align="center" >
                                            {records?.rejected ?? 0}
                                        </td>
                                        <td rowSpan={3} align="center" >
                                            -
                                        </td>
                                        <td rowSpan={3} align="center" >

                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>(दो हजार तीन सौ इक्कीस मात्र ) <br /> (Two Thousand Three Hundred Twenty One Only)</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>Accepted till date.... 2321 Nos.</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>

                                        <td colSpan={8} style={{ textAlign: 'left', paddingInline: '20px', paddingBlock: '14px' }}>
                                            <Typography st>*Remarks:- Accepted stores are marked with LS ↑ A</Typography>
                                            <div contentEditable className={classes.contentEditable}></div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                Copy No. 1 to 5 of the above Inspection Note are forwarded herewith fot further disposal.
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                3 . The accepted stores may please be despatched as per the terms and conditions of the subject contract/Supply rrder
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                4. The Delivery date expires in.......
                            </p>
                        </Grid>
                    </Grid>
                    <div style={{ pageBreakAfter: 'always' }}></div> {/* Force page break */}
                    <div className={classes.printImage} style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                            I/Note No. {records?.inoteNo}, dt
                        </p>
                    </div>
                    <div className={classes.printImage} style={{ textAlign: "center", marginBottom: '12px', fontWeight: '600' }}>
                        <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                            Page-2
                        </p>
                    </div>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                6. Please acknowledge the receipt.
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                Encl: Copy Nos 1 to 5 I/Note No. ---------
                                <br />
                                dt -------
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0, textAlign: 'right', maxWidth: "80%" }}>
                                AQAO(Ind)<br />For SQAO
                            </p>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                Copy to:-
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                1. COD, Delhi Cantt - 110 010<br />
                                With Copy No.6 of I/Note alongwith photo copy of Guarantee & Warranty Certificates.
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                2. COD, Delhi Cantt - 110 010<br />
                                With photo copy of Copy No.7 of I/Note.
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                3. The Controller, CQA(L), Bangalore-6<br />
                                With photo Copy of copy No.7 of I/Note alongwith Guarantee and Warranty Certificate.
                            </p>
                        </Grid>


                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                4. The Addl DGQA(L), HQ DQA(L) (L-11), ‘G’ Block, Nirmanbhavan Post, New Delhi - 110 011 for information. Photo copy of Copy No.7 of I/Note is forwarded.
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                5. DCDA, C/o COD Delhi Cantt - 110 010<br />
                                Less enclosure for information please.
                            </p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                6. Details of  deviations granted is as follows:-
                            </p>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <table className={classes.tableDesign}>
                                <thead>
                                    <tr>
                                        <th align="center" >
                                            Sl.No.
                                        </th>
                                        <th align="center" >
                                            Class of deviation
                                            Details of deviation /
                                        </th>
                                        <th align="center" >
                                            Authority & letter ref under which deviation  relaxation permitted
                                        </th>
                                        <th align="center" >
                                            Price Reduction if any
                                        </th>
                                        <th align="center" >
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td align="center" >
                                            (1)
                                        </td>
                                        <td align="center" >
                                            (2)
                                        </td>
                                        <td align="center" >
                                            (3)
                                        </td>
                                        <td align="center" >
                                            (4)
                                        </td>
                                        <td align="center" >
                                            (5)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td >1</td>
                                        <td ></td>
                                        <td >----Nil----</td>
                                        <td ></td>
                                        <td ></td>
                                    </tr>

                                </tbody>
                            </table>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <p style={{ fontSize: 14, margin: 0, padding: 0 }}>
                                Internal : File No. 6477/Amara Raja/Issue 1 with Copy No. 7 of I/Note No. 000400058L03. dt 29 Dec 2017<br />
                                Copy to : P & C
                            </p>
                        </Grid>
                    </Grid>
                    <br />
                </div>
            </DialogContent>
            <DialogActions>
                <ReactToPrint
                    copyStyles

                    trigger={() => (
                        <Button variant="contained" color="primary" className="printbtn">
                            Print Covering Letter
                        </Button>
                    )}
                    content={() => componentRef.current}
                />
            </DialogActions>
        </Dialog>
    )




}