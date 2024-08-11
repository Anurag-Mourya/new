import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { GoPlus } from 'react-icons/go';
import { Link } from 'react-router-dom';
import useOutsideClick from '../../Views/Helper/PopupData';
import DropDownHelper from '../../Views/Helper/DropDownHelper';

const CustomDropdown19 = forwardRef((props, ref) => {
  const { label,
    options,
    value,
    onChange,
    name,
    defaultOption,
    type,
    setBasicDetailsDisplayName, } = props;


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
    focusedOptionIndex,

  } = DropDownHelper(options, onChange, name, type, "", "", setBasicDetailsDisplayName);
  // const handleSelect = (option) => {
  //   setBasicDetailsDisplayName((prevDetails) => ({
  //     ...prevDetails,
  //     display_name: option
  //   }));
  //   setIsOpen(false);
  // };

  const combinedRef = (node) => {
    dropdownRef.current = node;
    if (ref) ref.current = node;
  };

  return (
    <>
      <div ref={combinedRef} tabIndex="0" className="customdropdownx12sfocus86" onKeyDown={handleKeyDown}>
        <input
          style={{ width: "100%" }}
          type="text"
          name={name}
          value={value}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={defaultOption}
          autoComplete="off"
          onChange={onChange}
        />
        <div className="customdropdownx12s86" >
          {options?.length >= 1 && isOpen && (
            <div className="dropdown-options">
              <div className="dropdownoptoscroll">
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(option)}
                    className={"dropdown-option" + (option === value ? " selectedoption" : "") + (index === focusedOptionIndex ? " focusedoption" : "")}
                    ref={(el) => (optionRefs.current[index] = el)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default CustomDropdown19;
