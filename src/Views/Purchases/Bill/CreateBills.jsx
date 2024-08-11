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
import { accountLists, vendorsLists } from '../../../Redux/Actions/listApisActions';
import DatePicker from "react-datepicker";

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { GoPlus } from 'react-icons/go';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import { fetchCurrencies } from '../../../Redux/Actions/globalActions';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { imageDB } from '../../../Configs/Firebase/firebaseConfig';
import { OverflowHideBOdy } from '../../../Utils/OverflowHideBOdy';
import { BsEye } from 'react-icons/bs';
import CustomDropdown14 from '../../../Components/CustomDropdown/CustomDropdown14';
// import DeleveryAddress from './DeleveryAddress';
import DeleveryAddress from '../../Sales/PurchaseOrder/DeleveryAddress';
import ViewVendorsDetails from '../../Sales/PurchaseOrder/ViewVendorsDetails';
import { SlReload } from 'react-icons/sl';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import { createPurchases, purchasesDetails } from '../../../Redux/Actions/purchasesActions';
import toast, { Toaster } from 'react-hot-toast';
import { billDetails } from '../../../Redux/Actions/billActions';
import Loader02 from '../../../Components/Loaders/Loader02';
import { getCurrencyFormData, todayDate } from '../../Helper/DateFormat';
import CurrencySelect from '../../Helper/ComponentHelper/CurrencySelect';
import MastersSelect from '../../Helper/ComponentHelper/MastersSelect';
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { isPartiallyInViewport } from '../../Helper/is_scroll_focus';
import { GRNdetailsActions } from '../../../Redux/Actions/grnActions';


const CreateBills = () => {

    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const cusList = useSelector((state) => state?.customerList);
    const vendorList = useSelector((state) => state?.vendorList);
    const itemList = useSelector((state) => state?.itemList);
    const getCurrency = useSelector((state) => state?.getCurrency?.data);
    const [cusData, setcusData] = useState(null);
    const [switchCusDatax1, setSwitchCusDatax1] = useState("Details");
    const [itemData, setItemData] = useState({});
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
    const accountList = useSelector((state) => state?.accountList);
    const createPurchse = useSelector(state => state?.createPurchase);
    const billDetailss = useSelector((state) => state?.billDetail);
    const billDetail = billDetailss?.data?.bill;

    const purchase = useSelector(state => state?.detailsPurchase);
    const purchases = purchase?.data?.purchaseOrder;

    const GRNdetails = useSelector(state => state?.GRNdetails);
    const GRNdetail = GRNdetails?.data?.bgrnill;

    const [fetchDetails, setFetchDetails] = useState(null);

    const [isVendorSelect, setIsVendorSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, convert, dublicate: isDublicate } = Object.fromEntries(params.entries());



    useEffect(() => {
        if (itemId && isEdit || itemId && isDublicate) {
            setFetchDetails(billDetail);
        } else if (itemId && (convert === "purchase_to_bill")) {
            setFetchDetails(purchases);
        } else if (itemId && (convert === "grn_to_bill")) {
            setFetchDetails(GRNdetail);
        }
    }, [itemId, isEdit, convert, isDublicate, GRNdetail, purchases]);


    const [formData, setFormData] = useState({
        id: 0,
        purchase_type: "bills",
        bill_no: "BN-1315",
        transaction_date: todayDate(),  // bill date
        currency: getCurrencyFormData(),
        expiry_date: "", // due date
        vendor_id: "",
        fy: localStorage.getItem('FinancialYear') || 2024,
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        vendor_name: "",
        phone: "",
        email: "",
        terms_and_condition: "",
        vendor_note: "",
        subtotal: null,
        discount: null,
        shipping_charge: null,
        adjustment_charge: null,
        total: null,
        reference_no: "",
        reference: null,
        place_of_supply: null,
        source_of_supply: null,
        shipment_date: null,
        order_no: null,
        payment_terms: "1",
        customer_notes: null,
        upload_image: null,
        status: null,
        discount: null,
        items: [
            {
                id: 0,
                item_id: null,
                quantity: 1,
                gross_amount: null,
                rate: null,
                final_amount: null,
                tax_rate: null,
                tax_amount: null,
                discount: null,
                discount_type: 1,
                item_remark: null
            },

        ]
    }
    );
    useEffect(() => {
        if ((itemId && isEdit && fetchDetails) || (itemId && isDublicate && fetchDetails) || itemId && (convert === "toInvoice" || convert === "toSale" || convert === "saleToInvoice" || convert === "purchase_to_bill" || convert === "grn_to_bill")) {

            const itemsFromApi = fetchDetails?.items?.map(item => ({
                item_id: (+item?.item_id),
                quantity: convert === "grn_to_bill" ? (+item?.gr_qty) : (+item?.quantity),
                gross_amount: (+item?.gross_amount),
                rate: (+item?.rate),
                final_amount: (+item?.final_amount),
                tax_rate: (+item?.tax_rate),
                tax_amount: (+item?.tax_amount),
                discount: (+item?.discount),
                discount_type: convert === "grn_to_bill" ? 1 : (+item?.discount_type),
                item_remark: item?.item_remark,
                tax_name: item?.item?.tax_preference === "1" ? "Taxable" : "Non-Taxable",

            }));

            setFormData({
                ...formData,
                id: isEdit ? fetchDetails?.id : 0,
                purchase_type: "bills",
                bill_no: fetchDetails?.bill_no || "BN-1315",
                transaction_date: fetchDetails?.transaction_date,
                currency: fetchDetails?.currency,
                expiry_date: fetchDetails?.expiry_date,
                vendor_id: (+fetchDetails?.vendor_id),
                vendor_name: fetchDetails?.vendor_name,
                phone: fetchDetails?.phone,
                email: fetchDetails?.email,
                terms_and_condition: fetchDetails?.terms_and_condition,
                vendor_note: fetchDetails?.vendor_note,
                subtotal: fetchDetails?.subtotal,
                discount: fetchDetails?.discount,
                shipping_charge: fetchDetails?.shipping_charge,
                adjustment_charge: fetchDetails?.adjustment_charge,
                total: fetchDetails?.total,
                reference_no: convert ? fetchDetails?.reference : fetchDetails?.reference_no,
                is_grn_convert: convert === "grn_to_bill" ? (1) : (0),
                // reference: fetchDetails?.reference,
                place_of_supply: fetchDetails?.place_of_supply,
                source_of_supply: fetchDetails?.source_of_supply,
                shipment_date: fetchDetails?.shipment_date,
                order_no: fetchDetails?.order_no,
                payment_terms: fetchDetails?.payment_terms,
                customer_notes: fetchDetails?.customer_notes,
                upload_image: fetchDetails?.upload_image,
                status: fetchDetails?.status,
                items: itemsFromApi || []
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

                setAddSelect({
                    billing: dataWithParsedAddress?.address?.billing,
                    shipping: dataWithParsedAddress?.address?.shipping,
                });

                setcusData(dataWithParsedAddress?.customer);
            }

            if (fetchDetails?.vendor_id) {
                setIsVendorSelect(true);
            }
            if (!fetchDetails?.items) {
                setIsItemSelect(false);
            } else {
                setIsItemSelect(true);
            }
        }
    }, [fetchDetails, itemId, isEdit, convert, isDublicate]);

    const [loading, setLoading] = useState(false);

    const handleItemAdd = () => {
        const newItems = [...formData?.items, {
            item_id: '',
            quantity: 1,
            rate: null,
            gross_amount: null,
            final_amount: null,
            tax_rate: null,
            tax_amount: 0,
            discount: 0,
            discount_type: 1,
            item_remark: null,
        }];
        setFormData({ ...formData, items: newItems });
    };

    // for address select
    const [addSelect, setAddSelect] = useState({
        billing: "",
        shipping: ""
    })

    // console.log("addSelect", addSelect)
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



        const selectedItem = vendorList?.data?.user?.find(cus => cus.id == value);
        if (name === "vendor_id") {
            // console.log("selectedItem", selectedItem)

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
            total: calculateTotal(formData.subtotal, newValue, formData.adjustment_charge),
            currency: name === "currency" ? value : selectedItem?.currency,

        });

    };

    const popupRef = useRef(null);

    //show all addresses popup....
    const popupRef1 = useRef(null);
    const [showPopup, setShowPopup] = useState("");
    const showAllAddress = (val) => {
        setShowPopup(val);
    }
    //show all addresses....





    const handleShippingChargeChange = (e) => {
        const shippingCharge = e.target.value;
        const total = parseFloat(formData.subtotal) + parseFloat(shippingCharge) + parseFloat(formData.adjustment_charge || 0);
        setFormData({ ...formData, shipping_charge: shippingCharge, total: total.toFixed(2) });
    };

    const handleAdjustmentChargeChange = (e) => {
        const adjustmentCharge = e.target.value;
        const total = parseFloat(formData.subtotal) + parseFloat(formData.shipping_charge || 0) + parseFloat(adjustmentCharge);
        setFormData({ ...formData, adjustment_charge: adjustmentCharge, total: total.toFixed(2) });
    };

    const calculateTotalDiscount = (items) => {
        return items?.reduce((acc, item) => acc + (parseFloat(item.discount) || 0), 0);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData?.items];
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

    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

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
            setLoading(true);
            try {
                const allAddress = JSON.stringify(addSelect)
                await dispatch(createPurchases(formData, Navigate, "bills", isEdit, buttonName, itemId, convert));
                setLoading(false);
            } catch (error) {
                toast.error('Error updating quotation:', error);
                setLoading(false);
            }
        }

    };

    // console.log("convert", convert)
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            customer_type: cusData?.customer_type,
            vendor_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
            email: cusData?.email,
            phone: cusData?.mobile_no,
            address: cusData?.address.length,
        }));
    }, [cusData]);

    useEffect(() => {
        dispatch(customersList({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(vendorsLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(fetchCurrencies());
        dispatch(accountLists());

        if (itemId && convert) {
            dispatch(purchasesDetails({ id: itemId }));
            dispatch(GRNdetailsActions({ id: itemId }));
        } else {
            dispatch(billDetails({ id: itemId }));
        }

    }, [dispatch]);



    // dropdown of discount
    // const [showDropdownx1, setShowDropdownx1] = useState(false);
    const dropdownRef = useRef(null);



    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);
            // setShowDropdownx1(false);
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



    return (
        <>
            <Toaster />
            <TopLoadbar />
            {billDetailss?.loading || billDetailss?.loading ? <Loader02 /> : <>
                {loading && <MainScreenFreezeLoader />}
                {freezLoadingImg && <MainScreenFreezeLoader />}

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <svg id="fi_10552479" height="512" viewBox="0 0 60 60" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m9 39v18.2c0 .84.97 1.3 1.62.78l2.76-2.2c.36-.29.88-.29 1.24 0l3.76 3c.36.29.88.29 1.24 0l3.76-3c.36-.29.88-.29 1.24 0l3.76 3c.36.29.88.29 1.24 0l3.76-3c.36-.29.88-.29 1.24 0l3.76 3c.36.29.88.29 1.24 0l3.76-3c.36-.29.88-.29 1.24 0l2.76 2.2c.65.52 1.62.06 1.62-.78v-52.2c0-2.21-1.79-4-4-4h-40z" fill="#f9eab0"></path><path d="m5 1c2.208 0 4 1.792 4 4v34h-6c-1.104 0-2-.896-2-2v-32c0-2.208 1.792-4 4-4z" fill="#f3d55b"></path><g fill="#3f5c6c"><path d="m35 11h-20c-.553 0-1-.448-1-1s.447-1 1-1h20c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m35 17h-20c-.553 0-1-.448-1-1s.447-1 1-1h20c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m35 23h-9c-.553 0-1-.448-1-1s.447-1 1-1h9c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m22 23h-7c-.553 0-1-.448-1-1s.447-1 1-1h7c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m40 29h-25c-.553 0-1-.448-1-1s.447-1 1-1h25c.553 0 1 .448 1 1s-.447 1-1 1z"></path></g><path d="m40 40c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2c0 .552.447 1 1 1s1-.448 1-1c0-1.858-1.279-3.411-3-3.858v-.142c0-.552-.447-1-1-1s-1 .448-1 1v.142c-1.721.447-3 2-3 3.858 0 2.206 1.794 4 4 4 1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2c0-.552-.447-1-1-1s-1 .448-1 1c0 1.858 1.279 3.411 3 3.858v.142c0 .552.447 1 1 1s1-.448 1-1v-.142c1.721-.447 3-2 3-3.858 0-2.206-1.794-4-4-4z" fill="#24ae5f"></path><path d="m30 35h-15c-.553 0-1-.448-1-1s.447-1 1-1h15c.553 0 1 .448 1 1s-.447 1-1 1z" fill="#3f5c6c"></path><path d="m30 41h-15c-.553 0-1-.448-1-1s.447-1 1-1h15c.553 0 1 .448 1 1s-.447 1-1 1z" fill="#3f5c6c"></path><path d="m30 47h-15c-.553 0-1-.448-1-1s.447-1 1-1h15c.553 0 1 .448 1 1s-.447 1-1 1z" fill="#3f5c6c"></path><circle cx="49" cy="16" fill="#24ae5f" r="10"></circle><path d="m47 22c-.265 0-.519-.105-.707-.293l-3-3c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0l2.199 2.199 6.305-8.105c.34-.435.967-.514 1.403-.176.436.339.515.968.175 1.403l-7 9c-.176.227-.44.367-.727.384-.021.001-.042.002-.062.002z" fill="#ecf0f1"></path></svg>
                                New Bill
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
                                            <label >Vendor Name <b className='color_red'>*</b></label>
                                            <div id='sepcifixspanflex'>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown10
                                                        ref={dropdownRef1}
                                                        label="Select vendor"
                                                        options={vendorList?.data?.user?.filter((val => val?.active === "1"))}
                                                        value={formData?.vendor_id}
                                                        onChange={handleChange}
                                                        name="vendor_id"
                                                        defaultOption="Select Vendor Name"
                                                        setcusData={setcusData}
                                                        type="vendor"
                                                    />
                                                </span>
                                                {!isVendorSelect && <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                                                    {otherIcons.error_svg}
                                                    Please Select Vendor</p>}
                                                {cusData &&
                                                    <div className="view_all_cus_deial_btn">
                                                        {viewAllCusDetails === true ?
                                                            <button type="button" onClick={() => setViewAllCusDetails(false)}>Hide Vendor Information</button>
                                                            :
                                                            <button type="button" onClick={() => setViewAllCusDetails(true)}>View Vendor Information</button>

                                                        }
                                                    </div>
                                                }
                                                {/* popup code */}
                                                {/* {showPopup === "billing" && (
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

                                                } */}

                                                {/* popup code */}
                                            </div>


                                            {!cusData ? "" :
                                                <>
                                                    {/* <div className="showCustomerDetails">
                                                        {!viewAllCusDetails &&
                                                            <div className="cus_fewDetails">
                                                                <div className="cust_dex1s1">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#0d54b8"} fill={"none"}>
                                                                        <path d="M14.5 9C14.5 10.3807 13.3807 11.5 12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9Z" stroke="currentColor" strokeWidth="1.5" />
                                                                        <path d="M18.2222 17C19.6167 18.9885 20.2838 20.0475 19.8865 20.8999C19.8466 20.9854 19.7999 21.0679 19.7469 21.1467C19.1724 22 17.6875 22 14.7178 22H9.28223C6.31251 22 4.82765 22 4.25311 21.1467C4.20005 21.0679 4.15339 20.9854 4.11355 20.8999C3.71619 20.0475 4.38326 18.9885 5.77778 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M13.2574 17.4936C12.9201 17.8184 12.4693 18 12.0002 18C11.531 18 11.0802 17.8184 10.7429 17.4936C7.6543 14.5008 3.51519 11.1575 5.53371 6.30373C6.6251 3.67932 9.24494 2 12.0002 2C14.7554 2 17.3752 3.67933 18.4666 6.30373C20.4826 11.1514 16.3536 14.5111 13.2574 17.4936Z" stroke="currentColor" strokeWidth="1.5" />
                                                                    </svg> Delevery address
                                                                </div>


                                                                <div className="cust_dex1s2">

                                                                    <div className="cust_dex1s2s1">
                                                                        {!addSelect?.billing ? "No billing address is found" : <>
                                                                            <p className='dex1s2schilds1'>Billing address <button type='button' onClick={() => showAllAddress("billing")}>show all</button></p>

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

                                                                            <p className='dex1s2schilds1'>Shipping address <button type='button' onClick={() => showAllAddress("shipping")}>show all</button></p>
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

                                                    </div> */}
                                                    <ViewVendorsDetails
                                                        setSwitchCusDatax1={setSwitchCusDatax1}
                                                        setViewAllCusDetails={setViewAllCusDetails}
                                                        cusData={cusData}
                                                        addSelect={addSelect}
                                                        viewAllCusDetails={viewAllCusDetails}
                                                        switchCusDatax1={switchCusDatax1} />
                                                </>
                                            }

                                            {/* <DeleveryAddress /> */}

                                        </div>


                                        <div className="f1wrapofcreqx1">
                                            <div className="form_commonblock">
                                                <label>Bill</label>
                                                <span >
                                                    {otherIcons.tag_svg}
                                                    <input type="text" value={formData.bill_no}
                                                        placeholder='Enter Bill Number'
                                                        onChange={handleChange}
                                                        name='bill_no'
                                                        autoComplete='off'
                                                    />

                                                </span>
                                            </div>

                                            <div className="form_commonblock">
                                                <label >Bill Date </label>
                                                <span>
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.transaction_date}
                                                        onChange={(date) => setFormData({ ...formData, transaction_date: date })}
                                                        name='transaction_date'

                                                        placeholderText="Enter Bill Date"
                                                        autoComplete='off'
                                                        dateFormat="dd-MM-yyy"
                                                    />
                                                </span>
                                            </div>

                                            <div className="form_commonblock">

                                                <CurrencySelect
                                                    options={getCurrency?.currency}
                                                    value={formData?.currency}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            {/* <div className="form_commonblock">
                                                <label className='color_red'>Source of Supply<b >*</b></label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <CustomDropdown12
                                                        label="Source of supply"
                                                        options={getCurrency?.source_of_supply}
                                                        value={formData?.source_of_supply}
                                                        onChange={handleChange}
                                                        name="source_of_supply"
                                                        defaultOption="Select Source of supply"
                                                    />
                                                </span>
                                            </div> */}
                                            <div className="form_commonblock">

                                                <label >Reference Number</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input
                                                        type="text"
                                                        value={formData.reference_no}
                                                        onChange={handleChange}
                                                        name='reference_no'
                                                        autoComplete='off'
                                                        placeholder='Enter Reference Number'
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
                                                        autoComplete='off'
                                                        placeholder='Enter Place Of Supply'
                                                    />
                                                </span>
                                            </div>

                                            <div className="form_commonblock ">
                                                <label >Order Number</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.order_no} onChange={handleChange}
                                                        // disabled
                                                        name='order_no'
                                                        placeholder='Enter Order Number'
                                                        autoComplete='off'
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
                                                <label >Due Date</label>
                                                <span >
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.expiry_date}
                                                        onChange={(date) => setFormData({ ...formData, expiry_date: date })}
                                                        name='expiry_date'
                                                        placeholderText="Enter Due Date"
                                                        autoComplete='off'
                                                        dateFormat="dd-MM-yyy"
                                                    />
                                                </span>
                                            </div>

                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                    {/* </div> */}

                                    <div className="" style={{ padding: 0 }}>
                                        <ItemSelect
                                            formData={formData}
                                            setFormData={setFormData}
                                            handleChange={handleChange}
                                            setIsItemSelect={setIsItemSelect}
                                            isItemSelect={isItemSelect}
                                            extracssclassforscjkls={"extracssclassforscjkls"}
                                            dropdownRef2={dropdownRef2}
                                        />


                                        <div className='secondtotalsections485s sxfc546sdfr85234e' >
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

                                                <button className={`firstbtnc1`} type="submit" disabled={loading} name="saveAndOpen"> Update and Open
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

                                                <button className={`firstbtnc1`} type="submit" disabled={loading} name="saveAndOpen">Save and Open
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                        <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </>
                                        }

                                        <Link to={"/dashboard/bills"} className="firstbtnc2">
                                            Cancel
                                        </Link>

                                    </div>
                                </div>



                            </div>
                        </DisableEnterSubmitForm>
                    </div >
                </div >
            </>
            }
        </>
    );
};

export default CreateBills;
