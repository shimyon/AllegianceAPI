/*
 * File: connect-db.js
 * Project: SME API
 * File Created: Friday, 10th June 2022 8:15:34 pm
 * Author: Ankit Gupta (ankit@akcess.dev)
 * -----
 * Last Modified: Friday, 10th June 2022 11:16:50 pm
 * Modified By: Ankit Gupta (ankit@akcess.dev)
 * -----
 * Copyright 2021 - 2022 AKcess, AKcess labs, UK
 */

const connection = require('./dynamic-db-connection')

/**
 * @description establish db connection with provided db
 * @param Express.Request req 
 * @param Express.Response res 
 * @param callback next 
 */
module.exports = async (req, res, next) => {
    try {
        req.conn = await connection(req.headers.db_name)
        return next()
    } catch (err) {
        return res.status(err.code || 400).json({ status: false, message: err.message || 'db-connection failed' })
    }
}