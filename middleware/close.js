/*
 * File: close.js
 * Project: SME API
 * File Created: Friday, 10th June 2022 11:16:19 pm
 * Author: Ankit Gupta (ankit@akcess.dev)
 * -----
 * Last Modified: Friday, 10th June 2022 11:16:34 pm
 * Modified By: Ankit Gupta (ankit@akcess.dev)
 * -----
 * Copyright 2021 - 2022 AKcess, AKcess labs, UK
 */

module.exports = (req) => {
    // check for connection and close if exists
    if (req.conn)
        req.conn.close()
}