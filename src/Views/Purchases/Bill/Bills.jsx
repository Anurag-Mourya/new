import React, { useState, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import TopLoadbar from "../../../Components/Toploadbar/TopLoadbar";
import PaginationComponent from "../../Common/Pagination/PaginationComponent";
import TableViewSkeleton from "../../../Components/SkeletonLoder/TableViewSkeleton";
import { billLists } from "../../../Redux/Actions/billActions";
import { formatDate, todayDate } from "../../Helper/DateFormat";
import { ListComponent3 } from "../../Sales/Quotations/ListComponent";
import ResizeFL from "../../../Components/ExtraButtons/ResizeFL";

import sortbyIco from '../../../assets/outlineIcons/othericons/sortbyIco.svg';
import FilterIco from '../../../assets/outlineIcons/othericons/FilterIco.svg';



const Quotations = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const billList = useSelector(state => state?.billList);
  // console.log("billList", billList)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dataChanging, setDataChanging] = useState(false);



  // serch,filter and sortby////////////////////////////////////

  // sortBy
  const sortDropdownRef = useRef(null);

  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState('All');

  const handleSortBySelection = (sortBy) => {
    setIsSortByDropdownOpen(false);
    setSelectedSortBy(sortBy)
    const sortByButton = document?.getElementById("sortByButton");
    if (sortByButton) {
      if (sortBy !== 'All') {
        sortByButton?.classList.add('filter-applied');
      } else {
        sortByButton?.classList.remove('filter-applied');
      }
    }
  };




  // filter
  const [status, setStatus] = useState('Normal');
  const filterDropdownRef = useRef(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // console.log("fillllllllllll", status)
  const handleFilterSelection = (filter) => {
    setIsFilterDropdownOpen(false);
    setStatus(filter);
    const sortByButton = document?.getElementById("filterButton");
    if (sortByButton) {
      if (filter !== 'Normal') {
        sortByButton?.classList.add('filter-applied');
      } else {
        sortByButton?.classList.remove('filter-applied');
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
        warehouse_id: localStorage.getItem('selectedWarehouseId'),
        noofrec: itemsPerPage,
        currentpage: currentPage,
        sort_order: 1
      }

      if (searchTerm) {
        sendData.search = searchTerm;
      }
      // console.log("selectedSortBy", selectedSortBy)


      if (selectedSortBy !== "All") {
        sendData.sort_by = selectedSortBy
      }

      if (status !== "Normal") {
        sendData.status = status
      }


      dispatch(billLists(sendData));
      setDataChanging(false)
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };


  useEffect(() => {
    fetchQuotations();
  }, [currentPage, itemsPerPage, selectedSortBy, status, searchCall]);

  const handleRowClicked = (quotation) => {
    Navigate(`/dashboard/bill-details?id=${quotation.id}`)
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



  // dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const handleDropdownToggle = (index) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };


  useEffect(() => {
    const areAllRowsSelected = billList.data?.bills?.every((row) => selectedRows.includes(row.id));
    setSelectAll(areAllRowsSelected);
  }, [selectedRows, billList.data?.bills]);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : billList.data?.bills?.map((row) => row.id));
  };
  //logic for checkBox...

  const handleDataChange = (newValue) => {
    setDataChanging(newValue);
  };



  const dropdownRef = useRef(null);

  //DropDown for fitler, sortby and import/export
  const handleSortByDropdownToggle = () => {
    setIsSortByDropdownOpen(!isSortByDropdownOpen);
  };

  const handleFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
      setIsSortByDropdownOpen(false);
    }
    if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
      setIsFilterDropdownOpen(false);
    }
    // if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
    //   setIsMoreDropdownOpen(false);
    // }

    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);

      }
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
              {/* <img src={"/assets/Icons/allcustomers.svg"} alt="" /> */}
              <svg id="fi_10552479" height="512" viewBox="0 0 60 60" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m9 39v18.2c0 .84.97 1.3 1.62.78l2.76-2.2c.36-.29.88-.29 1.24 0l3.76 3c.36.29.88.29 1.24 0l3.76-3c.36-.29.88-.29 1.24 0l3.76 3c.36.29.88.29 1.24 0l3.76-3c.36-.29.88-.29 1.24 0l3.76 3c.36.29.88.29 1.24 0l3.76-3c.36-.29.88-.29 1.24 0l2.76 2.2c.65.52 1.62.06 1.62-.78v-52.2c0-2.21-1.79-4-4-4h-40z" fill="#f9eab0"></path><path d="m5 1c2.208 0 4 1.792 4 4v34h-6c-1.104 0-2-.896-2-2v-32c0-2.208 1.792-4 4-4z" fill="#f3d55b"></path><g fill="#3f5c6c"><path d="m35 11h-20c-.553 0-1-.448-1-1s.447-1 1-1h20c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m35 17h-20c-.553 0-1-.448-1-1s.447-1 1-1h20c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m35 23h-9c-.553 0-1-.448-1-1s.447-1 1-1h9c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m22 23h-7c-.553 0-1-.448-1-1s.447-1 1-1h7c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m40 29h-25c-.553 0-1-.448-1-1s.447-1 1-1h25c.553 0 1 .448 1 1s-.447 1-1 1z"></path></g><path d="m40 40c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2c0 .552.447 1 1 1s1-.448 1-1c0-1.858-1.279-3.411-3-3.858v-.142c0-.552-.447-1-1-1s-1 .448-1 1v.142c-1.721.447-3 2-3 3.858 0 2.206 1.794 4 4 4 1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2c0-.552-.447-1-1-1s-1 .448-1 1c0 1.858 1.279 3.411 3 3.858v.142c0 .552.447 1 1 1s1-.448 1-1v-.142c1.721-.447 3-2 3-3.858 0-2.206-1.794-4-4-4z" fill="#24ae5f"></path><path d="m30 35h-15c-.553 0-1-.448-1-1s.447-1 1-1h15c.553 0 1 .448 1 1s-.447 1-1 1z" fill="#3f5c6c"></path><path d="m30 41h-15c-.553 0-1-.448-1-1s.447-1 1-1h15c.553 0 1 .448 1 1s-.447 1-1 1z" fill="#3f5c6c"></path><path d="m30 47h-15c-.553 0-1-.448-1-1s.447-1 1-1h15c.553 0 1 .448 1 1s-.447 1-1 1z" fill="#3f5c6c"></path><circle cx="49" cy="16" fill="#24ae5f" r="10"></circle><path d="m47 22c-.265 0-.519-.105-.707-.293l-3-3c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0l2.199 2.199 6.305-8.105c.34-.435.967-.514 1.403-.176.436.339.515.968.175 1.403l-7 9c-.176.227-.44.367-.727.384-.021.001-.042.002-.062.002z" fill="#ecf0f1"></path></svg>              All Bills
            </h1>
            <p id="firsttagp">{billList?.data?.count} records</p>
            <div id="searchbox">
              <input
                id="commonmcsearchbar"
                type="text"
                placeholder="Search In All Bills"
                value={searchTerm}
                onChange={handleSearch}
              />
              <IoSearchOutline onClick={searchItems} data-tooltip-content="Search" data-tooltip-id="my-tooltip" />
            </div>
          </div>

          <div id="buttonsdata">
            <div className="maincontainmiainx1" data-tooltip-place="bottom" data-tooltip-content="Sort By" data-tooltip-id="my-tooltip">
              <div className="filtersorticos5w" id="sortByButton" onClick={handleSortByDropdownToggle}>
                <img src={sortbyIco} alt="" data-tooltip-content="Sort By" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />
              </div>

              {isSortByDropdownOpen && (

                <div className="dropdowncontentofx35" ref={sortDropdownRef}>

                  <div className={`dmncstomx1 ${selectedSortBy === 'All' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('All')}>All</div>

                  <div className={`dmncstomx1 ${selectedSortBy === 'transaction_date' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('transaction_date')}>Date</div>

                  <div className={`dmncstomx1 ${selectedSortBy === 'vendor_name' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('vendor_name')}>Vendor Name</div>

                  <div className={`dmncstomx1 ${selectedSortBy === 'bill_no' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('bill_no')}>Bill</div>

                  <div className={`dmncstomx1 ${selectedSortBy === 'total' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('total')}>Amount</div>

                  <div className={`dmncstomx1 ${selectedSortBy === 'balance_due' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('balance_due')}>Balance Due</div>

                  <div className={`dmncstomx1 ${selectedSortBy === 'expiry_date' ? 'activedmc' : ''}`} onClick={() => handleSortBySelection('expiry_date')}>Due Date</div>

                </div>
              )}
            </div>
            <div className="maincontainmiainx1">
              <div className="filtersorticos5w" id="filterButton" onClick={handleFilterDropdownToggle} data-tooltip-content="Filter" data-tooltip-id="my-tooltip" data-tooltip-place="bottom">
                <img src={FilterIco} alt="" data-tooltip-content="Filter" data-tooltip-id="my-tooltip" data-tooltip-place="bottom" />

              </div>
              {isFilterDropdownOpen && (
                <div className="dropdowncontentofx35" ref={filterDropdownRef}>
                  <div
                    className={`dmncstomx1 ${status === "Normal" ? "activedmc" : ""
                      }`}
                    onClick={() => handleFilterSelection("Normal")}
                  >
                    All Bills
                  </div>

                  <div
                    className={`dmncstomx1 ${status === "0" ? "activedmc" : ""
                      }`}
                    onClick={() => handleFilterSelection("0")}
                  >
                    Open
                  </div>
                  <div
                    className={`dmncstomx1 ${status === "1" ? "activedmc" : ""
                      }`}
                    onClick={() => handleFilterSelection("1")}
                  >
                    Close
                  </div>

                  <div
                    className={`dmncstomx1 ${status === "2" ? "activedmc" : ""
                      }`}
                    onClick={() => handleFilterSelection("2")}
                  >
                    Overdue
                  </div>

                  <div
                    className={`dmncstomx1 ${status === "3" ? "activedmc" : ""
                      }`}
                    onClick={() => handleFilterSelection("3")}
                  >
                    Pending
                  </div>
                </div>
              )}

            </div>
            <Link className="linkx1" to={"/dashboard/create-bills"} data-tooltip-place="bottom" data-tooltip-content="New Bill" data-tooltip-id="my-tooltip">
              New Bill <GoPlus />
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
                    Bill</div>

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
                    Due Date</div>
                  <div className="table-cellx12 quotiosalinvlisxs6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                      <path d="M13 21.9506C12.6711 21.9833 12.3375 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M7.5 17C8.90247 15.5311 11.0212 14.9041 13 15.1941M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="18.5" cy="18.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Amount</div>
                  <div className="table-cellx12 quotiosalinvlisxs6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                      <path d="M13 21.9506C12.6711 21.9833 12.3375 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M7.5 17C8.90247 15.5311 11.0212 14.9041 13 15.1941M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="18.5" cy="18.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Balance Due</div>
                  <div className="table-cellx12 quotiosalinvlisxs6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5d369f"} fill={"none"}>
                      <path d="M13 21.9506C12.6711 21.9833 12.3375 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M7.5 17C8.90247 15.5311 11.0212 14.9041 13 15.1941M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="18.5" cy="18.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Status</div>
                </div>

                {billList?.loading || dataChanging === true ? (
                  <TableViewSkeleton />
                ) : <>
                  {billList.data?.bills?.map((quotation, index) => (
                    <ListComponent3 value="bills" key={index} handleRowClicked={handleRowClicked} quotation={quotation} selectedRows={selectedRows} handleCheckboxChange={handleCheckboxChange} />
                  ))}

                </>}
              </div>
            </div>
          </div>
        </div>
                  <PaginationComponent
                    itemList={billList?.data?.count}
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

export default Quotations;
