function getConnectivityLevel(hdi) {
    if (hdi >= 0.8) {
        return 'High';
    } else if (hdi < 0.8 && hdi >= 0.5) {
        return 'Medium';
    } else {
        return 'Low';
    }
}

function getEducationCategory(meanYears) {
    const mean = parseFloat(meanYears);
    if (mean >= 12) {
        return 'High';
    } else if (mean >= 8 && mean < 12) {
        return 'Medium';
    } else {
        return 'Low';
    }
}

function transformData(data) {
    return data.map(item => {
        const country = item.country;
        const averageIncomeYearly = item.gniPerCapita; // GNI per capita is the average income
        const connectivity = getConnectivityLevel(item.hdi); // Connectivity based on HDI
        const education = getEducationCategory(item.meanYearsOfSchooling); // Education based on mean years of schooling

        return {
            country: country,
            averageIncomeYearly: averageIncomeYearly,
            connectivity: connectivity,
            education: education
        };
    });
}

module.exports = {transformData, getConnectivityLevel, getEducationCategory};
