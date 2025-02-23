require('dotenv').config();
const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {
    filterDataByOnWorkloadAndBudget,
    filterDataByEducationLevel,
    filterDataByOnConnectivity
} = require("./services/filterDataService");
const {extractData} = require("./services/extractDataService");
const {transformData} = require("./services/util/util");
const {analyzeData} = require("./services/openAIService");
const {prompt} = require("./config/promptConfig");
const {hdiColumnIndexes} = require("./config/appConfig");

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TalentHorizon',
            version: '1.0.0',
            description: 'API for analyzing and filtering talent data based on various parameters.',
        },
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const dataFilePath = path.join(__dirname, "data", "HDR23-24_Statistical_Annex_HDI_Table.xlsx");

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(bodyParser.json());

/**
 * @swagger
 * /talent-analysis:
 *   post:
 *     summary: Analyze talent based on workload, budget, education level, and connectivity.
 *     description: Perform filtering and analysis of talent data based on the provided parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budgetThreshold:
 *                 type: integer
 *               workloadThreshold:
 *                 type: integer
 *               educationLevel:
 *                 type: string
 *               connectivityLevel:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response with filtered talent data.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */
app.post('/talent-analysis', (req, res) => {
    try {
        const results = talentAnalysis(req.body);
        res.status(200).json({
            results
        });
    } catch (error) {
        console.error("Error in /talent-analysis endpoint:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

/**
 * @swagger
 * /comprehensive-analysis:
 *   post:
 *     summary: Perform a comprehensive talent analysis with AI insights.
 *     description: Filters, cleans, and deeply analyzes talent data based on the provided parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budgetThreshold:
 *                 type: integer
 *               workloadThreshold:
 *                 type: integer
 *               educationLevel:
 *                 type: string
 *               connectivityLevel:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response with AI-analyzed talent data.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */
app.post('/comprehensive-analysis', async (req, res) => {
    try {
        const results = talentAnalysis(req.body);
        const analysis = await analyzeData(prompt(results));
        res.status(200).json({
            analysis
        });
    } catch (error) {
        console.error("Error in /comprehensive-analysis endpoint:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

function talentAnalysis(requestBody) {
    validateRequestBody(requestBody);
    const hdiData = extractData(dataFilePath, hdiColumnIndexes);
    return processTalentData(hdiData, requestBody);
}

function cleanUpData(data) {
    return data.filter(item => {
        return !Object.values(item).some(value => value.toString().toLowerCase() === 'unknown');
    })
}

function processTalentData(hdiData, {budgetThreshold, workloadThreshold, educationLevel, connectivityLevel}) {
    let filteredData = filterDataByOnWorkloadAndBudget(hdiData, workloadThreshold, budgetThreshold);
    filteredData = filterDataByEducationLevel(filteredData, educationLevel);
    filteredData = filterDataByOnConnectivity(filteredData, connectivityLevel);
    const transformedData = transformData(filteredData);
    return cleanUpData(transformedData);
}

function validateRequestBody(requestBody) {
    const {budgetThreshold, workloadThreshold, educationLevel, connectivityLevel} = requestBody;
    if (!budgetThreshold || !workloadThreshold || !educationLevel || !connectivityLevel) {
        return res.status(400).json({error: "Missing required fields: budget, workload, educationLevel, connectivityLevel"});
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
