const upgradeModel = require('./upgrade-model');
const ApiError = require('../../exceptions/api-error');
const userModel = require('../user/user-model');

class upgradeService {

    async avaliable(_id) {
        const user = await userModel.findOneAndUpdate({ _id }, {}, { new: true });

        const upgrades = await upgradeModel.find({
            $or: [
                { requirement: { $exists: false } },
                { requirement: '' },
                {
                    requirement: {
                        $not: {
                            $elemMatch: { $nin: user.upgrades }
                        }
                    }
                },
            ],
            slug: { $nin: user.upgrades }
        });

        return upgrades;
    }
    async notBuyed(_id) {
        const user = await userModel.findOne({ _id });
        let upgradesAvaliable = await upgradeModel.find({
            $or: [
                { requirement: { $exists: false } },
                { requirement: '' },
                {
                    requirement: {
                        $not: {
                            $elemMatch: { $nin: user.upgrades }
                        }
                    }
                },
            ],
            slug: { $nin: user.upgrades }
        });

        let upgradesNotAvaliable = await upgradeModel.find({
            $or: [
                { requirement: { $exists: false } },
                { requirement: '' },
                {
                    requirement: {
                        $elemMatch: { $nin: user.upgrades }
                    }
                },
            ],
            slug: { $nin: user.upgrades }
        });

        let upgrades = [];

        for (let i = 0; i < upgradesAvaliable.length; i++) {
            upgrades.push({ ...upgradesAvaliable[i]._doc, avaliable: true })
        }
        for (let i = 0; i < upgradesNotAvaliable.length; i++) {
            upgrades.push({ ...upgradesNotAvaliable[i]._doc, avaliable: false })
        }


        return upgrades;
    }
    async buy(_id, slugToBuy) {
        const user = await userModel.findOne({ _id });

        if (user.upgrades.includes(slugToBuy)) {
            throw ApiError.BadRequest(`Уже есть такое улучшение`);
        }

        const upgrade = await upgradeModel.findOne({ slug: slugToBuy });

        if (!upgrade) {
            throw ApiError.BadRequest(`Несуществующий апгрейд`);
        }

        if (upgrade.price > user.balance) {
            throw ApiError.BadRequest(`Маленький баланс`);
        }

        let userUpdate
        if (upgrade.improve.length > 0) {
            for (let i = 0; i < upgrade.improve.length; i++) {
                if (upgrade.improve[i].name == 'cargo') {
                    await userModel.findOneAndUpdate({ _id }, { $inc: { cargoCapacity: upgrade.improve[i].value, maxFuel: upgrade.improve[i].value * 3 } })
                }
                if (upgrade.improve[i].name == 'mine') {
                    await userModel.findOneAndUpdate({ _id }, { $inc: { minePower: upgrade.improve[i].value } })
                }
                if (upgrade.improve[i].name == 'resource') {
                    await userModel.findOneAndUpdate({ _id }, { $inc: { canMine: upgrade.improve[i].value } })
                }
                if (upgrade.improve[i].name == 'gamesPerDay') {
                    await userModel.findOneAndUpdate({ _id }, { $inc: { gamesPerDay: upgrade.improve[i].value } })
                }
                if (upgrade.improve[i].name == 'luck') {
                    await userModel.findOneAndUpdate({ _id }, { $inc: { luck: upgrade.improve[i].value } })
                }
                if (upgrade.improve[i].name == 'autoTime') {
                    await userModel.findOneAndUpdate({ _id }, { $inc: { autoTime: upgrade.improve[i].value } })
                }
                if (upgrade.improve[i].name == 'autoPercent') {
                    await userModel.findOneAndUpdate({ _id }, { $inc: { autoPercent: upgrade.improve[i].value } })
                }
            }
        }
        userUpdate = await userModel.findOneAndUpdate(
            { _id },
            {
                $push: { upgrades: upgrade.slug },
                $inc: { balance: -upgrade.price }
            },
            { new: true }
        );

        return userUpdate;
    }
}

module.exports = new upgradeService();
