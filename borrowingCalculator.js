/**
 * Borrowing Power Calculator
 * 
 * Tayla's prototype. 
 * This currently calculates what a user can borrow over 30 years.
 * Currently this code uses API calls to recieve tax and HEM values. 
 * 
 * A server.js has been provided to supply these values.
 */

// Global constant for mortgage simulation
const LOAN_TERM_MONTHS = 360; // 30 Years
const INTEREST_RATE = 7; // 7.0% baseline interest rate
const ASSESSMENT_RATE_BUFFER = 3.0; // 3.0% buffer added to interest rates

// ====================
// API Functions
// ====================

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
			throw new Error(`API Error: ${response.status}`);
		}

		const taxData = await response.json();

		return Math.round(taxData.tax);

	} catch (error) {
		console.log('Error', error);
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
			throw new Error(`API Error: ${response.status}`);
		}

		const hemData = await response.json();

		return hemData.hem;

	} catch (error) {
		console.log('Error', error);
		throw error;
	}
}

// ====================
// Calculator Functions
// ====================

async function calculateBorrowingPower(income, dependents, expenses, creditLimits, annualAssessmentRate) {

	// 1. Calculate Net Monthly Income after tax deductions
	const annualTax = await getTax(income);
	const netMonthlyIncome = (income - annualTax) / 12;

	// 2. Determine living expenses (User declared expenses vs HEM baseline, whichever is higher)
	const baselineHEM = await getHEM(income, dependents);
	const totalLivingExpenses = Math.max(expenses, baselineHEM);

	// 3. Calculate credit card liability (~3% of total limits)
	const creditCardLiability = creditLimits * 0.03;

	// 4. Calculate monthly repayment capacity
	const maxMonthlyRepayment = netMonthlyIncome - totalLivingExpenses - creditCardLiability;

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

// ====================
// Input validation
// ====================

function askInput(rl, prompt) {
	//asks for input and recieves promise
	return new Promise((resolve) => rl.question(prompt, resolve));
}

function validateInput(input, label) {
	let error;
	//trim to check for no or space input
	const trimmed = input ? String(input).trim() : "";

	if (!trimmed) {
		error = new Error(`Provide ${label.toLowerCase()} parameter.`);
		error.type = `${label} is required.`
		throw error;
	}

	const value = parseFloat(trimmed);

	//checks if the value is a number
	if (!Number.isFinite(value)) {
		//Error message for entered is not a number
		error = new Error(`${label} must be a number.`);
		error.type = `Invalid ${label.toLowerCase()}`;

		throw error;
	}

	//checks if the value is negetive
	if (value < 0) {
		//Error message for entered is a negetive number
		error = new Error(`${label} must be a non-negative number.`);
		error.type = `Invalid ${label.toLowerCase()}`;

		throw error;
	}

	return value;
}

// ====================
// Error output
// ====================

function consoleError(error, message) {

	//standard error message format
	console.log("\n--- Error ---");
	console.log(`Error: ${error}`);
	console.log(`Message: ${message}`);
}

function loanIneligible() {

	//message printed early if person is completely ineligible for a loan
	console.log("\n--- Sorry, you are not eligible for a loan ---")
	console.log(`Maximum Borrowing Power at ${INTEREST_RATE}%: $0`);
	console.log(`Assumed Monthly Mortgage Repayment: $0`);
}

// ====================
// Console Functions
// ====================

async function runConsoleMode() {
	const readline = require('readline');
	//recieves input from console
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

	console.log("Mortgage Borrowing Power Calculator");
	console.log("===================================");

	let income;
	//asks for income until recieves valid input
	while (income === undefined) {
		try {
			const incomeInput = await askInput(rl, "Gross Annual Income: $");
			income = validateInput(incomeInput, "Income");

			if (income === 0)
			{
				//return early if no income
				loanIneligible();
				rl.close();
				return (0);
			}
		} catch (error) {
			consoleError(error.type, error.message);
		}
	}

	let dependents;
	//asks for dependents until recieves valid input
	while (dependents === undefined) {
		try {
			const dependentsInput = await askInput(rl, "Number of Dependents: ");
			dependents = validateInput(dependentsInput, "Dependents");
		} catch (error) {
			consoleError(error.type, error.message);
		}
	}

	let expenses;
	//asks for expenses until recieves valid input
	while (expenses === undefined) {
		try {
			const expensesInput = await askInput(rl, "Declared Monthly Expenses: $");
			expenses = validateInput(expensesInput, "Expenses");
			if (expenses >= income/12)
			{
				//return early monthly expenses are more then monthly income
				loanIneligible();
				rl.close();
				return 0;
			}
		} catch (error) {
			consoleError(error.type, error.message);
		}
	}

	let creditLimits;
	//asks for creditLimit until recieves valid input
	while (creditLimits === undefined) {
		try {
			const creditLimitsInput = await askInput(rl, "Total Credit Card Limits: $");
			creditLimits = validateInput(creditLimitsInput, "Credit limits");
		} catch (error) {
			consoleError(error.type, error.message);
		}
	}

	//calculate assessmentRate;
	const assessmentRate = INTEREST_RATE + ASSESSMENT_RATE_BUFFER;

	//pass inputs to calculateBorrowingPower function
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
