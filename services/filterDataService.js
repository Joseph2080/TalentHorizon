const {getEducationCategory, getConnectivityLevel} = require("./util/util");

function filterDataByOnConnectivity(data, expectedConnectivityLevel) {
    return data.filter(item => {
        const hdi = parseFloat(item.hdi);
        const connectivityLevel = getConnectivityLevel(hdi);
        return expectedConnectivityLevel.toLowerCase() === connectivityLevel;
    });
}

function filterDataByOnWorkloadAndBudget(data, workloadThreshold, hiringBudgetThreshold) {
    const threshold = hiringBudgetThreshold / workloadThreshold;
    return data.filter(item => {
        const gniPerCapita = parseFloat(item.gniPerCapita);
        return gniPerCapita < threshold;
    });
}

function filterDataByEducationLevel(data, educationLevel) {
    const level = educationLevel.toLowerCase();
    return data.filter(({ meanYearsOfSchooling }) => {
        const category = getEducationCategory(parseFloat(meanYearsOfSchooling));
        return category === level;
    });
}

module.exports = {filterDataByOnWorkloadAndBudget, filterDataByOnConnectivity, filterDataByEducationLevel};
