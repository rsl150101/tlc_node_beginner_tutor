const express = require("express");
const router = express.Router();
const Post = require("../schema/Post");

//* 모든 게시글 가져오기
router.get("/", async (req, res) => {
  try {
    //+ 모든 게시글 찾기
    const posts = await Post.find({}).select(["-password"]);
    //- select 를 통해 지정해서 볼수 있는데 (-) 연산자를 통해 지정 데이터를 빼고 볼 수도 있다.
    return res.json({ data: posts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//* 게시글 등록하기
router.post("/", async (req, res) => {
  const { user, title, content, password } = req.body;
  try {
    const post = await Post.create({
      user,
      title,
      content,
      password,
    });
    return res.json({ data: post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//* 해당 게시글 가져오기
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  //+ id 예외 처리
  //   if (!id) {
  //     return res.json({ message: "데이터 형식이 올바르지 않습니다." });
  //   }
  //- 데이터베이스에서 자체적으로 id 가 올바르지 않으면 예외 처리를 해주어서 불필요하다.

  try {
    const post = await Post.findById(id).select(["-password"]);
    res.json({ data: post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//* 해당 게시글 수정하기
router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  //+ id 또는 body 에 데이터 형식이 올바르지 않을 때 예외처리
  if (!req.body || !id) {
    return res.json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const { user, title, content, password } = req.body;

  const post = await Post.findById(id);

  //+ 해당 게시글이 없을 때 예외처리
  if (!post) {
    return res.json({ message: "게시글 조회에 실패하였습니다." });
  }

  //+ 비밀번호 일치 boolean
  const isPasswordCorrect = post.password === password;

  if (isPasswordCorrect) {
    if (user) {
      post.user = user;
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }
    try {
      const updatePost = await post.save();
      return res.json({ data: updatePost });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }
});

//* 해당 게시글 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  //+ id 또는 body 에 데이터 형식이 올바르지 않을 때 예외처리
  if (!req.body || !id) {
    return res.json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const post = await Post.findById(id);

  //+ 해당 게시글이 없을 때 예외처리
  if (!post) {
    return res.json({ message: "게시글 조회에 실패하였습니다." });
  }

  //+ 비밀번호 일치 boolean
  const isPasswordCorrect = post.password === password;

  if (isPasswordCorrect) {
    try {
      await post.remove();
      return res.json({ message: " 게시글을 삭제하였습니다." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }
});

module.exports = router;
