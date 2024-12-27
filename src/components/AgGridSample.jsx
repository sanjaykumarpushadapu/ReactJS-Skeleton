import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
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

const AgGridSample = () => {
  // Initialize rowData with selection property
  const [rowData, setRowData] = useState([
    { id: 1, make: 'Toyota', model: 'Celica', price: 35000, selection: 'Yes' },
    { id: 2, make: 'Ford', model: 'Mondeo', price: 32000, selection: 'No' },
    {
      id: 3,
      make: 'Porsche',
      model: 'Boxster',
      price: 72000,
      selection: 'Yes',
    },
  ]);

  // Update selection of a specific row
  const handleSelectionChange = (rowId, value) => {
    const updatedRowData = [...rowData]; // Copy the current row data
    const rowIndex = updatedRowData.findIndex((i) => i.id === rowId);
    updatedRowData[rowIndex] = {
      ...updatedRowData[rowIndex],
      selection: value, // Update the specific row's selection
    };
    setRowData(updatedRowData); // Update the state with the new row data
  };

  const columnDefs = [
    { field: 'make', headerName: 'Make', sortable: true },
    { field: 'model', headerName: 'Model', sortable: true },
    { field: 'price', headerName: 'Price', sortable: true },
    {
      field: 'selection',
      headerName: 'Options',
      cellRenderer: (params) => {
        return (
          <RadioButtonCellRenderer
            selectedValue={params.data.selection} // Pass the current selection value
            rowIndex={params.data.id} // Pass the rowIndex explicitly
            onSelectionChange={(value) =>
              handleSelectionChange(params.data.id, value)
            } // Update the selection when radio button is clicked
          />
        );
      },
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 800 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1 }}
        domLayout="autoHeight"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
};

export default AgGridSample;
