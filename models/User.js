const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  password: { type: String, required: true },
  scan: [{ type: Schema.Types.ObjectId, ref: "Scan" }],
  profileImg: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;
