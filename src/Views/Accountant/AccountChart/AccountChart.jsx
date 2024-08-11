import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
// import TopLoadbar from "../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { accountLists, itemLists } from "../../../Redux/Actions/listApisActions";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import { otherIcons } from "../../Helper/SVGIcons/ItemsIcons/Icons";
// import { itemsTableIcon } from "../Helper/SVGIcons/ItemsIcons/ItemsTableIcons";
import { accountTableIcons, itemsTableIcon } from "../../Helper/SVGIcons/ItemsIcons/ItemsTableIcons";

import { exportItems, importItems } from "../../../Redux/Actions/itemsActions";
import { RxCross2 } from "react-icons/rx";
import MainScreenFreezeLoader from "../../../Components/Loaders/MainScreenFreezeLoader";
import NoDataFound from "../../../Components/NoDataFound/NoDataFound";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import { CiSettings } from "react-icons/ci";
import { accountDelete, accountStatus } from "../../../Redux/Actions/accountsActions";

import newmenuicoslz from '../../../assets/outlineIcons/othericons/newmenuicoslz.svg';

const AccountChart = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [dataChanging, setDataChanging] = useState(false);
    const itemListState = useSelector(state => state?.accountList);




    const accDelete = useSelector(state => state?.deleteAccount);
    const accStatus = useSelector(state => state?.accountStatus);
    const itemList = itemListState?.data?.accounts || [];
    const totalItems = itemListState?.data?.total_accounts || 0;
    const itemListLoading = itemListState?.loading || false;
    const [searchTerm, setSearchTerm] = useState("");
    const Navigate = useNavigate();

    // console.log("accStatus", accStatus)

    const importItemss = useSelector(state => state?.importItems);
    const exportItemss = useSelector(state => state?.exportItems);

    const [callApi, setCallApi] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchCall, setSearchCall] = useState(false);
    const moreDropdownRef = useRef(null);
    const settingDropdownRef = useRef(null);
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
        Navigate(`/dashboard/account-details?id=${quotation.id}`);
    };

    // open setting 
    const [isSettingDropdownOpen, setIsSettingDropdownOpen] = useState({});

    const toggleDropdown = (quotationId) => {
        setIsSettingDropdownOpen(prevState => ({
            ...prevState,
            [quotationId]: !prevState[quotationId]
        }));
    };

    //for create unique popup for every row status,edit and

    //unique popup
    const openSettingPopup = (quotation) => {
        toggleDropdown(quotation.id);
        const settingIcon = document.getElementById(`settingIcon-${quotation.id}`);
        const dropdownContent = moreDropdownRef.current;

        if (settingIcon && dropdownContent) {
            const rect = settingIcon.getBoundingClientRect();
            dropdownContent.style.top = `${rect.top}px`;
            dropdownContent.style.left = `${rect.right}px`;
        }
    };
    //unique popup

    //handler for status,edit and delete
    const handleAccountChange = (accountValue, name) => {
        let sendData = { id: accountValue?.id }
        if (name === "status") {
            // console.log("sssssssss", accountValue)
            if (accountValue?.status === "1") {
                sendData.status = "0";
                setCallApi((preState) => !preState);
            } else if (accountValue?.status === "0") {
                sendData.status = "1";
                setCallApi((preState) => !preState);
            }
            dispatch(accountStatus(sendData));
            setIsSettingDropdownOpen({})
        }
        else if (name === "edit") {
            const parsedImages = JSON.parse(accountValue.upload_image);

            localStorage.setItem("editAccount", JSON.stringify({ ...accountValue, upload_image: parsedImages }));
            const queryParams = new URLSearchParams();
            // queryParams.set("id", accountValue?.id);
            queryParams.set("edit", true);
            Navigate(`/dashboard/create-account-chart?${queryParams.toString()}`);
        } else if (name === "delete") {
            dispatch(accountDelete(sendData));
            setCallApi((preState) => !preState);
            setIsSettingDropdownOpen({})
        }
    }
    //for create unique popup for every row status,edit and delete




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


    //fetch all data
    useEffect(() => {
        let sendData = {
            fy: localStorage.getItem('FinancialYear'),
            noofrec: itemsPerPage,
            currentpage: currentPage,
        };
        if (searchTerm) {
            sendData.search = searchTerm;
        }

        dispatch(accountLists(sendData));

        setDataChanging(false);
    }, [currentPage, itemsPerPage, dispatch, searchCall, callApi]);
    //fetch all data


    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
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



    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

    const handleMoreDropdownToggle = () => {
        setIsMoreDropdownOpen(!isMoreDropdownOpen);
    };
    const handleClickOutside = (event) => {

        if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
            setIsMoreDropdownOpen(false);
        }
        if (settingDropdownRef.current && !settingDropdownRef.current.contains(event.target)) {
            setIsSettingDropdownOpen(false);
        }

        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }

        if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
            setIsSettingDropdownOpen({});
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
                        <svg id="fi_16973083" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="10" fill="#ced3ed" r="6"></circle><path d="m21 18h-10c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="#4257ff"></path></svg>                            All Accounts</h1>
                        <p id="firsttagp">{totalItems} records</p>
                        <div id="searchbox">
                            <input
                                id="commonmcsearchbar" // Add an ID to the search input field
                                type="text"
                                placeholder="Enter in all accounts."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <IoSearchOutline onClick={searchItems} />
                        </div>

                    </div>
                    <div id="buttonsdata">

                        <Link className="linkx1" to={"/dashboard/create-account-chart"}>
                            New Account <GoPlus />
                        </Link>
                        <div className="maincontainmiainx1">
                            <div className="mainx2" onClick={handleMoreDropdownToggle}>
                            <img src={newmenuicoslz} alt="" />
                            </div>
                            {isMoreDropdownOpen && (
                                <div className="dropdowncontentofx35" ref={moreDropdownRef}>
                                    <div
                                        //   onClick={handleImportButtonClick}
                                        className="dmncstomx1 xs2xs23 sdfsd5f54dsx5s" >
                                        {otherIcons?.import_svg}
                                        <div>Import Accounts</div>
                                    </div>

                                    <div className="dmncstomx1 xs2xs23 sdfsd5f54dsx5s"
                                    //   onClick={handleFileExport}
                                    >
                                        {otherIcons?.export_svg}
                                        Export Accounts
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
                                    {accountTableIcons?.map((val, index) => (
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
                                                <>
                                                    <div
                                                        className={`table-rowx12 ${selectedRows.includes(quotation?.id) ? "selectedresult" : ""}`}
                                                        key={index}
                                                        id="table-rowx13"
                                                    >
                                                        <div className="table-cellx12 checkboxfx1" id="styl_for_check_box">


                                                            {quotation.lock_status == "1" ? <>{otherIcons?.locked_svg} </> : <>
                                                                <input
                                                                    checked={selectedRows.includes(quotation?.id)}
                                                                    type="checkbox"
                                                                    onChange={() => handleCheckboxChange(quotation?.id)}
                                                                />
                                                                <div className="checkmark"></div>
                                                            </>}
                                                        </div>

                                                        {/* <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 ">
                                                            id: {quotation?.id || ""}
                                                        </div>
                                                        <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 ">
                                                            p_id: {quotation?.parent_id || ""}
                                                        </div>
                                                        <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 namefield">
                                                        s_id: {quotation?.sub_account || ""}
                                                        </div> */}

                                                        <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 namefield">
                                                            {quotation?.account_name || ""}
                                                        </div>
                                                        <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 x23field">
                                                            {quotation?.account_code || "NA"}
                                                        </div>
                                                        <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 x24field">
                                                            {quotation?.account_type || ""}
                                                        </div>



                                                        <div className="table-cellx12 x275field svgiconofsetitikn4">
                                                            {quotation.lock_status == "1" ? <> </> :
                                                                <>
                                                                    <CiSettings
                                                                        className="svgiconofsetitikn4icon"
                                                                        id={`settingIcon-${quotation.id}`}
                                                                        onClick={() => openSettingPopup(quotation)}
                                                                    />
                                                                    {isSettingDropdownOpen[quotation.id] && (
                                                                        <div className="dropdowncontentofx36" ref={moreDropdownRef} >
                                                                            <div className="dmncstomx1 xs2xs23" onClick={() => handleAccountChange(quotation, "status")}>
                                                                                {otherIcons?.import_svg}
                                                                                <div>Make as {quotation?.status === "0" ? "active" : "inactive"}
                                                                                </div>

                                                                            </div>
                                                                            <div className="dmncstomx1 xs2xs23" onClick={() => handleAccountChange(quotation, "edit")}>
                                                                                {otherIcons?.edit_svg}
                                                                                <div>Edit</div>
                                                                            </div>
                                                                            <div className="dmncstomx1 xs2xs23" onClick={() => handleAccountChange(quotation, "delete")}>
                                                                                {otherIcons?.delete_svg}
                                                                                <div>Delete</div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>}
                                                        </div>


                                                    </div>



                                                    <div
                                                        className={`table-rowx12 sd4fw5w5w5sd ${selectedRows.includes(quotation?.id) ? "selectedresult" : ""}`}
                                                        key={index}
                                                        id="table-rowx13"
                                                    >

                                                        {quotation?.sub_accounts?.length > 0 && (
                                                            <div className="sub-accounts-accoiuntscjlka">
                                                                {quotation?.sub_accounts?.map(subAccount => (
                                                                    <div className="accoiuntscjlka48sd5f" key={subAccount.id}>
                                                                        <div className="table-cellx12 checkboxfx1" id="styl_for_check_box">


                                                                            {quotation.lock_status == "1" ? <>{otherIcons?.locked_svg} </> : <>
                                                                                <input
                                                                                    checked={selectedRows.includes(quotation?.id)}
                                                                                    type="checkbox"
                                                                                    onChange={() => handleCheckboxChange(quotation?.id)}
                                                                                />
                                                                                <div className="checkmark"></div>
                                                                            </>}
                                                                        </div>

                                                                        <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 namefield sd4f56sdf48sd65">
                                                                            {subAccount.account_name || ""}
                                                                        </div>
                                                                        <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 x23field sd4f56sdf48sd66">
                                                                            {subAccount.account_code || "NA"}
                                                                        </div>
                                                                        <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 x24field">
                                                                            {subAccount.account_type || ""}
                                                                        </div>



                                                                        <div className="table-cellx12 x275field svgiconofsetitikn4">
                                                                            {quotation.lock_status == "1" ? <> </> :
                                                                                <>
                                                                                    {/* <CiSettings
                                                                                        className="svgiconofsetitikn4icon"
                                                                                        id={`settingIcon-${quotation.id}`}
                                                                                        onClick={() => openSettingPopup(quotation)}
                                                                                    /> */}
                                                                                    {/* {isSettingDropdownOpen[quotation.id] && (
                                                                                        <div className="dropdowncontentofx36" ref={moreDropdownRef} >
                                                                                            <div className="dmncstomx1 xs2xs23" onClick={() => handleAccountChange(quotation, "status")}>
                                                                                                {otherIcons?.import_svg}
                                                                                                <div>Make as {quotation?.status === "0" ? "active" : "inactive"}</div>

                                                                                            </div>
                                                                                            <div className="dmncstomx1 xs2xs23" onClick={() => handleAccountChange(quotation, "edit")}>
                                                                                                {otherIcons?.edit_svg}
                                                                                                <div>Edit</div>
                                                                                            </div>
                                                                                            <div className="dmncstomx1 xs2xs23" onClick={() => handleAccountChange(quotation, "delete")}>
                                                                                                {otherIcons?.delete_svg}
                                                                                                <div>Delete</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )} */}
                                                                                </>}
                                                                        </div>


                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                </>

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

export default AccountChart;