const {getConnectivityLevel, getEducationCategory} = require("./util/util");

function filterDataBasedOnConnectivity(data, requiredConnectivityLevel){
    return data.filter(item => {
        const hdi = parseFloat(item.hdi); // Retrieve HDI value
        //this is a temporary solution to find the level of connectivity in a geographic location. due to time constraints,
        // find a way to aggregate data from multiple sources such as broadband datasets would have beeb time consuming,
        // and due to the large group of team members who did not actively attend, so with little time and resources,
        // we decided to use the human development index to determine how connected users are to the internet as we
        // correlate high access to internet to hdi, which is not 100% accurate but does get the job done.
        const connectivityLevel = getConnectivityLevel(hdi);
        return  requiredConnectivityLevel === connectivityLevel;
    });
}
function filterDataBasedOnWorkloadAndBudget(data, workloadThreshold, hiringBudgetThreshold) {
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
        if (educationLevel === 'High') {
            return educationCategory === 'High';
        } else if (educationLevel === 'Medium') {
            return educationCategory === 'Medium';
        } else if (educationLevel === 'Low') {
            return educationCategory === 'Low';
        } else {
            return false;
        }
    });
}

module.exports = {filterDataBasedOnWorkloadAndBudget, filterDataByEducationLevel,filterDataBasedOnConnectivity};
