import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../models/admin.model.js';
dotenv.config();

export const adminAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id).select('-password');
    if (!admin) return res.status(401).json({ message: 'Unauthorized' });
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
