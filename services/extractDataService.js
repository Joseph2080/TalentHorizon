const fs = require("fs");
const xlsx = require("node-xlsx").default;

function validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Excel file not found at ${filePath}`);
    }
    console.log("File found at", filePath);
}

function loadWorksheet(filePath) {
    const sheets = xlsx.parse(filePath);
    if (!sheets.length) {
        throw new Error("No sheets found in the Excel file.");
    }
    console.log("Sheet Name:", sheets[0].name);
    return sheets[0].data;
}

function getHeaderRowIndex(data, headerLabel) {
    const index = data.findIndex(row => row.includes(headerLabel));
    if (index === -1) {
        throw new Error("Header row not found. Please check the Excel file structure.");
    }
    return index;
}

function extractJsonData(data) {
    const columnIndexes = {
        hdiRank: 0, // HDI Rank (first column)
        country: 1, // Country name (second column)
        hdi: 2, // Human Development Index (third column)
        lifeExpectancy: 4, // Life expectancy at birth (fifth column)
        expectedYearsOfSchooling: 6, // Expected years of schooling (seventh column)
        meanYearsOfSchooling: 8, // Mean years of schooling (ninth column)
        gniPerCapita: 10, // Gross National Income per capita (eleventh column)
        gniRankDifference: 12 // GNI rank minus HDI rank (thirteenth column)
    };

    return data
        .filter(row => row.length > 0)
        .map(row => mapRowToObject(row, columnIndexes));
}

function mapRowToObject(row, columnIndexes) {
    return Object.fromEntries(
        Object.entries(columnIndexes).map(([key, index]) => [key, row[index] || "unknown"])
    );
}

function extractData(filePath) {
    validateFile(filePath);
    const data = loadWorksheet(filePath);
    const headerRowIndex = getHeaderRowIndex(data, "HDI rank");
    const rows = data.slice(headerRowIndex + 1);
    return extractJsonData(rows);
}

module.exports = { extractData };
