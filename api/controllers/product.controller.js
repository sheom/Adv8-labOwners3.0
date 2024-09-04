import Product from '../models/product.model.js';
import { errorHandler } from '../utils/error.js';

export const createProduct = async (req, res, next) => {
  try {
    const newProduct = {
      userRef: req.user? req.user.id:"",
      ...req.body
    };
    //const product = await Product.create(req.body);
    // check if productlist is laready there for the labID
    const oldLabProduct = await Product.find({ labRef: req.body.labRef });
    // console.log("#############################################")
    // console.log(oldLabProduct.length)
    // console.log("#################################################")
    if(oldLabProduct.length == 0){
      const product = await Product.create(newProduct);
      return res.status(201).json(product);
    }else{
      return next(errorHandler(401, 'Products are already added for this lab, please use edit option to update it!'));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(errorHandler(404, 'Product not found!'));
  }

  if (req.user.id !== product.userRef) {
    return next(errorHandler(401, 'You can only delete your own products!'));
  }

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json('Product has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(errorHandler(404, 'Product not found!'));
  }
  if (req.user.id !== product.userRef) {
    return next(errorHandler(401, 'You can only update your own products!'));
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(errorHandler(404, 'Product not found!'));
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const products = await Product.find({
      name: { $regex: searchTerm, $options: 'i' },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
