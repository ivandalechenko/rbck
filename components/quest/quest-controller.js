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
            const { slug } = req.body;
            const user = await questService.activate(decodedToken.user._id, slug);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async add(req, res, next) {
        try {
            const { slug, name, bounty, daily, link } = req.body;
            const quest = await questModel.findOne({ slug })
            let questNew
            if (quest) {
                questNew = await questModel.findOneAndUpdate({ slug }, { name, bounty, daily, link }, { new: true });
            } else {
                questNew = await questModel.create({ slug, name, bounty, daily, link });
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
