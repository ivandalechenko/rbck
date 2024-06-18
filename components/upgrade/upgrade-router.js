const Router = require('express').Router;
const upgradeController = require('./upgrade-controller');
const router = new Router();
// /upgrade

router.get('/avaliable', upgradeController.avaliable);
router.get('/notBuyed', upgradeController.notBuyed);
router.post('/buy', upgradeController.buy);


router.get('/', upgradeController.getAll);
router.post('/', upgradeController.add);
router.delete('/', upgradeController.delete);
router.put('/', upgradeController.update);


module.exports = router
