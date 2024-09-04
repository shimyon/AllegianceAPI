const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const DbConn = require('../middleware/establish');
const protect = asyncHandler(async (req, res, next) => {
    let token

    console.log(req.headers.authorization)

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //Get token from header
            token = req.headers.authorization.split(' ')[1]

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            let Users = User(req.conn)
            //Get user from the token
            req.user = await Users.findById(decoded.id).select('-password')
            
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error("Authorization Failure!")
        }        
    }

    if(!token)
    {
        res.status(401)
        throw new Error("Authorization Failure! Token not found!")
    }
})

module.exports = { protect }