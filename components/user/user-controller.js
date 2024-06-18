const userService = require('./user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../../exceptions/api-error');
const tokenService = require('../token/token-service');

class UserController {
    // async registration(req, res, next) {
    //     try {
    //         const { email, password, name } = req.body;
    //         const userData = await userService.registration(email, password, name);
    //         res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
    //         userData.refreshToken = 'ok';
    //         return res.json(userData);
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    async login(req, res, next) {
        try {
            const { tgId, username } = req.body;
            const userData = await userService.login(tgId, username);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
            // userData.refreshToken = 'ok'
            // console.log(userData);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async me(req, res, next) {
        try {
            const token = req.headers.authorization;
            const accessToken = token.split(' ')[1];
            const decodedToken = tokenService.validateAccessToken(accessToken);
            const user = await userService.me(decodedToken.user._id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
            // userData.refreshToken = 'ok'
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async tap(req, res, next) {
        try {
            const token = req.headers.authorization;
            const accessToken = token.split(' ')[1];
            const decodedToken = tokenService.validateAccessToken(accessToken);
            const { cargo, tapCount, cargoWeight } = req.body;
            const user = await userService.tap(decodedToken.user._id, cargo, cargoWeight, tapCount);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async sell(req, res, next) {
        try {
            const token = req.headers.authorization;
            const accessToken = token.split(' ')[1];
            const decodedToken = tokenService.validateAccessToken(accessToken);
            const user = await userService.sell(decodedToken.user._id);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new UserController();
