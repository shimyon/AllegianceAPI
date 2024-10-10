const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const DashboardModal = require('../models/dashboardModel')
const Dashboard = DashboardModal.Dashboard
const moment = require('moment');
const { sendMail } = require('../middleware/sendMail')


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
        Quatation: 0,
        Order: 0,
        Invoice: 0,
        Recovery: 0,
        Project: 0,
        Support: 0,
        Product: 0,
        Customer: 0,
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
    const { name, id, role } = req.body

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
const removeUser = asyncHandler(async (req, res) => {
    try {
        const existUser = await User.findById(req.body.id);
        if (!existUser) {
            return res.status(200).json({
                success: false,
                msg: "User not found.",
                data: null,
            });
        }

        const newUser = await User.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        return res.status(200).json({
            success: true,
            msg: "User removed. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing User. " + err.message,
            data: null,
        });
    }

});
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

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email, is_active: true }).populate("role");
    if (!user) {
        res.status(200)
        throw new Error("User Not Found!")
    }

    if ((await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role?._id,
            rolename: user.role?.Name,
            token: generateToken(user.id),
        })
    }
    else {
        res.status(401).send({ message: "Invalid credentials!" })
    }
})

const getUserById = asyncHandler(async (req, res) => {
    const { _id, name, email, role } = await User.findById(req.params.id)

    res.status(200).json({
        id: _id,
        name,
        email,
        role
    })
})

const getAllUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.find({ is_active: req.body.active }, { _id: 1, email: 1, name: 1, role: 1, is_active: 1 }).populate("role").sort({ createdAt: -1 });

        res.status(200).json(user).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting USER. " + err.message,
            data: null,
        });
    }
})
function generateRandomPassword() {
    const length = 6;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
}
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        res.status(400)
        throw new Error('email field not found!')
    }

    //check if user exist
    const userExists = await User.findOne({ email: email });
    if (!userExists) {
        res.status(400)
        throw new Error('User Not Found')
    }

    if (userExists) {
        //Hash password
        const newPassword = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        let user = await User.findByIdAndUpdate(userExists._id, {
            password: hashedPassword
        });
        if (user) {
            let html =
                `<html>Dear User,<br/><br/>Good news! Your password has been reset. Here is your new password:<br/><br/><b>New Password:</b> ${newPassword}<br/><br/>Please use this password to log in to your account. If you have any questions or concerns, feel free to reach out to our support team.<br/><br/>Best regards,<br/><b>Team Emoiss</b></html>`;
            sendMail(userExists.email, "Your New Password", html);
        }
        return res.status(201).json({
            success: true,
            msg: "Reset Password is sent to you in email"
        });
    }
    else {
        res.status(400)
        throw new Error("Invalid user data!")
    }
})

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
    getAllUser,
    forgotPassword,
    removeUser
}