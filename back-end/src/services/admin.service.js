import Admin from '../models/admin.model.js';
import User from '../models/user.model.js';
import Transaction from '../models/transaction.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

export const createAdminIfMissing = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const existing = await Admin.findOne({ email });
  if (!existing) {
    const hash = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hash, name: 'Admin' });
    console.log('Admin user created from env');
  }
};

export const adminLogin = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  return { token, admin };
};

export const listUsers = async (query = {}) => {
  const users = await User.find(query).select('-password').lean();
  return users;
};

export const verifyDevice = async (userId, status, rejectionReason) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const device = user.devices[0];
  if (!device) throw new Error("No device found for this user");

  device.status = status;
  device.verified = status === "APPROVED";

  if (status === "REJECTED") {
    device.rejectionReason = rejectionReason;
  }

  await user.save();
  return user;
};



export const listTransactions = async () => {
  return await Transaction.find()
      .populate("userId", "name email") 
      .sort({ createdAt: -1 }); 
};

// Dashboard stats
export const getDashboardStats = async () => {
  // Total users
  const totalUsers = await User.countDocuments();

  // Total transactions
  const totalTransactions = await Transaction.countDocuments();

  // Recent transactions (last 5)
  const recentTransactions = await Transaction.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  // Monthly statistics for the last 12 months
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 months back

  const monthlyStats = await Transaction.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Format months as "YYYY-MM"
  const formattedStats = monthlyStats.map((m) => ({
    month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
    totalAmount: m.totalAmount,
    count: m.count,
  }));

  return {
    totalUsers,
    totalTransactions,
    recentTransactions,
    monthlyStats: formattedStats,
  };
};