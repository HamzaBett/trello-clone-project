import mongoose, { Document, Schema } from 'mongoose';

export interface IList extends Document {
  title: string;
  boardId: mongoose.Types.ObjectId;
  cardIds: mongoose.Types.ObjectId[];
  position: number;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    cardIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
    position: {
      type: Number,
      required: true,
      default: 0,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for frequently queried fields
ListSchema.index({ boardId: 1 });
ListSchema.index({ position: 1 });

export default mongoose.model<IList>('List', ListSchema);
