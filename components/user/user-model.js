const { Schema, model } = require('mongoose');
const ResourceModel = require('../resource/resource-model');
const defaultTimeMinus12Hours = () => {
    const date = new Date();
    date.setHours(date.getHours() - 12);
    return date;
};
const defaultTimeMinus24Hours = () => {
    const date = new Date();
    date.setHours(date.getHours() - 24);
    return date;
};

const UserSchema = new Schema({
    tgId: String,
    username: String,
    invitedBy: String,
    balance: { type: Number, default: 99999 },
    totalFarmed: { type: Number, default: 0 },
    cargo: [Number],
    upgrades: [String],
    completedQuests: [String],
    cargoCapacity: { type: Number, default: 200 },
    cargoWeight: { type: Number, default: 0 },
    gamesPerDay: { type: Number, default: 12 },
    fuel: { type: Number, default: 600 },
    maxFuel: { type: Number, default: 600 },
    minePower: { type: Number, default: 1 },
    luck: { type: Number, default: 0 },
    canMine: { type: Number, default: 0 },


    autoFarmed: Number,
    autoTime: { type: Number, default: 0 },
    autoPercent: { type: Number, default: 0 },
    completedTraining: { type: Boolean, default: false },
    lastActivity: {
        type: Date,
        default: Date.now,
    },
    lastFuelBoost: {
        type: Date,
        default: defaultTimeMinus24Hours
    },
    lastRage: {
        type: Date,
        default: defaultTimeMinus12Hours
    },
    rage: Boolean,
})

// Middleware для обновления lastActivity перед findOneAndUpdate
UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    const docToUpdate = await this.model.findOne(this.getQuery());


    if (docToUpdate) {
        const now = Date.now();
        let newFuel = docToUpdate.fuel;

        if (docToUpdate.rage) {
            const lastRage = docToUpdate.lastRage.getTime();
            if (now - lastRage > 30000) {
                this.set({
                    maxFuel: docToUpdate.maxFuel / 3,
                    minePower: docToUpdate.minePower / 10,
                    rage: false
                });
                update.$set.fuel = newFuel / 3
            }
        }




        const lastActivity = docToUpdate.lastActivity.getTime();
        let timeElapsed = now - lastActivity;

        let increaseFuelBy = timeElapsed * (docToUpdate.maxFuel * docToUpdate.gamesPerDay) / 86400000;

        if (update.$set && update.$set.fuel !== undefined) {
            newFuel = update.$set.fuel;
        } else if (update.fuel !== undefined) {
            newFuel = update.fuel;
        }
        newFuel = Math.min(newFuel + increaseFuelBy, docToUpdate.maxFuel);
        this.set({
            fuel: newFuel,
            lastActivity: now
        });
        // console.log(`Сек с последнего обновления ${timeElapsed / 1000}`);

        if (timeElapsed > 5 * 60 * 1000) {
            // if (timeElapsed > 1000 && docToUpdate.autoTime) {
            let timeElapsedButNoMoreThanNeed = timeElapsed;
            if (timeElapsed > docToUpdate.autoTime * 60 * 60 * 1000) {
                timeElapsedButNoMoreThanNeed = docToUpdate.autoTime * 60 * 60 * 1000
            }
            // console.log(docToUpdate);
            // console.log(`Прошло времени ${timeElapsed / 1000} секунд`);
            // console.log(`Прошло времени ${timeElapsedButNoMoreThanNeed} секунд`);
            increaseFuelBy = timeElapsedButNoMoreThanNeed * (docToUpdate.maxFuel * docToUpdate.gamesPerDay) / 86400000;
            update.$set = update.$set || {};
            update.$inc = update.$inc || {};
            const resources = await ResourceModel.find()
            const canMine = docToUpdate.canMine;
            const luck = docToUpdate.luck;
            let resourcesCount = increaseFuelBy / 2
            let totalSum = 0;

            if (canMine === 0) {
                const resource = resources.find(obj => obj['level'] === 1);
                totalSum += resource.price * resourcesCount
                // console.log(`Ресурсов: ${resourcesCount}`);
                // console.log(`Нафармлено: ${totalSum}`);
            } else {
                for (let resourceLevel = 1; resourceLevel <= canMine + 1; resourceLevel++) {
                    const resource = resources.find(obj => obj['level'] === resourceLevel);
                    const resourceLuckLevelsList = resource.canMineLevel.find(obj => obj['canMineLevel'] === canMine);
                    const chanceForThisResource = resourceLuckLevelsList.luckLevel.find(obj => obj['luckLevel'] === luck);
                    const percent = chanceForThisResource.percent
                    const currentResourceCount = (resourcesCount / 100) * percent
                    totalSum += resource.price * currentResourceCount
                }
            }

            totalSum = Math.floor(totalSum);

            update.$inc.autoFarmed = totalSum;
            // console.log(`Сумма афк заработка ${totalSum}`);



            let newbalance = docToUpdate.balance;
            if (update.$set && update.$set.balance !== undefined) {
                newbalance = update.$set.balance;
            } else if (update.balance !== undefined) {
                newbalance = update.balance;
            }
            newbalance += totalSum

            let newtotalFarmed = docToUpdate.totalFarmed;
            if (update.$set && update.$set.totalFarmed !== undefined) {
                newtotalFarmed = update.$set.totalFarmed;
            } else if (update.totalFarmed !== undefined) {
                newtotalFarmed = update.totalFarmed;
            }
            newtotalFarmed += totalSum

            this.set({
                balance: newbalance,
                totalFarmed: newtotalFarmed
            });
        }
    }



    next();
});



UserSchema.post('findOneAndUpdate', async function (doc) {
    const { _id } = this.getQuery();

    await this.model.updateOne(
        { _id },
        { $set: { autoFarmed: 0 } },
    );
});

module.exports = model('User', UserSchema);
