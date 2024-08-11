import React, { forwardRef, useEffect, useRef } from 'react';
import DropDownHelperAccount from '../../Views/Helper/DropDownHelperAccount';
import { RiSearch2Line } from 'react-icons/ri';


const CustomDropdown15 = forwardRef((props, ref) => {
  const { options, value, type, onChange, name, defaultOption, index } = props;
  const nextFocusRef = useRef(null);
  const {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    dropdownRef,
    inputRef,
    optionRefs,
    allOptions,
    handleKeyDown,
    handleSelect,
    focusedOptionIndex
  } = DropDownHelperAccount(options, onChange, name, type, "", nextFocusRef);

  const hasMounted = useRef(false);

  if (index) {
    useEffect(() => {
      if (!hasMounted.current) {
        hasMounted.current = true;
      } else {
        dropdownRef.current.focus();
      }
    }, [index]);
  }

  const combinedRef = (node) => {
    dropdownRef.current = node;
    if (ref) ref.current = node;
  };

  return (
    <div ref={combinedRef} tabIndex="0" className="customdropdownx12s86" onKeyDown={handleKeyDown}>
      <div onClick={() => setIsOpen(!isOpen)} className={"dropdown-selected" + (value ? ' filledcolorIn' : '')}>
        {name === "paid_by" || name === "payment_mode" || name === "sale_acc_id" || name === "purchase_acc_id" || name === "account_id" || name === "to_acc" || name === "acc_id" || name === "paid_by" ?
          <> {value ? options?.find(account => account?.id === value)?.account_name : defaultOption}</>
          :
          <> {value ? options?.find(account => account?.account_name === value)?.account_name : defaultOption}</>}
        <svg
          width="13"
          height="7"
          viewBox="0 0 13 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.2852 0.751994C11.2852 0.751994 7.60274 5.75195 6.28516 5.75195C4.96749 5.75195 1.28516 0.751953 1.28516 0.751953"
            stroke="#797979"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
            {allOptions.map((option, index) => (
              option.isHeading ? (
                <div key={`heading-${index}`} className="account-typename4">
                  {option.account_type}
                </div>
              ) : (
                <div
                  key={option.id}
                  className={"dropdown-option" + (option.id === value ? " selectedoption" : "") + (index === focusedOptionIndex ? " focusedoption" : "")
                  }
                  onClick={() => handleSelect(option)}
                  ref={(el) => (optionRefs.current[index] = el)}
                >
                  {option.account_name}
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default CustomDropdown15;
