const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


const router = express.Router();


//inscr
router.post('/register', async(req, res) => {
    try {
        const {name, email, password } = req.body;

        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({error: 'Email already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);
        await userExists.save();

        res.status(201).json({message: 'User registered successfully'});

    } catch (error) {
        res.status(500).json({error:'Registration failed'});
    }
});

//connex
router.post('/login', async (req, res) => {
    try{
        const{email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.status(404).json({error:'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({error:'Invalid'});

        const token = jwt.sign({userId: user_id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({message:'Login successfuly', token});
    } catch (error) {
        res.status(500).json({error: 'Login failed'});
    }
});

//profil
router.get('/profile', async (req, res)=> {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({error: 'User not found'});


        res.json(user);
    } catch (error){
        res.status(500).json({error: 'Could not retreive profile'});
    }
});

module.exports = router;