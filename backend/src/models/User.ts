import { IPost } from "./Post";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  posts: IPost["_id"][];
  following: IUser["_id"][];
  liked: IPost["_id"][];
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    liked: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
