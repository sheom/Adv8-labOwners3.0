import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    labRef: {
      type: String,
      required: true,
    },
    productList: {
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

const Product = mongoose.model('Product', productSchema);

export default Product;