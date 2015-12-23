export default class GulpMock {
    constructor() {
        this._tasks = [];
    }

    task(...args) {
        const name = args[0];
        const dependencies = args.length === 3 ? args[1] : null;
        const func = args.length === 3 ? args[2] : args[1];

        if (!name) {
            throw new Error('Missed task name!');
        }

        this._tasks.push({ name, dependencies, func });
    }

    getTasks() {
        return this._tasks.slice();
    }
}
