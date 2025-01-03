/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Typography, Button, Autocomplete } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    selectCategory: "",
    productCode: "",
    productName: "",
    productDescription: "",
    stock: "",
    taxSlab: "",
    hsnCode: "",
    price: "",
    image: "",
    dateAdded: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log(`Fetching product details for ID: ${productId}`);

        const response = await axios.get(`http://localhost:8080/addProduct/${productId}`);
        console.log("Response:", response.data);
        setFormData(response.data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/addCategory");
        setCategories(
          response.data.map((category) => ({
            id: category._id,
            label: category.categoryName,
          }))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProductDetails();
    fetchCategories();
  }, [productId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/addProduct/${productId}`, formData);
      if (response.status === 200) {
        alert("Product updated successfully!");
        navigate("/products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8} mb={3} px={3}>
        <Typography variant="h4" mb={2}>
          Edit Product
        </Typography>
        <Box
          sx={{
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.label}
                value={categories.find((cat) => cat.id === formData.selectCategory) || null}
                onChange={(event, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    selectCategory: newValue?.id || "",
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Category" variant="outlined" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Code"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tax Slab"
                name="taxSlab"
                value={formData.taxSlab}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="HSN Code"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date Added"
                name="dateAdded"
                value={formData.dateAdded}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
          </Grid>
          <Box mt={3} textAlign="right">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </MDBox>
    </DashboardLayout>
  );
};

export default EditProduct;
