function formatTenths(value, unit) {
    const formattedValue = (value / 10).toFixed(1).replace(/\.0$/, '');
    return `${formattedValue} ${unit}`;
}

export function formatDecimetersToMeters(decimeters) {
    return formatTenths(decimeters, 'm');
}

export function formatHectogramsToKilograms(hectograms) {
    return formatTenths(hectograms, 'kg');
}
