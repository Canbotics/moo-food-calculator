export class Skill {
    static all = [];

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.active = data.active;

        Skill.all.push(this);
    }

    static init(data) {
        data.forEach((skill) => {
            new Skill(skill);
        });
    }

    static getByName(name) {
        return Skill.all.find((skill) => skill.name === name);
    }

    static getById(id) {
        return Skill.all.find((skill) => skill.id === id);
    }
}