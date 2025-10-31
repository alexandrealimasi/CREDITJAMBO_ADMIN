import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { adminAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import Joi from 'joi';

const router = express.Router();

const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
const verifySchema = Joi.object({
  userId: Joi.string().required(),
  status: Joi.string().required(),
  rejectionReason: Joi.string().allow(null, "")
});


router.post('/login', validate(loginSchema), adminController.login);
router.get('/users', adminAuth, adminController.getUsers);
router.post('/users/verify', adminAuth, validate(verifySchema), adminController.verifyDevice);
router.get('/transactions', adminAuth, adminController.getTransactions);
router.get('/dashboard',adminAuth,adminController.getDashboardStats);

export default router;
