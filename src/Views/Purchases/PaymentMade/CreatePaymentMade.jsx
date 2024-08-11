import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { customersList } from '../../../Redux/Actions/customerActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import { accountLists, itemLists, vendorsLists } from '../../../Redux/Actions/listApisActions';
import Loader02 from '../../../Components/Loaders/Loader02'
import DatePicker from "react-datepicker";

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
// import { GoPlus } from 'react-icons/go';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
// import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import { fetchCurrencies, fetchMasterData, updateAddresses } from '../../../Redux/Actions/globalActions';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { imageDB } from '../../../Configs/Firebase/firebaseConfig';
import { OverflowHideBOdy } from '../../../Utils/OverflowHideBOdy';
import { BsEye } from 'react-icons/bs';
import { Toaster, toast } from "react-hot-toast";
// import CustomDropdown14 from '../../../Components/CustomDropdown/CustomDropdown14';
// import { SlReload } from 'react-icons/sl';
import { paymentRecDetail, updatePaymentRec } from '../../../Redux/Actions/PaymentRecAction';
// import ViewCustomerDetails from '../Quotations/ViewCustomerDetails';
// import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import { IoCheckbox } from 'react-icons/io5';
import { formatDate } from '../../Helper/DateFormat';
import CustomDropdown15 from '../../../Components/CustomDropdown/CustomDropdown15';
import { getAccountTypes } from '../../../Redux/Actions/accountsActions';
import { pendingInvoices } from '../../../Redux/Actions/invoiceActions';
import CustomDropdown09 from '../../../Components/CustomDropdown/CustomDropdown09';
import { billDetails, pendingBillLists } from '../../../Redux/Actions/billActions';
import NumericInput from '../../Helper/NumericInput';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';


const CreatePaymentMade = () => {
    const dispatch = useDispatch();
    const loacation = useLocation();
    const cusList = useSelector((state) => state?.customerList);
    const itemList = useSelector((state) => state?.itemList);
    const addUpdate = useSelector((state) => state?.updateAddress);
    const paymentDetails = useSelector((state) => state?.paymentRecDetail);
    const itemListState = useSelector(state => state?.accountList);
    const accountList = itemListState?.data?.accounts || [];
    const paymentDetail = paymentDetails?.data?.data?.payment;
    const [cusData, setcusData] = useState(null);
    const [switchCusDatax1, setSwitchCusDatax1] = useState("Details");
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
    const pendingBill = useSelector((state) => state?.pendingBill);
    const billData = pendingBill?.data?.bills;
    const vendorList = useSelector((state) => state?.vendorList);
    const masterData = useSelector(state => state?.masterData?.masterData);
    const billDetail = useSelector(state => state?.billDetail);
    const billDetail1 = billDetail?.data?.bill;

    const [fetchDetails, setFetchDetails] = useState("");

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, convert, dublicate: isDublicate } = Object.fromEntries(params.entries());
    useEffect(() => {
        if (itemId && isEdit || itemId && isDublicate) {
            setFetchDetails(paymentDetail);
        } else if (itemId && (convert === "bill_to_payment")) {
            setFetchDetails(billDetail1);

        }
    }, [itemId, isEdit, convert, isDublicate]);


    const [formData, setFormData] = useState({
        id: 0,
        payment_id: "",
        vendor_id: null,
        credit: null, // amount received
        bank_charges: null,
        transaction_date: "", // payment date
        // posting_date: "2024-04-18",
        fy: localStorage.getItem('FinancialYear') || 2024,
        payment_mode: null,
        to_acc: null, // deposit to#
        tax_deducted: 1,
        tax_acc_id: 0,
        reference: "",
        customer_note: null,
        upload_image: null,
        // amt_excess: null,
        // this details will be filled when there is one invoice
        transaction_type: 1, // for sale    2-for purchase
        transaction_id: 0,

        // when there are multiple invoices
        entries: [
            {
                bill_id: null,
                bill_no: null,
                bill_amount: null,
                amount: null,
                balance_amount: null,
                date: null,
                // order_no: null,
            }
        ]
    });

    useEffect(() => {
        if ((itemId && isEdit && fetchDetails) || (itemId && isDublicate && fetchDetails) || itemId && (convert === "bill_to_payment")) {
            const itemsFromApi = fetchDetails?.entries?.map(item => ({
                bill_no: item?.bill_no,
                bill_id: item?.id,
                bill_amount: item?.bill_amount,
                balance_amount: item?.balance_amount,
                amount: item?.amount,
                date: formatDate(item?.bill?.transaction_date)
            }));

            setFormData({
                id: isEdit ? itemId : 0,
                payment_id: fetchDetails?.payment_id,
                vendor_id: (+fetchDetails?.vendor_id),
                credit: (+fetchDetails?.credit), // amount received
                bank_charges: fetchDetails?.bank_charges,
                transaction_date: fetchDetails?.transaction_date, // payment date
                fy: fetchDetails?.fy,
                payment_mode: (+fetchDetails?.payment_mode?.id),
                to_acc: (+fetchDetails?.to_acc?.id), // deposit to
                tax_deducted: (+fetchDetails?.tax_deducted),
                tax_acc_id: (+fetchDetails?.tax_acc_id),
                reference: fetchDetails?.reference,
                customer_note: fetchDetails?.customer_note,
                upload_image: fetchDetails?.upload_image,

                // this details will be filled when there is one invoice
                transaction_type: fetchDetails?.transaction_type, // for sale    2-for purchase
                transaction_id: fetchDetails?.transaction_id,

                // when there are multiple invoices

                entries: itemsFromApi || []
            });

            if (fetchDetails?.upload_image) {
                setImgeLoader("success");
            }

            if (fetchDetails?.address) {
                const parsedAddress = JSON?.parse(fetchDetails?.address);
                const dataWithParsedAddress = {
                    ...fetchDetails,
                    address: parsedAddress
                };

            }

        }
    }, [fetchDetails, itemId, isEdit, convert, isDublicate]);

    const [invoiceDatas, setInoiceData] = useState("");
    const [isChecked, setIsChecked] = useState({ checkbox1: true, checkbox2: true });
    // Function to handle checkbox clicks
    const handleCheckboxClick = checkboxName => {
        setIsChecked(prevState => ({
            ...prevState,
            [checkboxName]: !prevState[checkboxName],
        }));

        if (isChecked?.checkbox1) {
            setFormData({
                ...formData,
                credit: (+invoiceDatas?.total_amount),
            })
        } else {
            setFormData({
                ...formData,
                credit: "",
            })
        }
    }

    const [loading, setLoading] = useState(false);



    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge' || name === 'bank_charges') {
            newValue = parseFloat(value) || 0; // Convert to float or default to 0
        }

        // Convert empty string to zero
        if (newValue === '') {
            newValue = "";
        }


        if (name === "vendor_id") {
            const selectedCustomer = vendorList?.data?.user?.find(cus => cus.id == value);
            const sendData = {
                fy: localStorage.getItem('FinancialYear'),
                warehouse_id: localStorage.getItem('selectedWarehouseId'),
                vendor_id: selectedCustomer?.id,
            }
            dispatch(pendingBillLists(sendData, setInoiceData));
        }

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };



    useEffect(() => {
        if (invoiceDatas) {
            setFormData({
                ...formData,
                entries: invoiceDatas?.bills?.map(invoice => ({
                    bill_id: invoice?.id,
                    bill_no: invoice?.bill_no,
                    bill_amount: +invoice?.total,
                    order_no: invoice?.order_no,
                    balance_amount: +invoice?.total - +invoice?.amount_paid,
                    date: formatDate(invoice?.transaction_date)
                }))
            })
        }
    }, [invoiceDatas]);

    useEffect(() => {
        const sendData = {
            fy: localStorage.getItem('FinancialYear'),
            warehouse_id: localStorage.getItem('selectedWarehouseId'),
            vendor_id: (+fetchDetails?.vendor_id),
        }
        dispatch(pendingBillLists(sendData, setInoiceData));
    }, [fetchDetails?.vendor_id])

    const calculateTotalAmount = () => {
        return formData.entries?.reduce((total, entry) => {
            return total + (entry.amount ? parseFloat(entry.amount) : 0);
        }, 0);
    };


    useEffect(() => {
        setFormData({
            ...formData,
            amt_excess: (+formData?.credit) - calculateTotalAmount()
        })
    }, [calculateTotalAmount()])


    // console.log("calculateExcessAmount", calculateExcessAmount())
    const popupRef = useRef(null);
    const [showPopup, setShowPopup] = useState(false);

    const [buttonClicked, setButtonClicked] = useState(null);

    const handleButtonClicked = (status) => {
        setButtonClicked(status);
    };

    const Navigate = useNavigate()

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!buttonClicked) {
            toast.error('Please select an action (Save as draft or Save and send).');
            return;
        }
        try {
            dispatch(updatePaymentRec({ ...formData }, Navigate, "payment_made"));
            setLoading(false);
        } catch (error) {
            toast.error('Error updating quotation:', error);
            setLoading(false);
        }
    };


    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            customer_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
            email: cusData?.email,
            phone: cusData?.mobile_no,
            // address: cusData?.address.length,

        }));
    }, [cusData]);

    useEffect(() => {
        const queryParams = {
            id: itemId,
        };
        dispatch(itemLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(fetchCurrencies());
        dispatch(paymentRecDetail(queryParams));
        dispatch(getAccountTypes());
        dispatch(vendorsLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(accountLists());
        dispatch(fetchMasterData());
        dispatch(billDetails(queryParams));
    }, [dispatch]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            transaction_date: formatDate(date),
        });
    };


    const handleItemRemove = (index) => {
        const newItems = formData?.entries?.filter((item, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };


    // dropdown
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

    const handleDropdownToggle = (index) => {
        setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
        setShowDropdown(true);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);

        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // image upload from firebase
    const showimagepopup = (val) => {
        OverflowHideBOdy(true); // Set overflow hidden
        setShowPopup(val); // Show the popup
    };
    const [imgLoader, setImgeLoader] = useState("");

    const [freezLoadingImg, setFreezLoadingImg] = useState(false);


    const handleImageChange = (e) => {
        setFreezLoadingImg(true);
        setImgeLoader(true)
        const imageRef = ref(imageDB, `ImageFiles/${v4()}`);
        uploadBytes(imageRef, e.target.files[0])
            .then(() => {
                setImgeLoader("success");
                setFreezLoadingImg(false);
                getDownloadURL(imageRef)?.then((url) => {
                    setFormData({
                        ...formData,
                        upload_image: url
                    })
                });
            })
            .catch((error) => {
                setFreezLoadingImg(false);
                setImgeLoader("fail");
            });
    };


    useEffect(() => {
        OverflowHideBOdy(showPopup);
        // Clean up the effect by removing the event listener on unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showPopup]);


    return (
        <>
            {paymentDetails?.loading || pendingBill?.loading ? <Loader02 /> : <>
                <TopLoadbar />
                {loading && <MainScreenFreezeLoader />}
                {freezLoadingImg && <MainScreenFreezeLoader />}
                {addUpdate?.loading && <MainScreenFreezeLoader />}

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <svg height="512" viewBox="0 0 58 54" width="512" xmlns="http://www.w3.org/2000/svg" id="fi_4071616"><g id="Page-1" fill="none" fill-rule="evenodd"><g id="016---Credit-Card"><path id="Path" d="m29.73 32h-25.73c-2.209139 0-4-1.790861-4-4v-24c0-2.209139 1.790861-4 4-4h38c2.209139 0 4 1.790861 4 4v20.3z" fill="#3b97d3"></path><path id="Path" d="m46 16h-46v8h43 3z" fill="#464f5d"></path><rect id="Rectangle" fill="#f3d55b" height="6" rx="2" width="8" x="5" y="5"></rect><path id="Path" d="m40 7h-20c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1h20c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1z" fill="#ecf0f1"></path><path id="Path" d="m30 11h-10c-.5522847 0-1-.4477153-1-1 0-.55228475.4477153-1 1-1h10c.5522847 0 1 .44771525 1 1 0 .5522847-.4477153 1-1 1z" fill="#ecf0f1"></path><path id="Path" d="m58 39c0 8.2842712-6.7157288 15-15 15s-15-6.7157288-15-15 6.7157288-15 15-15c1.0075985-.0022508 2.0127996.0982693 3 .3 6.9832894 1.4286242 11.9983524 7.5720763 12 14.7z" fill="#4fba6f"></path><path id="Path" d="m38 47c-.2651948-.0000566-.5195073-.1054506-.707-.293l-4-4c-.3789722-.3923789-.3735524-1.0160848.0121814-1.4018186s1.0094397-.3911536 1.4018186-.0121814l3.346 3.345 13.3-11.4c.2690133-.2485449.6523779-.3301409.9992902-.2126907.3469124.1174502.6018621.415153.66456.7760016.0626979.3608485-.0768884.7271025-.3638502.9546891l-14 12c-.1810749.1574945-.4130154.2441614-.653.244z" fill="#fff"></path></g></g></svg>
                                New Payment
                            </h1>
                        </div>
                        <div id="buttonsdata">
                            <Link to={"/dashboard/quotation"} className="linkx3">
                                <RxCross2 />
                            </Link>
                        </div>
                    </div>

                    <div id="formofcreateitems" >
                        <DisableEnterSubmitForm onSubmit={handleFormSubmit}>
                            <div className="relateivdiv">
                                {/* <div className=""> */}
                                <div className="itemsformwrap">
                                    <div className="f1wrapofcreq">
                                        <div className="form_commonblock">
                                            <label >Vendor Name<b className='color_red'>*</b></label>
                                            <div id='sepcifixspanflex'>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown10
                                                        label="Select Vendor"
                                                        options={vendorList?.data?.user?.filter((val => val?.active === "1"))}
                                                        value={formData?.vendor_id}
                                                        onChange={handleChange}
                                                        name="vendor_id"
                                                        defaultOption="Select Vendor Name"
                                                        setcusData={setcusData}
                                                        type="vendor"
                                                    />
                                                </span>

                                                {cusData &&
                                                    <div className="view_all_cus_deial_btn">
                                                        {
                                                            viewAllCusDetails === true ?
                                                                <button type="button" onClick={() => setViewAllCusDetails(false)}>Hide Vendor Information</button>
                                                                :
                                                                <button type="button" onClick={() => setViewAllCusDetails(true)}>View Vendor Information</button>
                                                        }
                                                    </div>
                                                }


                                            </div>
                                        </div>


                                        <div className={`${formData?.vendor_id ? "f1wrapofcreqx1" : "disabledfield f1wrapofcreqx1"}`}>

                                            <div className="form_commonblock">
                                                <label className='color_red clcsecx12s1'>Amount Paid <b >*</b></label>
                                                <span >
                                                    {otherIcons.vendor_svg}
                                                    <input
                                                        type='number'
                                                        value={(formData.credit)}
                                                        name='credit'
                                                        onChange={handleChange}
                                                        placeholder='Enter Paid Amount'
                                                        disabled={!isChecked?.checkbox1}
                                                    />
                                                </span>
                                                {invoiceDatas?.total_amount ?
                                                    <>
                                                        <label htmlFor="" className="xkls5663">Receive Full Amount (₹{(+invoiceDatas?.total_amount)})

                                                            <IoCheckbox
                                                                tabIndex="0"
                                                                className={`checkboxeffecgtparent ${isChecked.checkbox1 ? 'checkboxeffects' : ''}`}
                                                                onClick={() => handleCheckboxClick('checkbox1')}
                                                                onKeyDown={(event) => {
                                                                    if (event.key === ' ') {
                                                                        event.preventDefault(); // Prevent scrolling
                                                                        handleCheckboxClick('checkbox1')
                                                                    }
                                                                }}

                                                            />
                                                        </label>
                                                    </> : ""}
                                            </div>


                                            <div className="form_commonblock">
                                                <label className='color_red'>Bank Charges (If Any)<b >*</b></label>
                                                <span >
                                                    {otherIcons.tag_svg}
                                                    <NumericInput
                                                        value={formData.bank_charges}

                                                        placeholder='Enter Bank Charges'
                                                        onChange={handleChange}
                                                        name='bank_charges'
                                                    />

                                                </span>
                                            </div>

                                            <div className="form_commonblock">
                                                <label className='color_red'>Payment Date<b >*</b></label>
                                                <span >
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.transaction_date ? new Date(formData.transaction_date).toISOString().split('T')[0] : null}
                                                        onChange={handleDateChange}
                                                        name='transaction_date'

                                                        placeholderText="Select Payment Date"
                                                        dateFormat="dd-MM-yyy"
                                                        autoComplete='off'
                                                    />

                                                </span>
                                            </div>

                                            <div className="form_commonblock">
                                                <label className='color_red'>Payment Number<b >*</b></label>
                                                <span >
                                                    {otherIcons.tag_svg}
                                                    <input type="text" value={formData.payment_id}
                                                        placeholder='Enter Payment Number'
                                                        onChange={handleChange}
                                                        name='payment_id'
                                                    />
                                                </span>
                                            </div>


                                            <div className="form_commonblock">
                                                <label>Payment Mode</label>
                                                <span >
                                                    {otherIcons.currency_icon}

                                                    <CustomDropdown04
                                                        label="Payment Mode"
                                                        options={masterData?.filter(type => type?.type === "9")}
                                                        value={formData?.payment_mode}
                                                        onChange={handleChange}
                                                        name="payment_mode"
                                                        defaultOption="Select Payment Mode"
                                                        type="masters"
                                                    />
                                                </span>
                                            </div>

                                            <div className="form_commonblock">
                                                <label className='color_red'>Paid Through<b >*</b></label>
                                                <span >

                                                    <CustomDropdown15
                                                        label="Account"
                                                        options={accountList}
                                                        value={formData.to_acc}
                                                        onChange={handleChange}
                                                        name="to_acc"
                                                        defaultOption="Select An Account"
                                                    />
                                                </span>
                                            </div>


                                            <div className="form_commonblock ">
                                                <label className='color_red'>Reference<b >*</b></label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.reference} onChange={handleChange}
                                                        // disabled

                                                        name='reference'
                                                        placeholder='Enter Reference' />
                                                </span>
                                            </div>

                                            {/* <div className="form_commonblock ">
                                                <label >TAX deducted?</label>
                                                <div className="f1wrapofcreqx1">
                                                    <div className="cust_dex1s">
                                                        <div id="radio-toggle">

                                                            <label htmlFor="organization">No</label>
                                                            <input
                                                                type="radio"
                                                                id="no"
                                                                name="tax-deducted"
                                                                value="no"
                                                                checked={selectedOption === 'no'}
                                                                onChange={handleOptionChange}
                                                            />

                                                            <label htmlFor="customer">Yes, TDS</label>
                                                            <input
                                                                type="radio"
                                                                id="yes"
                                                                name="tax-deducted"
                                                                value="yes"
                                                                checked={selectedOption === 'yes'}
                                                                onChange={handleOptionChange}
                                                            />
                                                        </div>

                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* {selectedOption === "yes" &&
                                                <div className="form_commonblock">
                                                    <label className='color_red'>TDX tax Account<b >*</b></label>
                                                    <span >
                                                        {otherIcons.currency_icon}

                                                        <CustomDropdown04
                                                            label="Payment Mode"
                                                            options={taxAccount}
                                                            value={formData?.tax_acc_id}
                                                            onChange={handleChange}
                                                            name="tax_acc_id"
                                                            defaultOption="Select TDX tax Account"
                                                        />
                                                    </span>
                                                </div>

                                            } */}

                                        </div>
                                    </div>
                                    {/* </div> */}

                                    <div className={`${formData?.vendor_id ? "f1wrpofcreqsx2" : "disabledfield f1wrpofcreqsx2"}`}>
                                        <div className='itemsectionrows'>

                                            <div className="tableheadertopsxs1">
                                                <p className='tablsxs1a2'>Date</p>
                                                <p className='tablsxs1a2'>Bill</p>
                                                <p className='tablsxs1a4'>Bill Amount </p>
                                                <p className='tablsxs1a4'>Amount Due</p>
                                                <p className='tablsxs1a6'>Payment</p>
                                            </div>

                                            {formData?.entries?.length >= 1 ?
                                                <>
                                                    {formData?.entries?.map((item, index) => (
                                                        <>
                                                            <div key={index} className="tablerowtopsxs1">
                                                                <div className="tablsxs1a2 disabledfield02">
                                                                    <input type="text" value={item?.date}
                                                                    // disabled
                                                                    />
                                                                </div>

                                                                <div className="tablsxs1a2 disabledfield02">
                                                                    <div className="tablsxs1a2">
                                                                        <input type="text" value={item?.bill_no}
                                                                        // disabled

                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="tablsxs1a3 disabledfield02">
                                                                    <input type="text"
                                                                        value={item?.bill_amount}
                                                                    // disabled

                                                                    />

                                                                </div>

                                                                <div className="tablsxs1a4">
                                                                    <div className="tablsxs1a2 disabledfield02">
                                                                        <input type="text"
                                                                            value={item?.balance_amount}
                                                                            // disabled
                                                                            readOnly

                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="tablsxs1a4">
                                                                    <div className="tablsxs1a2">
                                                                        <input
                                                                            type='number'
                                                                            value={item.amount !== null ? item.amount : ""}
                                                                            placeholder="0.00"
                                                                            onChange={(e) => {
                                                                                const inputValue = e.target.value;
                                                                                const newValue = inputValue === "" ? null : parseFloat(inputValue);

                                                                                if (newValue <= (+formData?.credit) || newValue <= (+fetchDetails?.credit)) {
                                                                                    setFormData((prevFormData) => ({
                                                                                        ...prevFormData,
                                                                                        entries: prevFormData.entries?.map((entry, i) =>
                                                                                            i === index ? { ...entry, amount: newValue } : entry
                                                                                        )
                                                                                    }));
                                                                                } else if (formData.credit === "") {
                                                                                    toast('Please set the amount', {
                                                                                        icon: '👏',
                                                                                        style: {
                                                                                            borderRadius: '10px',
                                                                                            background: '#333',
                                                                                            color: '#fff',
                                                                                            fontSize: '14px',
                                                                                        },
                                                                                    });
                                                                                    setFormData((prevFormData) => ({
                                                                                        ...prevFormData,
                                                                                        entries: prevFormData.entries?.map((entry, i) =>
                                                                                            i === index ? { ...entry, amount: 0 } : entry
                                                                                        )
                                                                                    }));
                                                                                }

                                                                                else {
                                                                                    {
                                                                                        toast('The amount entered here is more than the amount paid by the customer', {
                                                                                            icon: '👏',
                                                                                            style: {
                                                                                                borderRadius: '10px',
                                                                                                background: '#333',
                                                                                                color: '#fff',
                                                                                                fontSize: '14px',
                                                                                            },
                                                                                        });

                                                                                    }
                                                                                }
                                                                            }}
                                                                            step={0.01} // Allows decimal steps
                                                                            precision={2}
                                                                        />

                                                                    </div>
                                                                </div>


                                                                {/* {formData.entries.length > 1 ? (
                                                            <button className='removeicoofitemrow' type="button" onClick={() => handleItemRemove(index)}> <RxCross2 /> </button>
                                                        ) : (
                                                            <button className='removeicoofitemrow' type="button" onClick={() => handleItemReset(index)}> <SlReload /> </button>
                                                        )} */}

                                                                {/* <button className='removeicoofitemrow' type="button" onClick={() => handleItemRemove(index)}><RxCross2 /></button> */}
                                                            </div >
                                                        </>


                                                    ))}
                                                </>
                                                :
                                                <p style={{ textAlign: "center", padding: "20px 0" }}>There are no bills for this vendor. </p>
                                            }
                                        </div>


                                        {/* 
                                        <button id='additembtn45srow' type="button" onClick={handleItemAdd}>Add New Row<GoPlus /></button> */}


                                        <div className="height5"></div>
                                        <div className='secondtotalsections485s'>
                                            <div className='textareaofcreatqsiform'>
                                                <label>Vendor Note</label>
                                                <textarea
                                                    placeholder='Will be displayed on the estimate'
                                                    value={formData.customer_note}
                                                    onChange={handleChange}
                                                    name='customer_note'
                                                />
                                            </div>

                                            <div className="calctotalsection">
                                                <div className="calcuparentc">
                                                    <div className='clcsecx12s1'>
                                                        <label>Amount Paid:</label>
                                                        <input
                                                            type="number"
                                                            value={formData.credit}
                                                            readOnly
                                                            placeholder='0.00'
                                                            className='inputsfocalci465s'
                                                        />
                                                    </div>
                                                    <div className='clcsecx12s1'>
                                                        <label>Amount Used For Payment:</label>
                                                        <input
                                                            className='inputsfocalci465s'
                                                            readOnly
                                                            type="number"
                                                            value={calculateTotalAmount()}
                                                            placeholder='0.00'
                                                        />
                                                    </div>

                                                    <div className='clcsecx12s1'>
                                                        <label>Amount In Excess:</label>
                                                        <input
                                                            className='inputsfocalci465s'
                                                            readOnly
                                                            type="number"
                                                            value={formData?.amt_excess?.toFixed(2)}
                                                            // disabled={!formData.items[0].item_id}
                                                            placeholder='0.00'
                                                        />

                                                    </div>
                                                    {/* {!formData.items[0].item_id ?
                                                    <b className='idofbtagwarninhxs5'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#f6b500"} fill={"none"}>
                                                        <path d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z" stroke="currentColor" strokeWidth="1.5" />
                                                        <path d="M12.2422 17V13C12.2422 12.5286 12.2422 12.2929 12.0957 12.1464C11.9493 12 11.7136 12 11.2422 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M11.992 8.99997H12.001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>To edit the shipping and adjustment charge, select an item first.</b> : ''} */}

                                                </div>

                                                {/* <div className='clcsecx12s2'>
                                                <label>Total (₹):</label>
                                                <input
                                                    type="text"
                                                    value={formData.total}
                                                    readOnly
                                                    placeholder='0.00'
                                                />
                                            </div> */}

                                            </div>
                                        </div>





                                        <div className="breakerci"></div>
                                        <div className="height5"></div>


                                        <div className='secondtotalsections485s'>
                                            <div className='textareaofcreatqsiform'>
                                                <label>Terms</label>
                                                <textarea
                                                    placeholder='Enter the terms and conditions of your business to be displayed in your transaction '
                                                    value={formData.terms_and_condition}
                                                    onChange={handleChange}
                                                    name='terms_and_condition'
                                                />
                                            </div>

                                            <div id="imgurlanddesc" className='calctotalsectionx2'>
                                                <div className="form-group">
                                                    <label>Upload Image</label>
                                                    <div className="file-upload"
                                                        tabIndex="0"
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Enter') {
                                                                const input = document.getElementById('file');
                                                                input.click();
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="file"
                                                            name="upload_image"
                                                            id="file"
                                                            className="inputfile"
                                                            onChange={handleImageChange}

                                                        />
                                                        <label htmlFor="file" className="file-label">
                                                            <div id='spc5s6'>
                                                                {otherIcons.export_svg}
                                                                {formData?.upload_image === null || formData?.upload_image == 0 ? 'Browse Files' : ""}
                                                            </div>
                                                        </label>

                                                        {
                                                            imgLoader === "success" && formData?.upload_image !== null && formData?.upload_image !== "0" ?
                                                                <label className='imageviewico656s' htmlFor="" data-tooltip-id="my-tooltip" data-tooltip-content="View Item Image" onClick={() => showimagepopup("IMG")} >
                                                                    <BsEye />
                                                                </label> : ""
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>







                                <div className="actionbarcommon">
                                    <button className="firstbtnc2 firstbtnc46x5s" type="submit" onClick={() => handleButtonClicked('draft')} disabled={loading}>
                                        {loading ? 'Submiting...' : 'Save as draft'}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                            <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    <button className="firstbtnc1" type="submit" onClick={() => handleButtonClicked('sent')} disabled={loading}> {loading ? 'Submiting...' : 'Save and send'}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                            <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <Link to={"/dashboard/quotation"} className="firstbtnc2">
                                        Cancel
                                    </Link>
                                </div>

                                {
                                    showPopup === "IMG" ? (
                                        <div className="mainxpopups2" ref={popupRef}>
                                            <div className="popup-content02">
                                                <span className="close-button02" onClick={() => setShowPopup("")}><RxCross2 /></span>
                                                {<img src={formData?.upload_image} name="upload_image" alt="" height={500} width={500} />}
                                            </div>
                                        </div>
                                    ) : ""
                                }

                            </div>
                        </DisableEnterSubmitForm>
                    </div>
                </div >
                <Toaster
                    position="bottom-right"
                    reverseOrder={false} />
            </>}
        </>
    );
};


export default CreatePaymentMade;
