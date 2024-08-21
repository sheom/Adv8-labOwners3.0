import Lab from '../models/lab.model.js';
import { errorHandler } from '../utils/error.js';

export const createLab = async (req, res, next) => {
  //role check
  console.log("req.user.role: "+req.user.role)
  if (req.user.role !== 1) {
    return next(errorHandler(401, 'Register as a lab owner to create a lab!'));
  }
  console.log("**********")
  console.log(req.body);
  console.log("**********")
  try {
    const lab = await Lab.create(req.body);
    //console.log(lab.json)
    return res.status(201).json(lab);
  } catch (error) {
    next(error);
    console.log("**********")
    console.log(error);
    console.log("**********")
  }

};

export const deleteLab = async (req, res, next) => {
  const lab = await Lab.findById(req.params.id);

  if (!lab) {
    return next(errorHandler(404, 'Lab not found!'));
  }

  if (req.user.id !== lab.userRef) {
    return next(errorHandler(401, 'You can only delete your own labs!'));
  }

  try {
    await Lab.findByIdAndDelete(req.params.id);
    res.status(200).json('Lab has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateLab = async (req, res, next) => {
  const lab = await Lab.findById(req.params.id);
  if (!lab) {
    return next(errorHandler(404, 'Lab not found!'));
  }
  if (req.user.id !== lab.userRef) {
    return next(errorHandler(401, 'You can only update your own labs!'));
  }

  try {
    const updatedLab = await Lab.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedLab);
  } catch (error) {
    next(error);
  }
};

export const getLab = async (req, res, next) => {
  try {
    const lab = await lab.findById(req.params.id);
    if (!lab) {
      return next(errorHandler(404, 'Lab not found!'));
    }
    res.status(200).json(lab);
    console.log("************************************")
    console.log(lab)
  } catch (error) {
    next(error);
  }
};

export const getLabs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';
    const labs = await Lab.find()
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

      console.log("******************************************")
      console.log(labs)
      console.log("******************************************")
    return res.status(200).json(labs);
    
  } catch (error) {
    next(error);
  }
};
