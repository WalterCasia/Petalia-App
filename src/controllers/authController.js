// Ruta: src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      const error = new Error('Nombre, email and password are required');
      error.status = 400;
      return next(error);
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Invalid email format');
      error.status = 400;
      return next(error);
    }

    // Password strength validation: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      const error = new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      error.status = 400;
      return next(error);
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already registered');
      error.status = 400;
      return next(error);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user (defaults to role 'usuario')
    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol: 'usuario'
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id_usuario || newUser.id, email: newUser.email, rol: newUser.rol },
      process.env.JWT_SECRET || 'supersecretjwtkeyforpetalia',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id_usuario,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      return next(error);
    }

    // Find the user
    const user = await User.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      return next(error);
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      return next(error);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id_usuario || user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'supersecretjwtkeyforpetalia',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      nombre: user.nombre, // for frontend compatibility: data.nombre
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
