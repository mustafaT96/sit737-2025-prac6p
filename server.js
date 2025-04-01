const express = require('express');
const winston = require('winston');

const app = express();
const PORT = 3000;

// Create a Winston logger for logging requests
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Middleware to parse query parameters
app.use(express.json());

// Function to validate inputs
const validateNumbers = (num1, num2) => {
    if (isNaN(num1) || isNaN(num2)) {
        return "Invalid input: Both num1 and num2 should be numbers.";
    }
    return null;
};

// API Endpoints

app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

// Addition
app.get('/add', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    const error = validateNumbers(num1, num2);
    if (error) {
        logger.error(error);
        return res.status(400).json({ error });
    }

    const result = num1 + num2;
    logger.info(`Addition requested: ${num1} + ${num2} = ${result}`);
    res.json({ operation: "addition", result });
});

// Subtraction
app.get('/subtract', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    const error = validateNumbers(num1, num2);
    if (error) {
        logger.error(error);
        return res.status(400).json({ error });
    }

    const result = num1 - num2;
    logger.info(`Subtraction requested: ${num1} - ${num2} = ${result}`);
    res.json({ operation: "subtraction", result });
});

// Multiplication
app.get('/multiply', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    const error = validateNumbers(num1, num2);
    if (error) {
        logger.error(error);
        return res.status(400).json({ error });
    }

    const result = num1 * num2;
    logger.info(`Multiplication requested: ${num1} * ${num2} = ${result}`);
    res.json({ operation: "multiplication", result });
});

// Division
app.get('/divide', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    const error = validateNumbers(num1, num2);
    if (error) {
        logger.error(error);
        return res.status(400).json({ error });
    }

    if (num2 === 0) {
        logger.error("Error: Division by zero is not allowed.");
        return res.status(400).json({ error: "Division by zero is not allowed." });
    }

    const result = num1 / num2;
    logger.info(`Division requested: ${num1} / ${num2} = ${result}`);
    res.json({ operation: "division", result });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Calculator microservice running at http://localhost:${PORT}`);
});