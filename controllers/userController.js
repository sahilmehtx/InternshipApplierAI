const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    const { name, email, password, skills, interests } = req.body;
    try {
        const user = new User({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            skills,
            interests,
        });
        await user.save();
        res.status(201).json({ 
            message: 'User registered successfully',
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
            res.status(200).json({ 
                message: 'Login successful',
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
