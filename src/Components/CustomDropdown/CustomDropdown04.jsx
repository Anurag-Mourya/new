// CustomDropdown04.js
import React from 'react';
import DropDownHelper from '../../Views/Helper/DropDownHelper';
import { RiSearch2Line } from 'react-icons/ri';

const CustomDropdown04 = ({ options, value, onChange, name, type, defaultOption }) => {
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

  return (
    <div ref={dropdownRef} tabIndex="0" className="customdropdownx12s86" onKeyDown={handleKeyDown}>
      <div onClick={() => setIsOpen(!isOpen)} className={"dropdown-selected" + (value ? ' filledcolorIn' : '')}>
        {value ? options?.find(account => account?.labelid == value)?.label : defaultOption}
        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.2852 0.751994C11.2852 0.751994 7.60274 5.75195 6.28516 5.75195C4.96749 5.75195 1.28516 0.751953 1.28516 0.751953" stroke="#797979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
            autoFocus
            ref={inputRef}
          />
          <div className="dropdownoptoscroll">
            {filteredOptions?.map((option, index) => (
              <div
                key={option.labelid}
                ref={(el) => (optionRefs.current[index] = el)}
                onClick={() => handleSelect(option)}
                className={
                  "dropdown-option" +
                  (option.labelid === value ? " selectedoption" : "") +
                  (index === focusedOptionIndex ? " focusedoption" : "")
                }
              >
                {option.label}
              </div>
            ))}
            {filteredOptions.length === 0 &&
              <>
                <div className="notdatafound02">
                  <iframe src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json" frameBorder="0"></iframe>
                </div>
                <div className="dropdown-option centeraligntext">No options found</div>
              </>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown04;
