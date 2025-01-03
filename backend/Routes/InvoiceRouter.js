const express = require("express");
const router = express.Router();
const invoiceController = require("../Controllers/InvoiceController");

router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.getInvoices);
// router.get("/:id", invoiceController.getInvoiceById);

router.get("/:orderId", invoiceController.getInvoiceByOrderId);
router.put("/:id", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
