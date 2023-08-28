const { default: mongoose } = require('mongoose')
const moongose = require('mongoose')
const connectDB = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI)
            console.log(`Mongo DB Connected ${conn.connection.host}`.cyan.underline)
            resolve();
        } catch (error) {
            console.log(error)
            reject(error);
            process.exit(1)
        }
    });
}

module.exports = connectDB