import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { quotationDetails, updateQuotation } from '../../../Redux/Actions/quotationActions';
import { customersList } from '../../../Redux/Actions/customerActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import CustomDropdown11 from '../../../Components/CustomDropdown/CustomDropdown11';
import { itemLists } from '../../../Redux/Actions/listApisActions';
import DatePicker from "react-datepicker";

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { GoPlus } from 'react-icons/go';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import { fetchCurrencies, updateAddresses } from '../../../Redux/Actions/globalActions';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { imageDB } from '../../../Configs/Firebase/firebaseConfig';
import { OverflowHideBOdy } from '../../../Utils/OverflowHideBOdy';
import { BsEye } from 'react-icons/bs';
import { Toaster, toast } from "react-hot-toast";
import CustomDropdown14 from '../../../Components/CustomDropdown/CustomDropdown14';
import { SlReload } from 'react-icons/sl';
import { saleOrderDetails } from '../../../Redux/Actions/saleOrderActions';
import Loader02 from '../../../Components/Loaders/Loader02';
import CurrencySelect from '../../Helper/ComponentHelper/CurrencySelect';
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { isPartiallyInViewport } from '../../Helper/is_scroll_focus';
import { getCurrencyFormData } from '../../Helper/DateFormat';

const CreateSalesOrders = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const cusList = useSelector((state) => state?.customerList);
    const itemList = useSelector((state) => state?.itemList);
    const getCurrency = useSelector((state) => state?.getCurrency?.data);
    const addUpdate = useSelector((state) => state?.updateAddress);
    const [cusData, setcusData] = useState(null);
    const [switchCusDatax1, setSwitchCusDatax1] = useState("Details");
    const [itemData, setItemData] = useState({});
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);

    const saleDetail = useSelector((state) => state?.saleDetail);
    const saleDetails = saleDetail?.data?.data?.salesOrder;

    const [isCustomerSelect, setIsCustomerSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);

    const quoteDetail = useSelector((state) => state?.quoteDetail);
    const quoteDetails = quoteDetail?.data?.data?.quotation;
    const [fetchDetails, setFetchDetails] = useState(null);


    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, convert } = Object.fromEntries(params.entries());

    useEffect(() => {
        if (itemId && isEdit) {
            setFetchDetails(saleDetails);
        } else if (itemId && (convert === "toInvoice" || convert === "toSale")) {
            setFetchDetails(quoteDetails);
        }
    }, [quoteDetails])

    const [formData, setFormData] = useState({
        sale_type: 'sale_order',
        transaction_date: new Date(),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        sale_order_id: 'SO-00001',
        customer_id: '',
        upload_image: null,
        customer_type: null,
        customer_name: null,
        phone: null,
        email: null,
        discount: null,
        address: [
            {}
        ],
        reference_no: "",
        // subject: "",
        payment_terms: "",
        delivery_method: "",
        currency: getCurrencyFormData(),
        place_of_supply: "",
        shipment_date: "",
        sale_person: '',
        customer_note: null,
        terms_and_condition: null,
        fy: localStorage.getItem('FinancialYear') || 2024,
        subtotal: null,
        shipping_charge: null,
        adjustment_charge: null,
        total: null,
        status: '',
        items: [
            {

                item_id: '',
                quantity: 1,
                gross_amount: null,
                rate: null,
                final_amount: null,
                tax_rate: null,
                tax_amount: null,
                discount: 0,
                discount_type: 1,
                item_remark: null,
                tax_name: ""
            }
        ],
    });

    const [loading, setLoading] = useState(false);

    const handleItemAdd = () => {
        const newItems = [...formData.items, {
            item_id: '',
            quantity: 1,
            gross_amount: null,
            final_amount: null,
            tax_rate: null,
            tax_amount: 0,
            rate: 0,
            discount: 0,
            discount_type: 1,
            item_remark: null,
            tax_name: ""

        }];
        setFormData({ ...formData, items: newItems });
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge') {
            newValue = parseFloat(value) || 0; // Convert to float or default to 0
        }

        if (name === "customer_id" && value !== "") {
            setIsCustomerSelect(true);
        } else if (name === "customer_id" && value == "") {
            setIsCustomerSelect(false);
        }

        if (name === "customer_id") {
            const selectedItem = cusList?.data?.user?.find(cus => cus.id == value);

            const findfirstbilling = selectedItem?.address?.find(val => val?.is_billing === "1")
            const findfirstshipping = selectedItem?.address?.find(val => val?.is_shipping === "1")
            setAddSelect({
                billing: findfirstbilling,
                shipping: findfirstshipping,
            })
        }



        setFormData({
            ...formData,
            [name]: newValue,
            total: calculateTotal(formData.subtotal, formData.shipping_charge, formData.adjustment_charge),
            address: addSelect ? JSON.stringify(addSelect) : null, // Convert address array to string if addSelect is not null
        });
    };







    const popupRef = useRef(null);

    // addresssssssssssssssssssssssssssssssssssssssssssssssssssssssss

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
    })
    // updateAddress State addUpdate
    // console.log("updated Address state", udateAddress)
    // for address select
    const [addSelect, setAddSelect] = useState({
        billing: "",
        shipping: ""
    });

    // console.log("addSelect", addSelect)

    //set selected billing and shipping addresses inside formData
    useEffect(() => {
        setFormData({
            ...formData,
            address: addSelect
        })
    }, [addSelect])
    //set selected billing and shipping addresses inside formData

    // console.log("formData", formData)
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
    // for address select


    //show all addresses popup....
    const popupRef1 = useRef(null);
    const [showPopup, setShowPopup] = useState(false);

    // Change address
    const changeAddress = (val) => {
        setShowPopup("showAddress")
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

        if (type === 'Shipping') {
            setUpdateAddress({
                ...udateAddress,
                is_shipping: checked ? "1" : "0"
            })
        } else if (type === 'Billing') {
            setUpdateAddress({
                ...udateAddress,
                is_billing: checked ? "1" : "0"
            })
        }

    };
    // Change address handler

    // update Address Handler
    const [clickTrigger, setClickTrigger] = useState(false);
    const updateAddressHandler = () => {
        try {

            dispatch(updateAddresses(udateAddress)).then(() => {
                setShowPopup("");
                setClickTrigger((prevTrigger) => !prevTrigger);
                if (udateAddress?.is_shipping === "0") {
                    setAddSelect({
                        ...addSelect,
                        shipping: undefined,
                    })
                } else if (udateAddress?.is_billing === "0") {
                    setAddSelect({
                        ...addSelect,
                        billing: undefined,
                    })
                }
            })
        } catch (e) {
            toast.error("error", e)
        }
    }
    // update Address Handler

    //trigger show updated address then it updated
    useEffect(() => {
        if (addSelect?.billing) {
            // console.log("addreupdate response", addUpdate?.data?.address)
            setAddSelect({
                ...addSelect,
                billing: addUpdate?.data?.address,
            })
        } if (addSelect?.shipping) {
            setAddSelect({
                ...addSelect,
                shipping: addUpdate?.data?.address,
            })
        }

    }, [addUpdate])
    //trigger show updated address then it updated

    // addresssssssssssssssssssssssssssssssssssssssssssssssssssssssss






    const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
        const subTotalValue = parseFloat(subtotal) || 0;
        const shippingChargeValue = parseFloat(shippingCharge) || 0;
        const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
        return (subTotalValue + shippingChargeValue + adjustmentChargeValue).toFixed(2);
    };

    const [buttonClicked, setButtonClicked] = useState(null);

    const handleButtonClicked = (status) => {
        setButtonClicked(status);
    };

    const Navigate = useNavigate()

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const buttonName = e.nativeEvent.submitter.name;

        if (!isCustomerSelect) {
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
            if (!buttonClicked) {
                toast.error('Please select an action (Save as draft or Save and send).');
                return;
            }
            setLoading(true);
            try {
                // const { tax_name, ...formDataWithoutTaxName } = formData;
                const updatedItems = formData.items?.map((item) => {
                    const { tax_name, ...itemWithoutTaxName } = item;
                    return itemWithoutTaxName;
                });
                await dispatch(updateQuotation({ ...formData, items: updatedItems }, Navigate, "sales-orders", "Sale-Order", isEdit, buttonName));

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
            // address: cusData?.address.length,
            address: addSelect,
            currency: cusData?.currency

        }));
    }, [cusData]);

    useEffect(() => {
        dispatch(itemLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(fetchCurrencies());

        if (itemId && isEdit) {
            dispatch(saleOrderDetails({ id: itemId }))
        } else if (itemId && (convert === "toInvoice" || convert === "toSale")) {
            dispatch(quotationDetails({ id: itemId }))
        }

    }, [dispatch]);

    useEffect(() => {
        dispatch(customersList({ fy: localStorage.getItem('FinancialYear') }));
    }, [dispatch, clickTrigger]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            transaction_date: date,
        });
    };


    // dropdown
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);



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

    const [imgLoader, setImgeLoader] = useState("");

    const [freezLoadingImg, setFreezLoadingImg] = useState(false);




    useEffect(() => {
        OverflowHideBOdy(showPopup);
        // Clean up the effect by removing the event listener on unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showPopup]);


    useEffect(() => {
        if (itemId && isEdit && fetchDetails || itemId && (convert === "toInvoice" || convert === "toSale")) {
            const itemsFromApi = fetchDetails?.items?.map(item => ({
                item_id: (+item?.item_id),
                quantity: (+item?.quantity),
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
                ...formData,
                id: isEdit ? fetchDetails?.id : 0,
                sale_type: convert === "toInvoice" ? "invoice" : 'sale_order',
                transaction_date: fetchDetails?.created_at,
                warehouse_id: fetchDetails?.warehouse_id,
                sale_order_id: fetchDetails?.sale_order_id || "SO-00001",
                customer_id: (+fetchDetails?.customer_id),
                upload_image: fetchDetails?.upload_image,
                customer_type: fetchDetails?.customer_type,
                customer_name: fetchDetails?.customer_name,
                phone: fetchDetails?.phone,
                email: fetchDetails?.email,
                reference_no: fetchDetails?.reference_no,
                payment_terms: fetchDetails?.payment_terms,
                currency: fetchDetails?.currency,
                place_of_supply: fetchDetails?.customer?.place_of_supply,
                delivery_method: fetchDetails?.delivery_method,
                sale_person: fetchDetails?.sale_person,
                customer_note: fetchDetails?.customer_note,
                terms_and_condition: fetchDetails?.terms_and_condition,
                fy: fetchDetails?.fy,
                subtotal: fetchDetails?.subtotal,
                shipping_charge: fetchDetails?.shipping_charge,
                adjustment_charge: fetchDetails?.adjustment_charge,
                total: fetchDetails?.total,
                status: fetchDetails?.status,
                items: itemsFromApi || []
            });

            if (fetchDetails?.upload_image) {
                setImgeLoader("success")
            }

            if (fetchDetails?.address) {
                const parsedAddress = JSON?.parse(fetchDetails?.address);

                const dataWithParsedAddress = {
                    ...fetchDetails,
                    address: parsedAddress
                };
                setAddSelect({
                    billing: dataWithParsedAddress?.address?.billing,
                    shipping: dataWithParsedAddress?.address?.shipping,
                })

                setcusData(dataWithParsedAddress?.customer);
            }

            if (quoteDetails?.customer_id) {
                setIsCustomerSelect(true);
            }

            if (!quoteDetails?.items) {
                setIsItemSelect(false);
            } else {
                setIsItemSelect(true);
            }


        }
    }, [itemId, isEdit, convert, fetchDetails])
    return (
        <>
            {saleDetail?.loading === true || quoteDetail?.loading === true ? <Loader02 /> : <>

                <TopLoadbar />
                {loading && <MainScreenFreezeLoader />}
                {freezLoadingImg && <MainScreenFreezeLoader />}
                {addUpdate?.loading && <MainScreenFreezeLoader />}

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <svg id="fi_9431186" height="512" viewBox="0 0 60 60" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m8.6 20h23.33l16.28 8.63-3.63 11.91a2.4 2.4 0 0 1 -2.17 1.7l-29.58 1.55z" fill="#d5e4ef"></path><circle cx="19" cy="55" fill="#262a33" r="4"></circle><circle cx="37" cy="55" fill="#262a33" r="4"></circle><circle cx="45" cy="15" fill="#19cc61" r="14"></circle><path d="m29 28h-13a1 1 0 0 1 0-2h13a1 1 0 0 1 0 2z" fill="#b9c9d6"></path><path d="m40 36h-23a1 1 0 0 1 0-2h23a1 1 0 0 1 0 2z" fill="#b9c9d6"></path><path d="m43 22a1 1 0 0 1 -.707-.293l-4-4a1 1 0 0 1 1.414-1.414l3.138 3.138 7.323-10.986a1 1 0 1 1 1.664 1.11l-8 12a1 1 0 0 1 -.732.445c-.035 0-.068 0-.1 0z" fill="#fff"></path><path d="m44 52-31.756-.007a3.24 3.24 0 0 1 -2.744-4.958l2.314-3.514c-.185-.777-.409-2.031-.768-4.051l-4.185-23.47h-5.861a1 1 0 0 1 0-2h6.7a1 1 0 0 1 .985.824s5.081 28.529 5.128 28.788a1.008 1.008 0 0 1 -.149.731l-2.484 3.772a1.241 1.241 0 0 0 1.065 1.878l31.755.007a1 1 0 0 1 0 2z" fill="#b9c9d6"></path></svg>
                                New Sale Order
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
                                            <label >Customer Name<b className='color_red'>*</b></label>
                                            <div id='sepcifixspanflex'>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown10
                                                        ref={dropdownRef1}
                                                        label="Customer Name"
                                                        options={cusList?.data?.user}
                                                        value={formData.customer_id}
                                                        onChange={handleChange}
                                                        name="customer_id"
                                                        defaultOption="Select Customer"
                                                        setcusData={setcusData}
                                                        type="vendor"
                                                        required
                                                    />
                                                </span>
                                                {!isCustomerSelect && <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                                                    {otherIcons.error_svg}
                                                    Please Select Customer</p>}
                                                {cusData &&
                                                    <div className="view_all_cus_deial_btn">
                                                        {viewAllCusDetails === true ?
                                                            <button type="button" onClick={() => setViewAllCusDetails(false)}
                                                                onKeyDown={(event) => {
                                                                    if (event.key === 'Enter') {
                                                                        setViewAllCusDetails(false)
                                                                    }
                                                                }}
                                                            >Hide customer information</button>
                                                            :
                                                            <button type="button" onClick={() => setViewAllCusDetails(true)}
                                                                onKeyDown={(event) => {
                                                                    if (event.key === 'Enter') {
                                                                        setViewAllCusDetails(true)
                                                                    }
                                                                }}
                                                            >View Customer Information</button>

                                                        }
                                                    </div>
                                                }
                                                {/* popup code */}




                                                {showPopup === "showAddress" && (
                                                    <div className="mainxpopups1" ref={popupRef1}>
                                                        <div className="popup-content" >
                                                            <span className="close-button" onClick={() => setShowPopup("")}><RxCross2 /></span>
                                                            <div className="midpopusec12x">
                                                                <div className=""
                                                                >
                                                                    {/* <p>Change Address</p> */}
                                                                    <div className='checkboxcontainer5s'>

                                                                        <div className="form_commonblock">
                                                                            <label >Address Type<b className='color_red'>*</b></label>
                                                                            <div className='checkboxcontainer5s'>

                                                                                <label>
                                                                                    <input type="checkbox" name='is_shipping' checked={udateAddress?.is_shipping === "1"} onChange={(e) => handleAllAddressChange(e, 'Shipping')} />
                                                                                    Shipping Address
                                                                                </label>

                                                                                <label>
                                                                                    <input type="checkbox" name='is_billing' checked={udateAddress?.is_billing === "1"} onChange={(e) => handleAllAddressChange(e, 'Billing')} />
                                                                                    Billing Address
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form_commonblock">
                                                                        <label >Street 1<b className='color_red'>*</b></label>
                                                                        <span >
                                                                            {otherIcons.tag_svg}
                                                                            <input type="text" value={udateAddress?.street_1}
                                                                                placeholder='Select street_1'
                                                                                onChange={(e) => handleAllAddressChange(e)} name='street_1'
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <div className="form_commonblock">
                                                                        <label >Street 2<b className='color_red'>*</b></label>
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
                                                                        <label >Phone Number<b className='color_red'>*</b></label>
                                                                        <span >
                                                                            {otherIcons.tag_svg}
                                                                            <input type="number" value={udateAddress.phone_no}
                                                                                placeholder='Enter Phone Number'
                                                                                onChange={(e) => handleAllAddressChange(e)}
                                                                                name='phone_no'
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <div className="form_commonblock">
                                                                        <label >Fax Number<b className='color_red'>*</b></label>
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
                                                                        <label >Zip Code<b className='color_red'>*</b></label>
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
                                                )}

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
                                                                    </svg> Customer Address
                                                                </div>


                                                                <div className="cust_dex1s2">
                                                                    {/* <label >Customer full Name :  {cusData?.first_name + " " + cusData?.last_name}</label> */}
                                                                    <div className="cust_dex1s2s1">
                                                                        {!addSelect?.billing ? "No billing address is found" : <>
                                                                            <p className='dex1s2schilds1'>Billing address <button type='button' onClick={() => setShowPopup("billing")}>show all</button></p>
                                                                            <button type='button' onClick={() => changeAddress(addSelect?.billing)}>Change Address</button>

                                                                            <p className='dex1s2schilds2'>Customer Name: {`${cusData?.first_name} ${cusData?.last_name}`} </p>

                                                                            <p>  Street1: {addSelect?.billing?.street_1}  </p>
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

                                                                            <p className='dex1s2schilds1'>Shipping address <button type='button' onClick={() => setShowPopup("shipping")}>show all</button></p>
                                                                            <button type='button' onClick={() => changeAddress(addSelect?.shipping)}>Change Address</button>
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
                                                        {viewAllCusDetails &&
                                                            <>
                                                                <div className="cus_moreDetails">
                                                                    <div className="cust_dex1s1">
                                                                        <Link to={`/dashboard/customer-details?id=${cusData?.id}`} target='_blank' className="childcusdexs12">
                                                                            <p>{cusData?.first_name + " " + cusData?.last_name}</p>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#0d54b8"} fill={"none"}>
                                                                                <path d="M11.1193 2.99756C6.55993 3.45035 2.99902 7.29809 2.99902 11.9777C2.99902 16.9619 7.03855 21.0024 12.0216 21.0024C16.7 21.0024 20.5468 17.4407 20.9996 12.8802" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M20.5581 3.49381L11.0488 13.059M20.5581 3.49381C20.064 2.99905 16.7356 3.04517 16.032 3.05518M20.5581 3.49381C21.0521 3.98857 21.0061 7.3215 20.9961 8.02611" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>



                                                                        </Link>
                                                                        <div className="childcusdexs13" onClick={() => setViewAllCusDetails(false)}>
                                                                            <RxCross2 />
                                                                        </div>


                                                                    </div>
                                                                    <div className="cusparentofnavbarx5s">
                                                                        <p className={` ${switchCusDatax1 === "Details" && 'selectedbtnx3'}`} onClick={() => setSwitchCusDatax1("Details")}>Details</p>
                                                                        <p className={` ${switchCusDatax1 === "Contact_person" && 'selectedbtnx3'}`} onClick={() => setSwitchCusDatax1("Contact_person")}>Contact person</p>
                                                                        <p className={` ${switchCusDatax1 === "Activity_log" && 'selectedbtnx3'}`} onClick={() => setSwitchCusDatax1("Activity_log")}>Activity log</p>
                                                                    </div>

                                                                    {switchCusDatax1 === "Details" &&
                                                                        <>

                                                                            <div className="cust_dex1s2">
                                                                                <div className="cus1xs1">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                                                        <path d="M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z" stroke="currentColor" strokeWidth="1.5" />
                                                                                        <path d="M4 20C2.89543 20 2 19.1046 2 18C2 16.8954 2.89543 16 4 16C5.10457 16 6 17.3333 6 18C6 18.6667 5.10457 20 4 20Z" stroke="currentColor" strokeWidth="1.5" />
                                                                                        <path d="M8 20C6.89543 20 6 18.5 6 18C6 17.5 6.89543 16 8 16C9.10457 16 10 16.8954 10 18C10 19.1046 9.10457 20 8 20Z" stroke="currentColor" strokeWidth="1.5" />
                                                                                        <path d="M13 20H16C18.8284 20 20.2426 20 21.1213 19.1213C22 18.2426 22 16.8284 22 14V13C22 10.1716 22 8.75736 21.1213 7.87868C20.48 7.23738 19.5534 7.06413 18 7.01732M10 7H16C16.7641 7 17.425 7 18 7.01732M18 7.01732C18 6.06917 18 5.5951 17.8425 5.22208C17.6399 4.7421 17.2579 4.36014 16.7779 4.15749C16.4049 4 15.9308 4 14.9827 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 7.22876 2 11V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                    </svg>
                                                                                    <div className='spanfistrc1s5'>
                                                                                        <p>Outstanding Receivables</p>
                                                                                        <h2>953</h2>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="cus1xs1">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                                                        <path d="M3.47022 4C3.35691 4.08553 3.24988 4.17937 3.14831 4.28231C2 5.44617 2 7.31938 2 11.0658V13.0526C2 16.7991 2 18.6723 3.14831 19.8361C4.29663 21 6.14481 21 9.84118 21H15.7221C17.8139 21 19.1166 21 20 20.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                        <path d="M18.8653 14.5C18.9521 14.2848 19.0001 14.0483 19.0001 13.8C19.0001 12.8059 18.2305 12 17.2813 12C17 12 16.7346 12.0707 16.5002 12.1961" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                        <path d="M18 7C18 6.07003 18 5.60504 17.8978 5.22354C17.6204 4.18827 16.8118 3.37962 15.7765 3.10222C15.395 3 14.93 3 14 3H10C9.05436 3 8.22726 3 7.50024 3.01847M11.2427 7H16C18.8285 7 20.2427 7 21.1214 7.87868C22 8.75736 22 10.1716 22 13V15C22 15.9959 22 16.8164 21.9617 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                        <path d="M2 2L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                    </svg>
                                                                                    <div className='spanfistrc1s5'>
                                                                                        <p>Unused Credits</p>
                                                                                        <h2>47</h2>
                                                                                    </div>
                                                                                </div>

                                                                            </div>



                                                                            <div className="cust_dex1s3">
                                                                                <div className="cusx1s2">
                                                                                    <div className="cuschildx1s2">Contact Details</div>
                                                                                    <div className="cuschichildlistd">
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Mobile number</p> <p className="px1s2">:</p> <p className="px1s3">+91-9764370162</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Work phone</p> <p className="px1s2">:</p> <p className="px1s3">9764370162</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">User creation date</p> <p className="px1s2">:</p> <p className="px1s3">23 April, 2024</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Designation</p> <p className="px1s2">:</p> <p className="px1s3">9764370162</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Department</p> <p className="px1s2">:</p> <p className="px1s3">9764370162</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Company name</p> <p className="px1s2">:</p> <p className="px1s3">XTYX</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Payment terms</p> <p className="px1s2">:</p> <p className="px1s3">Due to receipt</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Department</p> <p className="px1s2">:</p> <p className="px1s3">9764370162</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Department</p> <p className="px1s2">:</p> <p className="px1s3">9764370162</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Department</p> <p className="px1s2">:</p> <p className="px1s3">9764370162</p></div>
                                                                                        <div className='chilscx15s5sx1'> <p className="px1s1">Department</p> <p className="px1s2">:</p> <p className="px1s3">9764370162</p></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="cusx1s2">
                                                                                    <div className="cuschildx1s2">
                                                                                        Address <p>10Total</p>
                                                                                    </div>
                                                                                    <div className="cuschichildlistdx2">

                                                                                        <div className='chilscx15s5sx1'>
                                                                                            <div className="psxjks40s1"> Shipping Address </div>
                                                                                            <div className="psxjks40s2">
                                                                                                <div> Lucile <br /> 68868 Rohan Loop Apt. 752<br /> 896 O'Keefe Run Suite 534<br /> Rahsaanside<br />Utah 204-184<br />Tunisia </div>
                                                                                                <div> Phone: (468)-015-849 <br /> Fax Number: 772.927.0210 x0880 </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="breakerci"></div>
                                                                                        <div className='chilscx15s5sx1'>
                                                                                            <div className="psxjks40s1"> Shipping Address </div>
                                                                                            <div className="psxjks40s2">
                                                                                                <div> Lucile <br /> 68868 Rohan Loop Apt. 752<br /> 896 O'Keefe Run Suite 534<br /> Rahsaanside<br />Utah 204-184<br />Tunisia </div>
                                                                                                <div> Phone: (468)-015-849 <br /> Fax Number: 772.927.0210 x0880 </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="breakerci"></div>
                                                                                        <div className='chilscx15s5sx1'>
                                                                                            <div className="psxjks40s1"> Shipping Address </div>
                                                                                            <div className="psxjks40s2">
                                                                                                <div> Lucile <br /> 68868 Rohan Loop Apt. 752<br /> 896 O'Keefe Run Suite 534<br /> Rahsaanside<br />Utah 204-184<br />Tunisia </div>
                                                                                                <div> Phone: (468)-015-849 <br /> Fax Number: 772.927.0210 x0880 </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="breakerci"></div>
                                                                                        <div className='chilscx15s5sx1'>
                                                                                            <div className="psxjks40s1"> Shipping Address </div>
                                                                                            <div className="psxjks40s2">
                                                                                                <div> Lucile <br /> 68868 Rohan Loop Apt. 752<br /> 896 O'Keefe Run Suite 534<br /> Rahsaanside<br />Utah 204-184<br />Tunisia </div>
                                                                                                <div> Phone: (468)-015-849 <br /> Fax Number: 772.927.0210 x0880 </div>
                                                                                            </div>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </>
                                                                    }

                                                                    {switchCusDatax1 === "Contact_person" &&
                                                                        <>
                                                                            <div className="contactpersonosc1s4sd54f">
                                                                                <div className="fistchils45s">
                                                                                    <p className='cifs2x3s6z1'>FULL NAME</p>
                                                                                    <p className='cifs2x3s6z2'>MOBILE NUMBER</p>
                                                                                    <p className='cifs2x3s6z3'>WORK PHONE</p>
                                                                                    <p className='cifs2x3s6z4'>EMAIL</p>
                                                                                </div>
                                                                                <div className="cs546sx2w52">
                                                                                    <div className="tarowfistchils45s">
                                                                                        <p className='cifs2x3s6z1'>Mr. Customer</p>
                                                                                        <p className='cifs2x3s6z2'>+91-2301157890</p>
                                                                                        <p className='cifs2x3s6z3'>+91-2301157890</p>
                                                                                        <p className='cifs2x3s6z4'>sasa@gmail.com</p>
                                                                                    </div>
                                                                                    <div className="tarowfistchils45s">
                                                                                        <p className='cifs2x3s6z1'>Mr. Customer</p>
                                                                                        <p className='cifs2x3s6z2'>+91-2301157890</p>
                                                                                        <p className='cifs2x3s6z3'>+91-2301157890</p>
                                                                                        <p className='cifs2x3s6z4'>sasa@gmail.com</p>
                                                                                    </div>
                                                                                    <div className="tarowfistchils45s">
                                                                                        <p className='cifs2x3s6z1'>Mr. Customer</p>
                                                                                        <p className='cifs2x3s6z2'>+91-2301157890</p>
                                                                                        <p className='cifs2x3s6z3'>+91-2301157890</p>
                                                                                        <p className='cifs2x3s6z4'>sasa@gmail.com</p>
                                                                                    </div>
                                                                                    <div className="tarowfistchils45s">
                                                                                        <p className='cifs2x3s6z1'>Mr. Customer</p>
                                                                                        <p className='cifs2x3s6z2'>+91-2301157890</p>
                                                                                        <p className='cifs2x3s6z3'>+91-2301157890</p>
                                                                                        <p className='cifs2x3s6z4'>sasa@gmail.com</p>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {switchCusDatax1 === "Activity_log" &&
                                                                        <>
                                                                            <div className="activitylogxjks">
                                                                                <div className="childactivuytsd154">
                                                                                    <div className="datscxs445sde">April 27, 2024</div>
                                                                                    <div className="flexsd5fs6dx6w">
                                                                                        <div className="svgfiwithrolin">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                                                                <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                                <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                            </svg>
                                                                                        </div>
                                                                                        <p className='sdf623ptag'>09.45AM</p>
                                                                                        <div className="descxnopcs45s">
                                                                                            <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                                                            <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flexsd5fs6dx6w">
                                                                                        <div className="svgfiwithrolin">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                                                                <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                                <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                            </svg>
                                                                                        </div>
                                                                                        <p className='sdf623ptag'>09.45AM</p>
                                                                                        <div className="descxnopcs45s">
                                                                                            <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                                                            <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flexsd5fs6dx6w">
                                                                                        <div className="svgfiwithrolin">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                                                                <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                                <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                            </svg>
                                                                                        </div>
                                                                                        <p className='sdf623ptag'>09.45AM</p>
                                                                                        <div className="descxnopcs45s">
                                                                                            <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                                                            <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flexsd5fs6dx6w">
                                                                                        <div className="svgfiwithrolin">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                                                                <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                                <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                            </svg>
                                                                                        </div>
                                                                                        <p className='sdf623ptag'>09.45AM</p>
                                                                                        <div className="descxnopcs45s">
                                                                                            <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                                                            <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flexsd5fs6dx6w">
                                                                                        <div className="svgfiwithrolin">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                                                                <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                                <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                            </svg>
                                                                                        </div>
                                                                                        <p className='sdf623ptag'>09.45AM</p>
                                                                                        <div className="descxnopcs45s">
                                                                                            <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                                                            <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flexsd5fs6dx6w">
                                                                                        <div className="svgfiwithrolin">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#5c5c5c"} fill={"none"}>
                                                                                                <path d="M12.8809 7.01656L17.6538 8.28825M11.8578 10.8134L14.2442 11.4492M11.9765 17.9664L12.9311 18.2208C15.631 18.9401 16.981 19.2998 18.0445 18.6893C19.108 18.0787 19.4698 16.7363 20.1932 14.0516L21.2163 10.2548C21.9398 7.57005 22.3015 6.22768 21.6875 5.17016C21.0735 4.11264 19.7235 3.75295 17.0235 3.03358L16.0689 2.77924C13.369 2.05986 12.019 1.70018 10.9555 2.31074C9.89196 2.9213 9.53023 4.26367 8.80678 6.94841L7.78366 10.7452C7.0602 13.4299 6.69848 14.7723 7.3125 15.8298C7.92652 16.8874 9.27651 17.2471 11.9765 17.9664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                                <path d="M12 20.9463L11.0477 21.2056C8.35403 21.9391 7.00722 22.3059 5.94619 21.6833C4.88517 21.0608 4.52429 19.6921 3.80253 16.9547L2.78182 13.0834C2.06006 10.346 1.69918 8.97731 2.31177 7.89904C2.84167 6.96631 4 7.00027 5.5 7.00015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                                            </svg>
                                                                                        </div>
                                                                                        <p className='sdf623ptag'>09.45AM</p>
                                                                                        <div className="descxnopcs45s">
                                                                                            <div className="chislsdf465s"><p>Payment to be collected</p> <b>By Mr.Arman</b></div>
                                                                                            <p className='c99atags56d'>Lorem ipsum dolor sit amet consectetur. Enim dis sem pretium gravida enim nunc.</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </>
                                                        }

                                                    </div>

                                                </>
                                            }

                                        </div>


                                        <div className="f1wrapofcreqx1">

                                            <div className="form_commonblock">
                                                <label >Sales Order Date<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.transaction_date ? new Date(formData.transaction_date).toISOString().split('T')[0] : null}
                                                        onChange={handleDateChange}
                                                        name='transaction_date'

                                                        placeholderText="Enter Sale Order Date"
                                                        dateFormat="dd-MM-yyy"
                                                    />

                                                </span>
                                            </div>

                                            <div className="form_commonblock">
                                                <label >Sales Order<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.tag_svg}
                                                    <input type="text" value={formData.sale_order_id}
                                                        placeholder='Select Sale Order'
                                                        onChange={handleChange}
                                                        name='sale_order_id'
                                                    />

                                                </span>
                                            </div>


                                            <div className="form_commonblock">
                                                <CurrencySelect
                                                    value={formData?.currency}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form_commonblock">
                                                <label>Expected Shipment Date</label>
                                                <span>
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.shipment_date}
                                                        onChange={(date) => setFormData({ ...formData, shipment_date: date.toLocaleDateString() })}
                                                        name='shipment_date'

                                                        placeholderText="Enter Expiry Date"
                                                        dateFormat="dd-MM-yyy"
                                                        autoComplete='off'
                                                    />

                                                </span>
                                            </div>




                                            <div className="form_commonblock">
                                                <label >Place of Supply</label>
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
                                                <label >Reference</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.reference_no} onChange={handleChange}
                                                        // disabled

                                                        name='reference_no'
                                                        placeholder='Enter Reference Number' />
                                                </span>
                                            </div>

                                            {/* <div className="form_commonblock ">
                                            <label >Subject</label>
                                            <span >
                                                {otherIcons.placeofsupply_svg}
                                                <input type="text" value={formData.subject} onChange={handleChange}
                                                    // disabled
                                                    name='subject'
                                                    placeholder='Enter Subject' />
                                            </span>
                                        </div> */}

                                            <div className="form_commonblock">
                                                <label>Sales Person</label>
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
                                            <div className="form_commonblock">
                                                <label>Delivery Method</label>
                                                <span >
                                                    {otherIcons.vendor_svg}
                                                    <input
                                                        type="text"
                                                        value={formData.delivery_method}
                                                        name='delivery_method'
                                                        onChange={handleChange}
                                                        placeholder='Enter Delivery Method'
                                                    />
                                                </span>
                                            </div>
                                            <div className="form_commonblock">
                                                <label>Payment Terms</label>
                                                <span >
                                                    {otherIcons.vendor_svg}
                                                    <input
                                                        type="text"
                                                        value={formData.payment_terms}
                                                        name='payment_terms'
                                                        onChange={handleChange}
                                                        placeholder='Enter Payment Terms'
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
                                            note="customer"
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
                                            <button className={`firstbtnc46x5s firstbtnc2`} type="submit" onClick={() => handleButtonClicked('draft')} disabled={loading} name="saveAsDraft">
                                                Update
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                    <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>

                                            <button className={`firstbtnc1`} type="submit" onClick={() => handleButtonClicked('sent')} disabled={loading} name="saveAndSend"> Update and send
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                    <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </>
                                        :
                                        <>
                                            <button className={`firstbtnc46x5s firstbtnc2`} type="submit" onClick={() => handleButtonClicked('draft')} disabled={loading} name="saveAsDraft">
                                                Save as draft
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                    <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>

                                            <button className={`firstbtnc1`} type="submit" onClick={() => handleButtonClicked('sent')} disabled={loading} name="saveAndSend">Save and Send
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
                    </div>
                </div>
                <Toaster
                    // position="bottom-right"
                    reverseOrder={false} />
            </>}
        </>
    );
};


export default CreateSalesOrders



