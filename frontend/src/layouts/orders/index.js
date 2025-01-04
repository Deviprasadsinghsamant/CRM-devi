import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
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
} from "@mui/material";
import dayjs from "dayjs"; //ADDITION
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CustomerModal from "modals/Modal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import InvoiceForm from "./forms/InvoiceForm";
import LogistcsForm from "./forms/LogisticsForm";
import LogisticsForm from "./forms/LogisticsForm";
import PaymentForm from "./forms/PaymentForm";
import ProductForm from "./forms/ProductForms";
import { useOrderContext } from "../../context/OrderContext";
import { generateOrderId } from "../../context/OrderContext";

function Tables() {
  //f2

  const { orderId, generateOrderId } = useOrderContext();
  //v8
  const [activeForm, setActiveForm] = useState(""); // State to track active form
  const [orderDate, setOrderDate] = useState(dayjs());
  const [orderStartDate, setOrderStartDate] = useState(null);
  const [orderCompletionDate, setOrderCompletionDate] = useState(null);
  const [paymentDueDate, setPaymentDueDate] = useState(null);
  const [quotationDate, setQuotationDate] = useState(null);
  const [poPiDate, setPoPiDate] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]); // Initialize as an empty array
  //NEW ADD FOR FORM VISIBILITY
  const [showProductForm, setShowProductForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showLogisticsForm, setShowLogisticsForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    //newlines watchout
    // orderId: "",
    bookedBy: "Administrator",
    projectHead: "pro1",
    //below is changed
    // customer: "",
    contactPerson: "",
    mobileNumber: "",
    email: "",
    deliveryAddress: "",
    gstNumber: "",
    billTo: "",
    quotationNumber: "",
    poPiNumber: "",
  });

  //new add below
  const [modalOpen, setModalOpen] = useState(false);
  // Functions to handle modal open/close
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  useEffect(() => {
    const createOrderId = async () => {
      if (!orderId) {
        // Wait for the async operation to complete
        await generateOrderId();
      }
    };
    createOrderId();
  }, [orderId, generateOrderId]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //below v5 reset form
  const resetForm = () => {
    setOrderDate(dayjs());
    setOrderStartDate(null);
    setOrderCompletionDate(null);
    setPaymentDueDate(null);
    setQuotationDate(null);
    setPoPiDate(null);
    setSelectedCustomer(null);
    setFormData({
      bookedBy: "Administrator",
      projectHead: "pro1",
      contactPerson: "",
      mobileNumber: "",
      email: "",
      deliveryAddress: "",
      gstNumber: "",
      billTo: "",
      quotationNumber: "",
      poPiNumber: "",
    });
  };

  const handleSubmit = async () => {
    //v5 add ifs
    if (!orderId) {
      alert("Order ID is still generating. Please wait.");
      return;
    }

    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    if (!orderDate || !orderStartDate || !orderCompletionDate || !paymentDueDate) {
      alert("Please fill all the required dates.");
      return;
    }
    try {
      const formattedData = {
        orderId,
        customer: selectedCustomer?._id || "",
        orderDate: orderDate.toISOString().split("T")[0],
        bookedBy: formData.bookedBy || "Administrator",
        projectHead: formData.projectHead || "pro1",
        startDate: orderStartDate ? orderStartDate.format("YYYY-MM-DD") : null,
        completionDate: orderCompletionDate ? orderCompletionDate.format("YYYY-MM-DD") : null,
        paymentDueDate: paymentDueDate ? paymentDueDate.format("YYYY-MM-DD") : null,
        quotationDate: quotationDate ? quotationDate.format("YYYY-MM-DD") : null,
        poPiDate: poPiDate ? poPiDate.format("YYYY-MM-DD") : null,
        transportationCost: formData.transportationCost || 0,
        amountWithGST: formData.amountWithGST || 0,
        totalAmount: formData.totalAmount || 0,
        address: formData.deliveryAddress || "",
        billTo: formData.billTo || "",
        quotationNumber: formData.quotationNumber || "",
        poPiNumber: formData.poPiNumber || "",
      };

      const response = await axios.post("http://localhost:8080/orders", formattedData);
      alert("Order created successfully!");
      console.log(response.data);
      //v5 to reset form
      resetForm();
      //v5 to reset order
      // await generateOrderId();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create the order.");
    }
  };
  // Function to handle customer addition
  const handleAddCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]); // Add the new customer to the list
  };

  const renderForm = () => {
    switch (activeForm) {
      case "product":
        return <ProductForm />;
      case "invoice":
        return <InvoiceForm />;
      case "logistics":
        return <LogisticsForm />;
      case "payment":
        return <PaymentForm />;
      default:
        return <div></div>;
    }
  };

  return (
    <Container style={{ padding: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">Order Management</Typography>

          <Button
            variant="contained"
            disabled={
              !orderId ||
              !selectedCustomer ||
              !orderStartDate ||
              !orderCompletionDate ||
              !paymentDueDate
            }
            style={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "white",
            }}
            onClick={handleSubmit}
          >
            Submit Order
          </Button>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3} bgcolor="#f9f9f9" mb={4}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Order ID"
                name="orderId"
                disabled
                value={orderId || "Generating..."}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Order Date"
                value={orderDate}
                disabled
                // onChange={(newValue) => setOrderDate(newValue)}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Booked By"
                name="bookedBy"
                disabled
                value={formData.bookedBy}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Order Start Date"
                value={orderStartDate}
                onChange={(newValue) => setOrderStartDate(newValue)}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Order Completion Date"
                value={orderCompletionDate}
                onChange={(newValue) => setOrderCompletionDate(newValue)}
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Payment Due Date"
                value={paymentDueDate}
                onChange={(newValue) => setPaymentDueDate(newValue)}
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
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="GST Number"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                fullWidth
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
                value={quotationDate}
                onChange={(newValue) => setQuotationDate(newValue)}
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
                value={poPiDate}
                onChange={(newValue) => setPoPiDate(newValue)}
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
          </Grid>
        </LocalizationProvider>

        <Box display="flex" justifyContent="center" mt={4} gap={2}>
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "white",
            }}
            startIcon={<AddCircleIcon />}
            onClick={() => setActiveForm("product")}
          >
            Add Product Details
          </Button>
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "white",
            }}
            startIcon={<AddCircleIcon />}
            onClick={() => setActiveForm("invoice")}
          >
            Add Invoice Details
          </Button>
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "white",
            }}
            startIcon={<AddCircleIcon />}
            onClick={() => setActiveForm("logistics")}
          >
            Add Logistics Details
          </Button>
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "white",
            }}
            startIcon={<AddCircleIcon />}
            onClick={() => setActiveForm("payment")}
          >
            Add Payment Details
          </Button>
        </Box>
        {/* {showProductForm && <ProductForm />}
        {showInvoiceForm && <InvoiceForm />}
        {showLogisticsForm && <LogisticsForm />}
        {showPaymentForm && <PaymentForm />} */}

        <div>{renderForm()}</div>

        <Grid container spacing={2} style={{ padding: "20px" }}>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
            }}
          >
            <Grid item xs={12}>
              <Button
                variant="contained"
                style={{
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "#fff",
                  textTransform: "none",
                  padding: "8px 24px",
                }}
              >
                Cancel Order
              </Button>
            </Grid>
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "#fff",
                textTransform: "none",
                padding: "8px 24px",
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "#fff",
                textTransform: "none",
                padding: "8px 24px",
              }}
            >
              Submit This whole as a form
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Tables;
