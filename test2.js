const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Change if needed

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Nutrient thresholds for solids and liquids
const thresholds = {
    solid: {
        calories: 250,
        sugar: 3,
        fat: 4.2,
        salt: 625
    },
    liquid: {
        calories: 70,
        sugar: 2,
        fat: null, // Not applicable
        salt: 175
    }
};

// Function to calculate percentage difference from threshold
function calculatePercentageDifference(value, threshold) {
    if (threshold === null) return null; // For nutrients without a threshold
    return ((value - threshold) / threshold) * 100;
}

// Function to analyze nutrients and calculate differences
function analyzeNutrients(productType, calories, sugar, salt, addedFat = null, servingSize) {
    const thresholdData = thresholds[productType];

    const scaledCalories = (calories / servingSize) * 100;
    const scaledSugar = (sugar / servingSize) * 100;
    const scaledSalt = (salt / servingSize) * 100;
    const scaledFat = addedFat !== null ? (addedFat / servingSize) * 100 : null;

    return {
        calories: {
            value: scaledCalories,
            threshold: thresholdData.calories,
            difference: scaledCalories - thresholdData.calories,
            percentageDiff: calculatePercentageDifference(scaledCalories, thresholdData.calories),
        },
        sugar: {
            value: scaledSugar,
            threshold: thresholdData.sugar,
            difference: scaledSugar - thresholdData.sugar,
            percentageDiff: calculatePercentageDifference(scaledSugar, thresholdData.sugar),
        },
        salt: {
            value: scaledSalt,
            threshold: thresholdData.salt,
            difference: scaledSalt - thresholdData.salt,
            percentageDiff: calculatePercentageDifference(scaledSalt, thresholdData.salt),
        },
        fat: {
            value: scaledFat,
            threshold: thresholdData.fat,
            difference: scaledFat !== null ? scaledFat - thresholdData.fat : null,
            percentageDiff: scaledFat !== null ? calculatePercentageDifference(scaledFat, thresholdData.fat) : null,
        }
    };
}

// GET request handler
app.get('/nutrients', (req, res) => {
    const { productType, calories, sugar, salt, servingSize, addedFat } = req.query;

    // Validate required parameters
    if (!productType || !calories || !sugar || !salt || !servingSize) {
        return res.status(400).json({ error: "Missing query parameters" });
    }

    const results = analyzeNutrients(
        productType,
        parseFloat(calories),
        parseFloat(sugar),
        parseFloat(salt),
        addedFat ? parseFloat(addedFat) : null,
        parseFloat(servingSize)
    );

    res.json(results);
});

// POST request handler
app.post('/nutrients', (req, res) => {
    const { productType, calories, sugar, salt, servingSize, addedFat } = req.body;

    // Validate required parameters
    if (!productType || !calories || !sugar || !salt || !servingSize) {
        return res.status(400).json({ error: "Missing body parameters" });
    }

    const results = analyzeNutrients(
        productType,
        parseFloat(calories),
        parseFloat(sugar),
        parseFloat(salt),
        addedFat ? parseFloat(addedFat) : null,
        parseFloat(servingSize)
    );

    res.json(results);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
