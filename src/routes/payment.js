const express = require("express");
const paymentRouter = express.Router(); // ✅ Fix 1: was express.router()
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorPay");
const Payment = require("../models/payment");  
const { membershipAmount } = require("../utils/constants");



paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    if (!membershipAmount[membershipType]) {
      return res.status(400).json({ message: "Invalid membership type" });
    }

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    // ✅ Save to DB FIRST
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save(); // ✅ define savedPayment first

    // ✅ THEN send response
    res.json({
      ...savedPayment.toJSON(),
      orderId:order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    return res.status(500).json({ message: "Payment creation failed", error: err.message });
  }
});
module.exports = paymentRouter;