/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Modal, Box, Button, Typography, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import * as XLSX from "xlsx";
import axios from "axios";

const AddBulkProductModal = ({ open, onClose }) => {
  const [excelData, setExcelData] = useState([]);
  const requiredHeaders = [
    "productCategory",
    "categoryID",
    "productName",
    "productCode",
    "productDescription",
    "price",
    "taxSlab",
    "hsnCode",
    "stock",
  ];
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const headers = Object.keys(jsonData[0]);
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

      if (missingHeaders.length > 0) {
        alert(`Missing headers: ${missingHeaders.join(", ")}`);
        return;
      }
      setExcelData(jsonData);
      alert("File uploaded and validated successfully!");
    };
    reader.readAsArrayBuffer(file);
  };
  const handleSubmit = async () => {
    if (excelData.length === 0) {
      alert("No data to submit. Please upload a valid file.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/addProduct/bulkProducts", {
        products: excelData,
      });
      if (response.status === 201) {
        alert("Products added successfully!");
        onClose();
      } else {
        alert("An error occurred while adding products.");
      }
    } catch (error) {
      console.error("Error submitting products:", error);
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-style">
        <Typography variant="h6" gutterBottom>
          Bulk Product Form
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="a"
              href="/templates/Product_Add.xlsx"
              download="Product_Add.xlsx"
              startIcon={<CloudDownloadIcon />}
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
              }}
            >
              Download Template
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
              }}
            >
              Upload Excel
              <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center" marginTop={3}>
          <Grid item>
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddBulkProductModal;
