const Router = require('express').Router;
const userController = require('./user-controller');
const router = new Router();
// /user

// router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/me', userController.me);
router.get('/myReferalsCount', userController.myReferalsCount);
router.post('/comleteTraining', userController.comleteTraining);

router.post('/fuelBoost', userController.fuelBoost);
router.post('/rage', userController.rage);
// router.post('/comleteTraining', userController.comleteTraining);


router.post('/tap', userController.tap);
router.post('/sell', userController.sell);


module.exports = router
