function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function equals() {
    // evaluate expression
    const result = operate(operator.value,firstOperand.value, secondOperand.value);

    // write the result of the expression to firstOperand
    firstOperand.update(result, overwrite=true);
    
    // clear operator and secondOperand variables
    secondOperand.reset();
    operator.reset();
}

function clearAll() {
    firstOperand.reset();
    secondOperand.reset();
    operator.reset();
}

function clearEntry() {
    let operationState = getOperationState();
    
    if (operationState == '000') {
        if (secondOperand.value.length > 1) {
            secondOperand.pop();
        } else {
            secondOperand.reset();
        }
    } else if (operationState == '001') {
        operator.reset();
    } else if (operationState == '011') {
        if (firstOperand.value.length > 1) {
            firstOperand.pop();
        } else {
            firstOperand.reset();
        }
    }
}

function operate(operator, a, b) {
    let result = 0;
    a = +a;
    b = +b;
    
    switch (operator) {
        case '+':
            result += add(a, b);
            break;
        case '-':
            result += subtract(a, b);
            break;
        case '/':
            result += divide(a, b);
            break;
        case 'x':
            result += multiply(a, b);
            break;
    }
    return result;
}

const buttonContainer = document.querySelector('.button-container');

buttonContainer.addEventListener('click', e => {
    const buttonClass = e.target.classList[0];
    const buttonDataValue = e.target.getAttribute('data-value');

    if (buttonClass === 'operand') {
        handleOperandPress(buttonDataValue);
    } else if (buttonClass === 'operator') {
        handleOperatorPress(buttonDataValue);
    } else if (buttonClass === 'modifier') {
        handleModifierPress(buttonDataValue);
    }
});

function handleOperandPress(buttonDataValue) {
    if (operator.isEmpty()) {
        firstOperand.update(buttonDataValue);
    } else {
        secondOperand.update(buttonDataValue);
    }
}

function handleOperatorPress(buttonDataValue) {
    if(!firstOperand.isEmpty() && secondOperand.isEmpty()) {
        // change operator if secondOperand hasn't been set
        operator.update(buttonDataValue);
    } else if(!secondOperand.isEmpty()) {
        // Trigger evaluation of expression
        equals()
        operator.update(buttonDataValue);
    }   
}

function handleModifierPress(buttonDataValue) {
    switch (buttonDataValue) {
        case '=':
            if (!firstOperand.isEmpty()
                && !operator.isEmpty()
                && !secondOperand.isEmpty()) {
                    equals();
                }
                break;
        case 'clear-all':
            clearAll();
        case 'clear-entry':
            clearEntry();
            break;
        case 'pos-neg':
            if (!firstOperand.isEmpty() && operator.isEmpty()) {
                firstOperand.negate();
            } else if(!secondOperand.isEmpty()) {
                secondOperand.negate();
            }
            break;
    }
}

function updateDisplay() {
    if (!firstOperand.isEmpty()) {
        if (!operator.isEmpty()) {
            if (!secondOperand.isEmpty()) {
                displayValue = `${firstOperand.value} ${operator.value} ${secondOperand.value}`;
            } else {
                displayValue = `${firstOperand.value} ${operator.value}`;
            }
        } else {
            displayValue = firstOperand.value;
        }
    } else {
        displayValue = '0';
    }
    
    display.textContent = displayValue;
}

class Operation {
    constructor() {
        this.value = '';
    }
    update(num) {
        this.value = num;
        updateDisplay();
    }
    reset() {
        this.value = '';
        updateDisplay();
    }
    isEmpty() {
        return +(this.value === '');
    }
}

class Operand extends Operation {
    update(num, overwrite=false) {
        if (overwrite === false) {
            this.value += num;
        } else {
            this.value = num;
        }
        updateDisplay(this.name);
    }
    pop() {
        if (this.value.length > 1) {
            this.value = this.value.slice(0, -1);
            updateDisplay();
        }
    }
    negate() {
        if (this.value <= 0) {
            this.value = Math.abs(this.value);
        } else {
            this.value = -Math.abs(this.value);
        }
        updateDisplay(this.name);
    }
}

function getOperationState() {
    // returns string of length 3 representing binary states of firstOperand, secondOperand, and operator
    /// 111 = all empty; 000 = all non-empty; 100 = only firstOperand empty, etc
    
    return `${firstOperand.isEmpty()}${operator.isEmpty()}${secondOperand.isEmpty()}`;
}

let firstOperand = new Operand('first');
let operator = new Operation('operator');
let secondOperand = new Operand('second');

const display = document.querySelector('.display p');
let displayValue = '0';
updateDisplay();
