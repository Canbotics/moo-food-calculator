export class Dice {
    static stats = {
        total: 0,
        sides: {
            4: 0,
            6: 0,
            8: 0,
            10: 0,
            12: 0,
            20: 0,
        }
    };

    static roll(dice, modifier = 0) {
        let sum = 0;

        dice.forEach((die) => {
            for (let i = 0; i < die[0]; i++) {
                let value = Math.floor(Math.random() * (die[1])) + 1;
                sum += value;
            }

            Dice.updateStats(die[0], die[1]);
        });

        return sum + modifier;
    }

    static updateStats(count, sides) {
        Dice.stats.sides[sides] += count;
        Dice.stats.total += 1;
    }

    static getStats() {
        const dice = [];
        let tally;
        Object.keys(Dice.stats.sides).forEach((key) => dice.push(key + ': ' + Dice.stats.sides[key]));
        tally = dice.join(', ') + '; total rolls: ' + Dice.stats.total;
        return tally;
    }
}

