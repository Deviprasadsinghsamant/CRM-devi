import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CustomerModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    contactName: "",
    contactNumber: "",
    email: "",
    siteDeliveryAddress: "",
    gstNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/customers", formData);
      toast.success("Customer added successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add customer.");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6" mb={2}>
            Add Customer
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="contactName"
              label="Customer Name"
              fullWidth
              margin="normal"
              required
              value={formData.contactName}
              onChange={handleChange}
            />
            <TextField
              name="contactNumber"
              label="Contact Number"
              fullWidth
              margin="normal"
              required
              value={formData.contactNumber}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email Address"
              fullWidth
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              name="siteDeliveryAddress"
              label="Address"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={formData.siteDeliveryAddress}
              onChange={handleChange}
            />
            <TextField
              name="gstNumber"
              label="GST Number"
              fullWidth
              margin="normal"
              value={formData.gstNumber}
              onChange={handleChange}
            />
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                variant="contained"
                onClick={onClose}
                style={{
                  display: "flex-start",
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "#fff",
                  textTransform: "none",
                  padding: "8px 24px",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                style={{
                  display: "flex-start",
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "#fff",
                  textTransform: "none",
                  padding: "8px 24px",
                }}
              >
                Add Customer
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
}

CustomerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCustomerAdded: PropTypes.func.isRequired, // New PropType
};

export default CustomerModal;
