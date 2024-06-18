const tapModel = require('./tap-model');
const tapService = require('./tap-service');

class tapController {
    async add(req, res, next) {
        try {
            const { slug, name, price } = req.body;
            const tap = await tapModel.create(slug, name, price);
            return res.json(tap);
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new tapController();
