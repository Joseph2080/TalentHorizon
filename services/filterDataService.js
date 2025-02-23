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
    return data.filter(item => {
        const meanYearsOfSchooling = parseFloat(item.meanYearsOfSchooling);
        const educationCategory = getEducationCategory(meanYearsOfSchooling);
        switch (educationLevel.toLowerCase()) {
            case 'high':
                return educationCategory === 'high';
            case 'medium':
                return educationCategory === 'medium';
            case 'low':
                return educationCategory === 'low';
            default:
                return false;
        }
    });
}

module.exports = {filterDataByOnWorkloadAndBudget, filterDataByOnConnectivity, filterDataByEducationLevel};
