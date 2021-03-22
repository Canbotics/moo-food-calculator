import { cloneTemplate } from './global.js';
import { Race } from './race.js';
import { Position, Size, Mineral } from './convention.js';

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
        this.planets.sort((a, b) => a.position - b.position)
    }
}

export class Planet {
    static all = [];

    static cardList;
    static cardTemplate;
    static cellTemplate;
    static bcTemplate;
    
    constructor(planet, system) {
        this.position = Position.getByIndex(planet.position);

        this.size = Size.getByIndex(planet.size);
        this.biome = planet.biome;
        this.mineral = Mineral.getByIndex(planet.minerals);

        this.specials = planet.specials;

        this.population = planet.population;
        this.food = this.population * Race.foodModifier;

        this.name = system.name + ' ' + this.position.label;

        this.gaia = (this.biome === 'Gaia' || this.biome === Race.uberPlanet);
        this.prep = (this.biome === 'Terran' || this.biome === Race.uberPrep);
        this.uninhabitable = (this.biome === 'Asteroid Field' || this.biome === 'Gas Giant');
        
        this.cells = planet.cells;

        this.buildCard();

        Planet.all.push(this);
    }

    static init() {
        Planet.cardList = document.getElementById('planetlist');
        Planet.cardTemplate = document.getElementById('planettemplate');
        Planet.cellTemplate = document.getElementById('celltemplate');
        Planet.bcTemplate = document.getElementById('bctemplate');
    }

    calulateFoodOuput(flat = 1, perCell = 0, percent = 1) {
        const cellValues = [...this.cells.food];
        const cellAssignments = [];

        let required = this.food;
        let production = flat;

        while (required > (production * percent) && cellValues.length) {
            const cell = cellValues.shift() + perCell;

            cellAssignments.push(cell);

            production += cell;           
        }

        production *= percent;

        return [production, cellAssignments.join(' + ')];
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
        size.textContent = this.size.label//('size');
        biome.textContent = this.biome;
        minerals.textContent = this.mineral.label//('minerals');
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
                const surplusValue = production - this.food

                const row = cloneTemplate(Planet.cellTemplate);

                const cells = row.querySelector('.cells');
                const total = row.querySelector('.total');
                const surplus = row.querySelector('.surplus');
                const cost = row.querySelector('.cost');

                cells.textContent = assignments;
                total.textContent = production;
                surplus.textContent = surplusValue;
                cost.textContent = price;
                cost.append(cloneTemplate(Planet.bcTemplate));

                if (surplusValue === 0) {
                    surplus.classList.add('zero');
                } else if (surplusValue < 0) {
                    surplus.classList.add('negative')
                }

                list.append(row)
            });
        }

        this.card = listItem;
    }

    appendCard() {
        Planet.cardList.append(this.card)
    }
}