import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { customersList } from '../../Redux/Actions/customerActions';
import CustomDropdown10 from '../../Components/CustomDropdown/CustomDropdown10';
import { purchseOrdersLists, vendorsLists } from '../../Redux/Actions/listApisActions';
import DatePicker from "react-datepicker";
import { otherIcons } from '../Helper/SVGIcons/ItemsIcons/Icons';
import MainScreenFreezeLoader from '../../Components/Loaders/MainScreenFreezeLoader';
import { updateAddresses } from '../../Redux/Actions/globalActions';
import { OverflowHideBOdy } from '../../Utils/OverflowHideBOdy';
import CustomDropdown14 from '../../Components/CustomDropdown/CustomDropdown14';
import DeleveryAddress from '../Sales/PurchaseOrder/DeleveryAddress';
import ViewVendorsDetails from '../Sales/PurchaseOrder/ViewVendorsDetails';

import toast, { Toaster } from 'react-hot-toast';
import { createPurchases, purchasesDetails } from '../../Redux/Actions/purchasesActions';
import Loader02 from '../../Components/Loaders/Loader02';
import useOutsideClick from '../Helper/PopupData';
import { handleKeyPress } from '../Helper/KeyPressInstance';
import { formatDate, todayDate } from '../Helper/DateFormat';
import NumericInput from '../Helper/NumericInput';
import CurrencySelect from '../Helper/ComponentHelper/CurrencySelect';
import MastersSelect from '../Helper/ComponentHelper/MastersSelect';
import ItemSelect, { ItemSelectGRM } from '../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../Helper/ComponentHelper/ImageUpload';
import { isPartiallyInViewport } from '../Helper/is_scroll_focus';
import CustomDropdown04 from '../../Components/CustomDropdown/CustomDropdown04';
import CustomDropdown22 from '../../Components/CustomDropdown/CustomDropdown22';
import { GRNcreateActions, GRNdetailsActions } from '../../Redux/Actions/grnActions';
import { withPurchaseOrder } from '../Helper/ComponentHelper/DropdownData';
import { GRNype } from '../Helper/ComponentHelper/DropdownData';




const CreateGRN = () => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const cusList = useSelector((state) => state?.customerList);
    const vendorList = useSelector((state) => state?.vendorList);
    const itemList = useSelector((state) => state?.itemList);
    const vendorAddress = useSelector((state) => state?.updateAddress);
    const addressVendor = vendorAddress?.data?.address;
    const [cusData, setcusData] = useState(null);
    // const createPurchases = useSelector(state => state?.createPurchase);
    const purchseList = useSelector((state) => state?.purchseList);
    const detailsPurchase = useSelector((state) => state?.detailsPurchase);
    const GRNcreates = useSelector((state) => state?.GRNcreate);

    // console.log("GRNcreates", GRNcreates);

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, dublicate: isDublicate } = Object.fromEntries(params.entries());


    const [isVendorSelect, setIsVendorSelect] = useState(false);
    const [isItemSelect, setIsItemSelect] = useState(false);

    const GRNdetails = useSelector(state => state?.GRNdetails);
    const GRNdetail = GRNdetails?.data?.bgrnill;



    const [formData, setFormData] = useState({
        id: 0,
        grn_type: "Import",
        grn_no: "GRN-1315",
        transaction_date: todayDate(), // GRN date
        reference: null,
        vendor_id: null,
        is_purchase_order: 1, // 0 no and 1 yes
        purchase_order_id: null,
        fy: localStorage.getItem('FinancialYear'),
        vendor_name: "",
        phone: "",
        email: "",
        subtotal: null,
        discount: null,
        shipping_charge: null,
        adjustment_charge: null,
        total_grn_charges: null,
        total: null,
        upload_image: null,
        status: null,
        terms_and_condition: "",
        vendor_note: "",

        items: [
            {
                id: 0,
                item_id: null,
                po_qty: null,
                gr_qty: null,
                rate: null,
                charges_weight: null,
                custom_duty: null,
                gross_amount: 0,
                final_amount: null,
                tax_rate: null,
                tax_amount: null,
                discount: null,
                discount_type: null,
                item_remark: null, // Discrepency Notes
                upload_image: [] // Attachments
            },

        ],

        charges_type: [
            {
                account_id: null,
                amount: null,
                remarks: null,
                vendor_id: null,
                upload_image: []// Attachment
            },
        ]


    });


    useEffect(() => {
        if (itemId && isEdit && GRNdetail || (itemId && isDublicate && GRNdetail)) {
            const itemsFromApi = GRNdetail?.items?.map(item => ({
                item_id: (+item?.item_id),
                po_qty: (+item?.po_qty),
                gr_qty: (+item?.gr_qty),
                rate: (+item?.rate),
                charges_weight: (+item?.charges_weight),
                custom_duty: (+item?.custom_duty),
                gross_amount: (+item?.gross_amount),
                final_amount: item?.final_amount,
                tax_rate: (+item?.tax_rate),
                tax_amount: (+item?.tax_amount),
                item_remark: item?.item_remark,
                upload_image: JSON.parse(item?.upload_image)
            }));
            const chargesFromApi = GRNdetail.charges?.map(charge => ({
                account_id: (+charge?.account_id),
                amount: (+charge?.amount),
                remarks: charge?.remarks,
                vendor_id: (+charge?.vendor_id),
                upload_image: JSON.parse(charge?.upload_image)
            }));

            setFormData({
                id: isEdit ? GRNdetail?.id : 0,
                grn_type: GRNdetail?.grn_type,
                total_grn_charges: GRNdetail?.total_grn_charges,
                grn_no: GRNdetail?.grn_no,
                transaction_date: GRNdetail?.transaction_date, // GRN date
                reference: GRNdetail?.reference,
                vendor_id: (+GRNdetail?.vendor_id),
                is_purchase_order: (+GRNdetail?.is_purchase_order), // 0 no and 1 yes
                purchase_order_id: (+GRNdetail?.purchase_order_id),
                fy: GRNdetail?.fy,
                vendor_name: GRNdetail?.vendor_name,
                phone: GRNdetail?.phone,
                email: GRNdetail?.email,
                subtotal: (+GRNdetail?.subtotal),
                shipping_charge: (+GRNdetail?.shipping_charge),
                adjustment_charge: (+GRNdetail?.adjustment_charge),
                total: (+GRNdetail?.total),
                upload_image: GRNdetail?.upload_image,
                status: GRNdetail?.status,
                terms_and_condition: GRNdetail?.terms_and_condition,
                vendor_note: GRNdetail?.vendor_note,
                items: itemsFromApi || [],
                charges_type: chargesFromApi || []
            });

            if (GRNdetail?.upload_image != 0) {
                setImgeLoader("success");
            }

            if (GRNdetail.vendor_id) {
                setIsVendorSelect(true);
            }

            if (!GRNdetail.items) {
                setIsItemSelect(false);
            } else {
                setIsItemSelect(true);
            }

        }
    }, [GRNdetail, itemId, isEdit, isDublicate]);


    //set purchase order data of items in items list row
    const [detail_api_data, setDetail_api_data] = useState([]);
    useEffect(() => {
        if (cusData) {
            dispatch(purchasesDetails({ id: cusData?.id }, setDetail_api_data));
        }
    }, [cusData, dispatch]);

    console.log("purchasedata", detail_api_data?.items)
    useEffect(() => {
        if (detail_api_data?.items) {
            const itemsFromApi = detail_api_data?.items?.map(item => ({
                item_id: (+item?.item_id),
                po_qty: (+item?.quantity),
                gross_amount: (+item?.gross_amount),
                rate: (+item?.rate),
                final_amount: 0.00,
                // final_amount: (item?.tax_rate !== "" ? ((+item?.rate) + (((+item?.rate) * (+item?.tax_rate / 100)))) : 0),
                tax_rate: (item?.tax_rate == "" || item?.tax_rate == "0" ? null : (item?.tax_rate)),
                tax_amount: null,
                gr_qty: 0,
                upload_image: "",
            }));

            setFormData(prevFormData => ({
                ...prevFormData,
                items: itemsFromApi || []
            }));
        }
    }, [detail_api_data]);
    //set purchase order data of items in items list row

    const [loading, setLoading] = useState(false);

    const [showPopup, setShowPopup] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge') {
            newValue = parseFloat(value) || 0;
        }

        if (name === "vendor_id" && value !== "") {
            setIsVendorSelect(true);
        } else if (name === "vendor_id" && value == "") {
            setIsVendorSelect(false);
        }

        if (name === "vendor_id") {
            const selectedItem = vendorList?.data?.user?.find(cus => cus.id == value);
            setFormData({
                ...formData,
                vendor_name: `${selectedItem?.salutation || ""} ${selectedItem?.first_name || ""} ${selectedItem?.last_name || ""}`,
                phone: selectedItem?.phone,
                email: selectedItem?.email
            })
        }

        setFormData({
            ...formData,
            [name]: newValue,
            total: calculateTotal(formData?.subtotal, newValue, formData?.adjustment_charge),
        });
    };

    const dropdownRef = useRef(null);
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
        const subTotalValue = parseFloat(subtotal) || 0;
        const shippingChargeValue = parseFloat(shippingCharge) || 0;
        const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
        return (subTotalValue + shippingChargeValue + adjustmentChargeValue).toFixed(2);
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // const buttonName = e.nativeEvent.submitter.name;

        // if (!isVendorSelect) {
        //     if (!isPartiallyInViewport(dropdownRef1?.current)) {
        //         dropdownRef1.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //     }
        //     setTimeout(() => {
        //         dropdownRef1?.current?.focus();
        //     }, 500);

        // } else if (!isItemSelect) {
        //     if (!isPartiallyInViewport(dropdownRef2?.current)) {
        //         dropdownRef2.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //     }
        //     setTimeout(() => {
        //         dropdownRef2.current?.focus();
        //     }, 500);

        // } else {
        //     try {
        //         await dispatch(GRNcreateActions(formData, Navigate, isEdit, buttonName, itemId));
        //         setLoading(false);
        //     } catch (error) {
        //         toast.error('Error updating GRN:', error);
        //         setLoading(false);
        //     }
        // }

        try {
            const prepareFormDataForApi = (formData) => {
                const preparedFormData = JSON.parse(JSON.stringify(formData));

                preparedFormData.items = preparedFormData.items.map(item => ({
                    ...item,
                    upload_image: JSON.stringify(item.upload_image)
                }));

                preparedFormData.charges_type = preparedFormData.charges_type.map(charge => ({
                    ...charge,
                    upload_image: JSON.stringify(charge.upload_image)
                }));

                return preparedFormData;
            };

            // Prepare formData for API
            const formDataForApi = prepareFormDataForApi(formData);
            console.log("preparedFormData", formDataForApi)
            await dispatch(GRNcreateActions(formDataForApi, Navigate, isEdit, itemId));
            setLoading(false);
        } catch (error) {
            toast.error('Error updating GRN:', error);
            setLoading(false);
        }
    };

    useEffect(() => {

        const sendData = {
            warehouse_id: localStorage.getItem('selectedWarehouseId'),
            fy: localStorage.getItem('FinancialYear'),
            vendor_id: formData?.vendor_id
        }

        if (formData?.vendor_id) {
            dispatch(purchseOrdersLists(sendData));
        }

    }, [dispatch, formData?.vendor_id]);


    useEffect(() => {
        dispatch(vendorsLists({ fy: localStorage.getItem('FinancialYear') }));
        if (itemId && isEdit) {
            dispatch(GRNdetailsActions({ id: itemId }));
        }
    }, [dispatch]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            expected_delivery_Date: formatDate(date),
        });
    };


    useOutsideClick(dropdownRef, () => setOpenDropdownIndex(null));

    const [imgLoader, setImgeLoader] = useState("");

    const [freezLoadingImg, setFreezLoadingImg] = useState(false);


    //empty all the fields when no select
    useEffect(() => {
        if (formData?.is_purchase_order === 2) {
            setFormData({
                ...formData,
                purchase_order_id: null,
                vendor_id: null,
                items: [
                    {
                        id: 0,
                        item_id: null,
                        po_qty: 0,
                        gr_qty: 0,
                        rate: 0,
                        charges_weight: 0,
                        custom_duty: null,
                        gross_amount: 0,
                        final_amount: 0,
                        tax_rate: null,
                        tax_amount: 0,
                        discount: 0,
                        discount_type: null,
                        item_remark: null, // Discrepency Notes
                        upload_image: [] // Attachments
                    },

                ],

                charges_type: [
                    {
                        account_id: null,
                        amount: 0,
                        remarks: '',
                        vendor_id: null,
                        upload_image: []// Attachment
                    },
                ],
                total: 0,
                total_grn_charges: 0,
                adjustment_charge: 0,
                subtotal: 0
            })
        }
    }, [formData?.is_purchase_order]);
    //empty all the fields when no select

    useEffect(() => {
        OverflowHideBOdy(showPopup);

    }, [showPopup]);

    console.log("formdata", formData)

    return (
        <>
            <TopLoadbar />
            {freezLoadingImg && <MainScreenFreezeLoader />}
            {/* {purchseDetails?.loading && <MainScreenFreezeLoader />} */}
            {GRNcreates?.loading && <MainScreenFreezeLoader />}
            {detailsPurchase?.loading && <MainScreenFreezeLoader />}
            {/* {GRNdetails?.loading && <MainScreenFreezeLoader />} */}

            <div className='formsectionsgrheigh' >
                <div id="Anotherbox" className='formsectionx2'>
                    <div id="leftareax12">
                        <h1 id="firstheading">
                            <svg id="fi_10552479" height="512" viewBox="0 0 60 60" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m9 39v18.2c0 .84.97 1.3 1.62.78l2.76-2.2c.36-.29.88-.29 1.24 0l3.76 3c.36.29.88.29 1.24 0l3.76-3c.36-.29.88-.29 1.24 0l3.76 3c.36.29.88.29 1.24 0l3.76-3c.36-.29.88-.29 1.24 0l3.76 3c.36.29.88.29 1.24 0l3.76-3c.36-.29.88-.29 1.24 0l2.76 2.2c.65.52 1.62.06 1.62-.78v-52.2c0-2.21-1.79-4-4-4h-40z" fill="#f9eab0"></path><path d="m5 1c2.208 0 4 1.792 4 4v34h-6c-1.104 0-2-.896-2-2v-32c0-2.208 1.792-4 4-4z" fill="#f3d55b"></path><g fill="#3f5c6c"><path d="m35 11h-20c-.553 0-1-.448-1-1s.447-1 1-1h20c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m35 17h-20c-.553 0-1-.448-1-1s.447-1 1-1h20c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m35 23h-9c-.553 0-1-.448-1-1s.447-1 1-1h9c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m22 23h-7c-.553 0-1-.448-1-1s.447-1 1-1h7c.553 0 1 .448 1 1s-.447 1-1 1z"></path><path d="m40 29h-25c-.553 0-1-.448-1-1s.447-1 1-1h25c.553 0 1 .448 1 1s-.447 1-1 1z"></path></g><path d="m40 40c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2c0 .552.447 1 1 1s1-.448 1-1c0-1.858-1.279-3.411-3-3.858v-.142c0-.552-.447-1-1-1s-1 .448-1 1v.142c-1.721.447-3 2-3 3.858 0 2.206 1.794 4 4 4 1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2c0-.552-.447-1-1-1s-1 .448-1 1c0 1.858 1.279 3.411 3 3.858v.142c0 .552.447 1 1 1s1-.448 1-1v-.142c1.721-.447 3-2 3-3.858 0-2.206-1.794-4-4-4z" fill="#24ae5f"></path><path d="m30 35h-15c-.553 0-1-.448-1-1s.447-1 1-1h15c.553 0 1 .448 1 1s-.447 1-1 1z" fill="#3f5c6c"></path><path d="m30 41h-15c-.553 0-1-.448-1-1s.447-1 1-1h15c.553 0 1 .448 1 1s-.447 1-1 1z" fill="#3f5c6c"></path><path d="m30 47h-15c-.553 0-1-.448-1-1s.447-1 1-1h15c.553 0 1 .448 1 1s-.447 1-1 1z" fill="#3f5c6c"></path><circle cx="49" cy="16" fill="#24ae5f" r="10"></circle><path d="m47 22c-.265 0-.519-.105-.707-.293l-3-3c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0l2.199 2.199 6.305-8.105c.34-.435.967-.514 1.403-.176.436.339.515.968.175 1.403l-7 9c-.176.227-.44.367-.727.384-.021.001-.042.002-.062.002z" fill="#ecf0f1"></path></svg>
                            New GRN
                        </h1>
                    </div>
                    <div id="buttonsdata">
                        <Link to={"/dashboard/grn"} className="linkx3">
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
                                        <label >GRN Type<b className='color_red'>*</b></label>
                                        <div id='sepcifixspanflex'>
                                            <span id=''>
                                                {otherIcons.name_svg}
                                                <CustomDropdown04
                                                    ref={dropdownRef1}
                                                    options={GRNype}
                                                    value={formData.grn_type}
                                                    onChange={handleChange}
                                                    name="grn_type"
                                                    defaultOption="Select GRN Type"
                                                    type="masters"
                                                    required
                                                />
                                            </span>
                                            {/* {!isVendorSelect && <p className="error-message" style={{ whiteSpace: "nowrap" }}>
                                                {otherIcons.error_svg}
                                                Please Select Vendor</p>} */}

                                            {/* popup code */}


                                            {/* popup code */}
                                        </div>

                                    </div>


                                    <div className="f1wrapofcreqx1">

                                        <div className="form_commonblock">
                                            <label>GRN Date</label>
                                            <span>
                                                {otherIcons.date_svg}
                                                <DatePicker
                                                    selected={(formData.transaction_date)}
                                                    onChange={(date) => setFormData({ ...formData, transaction_date: formatDate(date) })}
                                                    name='transaction_date'
                                                    placeholderText="Enter Transaction Date"
                                                    format="dd-MMM-yyyy" // Add format prop
                                                />
                                            </span>

                                        </div>
                                        <div className="form_commonblock">
                                            <label >GRN Number</label>
                                            <span >
                                                {otherIcons.tag_svg}
                                                <input type="text" value={formData.grn_no}
                                                    placeholder='Enter GRN Number'
                                                    onChange={handleChange}
                                                    name='grn_no'
                                                />

                                            </span>
                                        </div>




                                        <div className="form_commonblock ">
                                            <label >Reference</label>
                                            <span >
                                                {otherIcons.placeofsupply_svg}
                                                <input type="text" value={formData.reference} onChange={handleChange}
                                                    name='reference'
                                                    placeholder='Enter Reference' />
                                            </span>
                                        </div>


                                        <div className="form_commonblock">
                                            <label>With Purchase Order</label>
                                            <div id="inputx1">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#525252"} fill={"none"}>
                                                        <path d="M2 8.56907C2 7.37289 2.48238 6.63982 3.48063 6.08428L7.58987 3.79744C9.7431 2.59915 10.8197 2 12 2C13.1803 2 14.2569 2.59915 16.4101 3.79744L20.5194 6.08428C21.5176 6.63982 22 7.3729 22 8.56907C22 8.89343 22 9.05561 21.9646 9.18894C21.7785 9.88945 21.1437 10 20.5307 10H3.46928C2.85627 10 2.22152 9.88944 2.03542 9.18894C2 9.05561 2 8.89343 2 8.56907Z" stroke="currentColor" strokeWidth="1.5" />
                                                        <path d="M4 10V18.5M8 10V18.5" stroke="currentColor" strokeWidth="1.5" />
                                                        <path d="M11 18.5H5C3.34315 18.5 2 19.8431 2 21.5C2 21.7761 2.22386 22 2.5 22H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M21.5 14.5L14.5 21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <circle cx="15.25" cy="15.25" r="0.75" stroke="currentColor" strokeWidth="1.5" />
                                                        <circle cx="20.75" cy="20.75" r="0.75" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                    <CustomDropdown04
                                                        label="With Purchase Order name"
                                                        options={withPurchaseOrder}
                                                        value={formData?.is_purchase_order}
                                                        onChange={handleChange}
                                                        name="is_purchase_order"
                                                        defaultOption="Select Yes/No"
                                                        type="masters"
                                                    />
                                                </span>
                                            </div>
                                        </div>


                                        <div className="form_commonblock">
                                            <label>Select Vendor</label>
                                            <div id="inputx1">
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
                                            </div>
                                        </div>

                                        {
                                            formData?.is_purchase_order === 1 ?
                                                <>

                                                    <div className="form_commonblock">
                                                        <label>Purchase Order</label>
                                                        <div id="inputx1">
                                                            <span id=''>
                                                                {otherIcons.name_svg}
                                                                <CustomDropdown22
                                                                    ref={dropdownRef1}
                                                                    label="Select purchase_order"
                                                                    options={purchseList?.data?.purchase_order?.filter((val) => val?.status === "1")}
                                                                    value={formData.purchase_order_id}
                                                                    onChange={handleChange}
                                                                    name="purchase_order_id"
                                                                    defaultOption="Select Purchase Order"
                                                                    setcusData={setcusData}
                                                                    type="purchase"
                                                                    required
                                                                />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </> :
                                                ""
                                        }

                                        <div>

                                        </div>
                                    </div>
                                </div>
                                {/* </div> */}



                                <div className="">
                                    <ItemSelectGRM
                                        formData={formData}
                                        setFormData={setFormData}
                                        handleChange={handleChange}
                                        setIsItemSelect={setIsItemSelect}
                                        isItemSelect={isItemSelect}
                                        extracssclassforscjkls={"extracssclassforscjkls"}
                                        dropdownRef2={dropdownRef2}
                                        itemData1={cusData}
                                        imgLoader={imgLoader}
                                        setImgeLoader={setImgeLoader}
                                        vendorList={vendorList}
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
                                <div className="actionbarcommon">
                                    {isEdit && itemId ?
                                        <>
                                            {/* <button className={`firstbtnc46x5s firstbtnc2`} type="submit" disabled={loading} name="saveAsDraft">
                                                Update
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                    <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button> */}

                                            <button className={`firstbtnc1`} type="submit" disabled={loading} name="saveAndOpen"> Update
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                    <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </>
                                        :
                                        <>
                                            {/* <button className={`firstbtnc46x5s firstbtnc2`} type="submit" disabled={loading} name="saveAsDraft">
                                                Save as draft
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                    <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button> */}

                                            <button className={`firstbtnc1`} type="submit" disabled={loading} name="saveAndOpen">Save
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                                    <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </>
                                    }
                                    <Link to={"/dashboard/grn"} className="firstbtnc2">
                                        Cancel
                                    </Link>
                                </div>
                            </div>


                        </div>
                    </DisableEnterSubmitForm>
                </div >
                <Toaster />
            </div >
        </>
    );
};
export default CreateGRN;
