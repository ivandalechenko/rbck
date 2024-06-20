const tokenService = require('../token/token-service');
const questModel = require('./quest-model');
const questService = require('./quest-service');

class questController {
    async get(req, res, next) {
        try {
            const quests = await questModel.find();
            return res.json(quests);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const token = req.headers.authorization;
            const accessToken = token.split(' ')[1];
            const decodedToken = tokenService.validateAccessToken(accessToken);
            const { name } = req.body;
            const quests = await questService.activate(decodedToken.user, name);
            return res.json(quests);
        } catch (e) {
            next(e);
        }
    }

    async add(req, res, next) {
        try {
            const { name, bounty, daily, description } = req.body;
            const quest = await questModel.findOne({ name })
            let questNew
            if (quest) {
                questNew = await questModel.findOneAndUpdate({ name }, { bounty, daily, description }, { new: true });
            } else {
                questNew = await questModel.create({ name, bounty, daily, description });
            }
            return res.json(questNew);
        } catch (e) {
            next(e);
        }
    }
    async delete(req, res, next) {
        try {
            const { questId } = req.body;
            const quest = await questModel.findOneAndDelete({ _id: questId })
            return res.json(quest);
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new questController();
