require('dotenv').config();
const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {
    filterDataBasedOnWorkloadAndBudget,
    filterDataByEducationLevel,
    filterDataBasedOnConnectivity
} = require("./services/filterDataService");
const {extractData} = require("./services/extractDataService");
const {transformData} = require("./services/util/util");
const {analyzeData} = require("./services/openAIService");
const {prompt} = require("./config/promptConfig");

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
    apis: ['./server.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

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
        const {budgetThreshold, workloadThreshold, educationLevel, connectivityLevel} = req.body;

        if (!budgetThreshold || !workloadThreshold || !educationLevel || !connectivityLevel) {
            return res.status(400).json({error: "Missing required fields: budget, workload, educationLevel, connectivityLevel"});
        }

        const dataFilePath = path.join(__dirname, "data", "HDR23-24_Statistical_Annex_HDI_Table.xlsx");
        const hdiData = extractData(dataFilePath);
        console.log("$hdiData = ", hdiData);
        const resultByWorkloadAndBudget = filterDataBasedOnWorkloadAndBudget(hdiData, workloadThreshold, budgetThreshold);
        console.log("$resultByWorkloadAndBudget = ", resultByWorkloadAndBudget);
        const resultByEducationLevel = filterDataByEducationLevel(resultByWorkloadAndBudget, educationLevel);
        console.log("$resultByEducationLevel = ", resultByEducationLevel);
        const resultByConnectivity = filterDataBasedOnConnectivity(resultByEducationLevel, connectivityLevel);
        console.log("$resultByConnectivity = ", resultByConnectivity);
        const result = transformData(resultByConnectivity);
        const cleanResults = cleanUpData(result);
        res.status(200).json({
            workforce: workloadThreshold,
            cleanResults
        });
    } catch (error) {
        console.error("Error in /talent-analysis endpoint:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

function cleanUpData(data) {
    return data.filter(item => {
        return !Object.values(item).some(value => value.toString().toLowerCase() === 'unknown');
    })
}

/**
 * @swagger
 * /deep-analysis:
 *   post:
 *     summary: Perform a deep analysis on the provided talent data.
 *     description: Analyzes the given data and provides insights using AI-powered analysis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Successful response with analysis data.
 *       500:
 *         description: Internal server error.
 */
app.post('/deep-analysis', async (req, res) => {
    try {
        const data = req.body;
        const analysis = await analyzeData(prompt(data));
        res.status(200).json({success: true, data: analysis});
    } catch (error) {
        console.error("Error in /deep-analysis endpoint:", error.message);
        res.status(500).json({success: false, error: "Failed to analyze data. Please try again."});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
