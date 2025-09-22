import mongoose, { Document, Schema } from 'mongoose';

export interface IComplaint extends Document {
  title: string;
  description: string;
  category: 'Service' | 'Product' | 'Billing' | 'Technical' | 'Other';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  dateSubmitted: Date;
  email?: string;
  customerName?: string;
  userId?: mongoose.Types.ObjectId;
}

const ComplaintSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the complaint'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the complaint'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: ['Service', 'Product', 'Billing', 'Technical', 'Other'],
      message: 'Please select a valid category'
    }
  },
  priority: {
    type: String,
    required: [true, 'Please select a priority level'],
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Please select a valid priority level'
    }
  },
  status: {
    type: String,
    default: 'Pending',
    enum: {
      values: ['Pending', 'In Progress', 'Resolved', 'Closed'],
      message: 'Please select a valid status'
    }
  },
  dateSubmitted: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  customerName: {
    type: String,
    trim: true,
    maxlength: [100, 'Customer name cannot be more than 100 characters']
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ priority: 1 });
ComplaintSchema.index({ category: 1 });
ComplaintSchema.index({ dateSubmitted: -1 });
ComplaintSchema.index({ userId: 1 });

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
