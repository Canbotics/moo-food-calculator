import { Dice } from './dice.js';
import { World } from './world.js';
import { Job } from './job.js';
import { Log } from './log.js';
import { cloneTemplate } from './app.js';

export class Character {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.job = Job.getByName(data.job);
        this.level = 1;

        this.experience = {
            currentValue: 0,
            currentNext: 0,
            totalValue: 0,
            totalNext: 0,
        };

        this.points = {
            hp: { cur: 0, max: 0, lvl: 0, inc: this.job.points.hp},
            mp: { cur: 0, max: 0, lvl: 0, inc: this.job.points.mp},
        };


        this.attributes = {};

        // this.attributes = {
        //     str: { base: 0, bonus: 0 },
        //     con: { base: 0, bonus: 0 },
        //     dex: { base: 0, bonus: 0 },
        //     agi: { base: 0, bonus: 0 },
        //     int: { base: 0, bonus: 0 },
        //     mnd: { base: 0, bonus: 0 },
        // };


        // this.id = character.id;
        // this.name = character.name;
        // this.level = World.level;
        // this.element = character.element.alignment;

        console.group(this.name)
        // console.group('Attributes:')

        Object.entries(this.job.attributes).forEach(([attribute, values]) => {
            this.setAttribute(attribute, values);
        });

        // console.groupEnd()
        // console.group('Experience')

        this.setExperience(data.level);

        // console.groupEnd();
        console.log(this)
        console.groupEnd();

    }




    setExperience(level) {
        for (let i = this.level; i <= level; i++) {
            this.experience.totalValue += this.experience.currentNext;
            this.experience.totalNext += this.experience.currentNext;
            this.experience.currentNext = this.calculateExperience(i);
        }

        this.level = level;
        this.experience.totalNext += this.experience.currentNext;

        this.levelAttributes();
        this.levelPoints(this.level);
    }

    modifyExperience(value) {
        let current = this.experience.currentValue + value;
        let next = this.experience.currentNext;
        let levels = 0;

        Log.generic(this.name + ' gained ' + value + ' exp.');

        while (current >= next) {
            this.level += 1;
            levels += 1;
            current -= next;
            next = this.calculateExperience();
            this.experience.totalNext += next;
            this.levelPoints();
        }

        if (levels) {
            if (levels === 1)
                Log.level(this.name, this.level);
            else {
                Log.levels(this.name, this.level, levels);
            }
        }

        this.experience.currentNext = next;
        this.experience.currentValue = current;
        this.experience.totalValue += value;
    }

    calculateExperience(level = this.level) {
        return (level - 1) * 100 + 100;
    }



    setAttribute(attribute, values) {
        this.attributes[attribute] = {
            current: values.base, 
            base: values.base,
            bonus: this.calcAttributeBonus(values.base),
            level: values.level,
            modifier: 0,
        };

        if (attribute === 'con') {
            this.setPoint('hp');
        } else if (attribute === 'mnd') {
            this.setPoint('mp');
        }
    }

    modifyAttribute() {

    }

    levelAttributes() {
        Object.entries(this.attributes).forEach(([attribute, values]) => {
            values.modifier = Math.floor(this.level * values.level);
            values.current = values.base + values.modifier;
            values.bonus = this.calcAttributeBonus(values.current)
        })
    }

    calcAttributeBonus(value) {
        let bonus = (value - 10) / 2;

        if (bonus > 0) {
            bonus = Math.floor(bonus);
        } else {
            bonus = Math.ceil(bonus);
        }

        return bonus;
    }









    setPoint(point) {
        let value;

        if (point === 'hp') {
            value = this.attributes.con.base;
        } else {
            value = Math.ceil(this.attributes.mnd.base * 1.5);
        }

        this.points[point].max = value;
        this.points[point].cur = value;
    }

    modifyPoint(point, value) {
    }

    levelPoints(levels = 1) {
        let hp = 0;
        let mp = 0;

        for (let i = 0; i < levels; i++) {
            hp += Dice.roll([this.points.hp.inc], this.attributes.con.bonus);
            mp += Dice.roll([this.points.mp.inc], this.attributes.mnd.bonus);
        }

        if (hp < levels) {
            hp = levels;
        }

        if (mp < levels) {
            mp = levels;
        }

        this.points.hp.lvl += hp;
        this.points.hp.cur += hp;
        this.points.hp.max += hp;
        this.points.mp.lvl += mp;
        this.points.mp.cur += mp;
        this.points.mp.max += mp;
    }





    
    actDefend(damage) {
        this.stats.hp.cur -= damage;
    }
    actSpell(cost) {
        this.stats.mp.cur -= cost;
    }
}



export class Pc extends Character {
    static all = [];

    constructor(character) {
        super(character);
        // this.type = 'PC';
        // this.buildCard();

        Pc.all.push(this);
    }

    static init(data) {
        data.forEach((character) => {
            new Pc(character);
        });
    }

    static getByName(name) {
        return Pc.all.find((pc) => pc.name === name);
    }




    // static loadCharacters(characters) {
    //     Pc.cardList = document.getElementById('characters');
    //     Pc.cardTemplate = document.getElementById('tmpcharactercard');
    //     Log.break();
    //     Log.admin('Loading Characters...');
    //     characters.forEach((character) => {
    //         const pc = new Pc(character);
    //         Log.admin(pc.name + ' loaded.');
    //         // DEBUG randomize character levels
    //         World.roulette();
    //     });
    //     Log.admin(Pc.list.length + ' Characters Loaded.');
    //     Log.break();
    // }


    buildCard() {
        // const card = cloneTemplate(Pc.cardTemplate);
        // const title = card.querySelector('h3');
        // const avatar = card.querySelector('img.avatar');
        // const element = card.querySelector('img.element');
        // this.card = card;
        // title.textContent = this.name;
        // avatar.src = avatar.src.replace(/\$ID/, this.id);
        // avatar.alt = this.name;
        // element.src = element.src.replace(/\$ELEMENT/, this.element.toLowerCase());
        // element.alt = this.element;
        // element.title = this.element;
        // this.updateCardExperience();
        // Object.keys(this.attributes).forEach((attribute) => {
        //     this.updateCardAttribute(attribute);
        // });
        // Object.keys(this.points).forEach((point) => {
        //     this.updateCardPoint(point);
        // });
        // Pc.cardList.append(card);
        // // DEBUG Buttons
        // this.buildDebugMenu();
    }
    modifyExperience(value) {
        super.modifyExperience(value);
        // this.updateCardExperience();
    }
    updateCardExperience() {
        // const level = this.card.querySelector('.level');
        // const experienceText = this.card.querySelector('div.experience');
        // const experienceProgress = this.card.querySelector('progress.experience');
        // level.textContent = this.level.toString();
        // experienceText.textContent = this.experience.totalValue + ' / ' + this.experience.totalNext;
        // experienceProgress.max = this.experience.currentNext;
        // experienceProgress.value = this.experience.currentValue;
        // experienceProgress.textContent = Math.floor(this.experience.currentValue / this.experience.currentNext * 100) + '%';
    }
    updateCardAttribute(attribute) {
        this.card.querySelector('.' + attribute + ' span').textContent = this.attributes[attribute].base.toString();
    }
    modifyPoint(point, value) {
        super.modifyPoint(point, value);
        // this.updateCardPoint(point);
    }
    levelPoints(value = 1) {
        super.levelPoints(value);
        // console.log(this.card);
        // console.log(this.points);
        // if (this.card != undefined) {
        //     console.log('hi');
        //     this.updateCardPoint('hp');
        //     this.updateCardPoint('mp');
        // }
    }
    updateCardPoint(point) {
        const text = this.card.querySelector('span.' + point);
        const progress = this.card.querySelector('progress.' + point);
        const current = this.points[point].cur;
        const maximum = this.points[point].max;
        text.textContent = current + ' / ' + maximum;
        progress.value = current;
        progress.max = maximum;
        progress.textContent = Math.floor(current / maximum * 100) + '%';
    }
    buildDebugMenu() {
        const buttons = this.card.querySelector('aside');
        buttons.querySelectorAll('.btnexproll').forEach((button) => {
            button.addEventListener('click', (event) => {
                const value = button.dataset.dice.split('d').map((item) => parseInt(item));
                this.modifyExperience(Dice.roll([value]));
            });
        });
        buttons.querySelectorAll('.btnexp').forEach((button) => {
            button.addEventListener('click', (event) => {
                const input = button.parentNode.querySelector('.inpexp');
                if (!input.value)
                    return;
                this.modifyExperience(parseInt(input.value));
            });
        });
    }
}

