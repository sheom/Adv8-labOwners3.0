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
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return next(errorHandler(404, 'Lab not found!'));
    }
    res.status(200).json(lab);
  } catch (error) {
    next(error);
  }
};

export const getLabs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let nabl = req.query.nabl;

    if (nabl === undefined || nabl === 'false') {
      nabl = { $in: [false, true] };
    }

    let nabh = req.query.nabh;

    if (nabh === undefined || nabh === 'false') {
      nabh = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['lab', 'doc'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const labs = await Lab.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      nabl,
      nabh,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(labs);
  } catch (error) {
    next(error);
  }
};
