import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
// import TopLoadbar from "../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { accountLists, itemLists, journalLists } from "../../../Redux/Actions/listApisActions";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
// import { itemsTableIcon } from "../Helper/SVGIcons/ItemsIcons/ItemsTableIcons";
import { accountTableIcons, expenseTableIcons, itemsTableIcon, journalsTableIcons } from "../../Helper/SVGIcons/ItemsIcons/ItemsTableIcons";

import { exportItems, importItems } from "../../../Redux/Actions/itemsActions";
import { RxCross2 } from "react-icons/rx";
import MainScreenFreezeLoader from "../../../Components/Loaders/MainScreenFreezeLoader";
import NoDataFound from "../../../Components/NoDataFound/NoDataFound";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { expenseLists } from "../../../Redux/Actions/expenseActions";

import newmenuicoslz from '../../../assets/outlineIcons/othericons/newmenuicoslz.svg';

import sortbyIco from '../../../assets/outlineIcons/othericons/sortbyIco.svg';
import FilterIco from '../../../assets/outlineIcons/othericons/FilterIco.svg';
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";


const Expenses = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [dataChanging, setDataChanging] = useState(false);
    const itemListState = useSelector(state => state?.expenseList);
    const itemList = itemListState?.data || [];
    const totalItems = itemList?.length || 0;
    const itemListLoading = itemListState?.loading || false;
    const [searchTerm, setSearchTerm] = useState("");
    const Navigate = useNavigate();

    const importItemss = useSelector(state => state?.importItems);
    const exportItemss = useSelector(state => state?.exportItems);

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchCall, setSearchCall] = useState(false);
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
    const sortDropdownRef = useRef(null);
    const moreDropdownRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleCheckboxChange = (rowId) => {
        setSelectedRows((prevRows) =>
            prevRows.includes(rowId)
                ? prevRows.filter((id) => id !== rowId)
                : [...prevRows, rowId]
        );
    };

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        setSelectedRows(selectAll ? [] : itemList?.expense?.map((row) => row.id));
    };


    const handleRowClicked = (quotation) => {
        Navigate(`/dashboard/expense-details?id=${quotation.id}`);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDataChange = (newValue) => {
        setDataChanging(newValue);
    };







    //for import and export .xlsx file 
    const fileInputRef = useRef(null);

    const [showImportPopup, setShowImportPopup] = useState(false); // State variable for popup visibility

    // Function to handle import button click and toggle popup visibility
    const handleImportButtonClick = () => {
        setShowImportPopup(true);
    };


    const [callApi, setCallApi] = useState(false);

    const handleFileImport = async (e) => {
        e.preventDefault();
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append('file', file);
        dispatch(importItems(formData))
            .then(() => {
                setShowImportPopup(false);
                setCallApi((preState) => !preState);
                // Reset file input value after import operation is completed
                fileInputRef.current.value = ''; // Clearing file input value
                // Reset fileName state
                setFileName('');
            })
    };



    const handleFileExport = async () => {
        try {
            dispatch(exportItems())
                .finally(() => {
                    toast.success("Item exported successfully");
                    setIsMoreDropdownOpen(false)
                });
        } catch (error) {
            toast.error('Error exporting items:', error);
            setIsMoreDropdownOpen(false)
        }
    };


    // serch and filter

    // filter
    const [status, setStatus] = useState('');
    const filterDropdownRef = useRef(null);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [selecteFilter, setSelecteFilter] = useState('All');

    const handleFilterSelection = (filter) => {
        setSelecteFilter(filter);
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


    //sortBy
    const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
    const [selectedSortBy, setSelectedSortBy] = useState('All');


    const handleSortBySelection = (sortBy) => {
        setSelectedSortBy(sortBy);
        setIsSortByDropdownOpen(false);

        const sortByButton = document?.getElementById("sortByButton");
        if (sortByButton) {
            if (sortBy !== 'All') {
                sortByButton?.classList.add('filter-applied');
                // setQuotationNo("") 
            } else {
                sortByButton?.classList.remove('filter-applied');

            }
        }
    };
    //sortBy

    //serch
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

    // serch and filter
    // console.log("selectedSortBy", selectedSortBy)
    // console.log("todayDate", todayDate())

    //fetch all data
    useEffect(() => {
        let sendData = {
            fy: localStorage.getItem('FinancialYear'),
            warehouse_id: localStorage.getItem('selectedWarehouseId'),
            noofrec: itemsPerPage,
            currentpage: currentPage,
            sort_order: 1
        };
        if (searchTerm) {
            sendData.search = searchTerm;
        }
        if (selectedSortBy !== "All") {
            sendData.sort_by = selectedSortBy
        }
        if (selecteFilter !== "All") {
            sendData.status = selecteFilter
        }

        dispatch(expenseLists(sendData));

        setDataChanging(false);
    }, [currentPage, itemsPerPage, dispatch, selectedSortBy, selecteFilter, searchCall, callApi]);

    //fetch all data


    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // Update the file input value
            fileInputRef.current.files = files;
            setFileName(files[0].name); // Set the file name
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileImport(files[0]); // Pass the first dropped file to handleFileImport
            setFileName(files[0].name); // Set the file name
        }
    };

    //DropDown for fitler, sortby and import/export
    const handleSortByDropdownToggle = () => {
        setIsSortByDropdownOpen(!isSortByDropdownOpen);
    };

    // console.log("opensortby", isSortByDropdownOpen)

    const handleFilterDropdownToggle = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
        // setIsSortByDropdownOpen(!isSortByDropdownOpen);

    };

    const handleMoreDropdownToggle = () => {
        setIsMoreDropdownOpen(!isMoreDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
            setIsSortByDropdownOpen(false);
        }
        if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
            setIsFilterDropdownOpen(false);
        }
        if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
            setIsMoreDropdownOpen(false);
        }

        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {importItemss?.loading && <MainScreenFreezeLoader />}
            {exportItemss?.loading && <MainScreenFreezeLoader />}
            <TopLoadbar />
            <div id="middlesection" className="">
                <div id="Anotherbox" className='formsectionx1'>
                    <div id="leftareax12">

                        <h1 id="firstheading">
                            <svg enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" id="fi_12139704"><g id="_x35_0_Loan"></g><g id="_x34_9_Global_Economy"></g><g id="_x34_8_Marketplace"></g><g id="_x34_7_Protection"></g><g id="_x34_6_Money"></g><g id="_x34_5_Money_Management"></g><g id="_x34_4_Invoice"></g><g id="_x34_3_Interest_Rate"></g><g id="_x34_2_Supply"></g><g id="_x34_1_Monthly_Bill"></g><g id="_x34_0_Pay_Day"></g><g id="_x33_9_Shopping_Cart"></g><g id="_x33_8_Recession"></g><g id="_x33_7_Asset_Protection"></g><g id="_x33_6_Loss"></g><g id="_x33_5_Profit"></g><g id="_x33_4_Trade"></g><g id="_x33_3_Expense"><g><path d="m453.28 460.491-412.073-92.716-41.207-211.187c0-14.224 11.531-25.755 25.755-25.755h396.62c17.069 0 30.905 13.837 30.905 30.905z" fill="#687daa"></path><g><path d="m425.98 101.885c0 25.343-10.776 48.171-27.99 64.149-110.624-11.813-112.425-104.837-86.947-147.346 8.612-2.833 17.812-4.368 27.372-4.368 48.356-.001 87.565 39.208 87.565 87.565z" fill="#f9ee80"></path><path d="m398.006 166.042c-15.622 14.524-36.567 23.409-59.591 23.409-48.359 0-87.565-39.206-87.565-87.565 0-38.797 25.242-71.71 60.198-83.199-1.203 31.955 4.109 123.467 86.958 147.355z" fill="#f9d171"></path><path d="m364.966 120.281c0-4.97-1.508-9.754-4.368-13.844-2.847-4.056-6.817-7.104-11.501-8.821l-16.085-5.854c-3.406-1.236-5.696-4.505-5.696-8.132v-.137c0-6.23 4.875-11.396 10.867-11.517 3.04-.041 5.923 1.089 8.072 3.238 1.377 1.378 2.367 3.088 2.863 4.945 1.099 4.123 5.333 6.569 9.456 5.475 4.123-1.1 6.574-5.334 5.474-9.457-1.195-4.48-3.568-8.591-6.866-11.889-3.09-3.089-6.907-5.349-11.042-6.61v-4.726c0-4.268-3.459-7.726-7.726-7.726s-7.726 3.459-7.726 7.726v4.746c-10.858 3.395-18.824 13.746-18.824 25.796v.137c0 10.104 6.379 19.209 15.869 22.655l16.062 5.846c1.692.62 3.128 1.72 4.147 3.172 1.028 1.47 1.571 3.191 1.571 4.978 0 6.23-4.874 11.396-10.867 11.516-3.065.044-5.926-1.092-8.083-3.249-1.371-1.37-2.362-3.086-2.866-4.96-1.108-4.121-5.35-6.564-9.468-5.454-4.121 1.108-6.563 5.347-5.455 9.468 1.206 4.485 3.579 8.591 6.862 11.873 3.146 3.146 6.925 5.399 11.051 6.646v4.698c0 4.268 3.459 7.726 7.726 7.726s7.726-3.459 7.726-7.726v-4.743c10.86-3.394 18.827-13.746 18.827-25.796z" fill="#7888af"></path></g><g><circle cx="231.405" cy="208.097" fill="#f9ee80" r="87.565"></circle></g><g><path d="m484.185 213.247v267.847c0 17.07-13.835 30.905-30.905 30.905h-141.815c-219.552-42.993-241.633-234.672-186.947-329.657h328.762c17.07 0 30.905 13.835 30.905 30.905z" fill="#7fb0e4"></path><g><path d="m371.405 347.171c0-32.354 26.228-58.581 58.581-58.581h61.41c11.379 0 20.604 9.225 20.604 20.604v75.955c0 11.379-9.225 20.604-20.604 20.604h-61.41c-32.353-.001-58.581-26.228-58.581-58.582z" fill="#a8c9ed"></path><circle cx="435.844" cy="347.171" fill="#b0f0ef" r="17.574"></circle></g><path d="m311.465 512h-280.56c-17.07 0-30.905-13.835-30.905-30.905v-324.507c0 14.227 11.528 25.755 25.755 25.755h98.764c-1.876 76.16 13.422 270.257 186.946 329.657z" fill="#68a2df"></path></g><path d="m43.992 78.336h17.292v61.975c0 5.69 4.612 10.302 10.302 10.302h42.612c5.69 0 10.302-4.612 10.302-10.302v-61.975h17.292c5.923 0 9.32-6.744 5.795-11.504l-46.417-62.662c-4.118-5.56-12.438-5.56-16.556 0l-46.417 62.662c-3.525 4.759-.128 11.504 5.795 11.504z" fill="#ff938a"></path></g></g><g id="_x33_2_Financial_Strategy"></g><g id="_x33_1_Payment_Terminal"></g><g id="_x33_0_Withdrawal"></g><g id="_x32_9_Tax"></g><g id="_x32_8_Balance"></g><g id="_x32_7_Stock_Market"></g><g id="_x32_6_Cheque"></g><g id="_x32_5_Deposit"></g><g id="_x32_4_Gold_Ingots"></g><g id="_x32_3_Income"></g><g id="_x32_2_Cash_Flow"></g><g id="_x32_1_Bankruptcy"></g><g id="_x32_0_Money_Bag"></g><g id="_x31_9_Value"></g><g id="_x31_8_Inflation"></g><g id="_x31_7_Insurance"></g><g id="_x31_6_Startup"></g><g id="_x31_5_Balance_Sheet"></g><g id="_x31_4_Assets"></g><g id="_x31_3_Bank"></g><g id="_x31_2_Credit_Card"></g><g id="_x31_1_Investment"></g><g id="_x31_0_Growth"></g><g id="_x39__Analysis"></g><g id="_x38__Currency"></g><g id="_x37__Statistic"></g><g id="_x36__Debt"></g><g id="_x35__Wallet"></g><g id="_x34__Safebox"></g><g id="_x33__Demand"></g><g id="_x32__Online_Banking"></g><g id="_x31__Accounting"></g></svg>                            All Expenses</h1>
                        <p id="firsttagp">{itemList?.count} records</p>
                        <div id="searchbox">
                            <input
                                id="commonmcsearchbar" // Add an ID to the search input field
                                type="text"
                                placeholder="Search In All Expenses."
                                value={searchTerm}
                                onChange={handleSearch}
                            />

                            <IoSearchOutline onClick={searchItems} data-tooltip-content="Search" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />
                        </div>
                    </div>

                    <div id="buttonsdata">
                        <div className="maincontainmiainx1">
                            <div className="filtersorticos5w" id="sortByButton" onClick={handleSortByDropdownToggle}>
                                <img src={sortbyIco} alt="" data-tooltip-content="Sort By" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />

                            </div>
                            {isSortByDropdownOpen && (

                                <div className="dropdowncontentofx35" ref={sortDropdownRef}>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'All' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('All')}>All Expenses</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'transaction_date' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('transaction_date')}>Date</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'expense_head_id' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('expense_head_id')}>Expense Type</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'acc_id' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('acc_id')}>Expense Account</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'amount' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('amount')}>Amount</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'paid_by' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('paid_by')}>Paid Throught</div>

                                </div>
                            )}
                        </div>

                        <div className="maincontainmiainx1">
                            <div className="filtersorticos5w" id="filterButton" onClick={handleFilterDropdownToggle}>
                                <img src={FilterIco} alt="" data-tooltip-content="Filter" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />

                            </div>
                            {isFilterDropdownOpen && (
                                <div className="dropdowncontentofx35" ref={filterDropdownRef}>

                                    <div className={`dmncstomx1 ${selecteFilter === 'Normal' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('Normal')}>All Expenses</div>

                                    <div className={`dmncstomx1 ${selecteFilter === 'transaction_date' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('transaction_date')}>Date</div>
                                </div>
                            )}

                        </div>
                        <Link className="linkx1" to={"/dashboard/create-expenses"} data-tooltip-content="New Payment" data-tooltip-id="my-tooltip" data-tooltip-place="bottom">
                            New Expense Record <GoPlus />
                        </Link>

                        <ResizeFL data-tooltip-content="Expend" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />

                        {/* More dropdown */}
                        <div className="maincontainmiainx1">
                            <div className="mainx2" onClick={handleMoreDropdownToggle}>
                                <img src={newmenuicoslz} alt="" data-tooltip-content="More Options" data-tooltip-place="bottom" data-tooltip-id="my-tooltip" />
                            </div>
                            {isMoreDropdownOpen && (
                                <div className="dropdowncontentofx35" ref={moreDropdownRef}>
                                    <div onClick={handleImportButtonClick} className="dmncstomx1 xs2xs23" >
                                        {otherIcons?.import_svg}
                                        <div>Import</div>
                                    </div>

                                    <div className="dmncstomx1 xs2xs23" onClick={handleFileExport}>
                                        {otherIcons?.export_svg}
                                        Export
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* <div className="bordersinglestroke"></div> */}
                <div id="mainsectioncsls" className="listsectionsgrheigh">
                    <div id="leftsidecontentxls">
                        <div id="item-listsforcontainer">
                            <div id="newtableofagtheme">
                                <div className="table-headerx12">
                                    <div className="table-cellx12 checkboxfx1 x2s5554" id="styl_for_check_box">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAllChange}
                                        />
                                        <div className="checkmark"></div>
                                    </div>
                                    {expenseTableIcons?.map((val, index) => (
                                        <div key={index} className={`table-cellx12 ${val?.className}`}>
                                            {val?.svg}
                                            {val?.name}
                                        </div>
                                    ))}
                                </div>

                                {itemListLoading || dataChanging ? (
                                    <TableViewSkeleton />
                                ) : (
                                    <>
                                        {itemList?.expense?.length >= 1 ? (
                                            itemList?.expense?.map((quotation, index) => (
                                                <div
                                                    className={`table-rowx12 ${selectedRows.includes(quotation?.id) ? "selectedresult" : ""}`}
                                                    key={index}
                                                >
                                                    <div className="table-cellx12 checkboxfx1" id="styl_for_check_box">
                                                        <input
                                                            checked={selectedRows.includes(quotation?.id)}
                                                            type="checkbox"
                                                            onChange={() => handleCheckboxChange(quotation?.id)}
                                                        />
                                                        <div className="checkmark"></div>
                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 journalx4s1">
                                                        {quotation?.transaction_date || "NA"}
                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 journalx4s2">
                                                        {quotation?.expense_account?.account_name || "NA"}
                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 journalx4s3">
                                                        {quotation?.expense_head?.expense_name || "NA"}
                                                    </div>

                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 journalx4s7 textleftx45s" >
                                                        {quotation?.amount || "NA"}
                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 journalx4s4">
                                                        {quotation?.paid_through?.account_name || "NA"}
                                                    </div>
                                                    <div
                                                        // onClick={() => handleRowClicked(quotation)}
                                                        className="table-cellx12 journalx4s6 ">

                                                        <p className={`stockhistoryxjlk478 ${quotation?.document ? "" : "nil"}`}>
                                                            {quotation?.document ? (
                                                                <>
                                                                    <Link target="_blank" to={`${quotation?.document}`}>{otherIcons?.file_svg} File Attached</Link>
                                                                </>
                                                            ) : "Nil"}
                                                        </p>


                                                    </div>


                                                </div>
                                            ))
                                        ) : (
                                            <NoDataFound />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                                <PaginationComponent
                                    itemList={itemList?.count}
                                    setDataChangingProp={handleDataChange}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                    setItemsPerPage={setItemsPerPage}
                                />
            </div>


            {showImportPopup && (
                <div className={`mainxpopups1 ${isDragging ? 'dragover' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                >
                    <div className="popup-content">
                        <span className="close-button" onClick={() => setShowImportPopup(false)}><RxCross2 /></span>
                        <h2>Import Items</h2>

                        <form onSubmit={handleFileImport}>
                            <div className="midpopusec12x">
                                <div className="cardofselcetimage5xs">
                                    {otherIcons?.drop_file_svg}
                                    <h1>Drop your file here, or <label onClick={openFileDialog}>browse</label> </h1>
                                    <input className="custominputofc156s" id="browse" type="file" accept=".xlsx" ref={fileInputRef} onChange={handleFileInputChange} required />
                                    <b>{fileName}</b>
                                    <p>Supports: .xlsx</p>
                                </div>
                                <button type="submit" className="submitbuttons1">
                                    <span>
                                        <p>Import</p>
                                        {otherIcons?.import_svg}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Toaster />
        </>
    );
};

export default Expenses;