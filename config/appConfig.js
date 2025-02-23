const hdiColumnIndexes = {
            hdiRank: 0, // HDI Rank (first column)
            country: 1, // Country name (second column)
            hdi: 2, // Human Development Index (third column)
            lifeExpectancy: 4, // Life expectancy at birth (fifth column)
            expectedYearsOfSchooling: 6, // Expected years of schooling (seventh column)
            meanYearsOfSchooling: 8, // Mean years of schooling (ninth column)
            gniPerCapita: 10, // Gross National Income per capita (eleventh column)
            gniRankDifference: 12 // GNI rank minus HDI rank (thirteenth column)
};

module.exports = {hdiColumnIndexes};