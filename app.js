const express = require("express");
const mongoose = require("mongoose");

const postRouter = require("./routes/posts.routes");
const commentRouter = require("./routes/comments.routes");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/sparta_posts");
const db = mongoose.connection;

db.on("error", (err) => console.log(err));
db.once("open", () => console.log("✅ DB가 연결되었습니다!"));

app.use(express.json());
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.listen(PORT, () => {
  console.log(`✅ 서버가 연결되었습니다! http://localhost:${PORT}`);
});
