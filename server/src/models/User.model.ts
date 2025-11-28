import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  avatar?: string;
  boardIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    boardIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add index for email field
UserSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', UserSchema);
