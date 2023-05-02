import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view';


function App() {
  // Define the dropdown values
  const [dropdownValues, setDropdownValues] = useState([
    ['Web Server', 'Database Server'],
    ['1', '2', '3', '4', '5'],
    ['t2.micro', 't2.small', 't2.medium'],
    ['16', '32', '64', '128', '256'],
    ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1'],
    ['sg-1234567890', 'sg-0987654321'],
    ['subnet-1234567890', 'subnet-0987654321'],
    ['vpc-1234567890', 'vpc-0987654321'],
  ]);

  useEffect(() => {
    document.title = 'Terraform Template';
  }, []);

  const [dropdownNames, setDropdownNames] = useState([
    ['Server Type'],
    ['Instances'],
    ['Instance Type'],
    ['Disk Size'],
    ['Region'],
    ['Security Group'],
    ['Subnet'],
    ['VPC'],
  ]);

  // Define the selected values for each dropdown
  const [selectedValues, setSelectedValues] = useState(Array(dropdownValues.length).fill(''));

  // Define the response message
  const [responseMessage, setResponseMessage] = useState('');

  // Handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/submit', { values: selectedValues });
      setResponseMessage(JSON.stringify(response.data, null, 2));
      console.log(response.data);
    } catch (error) {
      setResponseMessage('Error!');
      console.error(error);
    }
  }

  // Render the dropdowns and submit button
  const dropdowns = dropdownValues.map((options, index) => (
    <div key={index} className="dropdown-container">
      <label htmlFor={`dropdown-name-${index}`} className="dropdown-label">{dropdownNames[index]}</label>
      <select id={`dropdown-${index}`} value={selectedValues[index]} className="dropdown-select" onChange={(event) => {
        const newSelectedValues = [...selectedValues];
        newSelectedValues[index] = event.target.value;
        setSelectedValues(newSelectedValues);
      }}>
        <option value="">-- Select an option --</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  ));
  

  return (
    <div className="form-container">
      <h1>AWS Templates</h1>
      <form onSubmit={handleSubmit}>
        {dropdowns}
        <button type="submit">Submit</button>
      </form>
      <div className="response-container">
        <textarea value={responseMessage} readOnly />
      </div>
    </div>
  );
  
}

export default App;
