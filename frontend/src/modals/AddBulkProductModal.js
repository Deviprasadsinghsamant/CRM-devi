import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import "./globalstyling/modal.css";
import { PropTypes } from "prop-types";

// eslint-disable-next-line react/prop-types
const AddBulkProductModal = ({ open, onClose }) => {
  const [image, setImage] = useState(null);
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
  const handleBackdropClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div>
      <Modal open={open} onClose={handleBackdropClick}>
        <Box className="modal-style" onClick={handleBackdropClick}>
          <Typography variant="h6" gutterBottom>
            Bulk Product Form
          </Typography>
          <Grid item xs={12} textAlign="flex-start">
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudDownloadIcon />}
              sx={{ marginBottom: 2 }}
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
              }}
            >
              Download Template
            </Button>
          </Grid>
          <Typography variant="h6" mt={2} gutterBottom>
            Upload Excel Sheet
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
            <Box className="box-style">
              <img
                src={image}
                alt="Uploaded Preview"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </Box>
          )}
          <Grid container spacing={8} justifyContent="center" marginTop={3}>
            <Grid item>
              <Button
                variant="contained"
                className="custom-button"
                onClick={onClose}
                style={{
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "white",
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                className="custom-button"
                style={{
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "white",
                }}
              >
                Add Products
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

AddBulkProductModal.PropTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddBulkProductModal;
