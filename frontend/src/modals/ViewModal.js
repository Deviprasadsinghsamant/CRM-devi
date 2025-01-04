import React, { useState, useEffect } from "react";
import {
  Paper,
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./globalstyling/viewModal.css";

function ViewModal({ order, invoice }) {
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(order.oid);

  const fetchInvoices = async () => {
    try {
      // eslint-disable-next-line react/prop-types
      const response = await axios.get(`http://localhost:8080/invoices/${order.oid}`);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/payments/${order.oid}`);
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchLogistics = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/logistics/${order.oid}`);
      setLogistics(response.data);
    } catch (error) {
      console.error("Error fetching logistics:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchInvoices(); //fetchinvoices when the modal opens
    fetchPayments();
    fetchLogistics();
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button color="primary" onClick={handleOpen}>
        <VisibilityIcon fontSize="large" />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box className="modal">
          <Box
            sx={{
              position: "sticky",
              top: 1,
              backgroundColor: "#a9a9a9!important",
              paddingLeft: "16px !important",
              paddingRight: "16px !important",
              borderRadius: "1px !important",

              zIndex: 1,
              width: "100% !important",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  color: "black  !important",

                  paddingRight: "16px !important",
                  borderRadius: "8px !important",

                  letterSpacing: "3px",
                }}
              >
                ORDER DETAILS
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: "black  !important",

                paddingRight: "16px !important",
                borderRadius: "8px !important",
                paddingLeft: "32px !important",

                letterSpacing: "2px",
              }}
            >
              Order Informations
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2} className="grid-card">
              {[
                { label: "Order ID", value: order.orderId },
                { label: "Order Date", value: new Date(order.orderDate).toLocaleDateString() },
                { label: "Booked By", value: order.bookedBy },
                { label: "Start Date", value: new Date(order.startDate).toLocaleDateString() },
                {
                  label: "Completion Date",
                  value: new Date(order.completionDate).toLocaleDateString(),
                },
                {
                  label: "Payment Due Date",
                  value: new Date(order.paymentDueDate).toLocaleDateString(),
                },
                { label: "Project Head", value: order.projectHead },
                { label: "Customer ID", value: order.customer },
                { label: "Customer Name", value: order.customerName },
                { label: "Address", value: order.address || "N/A" },
                { label: "Bill To", value: order.billTo },
                { label: "Quotation Number", value: order.quotationNumber },
                {
                  label: "Quotation Date",
                  value: new Date(order.quotationDate).toLocaleDateString(),
                },
                { label: "PO/PI Number", value: order.poPiNumber },
                { label: "PO/PI Date", value: new Date(order.poPiDate).toLocaleDateString() },
                { label: "Transportation Cost", value: order.transportationCost },
                { label: "Amount with GST", value: order.amountWithGST },
                { label: "Total Amount", value: order.totalAmount },
              ].map((field, index) => (
                <Grid
                  item
                  xs={4}
                  key={index}
                  sx={{
                    paddingBottom: "8px !important",
                    paddingRight: "8px !important",
                    marginBottom: "8px !important",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Roboto, Arial, sans-serif !important",
                      fontWeight: "500 !important",
                      color: "#757575 !important",
                      marginBottom: "8px !important",
                    }}
                  >
                    {field.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Arial, sans-serif !important",
                      fontWeight: "400 !important",
                      color: "#000 !important",
                    }}
                  >
                    {field.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
          {/* invoice details */}
          <Box mt={3}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: "black !important",
                paddingRight: "16px !important",
                paddingLeft: "32px !important",
                letterSpacing: "2px",
              }}
            >
              Invoice Details
            </Typography>
            <TableContainer
              component={Paper}
              style={{
                borderRadius: "8px",
                width: "100%",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <Table style={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow
                    sx={{
                      background: "linear-gradient(to right, #6a11cb, #2575fc) ",
                    }}
                    // style={{
                    //   background: "linear-gradient(to right, #6a11cb, #2575fc)",
                    //   color: "#333",
                    //   borderRadius: "8px",
                    //   display: "flex",
                    //   color: "white",
                    // }}
                  >
                    {["Order ID", "Invoice ID", "Invoice Number", "Invoice Date"].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          textAlign: "left",
                          color: "white !important",
                          width: "500px !important",
                          fontWeight: "bold",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice, index) => (
                    <TableRow key={index} hover>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {order.orderId}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {invoice.invoiceId}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          maxWidth: "25%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box mt={3}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: "black !important",
                paddingRight: "16px !important",
                paddingLeft: "32px !important",
                letterSpacing: "2px",
              }}
            >
              Payment Details
            </Typography>
            <TableContainer
              component={Paper}
              style={{
                borderRadius: "8px",
                width: "100%",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <Table style={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow
                    sx={{
                      background: "linear-gradient(to right, #6a11cb, #2575fc) ",
                    }}
                  >
                    {[
                      "Order ID",
                      "Payment Type",
                      "Payment Method",
                      "Payment Date",
                      "Amount Received",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          textAlign: "left",
                          color: "white !important",
                          width: "500px !important",
                          fontWeight: "bold",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={index} hover>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {order.orderId}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {payment.paymentType}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {payment.paymentMethod}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          maxWidth: "25%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          maxWidth: "25%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {payment.amountReceived}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box mt={3}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: "black !important",
                paddingRight: "16px !important",
                paddingLeft: "32px !important",
                letterSpacing: "2px",
              }}
            >
              Dispatched Items
            </Typography>
            <TableContainer
              component={Paper}
              style={{
                borderRadius: "8px",
                width: "100%",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <Table style={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow
                    sx={{
                      background: "linear-gradient(to right, #6a11cb, #2575fc) ",
                    }}
                  >
                    {[
                      "Order ID",
                      "Items Dispatched",
                      "Courier Partner",
                      "Docket Number",
                      "Material Dispatched Date",
                      "Amount",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          textAlign: "left",
                          color: "white !important",
                          width: "500px !important",
                          fontWeight: "bold",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logistics.map((logistic, index) => (
                    <TableRow key={index} hover>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {order.orderId}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {logistic.itemsDispatched}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "25%",
                        }}
                      >
                        {logistic.courierPartnerDetails}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          maxWidth: "25%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {logistic.docketNumber}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          maxWidth: "25%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(logistic.materialDispatchedDate.$date).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "left",
                          maxWidth: "25%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {logistic.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        {/* below this test */}
      </Modal>
    </div>
  );
}

// Add PropTypes for validation
ViewModal.propTypes = {
  order: PropTypes.shape({
    oid: PropTypes.string.isRequired,
    orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    orderDate: PropTypes.string.isRequired,
    bookedBy: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    completionDate: PropTypes.string.isRequired,
    paymentDueDate: PropTypes.string.isRequired,
    projectHead: PropTypes.string.isRequired,
    customer: PropTypes.string.isRequired,
    address: PropTypes.string,
    billTo: PropTypes.string.isRequired,
    quotationNumber: PropTypes.string.isRequired,
    quotationDate: PropTypes.string.isRequired,
    poPiNumber: PropTypes.string.isRequired,
    poPiDate: PropTypes.string.isRequired,
    transportationCost: PropTypes.number.isRequired,
    amountWithGST: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    customerName: PropTypes.number.isRequired,
  }).isRequired,
  invoice: PropTypes.arrayOf(
    PropTypes.shape({
      orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      invoiceId: PropTypes.string,
      invoiceNumber: PropTypes.string,
      invoiceDate: PropTypes.string,
    })
  ),
};

export default ViewModal;
