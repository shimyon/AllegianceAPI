const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const DashboardModal = require('../models/dashboardModel')
const Dashboard = DashboardModal.Dashboard
const moment = require('moment');
//@desc Register New User
//@route POST api/user
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
        res.status(400)
        throw new Error('Name, Email, Password and Role  fields are required!')
    }

    //check if user exist
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User Already Exists!')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        name,
        email,
        role,
        password: hashedPassword,
        is_active: true

    })
    await Dashboard.create({
        Lead: 0,
        Prospect: 0,
        Support: 0,
        Recovery: 0,
        Product:0,
        Customer:0,
        Project: 0,
        Order: 0,
        UserId: user.id
    });
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { name, id, role, active } = req.body

    if (!name || !role) {
        res.status(400)
        throw new Error('Name and Role  fields are required!')
    }
    if (!id) {
        res.status(400)
        throw new Error('User id not found!')
    }

    //check if user exist
    const userExists = await User.findOne({ _id: id });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }

    let user = await User.findByIdAndUpdate(id, {
        name: name,
        role: role,
        is_active: active
    });
    user = await User.findOne({ _id: id });
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const { id, currentPassword, newPassword } = req.body

    if (!id || !currentPassword || !newPassword) {
        res.status(400)
        throw new Error('id, current password and new password field not found!')
    }

    //check if user exist
    const userExists = await User.findOne({ _id: id });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }

    let user = await User.findOne({ _id: id });
    if (user) {
        if ((await bcrypt.compare(currentPassword, user.password))) {
            //Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await User.findByIdAndUpdate(id, {
                password: hashedPassword
            });
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            })
        }
        else {
            res.status(400)
            throw new Error("Wrong Current Password!")
        }
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})

//@desc Authenticate a User
//@route POST api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email, is_active: true })
    if (!user) {
        res.status(200)
        throw new Error("User Not Found!")
    }

    if ((await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(401)
        throw new Error("Invalid credentials!")
    }
})


//@desc Get User Data
//@route POST api/users/me
//@access Private
const getUserById = asyncHandler(async (req, res) => {
    const { _id, name, email,role,is_active } = await User.findById(req.params.id)

    res.status(200).json({
        id: _id,
        name,
        email,
        role,
        is_active
    })
})

//@desc Get User Data
//@route POST api/users/me
//@access Private
const getManager = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ role: new RegExp("manager", 'i'), is_active: true },{_id:1,email:1,name:1,role:1});

        res.status(200).json(user).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting manager. " + err.message,
            data: null,
        });
    }
})

//@desc Get User Data
//@route POST api/users/me
//@access Private
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.find({ is_active: req.body.active },{_id:1,email:1,name:1,role:1}).sort({ createdAt: -1 });

        res.status(200).json(user).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting USER. " + err.message,
            data: null,
        });
    }
})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    changePassword,
    getManager,
    getAllUser
}