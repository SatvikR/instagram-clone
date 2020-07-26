import { Document } from "mongoose";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const generateToken = (user: Document): string => {
  const secret: string = process.env.ACCESS_TOKEN_SECRET || "secret not found";

  const token: string = jwt.sign({ id: user._id }, secret);
  return token;
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "secret not found",
    (err, user: any) => {
      if (err) return res.sendStatus(403);
      req.body.uid = user.id;
      next();
    }
  );
};
