import { useEffect, useState } from "react";
import { Button, FormControl, Select, TextField, Typography } from "@material-ui/core";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { formatDate } from "../IOLDehradun";
import FishboneDiagram from "./FishBoneDiagram";
import moment from "moment";

const today = new Date();
const year = today.getMonth() < 3 ? today.getFullYear() - 1 : today.getFullYear();
const oneApril = new Date(year, 3, 1);

export default function FishBone() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [toDate, setToDate] = useState(formatDate(today));
  const [fromDate, setFromDate] = useState(formatDate(oneApril));
  const [params, setParams] = useState({});

  useEffect(() => {
    axiosInstanceAte("spec/getAllProductWithEpCode")
      .then(({ data }) => setProducts(data))
      .catch(console.log);
  }, []);

  async function handleSubmit() {
    setParams({
      toDate:moment(toDate).format("DD-MM-YYYY"),
      fromDate: moment(fromDate).format("DD-MM-YYYY"),
      selectedProduct: selectedProduct || undefined,
    });
  }

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, marginLeft: 20 }}>

        <FormControl style={{ width: 300 }} variant="outlined" size="small">
          <Typography>Product-EP Code</Typography>
          <Select
            native
            labelId="product-select-label"
            id="product-select"
            // label="Product-EP Code"
            variant="outlined"
            value={selectedProduct}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                setSelectedProduct(+val);
              } else {
                setSelectedProduct("");
              }
            }}
          >
            <option value="">Select Product-EP Code</option>

            {products.map((p) => (
              <option key={p.productId} value={p.productId}>
                {p.productNameEpCode}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: 300 }} variant="outlined" size="small">
          <Typography>From Date</Typography>
          <TextField
            size="small"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            type="date"
            onChange={(e) => setFromDate(e.target.value)}
            value={fromDate}
          />
        </FormControl>

        <FormControl style={{ width: 300 }} variant="outlined" size="small">
          <Typography>To Date</Typography>
          <TextField
            size="small"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            type="date"
            onChange={(e) => setToDate(e.target.value)}
            value={toDate}
          />
        </FormControl>

        <FormControl style={{ width: 100 }} variant="outlined" size="small">
          <Button onClick={handleSubmit} variant="outlined" color="primary" style={{ marginTop: "24px" }}>
            Submit
          </Button>
        </FormControl>

      </div>
      <FishboneDiagram params={params} products={products}/>
    </>
  );
}
