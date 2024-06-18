require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const resourceRouter = require('./components/resource/resource-router')
const userRouter = require('./components/user/user-router')
const testRouter = require('./components/test/test-router')
const upgradeRouter = require('./components/upgrade/upgrade-router')
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT || 5001;
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'https://c4q8292z-5173.euw.devtunnels.ms']
}));


// Для теста загрузок
// app.use((req, res, next) => {
//     setTimeout(() => {
//         next();
//     }, 1500);
// });

app.use('/user', userRouter);
app.use('/api', testRouter);
app.use('/upgrade', upgradeRouter);
app.use('/resource', resourceRouter);
app.use(errorMiddleware);


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`\nServer started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}


start()