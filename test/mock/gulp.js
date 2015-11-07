export default class GulpMock {
    constructor() {
        this._tasks = [];
    }

    task(...args) {
        const name = args[0];
        const deps = args.length === 3 ? args[1] : null;
        const func = args.length === 3 ? args[2] : args[1];

        this._tasks.push({ name, deps, func });
    }

    getTasks() {
        return this._tasks.slice();
    }
}