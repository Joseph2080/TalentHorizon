/**
 * Categorizes the connectivity level based on HDI value.
 * @param {number} hdi - Human Development Index value of the country.
 * @returns {string} - "High", "Medium", or "Low" connectivity based on the HDI.
 */
function getConnectivityLevel(hdi) {
    return hdi >= 0.8 ? 'high' : hdi >= 0.5 ? 'medium' : 'low';
}

/**
 * Categorizes the education level based on mean years of schooling.
 * @param {number|string} meanYears - Mean years of schooling in the country.
 * @returns {string} - "High", "Medium", or "Low" education level based on the years of schooling.
 */
function getEducationCategory(meanYears) {
    const mean = Number(meanYears);
    return mean >= 12 ? 'high' : mean >= 8 ? 'medium' : 'low';
}

/**
 * Transforms the input data to include country, average income, connectivity, and education level.
 * @param {Array} data - Array of objects containing data for countries.
 * @returns {Array} - Transformed data with the categories and income.
 */
function transformData(data) {
    return data.map(({country, gniPerCapita, hdi, meanYearsOfSchooling}) => ({
        country,
        averageIncomeYearly: gniPerCapita,
        connectivity: getConnectivityLevel(hdi),
        education: getEducationCategory(meanYearsOfSchooling)
    }));
}

module.exports = {transformData, getConnectivityLevel, getEducationCategory};
