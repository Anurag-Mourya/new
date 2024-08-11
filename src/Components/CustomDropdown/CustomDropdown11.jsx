import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoPlus } from 'react-icons/go';
import { RxCross2 } from 'react-icons/rx';
import CreateItemPopup from '../../Views/Items/CreateItemPopup';
import { RiSearch2Line } from 'react-icons/ri';


const CustomDropdown11 = ({ setClickTrigger1, options, value, onChange, name, setItemData, defaultOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState("");

  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const showimagepopup = () => {
    setShowPopup(true);
  };

  const handleSelect = (option) => {
    onChange({ target: { name, value: option?.id, option } });  // using `labelid` as the value
    setItemData(option)
    setIsOpen(false);
    setSearchTerm(''); // Reset search term on select
  };

  const filteredOptions = searchTerm.length === 0 ? options : options?.filter(option =>
    option?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <>
      <div ref={dropdownRef} className="customdropdownx12s86 customdropdownx12s87">
        <div onClick={() => setIsOpen(!isOpen)} className={"dropdown-selected" + (value ? ' filledcolorIn' : '')}>

          {value ? options?.find(account => account?.id === value)?.name : defaultOption}
          {/* <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.2852 0.751994C11.2852 0.751994 7.60274 5.75195 6.28516 5.75195C4.96749 5.75195 1.28516 0.751953 1.28516 0.751953" stroke="#797979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg> */}
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
              {filteredOptions?.map(option => (
                <div key={option.id} onClick={() => handleSelect(option)} className={"dropdown-option" + (option.labelid === value ? " selectedoption" : "")}>
                  {option.name}
                </div>
              ))}
              {filteredOptions?.length === 0 && <div className="dropdown-option">No options found</div>}
            </div>
              <div className="lastbuttonsecofdropdown" to={"/dashboard/create-items"}><p style={{ cursor: "pointer" }} onClick={() => setShowPopup(true)}><GoPlus />Add Item</p></div>
          </div>
        )}


      </div>
      {
        showPopup && (
          <div className="mainxpopups2">
            <div className="popup-content02">
              <CreateItemPopup purchseChecked={true} setClickTrigger1={setClickTrigger1} closePopup={setShowPopup} />
            </div>
          </div>
        )
      }
    </>
  );
};

export default CustomDropdown11;
