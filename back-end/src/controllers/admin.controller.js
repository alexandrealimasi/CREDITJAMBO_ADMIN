import * as adminService from '../services/admin.service.js';
import { toUserDTO } from '../dtos/user.dto.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, admin } = await adminService.adminLogin(email, password);
    return res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.listUsers();
    return res.json(users.map(toUserDTO));
  } catch (err) {
    next(err);
  }
};

export const verifyDevice = async (req, res, next) => {
  try {
    const { userId, status, rejectionReason } = req.body;
    

    const user = await adminService.verifyDevice(
      userId, 
      status, 
      rejectionReason || null
    );

    return res.json(toUserDTO(user));
  } catch (err) {
    next(err);
  }
};


export const getTransactions = async (req, res, next) => {
  try {
    const tx = await adminService.listTransactions();
    return res.json(tx);
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats =async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}