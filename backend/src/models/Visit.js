import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
      trim: true,
    },
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;


