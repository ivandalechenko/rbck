require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const userRouter = require('./components/user/user-router')
const testRouter = require('./components/test/test-router')
const upgradeRouter = require('./components/upgrade/upgrade-router')
const resourceRouter = require('./components/resource/resource-router')

const upgradeSchema = require('./components/upgrade/upgrade-model')
const resourceSchema = require('./components/resource/resource-model')

const errorMiddleware = require('./middlewares/error-middleware');
const fs = require('fs');
const path = require('path');


const PORT = process.env.PORT || 5000;
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
        // инициализация базовой базы
        const upgradesCount = await upgradeSchema.countDocuments();
        const resourcesCount = await resourceSchema.countDocuments();
        if (upgradesCount === 0) {
            const dataPath = path.join(__dirname, 'upgrades.json');
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            let data = JSON.parse(fileContent);
            // Преобразование ObjectId в правильный формат
            data = data.map(doc => {
                doc._id = new mongoose.Types.ObjectId(doc._id.$oid);
                if (doc.improve) {
                    doc.improve = doc.improve.map(improve => ({
                        ...improve,
                        _id: new mongoose.Types.ObjectId(improve._id.$oid)
                    }));
                }
                return doc;
            });
            await upgradeSchema.insertMany(data);
            console.log('Upgrades init');
        }
        if (resourcesCount === 0) {
            const dataPath = path.join(__dirname, 'resources.json');
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            let data = JSON.parse(fileContent);

            // data = data.map(doc => {
            //     doc._id = new mongoose.Types.ObjectId(doc._id.$oid);
            //     if (doc.improve) {
            //         doc.improve = doc.improve.map(improve => ({
            //             ...improve,
            //             _id: new mongoose.Types.ObjectId(improve._id.$oid)
            //         }));
            //     }
            //     return doc;
            // });

            data = data.map(resource => {
                resource._id = new mongoose.Types.ObjectId(resource._id.$oid);
                resource.canMineLevel = resource.canMineLevel.map(level => {
                    level._id = new mongoose.Types.ObjectId(level._id['$oid']);
                    level.luckLevel = level.luckLevel.map(luck => {
                        luck._id = new mongoose.Types.ObjectId(luck._id['$oid']);
                        return luck;
                    });
                    return level;
                });
                return resource;
            });
            // Преобразование ObjectId в правильный формат


            await resourceSchema.insertMany(data);
            console.log('Resources init');
        }
    } catch (e) {
        console.log(e);
    }
}


start()