import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [clearPressCount, setClearPressCount] = useState(0);

  const handleInput = (value) => {
    if (input.length >= 45) return; // Limitar el input a 45 caracteres
    // Validar que no haya dos puntos seguidos
    if (value === '.' && input.slice(-1) === '.') return;
    // Validar paréntesis
    if (value === ')' && (input.match(/\(/g) || []).length <= (input.match(/\)/g) || []).length) {
      return; // No permitir cerrar más paréntesis de los que se han abierto
    }
    // Si se elige "Ans", agregar el resultado previo, pero solo si hay un resultado válido
    if (value === 'Ans' && result !== '') {
      setInput((prev) => prev + result);
      return;
    }
    // Para todos los otros inputs, concatenarlos al valor actual
    setInput((prev) => prev + value);
  };

  const deleteLastInput = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      if (input.includes('÷0')) {
        alert('Error de sintaxis');
        return;
      }

      // Contar paréntesis abiertos y cerrados
      const openParentheses = (input.match(/\(/g) || []).length;
      const closeParentheses = (input.match(/\)/g) || []).length;

      let expression = input;
      if (openParentheses > closeParentheses) {
        expression += ')'.repeat(openParentheses - closeParentheses); // Completar los paréntesis que faltan
      }

      expression = expression
        .replace(/\^/g, '**')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(') // Cambiado para el ln
        .replace(/Math\.log\(-\d+\)/, () => { alert('Error de sintaxis'); return; }) // Evitar ln de negativo
        .replace(/sin\((\d+(\.\d+)?)\)/g, (match, p1) => Math.sin(`${p1 * (Math.PI / 180)}`))
        .replace(/cos\((\d+(\.\d+)?)\)/g, (match, p1) => Math.cos(`${p1 * (Math.PI / 180)}`))
        .replace(/tan\((\d+(\.\d+)?)\)/g, (match, p1) => Math.tan(`${p1 * (Math.PI / 180)}`))
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      // Si hay una operación inválida (ejemplo log(-x) o sqrt(-x))
      if (expression.match(/Math\.sqrt\(-\d+\)/) || expression.match(/Math\.log\(-\d+\)/)) {
        alert('Error de sintaxis');
        return;
      }

      const evaluatedResult = eval(expression);
      setResult(evaluatedResult.toString());
    } catch (error) {
      alert('Error de sintaxis');
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('');

    // Contar las presiones rápidas del botón "C"
    setClearPressCount((prevCount) => prevCount + 1);

    // Si se presionó dos veces rápidamente, cambiar el modo
    if (clearPressCount === 1) {
      toggleTheme();
    }

    // Reiniciar el contador después de un segundo para evitar presiones lentas
    setTimeout(() => {
      setClearPressCount(0);
    }, 1000);
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={styles.displayContainer}>
        <Text style={isDarkMode ? styles.inputDark : styles.inputLight}>{input || '0'}</Text>
        <Text style={isDarkMode ? styles.resultDark : styles.resultLight}>{result || '0'}</Text>
      </View>
          <View style={styles.buttonsContainer}>
      <View style={styles.row}>
        <TouchableOpacity onPress={clearInput} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteLastInput} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('Ans')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>Ans</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={calculate} style={isDarkMode ? styles.resultButtonDark : styles.resultButtonLight}>
          <Text style={styles.buttonText}>=</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleInput('log(')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>log</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('ln(')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>ln</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('^')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>^</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('√(')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>√</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleInput('sin(')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>sin</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('cos(')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>cos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('tan(')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>tan</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('÷')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>÷</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleInput('7')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('8')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('9')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>9</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('×')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>×</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleInput('4')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('5')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('6')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>6</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('-')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleInput('1')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('2')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('3')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('+')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleInput('.')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('0')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput('(')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>(</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInput(')')} style={isDarkMode ? styles.buttonDark : styles.buttonLight}>
          <Text style={styles.buttonText}>)</Text>
        </TouchableOpacity>
      </View>
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  displayContainer: {
    marginBottom: 20,
  },
  inputDark: {
    color: 'white',
    fontSize: 40,
    textAlign: 'right',
  },
  inputLight: {
    color: '#000000',
    fontSize: 40,
    textAlign: 'right',
  },
  resultDark: {
    color: '#d60606',
    fontSize: 50,
    textAlign: 'right',
    marginBottom: 10,
  },
  resultLight: {
    color: '#007aff',
    fontSize: 50,
    textAlign: 'right',
    marginBottom: 10,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonDark: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonLight: {
    backgroundColor: '#cccccc',
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  resultButtonDark: {
    backgroundColor: '#d60606',
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  resultButtonLight: {
    backgroundColor: '#007aff',
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
});
