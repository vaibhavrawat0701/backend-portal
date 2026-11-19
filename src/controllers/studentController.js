const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Student } = require('../models/Student');

// POST /api/students/signup
const signup = async (req, res) => {
  try {
    const { name, email, studentId, password, preferredClub } = req.body;

    // Check for duplicate email
    const existingEmail = await Student.findOne({
      email: email.trim().toLowerCase(),
    });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Check for duplicate student ID
    const existingStudentId = await Student.findOne({
      studentId: studentId.trim(),
    });
    if (existingStudentId) {
      return res.status(409).json({
        success: false,
        message: 'An account with this student ID already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student
    const student = await Student.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      studentId: studentId.trim(),
      password: hashedPassword,
      preferredClub: preferredClub.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully.',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        preferredClub: student.preferredClub,
        registrationDate: student.registrationDate,
      },
    });
  } catch (error) {
    // Handle Mongoose duplicate key errors that slip past the manual checks
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const label = field === 'studentId' ? 'student ID' : field;
      return res.status(409).json({
        success: false,
        message: `An account with this ${label} already exists.`,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred. Please try again later.',
    });
  }
};

// POST /api/students/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        preferredClub: student.preferredClub,
        registrationDate: student.registrationDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred. Please try again later.',
    });
  }
};

// GET /api/students/profile
const getProfile = async (req, res) => {
  try {
    // The auth middleware attaches the decoded token payload to req.student
    const student = await Student.findById(req.student.id).select('-password');
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Student not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        preferredClub: student.preferredClub,
        registrationDate: student.registrationDate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred. Please try again later.',
    });
  }
};

module.exports = { signup, login, getProfile };
