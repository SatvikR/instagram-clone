import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IComment } from "./Comment";

export interface IPost extends Document {
  owner: IUser["_id"];
  image: string;
  likes: number;
  comments: IComment["_id"][];
}

const PostSchema: Schema = new Schema(
  {
    owner: { type: mongoose.Types.ObjectId, ref: "User" },
    image: { type: String, required: true },
    likes: { type: Number, required: true },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost>("Post", PostSchema);
