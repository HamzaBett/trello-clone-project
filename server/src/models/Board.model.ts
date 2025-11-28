import mongoose, { Document, Schema } from 'mongoose';

export interface IBoard extends Document {
  title: string;
  description?: string;
  background?: string;
  ownerId: mongoose.Types.ObjectId;
  memberIds: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'owner' | 'editor' | 'viewer';
  }>;
  listIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  lastViewedAt: Date;
}

const BoardSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    background: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    memberIds: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['owner', 'editor', 'viewer'],
          default: 'viewer',
        },
      },
    ],
    listIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
      },
    ],
    lastViewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for frequently queried fields
BoardSchema.index({ ownerId: 1 });
BoardSchema.index({ 'memberIds.userId': 1 });

export default mongoose.model<IBoard>('Board', BoardSchema);
