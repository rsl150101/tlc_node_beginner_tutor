const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const commentShcema = mongoose.Schema(
  {
    user: { type: String, required: true },
    content: { type: String, required: true },
    password: { type: String, required: true },
    postId: { type: ObjectId, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentShcema);
