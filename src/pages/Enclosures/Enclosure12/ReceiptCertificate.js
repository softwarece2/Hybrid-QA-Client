import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRef } from "react";
import { Paper, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";

import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";

import { StyledTableCell } from "../../../components/UseTable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    width: "100%",
    padding: "15px 15px 15px 15px",
    [theme.breakpoints.down("lg")]: {
      width: "98%",
    },
    [theme.breakpoints.down("md")]: {
      width: "93%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "88%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "83%",
    },
  },
  size: {
    width: 15,
    height: 15,
  },
  table: {
    width: "100%",
  },
  tableCell: {
    border: "1px solid black",
  },
  subHeading: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  headingNote: {
    fontWeight: 600,
  },
  textSize: {
    fontSize: "0.875rem",
  },
}));

export default function ReceiptCertificate() {
  const classes = useStyles();
  const printrefr = useRef();

  return (
    <div ref={printrefr}>
      <Grid container spacing={1} >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.subHeading} style={{textDecoration:'underline'}}>
            <b>भाग-II रिसिप्ट सर्टिफिकेट / PART II - RECEIPT CERTIFICATE</b>
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
          <Typography className={classes.subHeading}>
            (100% अंतिम भुगतान के लिए कॉपी संख्या 1, 2,4 और 5 पर तथा अग्रिम भुगतान90%/95%/98% तथा शेष 10%/5%/2% भुगतान के लिए कॉपी संख्या 2,4,और 5 कंसाइनी द्वारा पूरा किया जाना है। )
          </Typography>
          <Typography className={classes.subHeading}>
            (To be completed by the consignee on copies Nos. 1,2,4 and 5 for final 100% payment and on copies Nos. 2,4 and 5 for Advance 90 % / 95% / 98% payment and balance 10% / 5% / 2% payment)
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
          <Typography className={classes.subHeading}>
            1.प्रमाणित किया जाता है कि तथा इसके साथ स्लंग्न शीट................. में, स्वीकृत स्टोर्स नीचे 3 पर दी गई टिप्पणियों के अनुसार/अधीन अच्छी स्थिति में प्राप्त किया गया।
          </Typography>
          <Typography className={classes.subHeading}>
            {" "}
            &nbsp;&nbsp;Certified that the stores as accepted and in the ............ continuation sheets attached have been received in good condition subject to the remarks at 3 below.
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
          <Typography className={classes.subHeading}>
            (a).रिसिप्टनंबरऔरदिनांकReceipt No. and date ........................ स्टोर्सकेप्राप्तिकास्थानStation of receipt of stores …………………..
          </Typography>
          <Typography className={classes.subHeading}>
            (b) डिलीवरीकीवास्तविकदिनांकActual dale of delivery .....................................................................................................................
          </Typography>
        </Grid>



        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
          <Typography className={classes.subHeading}>
            2 .स्टोर्स को डिपो/ ट्रांसिट/ स्टॉक आदि में (इसे भरा जाए)...................अवधि, ............महीने,...........वर्ष, के लिए कंसाइनी/डिपो/रिसिप्ट वाउचर संख्या................दिनांक ................के द्वारा शामिल किया गया।
          </Typography>
          <Typography className={classes.subHeading}>
            {" "}
            &nbsp;&nbsp;The stores have been taken to account vide Consignee/Depot Receipt Voucher No. ....................dt..............in Depot/transit/stock etc (to be filled in) ....................................account for the period, month................year....................
          </Typography>
        </Grid>

        <Grid item xs={6} align="left">
          <Typography className={classes.subHeading}>
            3.कमी/टूट-फुट/ट्रांसिटलॉस्ट/इंसयूरेंस क्लैम/भाड़ा आदि के संबंध में  कंसाइनी द्वारा प्रस्तावित वसूली का ब्योरा जोकि सप्लायर/कांट्रकटर के द्वारा कांट्रैक्ट की शर्तों के अधीन किया जाना चाहिए।
          </Typography>
          <Typography className={classes.subHeading}>

            Details of recoveries proposed by the consignees / Depot in respect of deficiency/ breakage transit loss / insurance claim and / or freight etc. which should be made from the Supplier/Contractor under the terms of the Contract. {" "}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
          <Typography className={classes.subHeading}>
            वाहक के कारण वाली विसंगतियों का ब्योरा
          </Typography>
          <Typography className={classes.subHeading}>
            Details of discrepancies attributable to the carrier:-
          </Typography>
        </Grid>

        <Grid item xs={6} align="center">
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell className={classes.tableCell} align="center">
                    आइटम/मद/ Item
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell} align="center">
                    कारण / Reason
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell} align="center">
                    राशि (रुपए में)/ Amount (in Rs)
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <StyledTableCell
                    className={classes.tableCell}
                    scope="row"
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                </TableRow>

                <TableRow>
                  <StyledTableCell
                    className={classes.tableCell}
                    scope="row"
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                </TableRow>

                <TableRow>
                  <StyledTableCell
                    className={classes.tableCell}
                    scope="row"
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                </TableRow>

                <TableRow>
                  <StyledTableCell
                    className={classes.tableCell}
                    scope="row"
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={6} align="center">
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell className={classes.tableCell} align="center">
                    आइटम/मद/ Item
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell} align="center">
                    कारण / Reason
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell} align="center">
                    मात्रा / Quantity
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <StyledTableCell
                    className={classes.tableCell}
                    scope="row"
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                </TableRow>

                <TableRow>
                  <StyledTableCell
                    className={classes.tableCell}
                    scope="row"
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                </TableRow>

                <TableRow>
                  <StyledTableCell
                    className={classes.tableCell}
                    scope="row"
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                </TableRow>

                <TableRow>
                  <StyledTableCell
                    className={classes.tableCell}
                    scope="row"
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    align="center"
                  ></StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
{/* 
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
          <Typography className={classes.subHeading}>
            मंडल या क्षेत्र
          </Typography>
          <Typography className={classes.subHeading}>
            Circle or area. . . . . . . . . . . . . . . . . . . . . . . . . . .
          </Typography>
        </Grid> */}

        <Grid item xs={4} sm={4} md={8} lg={8} xl={8} align="left">
          <Typography className={classes.subHeading}>स्थान</Typography>
          <Typography className={classes.subHeading}>
            Station. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
          </Typography>
        </Grid>

        <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
          <Typography className={classes.subHeading}>हस्ताक्षर</Typography>
          <Typography className={classes.subHeading}>
            Signature. . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . .
          </Typography>
        </Grid>

        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} align="left">
          <Typography className={classes.subHeading}>तारीख</Typography>
          <Typography className={classes.subHeading}>
            Dated. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . .
          </Typography>
        </Grid>

        <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
          <Typography className={classes.subHeading}>पदनाम</Typography>
          <Typography className={classes.subHeading}>
            Designation. . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            .
          </Typography>
        </Grid>
         <Grid item xs={8} sm={8} md={8} lg={8} xl={8} align="left">
          <Typography className={classes.subHeading}> स्थापना/यूनिट</Typography>
          <Typography className={classes.subHeading}>
           Estt / Unit  . . . . . . . . . . . . . . . . . . . . . . . . . .
          </Typography>
        </Grid>
         <Grid item xs={8} sm={8} md={8} lg={8} xl={8} align="left">
          <Typography className={classes.subHeading}>टेलीफोन नंबर</Typography>
          <Typography className={classes.subHeading}>
            Tele No.  . . . . . . . . . . . . . . . . . . . . . . . . . .
          </Typography>
        </Grid>


        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
          <Typography className={classes.subHeading} style={{textDecoration:'underline'}}>
            नीस्थायडिलीवरीके/मामले में  / In the case of Local Delivery
          </Typography>
          <br/>
          <Typography className={classes.subHeading}>
            यह एक अस्थाई रसीद है। यह संबन्धित कन्साईनी/डीपो द्वारा, अनुबंध/आपूर्ति आदेश की सामान्य शर्तों के तहत निरीक्षण और अस्वीकृति के उसके अधिकारों की प्रतिकूलता के बिना, भंडार(स्टोर्स) की प्राप्ति का एक टोकन है। इसे इस आधार पर जारी किया जाता है की ठेकेदार/आपूर्तिकर्ता कुल मात्र को साबित करने और माल की कमी, यदि कोई हो, को कंसाइनी/ डीपो द्वारा वास्तव में वितरित किए जाने के संबंध में किए गए निरीक्षण के अनुसार पूरा करने के लिए जिम्मेदार रहता है।
          </Typography>
          <Typography className={classes.subHeading}>
            This is a provisional receipt. It is only a token the receipt of stores by the Consignee / Depot concern and without prejudice to his rights of inspection and rejection under the general conditions to the Contract / Supply Order. It is issued on said to contain basis the Contractor / Supplier’s remaining responsible for proving total quantities and making goods deficiencies if any brought out by the Consignee / Depot as per inspection carried out on actually delivered.
          </Typography>
        </Grid>

        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} align="left">
          <Typography className={classes.subHeading}>स्थान</Typography>
          <Typography className={classes.subHeading}>
            Station. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . . .
          </Typography>
        </Grid>

        <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
          <Typography className={classes.subHeading}>
            कन्साईनी/ डीपो के हस्ताक्षर डीपो
          </Typography>
          <Typography className={classes.subHeading}>
            Signature of Cosignee / Depot
          </Typography>
        </Grid>

        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} align="left">
          <Typography className={classes.subHeading}>तारीख</Typography>
          <Typography className={classes.subHeading}>
            Date. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            . . . . .
          </Typography>
        </Grid>

        <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
          <Typography className={classes.subHeading}>
            पदनाम मोहर सहित
          </Typography>
          <Typography className={classes.subHeading}>
            Designation (with rubber stamps)
          </Typography>
        </Grid>
      
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <br />
          <Typography className={classes.subHeading} style={{fontWeight:'bold'}}>टिप्पणियाँ / Note:-</Typography>
          <Typography className={classes.subHeading}>
            1. इसप्रमाणपत्रपरअनुबंध/आपूर्तिआदेशोंमेंनिरधिष्टकंसाएनीद्वारास्याहीसेहस्ताक्षरकिएजानेहैं।जहांयहसंभवनहींहै या असुविधाजनक है, वहाँ इस पर कन्साईनी द्वारा विधिवत अधिकृत अधिकारी द्वारा स्याही से हस्ताक्षर किया जाना चाहिए। ऐसे मामलों में अधिकारी रसीद प्रमाण-पत्र पर हस्ताक्षर करता है, उस अधिकारी के पदनाम का उल्लेख करना चाहिए जिस की ओर से वह हस्ताक्षर कर रहा है।
          </Typography>
          <Typography className={classes.subHeading}>
            This certificate is to be signed in ink by the Consignee specified in the Contract / Supply order.
            Where this is not possible or inconvenient, it should be signed in ink by an official duly authorised by the consignee in that behalf.
            In such cases the Official signing the receipt certificate should indicate the designation of the official on whose behalf he/she is signing.
          </Typography>
          <br></br>
          <Typography className={classes.subHeading}>
            2. कन्साईनी/डीपो को इन प्रतियों को आवश्यकतानुसार भडार (स्टोर्स) की प्राप्ति के ...............दिनों के भीतर अपनी टिप्पणियों के साथ वापस करना होगा।
          </Typography>
          <Typography className={classes.subHeading}>
            Consignee/Depot must return these copies with his remarks as required within ..............................................from the date of receipt of stores.
          </Typography>
          <br></br>
          <Typography className={classes.subHeading}>
            3. पूर्ण अस्वीकृर्ट की स्थिति में केवल प्रतियाँ संख्या 3,6 और 7 ही जारी की जाएंगी।
          </Typography>
          <Typography className={classes.subHeading}>
            In case of total rejection, copies No. 3, 6 and 7 only will be issued..
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
