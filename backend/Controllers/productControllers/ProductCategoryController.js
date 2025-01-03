const Product = require("../../Models/productModels/products");
const mongoose = require("mongoose");

// const ProductCategories = require("../../Models/productModels/productCategories");

const ProductCategories = require("../../Models/productModels/productCategories");

exports.addProductCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const newCategory = new ProductCategories({
      categoryName,
      categoryDescription,
    });

    await newCategory.save();

    res.status(201).json({
      message: "Category added successfully!",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({
      message: "An error occurred while adding the category.",
    });
  }
};

// res.status(200).json(customer);
exports.getAllProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategories.find({});
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "An error occurred while fetching the categories.",
    });
  }
};
