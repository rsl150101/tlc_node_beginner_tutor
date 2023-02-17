const express = require("express");
const router = express.Router();
const Comment = require("../schema/Comment");

//* 모든 댓글 가져오기
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find({}).select(["-password"]);
    return res.json({ data: comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//* 댓글 작성하기
router.post("/:postId", async (req, res) => {
  const { postId } = req.params;

  if (!req.body) {
    return res.json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const { user, content, password } = req.body;

  try {
    const comment = await Comment.create({
      user,
      content,
      password,
      postId,
    });
    return res.json({ data: comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//* 해당 게시물 댓글 조회
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId }).select([
      "-password",
      "-_id",
      "-__v",
    ]);
    return res.json({ data: comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//* 댓글 수정
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, password } = req.body;

  const comment = await Comment.findById(id);

  if (!comment) {
    return res.json({ message: "해당 댓글이 없습니다." });
  }

  const isPasswordCorrect = comment.password === password;

  if (isPasswordCorrect) {
    if (content) {
      comment.content = content;
    }
    try {
      const updateComment = await comment.save();
      return res.json({ data: updateComment });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }
});

//* 댓글 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const comment = await Comment.findById(id);

  if (!comment) {
    return res.json({ message: "해당 댓글이 없습니다." });
  }

  const isPasswordCorrect = comment.password === password;

  if (isPasswordCorrect) {
    try {
      await comment.remove();
      return res.json({ message: "댓글이 삭제되었습니다." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }
});

module.exports = router;
