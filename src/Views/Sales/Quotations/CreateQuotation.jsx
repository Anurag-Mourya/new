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
import Loader02 from '../../../Components/Loaders/Loader02'

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
import ViewCustomerDetails from './ViewCustomerDetails';
import CurrencySelect from '../../Helper/ComponentHelper/CurrencySelect';
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { isPartiallyInViewport } from '../../Helper/is_scroll_focus';
import { getCurrencyFormData } from '../../Helper/DateFormat';

const CreateQuotation = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const cusList = useSelector((state) => state?.customerList);
    const itemList = useSelector((state) => state?.itemList);
    const getCurrency = useSelector((state) => state?.getCurrency?.data);
    const addUpdate = useSelector((state) => state?.updateAddress);
    const quoteDetail = useSelector((state) => state?.quoteDetail);
    const quoteDetails = quoteDetail?.data?.data?.quotation;
    const [cusData, setcusData] = useState(null);
    const [switchCusDatax1, setSwitchCusDatax1] = useState("Details");
    const [itemData, setItemData] = useState({});
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit } = Object.fromEntries(params.entries());

    const [isCustomerSelect, setIsCustomerSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);

    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);


    const [formData, setFormData] = useState({
        sale_type: 'quotation',
        transaction_date: new Date(),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        quotation_id: 'QT-2024',
        customer_id: '',
        upload_image: null,
        customer_type: null,
        customer_name: null,
        phone: null,
        email: null,
        address: [{}],
        reference_no: "",
        subject: "",
        currency: getCurrencyFormData(),
        place_of_supply: '',
        expiry_date: "",
        sale_person: '',
        customer_note: null,
        terms_and_condition: null,
        fy: localStorage.getItem('FinancialYear') || 2024,
        subtotal: null,
        shipping_charge: null,
        adjustment_charge: null,
        total: null,
        status: '',
        discount: "",
        items: [
            {

                item_id: "",
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
        const newItems = [...formData?.items, {
            item_id: '',
            quantity: 1,
            gross_amount: null,
            rate: null,
            final_amount: null,
            tax_rate: null,
            tax_amount: 0,
            discount: 0,
            discount_type: 1,
            item_remark: null,
            tax_name: ""

        }];
        setFormData({ ...formData, items: newItems });
    };


    // edit and update quotations

    // console.log("edit", cusData)


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

        // Convert empty string to zero
        // if (newValue === '') {
        //     newValue = 0;
        // }


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
            address: addSelect ? JSON.stringify(addSelect) : null,
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

    const calculateTotalDiscount = (items) => {
        return items?.reduce((acc, item) => acc + (parseFloat(item.discount) || 0), 0);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        const item = newItems[index];
        let discountAmount = 0;
        let discountPercentage = 0;
        const totalDiscount = calculateTotalDiscount(newItems);
        if (field === 'discount_type') {
            newItems[index].discount = 0;
        }

        if (field === 'item_id') {
            const selectedItem = itemList?.data?.item.find(item => item.id === value);
            if (selectedItem) {
                newItems[index].rate = selectedItem.price;
                newItems[index].gross_amount = (+selectedItem.price) * (+item?.quantity)
                if (selectedItem.tax_preference === "1") {
                    newItems[index].tax_rate = selectedItem.tax_rate;
                    newItems[index].tax_name = "Taxable";
                } else {
                    newItems[index].tax_rate = "0";
                    newItems[index].tax_name = "Non-Taxable";
                }
            }
        }

        if (field === "quantity") {
            newItems[index].gross_amount = (+item.rate) * (+item?.quantity);
        }

        const grossAmount = item.rate * item.quantity;
        const taxAmount = (grossAmount * item.tax_rate) / 100;
        if (item.discount_type === 1) {
            discountAmount = Math.min(item.discount, grossAmount + taxAmount);
        } else if (item.discount_type === 2) {
            discountPercentage = Math.min(item.discount, 100);
        }

        const grossAmountPlTax = grossAmount + taxAmount;
        const discount = item.discount_type === 1 ? discountAmount : (grossAmountPlTax * discountPercentage) / 100;
        const finalAmount = grossAmount + taxAmount - discount;

        newItems[index].final_amount = finalAmount.toFixed(2); // Round to 2 decimal places

        const subtotal = newItems.reduce((acc, item) => acc + parseFloat(item.final_amount), 0);
        const total = subtotal + (parseFloat(formData.shipping_charge) || 0) + (parseFloat(formData.adjustment_charge) || 0);

        setFormData({
            ...formData,
            discount: totalDiscount,
            items: newItems,
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2)
        });
    };
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

    const Navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const buttonName = e.nativeEvent.submitter.name;
        // console.log("buttonName", buttonName)
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
                const updatedItems = formData?.items?.map((item) => {
                    const { tax_name, ...itemWithoutTaxName } = item;
                    return itemWithoutTaxName;
                });
                await dispatch(updateQuotation({ ...formData, items: updatedItems }, Navigate, "quotation", "Quotation", isEdit, buttonName));
                setLoading(false);
            } catch (error) {
                toast.error('Error updating quotation:', error);
                setLoading(false);
            }
        }

    };



    useEffect(() => {
        dispatch(itemLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(fetchCurrencies());

        if (itemId && isEdit) {
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
        if (itemId && isEdit && quoteDetails) {
            const itemsFromApi = quoteDetails.items?.map(item => ({
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
                id: quoteDetails.id,
                sale_type: 'quotation',
                transaction_date: quoteDetails.created_at,
                warehouse_id: quoteDetails.warehouse_id,
                quotation_id: quoteDetails.quotation_id,
                customer_id: (+quoteDetails.customer_id),
                upload_image: quoteDetails.upload_image,
                customer_type: quoteDetails.customer_type,
                customer_name: quoteDetails.customer_name,
                phone: quoteDetails.phone,
                email: quoteDetails.email,
                reference_no: quoteDetails.reference_no,
                subject: quoteDetails.subject,
                currency: quoteDetails.currency,
                place_of_supply: quoteDetails.customer?.place_of_supply,
                expiry_date: quoteDetails.expiry_date,
                sale_person: quoteDetails.sale_person,
                customer_note: quoteDetails.customer_note,
                terms_and_condition: quoteDetails.terms_and_condition,
                fy: quoteDetails.fy,
                subtotal: quoteDetails.subtotal,
                shipping_charge: quoteDetails.shipping_charge,
                adjustment_charge: quoteDetails.adjustment_charge,
                total: quoteDetails.total,
                status: quoteDetails.status,
                items: itemsFromApi || []
            });

            if (quoteDetails.upload_image) {
                setImgeLoader("success");
            }

            if (quoteDetails?.address) {
                const parsedAddress = JSON?.parse(quoteDetails?.address);
                const dataWithParsedAddress = {
                    ...quoteDetails,
                    address: parsedAddress
                };
                setAddSelect({
                    billing: dataWithParsedAddress?.address?.billing,
                    shipping: dataWithParsedAddress?.address?.shipping,
                });
                setcusData(dataWithParsedAddress?.customer)
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
    }, [quoteDetails, itemId, isEdit]);

    // console.log("formData", formData)
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            customer_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
            email: cusData?.email,
            phone: cusData?.mobile_no,
            address: addSelect,
            currency: cusData?.currency

        }));
    }, [cusData]);
    // console.log("fromdata", formData)
    return (
        <>
            {quoteDetail?.loading === true ? <Loader02 /> : <>
                <TopLoadbar />
                {loading && <MainScreenFreezeLoader />}
                {freezLoadingImg && <MainScreenFreezeLoader />}
                {addUpdate?.loading && <MainScreenFreezeLoader />}

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <svg id="fi_2625867" height="512" viewBox="0 0 60 60" width="512" xmlns="http://www.w3.org/2000/svg"><g fill="#346d92"><path d="m14 2.014v2.019a.994.994 0 0 1 -.87.99 9 9 0 0 0 -5.67 3 6 6 0 1 1 -6.46 5.977 13.041 13.041 0 0 1 11.9-13 1.011 1.011 0 0 1 1.1 1.014z"></path><path d="m30 2.014v2.019a.994.994 0 0 1 -.87.99 9 9 0 0 0 -5.67 3 6 6 0 1 1 -6.46 5.977 13.041 13.041 0 0 1 11.9-13 1.011 1.011 0 0 1 1.1 1.014z"></path><path d="m46 57.986v-2.019a.994.994 0 0 1 .87-.99 9 9 0 0 0 5.67-3 6 6 0 1 1 6.46-5.977 13.041 13.041 0 0 1 -11.9 13 1.011 1.011 0 0 1 -1.1-1.014z"></path><path d="m30 57.986v-2.019a.994.994 0 0 1 .87-.99 9 9 0 0 0 5.67-3 6 6 0 1 1 6.46-5.977 13.041 13.041 0 0 1 -11.9 13 1.011 1.011 0 0 1 -1.1-1.014z"></path></g><circle cx="19" cy="30" fill="#b9bfcc" r="3"></circle><circle cx="30" cy="30" fill="#b9bfcc" r="3"></circle><circle cx="41" cy="30" fill="#b9bfcc" r="3"></circle><path d="m59.707 28.293a1 1 0 0 0 -1.414 0l-1.293 1.293v-9.586a10.011 10.011 0 0 0 -10-10h-9a1 1 0 0 0 0 2h9a8.009 8.009 0 0 1 8 8v9.586l-1.293-1.293a1 1 0 0 0 -1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0 0-1.414z" fill="#ccd0da"></path><path d="m22 48h-9a8.009 8.009 0 0 1 -8-8v-9.586l1.293 1.293a1 1 0 1 0 1.414-1.414l-3-3a1 1 0 0 0 -1.414 0l-3 3a1 1 0 0 0 1.414 1.414l1.293-1.293v9.586a10.011 10.011 0 0 0 10 10h9a1 1 0 0 0 0-2z" fill="#ccd0da"></path></svg>

                                New Quotation
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
                                                            >View customer information</button>

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
                                                                            <label >Address type<b className='color_red'>*</b></label>
                                                                            <div className='checkboxcontainer5s'>

                                                                                <label>
                                                                                    <input type="checkbox" name='is_shipping' checked={udateAddress?.is_shipping === "1"} onChange={(e) => handleAllAddressChange(e, 'Shipping')} />
                                                                                    Shipping address
                                                                                </label>

                                                                                <label>
                                                                                    <input type="checkbox" name='is_billing' checked={udateAddress?.is_billing === "1"} onChange={(e) => handleAllAddressChange(e, 'Billing')} />
                                                                                    Billing address
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
                                                                        <label >Phone number<b className='color_red'>*</b></label>
                                                                        <span >
                                                                            {otherIcons.tag_svg}
                                                                            <input type="number" value={udateAddress.phone_no}
                                                                                placeholder='Select phone_no'
                                                                                onChange={(e) => handleAllAddressChange(e)}
                                                                                name='phone_no'
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <div className="form_commonblock">
                                                                        <label >Fax number<b className='color_red'>*</b></label>
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
                                                                    </svg> Customer address
                                                                </div>


                                                                <div className="cust_dex1s2">
                                                                    {/* <label >Customer full Name :  {cusData?.first_name + " " + cusData?.last_name}</label> */}
                                                                    <div className="cust_dex1s2s1">
                                                                        {!addSelect?.billing ? "No billing address is found" : <>
                                                                            <p className='dex1s2schilds1'>Billing address
                                                                                {isEdit && itemId ? "" :
                                                                                    < button type='button' onClick={() => setShowPopup("billing")}>show all</button>
                                                                                }

                                                                            </p>
                                                                            <button type='button' onClick={() => changeAddress(addSelect?.billing)}>Change Address</button>

                                                                            <div className="s45w5812cusphxs">
                                                                                <p className='dex1s2schilds2'>Customer Name: {`${cusData?.first_name} ${cusData?.last_name}`} </p>

                                                                                <p className='dex1s2schilds2'>  Street1: {addSelect?.billing?.street_1}  </p>
                                                                                <p className='dex1s2schilds2'>  Street 2: {addSelect?.billing?.street_2}  </p>
                                                                                <p className='dex1s2schilds2'>  Landmark: {addSelect?.billing?.landmark ? addSelect?.billing?.landmark : "No landmark"}  </p>
                                                                                <p className='dex1s2schilds2'>  Locality: {addSelect?.billing?.locality ? addSelect?.billing?.locality : "No locality"}  </p>
                                                                                <p className='dex1s2schilds2'>  House No: {addSelect?.billing?.house_no ? addSelect?.billing?.house_no : "No house_no"}  </p>
                                                                                <p className='dex1s2schilds2'>  Fax Number: {addSelect?.billing?.fax_no ? addSelect?.billing?.fax_no : "No fax_no"}  </p>
                                                                                <p className='dex1s2schilds2'>  Phone:  {addSelect?.billing?.phone_no ? addSelect?.billing?.phone_no : "No phone_no"}  </p>

                                                                            </div>
                                                                        </>}
                                                                    </div>
                                                                    <div className="seps23"></div>
                                                                    <div className="cust_dex1s2s1">
                                                                        {!addSelect?.shipping ? "No shipping address is found" : <>

                                                                            <p className='dex1s2schilds1'>Shipping address   {isEdit && itemId ? "" :
                                                                                < button type='button' onClick={() => setShowPopup("billing")}>show all</button>
                                                                            }</p>
                                                                            <button type='button' onClick={() => changeAddress(addSelect?.shipping)}>Change Address</button>
                                                                            <p className='dex1s2schilds2'>Customer Name: {`${cusData?.first_name} ${cusData?.last_name}`} </p>
                                                                            <p className='dex1s2schilds2'>  Street1: {addSelect?.shipping?.street_1}  </p>
                                                                            <p className='dex1s2schilds2'>  Street 2: {addSelect?.shipping?.street_2}  </p>
                                                                            <p className='dex1s2schilds2'>  Landmark: {addSelect?.shipping?.landmark ? addSelect?.shipping?.landmark : "No landmark"}  </p>
                                                                            <p className='dex1s2schilds2'>  Locality: {addSelect?.shipping?.locality ? addSelect?.shipping?.locality : "No locality"}  </p>
                                                                            <p className='dex1s2schilds2'>  House No: {addSelect?.shipping?.house_no ? addSelect?.shipping?.house_no : "No house_no"}  </p>
                                                                            <p className='dex1s2schilds2'>  Fax Number: {addSelect?.shipping?.fax_no ? addSelect?.shipping?.fax_no : "No fax_no"}  </p>
                                                                            <p className='dex1s2schilds2'>  Phone:  {addSelect?.shipping?.phone_no ? addSelect?.shipping?.phone_no : "No phone_no"}  </p>
                                                                        </>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }


                                                    </div>

                                                    <ViewCustomerDetails
                                                        setSwitchCusDatax1={setSwitchCusDatax1} setViewAllCusDetails={setViewAllCusDetails}
                                                        cusData={cusData}
                                                        addSelect={addSelect}
                                                        viewAllCusDetails={viewAllCusDetails}
                                                        switchCusDatax1={switchCusDatax1} />

                                                </>
                                            }

                                        </div>


                                        <div className="f1wrapofcreqx1">

                                            <div className="form_commonblock">
                                                <label >Quotation Date<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.date_svg}
                                                    <DatePicker selected={formData.transaction_date} onChange={handleDateChange} name='transaction_date' placeholderText="Enter Quotation Date" dateFormat="dd-MM-yyy" />

                                                </span>
                                            </div>

                                            <div className="form_commonblock">
                                                <label >Quotation ID<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.tag_svg}
                                                    <input type="text" value={formData.quotation_id}
                                                        placeholder='Select quotation date'
                                                        onChange={handleChange}
                                                        name='quotation_id'
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
                                                <label>Expiry Date</label>
                                                <span>
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.expiry_date}
                                                        onChange={(date) => setFormData({ ...formData, expiry_date: date })}
                                                        name='expiry_date'

                                                        placeholderText="Enter Expiry Date"
                                                        dateFormat="dd-MM-yyy"
                                                        autoComplete='off'
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
                                                <label >Reference</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.reference_no} onChange={handleChange}
                                                        // disabled

                                                        name='reference_no'
                                                        placeholder='Enter Reference Number' />
                                                </span>
                                            </div>

                                            <div className="form_commonblock ">
                                                <label >Subject</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.subject} onChange={handleChange}
                                                        // disabled
                                                        name='subject'
                                                        placeholder='Enter Subject' />
                                                </span>
                                            </div>

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

                                    <Link to={"/dashboard/quotation"} className="firstbtnc2">
                                        Cancel
                                    </Link>
                                </div>

                            </div>
                        </DisableEnterSubmitForm>
                    </div>
                </div >
                <Toaster
                    // position="bottom-right"
                    reverseOrder={false} />
            </>}
        </>
    );
};

export default CreateQuotation;
