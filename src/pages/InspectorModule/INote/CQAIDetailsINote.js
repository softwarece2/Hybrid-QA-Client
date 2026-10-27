/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState ,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
//globals

import TableComponent from "components/table/index";
import { Grid} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import CustomizedInputs from "components/TextField";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import ActionButton from 'components/ActionButton';
import Qcc from "pages/cetificate/qcc.js";
import Qac from "pages/certificate/qac.js";
import INoteInternalNew from "pages/SOModule/OL/InoteInternal/inoteInternalNew";
import Product105 from "pages/Testt/products/Product105";
import Qacq from "pages/cetificate/qacq";
import ViewLotDetails from "../Lots/ViewLotDetails";
import QcReport from "pages/Testt/products/QcReport";
import LotDetailsInstrument from "pages/Testt/products/LotDetailsInstrument";
import CreateOl from "pages/OL/CreateOl/CreateOl";
import InspectionCertificate from "pages/Enclosures/Enclosure12/InspectionCertificate";
import WarrantCertificateTable from "pages/SOModule/LineItemsDetails/WarrantCertificateTable";
import { WarrentCertificate } from "pages/SOModule/LineItemsDetails/WarrentCertificate";
import InstrumentQAReport from "pages/Testt/products/InstrumentQAReport";
const columns = [
    {
      title: 'Grp',
      field: 'grp',
      width: 'auto',
      filtering: true,
    },
    {
      title: ' I-Note No.',
      field: 'inoteNo',
      width: 'auto',
      filtering: true,
      // accessorFn: (row) => row.inoteNo, 
      // Cell: (props) => props.row.original.btn_inoteNo,
    },
    {
      title: 'INote Dt.',
      field: 'inoteDate',
      width: 'auto',
      filtering: true,
    },
    {
      title: 'L/OL-No.',
      field: 'mergeSslipNo',
      width: 'auto',
      filtering: true,
    },
    // {
    //   title: 'Internal INote Dt.',
    //   field: 'internalInoteDate',
    //   width: 'auto',
    //   filtering: true,
    // },
    {
      title: 'L/OL-No. Dt.',
      field: 'offerLetterDate',
      width: 'auto',
      filtering: true,
    },
    {
      title: "OL-No",
      field: "offerLetterNo",
      width: 'auto',
      filtering: true,
    },
  
    {
      title: ' OL-Dt.',
      field: 'offerLetterDate',
      width: 'auto',
      filtering: true,
    },
    {
      title: 'W.O.No.',
      field: 'workOrderNo',
      width: 'auto',
      filtering: true,
    },
    {
      title: 'WT No.',
      field: 'warrantyNo',
      width: 'auto',
      filtering: true,
    },
    {
      title: 'Sub Qty',
      field: 'subQty',
      width: 'auto',
      sorting: true,
    },
    {
      title: 'Accept.Qty',
      field: 'acceptedQty',
      width: 'auto',
      sorting: true,
    },
    // {
    //   title: 'Rfr Qty',
    //   field: 'rfrQty',
    //   width: 'auto',
    //   sorting: true,
    // },
    {
      title: 'Rej Qty',
      field: 'rejectedQty',
      width: 'auto',
      sorting: true,
    },
    {
      title: 'Insp. By',
      field: 'organization',
      width: 'auto',
      sorting: true,
    },
{
      title: 'QA Report',
      field: 'qcReport',
      width: 'auto',
      filtering:false
    },{
      title: 'QA Report',
      field: 'qccReport',
      width: 'auto',
      filtering:false
    },
     {
      title: 'QCC',
       field: 'qcc',
      width: 'auto',
      filtering:false
    },
      {
      title: 'QAC',
      field: 'cqai',
      width: 'auto',
      filtering:false
    },
    {
      title: 'Warranty Certificate',
      field: 'Warranty',
      width: 'auto',
      filtering:false
    },
    
    //  {
    //   title: 'QAC(CQAI)',
    //  field:'qac',
    //   width: 'auto',
    //   sorting: true,
    // },
    //   {
    //   title: 'Top Sheet',
    //   // field: 'organization',
    //   width: 'auto',
    // },
  ];

export default function CQAIDetailsINote() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [records, setRecords] = useState([]);
  const [details,setDetails]=useState([]);
  const [loading, setLoading] = useState(false);
  const  [prodrecords,setProdrecords]=useState([]);
  const [rowData, setRowData] = useState({});
  const { control,watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      ProductId: sessionStorage.getItem("selectedEpCode") || "",
    },
  });
  const salesGrpId = useSelector((store) => store.loggedInUser?.salesGrpId);
  const componentRef = useRef();
  const watchSelectedProduct = watch("ProductId");
const instrList=true;
  // async function getProducts(){
  //   try {
  //     const { data } = await axiosInstanceAte("spec/getAllProduct");
  //     setProducts(data);

  //   }catch(error){
  //     console.log(error);
  //   }
  // }
  // useEffect(() => {
  //   getProducts();
   
  // }, []);
 
  
  async function getProducts(){
    try {
      const { data } = await axiosInstanceAte("spec/getAllProductWithEpCode");
      setProducts(data);
    }catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    getProducts();
   
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("selectedEpCode");
    if (saved) {
      setValue("ProductId", saved);
    }
  }, [setValue]);

  const [openDialog,setOpenDialog]=useState(false)
  async function getRecords() {
    try {
      const { data } = await axiosInstanceTrans("inote/getInotesByProdId");
  
      const updatedData = data.map(item => ({
        ...item,
        qcc: (
          <ActionButton
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => { 
              console.log("data", data);
              if (salesGrpId) {
                dispatch(selectItem(<Qcc olId={item.olid} instrList={instrList}/>));
              } else {
                dispatch(
                  selectItem(<Qcc row={item} olIds={item?.olid} instrList={instrList}/>)
                );
              }
            }}
          >
            QCC
          </ActionButton>
  ),
      cqai: (
    <ActionButton
      variant="outlined"
      size="small"
      color="secondary"
      onClick={() => { 
        dispatch(
          selectItem(<Qac row={item} olIds={item?.olid}  source="InstrumentList" instrList={instrList} />)
        );
      }}
    >
    
      QAC(OLF)
    </ActionButton>
),


mergeSslipNo: (
    <ActionButton
      variant="outlined"
      size="small"
      color="secondary"
      onClick={() => { 
        dispatch(
         selectItem(<LotDetailsInstrument row={item} olIds={item?.olid}  source="InstrumentList" setOpenDialog={true} openDialog={openDialog} instrList={instrList}/>)
        );
      }}
    >
    
      QAC(OLF)
    </ActionButton>
),
qac: (
    <ActionButton
      variant="outlined"
      size="small"
      color="secondary"
      onClick={() => { 
        dispatch(
          selectItem(<Qac row={item} olIds={item?.olid} source="InstrumentList"/>)
        );
      }}
    >
    
      QAC
    </ActionButton>
),





qccReport: (
    <ActionButton
      variant="outlined"
      size="small"
      color="secondary"
      onClick={() => { 
    
        dispatch(
          selectItem(<QcReport row={item} olId={item?.mergeSslipId} />)
        );
      }}
    >
    
      QCReport
    </ActionButton>
),
qcReport: (
    <ActionButton
      variant="outlined"
      size="small"
      color="secondary"
      onClick={() => { 
    
        dispatch(
          selectItem(<QcReport row={item} olId={item?.mergeSslipId}returnTo="instrumentlist" />)
        );
      }}
    >
    
      QCReport
    </ActionButton>
),

 inoteNo: (
<ActionButton
      variant="outlined"
      size="small"
      color="secondary"
// style={{backgroundColor:"lightcyan",color:"red"}}
      onClick={() => { 
        dispatch(
          selectItem(<INoteInternalNew row={item} olId={item?.olid} />)
        );
      }}
    >
   {item.inoteNo} 
   </ActionButton>
),
Warranty: (
  <ActionButton
    variant="outlined"
    size="small"
    color="secondary"
    onClick={() => { 
  
      dispatch(
        selectItem(<WarrentCertificate row={item} olId={item?.inoteId} />)
      );
    }}
  >
  
  WarrantyCertificate
  </ActionButton>
),
      }));
  
      setRecords(updatedData);
  
    } catch (error) {
      console.log(error);
    }
  }
      

  useEffect(() => {
    getRecords();
   
  }, []);


  const fetchEpCodeData = async (products)=> {
    setLoading(true);
    try {
      const {data} = await axiosInstanceTrans.get(`inote/getInotesByProdId/${products}`);
      const updatedData = data.map(item => ({
        ...item,
        qcc: (
          <ActionButton
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => { 
          
              if (salesGrpId) {
                dispatch(selectItem(<Qcc olId={item.olid} row={item} instrList={instrList}/>));
              } else {
                dispatch(
                  selectItem(<Qcc row={item} olIds={item?.olid}  instrList={instrList}/>)
                );
              }
            }}
          >
          Qcc
          </ActionButton>
  ) ,

cqai:(
 <ActionButton
            variant="outlined"
            size="small"
            color="secondary"
           onClick={() => { 
    dispatch(
          selectItem(<Qac row={item} olIds={item?.olid} source="InstrumentList" instrList={instrList} />)
        );
      }}
          >
          QAC
          </ActionButton>
),

mergeSslipNo: (
    <ActionButton
      variant="outlined"
      size="small"
      color="secondary"
      onClick={() => { 
        dispatch(
          selectItem(<LotDetailsInstrument row={item} mergeSslipId={item?.mergeSslipId}  source="InstrumentList" setOpenDialog={true} openDialog={openDialog} instrList={instrList} />)
        );
      }}
    >
    
      {item.mergeSslipNo}  
    </ActionButton>
),


// qac: (
//     <ActionButton
//       variant="outlined"
//       size="small"
//       color="secondary"
//       onClick={() => { 
//     dispatch(
//           selectItem(<Qac row={item} olIds={item?.olid} />)
//         );
//       }}
//     >
//     Qac
//     </ActionButton>
// ),
qccReport: (
    <ActionButton
      variant="outlined"
      size="small"
      color="secondary"
      onClick={() => { 
    
        dispatch(
          selectItem(<InstrumentQAReport row={item} olId={item.olid}  />)
        );
      }}
    >
    
      QAReport
    </ActionButton>
),
qcReport: (
    <ActionButton
      variant="outlined"
      size="small"
      color="secondary"
      onClick={() => { 
    
        dispatch(
          selectItem(<QcReport row={item} olId={item?.mergeSslipId}  returnTo="instrList"/>)
        );
      }}
    >
    
      QCReport
    </ActionButton>
),
Warranty: (
  <ActionButton
    variant="outlined"
    size="small"
    color="secondary"
    onClick={() => { 
  
      dispatch(
        selectItem(<WarrentCertificate row={item} olId={item?.inoteId} />)
      );
    }}
  >
  
WarrantyCertificate
  </ActionButton>
),
inoteNo: (
      <ActionButton 
        variant="outlined"
        size="small"
        color="secondary"
        onClick={() => { 
          dispatch(
            selectItem(
              <InspectionCertificate
                fnId={item.id}
                olId={item.offerLetterId}
                ol={item}
                returnTo="table" 
                instrList={instrList}
              />
            )
          );
        }}
      >
        {item.inoteNo}  
      </ActionButton>
    ),
//  inoteNo: (
//     <ActionButton 
//    variant="outlined"
//             size="small"
//             color="secondary"

//       onClick={() => { 
//         dispatch(
//             selectItem(
//                <InspectionCertificate
//                 fnId={item.id}
//                 olId={item.offerLetterId}
//                 ol={item}
//                 returnTo="table" 
//                 instrList={instrList}
//               />
//             )
//           );
//       }}
//     >
//    {item.inoteNo}  
//     </ActionButton>
// ),
offerLetterNo: (
    <ActionButton 
   variant="outlined"
            size="small"
            color="secondary"

      onClick={() => { 
        dispatch(
          selectItem(<CreateOl mergedDetails={item} instrList={instrList}/>)
        );
      }}
    >
   {item.offerLetterNumber}  
    </ActionButton>
),

}));
setProdrecords(updatedData);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching EpCode data:", error);
      toast.error("Error fetching EpCode data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (watchSelectedProduct) {
      fetchEpCodeData(watchSelectedProduct);
    } else {
      setProdrecords([]);
    }
  }, [watchSelectedProduct]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "INote Details",
  });
return (
  <Grid container spacing={2} >
     
      <Grid item xs={12} sm={2}>
        
            <Controller
              name="ProductId"
              control={control}
              render={({
                field: { onChange, value },
                fieldState:{ error },
              
              }) => (
               
                <CustomizedInputs
                  select
                  size="small"
                  SelectProps={{ native : true }}
                  labelText="Product-EP Code"
                  placeholder="Product-EP Code"
                  required
                  value={value}
                  onChange={(e) => {
                    onChange(e);
    
                    // ✅ SAVE selection
                    sessionStorage.setItem(
                      "selectedEpCode",
                      e.target.value
                    );
                  }}
                  error={!!error}
                  helperText={error?.message}
                >
                  <option value="">Select product-EP Code</option>
                  {products.map((item) => (
                    <option key={item.partNumberId} value={item.partNumberId}>{item.productNameEpCode}</option>
                  ))}
                  
                </CustomizedInputs>
             
              )}
              
            />
          
      </Grid>
      <Grid item xs={12}>
    
      
      <div ref={componentRef} style={{width:'100%',height:"100%",pagination: false}} > 
        {(!watchSelectedProduct) && (

          <TableComponent
           isLoading={loading}
              data={records}
              columns={columns}
              title=""
              options={{ filtering: false, search: true }}
            />
        )}
        {(watchSelectedProduct) && (

          <TableComponent
           
            isLoading={loading}
            data={prodrecords}
            columns={columns}
            title=""
            options={{ filtering: true, search: true }}
       
          />
      
        )}
      </div>
     
</Grid>
{/* <Button style={{ textTransform: "capitalize",marginTop:'40px' }} onClick={handlePrint} variant="contained" color="primary" >
          Print
        </Button> */}
    </Grid>
  );
}

