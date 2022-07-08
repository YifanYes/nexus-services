/**
 * Round a input number to two decimal positions.
 * Use .toPrecision() method to avoid floating point rounding errors in intermediate calculations.
 */
const round2Fixed = (number) => {
    let result = Number((Math.abs(number) * 100).toPrecision(15));
    return (Math.round(result) / 100) * Math.sign(number);
};

module.exports = { round2Fixed };
