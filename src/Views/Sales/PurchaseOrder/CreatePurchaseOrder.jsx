import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuotation } from '../../../Redux/Actions/quotationActions';
import { customersList } from '../../../Redux/Actions/customerActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import CustomDropdown11 from '../../../Components/CustomDropdown/CustomDropdown11';
import { vendorsLists } from '../../../Redux/Actions/listApisActions';
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { GoPlus } from 'react-icons/go';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import { updateAddresses } from '../../../Redux/Actions/globalActions';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { imageDB } from '../../../Configs/Firebase/firebaseConfig';
import { OverflowHideBOdy } from '../../../Utils/OverflowHideBOdy';
import { BsEye } from 'react-icons/bs';
import CustomDropdown14 from '../../../Components/CustomDropdown/CustomDropdown14';
import DeleveryAddress from './DeleveryAddress';
import ViewVendorsDetails from './ViewVendorsDetails';
import { SlReload } from 'react-icons/sl';
import toast, { Toaster } from 'react-hot-toast';
import { createPurchases, purchasesDetails } from '../../../Redux/Actions/purchasesActions';
import Loader02 from '../../../Components/Loaders/Loader02';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import CustomDropdown03 from '../../../Components/CustomDropdown/CustomDropdown03';
import CreateItemPopup from '../../Items/CreateItemPopup';
import useOutsideClick from '../../Helper/PopupData';
import { handleKeyPress } from '../../Helper/KeyPressInstance';
import { formatDate, formatDate3, getCurrencyFormData, todayDate } from '../../Helper/DateFormat';
import { addItems } from '../../../Redux/Actions/itemsActions';
import NumericInput from '../../Helper/NumericInput';
import CurrencySelect from '../../Helper/ComponentHelper/CurrencySelect';
import MastersSelect from '../../Helper/ComponentHelper/MastersSelect';
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { isPartiallyInViewport } from '../../Helper/is_scroll_focus';

const CreatePurchaseOrder = () => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const cusList = useSelector((state) => state?.customerList);
    const vendorList = useSelector((state) => state?.vendorList);
    const itemList = useSelector((state) => state?.itemList);
    const vendorAddress = useSelector((state) => state?.updateAddress);
    const addressVendor = vendorAddress?.data?.address;
    const [cusData, setcusData] = useState(null);
    const [switchCusDatax1, setSwitchCusDatax1] = useState("Details");
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
    const purchseDetails = useSelector(state => state?.detailsPurchase);
    const createPurchse = useSelector(state => state?.createPurchase);
    const purchseStatus = useSelector(state => state?.purchseStatus);
    // const createPurchases = useSelector(state => state?.createPurchase);
    const purchseDetail = purchseDetails?.data?.purchaseOrder;

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, dublicate: isDublicate } = Object.fromEntries(params.entries());


    const [isVendorSelect, setIsVendorSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);

    const [clickTrigger, setClickTrigger] = useState(false);
    const buttonRef = useRef(null);

    const [formData, setFormData] = useState({
        // id: 0,
        purchase_type: "purchase_order",
        transaction_date: todayDate(),
        warehouse_id: localStorage.getItem('selectedWarehouseId'),
        fy: localStorage.getItem('FinancialYear'),
        // expiry_date: new Date(),
        purchase_order_id: "PO-254",
        order_no: null,
        vendor_id: null,
        currency: getCurrencyFormData(),
        vendor_name: "",
        phone: "",
        sale_person: "",
        email: "",
        terms_and_condition: "",
        vendor_note: "",
        subtotal: null,
        discount: null,
        tcs: null,
        shipping_charge: null,
        adjustment_charge: null,
        total: null,
        reference: "",
        upload_image: null,
        payment_terms: null,
        date: null,
        place_of_supply: null,
        expected_delivery_Date: null,
        // shipment_date: formatDate(new Date()),
        shipment_preference: null,
        customer_note: null,
        discount: "",
        status: "",
        items: [
            {

                item_id: '',
                quantity: 1,
                unit: 0,
                gross_amount: null,
                // rate: null,
                final_amount: null,
                tax_rate: null,
                tax_amount: null,
                discount: 0,
                discount_type: 1,
                item_remark: null,
            }
        ],
    });

    useEffect(() => {
        if (itemId && isEdit && purchseDetail || (itemId && isDublicate && purchseDetail)) {
            const itemsFromApi = purchseDetail.items?.map(item => ({
                item_id: (+item?.item_id),
                quantity: (+item?.quantity),
                unit: (+item?.unit),
                gross_amount: (+item?.gross_amount),
                rate: (+item?.rate),
                final_amount: (+item?.final_amount),
                tax_rate: (+item?.tax_rate),
                tax_amount: (+item?.tax_amount),
                discount: (+item?.discount),
                discount_type: (+item?.discount_type),
                item_remark: item?.item_remark,
                tax_name: item?.item?.tax_preference === "1" ? "Taxable" : "Non-Taxable"
            }));

            setFormData({
                id: isEdit ? purchseDetail?.id : 0,
                purchase_type: "purchase_order",
                transaction_date: purchseDetail.transaction_date,
                warehouse_id: purchseDetail.warehouse_id,
                purchase_order_id: purchseDetail.purchase_order_id,
                vendor_id: (+purchseDetail.vendor_id),
                upload_image: purchseDetail.upload_image,
                customer_type: purchseDetail.customer_type,
                customer_name: purchseDetail.customer_name,
                phone: purchseDetail.phone,
                email: purchseDetail.email,
                reference: purchseDetail.reference,
                currency: purchseDetail.currency,
                place_of_supply: purchseDetail?.place_of_supply,
                // expiry_date: purchseDetail.expiry_date,
                expected_delivery_Date: purchseDetail.expected_delivery_Date,
                payment_terms: purchseDetail.payment_terms,
                sale_person: purchseDetail.sale_person,
                vendor_note: purchseDetail.vendor_note,
                terms_and_condition: purchseDetail.terms_and_condition,
                sale_person: purchseDetail.sale_person,
                fy: purchseDetail.fy,
                subtotal: purchseDetail.subtotal,
                shipping_charge: purchseDetail.shipping_charge,
                adjustment_charge: purchseDetail.adjustment_charge,
                total: purchseDetail.total,
                status: purchseDetail.status,
                items: itemsFromApi || []
            });

            if (purchseDetail.upload_image) {
                setImgeLoader("success");
            }

            if (purchseDetail?.address) {
                const parsedAddress = JSON?.parse(purchseDetail?.address);
                const dataWithParsedAddress = {
                    ...purchseDetail,
                    address: parsedAddress
                };
                setAddSelect({
                    billing: dataWithParsedAddress?.address?.billing,
                    shipping: dataWithParsedAddress?.address?.shipping,
                });
                setcusData(dataWithParsedAddress?.vendor)
            }

            if (purchseDetail.vendor_id) {
                setIsVendorSelect(true);
            }

            if (!purchseDetail.items) {
                setIsItemSelect(false);
            } else {
                setIsItemSelect(true);
            }

        }
    }, [purchseDetail, itemId, isEdit, isDublicate]);



    const [loading, setLoading] = useState(false);


    const handleItemAdd = () => {
        const newItems = [...formData.items, {
            item_id: '',
            quantity: 1,
            unit: 0,
            gross_amount: null,
            rate: null,
            final_amount: null,
            tax_rate: null,
            tax_amount: 0,
            discount: 0,
            discount_type: 1,
            item_remark: null,
        }];
        setFormData({ ...formData, items: newItems });

    };




    // useEffect(() => {
    //     if (addRowOnChange === true) {
    //         handleItemAdd();
    //         setAddRowOnChange(false)
    //     }
    // }, [addRowOnChange])



    // updateAddress State
    const [udateAddress, setUpdateAddress] = useState({
        id: "",
        user_id: "",
        country_id: "",
        street_1: "",
        street_2: "",
        state_id: "",
        city_id: "",
        zip_code: "",
        address_type: "",
        is_billing: "",
        is_shipping: "",
        phone_no: "",
        fax_no: ""
    });


    // updateAddress State addUpdate
    // for address select
    const [addSelect, setAddSelect] = useState({
        billing: "",
        shipping: ""
    })

    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        if (name === "billing") {
            setAddSelect({
                ...addSelect,
                billing: value,
            })
        } else {
            setAddSelect({
                ...addSelect,
                shipping: value,
            })
        }

    }

    const [showPopup, setShowPopup] = useState("");

    useEffect(() => {
        if (showPopup === "billingAdd") {
            // console.log("billing call")
            setAddSelect({
                ...addSelect,
                billing: addressVendor
            })
        }
        if (showPopup === "shippingAdd") {
            // console.log("shipping call")
            setAddSelect({
                ...addSelect,
                shipping: addressVendor
            })
        }
    }, [addressVendor])

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge') {
            newValue = parseFloat(value) || 0; // Convert to float or default to 0
        }

        if (name === "vendor_id" && value !== "") {
            setIsVendorSelect(true);
        } else if (name === "vendor_id" && value == "") {
            setIsVendorSelect(false);
        }


        if (name === "vendor_id") {
            const selectedItem = vendorList?.data?.user?.find(cus => cus.id == value);
            const findfirstbilling = selectedItem?.address?.find(val => val?.is_billing === "1")
            const findfirstshipping = selectedItem?.address?.find(val => val?.is_shipping === "1")
            setAddSelect({
                billing: findfirstbilling,
                shipping: findfirstshipping,
            });

        }

        setFormData({
            ...formData,
            [name]: newValue,
            total: calculateTotal(formData.subtotal, newValue, formData.adjustment_charge),
        });


    };

    const popupRef = useRef(null);

    //show all addresses popup....
    const popupRef1 = useRef(null);
    const showAllAddress = (val) => {
        setShowPopup(val);
    }

    //show all addresses....
    // Change address
    const changeAddress = (val, type) => {
        setShowPopup(type);
        // console.log("vaaaaaaaaaaaaaaaa", val)
        setUpdateAddress({
            ...udateAddress,
            id: val?.id,
            user_id: val?.user_id,
            country_id: val?.country_id,
            street_1: val?.street_1,
            street_2: val?.street_2,
            state_id: val?.state_id,
            city_id: val?.city_id,
            zip_code: val?.zip_code,
            address_type: val?.address_type,
            is_billing: val?.is_billing,
            is_shipping: val?.is_shipping,
            phone_no: val?.phone_no,
            fax_no: val?.fax_no
        });
    }
    // Change address


    // Change address handler
    const handleAllAddressChange = (e, type) => {
        const { name, value, checked } = e.target;

        setUpdateAddress({
            ...udateAddress,
            [name]: value,
        });

        // if (type === 'Shipping') {
        //     setUpdateAddress({
        //         ...udateAddress,
        //         is_shipping: checked ? "1" : "0"
        //     })
        // } else if (type === 'Billing') {
        //     setUpdateAddress({
        //         ...udateAddress,
        //         is_billing: checked ? "1" : "0"
        //     })
        // }

    };
    // Change address handler


    // update Address Handler
    const updateAddressHandler = () => {
        try {
            dispatch(updateAddresses(udateAddress)).then(() => {
                setShowPopup("");
                setClickTrigger((prevTrigger) => !prevTrigger);
                // if (udateAddress?.is_shipping === "0") {
                //     setAddSelect({
                //         ...addSelect,
                //         shipping: undefined,
                //     })
                // } else if (udateAddress?.is_billing === "0") {
                //     setAddSelect({
                //         ...addSelect,
                //         billing: undefined,
                //     })
                // }
            })
        } catch (e) {
            toast.error("error", e)
        }
    }



    const dropdownRef = useRef(null);

    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
        const subTotalValue = parseFloat(subtotal) || 0;
        const shippingChargeValue = parseFloat(shippingCharge) || 0;
        const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
        return (subTotalValue + shippingChargeValue + adjustmentChargeValue).toFixed(2);
    };

    // const [buttonClicked, setButtonClicked] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const buttonName = e.nativeEvent.submitter.name;

        if (!isVendorSelect) {
            if (!isPartiallyInViewport(dropdownRef1.current)) {
                dropdownRef1.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(() => {
                dropdownRef1.current.focus();
            }, 500);

        } else if (!isItemSelect) {
            if (!isPartiallyInViewport(dropdownRef2.current)) {
                dropdownRef2.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(() => {
                dropdownRef2.current.focus();
            }, 500);

        } else {
            try {
                // setLoading(true);
                const updatedItems = formData?.items?.map((item) => {
                    const { tax_name, ...itemWithoutTaxName } = item;
                    return itemWithoutTaxName;
                });

                await dispatch(createPurchases({ ...formData, items: updatedItems }, Navigate, "purchase", isEdit, buttonName));
                setLoading(false);
            } catch (error) {
                toast.error('Error updating quotation:', error);
                setLoading(false);
            }
        }
    };




    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            customer_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
            email: cusData?.email,
            phone: cusData?.mobile_no,
            address: cusData?.address?.length,
            currency: cusData?.currency
        }));
    }, [cusData]);

    useEffect(() => {
        dispatch(customersList({ fy: localStorage.getItem('FinancialYear') }));
        if (itemId && isEdit) {
            dispatch(purchasesDetails({ id: itemId }));
        }
    }, [dispatch]);


    useEffect(() => {
        dispatch(vendorsLists({ fy: localStorage.getItem('FinancialYear') }));
    }, [dispatch, clickTrigger]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            expected_delivery_Date: formatDate(date),
        });
    };


    useOutsideClick(dropdownRef, () => setOpenDropdownIndex(null));

    const [imgLoader, setImgeLoader] = useState("");

    const [freezLoadingImg, setFreezLoadingImg] = useState(false);





    useEffect(() => {
        OverflowHideBOdy(showPopup);

    }, [showPopup]);


    // add item row on enter press

    useEffect(() => {
        return handleKeyPress(buttonRef, handleItemAdd);
    }, [buttonRef, handleItemAdd]);
    // add item row on enter press


    return (
        <>
            <TopLoadbar />
            {createPurchse?.loading && <MainScreenFreezeLoader />}
            {purchseStatus?.loading && <MainScreenFreezeLoader />}
            {freezLoadingImg && <MainScreenFreezeLoader />}

            <div className='formsectionsgrheigh' >
                <div id="Anotherbox" className='formsectionx2'>
                    <div id="leftareax12">
                        <h1 id="firstheading">
                            <svg id="fi_12311714" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m11.5 30c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm0-3c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z" fill="#00e676"></path><path d="m25.5 30c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm0-3c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z" fill="#00e676"></path><path d="m28 26h-18.13c-.74 0-1.42-.4-1.76-1.06-.35-.65-.31-1.44.1-2.05l.96-1.44c.73-1.1 2.4 0 1.66 1.11l-.96 1.45h18.13c1.32 0 1.32 2 0 2z" fill="#004d40"></path><path d="m6.11 11.45-.72-1.45h-2.39c-1.32 0-1.32-2 0-2h3c.38 0 .73.21.89.55l1 2c.59 1.18-1.2 2.08-1.79.89z" fill="#004d40"></path><path d="m28.95 9-22 1c-.64.03-1.09.64-.92 1.26l3 11c.12.44.52.74.96.74h.06l16-1c.43-.03.79-.32.9-.73l3-11c.18-.64-.32-1.28-1.01-1.26z" fill="#00e676"></path><circle cx="18" cy="10" fill="#004d40" r="8"></circle><path d="m16.29 12.71-2-2c-.94-.94.48-2.35 1.41-1.41l1.29 1.29 3.29-3.29c.94-.94 2.35.48 1.41 1.41l-4 4c-.39.39-1.02.39-1.41 0z" fill="#00e676"></path></svg>
                            New Purchase Order
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
                                                    ref={dropdownRef1}
                                                    label="Select vendor"
                                                    options={vendorList?.data?.user?.filter((val) => val?.active === "1")}
                                                    value={formData.vendor_id}
                                                    onChange={handleChange}
                                                    name="vendor_id"
                                                    defaultOption="Select Vendor Name"
                                                    setcusData={setcusData}
                                                    type="vendor"
                                                    required
                                                />
                                            </span>
                                            {!isVendorSelect && <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                                                {otherIcons.error_svg}
                                                Please Select Vendor</p>}
                                            {cusData &&
                                                <div className="view_all_cus_deial_btn">
                                                    {viewAllCusDetails === true ?
                                                        <button type="button" onClick={() => setViewAllCusDetails(false)}
                                                            onKeyDown={(event) => {
                                                                if (event.key === 'Enter') {
                                                                    setViewAllCusDetails(false)
                                                                }
                                                            }}
                                                        >Hide vendor information</button>
                                                        :
                                                        <button type="button" onClick={() => setViewAllCusDetails(true)}
                                                            onKeyDown={(event) => {
                                                                if (event.key === 'Enter') {
                                                                    setViewAllCusDetails(true)
                                                                }
                                                            }}
                                                        >View Vendor Information</button>

                                                    }
                                                </div>
                                            }
                                            {/* popup code */}




                                            {showPopup === "billingAdd" || showPopup === "shippingAdd" ? (
                                                <div className="mainxpopups1" ref={popupRef1}>
                                                    <div className="popup-content" >
                                                        <span className="close-button" onClick={() => setShowPopup("")}><RxCross2 /></span>
                                                        <div className="midpopusec12x">
                                                            <div className=""
                                                            >
                                                                {/* <p>Change Address</p> */}
                                                                <div className='checkboxcontainer5s'>

                                                                    <div className="form_commonblock">
                                                                        <label>{showPopup === "shippingAdd" ? "Shipping Address" : "Billing Address"}</label>
                                                                        <div className='checkboxcontainer5s'>

                                                                            {/* <label>
                                                                                <input type="checkbox" name='is_shipping' checked={udateAddress?.is_shipping === "1"} onChange={(e) => handleAllAddressChange(e, 'Shipping')} />
                                                                                Shipping Address
                                                                            </label> */}

                                                                            {/* <label>
                                                                                <input type="checkbox" name='is_billing' checked={udateAddress?.is_billing === "1"} onChange={(e) => handleAllAddressChange(e, 'Billing')} />
                                                                                Billing Address
                                                                            </label> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="form_commonblock">
                                                                    <label >Street 1</label>
                                                                    <span >
                                                                        {otherIcons.tag_svg}
                                                                        <input type="text" value={udateAddress?.street_1}
                                                                            placeholder='Select street_1'
                                                                            onChange={(e) => handleAllAddressChange(e)} name='street_1'
                                                                        />
                                                                    </span>
                                                                </div>
                                                                <div className="form_commonblock">
                                                                    <label >Street 2</label>
                                                                    <span >
                                                                        {otherIcons.tag_svg}
                                                                        <input type="text" value={udateAddress?.street_2}
                                                                            placeholder='Select street_2'
                                                                            onChange={(e) => handleAllAddressChange(e)}
                                                                            name='street_2'
                                                                        />
                                                                    </span>
                                                                </div>
                                                                <div className="form_commonblock">
                                                                    <label >Phone Number</label>
                                                                    <span >
                                                                        {otherIcons.tag_svg}
                                                                        <NumericInput
                                                                            value={udateAddress.phone_no}
                                                                            placeholder='Select phone_no'
                                                                            onChange={(e) => handleAllAddressChange(e)}
                                                                            name='phone_no'
                                                                        />
                                                                    </span>
                                                                </div>
                                                                <div className="form_commonblock">
                                                                    <label >Fax Number</label>
                                                                    <span >
                                                                        {otherIcons.tag_svg}
                                                                        <input type="text" value={udateAddress.fax_no}
                                                                            placeholder='Select fax_no'
                                                                            onChange={(e) => handleAllAddressChange(e)}
                                                                            name='fax_no'
                                                                        />
                                                                    </span>
                                                                </div>
                                                                <div className="form_commonblock">
                                                                    <label >Zip Code</label>
                                                                    <span >
                                                                        {otherIcons.tag_svg}
                                                                        <input type="text" value={udateAddress.zip_code}
                                                                            placeholder='Select zip_code'
                                                                            onChange={(e) => handleAllAddressChange(e)}
                                                                            name='zip_code'
                                                                        />
                                                                    </span>
                                                                </div>
                                                                <div className="form_commonblock">
                                                                    <button type="button" onClick={() => updateAddressHandler()}>Update Address</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : ""}

                                            {showPopup === "billing" && (
                                                <div className="mainxpopups1" ref={popupRef1}>
                                                    <div className="popup-content" style={{ height: " 400px" }}>
                                                        <span className="close-button" onClick={() => setShowPopup("")}><RxCross2 /></span>
                                                        { }
                                                        <CustomDropdown14
                                                            label="Search Shipping"
                                                            options={cusData?.address?.filter(val => val?.is_billing === "1")}
                                                            value={addSelect?.billing}
                                                            onChange={handleAddressChange}
                                                            name="billing"
                                                            defaultOption="Select Billing"
                                                            customerName={`${cusData?.first_name} ${cusData?.last_name}`}
                                                        />
                                                        <div className="midpopusec12x">
                                                            <div className="form_commonblock">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {showPopup === "shipping" && (<div className="mainxpopups1" ref={popupRef1}>
                                                <div className="popup-content" style={{ height: " 400px" }}>
                                                    <span className="close-button" onClick={() => setShowPopup("")}><RxCross2 /></span>
                                                    <div className="midpopusec12x">
                                                        <CustomDropdown14
                                                            label="Search Shipping"
                                                            options={cusData?.address?.filter(val => val?.is_shipping === "1")}
                                                            value={addSelect?.shipping}
                                                            onChange={handleAddressChange}
                                                            name="shipping"
                                                            defaultOption="Select Shipping"
                                                            customerName={`${cusData?.first_name} ${cusData?.last_name}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                            }

                                            {/* popup code */}
                                        </div>

                                        {vendorAddress?.loading ? <Loader02 /> : <></>}
                                        {!cusData ? "" :
                                            <>
                                                <div className="showCustomerDetails">
                                                    {!viewAllCusDetails &&
                                                        <div className="cus_fewDetails">
                                                            <div className="cust_dex1s1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#0d54b8"} fill={"none"}>
                                                                    <path d="M14.5 9C14.5 10.3807 13.3807 11.5 12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9Z" stroke="currentColor" strokeWidth="1.5" />
                                                                    <path d="M18.2222 17C19.6167 18.9885 20.2838 20.0475 19.8865 20.8999C19.8466 20.9854 19.7999 21.0679 19.7469 21.1467C19.1724 22 17.6875 22 14.7178 22H9.28223C6.31251 22 4.82765 22 4.25311 21.1467C4.20005 21.0679 4.15339 20.9854 4.11355 20.8999C3.71619 20.0475 4.38326 18.9885 5.77778 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M13.2574 17.4936C12.9201 17.8184 12.4693 18 12.0002 18C11.531 18 11.0802 17.8184 10.7429 17.4936C7.6543 14.5008 3.51519 11.1575 5.53371 6.30373C6.6251 3.67932 9.24494 2 12.0002 2C14.7554 2 17.3752 3.67933 18.4666 6.30373C20.4826 11.1514 16.3536 14.5111 13.2574 17.4936Z" stroke="currentColor" strokeWidth="1.5" />
                                                                </svg> <p>Delivery Address</p>
                                                            </div>


                                                            <div className="cust_dex1s2">
                                                                <div className="cust_dex1s2s1">
                                                                    {!addSelect?.billing ? "No billing address is found" : <>
                                                                        <p className='dex1s2schilds1'>Billing Address <button type='button' onClick={() => showAllAddress("billing")}>show all</button></p>
                                                                        <button type='button' onClick={() => changeAddress(addSelect?.billing, "billingAdd")}>Change Address</button>
                                                                        < p className='dex1s2schilds2' > Customer Name: {`${cusData?.first_name} ${cusData?.last_name}`} </p>

                                                                        <p>  Street1:
                                                                            {vendorAddress?.loading ? "loading" : <>{addressVendor ? addressVendor?.street_1 : addSelect?.billing?.street_1}</>}
                                                                        </p>
                                                                        <p>  Street 2: {addSelect?.billing?.street_2}  </p>
                                                                        <p>  Landmark: {addSelect?.billing?.landmark ? addSelect?.billing?.landmark : "No landmark"}  </p>
                                                                        <p>  Locality: {addSelect?.billing?.locality ? addSelect?.billing?.locality : "No locality"}  </p>
                                                                        <p>  House No: {addSelect?.billing?.house_no ? addSelect?.billing?.house_no : "No house_no"}  </p>
                                                                        <p>  Fax Number: {addSelect?.billing?.fax_no ? addSelect?.billing?.fax_no : "No fax_no"}  </p>
                                                                        <p>  Phone:  {addSelect?.billing?.phone_no ? addSelect?.billing?.phone_no : "No phone_no"}  </p>
                                                                    </>}
                                                                </div>
                                                                <div className="seps23"></div>
                                                                <div className="cust_dex1s2s1">
                                                                    {!addSelect?.shipping ? "No shipping address is found" : <>

                                                                        <p className='dex1s2schilds1'>Shipping address <button type='button' onClick={() => showAllAddress("shipping")}>show all</button>

                                                                        </p>
                                                                        <button type='button' onClick={() => changeAddress(addSelect?.shipping, "shippingAdd")}>Change Address</button>
                                                                        <p className='dex1s2schilds2'>Customer Name: {`${cusData?.first_name} ${cusData?.last_name}`} </p>
                                                                        <p>  Street1: {addSelect?.shipping?.street_1}  </p>
                                                                        <p>  Street 2: {addSelect?.shipping?.street_2}  </p>
                                                                        <p>  Landmark: {addSelect?.shipping?.landmark ? addSelect?.shipping?.landmark : "No landmark"}  </p>
                                                                        <p>  Locality: {addSelect?.shipping?.locality ? addSelect?.shipping?.locality : "No locality"}  </p>
                                                                        <p>  House No: {addSelect?.shipping?.house_no ? addSelect?.shipping?.house_no : "No house_no"}  </p>
                                                                        <p>  Fax Number: {addSelect?.shipping?.fax_no ? addSelect?.shipping?.fax_no : "No fax_no"}  </p>
                                                                        <p>  Phone:  {addSelect?.shipping?.phone_no ? addSelect?.shipping?.phone_no : "No phone_no"}  </p>
                                                                    </>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                </div>
                                                <ViewVendorsDetails
                                                    setSwitchCusDatax1={setSwitchCusDatax1}
                                                    setViewAllCusDetails={setViewAllCusDetails}
                                                    cusData={cusData}
                                                    addSelect={addSelect}
                                                    viewAllCusDetails={viewAllCusDetails}
                                                    switchCusDatax1={switchCusDatax1} />
                                            </>
                                        }

                                        <DeleveryAddress />

                                    </div>


                                    <div className="f1wrapofcreqx1">
                                        <div className="form_commonblock">
                                            <label >Purchase Order Number</label>
                                            <span >
                                                {otherIcons.tag_svg}
                                                <input type="text" value={formData.purchase_order_id}
                                                    placeholder='Select Purchase Order Number'
                                                    onChange={handleChange}
                                                    name='purchase_order_id'
                                                />

                                            </span>
                                        </div>




                                        <div className="form_commonblock ">
                                            <label >Reference</label>
                                            <span >
                                                {otherIcons.placeofsupply_svg}
                                                <input type="text" value={formData.reference} onChange={handleChange}
                                                    // disabled

                                                    name='reference'
                                                    placeholder='Enter Reference Number' />

                                            </span>
                                        </div>

                                        <div className="form_commonblock">
                                            <CurrencySelect
                                                value={formData?.currency}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="form_commonblock">
                                            <label>Date</label>
                                            <span>
                                                {otherIcons.date_svg}
                                                <DatePicker
                                                    selected={(formData.transaction_date)}
                                                    onChange={(date) => setFormData({ ...formData, transaction_date: formatDate(date) })}
                                                    name='transaction_date'
                                                    placeholderText="Enter Shipping Date"
                                                    dateFormat="dd-MMM-yyyy" // Use MMM for month name
                                                    format="dd-MMM-yyyy" // Add format prop
                                                />
                                            </span>

                                        </div>

                                        <div className="form_commonblock">
                                            <label >Expected Delivery Date</label>
                                            <span>
                                                {otherIcons.date_svg}
                                                <DatePicker
                                                    autoComplete='off'
                                                    selected={(formData.expected_delivery_Date)}
                                                    onChange={handleDateChange}
                                                    name='expected_delivery_Date'
                                                    placeholderText="Enter Purchase Order Date"
                                                    dateFormat="dd-MMM-yyyy"
                                                    minDate={formData.transaction_date}
                                                />

                                            </span>
                                        </div>


                                        <div className="form_commonblock">
                                            <label >Place Of Supply</label>
                                            <span >
                                                {otherIcons.placeofsupply_svg}
                                                <input
                                                    type="text"
                                                    value={formData.place_of_supply}
                                                    onChange={handleChange}
                                                    name='place_of_supply'

                                                    placeholder='Enter Place Of Supply'
                                                />
                                            </span>
                                        </div>

                                        <div className="form_commonblock ">

                                            <MastersSelect
                                                value={formData.payment_terms}
                                                onChange={handleChange}
                                                name="payment_terms"
                                            />
                                        </div>

                                        <div className="form_commonblock">
                                            <label>Sale Person</label>
                                            <span >
                                                {otherIcons.vendor_svg}
                                                <input
                                                    type="text"
                                                    value={formData.sale_person}
                                                    name='sale_person'
                                                    onChange={handleChange}
                                                    placeholder='Enter Sales Person'
                                                />
                                            </span>
                                        </div>




                                        <div>

                                        </div>
                                    </div>
                                </div>
                                {/* </div> */}



                                <div className="">
                                    <ItemSelect
                                        formData={formData}
                                        setFormData={setFormData}
                                        handleChange={handleChange}
                                        setIsItemSelect={setIsItemSelect}
                                        isItemSelect={isItemSelect}
                                        extracssclassforscjkls={"extracssclassforscjkls"}
                                        dropdownRef2={dropdownRef2}
                                    />

                                    <div className='secondtotalsections485s sxfc546sdfr85234e'>
                                        <div className='textareaofcreatqsiform'>
                                            <label>Terms And Conditions</label>
                                            <textarea
                                                placeholder='Enter the terms and conditions of your business to be displayed in your transaction '
                                                value={formData.terms_and_condition}
                                                onChange={handleChange}
                                                name='terms_and_condition'
                                            />
                                        </div>

                                        <div id="imgurlanddesc" className='calctotalsectionx2'>

                                            <ImageUpload
                                                formData={formData}
                                                setFormData={setFormData}
                                                setFreezLoadingImg={setFreezLoadingImg}
                                                imgLoader={imgLoader}
                                                setImgeLoader={setImgeLoader}
                                                component="purchase"
                                            />
                                        </div>
                                    </div>
                                </div>


                            </div>







                            <div className="actionbarcommon">
                                {isEdit && itemId ?
                                    <>
                                        <button className={`firstbtnc46x5s firstbtnc2`} type="submit" disabled={loading} name="saveAsDraft">
                                            Update
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                        <button className={`firstbtnc1`} type="submit" disabled={loading} name="saveAndSend"> Update and send
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </>
                                    :
                                    <>
                                        <button className={`firstbtnc46x5s firstbtnc2`} type="submit" disabled={loading} name="saveAsDraft">
                                            Save as draft
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                        <button className={`firstbtnc1`} type="submit" disabled={loading} name="saveAndSend">Save and Send
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </>
                                }

                                <Link to={"/dashboard/sales-orders"} className="firstbtnc2">
                                    Cancel
                                </Link>

                            </div>


                        </div>
                    </DisableEnterSubmitForm>
                </div >
                <Toaster />
            </div >
        </>
    );
};
export default CreatePurchaseOrder;
