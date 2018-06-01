export default function filter(value) {
    if (value == null) {
        return () => true;
    }

    if (typeof value === 'string') {
        const reg = new RegExp(value);

        return path => reg.test(path);
    }

    return value;
}
