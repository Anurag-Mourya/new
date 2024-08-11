import { useState, useRef, useEffect } from 'react';
import useOutsideClick from './PopupData';

const DropDownHelper = (options, onChange, name, type, setItemData, setcusData, setBasicDetailsDisplayName) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const optionRefs = useRef([]);

    const handleSelect = (option) => {
        if (option.active !== "0") {

            onChange({
                target: {
                    name,
                    value: type === "masters" ? option.labelid : type === "taxRate" ? option?.tax_percentge : type === "currency" ? option?.code : type === "rate" ? option : option.id,
                    // [type === "select_item" ? option : ""]: ""
                }
            });

            if (type === "vendor" || type == "purchase") {
                setcusData(option);
            } else if (type === "select_item") {
                setItemData(option)
            }



            if (type === "basicDetail") {
                setBasicDetailsDisplayName((prevDetails) => ({
                    ...prevDetails,
                    display_name: option
                }));
            }

            setIsOpen(false);
            setSearchTerm('');
            setFocusedOptionIndex(-1);
            dropdownRef.current.focus();
        }
    };

    let filteredOptions = [];

    if (type === "categories") {
        filteredOptions = searchTerm.length === 0 ? options : options.filter(option =>
            option?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
    } else if (type === "masters") {
        filteredOptions = searchTerm.length === 0 ? options : options.filter(option =>
            option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
    } else if (type === "taxRate") {
        filteredOptions = searchTerm.length === 0 ? options : options.filter(option =>
            option?.tax_percentge?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
    } else if (type === "vendor" || type === "vendor_charges") {
        filteredOptions = searchTerm.length === 0 ? options : options.filter(option =>
            option?.first_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
    } else if (type === "currency") {
        filteredOptions = searchTerm.length === 0 ? options : options.filter(option =>
            option?.code?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
    } else if (type === "select_item") {
        filteredOptions = searchTerm.length === 0 ? options : options.filter(option =>
            option?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
    } else if (type === "select_expense") {
        filteredOptions = searchTerm.length === 0 ? options : options.filter(option =>
            option.expense_name ? option.expense_name.toLowerCase().includes(searchTerm.toLowerCase()) : false
        );
    } else if (type === "bill_no") {
        filteredOptions = searchTerm.length === 0 ? options : options?.filter(option =>
            option?.bill_no ? option?.bill_no?.toLowerCase().includes(searchTerm?.toLowerCase()) : false
        );
    } else if (type === "basicDetail") {
        filteredOptions = options;
    }
    else if (type === "purchase") {
        filteredOptions = searchTerm.length === 0 ? options : options?.filter(option =>
            option?.purchase_order_id ? option?.purchase_order_id?.toLowerCase().includes(searchTerm?.toLowerCase()) : false
        );
    }
    else if (type === "rate") {
        filteredOptions = options;
    }


    const handleKeyDown = (e) => {
        if (isOpen) {
            switch (e.key) {
                case 'ArrowDown':
                    setFocusedOptionIndex((prevIndex) => {
                        let nextIndex = prevIndex;
                        do {
                            nextIndex = nextIndex < filteredOptions.length - 1 ? nextIndex + 1 : 0;
                        } while (filteredOptions[nextIndex]?.active === "0" && nextIndex !== prevIndex);
                        optionRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        return nextIndex;
                    });
                    break;
                case 'ArrowUp':
                    setFocusedOptionIndex((prevIndex) => {
                        let nextIndex = prevIndex;
                        do {
                            nextIndex = nextIndex > 0 ? nextIndex - 1 : filteredOptions.length - 1;
                        } while (filteredOptions[nextIndex]?.active === "0" && nextIndex !== prevIndex);
                        optionRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        return nextIndex;
                    });
                    break;
                case 'Enter':
                    if (focusedOptionIndex >= 0 && filteredOptions[focusedOptionIndex]?.active !== "0") {
                        handleSelect(filteredOptions[focusedOptionIndex]);
                    }
                    break;
                case 'Tab':
                    setIsOpen(false);
                    break;
                default:
                    break;
            }
        } else if (e.key === "ArrowDown") {
            setIsOpen(true);
        }
    };


    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setFocusedOptionIndex(-1);
        }
    }, [isOpen]);

    useOutsideClick(dropdownRef, () => setIsOpen(false));

    return {
        isOpen,
        setIsOpen,
        searchTerm,
        setSearchTerm,
        focusedOptionIndex,
        setFocusedOptionIndex,
        dropdownRef,
        inputRef,
        optionRefs,
        filteredOptions,
        handleKeyDown,
        handleSelect,
    };
};

export default DropDownHelper;
