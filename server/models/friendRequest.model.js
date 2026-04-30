const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending"
  }
}, { timestamps: true });

const friendRequestModel = mongoose.model("FriendRequest", friendRequestSchema);
module.exports = friendRequestModel;