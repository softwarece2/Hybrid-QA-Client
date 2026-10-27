import React from "react";
import { makeStyles } from "@material-ui/core/styles";

//material-ui
//logo
import cqaenavy from "../../assets/Images/CQAE_NAVY_logo.png";
import cqaeISO from "../../assets/Images/CqaeISO.png";
import azadiLogo from "../../assets/Images/azadiLogo.png";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 8px 8px",
  },
}));

export default function HeaderFCL({ fclData }) {
  const classes = useStyles();
  console.log(fclData?.fileNo, "file");
  console.log(fclData, "fc111");
  return (
    <>
      <div className={classes.container}>
        <div className="print-header">
          <p className="print-p"> Tel: 080-2219 5320</p>
          <p className="print-p">
            {" "}
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2219 5490
          </p>

          <p className="print-p">Fax: 080-2838 1760</p>
          <br />
          <br />
          <p className="print-p">
            <u>www.dgqadefence.gov.in</u>
          </p>
          <p className="print-p">
            {" "}
            email:<u> insp-cqaebng@gov.in</u>
          </p>
          <p className="print-p">
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{" "}
            <u>cqae-bng-dgqa@nic.in</u>
          </p>
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
            <img src={azadiLogo} alt="cqaeISO" height={60} width={160} />
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
      <div>No.CQAE(WE)/ {fclData?.fileNo}</div>

      <br />
      <div>M/S Bharat Electronics Limited</div>
      <div>(Kind Attn: QA - {fclData?.salesGrpName})</div>
      <div>Jalahalli Post</div>
      <div>Bangalore - 560013</div>
      <br />
    </>
  );
}
