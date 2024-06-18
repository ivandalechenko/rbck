const resourceModel = require('./resource-model');
const resourceService = require('./resource-service');

class resourceController {

    async getAll(req, res, next) {
        try {
            const resources = await resourceModel.find();
            return res.json(resources);
        } catch (e) {
            next(e);
        }
    }
    async add(req, res, next) {
        try {
            const { level, canMineLevel, luckLevel, percent, name, price, weight } = req.body;
            let chances = {}
            if (canMineLevel && percent) {
                chances.canMineLevel = canMineLevel;
                chances.luckLevel = luckLevel;
                chances.percent = percent;
            }

            let content = {}
            if (name && price && weight) {
                content.name = name;
                content.price = price;
                content.weight = weight;
            }

            await resourceService.add(level, chances, content);
            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }
    // async delete(req, res, next) {
    //     try {
    //         const { name, level, price, img, rocketLevel, luckLevel, percent } = req.body;
    //         await resourceModel.create({ _id });
    //         return res.json('ok');
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    // async update(req, res, next) {
    //     try {
    //         const { name, level, price, img, rocketLevel, luckLevel, percent } = req.body;
    //         await resourceModel.findOneAndUpdate({ _id }, { img, level, price, name });
    //         return res.json('ok');
    //     } catch (e) {
    //         next(e);
    //     }
    // }
}


module.exports = new resourceController();
