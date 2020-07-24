import { IUser } from "./User";
import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  owner: IUser["_id"];
  text: string;
}

const CommentSchema: Schema = new Schema(
  {
    owner: { type: mongoose.Types.ObjectId, required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
