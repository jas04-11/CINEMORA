import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
});

// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, phone, role: "user" });
    return res.status(201).json({
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.json({
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
export const me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};
