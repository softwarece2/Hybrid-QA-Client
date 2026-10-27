  import { useEffect, useState, useRef } from "react";
import "../../../App.css";
//component
import TableComponent from "components/table/index";
//material-ui
import { Typography } from "@material-ui/core";
import { DialogTitle, StatusChips } from "Utils";

import { useForm} from "react-hook-form";

//icons
import ActionButton from "components/ActionButton";
import { Dialog, DialogContent} from "@material-ui/core";
import AddRegNoMapping from "./RegNoMapper/AddRegNoMapping";
import moment from "moment/moment";
import {
  getAllotedWarrants,
  getWarrantDataForTCreation,
  getwarrantBysoliId,
  warrant,
  warrantDetails,
  warranybyhosa,
} from "pages/Services/URLs";
import axiosInstanceTran from "pages/Services/AxiosInstanceTransaction";
import UpdateLineItems from "../../Sslip/CreatT";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { COMMON_STATUS_CONSTANTS, USER_DEPARTMENT, USER_ROLE_ID } from "../../../Globals.js";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import NotifyWarrants from "../SupplyOrderDetails/NotifyWarrants/NotifyWarrants";
import FilterStatusChips from "components/FilterStatusChips";

export default function WarrantDetailsTable() {
  const [records, setRecords] = useState([]);
  const [selectedLI, setSeletcedLI] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warrants, setWarrants] = useState({});
  const [openSoWoMapper, setOpenSoWoMapper] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [soObj, setSoObj] = useState(null);
  const [openAllot, setOpenAllot] = useState(false);
  const [filterStatus, setFilterStatus] = useState(["created", "in-progress"]);
  const { control, setValue } = useForm({
    mode: "onChange",
  });
  const selectedId = selectedRow.id;
  console.log(selectedId, "selectedId");
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const roleId = loggedInUser?.roleId;

  const [openSubmissionSlip, setOpenSubmissionSlip] = useState(false);
  const fetchPD = (id) => {
    // setLoading(true);
    if (id) {
      axiosInstance
        .get(getwarrantBysoliId + id)
        .then(({ data }) => {
          setRecords(data);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
 
  const truncateStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  };

  const columns = [
   { title: "EP Code", field: "partNo", width: "auto", sorting: true },
    { title: "Item Category", field: "grp", width: "auto", sorting: true },
    {
      title: "W.O NO.",
      field: "saleOrder",
      width: "auto",
      filtering: true,
    },
    { title: "WT. No.", field: "categoryName", width: "auto", filtering: true,
    render: (row) => (
      <Typography 
        variant="subtitle2" 
        style={{ ...truncateStyle, maxWidth: '100px' }} 
        title={row.categoryName}
      >
        {row.categoryName}
      </Typography>
    ),
  },

    {
      title: "Wt Issue Date",
      field: "wtIssueDate",
      width: "auto",
      render: (row) => (
        <Typography variant="subtitle2">
          {row.wtIssueDate ? moment(row.wtIssueDate).format("DD-MM-YYYY") : "-"}
        </Typography>
      ),
    },
    { title: "EST.No.", field: "estNo", width: "auto", sorting: true,
    render: (row) => (
      <Typography 
        variant="subtitle2" 
        style={{ ...truncateStyle, maxWidth: '100px' }} 
        title={row.estNo} 
      >
        {row.estNo}
      </Typography>
    ),
  },
    {
      title: "Est Date",
      field: "estDate",
      width: "auto",
      render: (row) => (
        <Typography variant="subtitle2">
          {row.estDate ? moment(row.estDate).format("DD-MM-YYYY") : "-"}
        </Typography>
      ),
    },
    { title: "Rev No.", field: "revNo", width: "auto" },
    // { title: "EST Unit Cost", field: "shipNo", width: "auto", sorting: true },
 
    { title: "Material Description", field: "materialDescription", width: "auto", sorting: true },
    { title: "Drg No.", field: "drawingNo", width: "auto", sorting: true },
    { title: "Ord.No.", field: "orderMasterNo", width: "auto" },
    { title: "Wt.Qty.", field: "qty", width: "auto" },
 { title: "Inspection Agency", field: "inspAuthorityName", width: "auto", filtering: true },

    {
      title: "Warrant Status",
      field: "warrantStaus",
      render: (el) => <StatusChips status={el.warrantStaus} />,
    },
        
 {
  title: "Registration No. Map",
  field: "mapper",
  filtering:false,
  render: (rowData) => {
    return (
     rowData.registrationNo !== 3 ? (
    
      <ActionButton
        size="small"
        color="secondary"
        variant="outlined"
        onClick={() => {
          setOpenSoWoMapper(true);
          setSelectedRow(rowData);
        }}
      >
        Reg Map
      </ActionButton>
      ) : (
      "N/A"
    )
    );
  },
},
   
    (loggedInUser.roleId === USER_ROLE_ID.ROLE_GIC || loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS) &&
    loggedInUser.departmentTypeId === USER_DEPARTMENT.ASSEMBLY
    ? {
      title: "Create Submission Slip",
      field: "submissionSlip",
      filtering:false,
      render: (rowData) => {
        return (
          <ActionButton
            size="small"
            color="secondary"
            variant="outlined"
            
            onClick={() => {
              setOpenSubmissionSlip(true);
              setSelectedRow(rowData);
              handleClick(rowData);
            }}
             
          >
            Create T
          </ActionButton>
        );
      },
    }:undefined,
  ];
  // async function fetchLI() {
  //   setLoading(true);
  //   try {
  //     const { data } = await axiosInstanceTran.get(
  //       loggedInUser.roleId == USER_ROLE_ID.ROLE_HOS? warrantDetails :getAllotedWarrants
    
  //     );
  //     setRecords(data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // useEffect(() => {
  //   fetchLI();
  // }, []);

  // async function fetchLI() {
  //   setLoading(true);
  //   try {
  //     let url;
  //     if (loggedInUser.roleId == USER_ROLE_ID.ROLE_PLANNER) {
  //       url = warrantDetails;
  //     } else if (loggedInUser.roleId == USER_ROLE_ID.ROLE_HOS) {
  //       url = warranybyhosa;
  //     } else {
  //       url = getAllotedWarrants;
  //     }

  //     const { data } = await axiosInstanceTran.get(url);
  //     setRecords(data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // useEffect(() => {
  //   fetchLI();
  // }, []);


  const statusConfigs = [
    { id: 'created', label: 'Created', color: '#ff9800', lightBg: '#fff3e0' },
    { id: 'in-progress', label: 'In progress', color: '#f44336', lightBg: '#ffebee' },
    { id: 'completed', label: 'Completed', color: '#4caf50', lightBg: '#e8f5e9' },
  ];

  const statusIdMap = {
    "created": COMMON_STATUS_CONSTANTS.CREATED,
    "in-progress": COMMON_STATUS_CONSTANTS.IN_PROGRESS,
    "completed": COMMON_STATUS_CONSTANTS.COMPLETED
  };

  const handleCheckboxChange = (statusKey) => {
    setFilterStatus((prev) => {
      let newFilters;
      
      if (prev.includes(statusKey)) {
        if (prev.length === 1) return prev; 
        newFilters = prev.filter((item) => item !== statusKey);
      } else {
        newFilters = [...prev, statusKey];
      }

      triggerApiFetch(newFilters, statusIdMap);
      return newFilters;
    });
  };


  const triggerApiFetch = (activeKeys, statusMap) => {
    const selectedIds = activeKeys.map(key => statusMap[key]);
    if (selectedIds.length === 0) {
      fetchLI();
    } else {
      fetchLI(selectedIds.join(','));
    }
  };

  // const fetchLI = (selectedStatusId = null) => {
  //     let url = "";

  //     const isSpecialRole = (roleId === USER_ROLE_ID.ROLE_PLANNER || roleId === USER_ROLE_ID.ROLE_HOS);

  //     if (isSpecialRole){
  //       if(selectedStatusId){
  //         url = `warrantDetails&statusIds=1,10`;
  //       } else {
  //       url = warranybyhosa;
  //     } 
  //   }else {
  //       url = getAllotedWarrants;
  //     }
  //     setLoading(true);
  // axiosInstanceTran(url)
  // .then(({data}) => {
  //   setRecords(data);
  // })
  //   .catch ((e) => {
  //     console.log(e);
  //   })
  //   .finally(() => setLoading(false));
  // };
  // useEffect(() => {
  //   fetchLI();
  // }, []);
  const fetchLI = (selectedStatusId = null) => {
    let url = "";
    
    // Determine the base URL based on role
    let baseUrl = "";
    const isPlanner = roleId === USER_ROLE_ID.ROLE_PLANNER;
    const isHOS = roleId === USER_ROLE_ID.ROLE_HOS;
  
    if (isPlanner) {
      baseUrl = warrantDetails;
    } else if (isHOS) {
      baseUrl = warranybyhosa;
    } else {
      baseUrl = getAllotedWarrants;
    }
  
    const defaultStatus = [COMMON_STATUS_CONSTANTS.CREATED, COMMON_STATUS_CONSTANTS.IN_PROGRESS];

    const statusParam = selectedStatusId 
      ? `?statusIds=${selectedStatusId}` 
      : `?statusIds=${defaultStatus}`;
      
    url = `${baseUrl}${statusParam}`;
  
    setLoading(true);
    axiosInstanceTran(url)
      .then(({ data }) => {
        setRecords(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLI();
  }, []); 



  const handleClick = async (rowData) => {
    console.log("hgerh", rowData);
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `${getWarrantDataForTCreation}${rowData?.id}`
      );
      console.log("data: ", data);
      setWarrants(data);
    } catch (error) {
      console.error("Error fetching updated line items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     {openAllot && (
            <NotifyWarrants
              onClose={() => {
                setOpenAllot(false);
                setSoObj({});
              }}
              soObj={soObj}
              data={records}
              refresh={fetchPD}
            />
          )}
      <Dialog fullWidth maxWidth={"lg"} open={openSubmissionSlip}>
        <DialogTitle onClose={() => setOpenSubmissionSlip(false)}>
          Create Submission Slip
        </DialogTitle>
        <DialogContent>
          <UpdateLineItems
            soObj={selectedRow}
            selectedLI={selectedLI}
            warrants={warrants}
            onClose={() => {
              setOpenSubmissionSlip(false);
            }}
          />
        </DialogContent>
      </Dialog>
      {openSoWoMapper && (
        <AddRegNoMapping
          onClose={() => setOpenSoWoMapper(false)}
          selectedRow={selectedRow}
          fetchLI={fetchLI}
        />
      )}
      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title={<FilterStatusChips filterStatus={filterStatus} handleCheckboxChange = {handleCheckboxChange} configs={statusConfigs} />}
        actions={[
          (records) => ({
            icon: () => (
              <ActionButton variant="contained" color="secondary" >
                <FontAwesomeIcon icon={faBell} />
              </ActionButton>
            ),
            // hidden: user_role === USER_ROLE_ID.ROLE_QA,
            tooltip: "Notify Assembly",
            onClick: (event, records) => {
              
                setSoObj(records);
                setOpenAllot(true);
              
            },
            // hidden: isGicFromAssembly,
          }),
          
        ]}
      />
    </>
  );
}
