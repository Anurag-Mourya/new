import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { updateCreditNote, updateQuotation } from '../../../Redux/Actions/quotationActions';
import { customersList } from '../../../Redux/Actions/customerActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import CustomDropdown11 from '../../../Components/CustomDropdown/CustomDropdown11';
import { invoiceLists, itemLists, vendorsLists } from '../../../Redux/Actions/listApisActions';
import DatePicker from "react-datepicker";

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { GoPlus } from 'react-icons/go';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import { fetchCurrencies, fetchMasterData, updateAddresses } from '../../../Redux/Actions/globalActions';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { imageDB } from '../../../Configs/Firebase/firebaseConfig';
import { OverflowHideBOdy } from '../../../Utils/OverflowHideBOdy';
import { BsEye } from 'react-icons/bs';
import { Toaster, toast } from "react-hot-toast";
import CustomDropdown14 from '../../../Components/CustomDropdown/CustomDropdown14';
import { SlReload } from 'react-icons/sl';
import { creditNotesDetails, debitNotesDetails } from '../../../Redux/Actions/notesActions';
import CustomDropdown17 from '../../../Components/CustomDropdown/CustomDropdown17';
import Loader02 from '../../../Components/Loaders/Loader02';
import CustomDropdown18 from '../../../Components/CustomDropdown/CustomDropdown18';
import { billLists } from '../../../Redux/Actions/billActions';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import CurrencySelect from '../../Helper/ComponentHelper/CurrencySelect';
import ItemSelect from '../../Helper/ComponentHelper/ItemSelect';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
import { getCurrencyFormData, todayDate } from '../../Helper/DateFormat';

const CreateDebitNotes = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const cusList = useSelector((state) => state?.customerList);
    const itemList = useSelector((state) => state?.itemList);
    const getCurrency = useSelector((state) => state?.getCurrency?.data);
    const addUpdate = useSelector((state) => state?.updateAddress);
    const vendorList = useSelector((state) => state?.vendorList);
    const billList = useSelector(state => state?.billList?.data?.bills);

    const quoteDetail = useSelector((state) => state?.debitNoteDetail);
    const quoteDetails = quoteDetail?.data?.data?.debit_note;
    const masterData = useSelector(state => state?.masterData?.masterData);
    // console.log("bills", billList)

    const [cusData, setcusData] = useState(null);
    const [switchCusDatax1, setSwitchCusDatax1] = useState("Details");
    const [itemData, setItemData] = useState({});
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);

    const [isItemSelect, setIsItemSelect] = useState(false);


    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, dublicate: isDublicate } = Object.fromEntries(params.entries());


    const [formData, setFormData] = useState({
        tran_type: "debit_note",
        vendor_id: null,
        warehouse_id: localStorage.getItem('selectedWarehouseId'),
        bill_id: 1,
        currency: getCurrencyFormData(),
        reference_no: "",
        debit_note_id: "DN-00001",
        transaction_date: todayDate(), // debit_note date
        sale_person: "",
        customer_type: null,
        customer_name: null,
        phone: null,
        email: null,
        address: null,
        reason_type: null,
        place_of_supply: "",
        customer_note: null,
        terms_and_condition: null,
        fy: localStorage.getItem('FinancialYear'),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        subtotal: null,
        shipping_charge: null,
        adjustment_charge: null,
        total: null,
        status: null,
        reference: "",
        upload_image: null,
        discount: null,
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


    useEffect(() => {
        if (itemId && isEdit && quoteDetails || itemId && isDublicate && quoteDetails) {
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
                id: isEdit ? itemId : 0,
                tran_type: 'debit_note',
                transaction_date: quoteDetails?.transaction_date,
                warehouse_id: quoteDetails?.warehouse_id,
                debit_note_id: quoteDetails?.debit_note_id,
                customer_id: (+quoteDetails?.customer_id),
                upload_image: quoteDetails?.upload_image,
                customer_type: quoteDetails?.customer_type,
                customer_name: quoteDetails?.customer_name,
                phone: quoteDetails?.phone,
                reason_type: quoteDetails?.reason_type,
                bill_id: (+quoteDetails?.bill_id),
                vendor_id: (+quoteDetails?.vendor_id),
                email: quoteDetails?.email,
                reference_no: quoteDetails?.reference_no,
                invoice_id: (+quoteDetails?.invoice_id),
                reference: quoteDetails?.reference,
                currency: quoteDetails?.currency,
                place_of_supply: quoteDetails?.place_of_supply,
                sale_person: quoteDetails?.sale_person,
                customer_note: quoteDetails?.customer_note,
                terms_and_condition: quoteDetails?.terms_and_condition,
                fy: quoteDetails?.fy,
                subtotal: quoteDetails?.subtotal,
                shipping_charge: quoteDetails?.shipping_charge,
                adjustment_charge: quoteDetails?.adjustment_charge,
                total: quoteDetails?.total,
                status: quoteDetails?.status,
                address: quoteDetails?.address,
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
                // console.log("dataWithParsedAddress", dataWithParsedAddress)
                setcusData(dataWithParsedAddress?.customer)
            }

        }
    }, [quoteDetails, itemId, isEdit]);
    const [loading, setLoading] = useState(false);

    const handleItemAdd = () => {
        const newItems = [...formData.items, {
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

    const calculateTotal = (subtotal, shippingCharge, adjustmentCharge) => {
        const subTotalValue = parseFloat(subtotal) || 0;
        const shippingChargeValue = parseFloat(shippingCharge) || 0;
        const adjustmentChargeValue = parseFloat(adjustmentCharge) || 0;
        return (subTotalValue + shippingChargeValue + adjustmentChargeValue).toFixed(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge') {
            newValue = parseFloat(value) || 0; // Convert to float or default to 0
        }

        // Convert empty string to zero
        if (newValue === '') {
            newValue = "";
        }

        const selectedItem = vendorList?.data?.user?.find(cus => cus.id == value);
        if (name === "vendor_id") {

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
            currency: selectedItem?.currency
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






    const [buttonClicked, setButtonClicked] = useState(null);

    const handleButtonClicked = (status) => {
        setButtonClicked(status);
    };

    const Navigate = useNavigate()

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!buttonClicked) {
            toast.error('Please select an action (Save as draft or Save and send).');
            return;
        }
        setLoading(true);
        try {
            // const { tax_name, ...formDataWithoutTaxName } = formData;
            const updatedItems = formData.items.map((item) => {
                const { tax_name, ...itemWithoutTaxName } = item;
                return itemWithoutTaxName;
            });
            await dispatch(updateCreditNote({ ...formData, items: updatedItems, }, Navigate, "debit_note"));
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
            address: addSelect

        }));
    }, [cusData]);

    useEffect(() => {
        dispatch(itemLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(fetchCurrencies());
        dispatch(invoiceLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(debitNotesDetails({ id: itemId }));
        dispatch(vendorsLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(billLists({ fy: localStorage.getItem('FinancialYear'), warehouse_id: localStorage.getItem('selectedWarehouseId'), }));
        dispatch(fetchMasterData());

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


    const handleItemRemove = (index) => {
        const newItems = formData.items.filter((item, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };


    // dropdown
    const dropdownRef = useRef(null);
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


    const handleItemReset = (index) => {
        const newItems = [...formData.items];
        newItems[index] = {
            item_id: '',
            quantity: 1,
            gross_amount: 0,
            rate: 0,
            final_amount: 0,
            tax_rate: 0,
            tax_amount: 0,
            discount: 0,
            discount_type: 1,
            item_remark: 0,
        };

        const subtotal = newItems.reduce((acc, item) => acc + parseFloat(item.final_amount || 0), 0);
        const total = subtotal + parseFloat(formData.shipping_charge || 0) + parseFloat(formData.adjustment_charge || 0);

        setFormData({
            ...formData,
            items: newItems,
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2),
        });
    };

    return (
        <>
            {quoteDetail?.loading === true ? < Loader02 /> : <>
                <TopLoadbar />
                {loading && <MainScreenFreezeLoader />}
                {freezLoadingImg && <MainScreenFreezeLoader />}
                {addUpdate?.loading && <MainScreenFreezeLoader />}

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <svg height="512pt" viewBox="-1 0 512 512.00052" width="512pt" xmlns="http://www.w3.org/2000/svg" id="fi_1688619"><path d="m498.1875 283.320312-123.632812 123.632813c-15.625 15.625-40.96875 15.625-56.589844-.007813l-214.996094-214.996093c-3.234375-3.234375-5.804688-6.878907-7.695312-10.773438-7.265626-14.917969-4.703126-33.417969 7.695312-45.828125l123.625-123.625c15.632812-15.628906 40.976562-15.628906 56.597656 0l214.996094 214.996094c15.632812 15.625 15.632812 40.96875 0 56.601562zm0 0" fill="#4395fb"></path><path d="m498.1875 283.320312-123.632812 123.632813c-15.625 15.625-40.96875 15.625-56.589844-.007813l-214.996094-214.996093c-3.234375-3.234375-5.804688-6.878907-7.695312-10.773438h357.371093l45.542969 45.542969c15.632812 15.625 15.632812 40.96875 0 56.601562zm0 0" fill="#2482ff"></path><path d="m171.753906 66.570312 42.316406-42.320312 271.589844 271.59375-42.316406 42.316406zm0 0" fill="#2c5bab"></path><path d="m370.996094 181.175781h-84.632813l156.988281 156.980469 42.3125-42.3125zm0 0" fill="#274b92"></path><path d="m481.917969 512h-454.417969c-15.1875 0-27.5-12.3125-27.5-27.5v-233.300781c0-15.1875 12.3125-27.5 27.5-27.5h454.417969c15.1875 0 27.5 12.3125 27.5 27.5v233.300781c0 15.1875-12.3125 27.5-27.5 27.5zm0 0" fill="#1eb7a2"></path><path d="m471.289062 316.082031v103.539063c0 5.761718-4.042968 10.707031-9.679687 11.90625-4.964844 1.058594-9.636719 2.917968-13.867187 5.4375-4.117188 2.433594-7.8125 5.488281-10.972657 9.039062l-.03125.03125c-4.347656 4.890625-7.664062 10.71875-9.636719 17.144532-1.542968 5.039062-6.3125 8.398437-11.582031 8.398437h-321.621093c-5.269532 0-10.039063-3.359375-11.582032-8.398437-4.859375-15.894532-18.066406-28.148438-34.507812-31.652344-5.636719-1.199219-9.679688-6.144532-9.679688-11.90625v-103.539063c0-5.753906 4.042969-10.710937 9.679688-11.90625 3.769531-.808593 7.371094-2.070312 10.738281-3.738281 11.320313-5.585938 20.023437-15.664062 23.769531-27.917969 1.542969-5.039062 6.3125-8.398437 11.582032-8.398437h321.621093c5.269531 0 10.039063 3.359375 11.582031 8.398437 4.859376 15.894531 18.066407 28.148438 34.507813 31.65625 5.636719 1.195313 9.679687 6.152344 9.679687 11.90625zm0 0" fill="#65d196"></path><path d="m471.289062 316.082031v103.539063c0 5.761718-4.042968 10.707031-9.679687 11.90625-4.964844 1.058594-9.636719 2.917968-13.867187 5.4375-4.117188 2.433594-7.8125 5.488281-10.972657 9.039062l-.03125.03125h-322.421875c-5.269531 0-10.035156-3.359375-11.578125-8.398437-4.863281-15.894531-18.070312-28.160157-34.511719-31.65625-5.636718-1.207031-9.679687-6.152344-9.679687-11.914063v-93.628906c11.320313-5.585938 20.023437-15.664062 23.769531-27.917969 1.542969-5.039062 6.3125-8.398437 11.582032-8.398437h321.621093c5.269531 0 10.039063 3.359375 11.582031 8.398437 4.859376 15.894531 18.066407 28.148438 34.507813 31.65625 5.636719 1.195313 9.679687 6.152344 9.679687 11.90625zm0 0" fill="#7af4ab"></path><g fill="#7af4a9"><path d="m54.230469 265.265625c0 5.527344-4.480469 10.007813-10.007813 10.007813s-10.007812-4.480469-10.007812-10.007813 4.480468-10.007813 10.007812-10.007813 10.007813 4.480469 10.007813 10.007813zm0 0"></path><path d="m475.203125 265.265625c0 5.527344-4.480469 10.007813-10.007813 10.007813-5.527343 0-10.007812-4.480469-10.007812-10.007813s4.480469-10.007813 10.007812-10.007813c5.527344 0 10.007813 4.480469 10.007813 10.007813zm0 0"></path><path d="m54.230469 470.4375c0 5.527344-4.480469 10.007812-10.007813 10.007812s-10.007812-4.480468-10.007812-10.007812 4.480468-10.007812 10.007812-10.007812 10.007813 4.480468 10.007813 10.007812zm0 0"></path><path d="m475.203125 470.4375c0 5.527344-4.480469 10.007812-10.007813 10.007812-5.527343 0-10.007812-4.480468-10.007812-10.007812s4.480469-10.007812 10.007812-10.007812c5.527344 0 10.007813 4.480468 10.007813 10.007812zm0 0"></path></g><path d="m336.601562 367.851562c0 45.226563-36.664062 81.890626-81.894531 81.890626-45.226562 0-81.890625-36.664063-81.890625-81.890626 0-45.230468 36.664063-81.890624 81.890625-81.890624 45.230469 0 81.894531 36.660156 81.894531 81.890624zm0 0" fill="#1a9c91"></path><path d="m427.414062 357.875h-46.195312c-4.347656 0-7.871094 3.527344-7.871094 7.875s3.523438 7.875 7.871094 7.875h46.195312c4.351563 0 7.875-3.527344 7.875-7.875s-3.523437-7.875-7.875-7.875zm0 0" fill="#1a9c91"></path><path d="m128.199219 362.074219h-46.195313c-4.351562 0-7.875 3.527343-7.875 7.875 0 4.347656 3.523438 7.875 7.875 7.875h46.195313c4.347656 0 7.871093-3.527344 7.871093-7.875 0-4.347657-3.523437-7.875-7.871093-7.875zm0 0" fill="#1a9c91"></path><path d="m283.769531 388.957031c0-35.210937-40.835937-26.015625-40.835937-43.808593 0-6.824219 4.796875-10.285157 14.257812-10.285157 6.492188 0 10.039063 1.828125 12.628906 3.164063 1.617188.832031 3.015626 1.554687 4.617188 1.554687 4.398438 0 7.09375-4.855469 7.09375-8.335937 0-6.820313-10.378906-9.542969-18.257812-10.4375v-12.804688c0-4.351562-3.523438-7.875-7.875-7.875-4.347657 0-7.875 3.523438-7.875 7.875v13.410156c-12.855469 2.824219-20.265626 11.628907-20.265626 24.726563 0 32.050781 40.835938 21.640625 40.835938 43.808594 0 10.550781-7.957031 12.765625-14.628906 12.765625-14.117188 0-15.382813-10.054688-21.222656-10.054688-3.996094 0-7.214844 4.558594-7.214844 8.335938 0 5.921875 8.578125 14.179687 22.496094 16.191406v10.84375c0 4.347656 3.527343 7.875 7.875 7.875 4.351562 0 7.875-3.527344 7.875-7.875v-11.414062c12.996093-3.070313 20.496093-12.925782 20.496093-27.660157zm0 0" fill="#7af4a9"></path></svg>
                                New Debit Note
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


                                            </div>


                                        </div>


                                        <div className="f1wrapofcreqx1">

                                            <div className="form_commonblock">
                                                <label>Reason</label>
                                                <span >
                                                    {otherIcons.vendor_svg}
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


                                            <div className="form_commonblock">
                                                <label className='color_red'>Bill<b >*</b></label>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown18
                                                        label="Bill Name"
                                                        options={billList}
                                                        value={formData.bill_id}
                                                        onChange={handleChange}
                                                        name="bill_id"
                                                        defaultOption="Select Bill"
                                                        type="bill_no"
                                                    />
                                                </span>
                                            </div>



                                            <div className="form_commonblock">
                                                <label className='color_red'>Debit Note<b >*</b></label>
                                                <span >
                                                    {otherIcons.tag_svg}
                                                    <input type="text" value={formData.debit_note_id} required
                                                        placeholder='Enter Debit Note'
                                                        onChange={handleChange}
                                                        name='debit_note_id'
                                                    />

                                                </span>
                                            </div>
                                            <div className="form_commonblock">
                                                <label>Place Of Supply<b ></b></label>
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
                                            <div className="form_commonblock">
                                                <label className='color_red'>Debit Note Date<b>*</b></label>
                                                <span >
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.transaction_date ? new Date(formData.transaction_date).toISOString().split('T')[0] : null}
                                                        onChange={handleDateChange}
                                                        name='transaction_date'
                                                        required
                                                        placeholderText="Enter Debit Note Date"
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

                                            <div className="form_commonblock ">
                                                <label >Reference<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.reference_no} onChange={handleChange}
                                                        // disabled
                                                        required
                                                        name='reference_no'
                                                        placeholder='Enter Reference Number' />
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
                                        />

                                        <div className='secondtotalsections485s sxfc546sdfr85234e'>
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
                                    <button className="firstbtnc2 firstbtnc46x5s" type="submit" onClick={() => handleButtonClicked('draft')} disabled={loading}>
                                        {loading ? 'Submiting...' : 'Save as draft'}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                            <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    <button className="firstbtnc1" type="submit" onClick={() => handleButtonClicked('sent')} disabled={loading}> {loading ? 'Submiting...' : 'Save as Open'}
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
                </div>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false} />
            </>}
        </>
    );
};


export default CreateDebitNotes



