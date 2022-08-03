/**
 * Round a input number to two decimal positions.
 * Use .toPrecision() method to avoid floating point rounding errors in intermediate calculations.
 */
const round2Fixed = (number) => {
    let result = Number((Math.abs(number) * 100).toPrecision(15));
    return (Math.round(result) / 100) * Math.sign(number);
};

// Parse BigInt data type to JSON readable
const toJson = (data) => {
    if (data !== undefined) {
        return JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? `${v}#bigint` : v)).replace(
            /"(-?\d+)#bigint"/g,
            (_, a) => a
        );
    }
};

module.exports = { round2Fixed, toJson };
