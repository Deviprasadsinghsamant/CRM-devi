import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useOrderContext } from "../../../context/OrderContext";
import dayjs from "dayjs";
import LogisticsForm from "./LogisticsForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentForm = () => {
  const { orderId, generateOrderId } = useOrderContext();
  const [paymentForms, setPaymentForms] = useState([
    {
      id: Date.now(),

      paymentType: "",
      paymentDate: "", // dayjs().format("YYYY-MM-DD"),
      paymentMethod: "",
      amountReceived: "",
      notes: "",
    },
  ]);

  const handleAddPaymentForm = () => {
    setPaymentForms([
      ...paymentForms,
      {
        id: Date.now(),
        paymentType: "",
        paymentDate: "",
        paymentMethod: "",
        amountReceived: "",
        notes: "",
      },
    ]);
  };

  const handleRemovePaymentForm = (id) => {
    setPaymentForms(paymentForms.filter((form) => form.id !== id));
  };

  // const handleInputChange = (id, name, value) => {
  //   setPaymentForms((prevForms) =>
  //     prevForms.map((form) => (form.id === id ? { ...form, [name]: value } : form))
  //   );
  // };
  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setPaymentForms((prevForms) =>
      prevForms.map((form) => (form.id === id ? { ...form, [name]: value } : form))
    );
  };

  // GENERATE ORER id if not generated
  useEffect(() => {
    const fetchOrderId = async () => {
      if (!orderId) {
        await generateOrderId();
      }
    };
    fetchOrderId();
  }, [orderId, generateOrderId]);

  //fixes
  const handleSubmit = async () => {
    if (!orderId) {
      alert("Order ID is still generating. Please wait.");
      return;
    }
    console.log(LogisticsForm);

    try {
      const paymentData = paymentForms.map((form) => ({
        orderId,
        paymentType: form.paymentType,
        paymentDate: form.paymentDate,
        paymentMethod: form.paymentMethod,
        amountReceived: form.amountReceived,
        notes: form.notes,
      }));

      //validate before sending
      // for (const form of paymentData) {
      //   if (!form.paymentType || !form.paymentDate || !form.amountReceived || !orderId) {
      //     alert("Please fill out all required fields.");
      //     return;
      //   }
      // }
      console.log(paymentData);

      const response = await axios.post("http://localhost:8080/payments", paymentData);
      toast.success("Payments created successfully!");
      console.log(response.data);
    } catch (err) {
      console.error("Error creating payments:", err.response?.data || err);
      toast.error("Error creating payments.");
    }
  };

  return (
    <Grid item xs={12} md={12}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography variant="h4" fontWeight="bold" mt={4} mb={3}>
          Payment Details
        </Typography>
      </Box>

      {paymentForms.length > 0 &&
        paymentForms.map((form) => (
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
                  value={orderId || "loading"}
                  // InputProps={{ readOnly: true }}
                  // onChange={(e) => handleInputChange(e, form.id)}
                  // onChange={(e) => handleInputChange(form.id, "orderId", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Payment Type"
                  name="paymentType"
                  value={form.paymentType}
                  onChange={(e) => handleInputChange(e, form.id)}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "47px !important",
                      "& .MuiOutlinedInput-notchedOutline": {
                        height: "47px !important",
                      },
                    },
                  }}
                  select
                >
                  <MenuItem value="Full Payment">Full Payment</MenuItem>
                  <MenuItem value="Part Payment">Part Payment</MenuItem>
                  <MenuItem value="Advance">Advance</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Payment Method"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={(e) => handleInputChange(e, form.id)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Amount Received"
                  name="amountReceived"
                  value={form.amountReceived}
                  onChange={(e) => handleInputChange(e, form.id)}
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Payment Date"
                  // value={form.paymentDate ? dayjs(form.paymentDate) : dayjs()}
                  // onChange={(newValue) =>
                  //   handleInputChange(form.id, "paymentDate", dayjs(newValue).format("YYYY-MM-DD"))
                  // }
                  // renderInput={(params) => <TextField {...params} fullWidth />}

                  name="paymentDate"
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => handleInputChange(e, form.id)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={form.notes}
                  onChange={(e) => handleInputChange(e, form.id)}
                  placeholder="Enter a description"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <IconButton onClick={() => handleRemovePaymentForm(form.id)} color="error">
                <RemoveCircleIcon />
              </IconButton>
              <IconButton onClick={handleAddPaymentForm} color="primary">
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
          onClick={handleSubmit}
        >
          Submit Payments
        </Button>
      </Box>
      {/* ToastContainer for displaying toast notifications */}
      <ToastContainer />
    </Grid>
  );
};

export default PaymentForm;
