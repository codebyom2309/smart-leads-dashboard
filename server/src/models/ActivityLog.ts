import mongoose, { Document, Schema, Types } from 'mongoose';

interface ActivityLogRet {
  __v?: number;
  [key: string]: unknown;
}

type ActionType = 'created' | 'updated' | 'deleted';
type EntityType = 'lead' | 'user';

export interface IActivityLog extends Document {
  action: ActionType;
  entityType: EntityType;
  entityId: Types.ObjectId;
  userId: Types.ObjectId;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      enum: ['created', 'updated', 'deleted'] as ActionType[],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['lead', 'user'] as EntityType[],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changes: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_doc: unknown, ret: ActivityLogRet) {
        if ('__v' in ret) ret.__v = undefined;
        return ret;
      },
    },
  }
);

activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });
activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
