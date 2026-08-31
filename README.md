# ferocia-junior-swe-take-home


## Testing

### Phase 1: Tax API Integration & Debugging

### 1. Inital testing of Tax API

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

Next Steps:
- Test only .tax

### 2. Print and returning tax

Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $90000
Number of Dependents: 0
Declared Monthly Expenses: $900
Total Credit Card Limits: $9000

--- Calculation Summary ---
Maximum Borrowing Power at 7%: $NaN
Assumed Monthly Mortgage Repayment: $NaN over 30 years
--- TEST TAX DATA ---
14500
Type of data: number
---------------------------

Next Steps:
- Make calculateBorrowingPower async.


Attempted returned error:
- add async to runConsoleMode.

### 3. Apply async to functions

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

Next Steps:
- Remove tax API test.
- Add comments & Math.round()
- Commit.
- Start HEM API.

### Phase 2: HEM API Integration & Debugging

### 1. Test HEM API

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

Next Steps:
- test .hem only.

### 2. Print HEM

Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $90000
Number of Dependents: 0
Declared Monthly Expenses: $900
Total Credit Card Limits: $9000
---TEST HEM DATA---
2200
Type of data number
------------

--- Calculation Summary ---
Maximum Borrowing Power at 7%: $NaN
Assumed Monthly Mortgage Repayment: $NaN over 30 years

Next Steps:
- Remove testing.
- Return .hem value.

### 3. Return HEM

Mortgage Borrowing Power Calculator
===================================
Gross Annual Income: $90000
Number of Dependents: 1
Declared Monthly Expenses: $900
Total Credit Card Limits: $9000

--- Calculation Summary ---
Maximum Borrowing Power at 7%: $378,506.64
Assumed Monthly Mortgage Repayment: $3,321.67 over 30 years

Next Steps:
- Error message handling.
- Testing for boundies.

