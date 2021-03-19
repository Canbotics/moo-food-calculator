export class Convention {
    static init(data) {
        data.forEach((convention) => {
            if (convention.type === 'position') {
                Position.init(convention.labels);
            } else if (convention.type === 'size') {
                Size.init(convention.labels);
            } else if (convention.type === 'mineral') {
                Mineral.init(convention.labels);
            }
        });
    }
}

export class Position {
    static all = [];

    constructor(label) {
        this.label = label;

        Position.all.push(this);
    }

    static init(labels) {
        labels.forEach((label) => new Position(label));
    }

    static getByIndex(index) {
        return Position.all[index];
    }
}

export class Size {
    static all = [];

    constructor(label) {
        this.label = label;

        Size.all.push(this);
    }

    static init(labels) {
        labels.forEach((label) => new Size(label));
    }

    static getByIndex(index) {
        return Size.all[index];
    }
}

export class Mineral {
    static all = [];

    constructor(label) {
        this.label = label;

        Mineral.all.push(this);
    }

    static init(labels) {
        labels.forEach((label) => new Mineral(label));
    }

    static getByIndex(index) {
        return Mineral.all[index];
    }
}