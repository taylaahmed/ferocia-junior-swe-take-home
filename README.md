# ferocia-junior-swe-take-home


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
- Test only .tax

#### 2. Print and returning tax

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
--- TEST TAX DATA ---
14500
Type of data: number
---------------------------
```

**Observation:**
- taxData.tax logs number value of tax.

**Next Action:**
- Make calculateBorrowingPower async.
- add async to runConsoleMode.
- ($NaN) Tax data does not reach calc.

#### 3. Apply async to functions

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

#### 2. Print HEM

```text
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
```
**Observation:**
- Logs .hem but does not return to borrow function ($NaN).

**Next Action:**
- Remove testing.
- Return .hem value.

#### 3. Return HEM

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
#### 1. Handling text input

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

