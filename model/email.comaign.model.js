const mongoose = require("mongoose");

const CompaignSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true,
  },
  subject: {
    type: String,
    required: true,
  },
  recipients: [
    {
      type: String,
      required: true,
    },
  ],
  emailContent: {
    type: String,
    required: true,
  },
  totalEmailsSent: {
    type: Number,
  },
  deliverySuccess: { type: Number, default: 0 },
  deliveryFailed: { type: Number, default: 0 },
  openRate: { type: Number, default: 0 },
  clickRate: { type: Number, default: 0 },
  scheduledAt: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Compaign = mongoose.model("Compaign", CompaignSchema);

module.exports = Compaign;
