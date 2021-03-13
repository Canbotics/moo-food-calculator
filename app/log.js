import { cloneTemplate } from './app.js';

export class Log {
    static templates = {};

    static init() {
        const templates = document.getElementById('tmplog').querySelectorAll('template');
        Log.display = document.getElementById('logdisplay');
        templates.forEach((template) => Log.templates[template.dataset.type] = template);
        Log.generic('Log loaded');
    }

    static generic(message, tier) {
        const entry = cloneTemplate(Log.templates.generic);
        entry.textContent = tier ? Log.tier(tier) + message : message;
        Log.display.prepend(entry);
    }
    
    static admin(message, tier) {
        const entry = cloneTemplate(Log.templates.admin);
        entry.textContent = tier ? Log.tier(tier) + message : message;
        Log.display.prepend(entry);
    }
    
    static break() {
        const entry = cloneTemplate(Log.templates.break);
        Log.display.prepend(entry);
    }
    
    static level(target, level) {
        const entry = cloneTemplate(Log.templates.level);
        entry.querySelector('.target').textContent = target;
        entry.querySelector('.level').textContent = level.toString();
        Log.display.prepend(entry);
    }
    
    static levels(target, level, levels) {
        const entry = cloneTemplate(Log.templates.levels);
        entry.querySelector('.target').textContent = target;
        entry.querySelector('.level').textContent = level.toString();
        entry.querySelector('.levels').textContent = levels.toString() + 'x';
        Log.display.prepend(entry);
    }

    static damage(target, damage, type) {
        const entry = cloneTemplate(Log.templates[type]);
        entry.querySelector('.target').textContent = target;
        entry.querySelector('.damage').textContent = damage.toString();
        Log.display.prepend(entry);
    }

    static tier(level = 0) {
        const indent = '\u00A0\u00A0\u00A0';
        let indents = '';

        for (let i = 0; i < level; i++) {
            indents += indent;
        }

        return indents;
    }
}
