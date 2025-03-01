export const extractNumber = (text) => {
    // Split by spaces
    const words = text.split(' ');

    // Find the first word that can be converted to a number
    for (const word of words) {
        const num = parseInt(word);
        if (!isNaN(num)) {
        return num;
        }
    }

    return null;
};

export const extractTextAfterNumber = (text) => {
    // Find the first number in the string
    const match = text.match(/\d+/);

    if (!match) {
        return null; // No number found
    }

    // Get the index where the number ends
    const numberEndIndex = match.index + match[0].length;

    // Return everything after the number, trimming any leading whitespace
    return text.substring(numberEndIndex).trim();
};