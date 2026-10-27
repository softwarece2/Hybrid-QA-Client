import React from "react";
import { makeStyles } from "@material-ui/core/styles";

//material-ui
//logo
import cqaenavy from "../../../assets/Images/CQAE_NAVY_logo.png";
import cqaeISO from "../../../assets/Images/CqaeISO.png";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    // flexWrap: "wrap",
    justifyContent: "space-between",
    // border: "1px solid grey",
    // borderRadius: 4,
    padding: "0 8px 8px",
    // [theme.breakpoints.down("sm")]: {
    //   display: "block",
    // },
  },
}));

export default function ReturnOLPdf() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className="print-header">
        <p className="print-p"> Tel: 080-23571171-76</p>
        {/* <p className="print-p">
          {" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;080-2219 5493
        </p> */}
        <p className="print-p">Fax: 080-23571172</p>
        <br />
        <br />
        <p className="print-p">www.dgqadefence.gov.in</p>
        <p className="print-p">email: cqae-bng-dgqa@nic.in</p>
        {/* <p className="print-p">/insp-cqaebng@gov.in</p> */}
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={cqaenavy} alt="cqaeLogo" height={80} />
          <img src={cqaeISO} alt="cqaeISO" height={60} width={180} />
        </div>
      </div>
      <div>
        <p className="print-p">भारत सरकार</p>
        <p className="print-p">Government of India</p>
        <p className="print-p">रक्षा मंत्रालय</p>
        <p className="print-p">Ministry of Defence (DGQA)</p>
        <p className="print-p">वरिष्ठ् गुणता आश्वासन स्थापना (यु उ)</p>
        <p className="print-p">Senior  Quality Assurance Estt.</p>
        <p className="print-p">(War Equipment)</p>
        <p className="print-p">जालाह्ल्ली कैम्प रोड, यशवंतपुर</p>
        <p className="print-p">Jalahalli Camp Road,</p>
        <p className="print-p">Yashwanthpur</p>
        <p className="print-p">बैंगलुरू Bangalore 560 022</p>
      </div>
    </div>
  );
}
