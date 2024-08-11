import React, { useState, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import useOutsideClick from "../../Helper/PopupData";
import { paymentRecList } from "../../../Redux/Actions/PaymentRecAction";
import NoDataFound from "../../../Components/NoDataFound/NoDataFound";

import sortbyIco from '../../../assets/outlineIcons/othericons/sortbyIco.svg';
import FilterIco from '../../../assets/outlineIcons/othericons/FilterIco.svg';
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";
import { fetchMasterData } from "../../../Redux/Actions/globalActions";



const PaymentMade = () => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const qutList = useSelector(state => state?.paymentRecList);
    const masterData = useSelector(state => state?.masterData?.masterData);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [dataChanging, setDataChanging] = useState(false);


    // serch,filter and sortby////////////////////////////////////

    // sortBy
    const sortDropdownRef = useRef(null);

    const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
    const [selectedSortBy, setSelectedSortBy] = useState('Normal');
    const currentDate = new Date().toISOString().slice(0, 10);

    const [custom_date, setCustom_date] = useState(""); // Initial state is an empty string
    const [fromDate, setFromDate] = useState(currentDate); // Initial state is an empty string
    const [toDate, setToDate] = useState(""); // Initial state is an empty string

    const handleSortBySelection = (sortBy) => {
        setSelectedSortBy(sortBy);
        setIsSortByDropdownOpen(false);

        const sortByButton = document?.getElementById("sortByButton");
        if (sortByButton) {
            if (sortBy !== 'Normal') {
                sortByButton?.classList.add('filter-applied');
                // setQuotationNo("") 
            } else {
                sortByButton?.classList.remove('filter-applied');

            }
        }
    };

    // Handle date input change
    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setCustom_date(selectedDate); // Update the date state here
        setSelectedSortBy("custom_date")
        setIsSortByDropdownOpen(false);
        // setQuotationNo("")

        sortByButton.classList.add('filter-applied');
    };
    // Handle date input change
    const handleDateRangeFrom = (event) => {
        const selectedDate = event.target.value;
        setFromDate(selectedDate); // Update the date state here
        // setQuotationNo("")
        sortByButton.classList.add('filter-applied');
    };
    // Handle date input change
    const handleDateRangeTo = (event) => {
        const selectedDate = event.target.value;
        setToDate(selectedDate); // Update the date state here
        setSelectedSortBy("toDate")
        setIsSortByDropdownOpen(false);
        // setQuotationNo("")
        sortByButton.classList.add('filter-applied');
    };

    const handleQuotationChange = (value) => {
        setSelectedSortBy(value);
        sortByButton.classList.add('filter-applied');
        setIsSortByDropdownOpen(false);
    };
    //sortby

    // filter
    const [status, setStatus] = useState('');
    const filterDropdownRef = useRef(null);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    // console.log("fillllllllllll", status)
    const handleFilterSelection = (filter) => {
        setSelectedSortBy(filter);
        setIsFilterDropdownOpen(false);


        const sortByButton = document?.getElementById("filterButton");
        if (sortByButton) {
            if (filter !== 'Normal') {
                sortByButton?.classList.add('filter-applied');
                setStatus(filter)

            } else {
                sortByButton?.classList.remove('filter-applied');
                setStatus("")
            }
        }
    };
    // filter

    //serch
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCall, setSearchCall] = useState(false);
    const searchItems = () => {
        setSearchCall(!searchCall);
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setTimeout(() => {
            setSearchCall(!searchCall);
        }, 1000);
        // Add a class to the search input field when the search term is not empty
        const searchInput = document.getElementById("commonmcsearchbar");
        if (searchInput) {
            if (e.target.value) {
                searchInput.classList.add('search-applied');
            } else {
                searchInput.classList.remove('search-applied');
            }
        }
    };
    //serch

    // serch,filter and sortby////////////////////////////////////

    const fetchQuotations = async () => {
        try {
            const sendData = {
                fy: localStorage.getItem('FinancialYear'),
                noofrec: itemsPerPage,
                currentpage: currentPage,
                inout: 2
            }

            switch (selectedSortBy) {
                case 'Name':
                    sendData.name = 1
                    break;
                case 'custom_date':
                    sendData.custom_date = custom_date
                    break;

                case 'toDate':
                    sendData.fromDate = fromDate
                    sendData.toDate = toDate
                    break;
                case 'Ascending':
                    sendData.quotation = 1
                    break;

                case 'Descending':
                    sendData.quotation = 0
                    break;
                default:
            }

            if (status) {
                sendData.status = status
            }

            if (searchTerm) {
                sendData.search = searchTerm
            }

            dispatch(paymentRecList(sendData));
            setDataChanging(false)
        } catch (error) {
            console.error("Error fetching sales orders:", error);
        }
    };


    useEffect(() => {
        fetchQuotations();
        dispatch(fetchMasterData());
    }, [currentPage, itemsPerPage, toDate, selectedSortBy, status, searchCall, dispatch]);

    const handleRowClicked = (quotation) => {
        Navigate(`/dashboard/payment-made-detail?id=${quotation.id}`)
    };

    //logic for checkBox...
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const handleCheckboxChange = (rowId) => {
        if (selectedRows.includes(rowId)) {
            setSelectedRows(selectedRows.filter((id) => id !== rowId));
        } else {
            setSelectedRows([...selectedRows, rowId]);
        }
    };
    useEffect(() => {
        const areAllRowsSelected = qutList?.data?.data?.payments?.every((row) => selectedRows.includes(row.id));
        setSelectAll(areAllRowsSelected);
    }, [selectedRows, qutList?.data?.data?.payments]);

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        setSelectedRows(selectAll ? [] : qutList?.data?.data?.payments?.map((row) => row.id));
    };
    //logic for checkBox...

    const handleDataChange = (newValue) => {
        setDataChanging(newValue);
    };

    const allModeType = masterData?.filter(type => type?.type === "9");

    const findModeTypeNameById = (id) => {
        const unit = allModeType?.find(unit => unit?.labelid == id);
        return unit ? unit.label : "";
    };


    const dropdownRef = useRef(null);

    //DropDown for fitler, sortby and import/export
    const handleSortByDropdownToggle = () => {
        setIsSortByDropdownOpen(!isSortByDropdownOpen);
    };

    const handleFilterDropdownToggle = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
    };


    useOutsideClick(sortDropdownRef, () => setIsSortByDropdownOpen(false));
    useOutsideClick(filterDropdownRef, () => setIsFilterDropdownOpen(false));



    return (
        <>
            <TopLoadbar />
            <div id="middlesection" >
                <div id="Anotherbox">
                    <div id="leftareax12">
                        <h1 id="firstheading">
                            {/* <img src={"/assets/Icons/allcustomers.svg"} alt="" /> */}
                            <svg height="512" viewBox="0 0 58 54" width="512" xmlns="http://www.w3.org/2000/svg" id="fi_4071616"><g id="Page-1" fill="none" fill-rule="evenodd"><g id="016---Credit-Card"><path id="Path" d="m29.73 32h-25.73c-2.209139 0-4-1.790861-4-4v-24c0-2.209139 1.790861-4 4-4h38c2.209139 0 4 1.790861 4 4v20.3z" fill="#3b97d3"></path><path id="Path" d="m46 16h-46v8h43 3z" fill="#464f5d"></path><rect id="Rectangle" fill="#f3d55b" height="6" rx="2" width="8" x="5" y="5"></rect><path id="Path" d="m40 7h-20c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h20c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1z" fill="#ecf0f1"></path><path id="Path" d="m30 11h-10c-.5522847 0-1-.4477153-1-1 0-.55228475.4477153-1 1-1h10c.5522847 0 1 .44771525 1 1 0 .5522847-.4477153 1-1 1z" fill="#ecf0f1"></path><path id="Path" d="m58 39c0 8.2842712-6.7157288 15-15 15s-15-6.7157288-15-15 6.7157288-15 15-15c1.0075985-.0022508 2.0127996.0982693 3 .3 6.9832894 1.4286242 11.9983524 7.5720763 12 14.7z" fill="#4fba6f"></path><path id="Path" d="m38 47c-.2651948-.0000566-.5195073-.1054506-.707-.293l-4-4c-.3789722-.3923789-.3735524-1.0160848.0121814-1.4018186s1.0094397-.3911536 1.4018186-.0121814l3.346 3.345 13.3-11.4c.2690133-.2485449.6523779-.3301409.9992902-.2126907.3469124.1174502.6018621.415153.66456.7760016.0626979.3608485-.0768884.7271025-.3638502.9546891l-14 12c-.1810749.1574945-.4130154.2441614-.653.244z" fill="#fff"></path></g></g></svg>                            All Payment Made
                        </h1>
                        <p id="firsttagp">{qutList?.data?.data?.count} records</p>
                        <div id="searchbox">
                            <input
                                id="commonmcsearchbar"
                                type="text"
                                placeholder="Search In All Payment"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <IoSearchOutline onClick={searchItems} data-tooltip-content="Search" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />
                        </div>
                    </div>

                    <div id="buttonsdata">
                        <div className="maincontainmiainx1">
                            <div className="filtersorticos5w" id="sortByButton" data-tooltip-content="Sort By" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" onClick={handleSortByDropdownToggle}>

                                <img src={sortbyIco} alt="" data-tooltip-content="Sort By" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />
                            </div>
                            {isSortByDropdownOpen && (
                                <div className="dropdowncontentofx35" ref={sortDropdownRef}>
                                    <div className={`dmncstomx1 ${selectedSortBy === 'Normal' ? '' : ''}`} onClick={() => handleSortBySelection('Normal')}>Set Default
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#6b6b6b"} fill={"none"}>
                                            <path d="M18.952 8.60657L21.4622 8.45376C19.6629 3.70477 14.497 0.999914 9.4604 2.34474C4.09599 3.77711 0.909631 9.26107 2.34347 14.5935C3.77731 19.926 9.28839 23.0876 14.6528 21.6553C18.6358 20.5917 21.4181 17.2946 22 13.4844" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg></div>


                                    <div>
                                        <div className={`dmncstomx1 newdateformationofsortbuy ${selectedSortBy === 'custom_date' ? '' : ''}`}>
                                            <div className="s1d65fds56">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#6b6b6b"} fill={"none"}>
                                                    <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3.5 8H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>Custom Date</div>
                                            <div><input type="date" name="custom_date" id="" value={custom_date} onChange={handleDateChange} /></div>
                                        </div>

                                    </div>
                                    <div>
                                        <span className={`dmncstomx1 newdateformationofsortbuy2 ${selectedSortBy === 'toDate' ? 'activedmc' : ''}`}>

                                            <div className="s1d65fds56"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#6b6b6b"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3.5 8H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>Date Range</div>

                                            <span className="newdateformationofsortbuy23">
                                                <div> From:<div><input type="date" name="fromDate" id="" value={fromDate} onChange={handleDateRangeFrom} /></div></div>
                                                <div> To:<div><input type="date" name="toDate" id="" value={toDate} onChange={handleDateRangeTo} /></div></div>
                                            </span>
                                        </span>

                                    </div>
                                    <div className="adsc1s3d65w">
                                        <div className="s1d65fds56">

                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#6b6b6b"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3.5 8H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Quotation number</div>
                                        <div className="sjokxs5665w252s">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSortBy === "Ascending"}
                                                    onChange={() => handleQuotationChange("Ascending")}
                                                />
                                                <button className={`filter-button ${selectedSortBy === "Ascending" ? "selected" : ""}`} onClick={() => handleQuotationChange("Ascending")}>Ascending</button>
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSortBy === "Descending"}
                                                    onChange={() => handleQuotationChange("Descending")}
                                                />
                                                <button className={`filter-button ${selectedSortBy === "Descending" ? "selected" : ""}`} onClick={() => handleQuotationChange("Descending")}>Descending</button>
                                            </label>

                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                        <div className="maincontainmiainx1">
                            <div className="filtersorticos5w" id="filterButton" data-tooltip-content="Filter" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" onClick={handleFilterDropdownToggle}>
                                <img src={FilterIco} alt="" data-tooltip-content="Filter" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />

                            </div>
                            {isFilterDropdownOpen && (
                                <div className="dropdowncontentofx35" ref={filterDropdownRef}>
                                    <div
                                        className={`dmncstomx1 ${selectedSortBy === "Normal" ? "activedmc" : ""
                                            }`}
                                        onClick={() => handleFilterSelection("Normal")}
                                    >
                                        Normal
                                    </div>

                                    <div
                                        className={`dmncstomx1 ${selectedSortBy === "1" ? "activedmc" : ""
                                            }`}
                                        onClick={() => handleFilterSelection("1")}
                                    >
                                        Approved
                                    </div>

                                    <div
                                        className={`dmncstomx1 ${selectedSortBy === "2" ? "activedmc" : ""
                                            }`}
                                        onClick={() => handleFilterSelection("2")}
                                    >
                                        Rejected
                                    </div>

                                </div>
                            )}

                        </div>
                        <Link className="linkx1" to={"/dashboard/create-payment-made"} data-tooltip-content="New Payment" data-tooltip-id="my-tooltip" data-tooltip-place="bottom">
                            New Payment <GoPlus />
                        </Link>
                        <ResizeFL />
                    </div>
                </div>

                <div id="mainsectioncsls" className="commonmainqusalincetcsecion listsectionsgrheigh">
                    <div id="leftsidecontentxls">
                        <div id="item-listsforcontainer">
                            <div id="newtableofagtheme">
                                <div className="table-headerx12">
                                    <div className="table-cellx12 checkboxfx1" id="styl_for_check_box">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAllChange}
                                        />
                                        <div className="checkmark"></div>
                                    </div>
                                    <div className="table-cellx12 quotiosalinvlisxs1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                            <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Date</div>
                                    <div className="table-cellx12 quotiosalinvlisxs2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                            <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                            <path d="M15 6L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M21 13V11C21 6.75736 21 4.63604 19.682 3.31802C18.364 2 16.2426 2 12 2C7.75736 2 5.63604 2 4.31802 3.31802C3 4.63604 3 6.75736 3 11V13C3 17.2426 3 19.364 4.31802 20.682C5.63604 22 7.75736 22 12 22C16.2426 22 18.364 22 19.682 20.682C21 19.364 21 17.2426 21 13Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M7 14H7.52632M11.7368 14H12.2632M16.4737 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M7 18H7.52632M11.7368 18H12.2632M16.4737 18H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Payment</div>

                                    <div className="table-cellx12 quotiosalinvlisxs3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                                            <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        Vendor Name</div>



                                    <div className="table-cellx12 quotiosalinvlisxs4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                                            <path d="M16.3083 4.38394C15.7173 4.38394 15.4217 4.38394 15.1525 4.28405C15.1151 4.27017 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1922 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8077 2.52977 9.84585 3.49166C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27017 8.84747 4.28405C8.57825 4.38394 8.28273 4.38394 7.69171 4.38394H7.58269C6.07478 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07478 4.38394 7.58269V7.69171C4.38394 8.28273 4.38394 8.57825 4.28405 8.84747C4.27017 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49166 9.84585C2.52977 10.8077 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1922 3.49166 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27017 15.1151 4.28405 15.1525C4.38394 15.4217 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07478 19.6161 7.58269 19.6161H7.69171C8.28273 19.6161 8.57825 19.6161 8.84747 19.7159C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8077 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.04 22.0015 12.1195 21.9955C12.7113 21.9512 13.1922 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.7159C15.4217 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4217 19.7159 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1922 21.9512 12.7113 21.9955 12.1195C22.0015 12.04 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8077 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.7159 8.84747C19.6161 8.57825 19.6161 8.28273 19.6161 7.69171V7.58269C19.6161 6.07478 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M8.5 16.5C9.19863 15.2923 10.5044 14.4797 12 14.4797C13.4956 14.4797 14.8014 15.2923 15.5 16.5M14 10C14 11.1046 13.1046 12 12 12C10.8955 12 10 11.1046 10 10C10 8.89544 10.8955 8.00001 12 8.00001C13.1046 8.00001 14 8.89544 14 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        Refrence No</div>


                                    <div className="table-cellx12 quotiosalinvlisxs5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                                            <path d="M18.4167 8.14815C18.4167 5.85719 15.5438 4 12 4C8.45617 4 5.58333 5.85719 5.58333 8.14815C5.58333 10.4391 7.33333 11.7037 12 11.7037C16.6667 11.7037 19 12.8889 19 15.8519C19 18.8148 15.866 20 12 20C8.13401 20 5 18.1428 5 15.8519" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Mode</div>


                                    <div className="table-cellx12 quotiosalinvlisxs5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                                            <path d="M18.4167 8.14815C18.4167 5.85719 15.5438 4 12 4C8.45617 4 5.58333 5.85719 5.58333 8.14815C5.58333 10.4391 7.33333 11.7037 12 11.7037C16.6667 11.7037 19 12.8889 19 15.8519C19 18.8148 15.866 20 12 20C8.13401 20 5 18.1428 5 15.8519" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Amount</div>

                                </div>

                                {qutList?.loading || dataChanging === true ? (
                                    <TableViewSkeleton />
                                ) : <>
                                    {qutList?.data?.data?.payments?.length >= 1 ?
                                        <>

                                            {qutList?.data?.data?.payments?.map((quotation, index) => (
                                                <div
                                                    className={`table-rowx12 ${selectedRows?.includes(quotation?.id) ? "selectedresult" : ""}`}
                                                    key={index}
                                                >
                                                    <div className="table-cellx12 checkboxfx1" id="styl_for_check_box">
                                                        <input
                                                            checked={selectedRows?.includes(quotation?.id)}
                                                            type="checkbox"
                                                            onChange={() => handleCheckboxChange(quotation?.id)}
                                                        />
                                                        <div className="checkmark"></div>
                                                    </div>

                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                        {quotation?.created_at ? new Date(quotation?.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).split(' ').join('-') : ""}</div>

                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs2">
                                                        {quotation?.payment_id || ""}
                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs3">
                                                        {quotation?.vendor?.display_name || ""}
                                                    </div>

                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs5">
                                                        {quotation?.reference || ""}
                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs5">
                                                        {/* {quotation?.payment_mode?.account_name || ""}
                                                        {quotation?.payment_mode?.account_name || ""} */}
                                                        {findModeTypeNameById(quotation?.payment_mode)}
                                                    </div>

                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs5">
                                                        {quotation?.credit || ""}
                                                    </div>


                                                </div>

                                            ))}
                                        </>
                                        :
                                        <NoDataFound />
                                    }
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
                                    <PaginationComponent
                                        itemList={qutList?.data?.data?.count}
                                        setDataChangingProp={handleDataChange}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        itemsPerPage={itemsPerPage}
                                        setItemsPerPage={setItemsPerPage} />
                <Toaster />
            </div >
        </>
    );
};


export default PaymentMade
