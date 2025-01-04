//v6 major
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import { useOrderContext } from "../../../context/OrderContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogisticsForm = () => {
  const { orderId, generateOrderId } = useOrderContext();
  const [logisticsForms, setLogisticsForms] = useState([
    {
      id: Date.now(),
      itemsDispatched: "",
      materialDispatchedDate: "",
      courierPartnerDetails: "",
      docketNumber: "",
      paymentType: "",
      amount: "",
    },
  ]);

  //form submission
  const handleSubmitLogistics = async () => {
    if (!orderId) {
      alert("Order ID is still generating. Please wait.");
      return;
    }
    console.log(logisticsForms);
    const isValid = logisticsForms.every(
      (form) =>
        form.itemsDispatched &&
        form.materialDispatchedDate &&
        form.courierPartnerDetails &&
        form.docketNumber &&
        form.paymentType &&
        form.amount
    );

    if (!isValid) {
      alert("Please fill in all required fields.");
    }

    try {
      const logisticsData = logisticsForms.map((form) => ({
        orderId,
        itemsDispatched: form.itemsDispatched,
        materialDispatchedDate: form.materialDispatchedDate,
        courierPartnerDetails: form.courierPartnerDetails,
        docketNumber: form.docketNumber,
        paymentType: form.paymentType,
        amount: form.amount,
      }));

      console.log("Logistics Data:", logisticsData);

      const response = await axios.post("http://localhost:8080/logistics", logisticsData);
      toast.success("Logistics details submitted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting the Logistics Form:", error);
      toast.error("Failed to submit logistics details.");
    }
  };

  //add a new logistic form
  const handleAddLogisticsForm = () => {
    setLogisticsForms([
      ...logisticsForms,
      {
        id: Date.now(),
        itemsDispatched: "",
        materialDispatchedDate: "",
        courierPartnerDetails: "",
        docketNumber: "",
        paymentType: "",
        amount: "",
      },
    ]);
  };

  const handleRemoveLogisticsForm = (id) => {
    setLogisticsForms(logisticsForms.filter((form) => form.id !== id));
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setLogisticsForms((prevForms) =>
      prevForms.map((form) => (form.id === id ? { ...form, [name]: value } : form))
    );
  };
  //generate if not generated
  useEffect(() => {
    const fetchOrderId = async () => {
      if (!orderId) {
        await generateOrderId();
      }
    };
    fetchOrderId();
  }, [orderId, generateOrderId]);

  return (
    <Grid item xs={12} md={12}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
        <Typography variant="h4" fontWeight="bold" mt={4} mb={3}>
          Logistics Details
        </Typography>
      </Box>

      {logisticsForms.length > 0 &&
        logisticsForms.map((form) => (
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
                  value={orderId || "Loading..."}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Material Dispatched Date"
                  name="materialDispatchedDate"
                  type="date"
                  value={form.materialDispatchedDate}
                  onChange={(e) => handleInputChange(e, form.id)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Courier Partner Details"
                  name="courierPartnerDetails"
                  value={form.courierPartnerDetails}
                  onChange={(e) => handleInputChange(e, form.id)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Docket Number"
                  name="docketNumber"
                  value={form.docketNumber}
                  onChange={(e) => handleInputChange(e, form.id)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Payment Type"
                  name="paymentType"
                  value={form.paymentType}
                  onChange={(e) => handleInputChange(e, form.id)}
                  select
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "47px !important",
                      "& .MuiOutlinedInput-notchedOutline": {
                        height: "47px !important",
                      },
                    },
                  }}
                >
                  {/* things to be added */}
                  <MenuItem value="To Pay">Advanced</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Amount"
                  name="amount"
                  value={form.amount}
                  onChange={(e) => handleInputChange(e, form.id)}
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Items Dispatched"
                  name="itemsDispatched"
                  value={form.itemsDispatched}
                  onChange={(e) => handleInputChange(e, form.id)}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <IconButton onClick={() => handleRemoveLogisticsForm(form.id)} color="error">
                <RemoveCircleIcon />
              </IconButton>
              <IconButton onClick={handleAddLogisticsForm} color="primary">
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
          onClick={handleSubmitLogistics}
        >
          Submit Logistics
        </Button>
      </Box>
      <ToastContainer />
    </Grid>
  );
};

export default LogisticsForm;
