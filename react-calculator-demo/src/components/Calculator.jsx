import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, RotateCcw, Equal, Plus, Minus, X, Divide } from 'lucide-react';
import './Calculator.css';

const Calculator = () => {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState(undefined);
  const [isFinished, setIsFinished] = useState(false);

  const clear = useCallback(() => {
    setCurrentOperand('0');
    setPreviousOperand('');
    setOperation(undefined);
    setIsFinished(false);
  }, []);

  const deleteNumber = useCallback(() => {
    if (isFinished) {
      clear();
      return;
    }
    if (currentOperand === '0') return;
    const newValue = currentOperand.toString().slice(0, -1);
    setCurrentOperand(newValue === '' ? '0' : newValue);
  }, [currentOperand, isFinished, clear]);

  const appendNumber = useCallback((number) => {
    if (isFinished) {
      setCurrentOperand(number === '.' ? '0.' : number.toString());
      setIsFinished(false);
      return;
    }
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
      setCurrentOperand(number.toString());
    } else {
      setCurrentOperand(currentOperand.toString() + number.toString());
    }
  }, [currentOperand, isFinished]);

  const chooseOperation = useCallback((op) => {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
      compute();
    }
    setOperation(op);
    setPreviousOperand(currentOperand);
    setCurrentOperand('0');
    setIsFinished(false);
  }, [currentOperand, previousOperand]);

  const compute = useCallback(() => {
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
    setIsFinished(true);
  }, [currentOperand, previousOperand, operation, clear]);

  const getDisplayNumber = (number) => {
    if (number === '') return '';
    const stringNumber = number.toString();
    const [integerPart, decimalPart] = stringNumber.split('.');

    const integerDisplay = parseFloat(integerPart).toLocaleString('en', {
      maximumFractionDigits: 0,
    });

    if (decimalPart != null) {
      return `${integerDisplay}.${decimalPart}`;
    }
    return integerDisplay;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (/[0-9]/.test(key)) appendNumber(key);
      if (key === '.') appendNumber('.');
      if (['+', '-', '*', '/'].includes(key)) chooseOperation(key);
      if (key === 'Enter' || key === '=') compute();
      if (key === 'Backspace') deleteNumber();
      if (key === 'Escape') clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appendNumber, chooseOperation, compute, deleteNumber, clear]);

  return (
    <div className="calculator-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="calculator"
      >
        <div className="display">
          <div className="previous-operand">
            {operation != null
              ? `${getDisplayNumber(previousOperand)} ${operation}`
              : ''}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOperand}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="current-operand"
            >
              {getDisplayNumber(currentOperand)}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="buttons-grid">
          <button type="button" className="calc-btn btn-clear span-2" onClick={clear}>
            <RotateCcw size={20} style={{ marginRight: '8px' }} /> AC
          </button>
          <button type="button" className="calc-btn btn-delete" onClick={deleteNumber}>
            <Delete size={20} />
          </button>
          <button type="button" className="calc-btn btn-operator" onClick={() => chooseOperation('/')}>
            <Divide size={20} />
          </button>

          {[7, 8, 9].map(num => (
            <button key={num} type="button" className="calc-btn" onClick={() => appendNumber(num.toString())}>
              {num}
            </button>
          ))}
          <button type="button" className="calc-btn btn-operator" onClick={() => chooseOperation('*')}>
            <X size={20} />
          </button>

          {[4, 5, 6].map(num => (
            <button key={num} type="button" className="calc-btn" onClick={() => appendNumber(num.toString())}>
              {num}
            </button>
          ))}
          <button type="button" className="calc-btn btn-operator" onClick={() => chooseOperation('-')}>
            <Minus size={20} />
          </button>

          {[1, 2, 3].map(num => (
            <button key={num} type="button" className="calc-btn" onClick={() => appendNumber(num.toString())}>
              {num}
            </button>
          ))}
          <button type="button" className="calc-btn btn-operator" onClick={() => chooseOperation('+')}>
            <Plus size={20} />
          </button>

          <button type="button" className="calc-btn span-2" onClick={() => appendNumber('0')}>
            0
          </button>
          <button type="button" className="calc-btn" onClick={() => appendNumber('.')}>
            .
          </button>
          <button type="button" className="calc-btn btn-equals" onClick={compute}>
            <Equal size={24} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Calculator;
