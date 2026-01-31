const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//ConnectionRequest.find({fromUserId: d4859846356486367895, toUserId: 8u9457576857})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });


connectionRequestSchema.pre("save", function (next) {
     const connectionRequest = this;
     //check if fromUserId and toUserId are the same
     if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
         return next(new Error("fromUserId and toUserId cannot be the same"));
     }
      next();
  });

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;