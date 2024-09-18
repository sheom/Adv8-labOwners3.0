import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userDetails: {
      type: Object,
      required: true
    },
    uploadedFiles: {
      type: Array,
      required: true, 
    },
    selectedTests: {
      type: Array,
      required: true,
    },
    availability: {
      type: Object,
      required: true
    },
    additionalFeatures: {
      type: Object,
    },
    totalTests:{
      type: Number,
      required: true
    },
    totalPrice: {
      type: String,
      required: true,
    },
    labRef: {
      type: String,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    }, 
    
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;