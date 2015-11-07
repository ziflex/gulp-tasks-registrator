export default function factory(arg1, arg2) {
    return function task() {
        return {arg1, arg2};
    };
}
