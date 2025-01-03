import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Modal, Box, Typography, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

function ViewPaymentsModal({ payment }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "white",
        }}
      >
        View
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2">
              Invoice Details
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Order ID:</strong> {payment.id}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Payment ID:</strong> {payment.invoiceId}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Payment Type:</strong> {payment.paymentType}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Payment Date:</strong> {payment.paymentDate}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Payment Method:</strong> {payment.paymentMethod}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Amount Received:</strong> {payment.amountReceived}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Notes:</strong> {payment.notes}
              </Typography>
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleClose}
              style={{ background: "#6a11cb", color: "white" }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

// Add PropTypes validation
ViewPaymentsModal.propTypes = {
  payment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    invoiceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    paymentType: PropTypes.string.isRequired,
    paymentDate: PropTypes.string.isRequired, // Should ideally be a valid ISO date string
    paymentMethod: PropTypes.string.isRequired,
    amountReceived: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    notes: PropTypes.string, // Optional field
  }).isRequired,
};

export default ViewPaymentsModal;
