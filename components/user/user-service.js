const UserModel = require('./user-model');
const ResourceModel = require('../resource/resource-model');
const bcrypt = require('bcrypt');
const tokenService = require('../token/token-service');
const UserDto = require('../../dtos/user-dto');
const ProfileDto = require('../../dtos/profile-dto');
const ApiError = require('../../exceptions/api-error');


class UserService {
    // async registration(email, password, name) {
    //     const candidate = await UserModel.findOne({ email })
    //     if (candidate) {
    //         throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    //     }
    //     const hashPassword = await bcrypt.hash(password, 3);
    //     const user = await UserModel.create({ email, password: hashPassword, name })

    //     const userDto = new UserDto(user); // _id, email, name
    //     const tokens = tokenService.generateTokens({ ...userDto });
    //     await tokenService.saveToken(userDto._id, tokens.refreshToken);

    //     return { ...tokens, user: new ProfileDto(user) }
    // }

    async login(tgId, username) {
        let user = await UserModel.findOneAndUpdate({ tgId }, {}, { new: true })
        if (!user) {
            user = await UserModel.create({ tgId, username })
        }
        // const isPassEquals = await bcrypt.compare(password, user.password);
        // if (!isPassEquals) {
        //     throw ApiError.BadRequest('Неверный пароль');
        // }
        const tokens = tokenService.generateTokens({ user });
        await tokenService.saveToken(user._id, tokens.refreshToken);

        return { ...tokens, user }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        // console.log(refreshToken);
        if (!refreshToken) {
            // console.log('Я не получил токен');
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData) {
            // console.log('Я не нашёл юзера');
            throw ApiError.UnauthorizedError();
        }
        if (!tokenFromDb) {
            // console.log('Я не нашёл токена в базе');
            throw ApiError.UnauthorizedError();
        }
        // let _id;
        let _id = userData.user._id
        // console.log(userData);
        // try {
        // _id = userData.user._id
        // } catch (e) {
        // _id = userData._doc._id
        // }

        const user = await UserModel.findOne({ _id });
        const tokens = tokenService.generateTokens({ user });

        await tokenService.saveToken(user._id, tokens.refreshToken);

        return { ...tokens, user }
    }

    async tap(_id, cargo, cargoWeight, tapCount) {
        const user = await UserModel.findOne({ _id });
        const newUser = await UserModel.findOneAndUpdate({ _id }, { cargo, fuel: user.fuel - tapCount, cargoWeight }, { new: true })
        return newUser;
    }
    async me(_id) {
        const user = await UserModel.findOneAndUpdate({ _id }, {}, { new: true });
        return user;
    }
    async sell(_id) {
        const user = await UserModel.findOne({ _id });
        const resources = await ResourceModel.find({})
        let profit = 0;

        for (let i = 0; i < user.cargo.length; i++) {
            const resource = resources.find(obj => obj['level'] === user.cargo[i]);
            profit += resource.price;
        }
        // console.log(`Профит ${profit}`);
        const newUser = await UserModel.findOneAndUpdate({ _id }, { cargo: [], cargoWeight: 0, balance: user.balance + profit, totalFarmed: user.totalFarmed + profit }, { new: true })
        return newUser

    }
}

module.exports = new UserService();
