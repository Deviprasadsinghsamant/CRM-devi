// v2

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { TextField, Button, Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axios from "axios";

import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
// import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
// import axios from "axios";
import CustomerModal from "modals/Modal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import InvoiceForm from "./forms/InvoiceForm";
import LogisticsForm from "./forms/LogisticsForm";
import PaymentForm from "./forms/PaymentForm";
import ProductForm from "./forms/ProductForms";
import { useOrderContext } from "../../context/OrderContext";
import { generateOrderId } from "../../context/OrderContext";
import { useParams } from "react-router-dom";

const EditOrder = () => {
  const { orderId } = useParams(); // Get the dynamic order ID
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]); // Initialize as an empty array
  console.log(orderId);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orderId: "",
    orderDate: dayjs(),
    bookedBy: "",
    startDate: dayjs(),
    completionDate: dayjs(),
    paymentDueDate: dayjs(),
    projectHead: "",
    customer: "",
    address: "",
    billTo: "",
    quotationNumber: "",
    quotationDate: dayjs(),
    poPiNumber: "",
    poPiDate: dayjs(),
    transportationCost: "",
    amountWithGST: "",
    totalAmount: "",
  });

  useEffect(() => {
    // Fetch the order details on component mount
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}`);
        const order = response.data;

        setFormData({
          ...order,
          orderDate: dayjs(order.orderDate),
          startDate: dayjs(order.startDate),
          completionDate: dayjs(order.completionDate),
          paymentDueDate: dayjs(order.paymentDueDate),
          quotationDate: dayjs(order.quotationDate),
          poPiDate: dayjs(order.poPiDate),
        });
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  //new add below
  const [modalOpen, setModalOpen] = useState(false);
  // Functions to handle modal open/close
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  //below is to fetch all the customersss
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/customers", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  //below is for customer selection
  //   const handleCustomerChange = (event, newValue) => {
  //     if (newValue) {
  //       const selected = customers.find((customer) => customer.contactName === newValue.contactName);
  //       if (selected) {
  //         setSelectedCustomer(selected);
  //         setFormData((prev) => ({
  //           ...prev,
  //           contactPerson: selected.contactName,
  //           mobileNumber: selected.contactNumber,
  //           email: selected.email,
  //           deliveryAddress: selected.siteDeliveryAddress,
  //           gstNumber: selected.gstNumber,
  //         }));
  //       }
  //     } else {
  //       setSelectedCustomer(null);
  //       setFormData((prev) => ({
  //         ...prev,
  //         contactPerson: "",
  //         mobileNumber: "",
  //         email: "",
  //         deliveryAddress: "",
  //         gstNumber: "",
  //       }));
  //     }
  //   };

  //v6
  const handleCustomerChange = (event, newValue) => {
    if (newValue) {
      const selected = customers.find((customer) => customer.contactName === newValue.contactName);
      if (selected) {
        setSelectedCustomer(selected);
        setFormData((prev) => ({
          ...prev,
          contactPerson: selected.contactName,
          mobileNumber: selected.contactNumber,
          email: selected.email,
          deliveryAddress: selected.siteDeliveryAddress,
          gstNumber: selected.gstNumber,
        }));
      }
    } else {
      setSelectedCustomer(null);
      setFormData((prev) => ({
        ...prev,
        contactPerson: "",
        mobileNumber: "",
        email: "",
        deliveryAddress: "",
        gstNumber: "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle customer addition
  const handleAddCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]); // Add the new customer to the list
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/orders/${orderId}`, formData); // PUT request with dynamic orderId
      navigate("/orders"); // Redirect after updating
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" style={{ paddingTop: "64px" }}>
        <Paper
          elevation={3}
          style={{ padding: "20px", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
        >
          <Typography variant="h4">Edit Order</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Order Start Date"
                value={formData.startDate}
                onChange={(newValue) => handleDateChange("startDate", newValue)}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Order Completion Date"
                value={formData.completionDate}
                onChange={(newValue) => handleDateChange("completionDate", newValue)}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Payment Due Date"
                value={formData.paymentDueDate}
                onChange={(newValue) => handleDateChange("paymentDueDate", newValue)}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                // displayEmpty
                label="Project Head"
                name="projectHead"
                value={formData.projectHead}
                onChange={handleInputChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {},
                    height: "40px !important",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiSelect-select": {
                    padding: "0 10px",
                    height: "40px !important",
                    display: "flex",
                    alignItems: "center",
                  },
                }}
                select
                fullWidth
              >
                <MenuItem value="">
                  <em>Select Project Head</em>
                </MenuItem>
              </TextField>
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              // new add below style only
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Autocomplete
                options={customers} // Use customer objects
                getOptionLabel={(option) => option.contactName} // Get customer name
                value={selectedCustomer}
                onChange={handleCustomerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "47px !important",
                        "& .MuiOutlinedInput-notchedOutline": {
                          height: "47px !important",
                        },
                      },
                    }}
                  />
                )}
                style={{ flexGrow: 1 }}
              />
              <Button
                variant="contained"
                style={{
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "white",
                  height: "47px", // heiiight mathch
                  padding: "0 15px",
                  fontSize: "12px",
                  width: "250px",
                }}
                onClick={handleModalOpen}
              >
                Add Customer
              </Button>
              <CustomerModal
                open={modalOpen}
                onClose={handleModalClose}
                onCustomerAdded={handleAddCustomer}
              />
            </Grid>
            <Grid></Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Contact Person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: Boolean(formData.contactPerson), // Shrink when there is a value
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: Boolean(formData.mobileNumber),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: Boolean(formData.email),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="GST Number"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: Boolean(formData.gstNumber),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Site/Delivery Address"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                InputLabelProps={{
                  shrink: Boolean(formData.deliveryAddress),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Bill To"
                name="billTo"
                value={formData.billTo}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                InputLabelProps={{
                  shrink: Boolean(formData.billTo),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Quotation Number"
                name="quotationNumber"
                value={formData.quotationNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Quotation Date"
                value={formData.quotationDate}
                onChange={(newValue) => handleDateChange("quotationDate", newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                sx={{ width: "100%" }}
              />
            </Grid>{" "}
            <Grid item xs={12} md={4}>
              <TextField
                label="Quotation Attachment"
                type="file"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fas fa-file-alt"></i>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="PO/PI Number"
                name="poPiNumber"
                value={formData.poPiNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="PO/PI Date"
                value={formData.poPiDate}
                onChange={(newValue) => handleDateChange("poPiDate", newValue)}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="PO/PI Attachment"
                type="file"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fas fa-file-alt"></i>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/orders")}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default EditOrder;
