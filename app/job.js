import { Log } from './log.js';
import { Skill } from './skill.js';

export class Job {
    static all = [];

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.attributes = data.attributes;
        this.points =  data.points;

        this.skills = [];

        data.skills.forEach((skill) => {
            this.skills.push({
                skill: Skill.getByName(skill.name),
                level: skill.level
            });
        });

        Job.all.push(this) 
    }

    static init(data) {
        data.forEach((job) => {
            new Job(job);
        });
    }

    static getByName(name) {
        return Job.all.find((job) => job.name === name);
    }
}
