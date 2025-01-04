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

function ShowLogistics() {
  const [logistics, setLogistics] = useState([]);
  // const [customers, setCustomers] = useState({});
  // const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("my request");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch orders and customers from API
  // useEffect(() => {
  //   const fetchOrdersAndCustomers = async () => {
  //     try {
  //       const ordersResponse = await axios.get("http://localhost:8080/orders");
  //       setOrders(ordersResponse.data);

  //       const customersResponse = await axios.get("http://localhost:8080/customers");
  //       const customersMap = customersResponse.data.reduce((map, customer) => {
  //         map[customer._id] = customer;
  //         return map;
  //       }, {});
  //       setCustomers(customersMap);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchOrdersAndCustomers();
  // }, []);

  // Fetch orders

  useEffect(() => {
    const fetchLogistics = async () => {
      try {
        const response = await axios.get("http://localhost:8080/logistics");
        setLogistics(response.data);
      } catch (error) {
        console.error("Error fetching logistics data:", error);
      }
    };
    fetchLogistics();
  }, []);

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

  const filteredLogistics = logistics.filter((logistic) => {
    if (selectedRequest === "all requests") {
      return logistic.orderId?.orderId.toString().includes(searchQuery);
    }
    // Replace 'your_user_id' with actual user ID for filtering "my request"
    return logistic.orderId?.orderId.toString().includes(searchQuery);
  });

  return (
    <Container style={{ flex: 1, padding: "2rem" }}>
      <Paper elevation={2} style={{ padding: "1.5rem", borderRadius: "8px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            Logistics
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
                <MenuItem value="my request">My Logistics</MenuItem>
                <MenuItem value="all requests">All Logistics</MenuItem>
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
                  Items Dispatched
                </TableCell>
                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Material Dispatched Date
                </TableCell>
                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Courier Details
                </TableCell>
                <TableCell
                  style={{
                    padding: "12px 16px",
                    flexGrow: 1,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Docket Number
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
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logistics &&
                filteredLogistics.map((logistic, index) => (
                  <TableRow key={index} style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <TableCell style={{ padding: "12px 16px", textAlign: "center" }}>
                      {logistic.orderId?.orderId || "N/A"} {/* Display order ID */}
                    </TableCell>
                    <TableCell style={{ padding: "12px 16px", textAlign: "center" }}>
                      {logistic.itemsDispatched || "N/A"}
                    </TableCell>
                    <TableCell style={{ padding: "12px 16px", textAlign: "center" }}>
                      {new Date(logistic.materialDispatchedDate).toLocaleDateString() || "N/A"}
                    </TableCell>
                    <TableCell style={{ padding: "12px 16px", textAlign: "center" }}>
                      {logistic.courierPartnerDetails || "N/A"}
                    </TableCell>
                    <TableCell style={{ padding: "12px 16px", textAlign: "center" }}>
                      {logistic.docketNumber || "N/A"}
                    </TableCell>
                    <TableCell style={{ padding: "12px 16px", textAlign: "center" }}>
                      {logistic.paymentType || "N/A"}
                    </TableCell>
                    <TableCell style={{ padding: "12px 16px", textAlign: "center" }}>
                      ₹{logistic.amount || "N/A"}
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

export default ShowLogistics;
