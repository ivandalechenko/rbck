module.exports = class ProfileDto {
    email;
    name;
    id;

    constructor(model) {
        this.name = model.name;
        this.email = model.email;
        this.id = model.id;
    }
}
