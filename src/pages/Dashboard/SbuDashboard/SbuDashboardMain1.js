// import { Grid } from "@material-ui/core";
// // import CqaoINoteGraph from "../CqaoDash/INoteGraph/CqaoINoteGraph";
// import { useSelector } from "react-redux";
// import { USER_DEPARTMENT } from "Globals.js";
// import PoDdExpired from "../CqaoDash/SOGraph/PoDdExpired";
// import OlDdExpired from "../CqaoDash/OLGraph/OlDdExpired";
// import CqaoINoteGraph from "../CqaoDash/INoteGraph/CqaoINoteGraph";
// import PassFailCount from "pages/Chart/passfailCount";
// import CqaoInoteGraph1 from "../CqaoDash/INoteGraph/CqaoInoteGraph1";

// export default function SbuDashboardMain1() {
//   const loggedInUser = useSelector((store) => store.loggedInUser);
//   // const isPlannerDepartment = loggedInUser?.departmentTypeId === USER_DEPARTMENT.PLANNING;
//   return (
//     <Grid container spacing={2}  alignItems="center">
   
//         <>
//           <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
//             <PoDdExpired />
//           </Grid>

//           {/* Submission Slip graph */}
//           <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
//             <OlDdExpired />
//           </Grid>

//           {/* Challan graph */}
//           {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
//             <CqaoInoteGraph1 />
//           </Grid>
        
//           <Grid item xs={12} >
//           <PassFailCount />
//       </Grid> */}
//     </>

//     </Grid>
//   );
// }
