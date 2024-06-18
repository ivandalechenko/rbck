const Router = require('express').Router;
const router = new Router();

// ApiTest
router.get('/', (req, res) => {
    res.json('Rocket API is working! Have a nice day :)');
});


module.exports = router
