import { Pc } from './character.js';
import { Log } from './log.js';
import { data } from './data/data.js';
export function buildGame() {
    Log.build();
    // Data stuff (convert to AJAX/JSON)
    Pc.loadCharacters(data.characters);
}
// function titleCase(string: string) {
//     return string.charAt(0).toLocaleUpperCase() + string.slice(1);
// }
