import {
    Button,
    Grid,
    Paper, Typography,
 
} from "@material-ui/core";
import { useRef } from "react";
import { useDispatch } from "react-redux";

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectItem } from "Redux/Actions/SelectTreeItem";

import OLTable from "pages/Sslip/SSlipTable";
import { useReactToPrint } from "react-to-print";


export default function DispatchNote(open, setOpen) {
    const dispatch = useDispatch();
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    return (
        <>
            <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
                <Grid item xs={12} align="left">
                    <Button
                        type="Close"
                        onClick={() => {
                            dispatch(selectItem(<OLTable />));
                        }}
                        variant="contained"
                        color="Secondary"
                        size="small"
                        startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
                    // disabled={loading || !isDirty}
                    >
                        Back
                    </Button>
                </Grid>
            </Grid>
            <Paper elevation={2} style={{ padding: "10px" }}>
                <div ref={componentRef} style={{ padding: "30px" }}>

                    <Typography
                        variant="h6"
                        align="center"
                        fontWeight="bold"
                    >
                        FORMAT FOR GUIDANCE ONLY
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                    >
                        (To be submitted on firm’s letter head)
                    </Typography>

                    <Grid container spacing={0}>
                        <Grid items xs={9}>
                            <Typography variant="body1" >
                                Firm’s File reference No	……………….
                            </Typography>
                        </Grid>
                        <Grid items xs={3}>
                            <Typography variant="body1" >
                                Dated …………………..
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body1" >
                        The Senior Quality Assurance Officer SQAE	………………………………………
                    </Typography>
                    <br />
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        style={{ textDecoration: "underline" }}
                    >
                        FORWARDING OF DISPATCH DETAILS
                    </Typography>
                    <br />

                    <Typography variant="body1" style={{ marginBottom: "13px" }}>
                        1.	Reference: SQAE letter No QLBG/          /           Dated   ………………
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "13px" }}>
                        2.  Following are the dispatch details of equipments stores/spares for which Inspection Note  were issued as per letter referred above
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "13px", paddingLeft: 30 }}>
                        2.1	Firm’s Name				:
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "13px", paddingLeft: 30 }}>
                        2.2.	Indents/SO No and Date		:
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "13px", paddingLeft: 30 }}>
                        2.3.	Description / Nomenclature of	:
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "13px", paddingLeft: 63 }}>
                        Eqpts/Stores/Spares and Qty	:
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "13px", paddingLeft: 30 }}>
                        2.4.	Inspection Note No & Date		:
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "13px", paddingLeft: 30 }}>
                        2.5.	Consignee Name and Address	:
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "13px", paddingLeft: 30 }}>
                        2.6.	No of Packages			:
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "13px", paddingLeft: 30 }}>
                        (Bundles/cases/crates)
                    </Typography>
                </div>
                <Grid Container spacing={0} align="right">
                    <Typography variant="body1" >
                        Signature _________________
                    </Typography>
                    <Typography variant="body1" >
                        Name____________________
                    </Typography>
                    <Typography variant="body1" >
                        Designation _______________
                    </Typography>
                </Grid>
            </Paper >
            <br />

            <Grid Container spacing={0} align="right">
                <Button variant="contained" size="small" color="primary" onClick={handlePrint}>
                    Print
                </Button>
                &nbsp;
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => setOpen(false)}
                    type="submit">
                    Close
                </Button>
            </Grid>
        </>
    );
}
