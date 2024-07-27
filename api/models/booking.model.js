import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pin_code: {
      type: String,
      required: true,
    },
    contact_no: {
      type: String,
      required: true,
    },
    contact_email: {
      type: String,
      required: false,
    },
    booking_date: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    bookedUserName: {
      type: String,
      required: true,
    },
    labRef: {
      type: String,
      required: true,
    },
    labName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;