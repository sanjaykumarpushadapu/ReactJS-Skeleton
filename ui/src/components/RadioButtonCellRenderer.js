import React from 'react';
import PropTypes from 'prop-types';

// Custom Cell Renderer for Radio Buttons
const RadioButtonCellRenderer = ({
  selectedValue,
  onSelectionChange,
  rowIndex,
}) => {
  const handleChange = (event) => {
    const value = event.target.value;
    onSelectionChange(value); // Call onSelectionChange when the radio button is clicked
  };

  return (
    <div>
      {['Yes', 'No'].map((option) => (
        <label key={option} style={{ marginRight: '10px' }}>
          <input
            type="radio"
            name={`radio-${rowIndex}`} // Unique name per row (radio buttons won't interfere)
            value={option}
            checked={selectedValue === option} // Mark the radio button as checked based on selectedValue
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

// Define PropTypes for RadioButtonCellRenderer
RadioButtonCellRenderer.propTypes = {
  selectedValue: PropTypes.string.isRequired, // Ensure the expected type matches
  onSelectionChange: PropTypes.func.isRequired,
  rowIndex: PropTypes.number.isRequired,
};

export default RadioButtonCellRenderer;
