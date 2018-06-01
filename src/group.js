/**
 * Represents a tasks group.
 */
class Group {
    /**
     * Creates a tasks group.
     * @param {boolean} enabled - Defines whether grouping is enabled.
     */
    constructor(enabled) {
        this._enabled = enabled;
        this._tasks = Object.create(null);
    }

    push(path) {
        if (!this._enabled) {
            return;
        }

        if (!path) {
            return;
        }

        const parts = path.split(':');

        if (parts.length <= 0) {
            return;
        }

        const parent = parts.slice(0, parts.length - 1).join(':');

        // task in root folder, skip it
        if (!parent) {
            return;
        }

        this.push(parent);

        let task = this._tasks[parent];

        if (!task) {
            task = {
                name: parent,
                dependencies: []
            };
            this._tasks[parent] = task;
        }

        if (task.dependencies.indexOf(path) < 0) {
            task.dependencies.push(path);
        }
    }

    forEach(iteratee) {
        if (!this._enabled) {
            return;
        }

        const tasks = this._tasks;
        const keys = Object.keys(tasks);
        const len = keys.length;
        let i = 0;

        while (i < len) {
            const prop = keys[i];

            if (tasks[prop]) {
                iteratee(tasks[prop]);
            }

            i += 1;
        }
    }
}

export default function create(...args) {
    return new Group(...args);
}
