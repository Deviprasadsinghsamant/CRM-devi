import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import { useOrderContext } from "../../../context/OrderContext";
import dayjs from "dayjs";
import { WidthFull } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
const InvoiceForm = () => {
  const { orderId, generateOrderId } = useOrderContext();

  const [invoiceForms, setInvoiceForms] = useState([
    {
      id: Date.now(),
      invoiceId: "",
      invoiceNumber: "",
      invoiceDate: "",
    },
  ]);

  const handleSubmitInvoice = async () => {
    if (!orderId) {
      toast.error("Order ID is still generating. Please wait.");
      return;
    }

    // Validate all invoice forms
    const isValid = invoiceForms.every((form) => form.invoiceNumber && form.invoiceDate);
    if (!isValid) {
      toast.error("Please fill in all required fields (Invoice Number, Invoice Date).");
      return;
    }
    console.log(invoiceForms);
    try {
      // Map and prepare invoice data
      const invoiceData = invoiceForms.map((form) => ({
        orderId,
        invoiceId: form.invoiceId || "",
        invoiceNumber: form.invoiceNumber,
        invoiceDate: form.invoiceDate,
      }));

      console.log("Invoice Data:", invoiceData);

      const response = await axios.post("http://localhost:8080/invoices", invoiceData);
      toast.success("Invoices submitted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting the Invoice Form:", error);

      const errorMessage = error.response?.data?.message || "Failed to submit the invoice.";
      toast.error(errorMessage);
    }
  };

  //ad by clicking plus
  const handleAddInvoiceForm = () => {
    setInvoiceForms([
      ...invoiceForms,
      { id: Date.now(), invoiceId: "", invoiceNumber: "", invoiceDate: "" },
    ]);
  };

  //remove by clicking minus
  const handleRemoveInvoiceForm = (id) => {
    setInvoiceForms(invoiceForms.filter((form) => form.id !== id));
  };

  //changes handing in input fields
  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setInvoiceForms((prevForms) =>
      prevForms.map((form) => (form.id === id ? { ...form, [name]: value } : form))
    );
  };

  // GENERATE ORdER id if not generated
  useEffect(() => {
    const fetchOrderId = async () => {
      if (!orderId) {
        await generateOrderId();
      }
    };
    fetchOrderId();
  }, [orderId, generateOrderId]);

  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Grid item xs={12} md={12}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography variant="h4" fontWeight="bold" mt={4} mb={3}>
          Invoice Details
        </Typography>
      </Box>

      {/*looop through invoice forms */}
      {invoiceForms.length > 0 &&
        invoiceForms.map((form) => (
          <Box
            key={form.id}
            mb={4}
            border="1px solid #e0e0e0"
            borderRadius="8px"
            p={3}
            mx={2}
            bgcolor="#f9f9f9"
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Order ID"
                  name="orderId"
                  // disabled
                  value={orderId || "Loading..."}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Invoice Number"
                  fullWidth
                  name="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={(e) => handleInputChange(e, form.id)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Invoice Attachment"
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
              <Grid item xs={12} md={6}>
                <TextField
                  label="Invoice Date"
                  name="invoiceDate"
                  type="date"
                  value={form.invoiceDate}
                  // name="materialDispatchedDate"

                  sx={{ width: "100%" }}
                  // onChange={(e) => handleInputChange(e, form.id)}
                  onChange={(e) => handleInputChange(e, form.id)}
                  InputLabelProps={{ shrink: true }}
                  // renderInput={(params) => <TextField {...params} fullWidth />}
                  // InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <IconButton onClick={() => handleRemoveInvoiceForm(form.id)} color="error">
                <RemoveCircleIcon />
              </IconButton>
              <IconButton onClick={handleAddInvoiceForm} color="primary">
                <AddCircleIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          style={{
            display: "flex-start",
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            color: "#fff",
            textTransform: "none",
            padding: "8px 24px",
          }}
          onClick={handleSubmitInvoice}
        >
          Submit Invoices
        </Button>
      </Box>
      <ToastContainer />
    </Grid>
    // </LocalizationProvider>
  );
};

export default InvoiceForm;
