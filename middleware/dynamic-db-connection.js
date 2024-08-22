const conn = require('../config/custom-conn')

/**
 * @description establish DB connection
 * @param String DB_NAME 
 * @returns mongoose.connection
 */
module.exports = (DB_NAME) => {
    return new Promise((resolve, reject) => {
        conn(DB_NAME).then(db =>{
            console.log("db",db)
            resolve(db)
        }).catch(err => {
            return reject({ code: 502, message: err })
        })
    })
}