const prompt = (data) => {
    return `Based on the following data, provide an analysis and ranking of countries
     best suited for hiring workers, create a report on this:
    ${JSON.stringify(data)}`;
};

module.exports = {prompt};