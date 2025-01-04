import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import ViewPaymentsModal from "modals/ViewPaymentsModal";
import "./globalstyling/showPayment.css";
// import CreateOrder from "./CreateOrder"; // Import your CreateOrder component

function ShowPayment() {
  const [payments, setPayments] = useState([]);
  // const [customers, setCustomers] = useState({});
  // const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("my request");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/payments"); // Adjust URL if necessary
        setPayments(response.data); // Use "orders" state for payments
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, []);

  console.log(payments);

  // Fetch customers (separate useEffect)
  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8080/customers");
  //       const customersMap = response.data.reduce((map, customer) => {
  //         map[customer._id] = customer;
  //         return map;
  //       }, {});
  //       setCustomers(customersMap);
  //     } catch (error) {
  //       console.error("Error fetching customers:", error);
  //     }
  //   };
  //   fetchCustomers();
  // }, []);

  const handleCreateOrder = () => {
    setShowCreateOrder(true);
  };

  const handleRequestChange = (event) => {
    setSelectedRequest(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = payments.filter((payment) => {
    if (selectedRequest === "all requests") {
      return payment.orderId.toString().includes(searchQuery);
    } else {
      return payment.orderId.toString().includes(searchQuery) && payment.userId === "your_user_id"; // Replace 'your_user_id' with the actual user ID
    }
  });

  return (
    <Container style={{ flex: 1, padding: "2rem" }}>
      <Paper elevation={2} style={{ padding: "1.5rem", borderRadius: "8px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            Payments
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                displayEmpty
                value={selectedRequest}
                onChange={handleRequestChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "gray",
                    },
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
              >
                <MenuItem value="my request">My Payments</MenuItem>
                <MenuItem value="all requests">All Payments</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ m: 1, minWidth: 120, height: "40px" }}
            />
          </div>
        </Box>
        {/* {showCreateOrder && <CreateOrder />} */}
        <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
          <Table style={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow className="row-background">
                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Order ID
                </TableCell>

                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Payment ID
                </TableCell>
                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Payment Type
                </TableCell>
                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Payment Date
                </TableCell>
                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Payment Method
                </TableCell>
                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Amount Received
                </TableCell>
                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Notes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments &&
                filteredOrders.map((payment, index) => (
                  <TableRow
                    key={index}
                    style={{
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                    }}
                  >
                    <TableCell
                      style={{
                        padding: "12px 16px",
                        flexGrow: 1,
                        textAlign: "center",
                      }}
                    >
                      {payment.orderId}
                    </TableCell>

                    <TableCell
                      style={{
                        padding: "12px 16px",
                        flexGrow: 1,
                        textAlign: "center",
                      }}
                    >
                      {payment.paymentId || "N/A"}
                    </TableCell>

                    <TableCell
                      style={{
                        padding: "12px 16px",
                        flexGrow: 1,
                        textAlign: "center",
                      }}
                    >
                      {payment.paymentType}
                    </TableCell>

                    <TableCell
                      style={{
                        padding: "12px 16px",
                        flexGrow: 1,
                        textAlign: "center",
                      }}
                    >
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell
                      style={{
                        padding: "12px 16px",
                        flexGrow: 1,
                        textAlign: "center",
                      }}
                    >
                      {payment.paymentMethod}
                    </TableCell>

                    <TableCell
                      style={{
                        padding: "12px 16px",
                        flexGrow: 1,
                        textAlign: "center",
                      }}
                    >
                      {payment.amountReceived}
                    </TableCell>

                    <TableCell
                      style={{
                        padding: "12px 16px",
                        flexGrow: 1,
                        textAlign: "center",
                      }}
                    >
                      {payment.notes || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                      }}
                    >
                      <ViewPaymentsModal
                        payment={{
                          id: payment.orderId,
                          invoiceId: payment.paymentId || "N/A",
                          paymentType: payment.paymentType,
                          paymentDate: new Date(payment.paymentDate).toLocaleDateString() || "N/A",
                          paymentMethod: payment.paymentMethod,
                          amountReceived: payment.amountReceived,
                          notes: payment.notes || "N/A",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
    // </div>
  );

  function handleAction(order) {
    console.log("Action clicked for order:", order);
  }
}

export default ShowPayment;
