import { Document } from "mongoose";
import bcrypt from "bcrypt";
import express, { Router, Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

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
          accessToken: jwt.sign(
            { newUser },
            process.env.ACCESS_TOKEN_SECRET || "cannot find secret"
          ),
        })
      )
      .catch((err: Error) => res.status(400).json(`Error: ${err}`));
  } catch {
    res.status(500).send();
  }
});

router
  .route("/login/:username&:password")
  .get((req: Request, res: Response) => {
    try {
      User.find({ username: req.params.username })
        .then(async (users: IUser[]) => {
          if (users.length > 0) {
            const user: IUser = users[0];

            if (await bcrypt.compare(req.params.password, user.password)) {
              res.json({
                accessToken: jwt.sign(
                  { user },
                  process.env.ACCESS_TOKEN_SECRET || "cannot find secret"
                ),
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
