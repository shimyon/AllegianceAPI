const mongoose = require('mongoose')

module.exports = async (DB_NAME) => {
    const connectionString = process.env.DB_URI + process.env.DB_PREFIX + DB_NAME;
    const conn = await mongoose.createConnection(connectionString);

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