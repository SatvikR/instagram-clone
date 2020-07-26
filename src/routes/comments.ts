import express, { Router, Request, Response } from "express";
import { verifyToken } from "./JWT/jwt";
import Comment, { IComment } from "../models/Comment";
import Post, { IPost } from "../models/Post";

const router: Router = express.Router();

router.route("/add").post(verifyToken, (req: Request, res: Response) => {
  const owner: IComment["owner"] = req.body.uid;
  const post: IComment["post"] = req.body.post;
  const text: IComment["text"] = req.body.text;

  const newComment = new Comment({ owner, post, text });

  Post.findById(post)
    .then((post: IPost | null) => {
      if (post) {
        post.comments.push(newComment._id);
        post.save();
      }
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));

  newComment
    .save()
    .then((comment: IComment) => res.json({ id: comment._id }))
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

export default router;
