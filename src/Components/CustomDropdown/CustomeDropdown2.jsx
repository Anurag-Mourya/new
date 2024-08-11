import React, { useState, useRef, useEffect } from 'react';
import { GoPlus } from 'react-icons/go';
import { RiSearch2Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import DropDownHelper from '../../Views/Helper/DropDownHelper';

const CustomeDropdown2 = ({ options, value, onChange, name, type, defaultOption, style }) => {

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

    } = DropDownHelper(options, onChange, name, type, "",);


    // const handleSelect = (option) => {
    //     onChange({ target: { name, value: option.id } });
    //     setIsOpen(false);
    //     setSearchTerm(''); // Reset search term on select
    // };

    // const filteredOptions = searchTerm?.length === 0 ? options : options?.filter(option =>
    //     option.expense_name ? option.expense_name.toLowerCase().includes(searchTerm.toLowerCase()) : false
    // );

    return (
        <div ref={dropdownRef} focus={true} className="customdropdownx12s86" tabIndex="0" onKeyDown={handleKeyDown}>
            <div onClick={() => setIsOpen(!isOpen)} className={"dropdown-selected" + (value ? ' filledcolorIn' : '')}>
                {value ? options?.find(option => option?.id === value)?.expense_name : defaultOption}
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
                    />

                    <div className="dropdownoptoscroll">
                        {filteredOptions?.map((option, index) => (
                            <div
                                key={option.id}
                                ref={(el) => (optionRefs.current[index] = el)}
                                onClick={() => handleSelect(option)}
                                className={"dropdown-option" + (option?.id === value ? " selectedoption" : "") + (option.active == 0 ? " inactive-option" : "") + (index === focusedOptionIndex ? " focusedoption" : "")}

                            >
                                {option.expense_name}

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomeDropdown2;
