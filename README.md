# Tayla's Borrowing Calculator

A JavaScript based borrowing calculator built for the Ferocia Junior Software Engineer take-home exercise.
The calculator collects income, dependents, monthly expenses and credit liability to perform calculations.

## How it works

1. The user enters financial information.
2. If income is 0 return loan ineligible.
3. Income input to tax API to determine yearly tax.
4. Dependents and income input used in HEM API to determine assumed expenses. 
5. Calc finds monthly income post tax deduction.
6. Calc uses higher delcared expenses or HEM.
7. Monthly repayment is calculated, income(post tax) minus expenses and credit liability.
8. Use this to calculate total borrowing power.

## Assumptions

- An income of 0 means the user is ineligible for a loan.
- Monthly expenses is larger then monthly income means user is ineligible for a loan.
- '0' is a valid input for all fields.

## Design Decisions

### Return Early

```text
Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $20000
Number of Dependents: 0
Declared Monthly Expenses: $10000

--- Sorry, you are not eligible for a loan ---
Maximum Borrowing Power at 7%: $0
Assumed Monthly Mortgage Repayment: $0
```

When values which will not be eligible for a loan are entered. Income = 0 or Monthly Expenses > Monthly income - the loan borrowing is returned early with ineligibility message. 

**Purpose:**
- Clarity: clear ineligibility message.
- Cause and effect: returns after step which makes user ineligible.
- Time efficency: More time efficent for code and user if ineligible. 

## Looped input when invalid

```text
=Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $-90

--- Error ---
Error: Invalid income
Message: Income must be a non-negative number.
Gross Annual Income: $

--- Error ---
Error: Income is required.
Message: Provide income parameter.
Gross Annual Income: $
```

When no value is entered (null), a negetive value, or a non number value is entered in one of the fields, the prompt is repeated asking for new input. This was chosen to improve experience, allowing user to reenter valid without reentering the program.

**Purpose:**
- Ease of use: makes the calculator more forgiving to user error.
- Error message: it makes error messages and prompting more useful.

### Console Message Consistency 

```text 
--- Error ---
Error: Income is required.
Message: Provide income parameter.
```
```text 
--- Calculation Summary ---
Maximum Borrowing Power at 7%: $466,248.77
Assumed Monthly Mortgage Repayment: $4,091.67 over 30 years
```

I chose to use the calculation summary styling as a guide for console messages. Doing this creates visual consistency and the "Error" banner above the message made it more obvious to users.

**Purpose:**
- Make error message more aligned with the UI experience of the borrowing calculator.
- Draw attention to message/error which provide further guidence for user input.

## Tradeoffs

### Validation vs complexity

I focused on key user error cases(no input, non number input and negetive number input). I did not impliment upper bounds or other extreme use cases at this time.

### Error consistency vs Ease of use

For coding simplicity and behaviour I chose to impliment error message for not filling in any field. Potentially it would be better to allow for no entry and assume 0 for nonessential (dependents, credit limit), but I chos consistency to make behaviour more predictable.

### Testing vs time

I focused on testing the core functions of the Borrowing Calculator and the provided edge cases, rather then attempting to aachieve exhaustive test coverage.

## Testing

### Phase 1: Tax API Integration & Debugging

#### 1. Inital testing of Tax API

```text
Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $90000
Number of Dependents: 0
Declared Monthly Expenses: $900
Total Credit Card Limits: $9000

--- Calculation Summary ---
Maximum Borrowing Power at 7%: $NaN
Assumed Monthly Mortgage Repayment: $NaN over 30 years
--- API RAW DATA OUTPUT ---
{ income: 90000, tax: 14500 }
Type of data: object
---------------------------
```

**Observation:**
- Raw Data logs { income: 90000, tax: 14500 }.
- Logs after Calculation Summery (async issue).
- ($NaN) - Tax data does not reach calc.

**Next Action:**
- Apply async to functions.
- Return tax to main borrowing calc

#### 2. Apply async to functions

```text
Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $90000
Number of Dependents: 0
Declared Monthly Expenses: $900
Total Credit Card Limits: $9000
--- TEST TAX DATA ---
14500
Type of data: number
---------------------------

--- Calculation Summary ---
Maximum Borrowing Power at 7%: $458,272.21
Assumed Monthly Mortgage Repayment: $4,021.67 over 30 years
```

**Observation:**
- Borrow Calculator now has simple function using tax API.
- Currently has unnecessary test log.

**Next Action:**
- Remove tax API test.
- Add comments & Math.round()
- Commit.
- Start HEM API.

### Phase 2: HEM API Integration & Debugging

#### 1. Test HEM API

```text
Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $90000
Number of Dependents: 0
Declared Monthly Expenses: $900
Total Credit Card Limits: $9000
---TEST RAW DATA OUTPUT---
{ income: 90000, dependents: 0, hem: 2200 }
Type of data object
------------

--- Calculation Summary ---
Maximum Borrowing Power at 7%: $NaN
Assumed Monthly Mortgage Repayment: $NaN over 30 years
```
**Observation:**
- Raw data logs { income: 90000, dependents: 0, hem: 2200 }.
- Use hemData.hem to review relevent info.
- ($NaN) HEM data does not reach calc.

**Next Action:**
- test .hem only.
- return HEM to borrowing calc function

#### 2. Return HEM

```text
 Borrowing Power Calculator
===================================
Gross Annual Income: $90000
Number of Dependents: 1
Declared Monthly Expenses: $900
Total Credit Card Limits: $9000

--- Calculation Summary ---
Maximum Borrowing Power at 7%: $378,506.64
Assumed Monthly Mortgage Repayment: $3,321.67 over 30 years
```

**Observation:**
- Returns and applies both HEM and Tax API

**Next Action:**
- Error message handling.
- Testing for boundies.

### Phase 3: Debugging No Input

#### 1. Inital test No input

```text
Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $
Number of Dependents: 
Declared Monthly Expenses: $
Total Credit Card Limits: $
Error Error: API Error: 400
```

**Test:**
Not entering any field

**Desired Output:**
  - "error": "Income is required",
  - "message": "Provide income parameter"


#### 2. Input throw error
- now throws error when input is invalid

```text
Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $
/Users/taylaahmed/Developer/ferocia-junior-swe-take-home/borrowingCalculator.js:130
        throw new Error("...Error");
```

**Observation:**
- Exits/close.
- Does not return/log error message.

**Next Action:**
- While input function.
- Catching error and log message.

#### 3. While look for Income Input

``` text
Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $
Provide income parameter
Gross Annual Income: $
Provide income parameter
```

**Observation:**
- Is no longer closing on incorrect input.
- Need to check desired output/log.

**Next Action:**
- Check server.md for error output structure.

#### 4. Log correct error message

```text 
Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $
{
  "error": "Income is required",
  "message": "Provide income parameter"
}
Gross Annual Income: $
```

or 

```text
{
  "error": "Entered income is invalid",
  "message": "Provide income parameter"
}
```

**Observation**


### Phase 4: Debug all invalid input

#### 1. Debug for all numerical invalid

**Current:**
```text
Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $
{
    "error": "Entered income is invalid",
    "message": "Provide income parameter"
}
Gross Annual Income: $500
Number of Dependents: 
Declared Monthly Expenses: $
Total Credit Card Limits: $
```

**Obervation:**
- Only provided error messages for one input.
- Provide generic message no matter input.

**Test:**
- Undefined input
- Invalid number (negitive)

**Desired Output:**
  - "error": "Income is required". - No input
  - "message": "Provide income parameter".
  or 
  - "error": "Entered income is invalid". - negetive input

**Updated Output**
```text
{
  "error": "Entered ${input field} is invalid",
  "message": "Provide ${input field} parameter"
}
```
#### 2. Handling text input

current:
```text
{
  "error": "Dependents is required",
  "message": "Provide dependents parameter"
}
```

**Desired Output:**
"error": "Entered income is invalid"

**Updated Output:**
```text
Gross Annual Income: $hii
{
  "error": "Entered income is invalid",
  "message": "Provide income parameter"
}
```

#### 3. Stylisation of error messages

```text
--- Error ---
Error: Credit limits is required.
Message: Provide credit limits parameter.
```

**Obervation:**
- Appears cleaner and more professional
- Error banner makes message more obvious.


## Verification

I used the Bendigo Bank borrowing power calculator as the reference specified in the exercise instructions.
I used the provided test suite

### Repayment Discrepency Test Suite

**Current Output:**
```text
Maximum Borrowing Power at 7.5%: $524,173.77
Assumed Monthly Mortgage Repayment: $4,600 over 30 years
```

**Expected Output**
```test
assert.strictEqual(result.monthlyRepayment, 4200);
Assumed Monthly Mortgage Repayment: $4,200 over 30 years
```

**Ideas for Error placement:**
- Most likely within the Tax/HEM calculation
- Return value of a function

### Testing solutions

I attempted to find number differences between my implication and the inital provided code and could not find the point of error.

**Walking through the code and printing values at each step gave me:**

- Gross annual income: $120,000
- Tax returned by /api/tax: $24,000
- Net monthly income: ($120,000 - $24,000) / 12 = $8,000
- HEM returned by /api/hem for $120,000 income and 2 dependents: $3,100
- Declared monthly expenses: $3,000
- Living expenses used: max($3,000, $3,100) = $3,100
- Credit card liability: $10,000 × 3% = $300
- Monthly repayment capacity: $8,000 - $3,100 - $300 = $4,600

My theory is that this difference came from within the HEM for 2 vs. 3 depenents as this has an exact $400 difference which would explain the disparity. From my testing with the provided function and outputs my current result aligns with the calculations provided.

**Other verification tested:**
- Printing error message on no number/negetive input.
- Different number of dependents with same income.
- Different living expenses with same income.


## Run/Use Borrowing Calculator

## Setup

Make sure you have Node.js installed.

Install dependencies:
```
npm install
```

## Server

You wil need to run the development API in it's own terminal window.
(The server will be available at http://localhost:3000/).
To start the server run the following command:
```
npm run api
```
Note: You can stop the server with Ctrl+C

## Running

Run the calculator with:
```
npm start
```

## Testing

Run tests with:
```
npm test
```

