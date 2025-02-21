# TalentHorizon API

## Overview
TalentHorizon is a web application that helps businesses find the best locations to hire talent based on budget, education level, and other human development factors. Businesses need to evaluate multiple factors when selecting a location, but doing so can be overwhelming and time-consuming. This API provides reliable data and actionable insights to make the best hiring location choices.

## Features
- Filter talent data based on **budget**, **workload**, **education level**, and **connectivity**.
- Perform **deep AI-powered analysis** on filtered talent data.
- **Swagger API documentation** for easy interaction and testing.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/talenthorizon.git
   cd talenthorizon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add your **OpenAI API Key** (required for `/deep-analysis` endpoint):
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### **1. Talent Analysis**
`POST /talent-analysis`

**Description:**
Filters and analyzes talent data based on provided parameters.

#### Request Body
```json
{
  "budgetThreshold": 10000000,
  "workloadThreshold": 200,
  "educationLevel": "high",
  "connectivityLevel": "high"
}
```

#### Response
```json
{
  "workforce": 40,
  "results": [
      {
        "country": "Australia",
        "averageIncomeYearly": 49257.1352,
        "connectivity": "high",
        "education": "high"
      },
      {
        "country": "Finland",
        "averageIncomeYearly": 49522.09853,
        "connectivity": "high",
        "education": "high"
      },
      {
        "country": "United Kingdom",
        "averageIncomeYearly": 46623.90269,
        "connectivity": "high",
        "education": "high"
      }
  ]
}
```

### **2. Deep Analysis**
`POST /deep-analysis`

**Description:**
Performs a deep AI-powered analysis on the given talent data.

#### Request Body
```json
{
  "data": {
    "location": "Country",
    "averageIncomeYearly": "Income in $",
    "educationLevel": "high",
    "connectivity": "medium"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": "AI-generated insights based on the provided data."
}
```

## Acceptable Parameter Values
- **educationLevel**: `high`, `medium`, `low`
- **connectivityLevel**: `high`, `medium`, `low`

## Swagger Documentation
The API documentation is available at:
```
http://localhost:3000/api-docs
```


