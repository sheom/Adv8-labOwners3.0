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
    phoneNumber:{
      type: String,
      required: true,
    },
    email:{
      type: String,
      required: true,
    },
    web_site: {
      type: String,
    },
    operatingDays: {
      type: Array,
      required: true,
    },
    availableTimeSlots: {
      type: Array,
      required: true,
    },
    labImages:{
      type: String
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Lab = mongoose.model('Lab', labSchema);

export default Lab;