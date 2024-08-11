import React, { useState, useRef, useEffect } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import DropDownHelper from '../../Views/Helper/DropDownHelper';

const CustomDropdown18 = ({ options, value, onChange, name, defaultOption, type }) => {


  const {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    dropdownRef,
    inputRef,
    optionRefs,
    filteredOptions,
    handleKeyDown,
    handleSelect,
    focusedOptionIndex
  } = DropDownHelper(options, onChange, name, type);


  // const handleSelect = (option) => {
  //   onChange({ target: { name, value: option.id } }); // Change here to pass option.id
  //   setIsOpen(false);
  //   setSearchTerm('');
  // };

  // const filteredOptions = searchTerm.length === 0 ? options : options?.filter(option =>
  //   option?.bill_no?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  // );
  return (
    <div ref={dropdownRef} tabIndex="0" className="customdropdownx12s86" onKeyDown={handleKeyDown}>
      <div onClick={() => setIsOpen(!isOpen)} className={"dropdown-selected" + (value ? ' filledcolorIn' : '')}>
        {value ? options?.find(account => account?.id === value)?.bill_no : defaultOption}
      </div>
      {isOpen && (
        <div className="dropdown-options">
          <RiSearch2Line id="newsvgsearchicox2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dropdown-search"
          />
          <div className="dropdownoptoscroll">
            {filteredOptions?.map((option, index) => (
              <div key={option.id}
                onClick={() => handleSelect(option)}

                className={"dropdown-option" +
                  (option.labelid === value ? " selectedoption" : "") +
                  (index === focusedOptionIndex ? " focusedoption" : "")}>
                {option.bill_no ? option?.bill_no : ""}

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown18;
