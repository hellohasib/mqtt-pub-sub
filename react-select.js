// YourComponent.js
import React, { useState } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';

const YourComponent = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    // Add more options as needed
  ];

  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
    setModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setModalIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Select Modal"
      >
        <h2>Select an Option</h2>
        <Select
          options={options}
          value={selectedOption}
          onChange={handleSelectChange}
        />
        <button onClick={() => setModalIsOpen(false)}>Close Modal</button>
      </Modal>

      <div>
        <h3>Selected Option:</h3>
        {selectedOption ? (
          <p>{`${selectedOption.label} (${selectedOption.value})`}</p>
        ) : (
          <p>No option selected</p>
        )}
      </div>
    </div>
  );
};

export default YourComponent;
