const Router = require('express').Router;
const userController = require('./user-controller');
const router = new Router();
// /user

// router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/me', userController.me);

router.post('/tap', userController.tap);
router.post('/sell', userController.sell);


module.exports = router
