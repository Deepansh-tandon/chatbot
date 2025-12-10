import { createUser, findUserByPhone, validatePhoneNumber } from '../services/auth.service.js';
import { generateToken } from '../services/jwt.service.js';

export const register = async (req, res, next) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required'
      });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    const user = await createUser({ name, phone, email, address });

    const token = generateToken(user.userId, user.phone);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          userId: user.userId,
          name: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address
        },
        token
      }
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    const user = await findUserByPhone(phone);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.',
        action: 'register'
      });
    }

    const token = generateToken(user.userId, user.phone);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          userId: user.userId,
          name: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const { verifyToken } = await import('../services/jwt.service.js');
    const decoded = verifyToken(token);

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        userId: decoded.userId,
        phone: decoded.phone
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};


