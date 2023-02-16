const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const postSchema = mongoose.Schema(
  {
    user: { type: String, require: true },
    title: { type: String, require: true },
    content: { type: String, require: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
