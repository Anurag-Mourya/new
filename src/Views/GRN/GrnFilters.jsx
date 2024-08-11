import React, { useState } from 'react';
import { OutsideClick } from '../Helper/ComponentHelper/OutsideClick';
import sortbyIco from '../../assets/outlineIcons/othericons/sortbyIco.svg';
import FilterIco from '../../assets/outlineIcons/othericons/FilterIco.svg';
const GrnFilters = ({ onSortByChange, onFilterChange, onSearch, onCustomDateChange, onDateRangeChange }) => {
    const [selectedSortBy, setSelectedSortBy] = useState('Normal');
    const [custom_date, setCustom_date] = useState("");
    const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10));
    const [toDate, setToDate] = useState("");
    const [status, setStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCall, setSearchCall] = useState(false);

    const sortByDropdown = OutsideClick();
    const filterDropdown = OutsideClick();

    const handleSortBySelection = (sortBy) => {
        setSelectedSortBy(sortBy);
        sortByDropdown.handleToggle();
        onSortByChange(sortBy); // Notify parent of sort by change
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setCustom_date(selectedDate);
        setSelectedSortBy("custom_date");
        sortByDropdown.handleToggle();
        onCustomDateChange(selectedDate);
    };

    const handleDateRangeFrom = (event) => {
        const selectedDate = event.target.value;
        setFromDate(selectedDate);
        onDateRangeChange(selectedDate, toDate);
    };

    const handleDateRangeTo = (event) => {
        const selectedDate = event.target.value;
        setToDate(selectedDate);
        onDateRangeChange(fromDate, selectedDate);
    };

    const handleQuotationChange = (value) => {
        setSelectedSortBy(value);
        onSortByChange(value);
        sortByDropdown.handleToggle();
    };

    const handleFilterSelection = (filter) => {
        setSelectedSortBy(filter);
        filterDropdown.handleToggle();
        setStatus(filter);
        onFilterChange(filter); // Notify parent of filter change
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setTimeout(() => {
            setSearchCall(!searchCall);
            onSearch(e.target.value); // Notify parent of search change
        }, 1000);
    };

    return (
        <>
            <div className="maincontainmiainx1">
                <div
                    data-tooltip-content="Sort By"
                    data-tooltip-id="my-tooltip"
                    className="filtersorticos5w"
                    id="sortByButton"
                    data-tooltip-place="bottom"
                    onClick={sortByDropdown.handleToggle}
                    ref={sortByDropdown.buttonRef}
                >
                    <img src={sortbyIco} alt="" data-tooltip-content="Sort By" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />
                </div>
                {sortByDropdown?.isOpen && (
                    <div className="dropdowncontentofx35" ref={sortByDropdown.ref}>
                        <div className={`dmncstomx1 ${selectedSortBy === 'Normal' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('Normal')}>All Purchase</div>
                        <div className={`dmncstomx1 ${selectedSortBy === 'custom_date' ? 'activedmc' : ''}`}>
                            <div>Custom Date</div>
                            <div><input type="date" name="custom_date" value={custom_date} onChange={handleDateChange} /></div>
                        </div>
                        <div className={`dmncstomx1 ${selectedSortBy === 'toDate' ? 'activedmc' : ''}`}>
                            <div>Date Range</div>
                            <div> From:<div><input type="date" name="fromDate" value={fromDate} onChange={handleDateRangeFrom} /></div></div>
                            <div> To:<div><input type="date" name="toDate" value={toDate} onChange={handleDateRangeTo} /></div></div>
                        </div>
                        <p className="custtypestext4s">Purchase number</p>
                        <label>
                            <input type="checkbox" checked={selectedSortBy === "Ascending"} onChange={() => handleQuotationChange("Ascending")} />
                            <button className={`filter-button ${selectedSortBy === "Ascending" ? "selected" : ""}`} onClick={() => handleQuotationChange("Ascending")}>Ascending</button>
                        </label>
                        <label>
                            <input type="checkbox" checked={selectedSortBy === "Descending"} onChange={() => handleQuotationChange("Descending")} />
                            <span className={`filter-button ${selectedSortBy === "Descending" ? "selected" : ""}`} onClick={() => handleQuotationChange("Descending")}>Descending</span>
                        </label>
                    </div>
                )}
            </div>
            <div className="maincontainmiainx1">
                <div
                    data-tooltip-content="Filter"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-place="bottom"
                    className="filtersorticos5w"
                    id="filterButton"
                    onClick={filterDropdown.handleToggle}
                    ref={filterDropdown.buttonRef}
                >
                    <img src={FilterIco} alt="" data-tooltip-content="Filter" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />
                </div>
                {filterDropdown.isOpen && (
                    <div className="dropdowncontentofx35" ref={filterDropdown.ref}>
                        <div className={`dmncstomx1 ${selectedSortBy === 'Normal' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('Normal')}>Normal</div>
                        <div className={`dmncstomx1 ${selectedSortBy === 'Approved' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('Approved')}>Approved</div>
                        <div className={`dmncstomx1 ${selectedSortBy === 'Sent' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('Sent')}>Sent</div>
                        <div className={`dmncstomx1 ${selectedSortBy === 'Accepted' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('Accepted')}>Accepted</div>
                        <div className={`dmncstomx1 ${selectedSortBy === 'Rejected' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('Rejected')}>Rejected</div>
                        <div className={`dmncstomx1 ${selectedSortBy === 'Expired' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('Expired')}>Expired</div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GrnFilters;
