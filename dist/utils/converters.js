/**
 * An object providing methods to convert a string representation of a boolean value
 * to its corresponding boolean and back for attribute handling in custom elements.
 *
 * Properties:
 * - `fromAttribute`: A function that converts a string or null value from an attribute
 *   into a boolean. It interprets 'false', '0', 'off', or a null value as `false`,
 *   and all other values as `true`.
 * - `toAttribute`: A function that converts a boolean or unknown value to a string
 *   representation suitable for an attribute. It returns an empty string for truthy
 *   values and null for falsy values.
 */
export const booleanStringFalseConverter = {
    fromAttribute: (value) => value !== null && value !== 'false' && value !== '0' && value !== 'off',
    toAttribute: (value) => (value ? '' : null),
};
