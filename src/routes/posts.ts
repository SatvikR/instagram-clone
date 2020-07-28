import Post, { IPost } from "./../models/Post";
import express, { Router, Request, Response } from "express";
import { verifyToken } from "./JWT/jwt";
import User, { IUser } from "../models/User";

const router: Router = express.Router();

router.route("/add").post(verifyToken, async (req: Request, res: Response) => {
  const owner: IPost["owner"] = req.body.uid;
  const title: IPost["title"] = req.body.title;
  const image: IPost["image"] = req.body.image;
  const likes: IPost["likes"] = 0;
  const comments: IPost["comments"] = [];

  const newPost = new Post({ owner, title, image, likes, comments });

  await newPost.save();

  await User.findById(req.body.uid)
    .then((user: IUser | null) => {
      if (user) {
        user.posts.push(newPost._id);

        user.save();
      }
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));

  res.json({ id: newPost._id });
});

router.route("/edit/:id").post(verifyToken, (req: Request, res: Response) => {
  Post.findById(req.params.id)
    .then((post: IPost | null) => {
      if (post) {
        post.title = req.body.title;
        post.image = req.body.image;

        post
          .save()
          .then(() => res.json("Post updated"))
          .catch((err: Error) => res.status(400).json(`Error: ${err}`));
      }
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

router.route("/all").get((req: Request, res: Response) => {
  Post.find().then((posts: IPost[]) => res.json(posts));
});

router.route("/").get(verifyToken, (req: Request, res: Response) => {
  User.findById(req.body.uid)
    .then((user: IUser | null) => {
      if (user) {
        const posts: IUser["posts"] = user.posts;

        Post.find({ _id: { $in: posts } })
          .then((posts: IPost[]) => res.json(posts))
          .catch((err: Error) => res.status(400).json(`Error: ${err}`));
      }
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

router.route("/:id").delete(verifyToken, (req: Request, res: Response) => {
  User.findById(req.body.uid)
    .then((user: IUser | null) => {
      if (user) {
        user.posts.splice(user.posts.indexOf(req.params.id), 1);
        user
          .save()
          .catch((err: Error) => res.status(400).json(`Error: ${err}`));
      }
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json("Post deleted"))
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

router.route("/get/:id").get(verifyToken, (req: Request, res: Response) => {
  Post.findById(req.params.id)
    .then((post: IPost | null) => res.json(post))
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

router.route("/like/:id").post(verifyToken, (req: Request, res: Response) => {
  Post.findById(req.params.id)
    .then((post: IPost | null) => {
      if (post) {
        post.likes++;
        post
          .save()
          .catch((err: Error) => res.status(400).json(`Error: ${err}`));
        User.findById(req.body.uid)
          .then((user: IUser | null) => {
            if (user) {
              user.liked.push(post._id);
              user
                .save()
                .then(() => res.json("Post liked"))
                .catch((err: Error) => res.status(400).json(`Error: ${err}`));
            }
          })
          .catch((err: Error) => res.status(400).json(`Error: ${err}`));
      }
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

router
  .route("/dislike/:id")
  .post(verifyToken, (req: Request, res: Response) => {
    Post.findById(req.params.id).then((post: IPost | null) => {
      if (post) {
        post.likes--;

        post
          .save()
          .catch((err: Error) => res.status(400).json(`Error: ${err}`));

        User.findById(req.body.uid).then((user: IUser | null) => {
          if (user) {
            user.liked.splice(user.liked.indexOf(post._id), 1);

            user
              .save()
              .then(() => res.json("Post disliked"))
              .catch((err: Error) => res.status(400).json(`Error: ${err}`));
          }
        });
      }
    });
  });

export default router;
