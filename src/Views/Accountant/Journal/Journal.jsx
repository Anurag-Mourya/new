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
import { accountTableIcons, itemsTableIcon, journalsTableIcons } from "../../Helper/SVGIcons/ItemsIcons/ItemsTableIcons";

import { exportItems, importItems } from "../../../Redux/Actions/itemsActions";
import { RxCross2 } from "react-icons/rx";
import MainScreenFreezeLoader from "../../../Components/Loaders/MainScreenFreezeLoader";
import NoDataFound from "../../../Components/NoDataFound/NoDataFound";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { CiImageOn, CiSettings } from "react-icons/ci";
import { todayDate } from "../../Helper/DateFormat";



import sortbyIco from '../../../assets/outlineIcons/othericons/sortbyIco.svg';
import FilterIco from '../../../assets/outlineIcons/othericons/FilterIco.svg';



import newmenuicoslz from '../../../assets/outlineIcons/othericons/newmenuicoslz.svg';
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";



const Journal = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [dataChanging, setDataChanging] = useState(false);
    const itemListState = useSelector(state => state?.journalList);
    const itemList = itemListState?.data?.journal || [];
    const totalItems = itemListState?.data?.count || 0;
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
        setSelectedRows(selectAll ? [] : itemList.map((row) => row.id));
    };


    const handleRowClicked = (quotation) => {
        Navigate(`/dashboard/journal-details?id=${quotation.id}`);
    };

    // useEffect(() => {
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);

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
    console.log("todayDate", todayDate())

    //fetch all data
    useEffect(() => {
        let sendData = {
            fy: "2024",
            noofrec: itemsPerPage,
            currentpage: currentPage,
        };
        if (searchTerm) {
            sendData.search = searchTerm;
        }

        switch (selectedSortBy) {
            // case 'All':
            //     sendData.name = 1
            //     break;
            case 'Today':
                sendData.today = todayDate();
                break;

            case 'this_week':
                sendData.this_week = selectedSortBy;
                break;
            case 'this_month':
                sendData.this_month = selectedSortBy;
                break;

            case 'this_quarter':
                sendData.this_quarter = selectedSortBy;
                break;
            case 'this_year':
                sendData.this_year = selectedSortBy;
                break;
            default:

        }
        switch (selecteFilter) {

            case '0':
                sendData.status = selecteFilter;
                break;

            case '1':
                sendData.status = selecteFilter;
                break;

            default:

        }



        dispatch(journalLists(sendData));

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
        setIsFilterDropdownOpen(false);
        setIsMoreDropdownOpen(false);


    };

    // console.log("opensortby", isSortByDropdownOpen)

    const handleFilterDropdownToggle = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
        // setIsSortByDropdownOpen(!isSortByDropdownOpen);
        setIsSortByDropdownOpen(false);
        setIsMoreDropdownOpen(false);


    };

    const handleMoreDropdownToggle = () => {
        setIsMoreDropdownOpen(!isMoreDropdownOpen);
        setIsFilterDropdownOpen(false);
        setIsSortByDropdownOpen(false);
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
        document.addEventListener("mousedown", handleClickOutside);//mousedown
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {importItemss?.loading && <MainScreenFreezeLoader />}
            {exportItemss?.loading && <MainScreenFreezeLoader />}
            <TopLoadbar />
            <div id="middlesection" className="" >
                <div id="Anotherbox" className='formsectionx1'>
                    <div id="leftareax12">

                        <h1 id="firstheading">
                            <svg id="fi_5538087" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g clip-rule="evenodd" fill-rule="evenodd"><g><path d="m406.505 44.611c0-13.529-11.043-24.566-24.571-24.566-79.196-.005-307.864 0-307.864 0-18.816 0-34.071 15.255-34.071 34.071v403.77c0 18.816 15.255 34.071 34.071 34.071 0 0 228.669.005 307.864 0 13.528 0 24.571-11.033 24.571-24.566 0-140.928 0-281.854 0-422.78z" fill="#66d4f1"></path><path d="m364.822 51.728c-94.38-.004-188.759.001-283.139.001-5.508 0-10 4.493-10 10v388.544c0 5.505 4.488 9.996 9.993 10 44.517.001 213.607.003 283.146.001 5.507 0 9.999-4.492 9.999-10 0-129.515 0-259.03 0-388.545 0-5.509-4.492-10.001-9.999-10.001z" fill="#4fc0e8"></path><path d="m120.473 51.728h-38.79c-5.508 0-10 4.492-10 10v388.543c0 5.507 4.492 10 10 10h38.79z" fill="#38a8d2"></path><path d="m185.756 110.664h123.782c5.508 0 10 4.492 10 10v44.888c0 5.508-4.492 10-10 10h-123.782c-5.508 0-10-4.492-10-10v-44.888c0-5.508 4.492-10 10-10z" fill="#f4f6f8"></path><path d="m26.562 97.887h58.558c5.817 0 10.561 4.744 10.561 10.561v19.448c0 5.817-4.744 10.561-10.561 10.561h-58.558c-5.817 0-10.561-4.744-10.561-10.561v-19.448c-.001-5.817 4.744-10.561 10.561-10.561zm0 275.656h58.558c5.817 0 10.561 4.744 10.561 10.561v19.448c0 5.817-4.744 10.561-10.561 10.561h-58.558c-5.817 0-10.561-4.744-10.561-10.561v-19.448c-.001-5.817 4.744-10.561 10.561-10.561zm0-91.885h58.558c5.817 0 10.561 4.744 10.561 10.561v19.447c0 5.817-4.744 10.561-10.561 10.561h-58.558c-5.817 0-10.561-4.744-10.561-10.561v-19.447c-.001-5.817 4.744-10.561 10.561-10.561zm0-91.886h58.558c5.817 0 10.561 4.744 10.561 10.561v19.447c0 5.817-4.744 10.561-10.561 10.561h-58.558c-5.817 0-10.561-4.744-10.561-10.561v-19.447c-.001-5.816 4.744-10.561 10.561-10.561z" fill="#636c77"></path></g><g><path d="m442.681 156.607c12.155-12.156 32.047-12.156 44.203 0 12.155 12.156 12.155 32.047-.001 44.203l-172.836 172.835-50.87 18.077c-3.777 1.342-7.747.412-10.534-2.469-2.788-2.88-3.587-6.878-2.122-10.609l19.324-49.201z" fill="#636c77"></path><path d="m269.845 329.443-19.324 49.201c-1.465 3.731-.666 7.729 2.122 10.609 2.788 2.881 6.757 3.811 10.534 2.469l50.87-18.077s.124-.124.367-.362c0 0-44.207-44.207-44.205-44.205-.24.241-.364.365-.364.365z" fill="#f4f6f8"></path><path d="m424.995 174.293 44.202 44.202c10.893-10.893 17.686-17.686 17.686-17.686 12.156-12.156 12.156-32.047.001-44.203-12.156-12.156-32.047-12.155-44.203 0 0 .001-6.794 6.794-17.686 17.687z" fill="#fdcd56"></path></g></g></svg>                            Manual Journals</h1>
                        <p id="firsttagp">{totalItems} records</p>
                        <div id="searchbox">
                            <input
                                id="commonmcsearchbar" // Add an ID to the search input field
                                type="text"
                                placeholder="Enter in all journals."
                                value={searchTerm}
                                onChange={handleSearch}
                            />

                            <IoSearchOutline onClick={searchItems} />
                        </div>
                    </div>

                    <div id="buttonsdata">
                        <div className="maincontainmiainx1">
                            <div className="filtersorticos5w" id="sortByButton" onClick={handleSortByDropdownToggle}>
                                <img src={sortbyIco} alt="" data-tooltip-content="Sort By" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />

                                <p>Period</p>
                            </div>
                            {isSortByDropdownOpen && (

                                <div className="dropdowncontentofx35" ref={sortDropdownRef}>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'All' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('All')}>All</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'Today' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('Today')}>Today</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'this_week' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('this_week')}>This week</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'this_month' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('this_month')}>This Month</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'this_quarter' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('this_quarter')}>This Quarter</div>

                                    <div className={`dmncstomx1 ${selectedSortBy === 'this_year' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('this_year')}>This Year</div>

                                </div>
                            )}
                        </div>

                        <div className="maincontainmiainx1">
                            <div className="filtersorticos5w" id="filterButton" onClick={handleFilterDropdownToggle}>
                                <img src={FilterIco} alt="" data-tooltip-content="Filter" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />

                            </div>
                            {isFilterDropdownOpen && (
                                <div className="dropdowncontentofx35" ref={filterDropdownRef}>

                                    <div className={`dmncstomx1 ${selecteFilter === 'Normal' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('Normal')}>All Journals</div>

                                    <div className={`dmncstomx1 ${selecteFilter === '0' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('0')}>Draft</div>

                                    <div className={`dmncstomx1 ${selecteFilter === '1' ? 'activedmc' : ''}`} onClick={() => handleFilterSelection('1')}>Published</div>



                                </div>
                            )}

                        </div>
                        <Link className="linkx1" to={"/dashboard/create-journal"}>
                            New Journal <GoPlus />
                        </Link>
                        <ResizeFL />

                        {/* More dropdown */}
                        <div className="maincontainmiainx1">
                            <div className="mainx2" onClick={handleMoreDropdownToggle}>
                                <img src={newmenuicoslz} alt="" />
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
                                    {journalsTableIcons?.map((val, index) => (
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
                                        {itemList?.length >= 1 ? (
                                            itemList?.map((quotation, index) => (
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
                                                        {quotation?.journal_no || "NA"}
                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 journalx4s3">
                                                        {quotation?.reference || "NA"}
                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs6 journalx4s4 sdjklfsd565 x566sd54w2sxw">
                                                        {/* {quotation.total || ""} */}
                                                        <p className={`${quotation?.status == 1 ? 'approved' : 'draft'}`}>{quotation?.status == 1 ? 'Published' : 'Draft'}</p>

                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 journalx4s5">
                                                        {quotation?.notes || "NA"}
                                                    </div>
                                                    <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 journalx4s6">
                                                        {(+quotation?.total_debit) + (+quotation?.total_credit)}
                                                    </div>
                                                    <div
                                                        // onClick={() => handleRowClicked(quotation)}
                                                        // className="table-cellx12 journalx4s7 parentstockhistoryxjlk478">
                                                        className="table-cellx12 journalx4s7">

                                                        <p className={`stockhistoryxjlk478 ${quotation?.upload_image ? "" : "nil"}`}>
                                                            {quotation?.upload_image ? (
                                                                <>
                                                                    <Link target="_blank" to={`${quotation?.upload_image}`}>{otherIcons?.file_svg} File Attached</Link>
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
                    itemList={totalItems}
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

export default Journal;