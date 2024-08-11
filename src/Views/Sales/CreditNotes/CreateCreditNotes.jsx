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
import { invoiceLists, itemLists } from '../../../Redux/Actions/listApisActions';
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
import { creditNotesDetails } from '../../../Redux/Actions/notesActions';
import CustomDropdown17 from '../../../Components/CustomDropdown/CustomDropdown17';
import Loader02 from '../../../Components/Loaders/Loader02';
import { getCurrencyFormData } from '../../Helper/DateFormat';


const CreateCreditNotes = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const cusList = useSelector((state) => state?.customerList);
    const itemList = useSelector((state) => state?.itemList);
    const getCurrency = useSelector((state) => state?.getCurrency?.data);
    const addUpdate = useSelector((state) => state?.updateAddress);

    const invoiceList = useSelector((state) => state?.invoiceList?.data?.invoice);
    const quoteDetail = useSelector((state) => state?.creditNoteDetail);
    const quoteDetails = quoteDetail?.creditDetail?.data?.CreditNote;


    const [cusData, setcusData] = useState(null);
    const [switchCusDatax1, setSwitchCusDatax1] = useState("Details");
    const [itemData, setItemData] = useState({});
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);

    const creditDetail = useSelector((state) => state?.creditNoteDetail);
    const creditDetails = creditDetail?.data?.data?.salesOrder;

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, dublicate: isDublicate } = Object.fromEntries(params.entries());


    const [formData, setFormData] = useState({
        tran_type: 'credit_note',
        transaction_date: new Date(),
        warehouse_id: localStorage.getItem('selectedWarehouseId') || '',
        credit_note_id: 'CN-2024',
        customer_id: '',
        upload_image: null,
        customer_type: null,
        customer_name: null,
        phone: null,
        email: null,
        address: [
            {}
        ],
        reference_no: "",
        invoice_id: null,
        reference: "",
        currency: getCurrencyFormData(),
        place_of_supply: '',
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
                tran_type: 'credit_note',
                transaction_date: quoteDetails?.transaction_date,
                warehouse_id: quoteDetails?.warehouse_id,
                credit_note_id: quoteDetails?.credit_note_id,
                customer_id: (+quoteDetails?.customer_id),
                upload_image: quoteDetails?.upload_image,
                customer_type: quoteDetails?.customer_type,
                customer_name: quoteDetails?.customer_name,
                phone: quoteDetails?.phone,
                email: quoteDetails?.email,
                reference_no: quoteDetails?.reference_no,
                invoice_id: (+quoteDetails?.invoice_id),
                reference: quoteDetails?.reference,
                currency: quoteDetails?.currency,
                place_of_supply: quoteDetails?.customer?.place_of_supply,
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



    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'shipping_charge' || name === 'adjustment_charge') {
            newValue = parseFloat(value) || 0; // Convert to float or default to 0
        }

        // Convert empty string to zero
        if (newValue === '') {
            newValue = 0;
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
            await dispatch(updateCreditNote({ ...formData, items: updatedItems, }, Navigate));
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
        dispatch(creditNotesDetails({ id: itemId }));
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
                                New Credit Note
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
                                            <label >Customer name<b className='color_red'>*</b></label>
                                            <div id='sepcifixspanflex'>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown10
                                                        label="Customer Name"
                                                        options={cusList?.data?.user}
                                                        value={formData.customer_id}
                                                        onChange={handleChange}
                                                        name="customer_id"
                                                        defaultOption="Select Customer"
                                                        setcusData={setcusData}
                                                    />
                                                </span>

                                                {cusData &&
                                                    <div className="view_all_cus_deial_btn">
                                                        {viewAllCusDetails === true ?
                                                            <button type="button" onClick={() => setViewAllCusDetails(false)}>Hide customer information</button>
                                                            :
                                                            <button type="button" onClick={() => setViewAllCusDetails(true)}>View customer information</button>

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
                                                                            <input type="text" value={udateAddress?.street_1} required
                                                                                placeholder='Select street_1'
                                                                                onChange={(e) => handleAllAddressChange(e)} name='street_1'
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <div className="form_commonblock">
                                                                        <label >Street 2<b className='color_red'>*</b></label>
                                                                        <span >
                                                                            {otherIcons.tag_svg}
                                                                            <input type="text" value={udateAddress?.street_2} required
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
                                                                            <input type="number" value={udateAddress.phone_no} required
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
                                                                            <input type="text" value={udateAddress.fax_no} required
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
                                                                            <input type="text" value={udateAddress.zip_code} required
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
                                                                                        <p>Outstanding receivables</p>
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
                                                                                        <p>Unused credits</p>
                                                                                        <h2>47</h2>
                                                                                    </div>
                                                                                </div>

                                                                            </div>



                                                                            <div className="cust_dex1s3">
                                                                                <div className="cusx1s2">
                                                                                    <div className="cuschildx1s2">Contact details</div>
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
                                                <label>reference or reason</label>
                                                <span >
                                                    {otherIcons.vendor_svg}
                                                    <input
                                                        type="text"
                                                        value={formData.reference}
                                                        name='reference'
                                                        onChange={handleChange}
                                                        placeholder='Enter reference'
                                                    />
                                                </span>
                                            </div>


                                            <div className="form_commonblock">
                                                <label >Invoice<b className='color_red'>*</b></label>
                                                <span id=''>
                                                    {otherIcons.name_svg}
                                                    <CustomDropdown17
                                                        label="Invoice Name"
                                                        options={invoiceList}
                                                        value={formData.invoice_id}
                                                        onChange={handleChange}
                                                        name="invoice_id"
                                                        defaultOption="Select Inoivce"
                                                    // setcusData={setcusData}
                                                    />
                                                </span>
                                            </div>



                                            <div className="form_commonblock">
                                                <label >Credit Note No<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.tag_svg}
                                                    <input type="text" value={formData.credit_note_id} required
                                                        placeholder='Enter Invoice No'
                                                        onChange={handleChange}
                                                        name='credit_note_id'
                                                    />

                                                </span>
                                            </div>
                                            <div className="form_commonblock">
                                                <label >Invoice date<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.transaction_date ? new Date(formData.transaction_date).toISOString().split('T')[0] : null}
                                                        onChange={handleDateChange}
                                                        name='transaction_date'
                                                        required
                                                        placeholderText="Enter Quotation Date"
                                                        dateFormat="dd-MM-yyy"
                                                    />

                                                </span>
                                            </div>





                                            <div className="form_commonblock">
                                                <label >Place of Supply<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input
                                                        type="text" required
                                                        value={formData.place_of_supply}
                                                        onChange={handleChange}
                                                        name='place_of_supply'

                                                        placeholder='Enter Place of Supply'
                                                    />
                                                </span>
                                            </div>


                                            <div className="form_commonblock">
                                                <label>Currency</label>
                                                <span >
                                                    {otherIcons.currency_icon}

                                                    <CustomDropdown12
                                                        label="Item Name"
                                                        options={getCurrency?.currency}
                                                        value={formData?.currency}
                                                        onChange={handleChange}
                                                        name="currency"
                                                        defaultOption="Select Currency"
                                                    />
                                                </span>
                                            </div>






                                            <div className="form_commonblock ">
                                                <label >reference<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input type="text" value={formData.reference_no} onChange={handleChange}
                                                        // disabled
                                                        required
                                                        name='reference_no'
                                                        placeholder='Enter Reference no' />
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
                                                        placeholder='Enter Sales person'
                                                    />
                                                </span>
                                            </div>
                                            {/* <div className="form_commonblock">
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
                                        </div> */}

                                            {/* <div className="form_commonblock">
                                            <label>Due date</label>
                                            <span>
                                                {otherIcons.date_svg}
                                                <DatePicker
                                                    selected={formData.due_date}
                                                    onChange={(date) => setFormData({ ...formData, due_date: date.toLocaleDateString() })}
                                                    name='due_date'
                                                    required
                                                    placeholderText="Enter Due date"
                                                />

                                            </span>
                                        </div> */}

                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                    {/* </div> */}



                                    <div className="f1wrpofcreqsx2">
                                        {/* <div className="taxtypedropdownx" onClick={() => setShowDropdownx1(!showDropdownx1)} ref={dropdownRef}><span>TAX Type or x1</span>

                                        {showDropdownx1 && (
                                            <div className="dropdownmenucustomx2">
                                                <div className='dmncstomx1'
                                                >Inclusive</div>
                                                <div className='dmncstomx1'
                                                >Exclusive</div>
                                            </div>
                                        )}
                                    </div> */}


                                        <div className='itemsectionrows'>

                                            <div className="tableheadertopsxs1">
                                                <p className='tablsxs1a1'>Item</p>
                                                <p className='tablsxs1a2'>Item Price</p>
                                                <p className='tablsxs1a3'>Quantity</p>
                                                <p className='tablsxs1a4'>Discount</p>
                                                <p className='tablsxs1a5'>Tax</p>
                                                <p className='tablsxs1a6'>Final Amount</p>
                                            </div>


                                            {formData.items.map((item, index) => (
                                                <>
                                                    <div key={index} className="tablerowtopsxs1">
                                                        <div className="tablsxs1a1">
                                                            <span >
                                                                <CustomDropdown11
                                                                    label="Item Name"
                                                                    options={itemList?.data?.item}
                                                                    value={item.item_id}
                                                                    onChange={(e) => handleItemChange(index, 'item_id', e.target.value, e.target.option)}
                                                                    name="item_id"
                                                                    defaultOption="Select Item"
                                                                    setItemData={setItemData}
                                                                />
                                                            </span>
                                                        </div>

                                                        <div className="tablsxs1a2">
                                                            <input
                                                                type="number"
                                                                value={item.rate}
                                                                placeholder="0.00"
                                                                onChange={(e) => {
                                                                    const newValue = parseFloat(e.target.value);
                                                                    if (!isNaN(newValue) && newValue >= 0) {
                                                                        handleItemChange(index, "gross_amount", newValue);
                                                                    } else {
                                                                        toast('Amount cannot be negative', {
                                                                            icon: '👏', style: {
                                                                                borderRadius: '10px', background: '#333',
                                                                                color: '#fff', fontSize: '14px',
                                                                            },
                                                                        }
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </div>



                                                        <div className="tablsxs1a3">
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => {
                                                                    const newValue = parseInt(e.target.value, 10);
                                                                    if (!isNaN(newValue) && newValue >= 1) {
                                                                        handleItemChange(index, 'quantity', newValue);
                                                                    } else {
                                                                        toast.error('Quantity cannot be negative', {
                                                                            style: {
                                                                                borderRadius: '10px',
                                                                                background: '#333',
                                                                                color: '#fff',
                                                                                fontSize: '14px',
                                                                            },
                                                                        });
                                                                    }
                                                                }}
                                                            />

                                                        </div>



                                                        <div className="tablsxs1a4">
                                                            <span>
                                                                {/* <input
                                                                type="number"
                                                                value={item.discount}
                                                                onChange={(e) => handleItemChange(index, 'discount', e.target.value)}

                                                            /> */}
                                                                <input
                                                                    type="number"
                                                                    value={item.discount}
                                                                    onChange={(e) => {
                                                                        let newValue = e.target.value;
                                                                        if (newValue < 0) newValue = 0;

                                                                        if (item.discount_type === 2) {
                                                                            newValue = Math.min(newValue, 100);
                                                                            if (newValue === 100) {
                                                                                // Use toast here if available
                                                                                toast('Discount percentage cannot exceed 100%.', {
                                                                                    icon: '👏', style: {
                                                                                        borderRadius: '10px', background: '#333', fontSize: '14px',
                                                                                        color: '#fff',
                                                                                    },
                                                                                }
                                                                                );
                                                                            }
                                                                        } else {
                                                                            newValue = Math.min(newValue, item.gross_amount * item.quantity + (item.gross_amount * item.tax_rate * item.quantity) / 100);
                                                                            if (newValue > item.gross_amount * item.quantity) {
                                                                                toast('Discount amount cannot exceed the final amount.', {
                                                                                    icon: '👏', style: {
                                                                                        borderRadius: '10px', background: '#333', fontSize: '14px',
                                                                                        color: '#fff',
                                                                                    },
                                                                                }
                                                                                );
                                                                            }
                                                                        }

                                                                        handleItemChange(index, 'discount', newValue);
                                                                    }}
                                                                />





                                                                <div
                                                                    className="dropdownsdfofcus56s"
                                                                    onClick={() => handleDropdownToggle(index)}
                                                                >
                                                                    {item.discount_type === 1 ? 'INR' : item.discount_type === 2 ? '%' : ''}
                                                                    {openDropdownIndex === index && (
                                                                        <div className="dropdownmenucustomx1">
                                                                            <div className='dmncstomx1' onClick={() => handleItemChange(index, 'discount_type', 1)}>INR</div>
                                                                            <div className='dmncstomx1' onClick={() => handleItemChange(index, 'discount_type', 2)}>%</div>
                                                                        </div>
                                                                    )}
                                                                </div>


                                                            </span>
                                                        </div>



                                                        <div className="tablsxs1a5">
                                                            {item.tax_name === "Taxable" && (
                                                                <input
                                                                    type="number"
                                                                    value={parseInt(item.tax_rate)}
                                                                    onChange={(e) => handleItemChange(index, 'tax_rate', e.target.value)}
                                                                    readOnly
                                                                    placeholder='0%'
                                                                />
                                                            )}
                                                            {item.tax_name === "Non-Taxable" && (
                                                                <>  {item?.tax_name}</>
                                                            )}
                                                        </div>



                                                        {/* <label>Tax Amount:</label>
                                <input
                                    type="number"
                                    value={item.tax_amount}
                                    onChange={(e) => handleItemChange(index, 'tax_amount', e.target.value)}
                                    
                                /> */}



                                                        <div className="tablsxs1a6">
                                                            <input
                                                                type="number"
                                                                value={item.final_amount}
                                                                placeholder="0.00"
                                                                onChange={(e) => handleItemChange(index, 'final_amount', e.target.value)}
                                                                readOnly
                                                            />
                                                        </div>


                                                        {/* <label>Item Remark:</label>
                                <textarea
                                    value={item.item_remark}
                                    onChange={(e) => handleItemChange(index, 'item_remark', e.target.value)}
                                /> */}
                                                        {formData.items.length > 1 ? (
                                                            <button className='removeicoofitemrow' type="button" onClick={() => handleItemRemove(index)}> <RxCross2 /> </button>
                                                        ) : (
                                                            <button className='removeicoofitemrow' type="button" onClick={() => handleItemReset(index)}> <SlReload /> </button>
                                                        )}

                                                        {/* <button className='removeicoofitemrow' type="button" onClick={() => handleItemRemove(index)}><RxCross2 /></button> */}
                                                    </div>
                                                </>


                                            ))}
                                        </div>


                                        <button id='additembtn45srow' type="button" onClick={handleItemAdd}>Add New Row<GoPlus /></button>


                                        <div className="height5"></div>
                                        <div className='secondtotalsections485s'>
                                            <div className='textareaofcreatqsiform'>
                                                <label>Customer Note</label>
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
                                                        <label>Subtotal:</label>
                                                        <input
                                                            type="text"
                                                            value={formData.subtotal}
                                                            readOnly
                                                            placeholder='0.00'
                                                            className='inputsfocalci465s'
                                                        />
                                                    </div>
                                                    <div className='clcsecx12s1'>
                                                        <label>Shipping Charge:</label>
                                                        <input
                                                            className='inputsfocalci4'
                                                            type="number"
                                                            value={formData.shipping_charge}
                                                            onChange={(e) => {
                                                                const shippingCharge = e.target.value || '0';
                                                                const total = parseFloat(formData.subtotal) + parseFloat(shippingCharge) + parseFloat(formData.adjustment_charge || 0);
                                                                setFormData({ ...formData, shipping_charge: shippingCharge, total: total.toFixed(2) });
                                                            }}
                                                            placeholder='0.00'
                                                            disabled={!formData.items[0].item_id}
                                                        />
                                                    </div>
                                                    <div className='clcsecx12s1'>
                                                        <label>Adjustment Charge:</label>
                                                        <input
                                                            className='inputsfocalci4'
                                                            type="number"
                                                            value={formData.adjustment_charge}
                                                            onChange={(e) => {
                                                                const adjustmentCharge = e.target.value || '0';
                                                                const total = parseFloat(formData.subtotal) + parseFloat(formData.shipping_charge || 0) + parseFloat(adjustmentCharge);
                                                                setFormData({ ...formData, adjustment_charge: adjustmentCharge, total: total.toFixed(2) });
                                                            }}
                                                            disabled={!formData.items[0].item_id}
                                                            placeholder='0.00'
                                                        />
                                                    </div>
                                                    {!formData.items[0].item_id ?
                                                        <b className='idofbtagwarninhxs5'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#f6b500"} fill={"none"}>
                                                            <path d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z" stroke="currentColor" strokeWidth="1.5" />
                                                            <path d="M12.2422 17V13C12.2422 12.5286 12.2422 12.2929 12.0957 12.1464C11.9493 12 11.7136 12 11.2422 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M11.992 8.99997H12.001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>To edit the shipping and adjustment charge, select an item first.</b> : ''}

                                                </div>

                                                <div className='clcsecx12s2'>
                                                    <label>Total (₹):</label>
                                                    <input
                                                        type="text"
                                                        value={formData.total}
                                                        readOnly
                                                        placeholder='0.00'
                                                    />
                                                </div>

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
                                                    <div className="file-upload">
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
                </div>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false} />
            </>}
        </>
    );
};


export default CreateCreditNotes



