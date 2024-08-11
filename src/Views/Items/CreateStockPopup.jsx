import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Toaster, toast } from 'react-hot-toast';
import TopLoadbar from '../../Components/Toploadbar/TopLoadbar';
import { useDispatch, useSelector } from 'react-redux';
import { stockItemAdjustment } from '../../Redux/Actions/itemsActions';
import { itemLists, accountLists } from '../../Redux/Actions/listApisActions';
import { GoPlus } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import CustomDropdown04 from '../../Components/CustomDropdown/CustomDropdown04';
import { RxCross2 } from 'react-icons/rx';
import CustomDropdown05 from '../../Components/CustomDropdown/CustomDropdown05';
import CustomDropdown03 from '../../Components/CustomDropdown/CustomDropdown03';
import { CiExport } from 'react-icons/ci';
import { fetchMasterData } from '../../Redux/Actions/globalActions';
import { BsArrowRight, BsEye } from 'react-icons/bs';
import CustomDropdown07 from '../../Components/CustomDropdown/CustomDropdown07';

import { v4 } from 'uuid';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { imageDB } from '../../Configs/Firebase/firebaseConfig';
import MainScreenFreezeLoader from '../../Components/Loaders/MainScreenFreezeLoader';
import CustomDropdown09 from '../../Components/CustomDropdown/CustomDropdown09';
import CreateItemPopup from './CreateItemPopup';
import CustomDropdown15 from '../../Components/CustomDropdown/CustomDropdown15';
import { getAccountTypes } from '../../Redux/Actions/accountsActions';
import AddNewResonPopup from './AddNewResonPopup';
import NumericInput from '../Helper/NumericInput'
import ImageUpload from '../Helper/ComponentHelper/ImageUpload';
import { binViewAction, rackViewAction, warehouseViewAction, zoneViewAction } from '../../Redux/Actions/warehouseActions';
import { otherIcons } from '../Helper/SVGIcons/ItemsIcons/Icons';


const CreateStockPopup = ({ closePopup, showPopup, itemDetailData, itemDetails }) => {
    console.log("itemDetailData", itemDetailData)
    console.log("itemDetailsitemDetailsitemDetails", itemDetails)
    const dispatch = useDispatch();
    const itemList = useSelector(state => state?.itemList?.data?.item);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const masterData = useSelector(state => state?.masterData?.masterData);
    const expenseAccounts = useSelector(state => state?.accountList);
    // const accType = useSelector((state) => state?.getAccType?.data?.account_type);
    const itemListState = useSelector(state => state?.accountList);

    const accountList = itemListState?.data?.accounts || [];
    // const accList = expenseAccounts?.data?.accounts.filter(account => account.account_type === "Stock");
    const accList = expenseAccounts?.data?.accounts;
    const [Loader, setLoader] = useState(false); // State variable for loading status

    const [freezLoadingImg, setFreezLoadingImg] = useState(false);
    const [imgLoader, setImgeLoader] = useState("");

    const [showPopup1, setShowPopup1] = useState(false);

    const Navigate = useNavigate()
    const stockAdjustment = useSelector(state => state?.stockAdjustment);


    const warehouseView = useSelector(state => state?.warehouseView);
    const warehouseViews = warehouseView?.data;

    const zoneView = useSelector(state => state?.zoneView);
    const zoneViews = zoneView?.data?.data;

    const rackView = useSelector(state => state?.rackView);
    const rackViews = rackView?.data?.data;

    const binView = useSelector(state => state?.binView);
    const binViews = binView?.data?.data;

    // console.log("zone", zoneViews)
    // console.log("rack", rackViews)

    const [formData, setFormData] = useState({
        item_id: itemDetails?.id,
        unit_id: '',
        account_id: '',
        reason_type: '',
        description: '',
        attachment: '',
        reference_no: null,
        warehouse_id: itemDetailData?.warehouse ? itemDetailData?.warehouse?.id : null,
        zone_id: itemDetailData?.zone ? itemDetailData?.zone?.id : null,
        rack_id: itemDetailData?.rack ? itemDetailData?.rack?.id : null,
        bin_id: itemDetailData?.bin ? itemDetailData?.bin?.id : null,
        inout: '',
        quantity: '',
        fy: +localStorage.getItem('FinancialYear'),
        transaction_date: new Date(),
    });

    console.log("formdata", formData)
    const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);

    // Add this function to check if all required fields are filled
    const checkRequiredFields = () => {
        const { item_id, unit_id, account_id, reason_type } = formData;
        return item_id !== '' && unit_id !== '' && account_id !== '' && reason_type !== '';
    };

    // Update the form data and check if all required fields are filled
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "warehouse_id") {
            dispatch(zoneViewAction({ warehouse_id: value }));
        } else if (name === "zone_id") {
            dispatch(rackViewAction({ zone_id: value }));
        } else if (name === "rack_id") {
            dispatch(binViewAction({ rack_id: value }));
        }

        setFormData({
            ...formData,
            [name]: value
        });
        setRequiredFieldsFilled(checkRequiredFields());
    };

    // Add this useEffect hook to check the required fields when formData changes
    useEffect(() => {
        setRequiredFieldsFilled(checkRequiredFields());
    }, [formData]);

    // Disable the submit button based on the requiredFieldsFilled state
    const submitButtonClass = requiredFieldsFilled ? '' : 'disabled';



    useEffect(() => {
        dispatch(itemLists());
        dispatch(accountLists({ fy: localStorage.getItem('FinancialYear'), }));
        dispatch(fetchMasterData());
        dispatch(getAccountTypes());
        dispatch(warehouseViewAction());
    }, [dispatch]);

    const refreshCategoryListData = () => {
        dispatch(itemLists());
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTransactionType = (value) => {
        if (value?.name === "Out") {
            setFormData(prevState => ({
                ...prevState,
                inout: 2,
            }));
        }

        if (value?.name === "In") {
            setFormData(prevState => ({
                ...prevState,
                inout: 1,
            }));
        }

    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!requiredFieldsFilled) {
            // Display toast error if all required fields are not filled
            toast.error('Please fill all required fields.');
            return;
        }

        // Set loader state to true to display the loader
        setLoader(true);

        dispatch(stockItemAdjustment(formData, Navigate))
            .then(() => {
                setLoader(false);

            })
            .catch((error) => {
                setLoader(false);
            });
    };


    return (
        <>
            {freezLoadingImg && <MainScreenFreezeLoader />}
            {/* {itemCreatedData?.loading && <MainScreenFreezeLoader />} */}

            <div className={`formsectionsgrheigh`} style={{ height: "fit-content" }}>
                <div id="Anotherbox" className='formsectionx' style={{
                    height: "120px",
                    background: "white"
                }}>
                    <div id="leftareax12">
                        <h1 id="firstheading" className='headingofcreateforems'>
                            {/* <img src={"/Icons/supplier-alt.svg"} alt="" /> */}
                            {otherIcons.new_item_svg}
                            {/* <img src={"https://cdn-icons-png.freepik.com/512/5006/5006793.png?uid=R87463380&ga=GA1.1.683301158.1710405244"} alt="" /> */}
                            New Item


                        </h1>
                    </div>

                    <div id="buttonsdata">
                        <div className="linkx3" onClick={() => closePopup(false)}>
                            <RxCross2 />
                        </div>
                    </div>
                </div>

                {/* <div className="bordersinglestroke"></div> */}
                < div id='middlesection' >

                    <div id="formofcreateitems">
                        <form onSubmit={handleSubmit}>
                            <div className="itemsformwrap itemformtyop02">
                                <div id="forminside">
                                    <div className="secondx2 thirdx2extra">
                                        <div className="form-group">
                                            <label>Date<b className='color_red'>*</b></label>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M11 13H16M8 13H8.00898M13 17H8M16 17H15.991" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>


                                                {/* <CiEdit /> */}
                                                <DatePicker
                                                    selected={formData.transaction_date}
                                                    onChange={(date) => handleChange({ target: { name: 'transaction_date', value: date } })}
                                                    className={formData.transaction_date ? 'filledcolorIn' : null}
                                                    placeholderText='Enter Date'
                                                    dateFormat="dd-MM-yyy"
                                                />

                                                {/* <input   className={formData.transaction_date ? 'filledcolorIn' : null}  required type="date" name="transaction_date" placeholder='Enter Date' value={formData.transaction_date} onChange={handleChange} /> */}
                                            </span>

                                        </div>

                                        <div className="form-group">
                                            <label>Transaction Type<b className='color_red'>*</b></label>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M4 14H8.42109C9.35119 14 9.81624 14 9.94012 14.2801C10.064 14.5603 9.74755 14.8963 9.11466 15.5684L5.47691 19.4316C4.84402 20.1037 4.52757 20.4397 4.65145 20.7199C4.77533 21 5.24038 21 6.17048 21H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4 9L6.10557 4.30527C6.49585 3.43509 6.69098 3 7 3C7.30902 3 7.50415 3.43509 7.89443 4.30527L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M17.5 20V4M17.5 20C16.7998 20 15.4915 18.0057 15 17.5M17.5 20C18.2002 20 19.5085 18.0057 20 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {/* <MdOutlineCategory /> */}
                                                {/* <img className="newclassforallsvg" src="/Icons/category.svg" alt="" /> */}

                                                <CustomDropdown07
                                                    label="Transaction Type"
                                                    value={formData.inout} // Pass the transaction type value
                                                    onChange={handleTransactionType} // Handle the transaction type change
                                                />
                                            </span>

                                            {formData?.inout === null && <p className="error-message">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={14} height={14} color={"red"} fill={"none"}>
                                                    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M11.9998 16H12.0088" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 13L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>

                                                Please select a transaction type</p>}
                                        </div>




                                        {/* <div className="form-group">
                                            <label>Items<b className='color_red'>*</b></label>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M4 14H8.42109C9.35119 14 9.81624 14 9.94012 14.2801C10.064 14.5603 9.74755 14.8963 9.11466 15.5684L5.47691 19.4316C4.84402 20.1037 4.52757 20.4397 4.65145 20.7199C4.77533 21 5.24038 21 6.17048 21H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4 9L6.10557 4.30527C6.49585 3.43509 6.69098 3 7 3C7.30902 3 7.50415 3.43509 7.89443 4.30527L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M17.5 20V4M17.5 20C16.7998 20 15.4915 18.0057 15 17.5M17.5 20C18.2002 20 19.5085 18.0057 20 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <CustomDropdown03
                                                    options={itemList || []}
                                                    value={formData.item_id}
                                                    onChange={handleChange}
                                                    name="item_id"
                                                    defaultOption="Select Item"
                                                    setShowPopup={setShowPopup1}
                                                    type="categories"
                                                />
                                            </span>
                                        </div> */}
                                        {/* 
                                        <div className="form-group">
                                            <label>Select Warehouse<b className='color_red'>*</b></label>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M4 14H8.42109C9.35119 14 9.81624 14 9.94012 14.2801C10.064 14.5603 9.74755 14.8963 9.11466 15.5684L5.47691 19.4316C4.84402 20.1037 4.52757 20.4397 4.65145 20.7199C4.77533 21 5.24038 21 6.17048 21H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4 9L6.10557 4.30527C6.49585 3.43509 6.69098 3 7 3C7.30902 3 7.50415 3.43509 7.89443 4.30527L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M17.5 20V4M17.5 20C16.7998 20 15.4915 18.0057 15 17.5M17.5 20C18.2002 20 19.5085 18.0057 20 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <CustomDropdown03
                                                    options={warehouseViews || []}
                                                    value={formData.warehouse_id}
                                                    onChange={handleChange}
                                                    name="warehouse_id"
                                                    defaultOption="Select Warehouse"
                                                    // setShowPopup={setShowPopup1}
                                                    type="categories"
                                                />
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label>Select Zone<b className='color_red'>*</b></label>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M4 14H8.42109C9.35119 14 9.81624 14 9.94012 14.2801C10.064 14.5603 9.74755 14.8963 9.11466 15.5684L5.47691 19.4316C4.84402 20.1037 4.52757 20.4397 4.65145 20.7199C4.77533 21 5.24038 21 6.17048 21H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4 9L6.10557 4.30527C6.49585 3.43509 6.69098 3 7 3C7.30902 3 7.50415 3.43509 7.89443 4.30527L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M17.5 20V4M17.5 20C16.7998 20 15.4915 18.0057 15 17.5M17.5 20C18.2002 20 19.5085 18.0057 20 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <CustomDropdown03
                                                    options={zoneViews || []}
                                                    value={formData.zone_id}
                                                    onChange={handleChange}
                                                    name="zone_id"
                                                    defaultOption="Select Zone"
                                                    // setShowPopup={setShowPopup1}
                                                    type="categories"
                                                />
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label>Select Rack<b className='color_red'>*</b></label>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M4 14H8.42109C9.35119 14 9.81624 14 9.94012 14.2801C10.064 14.5603 9.74755 14.8963 9.11466 15.5684L5.47691 19.4316C4.84402 20.1037 4.52757 20.4397 4.65145 20.7199C4.77533 21 5.24038 21 6.17048 21H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4 9L6.10557 4.30527C6.49585 3.43509 6.69098 3 7 3C7.30902 3 7.50415 3.43509 7.89443 4.30527L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M17.5 20V4M17.5 20C16.7998 20 15.4915 18.0057 15 17.5M17.5 20C18.2002 20 19.5085 18.0057 20 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <CustomDropdown03
                                                    options={rackViews || []}
                                                    value={formData.rack_id}
                                                    onChange={handleChange}
                                                    name="rack_id"
                                                    defaultOption="Select Rack"
                                                    type="categories"
                                                />
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label>Select Bin<b className='color_red'>*</b></label>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M4 14H8.42109C9.35119 14 9.81624 14 9.94012 14.2801C10.064 14.5603 9.74755 14.8963 9.11466 15.5684L5.47691 19.4316C4.84402 20.1037 4.52757 20.4397 4.65145 20.7199C4.77533 21 5.24038 21 6.17048 21H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4 9L6.10557 4.30527C6.49585 3.43509 6.69098 3 7 3C7.30902 3 7.50415 3.43509 7.89443 4.30527L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M17.5 20V4M17.5 20C16.7998 20 15.4915 18.0057 15 17.5M17.5 20C18.2002 20 19.5085 18.0057 20 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <CustomDropdown03
                                                    options={binViews || []}
                                                    value={formData.bin_id}
                                                    onChange={handleChange}
                                                    name="bin_id"
                                                    defaultOption="Select Bin"
                                                    setShowPopup={setShowPopup1}
                                                    type="categories"
                                                />
                                            </span>
                                        </div> */}

                                        {showPopup1 === true ?
                                            <div className="mainxpopups2">
                                                <div className="popup-content02">
                                                    <CreateItemPopup closePopup={setShowPopup1} refreshCategoryListData1={refreshCategoryListData}
                                                    />
                                                </div>
                                            </div> : ""
                                        }

                                        <div className="form-group">
                                            <label> Quantity<b className='color_red'>*</b></label>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M8.64298 3.14559L6.93816 3.93362C4.31272 5.14719 3 5.75397 3 6.75C3 7.74603 4.31272 8.35281 6.93817 9.56638L8.64298 10.3544C10.2952 11.1181 11.1214 11.5 12 11.5C12.8786 11.5 13.7048 11.1181 15.357 10.3544L17.0618 9.56638C19.6873 8.35281 21 7.74603 21 6.75C21 5.75397 19.6873 5.14719 17.0618 3.93362L15.357 3.14559C13.7048 2.38186 12.8786 2 12 2C11.1214 2 10.2952 2.38186 8.64298 3.14559Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20.788 11.0972C20.9293 11.2959 21 11.5031 21 11.7309C21 12.7127 19.6873 13.3109 17.0618 14.5072L15.357 15.284C13.7048 16.0368 12.8786 16.4133 12 16.4133C11.1214 16.4133 10.2952 16.0368 8.64298 15.284L6.93817 14.5072C4.31272 13.3109 3 12.7127 3 11.7309C3 11.5031 3.07067 11.2959 3.212 11.0972" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20.3767 16.2661C20.7922 16.5971 21 16.927 21 17.3176C21 18.2995 19.6873 18.8976 17.0618 20.0939L15.357 20.8707C13.7048 21.6236 12.8786 22 12 22C11.1214 22 10.2952 21.6236 8.64298 20.8707L6.93817 20.0939C4.31272 18.8976 3 18.2995 3 17.3176C3 16.927 3.20778 16.5971 3.62334 16.2661" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>

                                                <NumericInput
                                                    className={formData.quantity ? 'filledcolorIn' : null} name="quantity"
                                                    placeholder='Enter quantity'
                                                    value={formData.quantity} onChange={handleChange}
                                                    required
                                                />
                                            </span>
                                        </div>

                                        <div className="form-group">
                                            <label>Unit<b className='color_red'>*</b></label>
                                            <span>
                                                {/* <CiEdit /> */}
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M11.1075 5.57624C11.3692 6.02707 11.5 6.25248 11.5 6.5C11.5 6.74752 11.3692 6.97293 11.1075 7.42376L9.85804 9.57624C9.59636 10.0271 9.46551 10.2525 9.25 10.3762C9.03449 10.5 8.7728 10.5 8.24943 10.5H5.75057C5.2272 10.5 4.96551 10.5 4.75 10.3762C4.53449 10.2525 4.40364 10.0271 4.14196 9.57624L2.89253 7.42376C2.63084 6.97293 2.5 6.74752 2.5 6.5C2.5 6.25248 2.63084 6.02707 2.89253 5.57624L4.14196 3.42376C4.40364 2.97293 4.53449 2.74752 4.75 2.62376C4.96551 2.5 5.2272 2.5 5.75057 2.5L8.24943 2.5C8.7728 2.5 9.03449 2.5 9.25 2.62376C9.46551 2.74752 9.59636 2.97293 9.85804 3.42376L11.1075 5.57624Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M21.1075 11.5762C21.3692 12.0271 21.5 12.2525 21.5 12.5C21.5 12.7475 21.3692 12.9729 21.1075 13.4238L19.858 15.5762C19.5964 16.0271 19.4655 16.2525 19.25 16.3762C19.0345 16.5 18.7728 16.5 18.2494 16.5H15.7506C15.2272 16.5 14.9655 16.5 14.75 16.3762C14.5345 16.2525 14.4036 16.0271 14.142 15.5762L12.8925 13.4238C12.6308 12.9729 12.5 12.7475 12.5 12.5C12.5 12.2525 12.6308 12.0271 12.8925 11.5762L14.142 9.42376C14.4036 8.97293 14.5345 8.74752 14.75 8.62376C14.9655 8.5 15.2272 8.5 15.7506 8.5L18.2494 8.5C18.7728 8.5 19.0345 8.5 19.25 8.62376C19.4655 8.74752 19.5964 8.97293 19.858 9.42376L21.1075 11.5762Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M11.1075 16.5762C11.3692 17.0271 11.5 17.2525 11.5 17.5C11.5 17.7475 11.3692 17.9729 11.1075 18.4238L9.85804 20.5762C9.59636 21.0271 9.46551 21.2525 9.25 21.3762C9.03449 21.5 8.7728 21.5 8.24943 21.5H5.75057C5.2272 21.5 4.96551 21.5 4.75 21.3762C4.53449 21.2525 4.40364 21.0271 4.14196 20.5762L2.89253 18.4238C2.63084 17.9729 2.5 17.7475 2.5 17.5C2.5 17.2525 2.63084 17.0271 2.89253 16.5762L4.14196 14.4238C4.40364 13.9729 4.53449 13.7475 4.75 13.6238C4.96551 13.5 5.2272 13.5 5.75057 13.5L8.24943 13.5C8.7728 13.5 9.03449 13.5 9.25 13.6238C9.46551 13.7475 9.59636 13.9729 9.85804 14.4238L11.1075 16.5762Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>

                                                <CustomDropdown04
                                                    label="Unit Name"
                                                    options={masterData?.filter(type => type.type === "2")}
                                                    value={formData.unit_id}
                                                    onChange={handleChange}
                                                    name="unit_id"
                                                    defaultOption="Select Units"
                                                    type="masters"
                                                />

                                            </span>
                                        </div>

                                        <div className="form-group">
                                            {/* <label>Sales Account<b className='color_red'>*</b></label> */}

                                            <label >Account<b className='color_red'>*</b></label>
                                            <span className=''>
                                                {/* <IoPricetagOutline /> */}
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M11 7L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M7 7L8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M7 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M7 17L8 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M11 12L17 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M11 17L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>


                                                <CustomDropdown15
                                                    label="Purchase Account"
                                                    options={accountList}
                                                    value={formData.account_id}
                                                    onChange={handleChange}
                                                    name="account_id"
                                                    defaultOption="Select Account"
                                                />

                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label >Reason<b className='color_red'>*</b></label>
                                            <span>
                                                {/* <CiEdit /> */}
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                    <path d="M11.1075 5.57624C11.3692 6.02707 11.5 6.25248 11.5 6.5C11.5 6.74752 11.3692 6.97293 11.1075 7.42376L9.85804 9.57624C9.59636 10.0271 9.46551 10.2525 9.25 10.3762C9.03449 10.5 8.7728 10.5 8.24943 10.5H5.75057C5.2272 10.5 4.96551 10.5 4.75 10.3762C4.53449 10.2525 4.40364 10.0271 4.14196 9.57624L2.89253 7.42376C2.63084 6.97293 2.5 6.74752 2.5 6.5C2.5 6.25248 2.63084 6.02707 2.89253 5.57624L4.14196 3.42376C4.40364 2.97293 4.53449 2.74752 4.75 2.62376C4.96551 2.5 5.2272 2.5 5.75057 2.5L8.24943 2.5C8.7728 2.5 9.03449 2.5 9.25 2.62376C9.46551 2.74752 9.59636 2.97293 9.85804 3.42376L11.1075 5.57624Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M21.1075 11.5762C21.3692 12.0271 21.5 12.2525 21.5 12.5C21.5 12.7475 21.3692 12.9729 21.1075 13.4238L19.858 15.5762C19.5964 16.0271 19.4655 16.2525 19.25 16.3762C19.0345 16.5 18.7728 16.5 18.2494 16.5H15.7506C15.2272 16.5 14.9655 16.5 14.75 16.3762C14.5345 16.2525 14.4036 16.0271 14.142 15.5762L12.8925 13.4238C12.6308 12.9729 12.5 12.7475 12.5 12.5C12.5 12.2525 12.6308 12.0271 12.8925 11.5762L14.142 9.42376C14.4036 8.97293 14.5345 8.74752 14.75 8.62376C14.9655 8.5 15.2272 8.5 15.7506 8.5L18.2494 8.5C18.7728 8.5 19.0345 8.5 19.25 8.62376C19.4655 8.74752 19.5964 8.97293 19.858 9.42376L21.1075 11.5762Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M11.1075 16.5762C11.3692 17.0271 11.5 17.2525 11.5 17.5C11.5 17.7475 11.3692 17.9729 11.1075 18.4238L9.85804 20.5762C9.59636 21.0271 9.46551 21.2525 9.25 21.3762C9.03449 21.5 8.7728 21.5 8.24943 21.5H5.75057C5.2272 21.5 4.96551 21.5 4.75 21.3762C4.53449 21.2525 4.40364 21.0271 4.14196 20.5762L2.89253 18.4238C2.63084 17.9729 2.5 17.7475 2.5 17.5C2.5 17.2525 2.63084 17.0271 2.89253 16.5762L4.14196 14.4238C4.40364 13.9729 4.53449 13.7475 4.75 13.6238C4.96551 13.5 5.2272 13.5 5.75057 13.5L8.24943 13.5C8.7728 13.5 9.03449 13.5 9.25 13.6238C9.46551 13.7475 9.59636 13.9729 9.85804 14.4238L11.1075 16.5762Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <CustomDropdown04
                                                    label="Reason Name"
                                                    options={masterData?.filter(type => type.type === "7")}
                                                    value={formData?.reason_type}
                                                    onChange={handleChange}
                                                    name="reason_type"
                                                    defaultOption="Select Reason"
                                                    type="masters"
                                                />
                                            </span>
                                        </div>




                                        <div id="imgurlanddesc">

                                            <ImageUpload
                                                formData={formData}
                                                setFormData={setFormData}
                                                setFreezLoadingImg={setFreezLoadingImg}
                                                imgLoader={imgLoader}
                                                setImgeLoader={setImgeLoader}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label> Description</label>
                                            <textarea
                                                className={"textareax1series" + (formData.description ? ' filledcolorIn' : '')}
                                                name="description"
                                                placeholder='Enter description'
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows="4"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="actionbar" id='actionbarPop'>
                                <button
                                    className={`btn  ${submitButtonClass ? 'disabledbtn' : ''}`}
                                    // disabled={stockAdjustment?.loading || !requiredFieldsFilled} 
                                    id='herobtnskls'
                                    type="submit"
                                >
                                    {stockAdjustment?.loading ? <p>Submiting<BsArrowRight /></p> : <p>Submit<BsArrowRight /></p>}
                                </button>
                                <button onClick={() => closePopup(false)}>Cancel</button>
                            </div>
                        </form>


                    </div>
                </div >

                {
                    showPopup && (
                        <div className="mainxpopups2" ref={popupRef}>
                            <div className="popup-content02">
                                <span className="close-button02" onClick={() => setShowPopup(false)}><RxCross2 /></span>
                                {<img src={formData?.image_url} name="image_url" alt="" height={500} width={500} />}
                            </div>
                        </div>
                    )
                }
                <Toaster />
            </div >

        </>
    );
};

export default CreateStockPopup;
