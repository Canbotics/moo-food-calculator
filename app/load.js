import { System, Planet } from './system.js';
import { Convention } from './convention.js';

export class Load {
    static init() {
        Planet.init();

        Load.connect('/data/conventions.json', Convention.init)
            .then(Load.connect('/data/systems.json', System.init))
            .catch((err) => console.error('Loading error:', err));
    }

    static connect(url, func) {
        return new Promise((resolve) => {

            const httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        func(JSON.parse(httpRequest.responseText));
                    } else {
                        console.error('Failed to load');
        
                        return false;
                    }
                } 
            }
            
            httpRequest.open('GET', url);
            httpRequest.send();   
        });
    }
} 