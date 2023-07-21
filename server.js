const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require ('./config/db')
const port = process.env.port || 5000
var cors = require('cors');
var cookieParser = require('cookie-parser');
const path = require('path')
connectDB()

const app = express()

app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.options("*", cors());

app.use('/static', express.static( "public/uploads"));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/master', require('./routes/masterRoutes'));
app.use('/api/lead', require('./routes/leadRoute'));
app.use('/api/prospect', require('./routes/prospectRoute'));
app.use('/api/customer', require('./routes/customerRoute'));
app.use('/api/order', require('./routes/orderRoute'));
app.use('/api/quatation', require('./routes/quatationRoute'));
app.use('/api/invoice', require('./routes/invoiceRoute'));
app.use('/api/contract', require('./routes/contractRoute'));
app.use('/api/recovery', require('./routes/recoveryRoute'));
app.use('/api/support', require('./routes/supportRoute'));
app.use('/api/dashboard', require('./routes/dashboardRoute'));
app.use('/api/template', require('./routes/templateRoutes'));

app.use(errorHandler)
app.listen(port, () => console.log(`Listening at port ${port}`))
