import { System } from './system.js';

export function load() {
    loadSystems();
}

function loadSystems() {
    const httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                System.init(JSON.parse(httpRequest.responseText));
            } else {
                console.error('Failed to load');

                return false;
            }
        } 
    }

    httpRequest.open('GET', '/data/systems.json');
    httpRequest.send();
}

