import { useState, useEffect } from 'react';
import './Calculator.css';

function Calculator() {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState(undefined);

  const clear = () => {
    setCurrentOperand('0');
    setPreviousOperand('');
    setOperation(undefined);
  };

  const deleteNumber = () => {
    if (currentOperand === '0') return;
    const newValue = currentOperand.toString().slice(0, -1);
    setCurrentOperand(newValue === '' ? '0' : newValue);
  };

  const appendNumber = (number) => {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
      setCurrentOperand(number.toString());
    } else {
      setCurrentOperand(currentOperand.toString() + number.toString());
    }
  };

  const chooseOperation = (op) => {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
      compute();
    }
    setOperation(op);
    setPreviousOperand(currentOperand);
    setCurrentOperand('0');
  };

  const compute = () => {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        if (current === 0) {
          alert('Cannot divide by zero!');
          clear();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    setCurrentOperand(computation.toString());
    setOperation(undefined);
    setPreviousOperand('');
  };

  const getDisplayNumber = (number) => {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
      } else if (event.key === '.') {
        appendNumber('.');
      } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        chooseOperation(event.key);
      } else if (event.key === 'Enter' || event.key === '=') {
        compute();
      } else if (event.key === 'Backspace') {
        deleteNumber();
      } else if (event.key === 'Escape') {
        clear();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div className="container">
      <div className="calculator">
        <div className="display">
          <div className="previous-operand">
            {operation != null
              ? `${getDisplayNumber(previousOperand)} ${operation}`
              : ''}
          </div>
          <div className="current-operand">{getDisplayNumber(currentOperand)}</div>
        </div>
        <div className="buttons">
          <button type="button" className="btn btn-clear" onClick={clear}>
            AC
          </button>
          <button type="button" className="btn btn-delete" onClick={deleteNumber}>
            DEL
          </button>
          <button type="button" className="btn btn-operator" onClick={() => chooseOperation('/')}>
            ÷
          </button>
          <button type="button" className="btn btn-operator" onClick={() => chooseOperation('*')}>
            ×
          </button>

          <button type="button" className="btn btn-number" onClick={() => appendNumber('7')}>
            7
          </button>
          <button type="button" className="btn btn-number" onClick={() => appendNumber('8')}>
            8
          </button>
          <button type="button" className="btn btn-number" onClick={() => appendNumber('9')}>
            9
          </button>
          <button type="button" className="btn btn-operator" onClick={() => chooseOperation('-')}>
            −
          </button>

          <button type="button" className="btn btn-number" onClick={() => appendNumber('4')}>
            4
          </button>
          <button type="button" className="btn btn-number" onClick={() => appendNumber('5')}>
            5
          </button>
          <button type="button" className="btn btn-number" onClick={() => appendNumber('6')}>
            6
          </button>
          <button type="button" className="btn btn-operator" onClick={() => chooseOperation('+')}>
            +
          </button>

          <button type="button" className="btn btn-number" onClick={() => appendNumber('1')}>
            1
          </button>
          <button type="button" className="btn btn-number" onClick={() => appendNumber('2')}>
            2
          </button>
          <button type="button" className="btn btn-number" onClick={() => appendNumber('3')}>
            3
          </button>
          <button type="button" className="btn btn-equals span-2" onClick={compute}>
            =
          </button>

          <button type="button" className="btn btn-number span-2" onClick={() => appendNumber('0')}>
            0
          </button>
          <button type="button" className="btn btn-number" onClick={() => appendNumber('.')}>
            .
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
