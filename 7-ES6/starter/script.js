class Element {
    constructor(name, buildYear) {
        this.name = name;
        this.buildYear = buildYear;
    }
}

class Park extends Element {
    constructor(name, buildYear, area, numTrees) {
        super(name, buildYear);
        this.area = area;
        this.numTrees = numTrees;
    }

    treeDensity() {
        const density = this.numTrees / this.area;
        console.log(`${this.name} has a tree density of ${density} trees per square km.`);
    }
}

class Street extends Element{
    constructor(name, buildYear, length, size = 3) {
        super(name, buildYear);
        this.length = length;
        this.size = size;
    }

    classifyStreet() {
        const classification = new Map();
        classification.set(1, 'tiny');
        classification.set(2, 'small');
        classification.set(3, 'normal');
        classification.set(4, 'big');
        classification.set(5, 'huge');
        console.log(`${this.name}, build in ${this.buildYear}, is a ${classification.get(this.size)} street.`);
    }
}

const allParks = [new Park('Green Park', 1988, 0.2, 215), new Park('National Park', 2000, 1.2, 654), new Park(
    'Oak' + ' Park', 1987, 3.1, 1999)];

const allStreets = [new Street('Ocean Avenue', 1999, 1.1, 4), new Street('Elephan Street', 1600, 0.5), new Street(
    'Sunset Boulevard', 1236, 2.4, 5)];

function calc(arr) {
    const sum = arr.reduce((prev, cur, index) => prev + cur, 0);

    return [sum, sum / arr.length];
}

function reportParks(parks) {
    console.log('--------- PARKS REPORT -----------');

    // Density
    parks.forEach(el => el.treeDensity());

    // Average age
    const ages = parks.map(el => new Date().getFullYear() - el.buildYear);
    const [totalAge, avgAge] = calc(ages);
    console.log(`Our ${parks.length} parks have an average of ${avgAge} years.`);

    // Which park has more than 1000 trees
    const i = parks.map(el => el.numTrees).findIndex(el => el >= 1000);
    console.log(i);
    console.log(`${parks[i].name} has more than 1000 trees`);
}

function reportStreets(streets) {
    console.log('-------- STREETS REPORT ---------');
    const [totalLength, avgLength] = calc(streets.map(el => el.length));
    console.log(
        `Our ${streets.length} streets have a total length of ${totalLength} km, with an average of ${avgLength} km.`);

    // Classify sizes
    streets.forEach(el => el.classifyStreet());
}

reportParks(allParks);
reportStreets(allStreets);