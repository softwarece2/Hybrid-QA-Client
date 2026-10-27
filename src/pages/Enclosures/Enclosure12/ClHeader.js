import React from "react";
import { makeStyles } from "@material-ui/core/styles";

//material-ui
//logo

import SQAE from "assets/Images/sqae_logo.png";
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 8px 8px",
  },
}));

export default function CLHeader({remove75Logo}) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className="print-header">
       
        <p className="print-p">दूरभाष /फ़ैक्स Phone/Fax: 044-27741059</p>

        <p className="print-p">ईमेल e-mail: sqaelsecbad@nic.in </p>
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
          <img src={SQAE} alt="cqaeLogo" height={80} />
        </div>
      </div>
      <div>
        <p className="print-p">भारत सरकार</p>
        <p className="print-p">Government of India</p>
        <p className="print-p">रक्षा मंत्रालय</p>
        <p className="print-p">Ministry of Defence (DGQA)</p>
        <p className="print-p">वरिष्ठ गुणवत्ता आश्वासन स्थापना (इलेक्ट्रॉनिकी)</p>
        <p className="print-p">Senior Quality Assurance Establishment (Electronics)</p>
        <p className="print-p">डीजीक्यूए परिसर  DGQA Complex</p>
        <p className="print-p"> मनोविकास नगर पोस्ट Manovikas Nagar Post</p>
        <p className="print-p">बैंगलुरू Bangalore 500 009</p>
      </div>
    </div>
  );
}
