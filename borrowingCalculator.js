/**
 * Borrowing Power Calculator
 * 
 * Gen's incomplete prototype. 
 * This currently calculates what a user can borrow over 30 years.
 * Currently this code uses placeholder methods for Tax and HEM values. 
 * 
 * TODO: Refactor the code to pull Tax and HEM values from an API call.
 * A server.js has been provided to supply these values.
 */

// Global constant for mortgage simulation
const LOAN_TERM_MONTHS = 360; // 30 Years
const INTEREST_RATE = 7; // 7.0% baseline interest rate
const ASSESSMENT_RATE_BUFFER = 3.0; // 3.0% buffer added to interest rates

// Legacy placeholder functions to replace with API calls
async function getTax(income) {
    //Variables for API call
    const url = `http://localhost:3000/api/tax?income=${encodeURIComponent(income)}`;
    const PAT = "pat_abcdefghijklmnopqrstuvwxyz0123456789";

    try {
        //fetch API - place into var response
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PAT}`,
                // Auth token - need to access API
            }
        });
        //if the API call fails
        if (!response.ok) {
            const errorText = await response.text();
            //TO UPDATE LATER
            throw new Error(`API Error: ${response.status}`);
        }

        const taxData = await response.json();
        console.log(taxData);

        return Math.round(taxData.tax);

    } catch (error) {
        console.log('Error', error);
        //TO UPDATE LATER
        throw error;

    }

}

async function getHEM(income, dependents) {
    //API variable here
    const url = `http://localhost:3000/api/hem?income=${encodeURIComponent(income)}&dependents=${encodeURIComponent(dependents)}`;
    const PAT = "pat_abcdefghijklmnopqrstuvwxyz0123456789";

    try {
        //fetch API - place into var response
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PAT}`,
                // Auth token - need to access API
            }
        });
        //if the API call fails
        if (!response.ok) {
            const errorText = await response.text();
            //TO UPDATE LATER
            throw new Error(`API Error: ${response.status}`);
        }

        const hemData = await response.json();
        console.log(hemData);

        return 2000 + hemData.hem;

    } catch (error) {
        console.log('Error', error);
        //TO UPDATE LATER
        throw error;
    }
}

/**
 * Calculates the total borrowing power amount and the monthly repayment configuration
 */
async function calculateBorrowingPower(income, dependents, expenses, creditLimits, annualAssessmentRate) {
    
    // 1. Calculate Net Monthly Income after tax deductions
    const annualTax = await getTax(income);
    const netMonthlyIncome = (income - annualTax) / 12;

    // 2. Determine living expenses (User declared expenses vs HEM baseline, whichever is higher)
    const baselineHEM = await getHEM(income, dependents);
    const totalLivingExpenses = Math.max(expenses, baselineHEM);
    console.log(totalLivingExpenses);

    // 3. Calculate credit card liability (~3% of total limits)
    const creditCardLiability = creditLimits * 0.03;

    // 4. Calculate monthly repayment capacity
    const maxMonthlyRepayment = netMonthlyIncome - totalLivingExpenses - creditCardLiability;
    console.log(maxMonthlyRepayment);

    // Return early if user cannot afford a loan at all
    if (maxMonthlyRepayment <= 0) {
        return { maxLoanAmount: 0, monthlyRepayment: 0 };
    }

    // 5. Calculate the monthly interest rate
    const monthlyRate = (annualAssessmentRate / 100) / 12;

    // 6. Calculate maximum borrowing power using the following formula:
    // P = M * (1 - (1 + R)^-N) / R
    const maxLoanAmount = maxMonthlyRepayment * ((1 - Math.pow(1 + monthlyRate, - LOAN_TERM_MONTHS)) / monthlyRate);

    return {
        maxLoanAmount: Number(maxLoanAmount.toFixed(2)),
        monthlyRepayment: Number(maxMonthlyRepayment.toFixed(2))
    };
}


function askInput(rl, prompt) {
    return new Promise((resolve) => rl.question(prompt, resolve));
}

function validateInput(input, key, label) {
    const trimmed = input ? String(input).trim() : "";
    //const value = parseFloat(input)
    if (!trimmed) {
        throw new Error(`${key} is required`);
    }

    const value = parseFloat(trimmed);

    if (!Number.isFinite(value) || value < 0) {
        throw new Error(`Entered ${label} is invalid`);
    }
    return value;
}

function consoleError(error, message) {
    console.log(JSON.stringify({
        error: error,
        message: message
    }, null, 2))
}

async function runConsoleMode() {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log("Mortgage Borrowing Power Calculator");
    console.log("===================================");

        let income;
        while (income === undefined) {
            try {
                    const incomeInput = await askInput(rl, "Gross Annual Income: $");
                    income = validateInput(incomeInput, "Income", "income");
                    if (income === 0)
                    {
                        return { maxLoanAmount: 0, monthlyRepayment: 0 };
                    }
            } catch (error) {
                consoleError(error.message, "Provide income parameter");
            }
        }

        let dependents;
        while (dependents === undefined) {
            try {
                    const dependentsInput = await askInput(rl, "Number of Dependents: ");
                    dependents = validateInput(dependentsInput, "Dependents", "dependents");
            } catch (error) {
                consoleError(error.message, "Provide dependents parameter");
            }
        }

        let expenses;
        while (expenses === undefined) {
            try {
                    const expensesInput = await askInput(rl, "Declared Monthly Expenses: $");
                    expenses = validateInput(expensesInput, "Expenses", "expenses");
            } catch (error) {
                consoleError(error.message, "Provide expenses parameter");
            }
        }

        let creditLimits;
        while (creditLimits === undefined) {
            try {
                    const creditLimitsInput = await askInput(rl, "Total Credit Card Limits: $");
                    creditLimits = validateInput(creditLimitsInput, "Credit limits", "credit limits");
            } catch (error) {
                consoleError(error.message, "Provide credit limits parameter");
            }
        }


        const assessmentRate = INTEREST_RATE + ASSESSMENT_RATE_BUFFER;

        const result = await calculateBorrowingPower(
            income,
            dependents,
            expenses,
            creditLimits,
            assessmentRate
            );
        
        console.log("\n--- Calculation Summary ---");
        console.log(`Maximum Borrowing Power at ${INTEREST_RATE}%: $${result.maxLoanAmount.toLocaleString()}`);
        console.log(`Assumed Monthly Mortgage Repayment: $${result.monthlyRepayment.toLocaleString()} over 30 years`);

        rl.close();
}



if (require.main === module) {
    runConsoleMode();
}

module.exports = { calculateBorrowingPower };