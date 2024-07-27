import Booking from '../models/booking.model.js';
import { errorHandler } from '../utils/error.js';

export const createBooking = async (req, res, next) => {
  console.log("**********")
  console.log(req.body);
  console.log("**********")
  try {
    const booking = await Booking.create(req.body);
    console.log(booking.json)
    return res.status(201).json(booking);
  } catch (error) {
    next(error);
    console.log("**********")
    console.log(error);
    console.log("**********")
  }

};

export const deleteBooking = async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(errorHandler(404, 'Booking not found!'));
  }

  if (req.user.id !== booking.userRef) {
    return next(errorHandler(401, 'You can only delete your own bookings!'));
  }

  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json('Booking has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(errorHandler(404, 'Booking not found!'));
  }
  if (req.user.id !== booking.userRef) {
    return next(errorHandler(401, 'You can only update your own bookings!'));
  }

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(errorHandler(404, 'Booking not found!'));
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // let nabh = req.query.nabh;

    // if (nabh === undefined || nabh === 'false') {
    //   nabh = { $in: [false, true] };
    // }

    // let type = req.query.type;

    // if (type === undefined || type === 'all') {
    //   type = { $in: ['lab', 'doc'] };
    // }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const bookings = await Booking.find({
      name: { $regex: searchTerm, $options: 'i' },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};
