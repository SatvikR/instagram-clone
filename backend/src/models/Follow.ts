import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IFollow extends Document {
  user: IUser["_id"];
  followers: number;
}

const FollowSchema: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true },
    followers: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFollow>("Follow", FollowSchema);
