const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    notes: {
      firstName: { type: String },
      lastName: { type: String },
      membershipType: { type: String },
      emailId: { type: String },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("payment", paymentSchema);
