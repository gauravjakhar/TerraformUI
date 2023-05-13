import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialDropdownValues = [
  ['AWS', 'Azure'],
];

const initialDropdownNames = [
  ['Technology'],
];

function App() {
  const [dropdownValues, setDropdownValues] = useState(initialDropdownValues);
  const [dropdownNames, setDropdownNames] = useState(initialDropdownNames);
  const [selectedValues, setSelectedValues] = useState(Array(dropdownValues.length).fill(''));
  const [responseMessage, setResponseMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = 'Learning Tech';
  }, []);

  const handleDropdownChange = (event, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = event.target.value;
    setSelectedValues(newSelectedValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    try {
        console.log("executing")
      const response = await axios.post('http://127.0.0.1:5000/api/submit', { values: selectedValues });
      setResponseMessage(response.data);
      console.log(response.data);
    } catch (error) {
      setResponseMessage({});
      console.error(error);
    }
    setIsProcessing(false);
  };

  const dropdowns = dropdownValues.map((options, index) => (
    <div key={index} className="dropdown-container">
      <label htmlFor={`dropdown-name-${index}`} className="dropdown-label">
        {dropdownNames[index]}
      </label>
      <select
        id={`dropdown-${index}`}
        value={selectedValues[index]}
        className="dropdown-select"
        onChange={(event) => handleDropdownChange(event, index)}
      >
        <option value="">-- Select an option --</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  ));

  return (
    <div className="form-container">
      <h1>Learning Module</h1>
      <form onSubmit={handleSubmit}>
        {dropdowns}
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {isProcessing ? (
        <div className="processing-message">Processing...</div>
      ) : (
        <div className="response-container">
        {responseMessage && responseMessage.template && responseMessage.template.split('\n').map((line, index) => {
          if (line.length < 5) {
            return null;
          }
          return <button key={index}>{line}</button>
        })}
      </div>
      )}
    </div>
  );
}

export default App;
