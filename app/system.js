import { cloneTemplate } from './global.js';
import { Race } from './race.js';

export class System {
    static all = [];

    constructor(system) {
        this.name = system.name;
        this.star = system.star;
        this.planets = [];

        system.planets.forEach((planet) => this.planets.push(new Planet(planet, system)));

        this.sortPlanets();

        System.all.push(this);
    }

    static init(data) {
        data.forEach((system) => new System(system));

        System.sort();
        System.list();
    }

    static sort() {
        const collator = new Intl.Collator('en', {numeric: true, sensitivity: 'base'});

        System.all.sort((a, b) => collator.compare(a.name, b.name));
    }

    static list(uninhabited = false) {
        System.all.forEach((system) => {
            let planets = system.planets;

            if (!uninhabited) {
                planets = planets.filter((filter) => !filter.uninhabitable);
            }

            planets.forEach((planet) => planet.appendCard())
        })
    }

    sortPlanets() {
        this.planets.sort((a, b) => a.place - b.place)
    }
}

export class Planet {
    static all = [];

    static cardList;
    static cardTemplate;
    static slotTemplate;
    static bcTemplate;
    
    static conventions = {
        place: ['Prime', 'II', 'III', 'IV', 'V', 'VI'],
        size: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Giant'],
        minerals: ['Ultra-Poor', 'Poor', 'Abundant', 'Rich', 'Ultra-Rich'],
    }

    constructor(planet, system) {
        this.place = planet.place;

        this.size = planet.size;
        this.biome = planet.biome;
        this.minerals = planet.minerals;

        this.specials = planet.specials;

        this.population = planet.population;
        this.food = this.population * Race.foodModifier;

        this.name = system.name + ' ' + this.returnConvention('place');

        this.gaia = (this.biome === 'Gaia' || this.biome === Race.uberPlanet);
        this.prep = (this.biome === 'Terran' || this.biome === Race.uberPrep);
        this.uninhabitable = (this.biome === 'Asteroid Field' || this.biome === 'Gas Giant');
        
        this.slots = planet.slots;

        this.buildCard();

        Planet.all.push(this);
    }

    static init() {
        Planet.cardList = document.getElementById('planetlist');
        Planet.cardTemplate = document.getElementById('planettemplate');
        Planet.slotTemplate = document.getElementById('slottemplate');
        Planet.bcTemplate = document.getElementById('bctemplate');
    }

    returnConvention(convention) {
        return Planet.conventions[convention][this[convention]];
    }

    calulateFoodOuput(flat = 1, perCell = 0, percent = 1) {
        const slotValues = [...this.slots.food];
        const slotAssignments = [];

        let required = this.food;
        let production = flat;

        while (required > (production * percent) && slotValues.length) {
            const cell = slotValues.shift() + perCell;

            slotAssignments.push(cell);

            production += cell;           
        }

        production *= percent;

        return [production, slotAssignments.join(' + ')];
    }

    buildCard() {
        const listItem = cloneTemplate(Planet.cardTemplate);
        const card = listItem.querySelector('article');
        const title = card.querySelector('h3');
        const props = card.querySelector('.props')
        const size = props.querySelector('.size');
        const biome = props.querySelector('.biome');
        const minerals = props.querySelector('.minerals');
        const attributes = card.querySelector('.attributes');
        const population = attributes.querySelector('.population');
        const food = attributes.querySelector('.food');
        const table = card.querySelector('table');
        const list = table.querySelector('tbody');

        title.textContent = this.name;
        size.textContent = this.returnConvention('size');
        biome.textContent = this.biome;
        minerals.textContent = this.returnConvention('minerals');
        population.textContent += this.population;
        food.textContent += this.food;

        if (this.uninhabitable) {
            card.classList.add('uninhabitable');
            attributes.setAttribute('hidden', '')
            table.setAttribute('hidden', '')
        } else {
            if (this.gaia) {
                card.classList.add('gaia');
            } else if (this.prep) {
                card.classList.add('prep');
            }

            const setups =  [
                [0, [1]],
                [3, [1, 1]],
                [8, [1, 0, 1.5]],
                [11, [1, 1, 1.5]],
            ]

            setups.forEach(([price, setup]) => {
                const [production, assignments] = this.calulateFoodOuput(...setup);

                const row = cloneTemplate(Planet.slotTemplate);

                const slots = row.querySelector('.slots');
                const total = row.querySelector('.total');
                const surplus = row.querySelector('.surplus');
                const cost = row.querySelector('.cost');

                slots.textContent = assignments;
                total.textContent = production;
                surplus.textContent = production - this.food;
                cost.textContent = price;
                cost.append(cloneTemplate(Planet.bcTemplate))

                console.log(list)
                list.append(row)

                console.log(cost + 'BC;', total + ' food;', slots)
            });
        }

        this.card = listItem;
    }

    appendCard() {
        Planet.cardList.append(this.card)
    }
}