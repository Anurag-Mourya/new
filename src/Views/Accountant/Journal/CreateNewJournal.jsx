import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useLocation } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuotation } from '../../../Redux/Actions/quotationActions';
import { customersList } from '../../../Redux/Actions/customerActions';
import CustomDropdown11 from '../../../Components/CustomDropdown/CustomDropdown11';
import { accountLists, itemLists, vendorsLists } from '../../../Redux/Actions/listApisActions';
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
import CustomDropdown05 from '../../../Components/CustomDropdown/CustomDropdown05';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import { createJournals } from '../../../Redux/Actions/accountsActions';
import toast, { Toaster } from 'react-hot-toast';
import CustomDropdown09 from '../../../Components/CustomDropdown/CustomDropdown09';
import { JournalDetails } from '../../../Redux/Actions/JournalAndAccount';
import Loader02 from '../../../Components/Loaders/Loader02';
import { getCurrencyFormData } from '../../Helper/DateFormat';


const CreateNewJournal = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const cusList = useSelector((state) => state?.customerList);
    const getCurrency = useSelector((state) => state?.getCurrency?.data);
    const accountList = useSelector((state) => state?.accountList);
    const createJon = useSelector((state) => state?.createJournal);
    const journalDetails = useSelector((state) => state?.journalDetail);
    const journalDetail = useSelector((state) => state?.journalDetail?.data?.data?.data);
    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, dublicate: isDublicate } = Object.fromEntries(params.entries());
    // console.log("journalDetail", journalDetail)
    const [formData, setFormData] = useState({
        journal_no: "",
        fy: localStorage.getItem('FinancialYear') || 2024,
        transaction_date: new Date(),
        reference: null,
        notes: null,
        journal_type: 0,
        currency: getCurrencyFormData(),
        sub_total_credit: null,
        sub_total_debit: null,
        total_debit: null,
        total_credit: null,
        differenc: 0,
        custome_note: null,
        upload_image: null,
        status: 0,
        journal_entries: [
            {

                account_id: null,
                description: null,
                customer_id: null,
                debit: null,
                credit: null
            },
            // {

            //     account_id: null,
            //     description: null,
            //     customer_id: null,
            //     debit: null,
            //     credit: null
            // }
        ],
    });

    useEffect(() => {
        if (itemId && isEdit) {
            dispatch(JournalDetails({ journal_id: itemId }))
                .then(() => {
                    const journalEntriesFromApi = journalDetail?.journal_entry?.map(item => ({
                        account_id: (+item?.account_id),
                        customer_id: (+item?.customer_id),
                        description: (item?.description),
                        journal_id: (+item?.journal_id),
                        debit: (+item?.debit),
                        credit: (+item?.credit),
                    }));

                    setFormData({
                        ...formData,
                        journal_no: journalDetail?.journal_no,
                        fy: journalDetail?.fy,
                        transaction_date: journalDetail?.transaction_date,
                        reference: journalDetail?.reference,
                        notes: journalDetail?.notes,
                        journal_type: (+journalDetail?.journal_type),
                        currency: journalDetail?.currency,
                        sub_total_credit: journalDetail?.sub_total_credit,
                        sub_total_debit: journalDetail?.sub_total_debit,
                        total_debit: journalDetail?.total_debit,
                        total_credit: journalDetail?.total_credit,
                        differenc: journalDetail?.difference,
                        custome_note: journalDetail?.custome_note,
                        upload_image: journalDetail?.upload_image,
                        status: journalDetail?.status,
                        journal_entries: journalEntriesFromApi,
                        total: calculateTotal(journalDetail?.journal_entry?.map(item => item)),
                        subtotal: calculateTotal(journalDetail?.journal_entry?.map(item => item)),
                    })
                    if (journalDetail?.upload_image) {
                        setImgeLoader("success")
                    }
                    if (journalDetail) {
                        setdifferencex(journalDetail?.difference);
                        settotalDebitx(journalDetail?.total_debit);
                        settotalCreditx(journalDetail?.total_credit);
                        // calculateTotal()
                    }
                })


        }
    }, [dispatch]);
    const [loading, setLoading] = useState(false);

    const handleItemAdd = () => {
        const newItems = [...formData.journal_entries, {
            account_id: null,
            description: null,
            customer_id: null,
            debit: null,
            credit: null
        }];
        setFormData({ ...formData, journal_entries: newItems });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        setFormData({
            ...formData,
            [name]: newValue,
            total: calculateTotal(formData.subtotal, newValue, formData.adjustment_charge),
        });
    };

    const popupRef = useRef(null);


    const [showPopup, setShowPopup] = useState("");

    const calculateTotalDebitCredit = (items) => {
        let totalDebit = 0;
        let totalCredit = 0;

        items.forEach(item => {
            totalDebit += parseFloat(item.debit) || 0;
            totalCredit += parseFloat(item.credit) || 0;
        });
        return { totalDebit, totalCredit };
    };



    const [totalDebitx, settotalDebitx] = useState("");
    const [totalCreditx, settotalCreditx] = useState("");
    const [differencex, setdifferencex] = useState("");

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.journal_entries];

        // If changing debit, set credit to 0 and update debit
        if (field === 'debit') {
            newItems[index]['credit'] = 0;
        }
        // If changing credit, set debit to 0 and update credit
        else if (field === 'credit') {
            newItems[index]['debit'] = 0;
        }

        newItems[index][field] = value;

        const total = calculateTotal(newItems);
        const { totalDebit, totalCredit } = calculateTotalDebitCredit(newItems);

        const difference = totalDebit - totalCredit;


        settotalDebitx(totalDebit.toFixed(2))
        settotalCreditx(totalCredit.toFixed(2))
        setdifferencex(difference.toFixed(2))

        setFormData({
            ...formData,
            journal_entries: newItems,
            subtotal: total.toFixed(2),
            total: total.toFixed(2),
            total_debit: totalDebit.toFixed(2),
            total_credit: totalCredit.toFixed(2),
            difference: (totalDebit - totalCredit).toFixed(2),
            sub_total_credit: totalCredit.toFixed(2),
            sub_total_debit: totalDebit.toFixed(2),
        });
    };

    const calculateTotal = (items) => {
        if (!Array.isArray(items)) {
            return 0;
        }

        return items.reduce((acc, item) => acc + (parseFloat(item.debit) || 0) + (parseFloat(item.credit) || 0), 0);
    };


    // const handleFormSubmit = (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         dispatch(createJournals(formData));
    //         setLoading(false);
    //     } catch (error) {
    //         toast.error('Error updating quotation:', error);
    //         setLoading(false);
    //     }
    // };

    const handleFormSubmit = (e, status) => {
        e.preventDefault();
        setLoading(true);

        // Format the date to 'YYYY-MM-DD'
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = d.getFullYear();
            return `${year}-${month}-${day}`;
        };

        const formattedData = {
            ...formData,
            transaction_date: formatDate(formData.transaction_date),
            // status: status === 'draft' ? 0 : 1
        };

        try {
            if (itemId && isEdit) {
                dispatch(createJournals({ ...formattedData, id: itemId }));
                setLoading(false);

            } else {
                dispatch(createJournals(formattedData));
                setLoading(false);
            }

        } catch (error) {
            toast.error('Error updating quotation:', error);
            setLoading(false);
        }
    };



    useEffect(() => {
        dispatch(customersList({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(accountLists());
        dispatch(fetchCurrencies());
    }, [dispatch]);


    const handleItemRemove = (index) => {
        const newItems = formData.journal_entries.filter((item, i) => i !== index);
        setFormData({ ...formData, journal_entries: newItems });
    };


    // dropdown of discount
    const [showDropdown, setShowDropdown] = useState(false);
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



    const handleCheckboxChange = (e) => {
        handleChange({ target: { name: 'journal_type', value: e.target.checked ? 1 : 0 } });
    };

    return (
        <>
            {journalDetails?.loading ? <Loader02 /> : <>
                <TopLoadbar />
                {loading && <MainScreenFreezeLoader />}
                {freezLoadingImg && <MainScreenFreezeLoader />}
                {createJon?.loading && <MainScreenFreezeLoader />}

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <svg id="fi_5538087" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g clip-rule="evenodd" fill-rule="evenodd"><g><path d="m406.505 44.611c0-13.529-11.043-24.566-24.571-24.566-79.196-.005-307.864 0-307.864 0-18.816 0-34.071 15.255-34.071 34.071v403.77c0 18.816 15.255 34.071 34.071 34.071 0 0 228.669.005 307.864 0 13.528 0 24.571-11.033 24.571-24.566 0-140.928 0-281.854 0-422.78z" fill="#66d4f1"></path><path d="m364.822 51.728c-94.38-.004-188.759.001-283.139.001-5.508 0-10 4.493-10 10v388.544c0 5.505 4.488 9.996 9.993 10 44.517.001 213.607.003 283.146.001 5.507 0 9.999-4.492 9.999-10 0-129.515 0-259.03 0-388.545 0-5.509-4.492-10.001-9.999-10.001z" fill="#4fc0e8"></path><path d="m120.473 51.728h-38.79c-5.508 0-10 4.492-10 10v388.543c0 5.507 4.492 10 10 10h38.79z" fill="#38a8d2"></path><path d="m185.756 110.664h123.782c5.508 0 10 4.492 10 10v44.888c0 5.508-4.492 10-10 10h-123.782c-5.508 0-10-4.492-10-10v-44.888c0-5.508 4.492-10 10-10z" fill="#f4f6f8"></path><path d="m26.562 97.887h58.558c5.817 0 10.561 4.744 10.561 10.561v19.448c0 5.817-4.744 10.561-10.561 10.561h-58.558c-5.817 0-10.561-4.744-10.561-10.561v-19.448c-.001-5.817 4.744-10.561 10.561-10.561zm0 275.656h58.558c5.817 0 10.561 4.744 10.561 10.561v19.448c0 5.817-4.744 10.561-10.561 10.561h-58.558c-5.817 0-10.561-4.744-10.561-10.561v-19.448c-.001-5.817 4.744-10.561 10.561-10.561zm0-91.885h58.558c5.817 0 10.561 4.744 10.561 10.561v19.447c0 5.817-4.744 10.561-10.561 10.561h-58.558c-5.817 0-10.561-4.744-10.561-10.561v-19.447c-.001-5.817 4.744-10.561 10.561-10.561zm0-91.886h58.558c5.817 0 10.561 4.744 10.561 10.561v19.447c0 5.817-4.744 10.561-10.561 10.561h-58.558c-5.817 0-10.561-4.744-10.561-10.561v-19.447c-.001-5.816 4.744-10.561 10.561-10.561z" fill="#636c77"></path></g><g><path d="m442.681 156.607c12.155-12.156 32.047-12.156 44.203 0 12.155 12.156 12.155 32.047-.001 44.203l-172.836 172.835-50.87 18.077c-3.777 1.342-7.747.412-10.534-2.469-2.788-2.88-3.587-6.878-2.122-10.609l19.324-49.201z" fill="#636c77"></path><path d="m269.845 329.443-19.324 49.201c-1.465 3.731-.666 7.729 2.122 10.609 2.788 2.881 6.757 3.811 10.534 2.469l50.87-18.077s.124-.124.367-.362c0 0-44.207-44.207-44.205-44.205-.24.241-.364.365-.364.365z" fill="#f4f6f8"></path><path d="m424.995 174.293 44.202 44.202c10.893-10.893 17.686-17.686 17.686-17.686 12.156-12.156 12.156-32.047.001-44.203-12.156-12.156-32.047-12.155-44.203 0 0 .001-6.794 6.794-17.686 17.687z" fill="#fdcd56"></path></g></g></svg> 
                                New Journal
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
                                        <div className="f1wrapofcreqx1">
                                            <div className="form_commonblock">
                                                <label>Date</label>
                                                <span>
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.transaction_date}
                                                        onChange={(date) => setFormData({ ...formData, transaction_date: date })}
                                                        name='transaction_date'
                                                        required
                                                        placeholderText="Select date"
                                                        dateFormat="dd-MM-yyy"
                                                    />
                                                </span>
                                            </div>


                                            <div className="form_commonblock">
                                                <label >Journal Name<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.tag_svg}
                                                    <input type="text" value={formData.journal_no} required
                                                        placeholder='Select quotation date'
                                                        onChange={handleChange}
                                                        name='journal_no'
                                                    />

                                                </span>
                                            <div className="xkls4w5sdfs545">
                                                <label>Cash Based Journal<b className='color_red'>*</b></label>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.journal_type === 1}
                                                    onChange={handleCheckboxChange}
                                                    name='journal_type'
                                                />
                                            </div>
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
                                                    <input type="text" value={formData.reference} onChange={handleChange}
                                                        // disabled
                                                        required
                                                        name='reference'
                                                        placeholder='Enter Reference no' />
                                                </span>
                                            </div>

                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                    {/* </div> */}



                                    <div className="f1wrpofcreqsx2">
                                        <div className='itemsectionrows'>

                                            <div className="tableheadertopsxs1">
                                                <p className='tablsxs1a1x2'>ACCOUNT</p>
                                                <p className='tablsxs1a2x2'>DESCRIPTION</p>
                                                <p className='tablsxs1a3x2'>CUSTOMER</p>
                                                <p className='tablsxs1a4x2'>DEBITS</p>
                                                <p className='tablsxs1a5x2'>CREDITS</p>
                                            </div>


                                            {formData?.journal_entries?.map((item, index) => (
                                                <>
                                                    <div key={index} className="tablerowtopsxs1">
                                                        <div className="tablsxs1a1x2">
                                                            <span >
                                                                <CustomDropdown09
                                                                    label="Account"
                                                                    options={accountList?.data?.accounts || []}
                                                                    value={item.account_id}
                                                                    onChange={(e) => handleItemChange(index, 'account_id', e.target.value, e.target.option)}
                                                                    name="account_id"
                                                                    defaultOption="Select Account"
                                                                />
                                                            </span>
                                                        </div>

                                                        <div className="tablsxs1a2x2">
                                                            <textarea
                                                                type="text"
                                                                value={item.description}
                                                                placeholder='Enter description'
                                                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                            />
                                                        </div>


                                                        <div className="tablsxs1a3x2">
                                                            <span >
                                                                <CustomDropdown10
                                                                    label="Item Name"
                                                                    options={cusList?.data?.user || []}
                                                                    value={item.customer_id}
                                                                    onChange={(e) => handleItemChange(index, 'customer_id', e.target.value, e.target.option)}
                                                                    name="customer_id"
                                                                    defaultOption="Select customer"
                                                                    sd154w78s877={"sd154w78s877"}
                                                                />
                                                            </span>
                                                        </div>


                                                        <div className="tablsxs1a4x2">
                                                            <input
                                                                type="number"
                                                                value={parseInt(item.debit)}
                                                                onChange={(e) => handleItemChange(index, 'debit', e.target.value)}
                                                                placeholder="0.00"

                                                            />
                                                        </div>

                                                        <div className="tablsxs1a5x2">
                                                            <input
                                                                type="number"
                                                                value={item.credit}
                                                                placeholder="0.00"
                                                                onChange={(e) => handleItemChange(index, 'credit', e.target.value)}
                                                            />
                                                        </div>

                                                        <button className='removeicoofitemrow' type="button" onClick={() => handleItemRemove(index)}><RxCross2 /></button>
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
                                                    value={formData.custome_note}
                                                    onChange={handleChange}
                                                    name='custome_note'
                                                />
                                            </div>

                                            <div className="calctotalsection">
                                                <div className="calcuparentc">
                                                    <div className='clcsecx12s1'>
                                                        <label>Sub total:</label>
                                                        <input
                                                            type="text"
                                                            value={formData.subtotal}
                                                            readOnly
                                                            placeholder='0.00'
                                                            className='inputsfocalci465s'
                                                        />
                                                    </div>

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
                                                <div className='clcsecx12s2'>
                                                    <label>Difference</label>

                                                    <div className="xjkls54w32">
                                                        <div className="sd54f6sdc523w">

                                                            <p>Total Debits: {totalDebitx}</p>
                                                            <p>Total Credits: {totalCreditx}</p>
                                                        </div>
                                                        <p className='redxs4we'>Difference: {differencex}</p>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>

                                        <div className="breakerci"></div>

                                        <div className='secondtotalsections485s'>
                                            <div className='textareaofcreatqsiform'>
                                                <label>Notes</label>
                                                <textarea
                                                    placeholder='Enter the notes and conditions of your business to be displayed in your transaction '
                                                    value={formData.notes}
                                                    onChange={handleChange}
                                                    name='notes'
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
                                    <div className="firstbtnc2" onClick={(e) => handleFormSubmit(e, 'draft')} disabled={loading}>
                                        {loading ? 'Submitting...' : 'Save as Draft'}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                            <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <button className="firstbtnc1" onClick={(e) => handleFormSubmit(e, 'publish')} disabled={loading}>
                                        {loading ? 'Submitting...' : 'Save and Publish'}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                            <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <Link to={"/dashboard/purchase"} className="firstbtnc2">
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
                    </div >
                    <Toaster />
                </div >
            </>}
        </>
    );
};

export default CreateNewJournal;
