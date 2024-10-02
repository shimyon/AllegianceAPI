const mongoose = require('mongoose')

module.exports = async (DB_NAME) => {
    let databasename = process.env.DB_PREFIX + DB_NAME;
    let connstr = process.env.DB_URI;
    if (connstr.indexOf('?') > 0) {
        let connstrarr = connstr.split('?');
        connstr = connstrarr[0] + databasename + '?' + connstrarr[1];
    } else {
        connstr += process.env.DB_PREFIX + DB_NAME;
    }
    const conn = await mongoose.createConnection(connstr);

    mongoose.connection.on('connected', () => {
        console.info(`mongoose successfully connected with DB: ${DB_NAME}`);
    });

    mongoose.connection.on('error', (err) => {
        console.error(`mongodb connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.info(`DB successfully dis-connected: ${DB_NAME}`);
    });

    return conn
}