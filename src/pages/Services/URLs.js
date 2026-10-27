//***UserManagement***
//change password
export const changePasswordUrl = "user/changePassword";
export const getCaptchaUrl = "captcha/get";
//Logout
export const userLogoutUrl = "user/logout";
//organization
export const saveOrganization = "organization/save";
export const updateOrganization = "organization/update";
export const getAllOrganization = "organization/getAll";
export const getAllOrganizationType = "orgType/getAll";
//salesgroup
export const saveSalesgroup = "salesGroup/save";
export const getAllSalesGroups = "salesGroup/getAll";
export const updateSalesGroup = "salesGroup/update";
export const departmentGetAllDepartmentType = "department/getAllDepartmentType";
export const getAllDepartments = "department/getAllDepts";
//export const getAllDepartments="partNumber/departments";
//opa
export const saveOpa = "opa/save";
export const getAllOpa = "opa/getAll";

//FileClosingForm
export const getFileClosingForm = "/fileClosingForm/so/";
export const submitFileClosingForm = "/fileClosingForm/submitFileClosingForm";
export const saveFileClosingForm = "/fileClosingForm/saveFileClosingForm";

//supplier
export const saveSupplier = "supplier/save";
export const updateSupplier = "supplier/update";
export const getAllSupplier = "supplier/getAll";

//account type
export const getAllAccountTypes = "account/getAll";

//supply order
export const saveSOSbuImport = "supplyOrder/save";
export const deleteSO = "supplyOrder/delete/";
export const savePDImport = "project/saveProject";
export const updatePD = "project/updateProject";
export const saveOLImport = "offerLetter/save";
export const getById = "supplyOrder/";
export const saveLineImport = "soLineItem/save";
export const fetchSoByOrgId = "supplyOrder/getAllSupplyOrdersByOrgId/";
export const fetchSoByOrgIdOptimized =
  "supplyOrder/getAllSupplyOrdersByOrgIdOptimized/";
export const getAllotedSupplyOrderDetailsUrl =
  "supplyOrder/getAllSupplyOrdersByEmpId/";
export const getILBySoId = "soItemLots";
export const saveIL = "soItemLots/saveItemLots";

export const getDdBySO = "ddExtension";
export const saveDdExtn = "ddExtension/save";
export const getAllSO = "supplyOrder/getAll";
export const getAllSOById = "supplyOrder/getAllSupplyOrdersBySalesGrp/";
export const getAllSOBySalesGrpOptimizedUrl =
  "supplyOrder/getAllSupplyOrdersBySalesGrpOptimized/";

//get ATE
export const getOlATE = "orgCqae/getAteById/";

//Aol
export const aolSave = "aolaod/save";
export const getAllAoldetails = "aolaod/getAllByOrgId/";

export const getSoAttachmentsUrl = "supplyOrder/getAttachmentBySoId/";
export const getAllSaleOrders = "saleOrder/getBySoId/";
export const getALLOL = "offerLetter/cqae/";
export const getAllLIbyOLId = "offerLetter/getLineItemsByOl/";
export const getSslipLineItemsByid = "subSlip/getLineItemsByid/"
export const getAllInspectors = "employee/getAllInspectors";
export const saveAllot = "soinsp/allotInsp";
export const saveAllotOL = "olinsp/allotInsp";
export const getPDById = "project/getProjectBySoId/";

export const getLIEditById = "soLineItem/getBySoLineItemId/";
export const getRegById = "lineItemLots/register/soLiId/";
export const getLIById = "soLineItem/getBySoId/";
export const getOlById = "offerLetter/getOLBySaleOrderId/";
export const getOlBySoId = "offerLetter/getOLBySupplyOrderId/";
export const getNotifiedOLs = "offerLetter/getNotifiedOLsBySOId/";
export const getAllSaleOrder = "saleOrder/getAll";
export const getFclSoUrl = "/fcl/so/";
export const getPDbyId = "/supplyOrder/getAllSupplyOrdersBySalesGrpId/";

export const getLvlOfInspUrl = "inspLevel/getAll";

//warrant
export const getwarrantBysoliId = "warrant/getBySoLineId/";
export const warrant = "warrant/getAll"
export const warrantDetails = "warrant/getAllWarrants"
export const getAllotedWarrants  = "warrant/getAllotedWarrants"
export const warranybyhosa="warrant/getWarrantsByHos"
export const getRegWarrants = "warrant/getRegsByWarrantIds?warrantIds="
export const getWarranNotify = "allot/warrant/allotSubordinate"
export const getWarrantByWarrantId = "warrant/getWarrantById/"


//export const get

export const getLiBySale = "soLineItem/getBySaleOrderId/";
export const getOlBySale = "offerLetter/getOLBySaleOrderId/";

export const saveSOAttachments = "supplyOrder/updateSoAttachments";
export const saveLIDetails = "soLineItem/updateTmrSheet";
export const uploadTmrPdf = "olLineItem/updateTmrSheet";
export const saveOlAttachments = "offerLetter/updateOlAttachments";

//project
export const getAllProjectForGraph = "project/getAllForChart";

//dropdown
export const getLastFiveYr = "dashboard/getLastFiveFY";

//notifications
export const getAllUnreadNotifications = "notification/unreadNotifications/";
export const getAllUnreadNotificationsSender = "notification/sentUnreadNotifications/";
export const notifyByCategory = "notification/notifByCategory/";
export const notifyBySenderCategory = "notification/senderNotificationsByCategory/";
export const updateReadStatusURL = "notification/update";
export const jcqaoNotifyBySo = "soinsp/allot/jcqao";
export const notifyBySo = "supplyOrder/notifyCqaeAndJcqao";
export const notifyByOL = "offerLetter/notifyCqaeAndJcqao/";
export const readBy = "notification/notificationRead/";


//ChecklistInspEleMain
export const getInspEleMain = "/inspEleMain/ol/";
export const saveInspEleUrl = "inspEleMain/saveInspElecMain";
export const submitInspEleUrl = "inspEleMain/submitInspElecMain";

export const getbyOlId = "inspCables/ol/";
//enclosure7(ISIB)
export const getIsIb = "inspPhyIb/ol/";
export const saveISIBUrl = "inspPhyIb/saveInspPhyIb";
export const submitISIBUrl = "inspPhyIb/submitInspPhyIb";
//Enclosure1
export const fetchScrutiny = "scrutinySo/so/1";

//Enclosure 4 Return OL
export const getByIdROL = "returnOfferLetter/getByOlId/";
export const getReturnOlByEmpid = "returnOfferLetter/getByEmp/";
//enclosure7(PCB)
export const getPcb = "/inspPcb/ol/";
export const savePcb = "inspPcb/saveInspPcb";
//enclosure7(SCM)
export const getSCM = "/inspPhySubItems/ol/";
export const saveScm = "inspPcb/saveInspPcb";
export const submitPcb = "inspPcb/submitInspPcb";
//fcm
export const getSavedDetailsFCMUrl = "fcm/so/";
export const savedDetailsFCMUrl = "fcm/saveFcm";
export const submitDetailsFCMUrl = "fcm/submitFcm";
//InspectOL
export const getInspectOLUrl = "offerLetter/getAllotedOfferLetters/";
//InspectorSO
export const getInspectSOUrl = "soinsp/";
export const returnOfferLetter = "returnOfferLetter/getByInsp/";
export const getReturnOLBySalesGrpId = "/returnOfferLetter/getBySalesGrpId/";
export const getAllParentOfEmpByRoleIdUrl =
  "/employee/getAllParentOfEmpByRoleId/";
export const getAllParentOfEmp = "/employee/getParentTillJcByEmpAndRole/";
export const saveSupplyOrder = "supplyOrder/updateSupplyOrder";

//I-Note/ Form-IV
export const fetchInoteId = "iNoteType/getAll";
export const fetchINoteDetailsByOlId = "/inote/getINoteByOlId/";
export const fetchForm4DetailsByOlId = "/inote/getForm4DetailsOfOfferLetter/";
export const saveINoteUrl = "/inote/saveINote";
export const updateINoteUrl = "/inote/updateINote";
export const signatoryListUrl = "/employee/getEmpForInote/";
export const activeSignatoryList = "/employee/getActiveEmpForInote/";
//Indenter ID
export const saveIndenter = "indenter/save";
export const fetchIndentId = "indenter/getAll";
export const updateIndenter = "indenter/update";

//fetch supplier ID
export const fetchSupplierId = "supplier/getAll";
//fetch consignee ID
export const saveConsignee = "consignee/save";
export const updateConsignee = "consignee/update";
export const fetchconsigneeId = "consignee/getAll";
export const fetchSalesGroupId = "salesGroup/getAll";
export const fetchSalesGrpForChart = "salesGroup/getAllForChart";
export const fetchProjectDetailsId = "project/getAllByOrgId/";

//uom
export const saveUom = "uom/save";
export const updateUom = "uom/update";
export const getAllUom = "uom/getAll";

//item category
export const saveItemCategory = "itemCategory/save";
export const updateItemCategory = "itemCategory/update";
export const getAllItemCategory = "itemCategory/getAll";


// INSPECTION FILE - NOTE
export const getInspectionFile = "insp/filenote/getByOfferLetterId/";
export const saveInspectionFile = "insp/filenote/saveInspctionFileNote";
export const saveInspectionFileV2 = "insp/filenote/saveInspctionFileNoteV2";
export const updateInspctionFileNoteV2 =
  "insp/filenote/updateInspctionFileNoteV2";
export const getInspectOLApprovalUrl = "offerLetter/getApprovedOfferLetters/";
export const getInspectOLApprovalUrlV2 = "insp/filenote/getAllFileNotes/";

// enclosure 1
export const fetchScrutinySo = "scrutinySo/so/";
export const saveScrutinySoUrl = "scrutinySo/save";
export const submitScrutinySoUrl = "scrutinySo/submit";
// enclosure 11
export const fetchfileNote = "insp/filenote/so/1";

// enclosure 15
export const saveSupplierRatingUrl = "vendorRating/saveVendorRating";

// //SO WORKLOAD ASSESMENT
// export const soworkload = "workloadso/save";

export const poObservation = "poObservation/so/";
export const getPoObservationById = "poObservation/";
export const getPoObsIds = "poObservation/getByIds?";
export const poObservationOpa = "poObservation/opa/";
export const poObservationSalesGroup = "poObservation/salesGrp/";
export const poObservationEmpId = "poObservation/getByEmpnSub/";
export const savePoSbuUrl = "/poObservation/saveRemActPoObservation";
export const savePoSbuRemarksUrl = "poObservation/saveRemarkPoObservation";

export const saveInspPdiSparesIb = "inspPdiSparesIb/saveInspPdiSparesIb";
export const getInspPdiSparesIb = "inspPdiSparesIb/ol/";
export const submitInspPdiSparesIb = "/inspPdiSparesIb/submitInspPdiSparesIb";

//SOWorkLoadAssesment
export const getAllInspPhaseActivitiesUrl =
  "/inspPhase/getAllPreInspPhaseActivities";
export const getWorkloadUrl = "workload/so/";
export const getsoworkloadUrl = "workloadso/so/";
export const submitPoSbuUrl = "/poObservation/submitRemActPoObservation";
export const submitRemarkPoSbuUrl = "poObservation/submitRemarkPoObservation";

//BarGraph
export const getsupplyorderstatus = "dash/so";
export const getPoDetailsGraph = "dashboard/getPoDetailsForChart";
export const getAllotedSoForSubordinatesUrl = "/allot/so/getByEmpId/";
export const getAllotOlForSubordinateUrl = "/allot/ol/getByEmpId/";
export const getAllotToOlForSubordinateUrl = "/allot/ol/getToEmpId/";

//OL graph
export const getOlDetailsGraph = "dashboard/getOLChartData";

//Workload graph
export const getWorkloadDetailsGraph = "workload/getByDates/";

//AllotAcqao
export const getjcUrl = "soinsp/";
export const getSubordinatesByEmpIdUrl = "employee/getSubByEmp/";
export const getAllSubOfEmpByRoleIdUrl = "/employee/getAllSubOfEmpByRoleId/";
export const getAllEmpsbyOrgId = "/employee/getAllEmpsByOrgId/";
export const getAllEmpsOfOrgn = "/employee/getAllEmpsOfOrgn/";
export const getAllEmpsOfOrg = "/employee/getAllEmpsOfOrg/";
export const getAllActiveEmpsOfOrgn = "/employee/getAllActiveEmpsOfOrgn/";
export const getAllActiveEmpsOfOrg = "/employee/getAllActiveEmpsOfOrg/";
export const getAllActiveEmpsbyOrgId = "/employee/getAllActiveEmpsByOrgId/";
//AllotDcqao
export const getdcUrl = "soinsp/";
export const getSubordinatesBydcqaoIdUrl = "allot/dcqao/";
export const saveSubordinatesBydcqaoIdUrl = "/allot/so/allotSubordinate";
export const saveOlSubordinatesBydcqaoIdUrl = "/allot/ol/allotSubordinate";

//AllotAcqao

export const saveAllotjc = "soinsp/allot/dcqao";

//AllotDcqao
export const saveAllotdc = "/soinsp/allot/secOfficer";

//AllotAcqao
export const saveAllotac = "/soinsp/allotInsp";

//Allot
export const AllotSubordinate = "soinsp/allot/subordinate";

//Ammenments
export const getALBySO = "amendmentsLetter";
export const saveAL = "amendmentsLetter/save";

//AllotjcqaoOl
export const getjcolUrl = "olinsp/";
export const getSubordinatesByEmpUrl = "employee/getSubByEmp/";
export const getSubDcqaoBySubRoleUrl = "employee/getSubDcqaoBySubRole/";
//AllotjcqaoolSave
export const saveAllotjcol = "/olinsp/allot/dcqao";
//AllotDcqaoSave
export const saveAllotdcol = "/olinsp/allot/secOfficer";
//AllotSaveACQAO save
export const saveAllotacol = "/olinsp/allotInsp";

//Inspect ol
export const getAllByOL = "/olLineItem/getByOlId/";
export const getLIdetailsByOLIDs = "/olLineItem/getByOlIdList/";
export const getConsigneeBySO = "supplyOrder/getConsigneesBySoId/";
//Save Fcl
export const saveContactUrl = "/fcl/saveFcl";
//Submit Fcl
export const submitContactUrl = "/fcl/submitFcl";

//save ScrutinyOl
export const saveScrutinyOlUrl = "inspOlIb/saveInspOlIb";
//submit ScrutinyOl
export const submitScrutinyOl = "/inspOlIb/submitInspOlIb";

//submit Ol line item cleared
export const updateOLLineitemClr = "/olLineItem/updateLineItemsQty";

export const getPoObservation = "poObservation/getByEmpnSub/";
//fetch OL line item to enter cleared Qty
export const fetchOlLineItemClr = "/olLineItem/getByOlId/";
//fetch ScrutinyOl
export const fetchScrutinyOl = "inspOlIb/ol/";
//view Scrutiny
export const ViewSoScrutiny = "/supplyOrder/getSoById/";
//view SOPO Details and OL Details
export const getOfferLetterById = "offerLetter/";
//SO WORKLOAD ASSESMENT(INSPECTOR)
export const inspsoworkloadSave = "workloadso/act/save";
export const inspsoworkloadSubmit = "workloadso/act/submit";

//SO WORKLOAD ASSESMENT(JC,DC,AC)
export const soworkloadSave = "workloadso/plan/save";
export const soworkloadSubmit = "workloadso/plan/submit";

//get OL apploroval
export const getolApprovalById = "olApproval/";
//Update  updateOlApproval
export const updateOlApproval = "olApproval/updateOlApproval/";
//get FCM
export const getFcmById = "/fcm/so/";
//CheckScrutiny View
export const getCheckScrutiny = "checklistScrutiny/getAll";
//inspPdi
export const getpdiMain = "inspPdiMain/ol/";
//submit insppdi main
export const submitPdiMain = "inspPdiMain/submitInspPdiMain";
//Save insppdi main
export const savePdiMain = "inspPdiMain/saveInspPdiMain";
//submit inspcablemain
export const submitinspcable = "inspCables/submitInspCables";
//save inspcablemain
export const saveinspcable = "inspCables/saveInspCables";
//save scm
export const submitphysicalScm = "inspPhySubItems/submitInspPhySubItems";
//submit scm
export const savepysicalScm = "inspPhySubItems/saveInspPhySubItems";
//OlDetailsForINote
export const getOlApprDetailsForINote = "offerLetter/getOlApprovalDetails/";
//getAllINotes
export const getAllINotes = "inote/getAllINotes/";
export const getAllINotesForFirmUrl = "inote/getAllExternalINotesForFirm/";
export const getAllottedExternalINotesForFirm = "inote/getAllottedExternalINotesForFirm/";
export const getInotesBySalesGrpId = "inote/getAllINotesBySalesGrpId/";

//External Inote Generation 
export const getExternalInote = "inote/getAllINotesV2/";

// //Return oL
// export const getreturnOfferLetter = "returnOfferLetter/getByOlId/1";
//Checklist FileClose
export const getCheckFileCloseForm = "checklistfileclose/getAll";
//QIN
export const saveQinObsNcFormUrl = "qinObsNcForm/save";
export const getQinObsNcFormUrl = "/qinObsNcForm/offerLetter/";
export const updateQinObsNcFormUrl = "/qinObsNcForm/update";

//ol
export const updateOl = "/offerLetter/update";
export const updateOlDescription = "/insp/filenote/updateFileNoteOlDesc";
export const olDetails = "/offerLetter/getOlDetailsForPrint/";
export const getOLs = "/offerLetter/getOfferLetters/";

//OLWorkLoadAssesment
export const getolworkloadUrl = "workloadol/ol/";

//SO WORKLOAD ASSESMENT(INSPECTOR)
export const inspOlWorkloadSaveUrl = "workloadol/act/save";
export const inspOlWorkloadSubmitUrl = "workloadol/act/submit";

//SO WORKLOAD ASSESMENT(JC,DC,AC)
export const olWorkloadSaveUrl = "workloadol/plan/save";
export const olWorkloadSubmitUrl = "workloadol/plan/submit";
//ViewScrutinyOl
export const getOlScrutiny = "checklistOl/ib/getAll";
//return OL
export const getreturnOfferLetter = "returnOfferLetter/getByOlId/";

//INote Graph
// export const getByYearWiseData ="/supplyOrder/getSupplyOrdersYearWise"
export const getInoteGraphProjectWiseUrl =
  "/dashboard/inote/getINoteDetailsProjectWise";
export const getInoteGraphYearWiseUrl =
  "/dashboard/inote/getINoteDetailsYearWise";
export const getSoReport = "/report/getReport/";
export const getINoteGraphDataUrl = "inote/getINoteValueBySalesGrpId";
export const getINoteGraphForCqao = "inote/getINoteValueByFY";

//update project
export const updateProjectStatus = "project/updateProject";
export const deleteSaleOrder = "project/deleteSaleOrder/";
//update ol status
export const updateOlStatus = "offerLetter/updateOl";
//update ol  remarks
export const updateOlHologramDetails = "olLineItem/updateHologramDetails";

//get OL Attachments
export const getOlAttachments = "offerLetter/getAttachmentByOlId/";
export const getAttachmentByOlIds = "offerLetter/getAttachmentByOlIds";
//concession
export const getConcessionByOlId = "olConcession/getByOlId?";
export const saveConcession = "olConcession/save";
//clearance certificate
export const saveClearanceCertificate = "/clearanceLetter/save";
export const getClearanceCertificate = "/clearanceLetter/getByOlId/";

//Register Module
export const getPORegisterByDate = "/registers/so/";
export const getOLRegisterByDate = "/registers/ol/";
export const getListOfFileNos = "supplyOrder/getAllFileNos/";
export const getCrossCheckList = "registers/surpriseCheck/";
export const getSoDetailsByFileNo = "supplyOrder/getSODeatils/";
export const saveCrossCheckForm = "/surpriseCheck/save";
export const getInoteRegister = "/registers/inoteRegister";

//CQAE User Module
export const getAllUsersByOrgTypeId = "empRole/getEmpRoleByOrgTypeId/";
export const getparentBySeniority = "employee/getParentEmpById/";
export const getActiveparentBySeniority = "employee/getActiveParentEmpById/";
export const getAllUsers = "user/getAllUsers/";
export const saveNewUser = "user/createUser";
export const updateUserURL = "user/editUser";
export const updateUserData = "user/update";

//get Tests
export const getAllTests = "/applicableTest/getAll";
export const getAllActiveTests = "/applicableTest/getAllActiveTest";
export const getTestsById = "/olLineItem/getApplicableTestsByLineItemId/";
export const saveLITests = "olLineItem/updateApplicableTests";

//get offer letters by status
export const getOLbyStatus = "offerLetter/getOfferLettersByStatus/";
export const getOLCount = "offerLetter/getOLCount/";
export const getOLCountBySalesGrpIdUrl = "offerLetter/getOLCountBySalesGrpId/";
export const getOLsBySalesGrpIdUrl = "offerLetter/getOfferLettersBySalesGrpId";

export const getUsers = "user/fetchAllUsers";

export const getDGQAHierarchy = "organization/getDGQAHierarchy";

//DGQA Graph
export const getPOdetails = "dgqadashboard/getPoDetailsForChart";
export const getOLdetails = "dgqadashboard/getOLChartData";
export const getINoteDetails = "dgqadashboard/getINoteDetailsYearWise";
export const getINoteValue = "dgqadashboard/getINoteValueByFY";

//merge OLS
export const getOLSUrl = "offerLetter/getOLs/";
export const getFileNote = "/insp/filenote/getByOLIds";
export const getFileNoteById = "/insp/filenote/getFileNoteById/";

//get file note approval
export const getFileNoteApproval = "olApproval/ByFileNoteId/";
export const getInoteByfileNoteId = "inote/getINoteByFileNoteId/";
export const getINoteDetailsByOlIdsUrl = "inote/getINoteByOLIds?";

//fag-end-notice
export const fagEndNoticeSaveFagEndNotice = "fagEndNotice/saveFagEndNotice";
export const fagEndNoticeGetFagEndNotice = "fagEndNotice/getFagEndNotice/";
export const fagEndNoticeSubmit = "fagEndNotice/submit";

//get GCC Pos
export const fetchGcsPos = "gcs/fetchGcsPos/";
export const fetchGcsLineItems = "gcs/fetchSoLineItemsById/";

//applicable test
export const saveApplicableTest = "applicableTest/save";
export const updateApplicableTest = "applicableTest/update";
export const getAllApplicableTest = "applicableTest/getAll";
export const getAllApplicableTestBySalesGrpId =
  "applicableTest/getAllApplicableTestBySalesGrpId/";
export const getAllActiveAppTestBySalesGrpId =
  "applicableTest/getAllActiveAppTestBySalesGrpId/";

//getINoteNos
export const getInoteNos = "insp/filenote/getINoteNos/";
export const updateInoteNo = "/insp/filenote/updateINoteNo";

//scrutiny gi
export const checklistScrutinyGiForm = "checklistScrutinyGiForm/";
export const checklistScrutinyGiFormGetAll = "checklistScrutinyGiForm/getAll";
export const checklistScrutinyGiFormUpdate = "checklistScrutinyGiForm/update";
export const scrutinyGiFormGetGiForm = "scrutinyGiForm/getGiForm/";
export const scrutinyGiFormSave = "scrutinyGiForm/save";
export const scrutinyGiFormSubmit = "scrutinyGiForm/submit";
//Scrutiny Tender
//scrutiny tender contract
export const checklistScrutinyTenderGetAll = "checklistScrutinyTender/getAll";
export const checklistScrutinyTenderUpdate = "checklistScrutinyTender/update";
export const scrutinyTenderSave = "scrutinyTender/save";
export const scrutinyTenderSubmit = "scrutinyTender/submit";
export const scrutinyTenderTender = "scrutinyTender/tender/";
//scrutinyClosureSupplyOrder
export const scrutinyClosureSupplyOrderSave = "scrutinyClosureSupplyOrder/save";
export const scrutinyClosureSupplyOrderSubmit =
  "scrutinyClosureSupplyOrder/submit";
export const scrutinyClosureSupplyOrderGetSupplyOrder =
  "scrutinyClosureSupplyOrder/getSupplyOrder/";
export const checklistScrutinyClosureSupplyOrderGetAll =
  "checklistScrutinyClosureSupplyOrder/getAll";
export const scrutinyQaclSave = "scrutinyQacl/save";

//checklistScrutinyQaclGetAll
export const scrutinyQaclOL = "scrutinyQacl/ol/";

export const scrutinyQaclsubmit = "scrutinyQacl/submit";
export const checklistScrutinyQaclGetAll = "checklistScrutinyQacl/getAll";
export const checklistScrutinyQaclUpdate = "checklistScrutinyQacl/update";

//Scrutiny 3-TIER REPORT
export const scrutinyThreeTierGetThreeTier = "scrutinyThreeTier/getThreeTier/";
export const scrutinyThreeTierSave = "scrutinyThreeTier/save";
export const scrutinyThreeTierSubmit = "scrutinyThreeTier/submit";
export const checklistScrutinyThreeTierGetAll =
  "checklistScrutinyThreeTier/getAll";
export const checklistScrutinyThreeTierUpdate =
  "checklistScrutinyThreeTier/update";

//PreInspection
export const getPreInspection = "scrutinyPreInspection/getPreInspection/";
export const scrutinyPreInspectionsave = "scrutinyPreInspection/save";
export const scrutinyPreInspectionsubmit = "scrutinyPreInspection/submit";
//test by lineItemId
export const getAllTestsBylineItemId = "applicableTest/getAllTests/";
//Firm
export const getAllFirm = "orgCqae/getOrgIbIgById";
export const getAllWings = "organization/getAllWings";
export const getAllInspectionAgency = "user/getOrgCqaeById";
export const getAllInspectionAgencyOfFirm =
  "organization/getAssociatedInspectionAgencies/";
export const getAllInspectionAgencyAndFirmDetails =
  "organization/getOrgAndAssociatedInspectionAgencies/"
export const saveFirmAgency = "orgCqae/save";
export const updateFirmAgency = "orgCqae/update";
export const getAllFirmAgency = "salesGroup/getAll";
export const saveAteReport = "olLineItem/uploadATEReport";
export const getRunAte = "executeExe/pressureTest";

export const sigGenFrequency = "sigGen/frequency";

//Test Values
export const getTestValues = "quality/getAll";

// sbu camera mapping
export const saveSBUCameraMap = "sbuCameraMapping/save";
export const editSbuCameraMapping = "sbuCameraMapping/update";

export const fetchExpiringCountByOrgId = "supplyOrder/countExpiring/org";
export const getExpiryList = "supplyOrder/expiring";
export const getExpiryListCount = "supplyOrder/expiring-orders/count";
export const fetchExpiringOrdersByOrgId = "supplyOrder/expiring/org";
export const soApprovalFeedBackUpdateSo = "soApproval/feedBackUpdateSo";

//Approved So
export const getApprovedSoBySalesGrpIdUrl =
  "supplyOrder/getApprovedSoBySalesGrp/";

export const lineItemObservationSave = "lineItemObservation/save"
export const getAllSubmittedSOsById = "lineItemObservation/getAllSubmittedSOsByempId/"
export const getInstageByLineItemIds = "lineItemObservation/getInstageByLineItemIds/"
export const getLineItemObservationId = "lineItemObservation/getByLineItemObservationId/"
export const getAdminsBySalesgrpId = "/employee/getAdminsBySalesgrpId/";

export const checklistScrutinyQaclSparesGetAll = "checklistScrutinyQaclSpares/getAll";
export const checklistScrutinyQaclSparesUpdate = "checklistScrutinyQaclSpares/update";
export const checklistScrutinyPreInspectionGetAll = "checklistScrutinyPreInspection/getAll";
export const checklistScrutinyPreInspectionUpdate = "checklistScrutinyPreInspection/update";
export const lineItemlotsSave = "lineItemlots/save";
export const lineItemlotsUpdate = "lineItemlots/update";
export const financialYears = "lineItemlots/financialYears";
export const lineItemlotsFindBySoLiId = "lineItemlots/findBySoLiId/";
export const lineItemlotsDelete = "lineItemlots/delete/";


export const getUsersListByOrgTypeId = "user/getUsers/"
// export const getAllINotesListByInspOrgId = "internalInote/getAllInotesListByInspOrgId";
//Create T
export const getWarrantDataForTCreation = "warrant/getWarrantDataForTCreation/"

//Notify qc users
export const getAllNotifyToEmpByDeptId = "employee/getAllNotifyToEmpByDeptId/"


//Submission Slip
export const SaveSubmissionSlip = "subSlip/save"
export const UpdateSubmissionSlip = "subSlip/update"
export const getAllSubSlipListByInspOrgId = "subSlip/getAllSubSlipListByInspOrgId";
export const getAllPassedSubSlipListByInspOrgId = "subSlip/getAllPassedSubSlipListByInspOrgId";
export const getSubSlipDetails = "warrant/getSubSlipDataForTUpdation/"
export const notifyAllotSubSlip = "allot/subSlip/"

//New Video Inspection Notification URLs - ATE service
export const saveCameraRequest = "video/notifications/save"
export const getAllCameraRequests = "video/notifications/getAll"
export const updateCameraRequest = "video/notifications/updateStatus"
export const getCameraRequestByEmpId = "video/notifications/getAll?empId="