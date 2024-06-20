const Router = require('express').Router;
const questController = require('./quest-controller');
const router = new Router();
// /quest

router.get('/', questController.get);
router.post('/activate', questController.activate);


router.post('/', questController.add);
router.delete('/', questController.delete);


module.exports = router
