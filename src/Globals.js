import moment from "moment";

// services context appending only for Nginx deplaoyment
// export const baseURL = "http://65.1.180.79/app";
// export const baseURL = "http://172.16.68.203:8080/app";
// export const baseURL = "http://172.16.68.203:8080/app";
// export const baseURL = "http://3.111.50.28:5432/ims-test-team";
export const APPLICATION_MODE = "DEV";
export const USER_TYPES = {
  ROLE_SUPERADMIN: "ROLE_SUPERADMIN",
  ROLE_NODALOFFICER: "ROLE_NODALOFFICER",
  ROLE_USHER: "ROLE_USHER",
  ROLE_INVITEE: "ROLE_INVITEE",
};
export const USER_STATUS = {
  FIRST_LOGIN: 0,
  ACTIVE: 1,
  INACTIVE: 2,
};
export const USER_DEPARTMENT = {
  PLANNING: 1,
  ASSEMBLY: 2,
  QC: 3,
};

export const USER_ROLE_ID = {
  ROLE_SUPER_ADMIN: 1,
  ROLE_DC: 2, // Deputy Controller
  ROLE_AC: 3, //CQAO //SQAO // Assistant Controller
  ROLE_DAC: 4, //CQAI JUNIOR ENGINNER (JC) // QAO // Deputy Assistant Controller
  ROLE_AE: 5, //DQAO // Assistant Engineer
  ROLE_JE: 6, //AQAO // Junior Engineer
  ROLE_INSPECTOR: 7, //CQAI EXAMINER //Inspector
  ROLE_FIRM_ADMIN: 9, //SBU admin
  ROLE_HOS: 14,
  ROLE_GIC: 15, //Group Incharge
  ROLE_EXAMINER: 16, //Examiner
  ROLE_PLANNER: 17, //Planner
  ROLE_DO: 18, //Divisional Officers
  ROLE_DOA: 19, ////Divisional Officers Assembly
};

export const WING_ID = {
  ARMY: 1,
  NAVY: 2,
  AIR_FORCE: 3,
};

export const PRODUCT_ID = {
  TPDK: 109,
};

export const TEST_ID = {
  TPDK_COLD: 1058,
  TPDK_HOT: 1059,
};


export const OL_STATUS = {
  ACCEPTED: 1,
  REJECTED: 2,
  RFR: 8,
  APPROVE: 9,
  RECTIFICATION: 10,
  RETURN_QACL: 13,
};

export const REGISTRATION_NUMBER_STATUS = {
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  RFR: "rfr",
  PENDING : "pending",
  INPROCESS: "in-process",
  PASS:'pass',
  FAIL :"fail"
};
export const ORG_TYPE = {
  QA_AGENCY: 1,
  FIRM: 2,
};
export const DEPARTMENT_ID = {
  PLANNING: 1,
  ASSEMBLY: 2,
  QC: 3,
};
export const AGENCY_ID = {
  OLFAGENCY: 2,
  CQAIAGENCY: 151,
  
};

export const COMMON_STATUS_CONSTANTS = {
  APPROVED : 1,
  REJECTED : 2,
  CLEARED : 3,
  PENDING : 4,
  IN_PROGRESS : 5,
  RETURNED : 6,
  COMPLETED : 7,
  RFR : 8,
  I_NOTE_GENERATED : 9,
  RECTIFICATION : 10,
  PASS : 11,
  FAIL : 12,
  RETURN_QACL : 13,
  CREATED : 14,
}
export const COMMON_STATUS_SO_CONSTANTS = {
CREATED:5,
NOTIFIED_TO_HOSA:8,
NOTIFIED_TO_GICA :9,
Notified:7
}
export const AMENDMENT_LETTER_TYPE = {
  SUPPLY_ORDER: 1,
  SO_LINE_ITEM: 2,
};

// VAPT Key
//export const TEST_SITE_KEY = "6LcvTzohAAAAAIUj2iYz0gCLb5Y28mLtHJx8IYdy";

//UAT Key
export const TEST_SITE_KEY = "6LfjZT0hAAAAALrq4CvHEwcIRznmZwXxd1IA7S37";

export const MAX_DATE = "2030-12-31";
export const CURRENT_DATE = moment().format("yyyy-MM-DD");
export const phoneRegExp = /[6-9]{1}[0-9]{9}/;
export const emailRegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const OLMS_INFO = {
  version: "1.0",
  date: "27-10-2025",
  copyrightText: `Copyright ${moment().format("yyyy")}  Bharat Electronics Limited.`,
};

export function ExcelDateToJSDate(serial) {
  var utc_days = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

export function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const savedMsg = "Saved Successfully";
export const updateMsg = "Updated Successfully";
export const deleteMsg = "Deleted Successfully";
export const failedMsg = "Something went wrong";
export const recordsExistMsg = "Record already exist";
export const somethingWentWrongMsg = "Something went wrong";

export const headerValue = (id) => {
  if (id === "fcm") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "72 of 80",
    };
  } else if (id === "poObs") {
    return {
      subHeading: "---",
      doc: "--",
      version: "--",
      issueDate: "--",
      page: "---",
    };
  } else if (id === "scrutinyOl") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "33 of 80",
    };
  } else if (id === "phyinsp") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "35 of 80",
    };
  } else if (id === "pcb") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "46 of 80",
    };
  } else if (id === "scm") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "49 of 80",
    };
  } else if (id === "elecInsp") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "44 of 80",
    };
  } else if (id === "cables") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "42 of 80",
    };
  } else if (id === "preDispMain") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "45 of 80",
    };
  } else if (id === "preDispSpares") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "38 of 80",
    };
  } else if (id === "qin") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "61 of 80",
    };
  } else if (id === "fcl") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "61 of 80",
    };
  } else if (id === "workload") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "66 of 80",
    };
  } else if (id === "fileClose") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "60 of 80",
    };
  } else if (id === "scrutinySo") {
    return {
      subHeading: "Inspection Department",
      doc: "DOP/IS/001",
      version: "2.0",
      issueDate: "31 Oct 2022",
      page: "60 of 80",
    };
  } else if (id === "a") {
    return {
      subHeading: "--",
      doc: "--",
      version: "--",
      issueDate: "--",
      page: "--",
    };
  }
  return null;
};


export function getLast10Years() {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 0; i < 10; i++) {
    years.push(currentYear - i);
  }

  return years;
}

// export function getLast10YearsWithNextYear() {
//   const currentYear = new Date().getFullYear() + 1;
//   const years = [];

//   for (let i = 0; i < 10; i++) {
//     years.push(currentYear - i);
//   }

//   return years;
// }

// export function Quarters() {
 

//   return [
//     {label:"First Quarters", value:1},
//     {label:"Second Quarters", value:2},
//     {label:"Third Quarters", value:3},
//     {label:"Forth Quarters", value:4},
  
//   ];
// }
