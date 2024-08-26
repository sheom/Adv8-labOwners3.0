import mongoose from 'mongoose';

const labSchema = new mongoose.Schema(
  {
    labName: {
      type: String,
      required: true,
    },
    labAddress:{
      type: String,
      required: true,
    },
    labState:{
      type: String,
      required: true,
    },
    labCity:{
      type: String,
      required: true,
    },
    labPin:{
      type: String,
      required: true,
    },
    labLatLong:{
      type: String,
      required: true,
    },
    labPhoneNumber:{
      type: String,
      required: true,
    },
    labEmail:{
      type: String,
      required: true,
    },
    labWebsite: {
      type: String,
    },
    labOperatingDays: {
      type: Array,
      required: true,
    },
    labOpeningTime:{
      type: String,
      required: true,
    },
    labClosingTime:{
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    ownerRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Lab = mongoose.model('Lab', labSchema);

export default Lab;