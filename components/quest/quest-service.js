const questModel = require('./quest-model');
const ApiError = require('../../exceptions/api-error');
const userModel = require('../user/user-model');

class questService {

    async activate(_id, slug) {
        const quest = await questModel.findOne({ slug })
        const user = await userModel.findOne({ _id })
        let completedQuests = user.completedQuests;
        completedQuests.push(quest.slug)
        const newUser = await userModel.findOneAndUpdate({ _id }, { balance: user.balance + quest.bounty, completedQuests }, { new: true })
        return newUser;
    }
}

module.exports = new questService();
