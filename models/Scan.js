const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scanSchema = new Schema({
  name: String,
  path: String,
  labels: [{
    description:String,
    score:Number
  }],
  user: { type: Schema.Types.ObjectId, ref: "User" }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Scan = mongoose.model("Scan", scanSchema);

module.exports = Scan;