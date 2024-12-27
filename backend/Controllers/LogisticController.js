const mongoose = require("mongoose");
const Order = require("../Models/orders");
const Logistic = require("../Models/logistics");
exports.createLogistics = async (req, res) => {
  try {
    const logistics = req.body;

    if (!Array.isArray(logistics)) {
      return res
        .status(400)
        .json({ message: "Expected an array of logistics entries." });
    }

    const createdLogistics = [];

    for (const logisticData of logistics) {
      const {
        orderId,
        courierPartnerDetails,
        paymentType,
        itemsDispatched,
        docketNumber,
        materialDispatchedDate,
        amount,
      } = logisticData;

      if (!orderId || !docketNumber || !materialDispatchedDate) {
        return res.status(400).json({
          message:
            "Missing required fields: orderId, docketNumber, or materialDispatchedDate.",
        });
      }

      const order = await Order.findOne({ orderId: orderId });

      if (!order) {
        return res
          .status(400)
          .json({ message: `Order with ID ${orderId} not found.` });
      }

      const newLogistic = new Logistic({
        orderId: order._id,
        itemsDispatched,
        materialDispatchedDate: new Date(materialDispatchedDate),
        courierPartnerDetails,
        docketNumber,
        paymentType,
        amount,
      });

      const savedLogistic = await newLogistic.save();
      createdLogistics.push(savedLogistic);
    }

    res.status(201).json(createdLogistics);
  } catch (err) {
    console.error("Error creating logistics entry:", err);
    res
      .status(500)
      .json({ message: "Error creating logistics entry", error: err.message });
  }
};

exports.getAllLogistics = async (req, res) => {
  try {
    const logistics = await Logistic.find().populate("orderId");
    res.status(200).json(logistics);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching logistics entries",
      error: err.message,
    });
  }
};

exports.getLogisticsByOrderId = async (req, res) => {
  const orderId = req.params.orderId;
  const isObjectId = mongoose.Types.ObjectId.isValid(orderId);

  try {
    const logistics = await Logistic.find(
      isObjectId
        ? { orderId: new mongoose.Types.ObjectId(orderId) }
        : { orderId: orderId }
    ).populate("orderId");

    if (!logistics.length) {
      return res.status(404).json({ message: "Logistics entries not found" });
    }

    res.status(200).json(logistics);
  } catch (error) {
    console.error("Error fetching logistics entries:", error);
    res.status(500).json({
      message: "Error fetching logistics entries",
      error: error.message,
    });
  }
};

exports.updateLogistics = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      orderId,
      itemsDispatched,
      materialDispatchedDate,
      courierPartnerDetails,
      docketNumber,
      paymentType,
      amount,
    } = req.body;

    const updatedLogistics = await Logistics.findByIdAndUpdate(
      id,
      {
        orderId,
        itemsDispatched,
        materialDispatchedDate,
        courierPartnerDetails,
        docketNumber,
        paymentType,
        amount,
      },
      { new: true, runValidators: true }
    );

    if (!updatedLogistics) {
      return res.status(404).json({ message: "Logistics entry not found" });
    }

    res.status(200).json(updatedLogistics);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating logistics entry", error: err.message });
  }
};

exports.deleteLogistics = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLogistics = await Logistics.findByIdAndDelete(id);

    if (!deletedLogistics) {
      return res.status(404).json({ message: "Logistics entry not found" });
    }

    res.status(200).json({
      message: "Logistics entry deleted successfully",
      deletedLogistics,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting logistics entry", error: err.message });
  }
};
