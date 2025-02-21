/**
 * Categorizes the connectivity level based on HDI value.
 * @param {number} hdi - Human Development Index value of the country.
 * @returns {string} - "High", "Medium", or "Low" connectivity based on the HDI.
 */
function getConnectivityLevel(hdi) {
    if (hdi >= 0.8) {
        return 'high';
    } else if (hdi >= 0.5) {
        return 'medium';
    } else {
        return 'low';
    }
}

function getEducationLevel(educationLevel) {
    const level = educationLevel.toLowerCase();
    switch (level) {
        case 'high':
            return level === 'high';
        case 'medium':
            return level === 'medium';
        case 'low':
            return level === 'low';
        default:
            return false;
    }
}

/**
 * Categorizes the education level based on mean years of schooling.
 * @param {number|string} meanYears - Mean years of schooling in the country.
 * @returns {string} - "High", "Medium", or "Low" education level based on the years of schooling.
 */
function getEducationCategory(meanYears) {
    const mean = parseFloat(meanYears);
    if (mean >= 12) {
        return 'high';
    } else if (mean >= 8) {
        return 'medium';
    } else {
        return 'low';
    }
}

/**
 * Transforms the input data to include country, average income, connectivity, and education level.
 * @param {Array} data - Array of objects containing data for countries.
 * @returns {Array} - Transformed data with the categories and income.
 */
function transformData(data) {
    return data.map(item => {
        const country = item.country;
        const averageIncomeYearly = item.gniPerCapita; // GNI per capita as the average income
        const connectivity = getConnectivityLevel(item.hdi); // Connectivity based on HDI
        const education = getEducationCategory(item.meanYearsOfSchooling); // Education based on mean years of schooling

        return {
            country,
            averageIncomeYearly,
            connectivity,
            education
        };
    });
}

module.exports = {transformData, getConnectivityLevel, getEducationCategory};
