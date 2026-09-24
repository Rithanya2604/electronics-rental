const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
const tokenFor = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const safeUser = user => ({ id:user._id, name:user.name, email:user.email, phone:user.phone, role:user.role });

router.post('/register', async (req,res) => {
  try {
    const { name,email,phone,password } = req.body;
    if (!name || !email || !phone || !password) return res.status(400).json({message:'All fields are required'});
    if (password.length < 6) return res.status(400).json({message:'Password must be at least 6 characters'});
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({message:'An account with this email already exists'});
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email:email.toLowerCase(), phone, password:hash });
    res.status(201).json({ message:'Account created successfully', token:tokenFor(user), user:safeUser(user) });
  } catch (e) { res.status(500).json({message:'Registration failed'}); }
});

router.post('/login', async (req,res) => {
  try {
    const { email,password } = req.body;
    const user = await User.findOne({email:String(email||'').toLowerCase()});
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({message:'Invalid email or password'});
    res.json({message:'Login successful', token:tokenFor(user), user:safeUser(user)});
  } catch (e) { res.status(500).json({message:'Login failed'}); }
});

router.get('/me', protect, async (req,res) => res.json({user:safeUser(req.user)}));
module.exports = router;
