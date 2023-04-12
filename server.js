const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require ('./config/db')
const port = process.env.port || 5000
var cors = require('cors');
const path = require('path')
connectDB()

const app = express()

app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options("*", cors());

app.use('/static', express.static( "public/uploads"));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/master', require('./routes/masterRoutes'));

app.use(errorHandler)
app.listen(port, () => console.log(`Listening at port ${port}`))
