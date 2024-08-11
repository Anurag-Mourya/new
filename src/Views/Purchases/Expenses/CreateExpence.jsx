import React, { useEffect, useState, useRef } from 'react';
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { RxCross2 } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import { useDispatch, useSelector } from 'react-redux';
import { quotationDetails, updateQuotation } from '../../../Redux/Actions/quotationActions';
import { customersList } from '../../../Redux/Actions/customerActions';
import CustomDropdown10 from '../../../Components/CustomDropdown/CustomDropdown10';
import CustomDropdown11 from '../../../Components/CustomDropdown/CustomDropdown11';
import CustomDropdown09 from '../../../Components/CustomDropdown/CustomDropdown09';
import { accountLists, itemLists, vendorsLists } from '../../../Redux/Actions/listApisActions';
import DatePicker from "react-datepicker";

import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { GoPlus } from 'react-icons/go';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import CustomDropdown12 from '../../../Components/CustomDropdown/CustomDropdown12';
import { expenseHeadLists, fetchCurrencies, fetchMasterData } from '../../../Redux/Actions/globalActions';
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
import { createPurchases } from '../../../Redux/Actions/purchasesActions';
import toast, { Toaster } from 'react-hot-toast';
import { billDetails } from '../../../Redux/Actions/billActions';
import Loader02 from '../../../Components/Loaders/Loader02';
import CustomeDropdown2 from '../../../Components/CustomDropdown/CustomeDropdown2';
import { createExpenses, expensesDetails } from '../../../Redux/Actions/expenseActions';
import { formatDate, todayDate } from '../../Helper/DateFormat';
import NumericInput from '../../Helper/NumericInput';
import CustomDropdown15 from '../../../Components/CustomDropdown/CustomDropdown15';
import { getAccountTypes } from '../../../Redux/Actions/accountsActions';
import ImageUpload from '../../Helper/ComponentHelper/ImageUpload';
const CreateBills = () => {
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const cusList = useSelector((state) => state?.customerList);
    const vendorList = useSelector((state) => state?.vendorList);
    const itemList = useSelector((state) => state?.itemList);
    const getCurrency = useSelector((state) => state?.getCurrency?.data);
    const [cusData, setcusData] = useState(null);
    const [itemData, setItemData] = useState({});
    const [viewAllCusDetails, setViewAllCusDetails] = useState(false);
    const { masterData } = useSelector(state => state?.masterData);
    const accountList = useSelector((state) => state?.accountList);
    const billDetailss = useSelector((state) => state?.billDetail);
    const expHeadList = useSelector((state) => state?.expenseHeadList?.masterData?.data);
    const billDetail = billDetailss?.data?.bill;
    const accType = useSelector((state) => state?.getAccType?.data?.account_type);

    const expenseDetails = useSelector(state => state?.expenseDetail);
    const expenseDetail = expenseDetails?.data?.expense;

    const [imgLoader, setImgeLoader] = useState("");
    const [freezLoadingImg, setFreezLoadingImg] = useState(false);

    const params = new URLSearchParams(location.search);
    const { id: itemId, edit: isEdit, convert, dublicate: isDublicate } = Object.fromEntries(params.entries());


    const [formData, setFormData] = useState({
        expense_head_id: null, //expense type id
        transaction_date: todayDate(),
        amount: null,
        paid_by: "", //paid throught select from accounts
        // description: "",
        document: null,
        acc_id: null, //expense account_id
        notes: null,
        customer_name: null,
        customer_id: 0,
    }
    );

    // console.log("itemId && isEdit && billDetail", itemId, isEdit, billDetail)

    useEffect(() => {
        if ((itemId && isEdit && expenseDetail) || (itemId && isDublicate && expenseDetail) || itemId && (convert === "saleToInvoice")) {
            setFormData({
                id: isEdit ? itemId : 0,
                expense_head_id: (expenseDetail?.expense_head?.id),
                transaction_date: expenseDetail?.transaction_date,
                amount: expenseDetail?.amount,
                paid_by: (expenseDetail?.paid_through?.id),
                document: expenseDetail?.document,
                acc_id: (expenseDetail?.expense_account?.id),
                notes: expenseDetail?.notes,
                customer_id: (+ expenseDetail?.customer_id),
            });

            if (expenseDetail.document) {
                setImgeLoader("success");
            }

        }
    }, [itemId, isEdit, convert, expenseDetail, isDublicate]);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const popupRef = useRef(null);

    //show all addresses popup....
    const [showPopup, setShowPopup] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dispatch(createExpenses(formData, Navigate, "dublicate"));
            setLoading(false);
        } catch (error) {
            toast.error('Error updating quotation:', error);
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         customer_type: cusData?.customer_type,
    //         vendor_name: cusData ? `${cusData.first_name} ${cusData.last_name}` : '',
    //         email: cusData?.email,
    //         phone: cusData?.mobile_no,
    //         address: cusData?.address.length,
    //     }));
    // }, [cusData]);

    useEffect(() => {
        dispatch(customersList({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(vendorsLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(itemLists({ fy: localStorage.getItem('FinancialYear') }));
        dispatch(fetchCurrencies());
        dispatch(fetchMasterData());
        dispatch(accountLists());
        dispatch(getAccountTypes());
        dispatch(expensesDetails({ id: itemId }));
        dispatch(expenseHeadLists());
    }, [dispatch]);




    return (
        <>
            <Toaster />
            <TopLoadbar />
            {billDetailss?.loading || expenseDetails?.loading ? <Loader02 /> : <>
                {loading && <MainScreenFreezeLoader />}
                {freezLoadingImg && <MainScreenFreezeLoader />}

                <div className='formsectionsgrheigh'>
                    <div id="Anotherbox" className='formsectionx2'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                               <svg enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" id="fi_12139704"><g id="_x35_0_Loan"></g><g id="_x34_9_Global_Economy"></g><g id="_x34_8_Marketplace"></g><g id="_x34_7_Protection"></g><g id="_x34_6_Money"></g><g id="_x34_5_Money_Management"></g><g id="_x34_4_Invoice"></g><g id="_x34_3_Interest_Rate"></g><g id="_x34_2_Supply"></g><g id="_x34_1_Monthly_Bill"></g><g id="_x34_0_Pay_Day"></g><g id="_x33_9_Shopping_Cart"></g><g id="_x33_8_Recession"></g><g id="_x33_7_Asset_Protection"></g><g id="_x33_6_Loss"></g><g id="_x33_5_Profit"></g><g id="_x33_4_Trade"></g><g id="_x33_3_Expense"><g><path d="m453.28 460.491-412.073-92.716-41.207-211.187c0-14.224 11.531-25.755 25.755-25.755h396.62c17.069 0 30.905 13.837 30.905 30.905z" fill="#687daa"></path><g><path d="m425.98 101.885c0 25.343-10.776 48.171-27.99 64.149-110.624-11.813-112.425-104.837-86.947-147.346 8.612-2.833 17.812-4.368 27.372-4.368 48.356-.001 87.565 39.208 87.565 87.565z" fill="#f9ee80"></path><path d="m398.006 166.042c-15.622 14.524-36.567 23.409-59.591 23.409-48.359 0-87.565-39.206-87.565-87.565 0-38.797 25.242-71.71 60.198-83.199-1.203 31.955 4.109 123.467 86.958 147.355z" fill="#f9d171"></path><path d="m364.966 120.281c0-4.97-1.508-9.754-4.368-13.844-2.847-4.056-6.817-7.104-11.501-8.821l-16.085-5.854c-3.406-1.236-5.696-4.505-5.696-8.132v-.137c0-6.23 4.875-11.396 10.867-11.517 3.04-.041 5.923 1.089 8.072 3.238 1.377 1.378 2.367 3.088 2.863 4.945 1.099 4.123 5.333 6.569 9.456 5.475 4.123-1.1 6.574-5.334 5.474-9.457-1.195-4.48-3.568-8.591-6.866-11.889-3.09-3.089-6.907-5.349-11.042-6.61v-4.726c0-4.268-3.459-7.726-7.726-7.726s-7.726 3.459-7.726 7.726v4.746c-10.858 3.395-18.824 13.746-18.824 25.796v.137c0 10.104 6.379 19.209 15.869 22.655l16.062 5.846c1.692.62 3.128 1.72 4.147 3.172 1.028 1.47 1.571 3.191 1.571 4.978 0 6.23-4.874 11.396-10.867 11.516-3.065.044-5.926-1.092-8.083-3.249-1.371-1.37-2.362-3.086-2.866-4.96-1.108-4.121-5.35-6.564-9.468-5.454-4.121 1.108-6.563 5.347-5.455 9.468 1.206 4.485 3.579 8.591 6.862 11.873 3.146 3.146 6.925 5.399 11.051 6.646v4.698c0 4.268 3.459 7.726 7.726 7.726s7.726-3.459 7.726-7.726v-4.743c10.86-3.394 18.827-13.746 18.827-25.796z" fill="#7888af"></path></g><g><circle cx="231.405" cy="208.097" fill="#f9ee80" r="87.565"></circle></g><g><path d="m484.185 213.247v267.847c0 17.07-13.835 30.905-30.905 30.905h-141.815c-219.552-42.993-241.633-234.672-186.947-329.657h328.762c17.07 0 30.905 13.835 30.905 30.905z" fill="#7fb0e4"></path><g><path d="m371.405 347.171c0-32.354 26.228-58.581 58.581-58.581h61.41c11.379 0 20.604 9.225 20.604 20.604v75.955c0 11.379-9.225 20.604-20.604 20.604h-61.41c-32.353-.001-58.581-26.228-58.581-58.582z" fill="#a8c9ed"></path><circle cx="435.844" cy="347.171" fill="#b0f0ef" r="17.574"></circle></g><path d="m311.465 512h-280.56c-17.07 0-30.905-13.835-30.905-30.905v-324.507c0 14.227 11.528 25.755 25.755 25.755h98.764c-1.876 76.16 13.422 270.257 186.946 329.657z" fill="#68a2df"></path></g><path d="m43.992 78.336h17.292v61.975c0 5.69 4.612 10.302 10.302 10.302h42.612c5.69 0 10.302-4.612 10.302-10.302v-61.975h17.292c5.923 0 9.32-6.744 5.795-11.504l-46.417-62.662c-4.118-5.56-12.438-5.56-16.556 0l-46.417 62.662c-3.525 4.759-.128 11.504 5.795 11.504z" fill="#ff938a"></path></g></g><g id="_x33_2_Financial_Strategy"></g><g id="_x33_1_Payment_Terminal"></g><g id="_x33_0_Withdrawal"></g><g id="_x32_9_Tax"></g><g id="_x32_8_Balance"></g><g id="_x32_7_Stock_Market"></g><g id="_x32_6_Cheque"></g><g id="_x32_5_Deposit"></g><g id="_x32_4_Gold_Ingots"></g><g id="_x32_3_Income"></g><g id="_x32_2_Cash_Flow"></g><g id="_x32_1_Bankruptcy"></g><g id="_x32_0_Money_Bag"></g><g id="_x31_9_Value"></g><g id="_x31_8_Inflation"></g><g id="_x31_7_Insurance"></g><g id="_x31_6_Startup"></g><g id="_x31_5_Balance_Sheet"></g><g id="_x31_4_Assets"></g><g id="_x31_3_Bank"></g><g id="_x31_2_Credit_Card"></g><g id="_x31_1_Investment"></g><g id="_x31_0_Growth"></g><g id="_x39__Analysis"></g><g id="_x38__Currency"></g><g id="_x37__Statistic"></g><g id="_x36__Debt"></g><g id="_x35__Wallet"></g><g id="_x34__Safebox"></g><g id="_x33__Demand"></g><g id="_x32__Online_Banking"></g><g id="_x31__Accounting"></g></svg> 
                                New Expenses
                            </h1><br /><br /><br /><br />

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
                                                <label className='color_red'>Date <b >*</b></label>
                                                <span>
                                                    {otherIcons.date_svg}
                                                    <DatePicker
                                                        selected={formData.transaction_date}
                                                        onChange={(date) => setFormData({ ...formData, transaction_date: formatDate(date) })}
                                                        name='transaction_date'
                                                        required
                                                        placeholderText="Enter bill date"
                                                        dateFormat="dd-MM-yyy"
                                                        autoComplete='off'
                                                    />
                                                </span>
                                            </div>
                                            <div className="form_commonblock ">
                                                <label >Amount</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <NumericInput
                                                        value={formData.amount}
                                                        onChange={handleChange}
                                                        name="amount"
                                                        placeholder="Enter Amount"
                                                        autoFocus
                                                        autoComplete="off"
                                                    />
                                                </span>
                                            </div>
                                            <div className="form_commonblock">
                                                <label>Expense Account</label>

                                                <span >
                                                    {otherIcons.currency_icon}
                                                    <CustomDropdown15
                                                        label="Expense Account"
                                                        options={accountList?.data?.accounts || []}
                                                        value={formData?.acc_id}
                                                        onChange={handleChange}
                                                        name="acc_id"
                                                        defaultOption="Select Expense Account"
                                                    />
                                                </span>

                                            </div>

                                            <div className="form_commonblock ">
                                                <label >Paid Throught</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}

                                                    <CustomDropdown15
                                                        label="Expense Account"
                                                        options={accountList?.data?.accounts || []}
                                                        value={formData?.paid_by}
                                                        onChange={handleChange}
                                                        name="paid_by"
                                                        defaultOption="Select Expense Account"
                                                    />
                                                </span>
                                            </div>

                                            <div className="form_commonblock">
                                                <label className='color_red'>Expense Type<b >*</b></label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <CustomeDropdown2
                                                        label="Expense Type"
                                                        options={expHeadList}
                                                        value={formData?.expense_head_id}
                                                        onChange={handleChange}
                                                        name="expense_head_id"
                                                        type="select_expense"
                                                        defaultOption="Select Expense Type"
                                                    />
                                                </span>
                                            </div>

                                            {/* <div className="form_commonblock">
                                                <label className='color_red'>Bill<b >*</b></label>
                                                <span >
                                                    {otherIcons.tag_svg}
                                                    <input type="text" value={formData.bill_no} required
                                                        placeholder='Enter bill number'
                                                        onChange={handleChange}
                                                        name='bill_no'
                                                    />

                                                </span>
                                            </div> */}






                                            {/* <div className="form_commonblock">

                                                <label >Invoice<b className='color_red'>*</b></label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input
                                                        type="text" required
                                                        value={formData.place_of_supply}
                                                        onChange={handleChange}
                                                        name='place_of_supply'

                                                        placeholder='Enter invoice'
                                                    />
                                                </span>
                                            </div> */}




                                            {/* <div className="form_commonblock ">
                                                <label>Tax</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <CustomDropdown04
                                                        label="Tax"
                                                        options={masterData?.filter(type => type.type === "7")}
                                                        value={formData?.payment_terms}
                                                        onChange={handleChange}
                                                        name="payment_terms"
                                                        defaultOption="Select tex"
                                                    />
                                                </span>
                                            </div> */}


                                            <div className="form_commonblock">
                                                <label >Notes</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <input
                                                        type="text" required
                                                        value={formData.notes}
                                                        onChange={handleChange}
                                                        name='notes'

                                                        placeholder='Enter Notes'
                                                    />
                                                </span>
                                            </div>

                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                    {/* </div> */}



                                    <div className="f1wrpofcreqsx2">

                                        <div className="height5"></div>
                                        <div className="breakerci"></div>
                                        <div className="height5"></div>

                                        <div className='secondtotalsections485s'>
                                            <div className="form_commonblock ">
                                                <label>Customer Name</label>
                                                <span >
                                                    {otherIcons.placeofsupply_svg}
                                                    <CustomDropdown10
                                                        label="Customer Name"
                                                        options={cusList?.data?.user}
                                                        value={formData.customer_id}
                                                        onChange={handleChange}
                                                        name="customer_id"
                                                        defaultOption="Select Customer Name"
                                                        setcusData={setcusData}
                                                        type="vendor"
                                                    />
                                                </span>
                                            </div>

                                            <div id="imgurlanddesc" className='calctotalsectionx2'>
                                                <div id="imgurlanddesc" className='calctotalsectionx2'>
                                                    <ImageUpload
                                                        formData={formData}
                                                        setFormData={setFormData}
                                                        setFreezLoadingImg={setFreezLoadingImg}
                                                        imgLoader={imgLoader}
                                                        setImgeLoader={setImgeLoader}
                                                        component="expense"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="actionbarcommon">
                                    <div className="firstbtnc2" type="submit" disabled={loading}>
                                        {loading ? 'Submiting...' : 'Save as draft'}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#525252"} fill={"none"}>
                                            <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    <button className="firstbtnc1" type="submit" disabled={loading}> {loading ? 'Submiting...' : 'Save as send'}
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
                </div >
            </>
            }
        </>
    );
};

export default CreateBills;
