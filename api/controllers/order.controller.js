import Order from '../models/order.model.js';
import { errorHandler } from '../utils/error.js';

export const createOrder = async (req, res, next) => {
  try {
    const newOrder = {
      ...req.body,
      userRef: req.user.id
    }
    const order = await Order.create(newOrder);
    return res.status(201).json(order);
  } catch (error) {
    next(error);
    console.log("**********")
    console.log(error);
    console.log("**********")
  }

};

export const deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(errorHandler(404, 'Order not found!'));
  }
  if (req.user.id !== order.userRef) {
    return next(errorHandler(401, 'You can only delete your own orders!'));
  }
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json('Order has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(errorHandler(404, 'Order not found!'));
  }
  if (req.user.id !== order.userRef) {
    return next(errorHandler(401, 'You can only update your own orders!'));
  }
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(errorHandler(404, 'Order not found!'));
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const orders = await Order.find({
      name: { $regex: searchTerm, $options: 'i' },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};