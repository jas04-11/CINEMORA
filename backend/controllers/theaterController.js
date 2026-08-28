import Theater from "../models/Theater.js";

export const listTheaters = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.city) filter.city = { $regex: req.query.city, $options: "i" };
    const theaters = await Theater.find(filter).sort({ name: 1 });
    res.json(theaters);
  } catch (err) {
    next(err);
  }
};

export const getTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) return res.status(404).json({ message: "Theater not found" });
    res.json(theater);
  } catch (err) {
    next(err);
  }
};

export const createTheater = async (req, res, next) => {
  try {
    const theater = await Theater.create(req.body);
    res.status(201).json(theater);
  } catch (err) {
    next(err);
  }
};

export const updateTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!theater) return res.status(404).json({ message: "Theater not found" });
    res.json(theater);
  } catch (err) {
    next(err);
  }
};

export const deleteTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (!theater) return res.status(404).json({ message: "Theater not found" });
    res.json({ message: "Theater removed" });
  } catch (err) {
    next(err);
  }
};
