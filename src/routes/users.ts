import { Document } from "mongoose";
import bcrypt from "bcrypt";
import express, { Router, Request, Response } from "express";
import User, { IUser } from "../models/User";
import Follow, { IFollow } from "../models/Follow";
import { generateToken, verifyToken } from "./JWT/jwt";

const router: Router = express.Router();

router.route("/add").post(async (req: Request, res: Response) => {
  try {
    const password: IUser["password"] = await bcrypt.hash(
      req.body.password,
      10
    );
    const username: IUser["username"] = req.body.username;

    const posts: IUser["posts"] = [],
      follows: IUser["following"] = [],
      likes: IUser["liked"] = [];

    const newUser: Document = new User({
      username,
      password,
      posts,
      follows,
      likes,
    });

    newUser
      .save()
      .then(() =>
        res.json({
          accessToken: generateToken(newUser),
        })
      )
      .catch((err: Error) => res.status(400).json(`Error: ${err}`));

    const user: IFollow["user"] = newUser._id;
    const followers: IFollow["followers"] = 0;
    const newFollow: Document = new Follow({ user, followers });

    newFollow.save();
  } catch {
    res.status(500).send();
  }
});

router.route("/follow/:id").post(verifyToken, (req: Request, res: Response) => {
  User.findById(req.body.uid)
    .then((user: IUser | null) => {
      if (user) {
        user.following.push(req.params.id);
        user
          .save()
          .catch((err: Error) => res.status(400).json(`Error: ${err}`));

        Follow.find({ user: req.params.id })
          .then((follows: IFollow[]) => {
            if (follows.length > 0) {
              const foundFollow = follows[0];

              foundFollow.followers++;
              foundFollow
                .save()
                .then(() => res.json("User followed"))
                .catch((err: Error) => res.status(400).json(`Error: ${err}`));
            }
          })
          .catch((err: Error) => res.status(400).json(`Error: ${err}`));
      }
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

router
  .route("/unfollow/:id")
  .post(verifyToken, (req: Request, res: Response) => {
    User.findById(req.body.uid)
      .then((user: IUser | null) => {
        if (user) {
          user.following.splice(user.following.indexOf(req.params.id), 1);
          user
            .save()
            .catch((err: Error) => res.status(400).json(`Error: ${err}`));

          Follow.find({ user: req.params.id }).then((follows: IFollow[]) => {
            if (follows.length > 0) {
              const foundFollow = follows[0];

              foundFollow.followers--;

              foundFollow
                .save()
                .then(() => res.json("User unfollowed"))
                .catch((err: Error) => res.status(400).json(`Error: ${err}`));
            }
          });
        }
      })
      .catch((err: Error) => res.status(400).json(`Error: ${err}`));
  });

router.route("/followers").get(verifyToken, (req: Request, res: Response) => {
  Follow.find({ user: req.body.uid })
    .then((follows: IFollow[]) => {
      if (follows.length > 0) {
        res.json(follows[0]);
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

router.route("/name/:id").get((req: Request, res: Response) => {
  User.findById(req.params.id)
    .then((user: IUser | null) => {
      if (user) {
        res.json({ username: user.username });
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

router.route("/get").get(verifyToken, (req: Request, res: Response) => {
  User.findById(req.body.uid)
    .then((user: IUser | null) => {
      res.json(user);
    })
    .catch((err: Error) => res.status(400).json(`Error: ${err}`));
});

router.route("/login").post((req: Request, res: Response) => {
  const username: IUser["username"] = req.body.username;
  const password: IUser["password"] = req.body.password;

  try {
    User.find({ username: username })
      .then(async (users: IUser[]) => {
        if (users.length > 0) {
          const user: IUser = users[0];

          if (await bcrypt.compare(password, user.password)) {
            res.json({
              accessToken: generateToken(user),
            });
          } else {
            res.status(400).json("Password incorrect");
          }
        } else {
          res.status(400).json("User not found");
        }
      })
      .catch((err: Error) => res.status(400).json(`Error: ${err}`));
  } catch {
    res.status(500).send();
  }
});

export default router;
