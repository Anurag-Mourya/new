import React, { useState, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
// import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import TopLoadbar from "../../Components/Toploadbar/TopLoadbar";
import { GoPlus } from "react-icons/go";
// import { purchseOrdersLists, quotationLists } from "../../../Redux/Actions/listApisActions";
import { purchseOrdersLists } from "../../Redux/Actions/listApisActions";
import { useDispatch, useSelector } from "react-redux";
import { TbListDetails } from "react-icons/tb";
import PaginationComponent from "../Common/Pagination/PaginationComponent";
import TableViewSkeleton from "../../Components/SkeletonLoder/TableViewSkeleton";
// import './quoations.scss'


import sortbyIco from '../../assets/outlineIcons/othericons/sortbyIco.svg';
import FilterIco from '../../assets/outlineIcons/othericons/FilterIco.svg';
import ResizeFL from "../../Components/ExtraButtons/ResizeFL";
import { warehouseViewAction } from "../../Redux/Actions/warehouseActions";
import { fetchMasterData } from "../../Redux/Actions/globalActions";


const Warehouse = () => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();


    const warehouseList = useSelector(state => state?.warehouseView);
    const warehouseLists = warehouseList?.data;

    const masterData = useSelector(state => state?.masterData?.masterData);
    const mainDeparmentVal = masterData?.filter(val => val?.type === "10")

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [dataChanging, setDataChanging] = useState(false);





    const showDeparmentLabels = (department, mainDeparmentVal) => {
        if (typeof department !== 'string') return '';

        try {
            const depArray = JSON.parse(department);
            const labels = depArray.map(depId => {
                const depObj = mainDeparmentVal.find(val => val.labelid === depId);
                return depObj ? depObj.label : '';
            }).filter(label => label !== '');

            return labels.join(', ');
        } catch (e) {
            console.error('Invalid JSON string in department:', department);
            return '';
        }
    };


    // serch,filter and sortby////////////////////////////////////

    // filter
    const filterDropdownRef = useRef(null);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [selectAllWarehouse, setSelectAllWarehouse] = useState(false);
    const [status, setStatus] = useState('');
    const [allFilters, setAllFilters] = useState({});

    const handleApplyFilter = () => {
        const isActive = status === 'active' ? '1' : status === 'inactive' ? '0' : '';
        document.getElementById('filterButton').classList.toggle('filter-applied', !!isActive);
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
        setAllFilters(isActive ? { is_active: isActive } : {});
    };

    const handleWarehouseChange = checked => (setSelectAllWarehouse(checked), checked && setStatus(''));

    const handleAllItemsChange1 = (checked, name, val) => {
        if (name === "status" && val) {
            if (checked) {
                setStatus(val);
                setSelectAllWarehouse(false)
            } else {
                setStatus("");
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
            }

            if (searchTerm) {
                sendData.search = searchTerm
            }

            if (Object.keys(allFilters).length > 0) {
                dispatch(warehouseViewAction({
                    ...allFilters, ...sendData
                }));
            } else {
                dispatch(warehouseViewAction({ ...sendData }));
            }


            setDataChanging(false)
        } catch (error) {
            console.error("Error fetching quotations:", error);
        }
    };


    useEffect(() => {
        fetchQuotations();
    }, [currentPage, itemsPerPage, allFilters, searchCall]);

    const handleRowClicked = (quotation) => {
        Navigate(`/dashboard/warehouse_detail?id=${quotation.id}`)
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
        const areAllRowsSelected = warehouseLists?.every((row) => selectedRows.includes(row.id));
        setSelectAll(areAllRowsSelected);
    }, [selectedRows, warehouseLists]);

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        setSelectedRows(selectAll ? [] : warehouseLists?.map((row) => row.id));
    };
    //logic for checkBox...

    const handleDataChange = (newValue) => {
        setDataChanging(newValue);
    };



    const dropdownRef = useRef(null);

    //DropDown for fitler, sortby and import/export

    const handleFilterDropdownToggle = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
    };


    const handleClickOutside = (event) => {
        if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
            setIsFilterDropdownOpen(false);
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
            <TopLoadbar />
            <div id="middlesection" >
                <div id="Anotherbox">
                    <div id="leftareax12">
                        <h1 id="firstheading">

                            All Warehouses
                        </h1>
                        <p id="firsttagp">{warehouseLists?.length} records</p>
                        <div id="searchbox">
                            <input
                                id="commonmcsearchbar"
                                type="text"
                                placeholder="Search In All Warehouses"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <IoSearchOutline onClick={searchItems} data-tooltip-content="Search" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />
                        </div>
                    </div>

                    <div id="buttonsdata">
                        <div className={`maincontainmiainx1`}>

                            <div className="filtersorticos5w" id="filterButton" onClick={handleFilterDropdownToggle}>
                                <img src={FilterIco} alt="" data-tooltip-content="Filter" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />
                            </div>
                            {isFilterDropdownOpen && (
                                <div className="" ref={filterDropdownRef}>

                                    <div className="filter-container">
                                        <label className={selectAllWarehouse ? "active-filter" : "labelfistc51s"}>

                                            <input
                                                type="checkbox"
                                                checked={selectAllWarehouse}
                                                onChange={(e) => handleWarehouseChange(e.target.checked)}

                                                hidden
                                            />
                                            All Warehouse
                                        </label>

                                        <div className={`cusfilters12x2`}>
                                            <p className="custtypestext4s">Status</p>
                                            <div className={`cusbutonscjks54`}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={status === "active"}
                                                        onChange={(e) => handleAllItemsChange1(e.target.checked, "status", "active")}
                                                    />
                                                    <span className={`filter-button ${status === "active" ? "selected" : ""}`} >Active</span>
                                                </label>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={status === "inactive"}
                                                        onChange={(e) => handleAllItemsChange1(e.target.checked, "status", "inactive")}
                                                    />
                                                    <span className={`filter-button ${status === "inactive" ? "selected" : ""}`}
                                                    >Inactive</span>
                                                </label>
                                            </div>
                                        </div>

                                        <button className="buttonofapplyfilter" onClick={handleApplyFilter}>Apply Filter</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link className="linkx1" to={"/dashboard/create-warehouse"} data-tooltip-place="bottom" data-tooltip-content="New Bill" data-tooltip-id="my-tooltip">
                            New Warehouse <GoPlus />
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
                                        Warehouse Name</div>
                                    <div className="table-cellx12 quotiosalinvlisxs1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                            <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Warehouse Type</div>
                                    <div className="table-cellx12 quotiosalinvlisxs2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                            <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                            <path d="M15 6L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M21 13V11C21 6.75736 21 4.63604 19.682 3.31802C18.364 2 16.2426 2 12 2C7.75736 2 5.63604 2 4.31802 3.31802C3 4.63604 3 6.75736 3 11V13C3 17.2426 3 19.364 4.31802 20.682C5.63604 22 7.75736 22 12 22C16.2426 22 18.364 22 19.682 20.682C21 19.364 21 17.2426 21 13Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M7 14H7.52632M11.7368 14H12.2632M16.4737 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M7 18H7.52632M11.7368 18H12.2632M16.4737 18H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Department</div>

                                    <div className="table-cellx12 quotiosalinvlisxs3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                                            <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        Country</div>

                                    <div className="table-cellx12 quotiosalinvlisxs4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                                            <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        City</div>
                                    <div className="table-cellx12 quotiosalinvlisxs6">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                                            <path d="M13 21.9506C12.6711 21.9833 12.3375 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M7.5 17C8.90247 15.5311 11.0212 14.9041 13 15.1941M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <circle cx="18.5" cy="18.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        STATUS</div>

                                </div>

                                {warehouseList?.loading || dataChanging === true ? (
                                    <TableViewSkeleton />
                                ) : <>
                                    {warehouseLists?.map((quotation, index) => (
                                        <div
                                            className={`table-rowx12 ${selectedRows.includes(quotation.id) ? "selectedresult" : ""}`}
                                            key={index}
                                        >
                                            <div className="table-cellx12 checkboxfx1" id="styl_for_check_box">
                                                <input
                                                    checked={selectedRows.includes(quotation.id)}
                                                    type="checkbox"
                                                    onChange={() => handleCheckboxChange(quotation.id)}
                                                />
                                                <div className="checkmark"></div>
                                            </div>
                                            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                {quotation?.name}</div>
                                            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                {quotation?.warehouse_type}</div>

                                            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs2">
                                                {showDeparmentLabels(quotation?.department, mainDeparmentVal)}

                                            </div>

                                            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs3">
                                                {quotation?.country?.name || ""}
                                            </div>
                                            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs4">
                                                {quotation?.city?.name || ""}
                                            </div>

                                            <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs6 sdjklfsd565">

                                                <p className={quotation?.is_active === "1" ? "open" : quotation?.is_active === "0" ? "declined" : ""}>


                                                    {quotation?.is_active === "0" ? "Inactive" : quotation?.is_active === "1" ? "Active" : ""}
                                                </p>
                                            </div>


                                        </div>
                                    ))}

                                </>}
                            </div>
                        </div>
                    </div>
                </div>
                <PaginationComponent
                    itemList={warehouseLists?.length}
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

export default Warehouse;
