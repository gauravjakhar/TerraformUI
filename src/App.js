import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view';

const initialDropdownValues = [
  ['Web Server', 'Database Server'],
  ['1', '2', '3', '4', '5'],
  ['t2.micro', 't2.small', 't2.medium'],
  ['16', '32', '64', '128', '256'],
  ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1'],
  ['sg-test123', 'sg-test321'],
  ['subnet-test123', 'subnet-test321'],
  ['vpc-test123', 'vpc-test321'],
];

const initialDropdownNames = [
  ['Server Type'],
  ['Instances'],
  ['Instance Type'],
  ['Disk Size'],
  ['Region'],
  ['Security Group'],
  ['Subnet'],
  ['VPC'],
];

function App() {
  const [dropdownValues, setDropdownValues] = useState(initialDropdownValues);
  const [dropdownNames, setDropdownNames] = useState(initialDropdownNames);
  const [selectedValues, setSelectedValues] = useState(Array(dropdownValues.length).fill(''));
  const [responseMessage, setResponseMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = 'Terraform Template';
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
      const response = await axios.post('http://localhost:5000/api/submit', { values: selectedValues });
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
      <h1>AWS Templates</h1>
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
          <pre>
            <code>
              {responseMessage.template}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
