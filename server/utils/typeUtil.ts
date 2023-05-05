export const convertToString = (value: unknown): string => {
    if (typeof value === 'string') {
        return value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
        return value.toString();
    } else {
        return '';
    }
}