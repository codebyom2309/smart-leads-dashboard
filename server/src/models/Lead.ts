import mongoose, { Document, Schema, Types } from 'mongoose';
import { LeadStatus, LeadSource } from '../types';

interface LeadDocRet {
  __v?: number;
  [key: string]: unknown;
}

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  phone?: string;
  company?: string;
  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[],
      default: 'New',
      required: true,
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'] as LeadSource[],
      required: [true, 'Lead source is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone cannot exceed 20 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [150, 'Company cannot exceed 150 characters'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: unknown, ret: LeadDocRet) {
        if ('__v' in ret) ret.__v = undefined;
        return ret;
      },
    },
  }
);

// Compound index for search performance
leadSchema.index({ name: 'text', email: 'text', company: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, source: 1, createdAt: -1 });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
