const resourceModel = require('./resource-model');

class ResourceService {
    async add(level, chances, content) {

        // chances
        // canMineLevel, luckLevel, percent,

        // content
        // name, price, weight, img
        try {
            // Пытаемся найти существующий ресурс по уровню
            let existingResource = await resourceModel.findOne({ level });

            // Если ресурс не найден, создаем новый объект ресурса
            if (!existingResource) {
                if (Object.keys(content).length != 0) {
                    existingResource = await resourceModel.create({
                        name: content.name,
                        price: content.price,
                        weight: content.weight,
                        level,
                        canMineLevel: []
                    });
                } else {
                    existingResource = await resourceModel.create({
                        level,
                        canMineLevel: []
                    });
                }
            }
            if (Object.keys(chances).length != 0) {
                // Проверяем, есть ли уже такой rocketLevel в массиве chance
                let canMineLevelIndex = existingResource.canMineLevel.findIndex(canMineLevel => canMineLevel.canMineLevel === chances.canMineLevel);

                if (canMineLevelIndex === -1) {
                    existingResource.canMineLevel.push({
                        canMineLevel: chances.canMineLevel,
                        luckLevel: [{
                            luckLevel: chances.luckLevel,
                            percent: chances.percent
                        }]
                    });
                } else {
                    let luckLevelIndex = existingResource.canMineLevel[canMineLevelIndex].luckLevel.findIndex(luckLevel => luckLevel.luckLevel === chances.luckLevel);

                    if (luckLevelIndex === -1) {
                        // Если luckLevel не найден в существующем rocketLevel, добавляем новый luckLevel с percent
                        existingResource.canMineLevel[canMineLevelIndex].luckLevel.push({
                            luckLevel: chances.luckLevel,
                            percent: chances.percent
                        });
                    } else {
                        // Если luckLevel найден, перезаписываем percent
                        existingResource.canMineLevel[canMineLevelIndex].luckLevel[luckLevelIndex].percent = chances.percent;
                    }
                }
            }

            if (Object.keys(content).length != 0) {
                existingResource.name = content.name;
                existingResource.price = content.price;
                existingResource.weight = content.weight;
            }


            // Сохраняем изменения в базе данных
            const savedResource = await existingResource.save();

            return savedResource;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ResourceService();