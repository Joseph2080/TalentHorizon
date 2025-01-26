const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {filterDataBasedOnWorkloadAndBudget, filterDataByEducationLevel, filterDataBasedOnConnectivity} = require("./services/filterDataService");
const {extractData} = require("./services/extractDataService");
const {transformData} = require("./services/util/util");
const {analyzeData} = require("./services/openAIService");
const {prompt} = require("./config/promptConfig");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger setup
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
 *     summary: Analyze and filter talent data based on workload, budget, education level, and connectivity.
 *     description: This endpoint processes the provided data and returns a filtered report.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budgetThreshold:
 *                 type: number
 *               workloadThreshold:
 *                 type: number
 *               educationLevel:
 *                 type: string
 *               connectivityLevel:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully filtered and transformed talent data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workforce:
 *                   type: number
 *                 result:
 *                   type: object
 *       400:
 *         description: Missing required fields in the request.
 *       500:
 *         description: Internal server error.
 */
app.post('/talent-analysis', (req, res) => {
    try {
        const userParameters = req.body;
        const budgetThreshold = userParameters.budgetThreshold;
        const workThreshold = userParameters.workloadThreshold;
        const educationLevel = userParameters.educationLevel;
        const connectivityLevel = userParameters.connectivityLevel;
        if (!budgetThreshold || !workThreshold || !educationLevel || !connectivityLevel) {
            return res.status(400).json({ error: "missing required fields: budget, workload, educationLevel" });
        }
        const dataFilePath = path.join(__dirname, "data", "HDR23-24_Statistical_Annex_HDI_Table.xlsx");
        const hdiData = extractData(dataFilePath);
        const resultByWorkloadAndBudget = filterDataBasedOnWorkloadAndBudget(hdiData, workThreshold, budgetThreshold);
        const resultByEducationLevel = filterDataByEducationLevel(resultByWorkloadAndBudget, educationLevel);
        const resultByConnectivity = filterDataBasedOnConnectivity(resultByEducationLevel, connectivityLevel);
        const result = transformData(resultByConnectivity);
        const report = { workforce: workThreshold, result };
        res.status(200).send(report);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /deep-analysis:
 *   post:
 *     summary: Perform a deep analysis on provided data.
 *     description: This endpoint uses AI to analyze the provided data based on the given prompt.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully analyzed the provided data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       500:
 *         description: Internal server error.
 */
app.post('/deep-analysis', async (req, res) => {
    try {
        const data = req.body;
        const analysis = await analyzeData(prompt(data));
        res.status(200).json({ success: true, data: analysis });
    } catch (error) {
        console.error("error in /analysis endpoint:", error.message);
        res.status(500).json({ success: false, error: "failed to analyze data. Please try again." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
