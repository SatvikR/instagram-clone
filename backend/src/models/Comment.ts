import { IUser } from "./User";
import mongoose, { Document, Schema } from "mongoose";
import { IPost } from "./Post";

export interface IComment extends Document {
  owner: IUser["_id"];
  post: IPost["_id"];
  text: string;
}

const CommentSchema: Schema = new Schema(
  {
    owner: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    post: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
