const fs = require("fs");
const xlsx = require("node-xlsx").default;

function extractData(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Excel file not found at ${filePath}`);
    }
    console.log("File found at", filePath);

    const worksheet = xlsx.parse(filePath);
    const sheet = worksheet[0];
    console.log("Sheet Name:", sheet.name);

    const data = sheet.data;

    const headerRowIndex = data.findIndex(row => row.includes("HDI rank"));
    if (headerRowIndex === -1) {
        throw new Error("Header row not found. Please check the Excel file structure.");
    }

    const headers = data[headerRowIndex];
    const rows = data.slice(headerRowIndex + 1); // The actual data starts after the header row

    console.log("Headers Identified:", headers);

    // Directly map column indexes for each value
    const columnIndexes = {
        hdiRank: 0, // HDI Rank is in the first column
        country: 1, // Country is in the second column
        hdi: 2, // HDI Value is in the third column
        lifeExpectancy: 4, // Life Expectancy is in the 5th column (Index 4)
        expectedYearsOfSchooling: 6, // Expected years of schooling is in the 6th column (Index 5)
        meanYearsOfSchooling: 8, // Mean years of schooling is in the 7th column (Index 6)
        gniPerCapita: 10, // GNI per capita is in the 8th column (Index 7)
        gniRankDifference: 12 // GNI rank difference is in the 9th column (Index 8)
    };

    const jsonData = rows
        .filter(row => row.length > 0) // Filter out rows that are empty or invalid
        .map(row => {
            return {
                hdiRank: row[columnIndexes.hdiRank] || "Unknown",
                country: row[columnIndexes.country] || "Unknown", // Get the country from the same row as the data
                hdi: row[columnIndexes.hdi] || "Unknown", // HDI value column
                lifeExpectancy: row[columnIndexes.lifeExpectancy] || "Unknown",
                expectedYearsOfSchooling: row[columnIndexes.expectedYearsOfSchooling] || "Unknown",
                meanYearsOfSchooling: row[columnIndexes.meanYearsOfSchooling] || "Unknown",
                gniPerCapita: row[columnIndexes.gniPerCapita] || "Unknown",
                gniRankDifference: row[columnIndexes.gniRankDifference] || "Unknown",
            };
        });
    return jsonData;
}

module.exports = { extractData };
