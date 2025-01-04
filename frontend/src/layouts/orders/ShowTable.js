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
  IconButton,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

//below new add
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ShowInvoice from "./ShowInvoice";
import ShowLogistics from "./ShowLogistics";
import ShowPayment from "./ShowPayment";
import ViewModal from "modals/ViewModal";
import EditIcon from "@mui/icons-material/Edit";
import "./globalstyling/ShowTable.css";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("my request");
  const [searchQuery, setSearchQuery] = useState("");
  const [invoicesbyOrd, setInvoicesbyOrd] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  console.log(orders);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/customers");
        const customersMap = response.data.reduce((map, customer) => {
          map[customer._id] = customer;
          return map;
        }, {});
        setCustomers(customersMap);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleCreateOrder = () => {
    setShowCreateOrder(true);
  };

  const handleRequestChange = (event) => {
    setSelectedRequest(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedRequest === "all requests") {
      return order.orderId.toString().includes(searchQuery);
    } else {
      return order.orderId.toString().includes(searchQuery) && order.userId === "your_user_id"; // Replace 'your_user_id' with the actual user ID
    }
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
        <div style={{ width: "50px", backgroundColor: "#f0f0f0" }}></div>
        <Container style={{ flex: 1, padding: "2rem" }}>
          <Paper elevation={2} style={{ padding: "1.5rem", borderRadius: "8px" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                Order Management
              </Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  component={Link}
                  to="/tables/order-form"
                  variant="contained"
                  style={{
                    background: "linear-gradient(to right, #6a11cb, #2575fc)",
                    color: "white",
                  }}
                  onClick={handleCreateOrder}
                >
                  Create Order
                </Button>
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
                    <MenuItem value="my request">My Request</MenuItem>
                    <MenuItem value="all requests">All Requests</MenuItem>
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

            <TableContainer component={Paper} style={{ borderRadius: "8px" }}>
              <Table
                className="my-zebra-striped-table"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
                <TableHead>
                  <TableRow
                    style={{
                      background: "linear-gradient(to right, #6a11cb, #2575fc)",
                      color: "#333",
                    }}
                  >
                    <TableCell
                      style={{
                        padding: "12px",
                        width: "150px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Order ID
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "12px",
                        width: "250px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Customer Name
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "12px",

                        width: "290px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Quotation Number
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "12px",
                        width: "270px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "12px",
                        width: "200px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Phone Number
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "12px",

                        flexGrow: 1,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const invoice = order.invoice || {};
                    const customer = customers[order.customer?._id] || {};
                    return (
                      <TableRow
                        key={order._id}
                        style={{
                          borderBottom: "1px solid #e0e0e0",
                          display: "flex",
                        }}
                      >
                        <TableCell style={{ padding: "12px 16px", width: "15%" }}>
                          {order.orderId}
                        </TableCell>

                        <TableCell style={{ padding: "12px 16px", width: "20%" }}>
                          {customer.contactName || "N/A"}
                        </TableCell>
                        <TableCell style={{ padding: "12px 16px", width: "20%" }}>
                          {order.quotationNumber}
                        </TableCell>
                        <TableCell style={{ padding: "12px 16px", width: "25%" }}>
                          {customer.email || "N/A"}
                        </TableCell>
                        <TableCell style={{ padding: "12px 16px", width: "15%" }}>
                          {customer.contactNumber || "N/A"}
                        </TableCell>
                        <TableCell
                          style={{
                            padding: "12px 16px",
                            flexGrow: 1,
                            display: "flex",
                          }}
                        >
                          <IconButton component={Link} to="/tables/order-form">
                            <EditIcon />
                          </IconButton>
                          <ViewModal
                            order={{
                              oid: order._id,
                              orderId: order.orderId,
                              bookedBy: order.bookedBy,
                              orderDate: order.orderDate,
                              startDate: order.startDate,
                              completionDate: order.completionDate,
                              paymentDueDate: order.paymentDueDate,
                              projectHead: order.projectHead,
                              customer: customer._id || "N/A",
                              address: order.address,
                              billTo: order.billTo,
                              customerName: customer.contactName || "N/A",
                              quotationNumber: order.quotationNumber,
                              quotationDate: order.quotationDate,
                              poPiNumber: order.poPiNumber,
                              poPiDate: order.poPiDate,
                              transportationCost: order.transportationCost,
                              amountWithGST: order.amountWithGST,
                              totalAmount: order.totalAmount,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </div>
    </DashboardLayout>
  );

  function handleAction(order) {
    console.log("Action clicked for order:", order);
  }
}

export default OrderManagement;
