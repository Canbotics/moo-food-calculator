import { Log } from './log.js';
import { Dice } from './dice.js';
export class World {
    static get level() {
        return World.worldLevel;
    }
    static changeLevel(change = 1) {
        let newLevel = World.worldLevel + change;
        let direction = change > 0 ? 'increased' : 'decreased';
        if (newLevel < 1)
            newLevel = 1;
        if (newLevel === World.worldLevel)
            return;
        World.worldLevel = newLevel;
        Log.generic('World level ' + direction + ' to ' + newLevel + '.');
    }
    static roulette() {
        let level = Dice.roll([[1, 8]]);
        if (World.level > 5 && Dice.roll([[1, 4]]) > 2)
            level *= -1;
        World.changeLevel(level);
    }
}
World.worldLevel = 1;
