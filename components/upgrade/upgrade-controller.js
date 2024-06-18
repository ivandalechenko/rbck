const tokenService = require('../token/token-service');
const upgradeModel = require('./upgrade-model');
const upgradeService = require('./upgrade-service');

class upgradeController {
    async getAll(req, res, next) {
        try {
            const upgrades = await upgradeModel.find();
            return res.json(upgrades);
        } catch (e) {
            next(e);
        }
    }
    async getAll(req, res, next) {
        try {
            const upgrades = await upgradeModel.find();
            return res.json(upgrades);
        } catch (e) {
            next(e);
        }
    }

    async avaliable(req, res, next) {
        try {
            const token = req.headers.authorization;
            const accessToken = token.split(' ')[1];
            const decodedToken = tokenService.validateAccessToken(accessToken);
            const upgrades = await upgradeService.avaliable(decodedToken.user._id);
            return res.json(upgrades);
        } catch (e) {
            next(e);
        }
    }
    async notBuyed(req, res, next) {
        try {
            const token = req.headers.authorization;
            const accessToken = token.split(' ')[1];
            const decodedToken = tokenService.validateAccessToken(accessToken);
            const upgrades = await upgradeService.notBuyed(decodedToken.user._id);
            return res.json(upgrades);
        } catch (e) {
            next(e);
        }
    }


    async buy(req, res, next) {
        try {
            const token = req.headers.authorization;
            const accessToken = token.split(' ')[1];
            const decodedToken = tokenService.validateAccessToken(accessToken);
            const { slugToBuy } = req.body;
            const userUpdated = await upgradeService.buy(decodedToken.user._id, slugToBuy);
            return res.json(userUpdated);
        } catch (e) {
            next(e);
        }
    }

    async add(req, res, next) {
        try {
            const { slug, name, price, requirement, level, description, improve } = req.body;
            const upgrade = await upgradeModel.findOne({ slug })
            let upgradeNew
            if (upgrade) {
                upgradeNew = await upgradeModel.findOneAndUpdate({ slug }, { name, price, requirement, level, description, improve }, { new: true });
            } else {
                upgradeNew = await upgradeModel.create({ slug, name, price, requirement, level, description, improve });
            }
            return res.json(upgradeNew);
        } catch (e) {
            next(e);
        }
    }
    async delete(req, res, next) {
        try {
            const { upgradeId } = req.body;
            const upgrade = await upgradeModel.findOneAndDelete({ _id: upgradeId })
            return res.json(upgrade);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const { upgradeId, slug, name, price } = req.body;
            const upgrade = await upgradeModel.findOneAndDelete({ _id: upgradeId }, { slug, name, price })
            return res.json(upgrade);
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new upgradeController();
