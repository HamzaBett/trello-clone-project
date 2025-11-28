import mongoose, { Document, Schema } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description?: string;
  listId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  position: number;
  labels: Array<{
    name: string;
    color: string;
  }>;
  dueDate?: Date;
  assignedMembers: mongoose.Types.ObjectId[];
  attachments: Array<{
    url: string;
    fileName: string;
    size: number;
    uploadedAt: Date;
  }>;
  checklists: Array<{
    title: string;
    items: Array<{
      text: string;
      completed: boolean;
    }>;
  }>;
  comments: Array<{
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }>;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
      required: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    position: {
      type: Number,
      required: true,
      default: 0,
    },
    labels: [
      {
        name: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    dueDate: {
      type: Date,
    },
    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        fileName: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    checklists: [
      {
        title: {
          type: String,
          required: true,
        },
        items: [
          {
            text: {
              type: String,
              required: true,
            },
            completed: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
CardSchema.index({ listId: 1 });
CardSchema.index({ boardId: 1 });
CardSchema.index({ assignedMembers: 1 });

export default mongoose.model<ICard>('Card', CardSchema);
