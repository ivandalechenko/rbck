const Router = require('express').Router;
const resourceController = require('./resource-controller');
const router = new Router();


router.get('/', resourceController.getAll);
router.post('/', resourceController.add);
// router.delete('/', resourceController.delete);
// router.put('/', resourceController.update);


module.exports = router
