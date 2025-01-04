const express = require("express");
const router = express.Router();
const productController = require("../../Controllers/productControllers/ProductController");
router.post("/", productController.createProduct);
// Route for bulk product creation
router.post("/bulkProducts", productController.createProducts);
router.get("/", productController.getProducts);
router.get("/:productId", productController.getProductById);
router.put("/:productId", productController.updateProduct);
router.delete("/:productId", productController.deleteProduct);
module.exports = router;
