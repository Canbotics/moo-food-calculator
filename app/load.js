import { System, Planet } from './system.js';

export class Load {
    static init() {
        Planet.init();

        Load.connect('/data/systems.json', System.init);
    }

    static connect(url, func) {
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
    }
} 