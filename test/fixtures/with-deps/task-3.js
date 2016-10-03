export default function factory() {
    const task3 = function task3(done) {
        done();
    };

    task3.dependencies = ['task-1', 'task-2'];

    return task3;
}
