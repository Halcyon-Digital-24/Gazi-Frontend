import React, { useState } from 'react';
import './index.scss';

interface Location {
  location: string;
}

interface CustomDropdownProps {
  locations: Location[];
  handleChangeLocation: (value: string) => void;
  required?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ locations, handleChangeLocation, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isTouched, setIsTouched] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (location: string) => {
    setSelectedLocation(location);
    setIsOpen(false);
    setIsTouched(true);
    handleChangeLocation(location);
  };

  const showError = required && isTouched && !selectedLocation;

  return (
    <div className="custom-dropdown">
      <div
        className={`dropdown-header ${isOpen ? 'open' : ''} ${showError ? 'error' : ''}`}
        onClick={handleToggle}
      >
        {selectedLocation || 'Select Location'}
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {locations?.length > 0 ? (
            locations?.map((location, i) => (
              <div
                key={i}
                className="dropdown-option"
                onClick={() => handleOptionClick(location.location)}
              >
                {location.location}
              </div>
            ))
          ) : (
            <div className="dropdown-option">No locations available</div>
          )}
        </div>
      )}
      {showError && <div className="select-error">This field is required</div>}
    </div>
  );
};

export default CustomDropdown;
