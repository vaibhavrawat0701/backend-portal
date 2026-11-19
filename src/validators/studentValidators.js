const { body } = require('express-validator');
const { AVAILABLE_CLUBS } = require('../models/Student');

const signupValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 3 })
    .withMessage('Name must contain at least 3 characters.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .custom((value) => {
      if (!value.toLowerCase().endsWith('@university.edu')) {
        throw new Error('Email must end with @university.edu.');
      }
      return true;
    }),

  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID is required.')
    .isLength({ min: 6, max: 12 })
    .withMessage('Student ID must be between 6 and 12 characters.'),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must contain at least 8 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.'),

  body('preferredClub')
    .trim()
    .notEmpty()
    .withMessage('Preferred club is required.')
    .isIn(AVAILABLE_CLUBS)
    .withMessage(
      `Preferred club must be one of: ${AVAILABLE_CLUBS.join(', ')}.`
    ),
];

const loginValidators = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.'),

  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

module.exports = { signupValidators, loginValidators };
