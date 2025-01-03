/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import "./globalstyling/modal.css";
import AddCategoryModal from "./AddCategoryModal";

const AddProductModal = ({ open, onClose }) => {
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  //category modal stuffs
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // Selected category state
  // const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const handleOpenCategoryModal = () => setOpenCategoryModal(true);
  const handleCloseCategoryModal = () => setOpenCategoryModal(false);
  const [formData, setFormData] = useState({
    selectCategory: "",
    productCode: "",
    productName: "",
    productDescription: "",
    stock: "",
    taxSlab: "",
    hsnCode: "",
    price: "",
  });

  const textFieldRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (textFieldRef.current) {
          textFieldRef.current.focus();
        }
      }, 0); // Ensure the DOM is rendered before focusing
    }
  }, [open]);

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/addcategory", {
          headers: { "Cache-Control": "no-cache" },
        });
        // Map the response to the format required by Autocomplete
        setCategories(
          response.data.map((category) => ({
            id: category._id,
            label: category.categoryName, // Display categoryName in dropdown
          }))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.productName || !formData.price || !formData.selectCategory) {
      alert("Please fill in all required fields, including selecting a category.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/addProduct", {
        productCode: formData.productCode,
        productName: formData.productName,
        productDescription: formData.productDescription,
        categoryID: formData.selectCategory,
        stock: formData.stock,
        taxSlab: formData.taxSlab,
        hsnCode: formData.hsnCode,
        price: formData.price,
      });

      if (response.status === 201) {
        alert("Product added successfully!");
        onClose();
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response?.data?.message || "An error occurred while submitting the form.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //previous was working fine v1
  const handleCategoryChange = (event, value) => {
    console.log("Selected category:", value); // Log the selected category
    setSelectedCategory(value);
    setFormData((prev) => ({
      ...prev,
      selectCategory: value?.id || null,
    }));
  };

  const handleBackdropClick = (event) => {
    // event.stopPropagation();
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    // border: "2px solid #f44336",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  return (
    <Modal open={open} onClose={handleBackdropClick}>
      <Box sx={modalStyle} onClick={handleBackdropClick}>
        <Typography variant="h6" gutterBottom>
          Product Form
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.label}
              value={selectedCategory}
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={textFieldRef}
                  label="Select Product Category"
                  fullWidth
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
              }}
              onClick={handleOpenCategoryModal}
            >
              Add Category
            </Button>
            <AddCategoryModal open={openCategoryModal} onClose={handleCloseCategoryModal} />
          </Grid>
        </Grid>

        <TextField
          label="Product Code"
          name="productCode"
          value={formData.productCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Product Name"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Product Description"
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
        />
        <TextField
          label="Stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Grid container spacing={2} marginTop={1}>
          <Grid item xs={6}>
            <TextField
              label="Tax Slab "
              name="taxSlab"
              value={formData.taxSlab}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="HSN Code"
              name="hsnCode"
              value={formData.hsnCode}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Typography variant="h6" mt={2} gutterBottom>
          Upload Image
        </Typography>
        <input
          accept="image/*"
          type="file"
          onChange={handleImageUpload}
          style={{ marginBottom: "8px" }}
        />
        <Typography variant="body2" color="textSecondary">
          Maximum size 2Mb
        </Typography>
        {image && (
          <Box sx={{ textAlign: "center", marginY: 2 }}>
            <img
              src={image}
              alt="Uploaded Preview"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </Box>
        )}

        {/* <Box textAlign="center" marginTop={3}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box> */}

        <Box textAlign="center" marginTop={3} display="flex" justifyContent="space-around">
          <Button
            style={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "white",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "#6a11cb",
              borderColor: "#6a11cb",
              fontWeight: "bold",
              height: "48px",
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
