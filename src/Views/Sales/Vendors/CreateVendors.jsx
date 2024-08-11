
import React, { useState, useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import TopLoadbar from '../../../Components/Toploadbar/TopLoadbar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from 'react-icons/rx';
// import './Customer.scss';
import CustomerAddress from '../Customer/CustomerAddress';
import CustomerContactDetail from '../Customer/CustomerContactDetail';
import DisableEnterSubmitForm from '../../Helper/DisableKeys/DisableEnterSubmitForm';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { createVerndors, vendorssView } from '../../../Redux/Actions/vendonsActions';
import VendorBasicDetails from './VendorBasicDetails';
import BankDetails from './BankDetails';

const CreateVendors = () => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const customer = useSelector(state => state?.createVendor);
    const user = useSelector(state => state?.vendorView?.data?.user || {});
    const [switchCusData, setSwitchCusData] = useState("Basic");

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const { id: cusId, edit: isEdit, dublicate: isDublicate } = Object.fromEntries(params.entries());

    // const contactTick = localStorage.getItem("contact");
    // for basic details tick mark
    const [tick, setTick] = useState({
        basicTick: false,
        addressTick: false,
        bankTick: false,
        contactTick: false,
    })

    const [contactTick, setContactTick] = useState(false);

    // all submit data of create customer
    const [userData, setUserData] = useState({
        remarks: "",
    });

    const handleRemarksChange = (e) => {
        const { value } = e.target;
        setUserData(prevUserData => ({
            ...prevUserData,
            remarks: value
        }));
    };


    // for set remark data when  dublicate or update
    useEffect(() => {
        if ((user?.id && isEdit || user?.id && isDublicate)) {
            setUserData(prevUserData => ({
                ...prevUserData,
                remarks: user?.remarks
            }));
        }
    }, [user?.remarks])

    //fetch all seperate components state data
    const updateUserData = (newUserData) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            ...newUserData,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Add this line to prevent form submission
        if (cusId && isEdit) {
            dispatch(createVerndors({ ...userData, id: cusId, is_vendor: 1 }, Navigate, "edit"));
        } else if (cusId && isDublicate) {
            dispatch(createVerndors({ ...userData, id: 0, is_vendor: 1 }, Navigate, "dublicate"));
        } else {
            dispatch(createVerndors({ ...userData, id: 0, is_vendor: 1 }, Navigate));
        }
    };






    useEffect(() => {
        if (cusId && isEdit || cusId && isDublicate) {
            const queryParams = {
                user_id: cusId,
                fy: localStorage.getItem('FinancialYear'),
                warehouse_id: localStorage.getItem('selectedWarehouseId'),
            };
            dispatch(vendorssView(queryParams));
        }
    }, [dispatch, cusId]);

    return (
        <>
            {customer?.loading && <MainScreenFreezeLoader />}
            {customer?.loading && <MainScreenFreezeLoader />}

            <TopLoadbar />
            <div id="Anotherbox" className='formsectionx2'>
                <div id="leftareax12">
                    <h1 id="firstheading">
                           <svg id="fi_12371422" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m467.112 38.078a75.38 75.38 0 1 0 0 106.6 75.382 75.382 0 0 0 0-106.6zm-90.243 56.69a5.747 5.747 0 0 1 7.83-8.415l19.924 18.566 38.1-39.118a5.744 5.744 0 0 1 8.235 8.01l-41.93 43.058a5.749 5.749 0 0 1 -8.123.292zm-252.005-15.326v-.022a44.081 44.081 0 0 0 -43.583 44.5l.023.045h-.024a44.081 44.081 0 0 0 44.5 43.584l.045-.023v.022a44.079 44.079 0 0 0 43.582-44.5l-.022-.045h.022a44.079 44.079 0 0 0 -44.5-43.582l-.044.023zm0-11.521v.023a55.564 55.564 0 0 1 56.036 55.056h-.022a55.564 55.564 0 0 1 -55.058 56.04v-.022a55.564 55.564 0 0 1 -56.041-55.059h.021a55.566 55.566 0 0 1 55.058-56.041zm29.882-15.309a76.592 76.592 0 0 1 12.493 6.6 5.745 5.745 0 0 0 6.339-.054l.006.009 15.027-10.171 11.146 10.934-10.073 15.51a5.745 5.745 0 0 0 .066 6.357 76.391 76.391 0 0 1 10.662 25.838 5.747 5.747 0 0 0 4.545 4.474l17.8 3.43.151 15.607-18.085 3.854a5.751 5.751 0 0 0 -4.481 4.685c-1.633 8.589-5.98 18.408-10.725 25.694a5.741 5.741 0 0 0 .054 6.339l-.009.006 10.171 15.027-10.933 11.149-15.514-10.071a5.743 5.743 0 0 0 -6.357.066 76.391 76.391 0 0 1 -25.838 10.662 5.746 5.746 0 0 0 -4.474 4.545l-3.43 17.8-15.606.15-3.848-18.084a5.752 5.752 0 0 0 -4.685-4.481c-8.588-1.633-18.41-5.981-25.7-10.726a5.745 5.745 0 0 0 -6.592.235l-14.766 9.99-11.16-10.947 10.07-15.514a5.743 5.743 0 0 0 -.066-6.357 76.379 76.379 0 0 1 -10.661-25.838 5.747 5.747 0 0 0 -4.546-4.474l-17.8-3.43-.151-15.607 18.085-3.847a5.754 5.754 0 0 0 4.482-4.685c1.635-8.587 5.982-18.412 10.726-25.697a5.741 5.741 0 0 0 -.054-6.339l.009-.006-10.172-15.029 10.934-11.147 15.514 10.069a5.743 5.743 0 0 0 6.357-.066 76.391 76.391 0 0 1 25.843-10.662 5.747 5.747 0 0 0 4.474-4.546l3.43-17.8 15.606-.151 3.847 18.087a5.752 5.752 0 0 0 4.685 4.482 75.908 75.908 0 0 1 13.2 4.129zm-49.379 213.121v57.6l16.24-11.8a5.753 5.753 0 0 1 6.849-.073l16.862 12.251v-57.978zm-57.492 176.187a5.761 5.761 0 0 1 0-11.521h43.232a5.761 5.761 0 1 1 0 11.521zm0-26.45a5.76 5.76 0 1 1 0-11.52h43.232a5.76 5.76 0 1 1 0 11.52zm287.219-193.919c-7.5-8.364-18.416-12.585-31.026-12.585-12.915 0-24.861 4.41-33.207 13.151-18.494 19.368-14.585 56.521 1.056 76.8 17.081 22.145 44.094 22.145 61.174 0 8.24-10.683 13.338-25.54 13.338-42.038 0-15.628-4.236-27.408-11.335-35.326zm-160.052 249.249h-148.323a3.935 3.935 0 0 1 -3.909-3.909v-197.249a3.935 3.935 0 0 1 3.909-3.909h67.128v68.891h.008a5.776 5.776 0 0 0 9.127 4.658l22.1-16.056 22.367 16.251a5.76 5.76 0 0 0 9.39-4.473v-69.271h67.128a3.935 3.935 0 0 1 3.909 3.909v89.967a75.879 75.879 0 0 0 -52.833 72.074v39.117zm11.52 25.2h42.087v-30.515a5.761 5.761 0 0 1 11.521 0v30.515h124.666v-30.515a5.76 5.76 0 0 1 11.52 0v30.515h42.088v-64.317a64.281 64.281 0 0 0 -64.079-64.077h-103.722a64.282 64.282 0 0 0 -64.081 64.077z" fill="#3a8aaa" fill-rule="evenodd"></path></svg>
                        {
                            cusId && isDublicate ?
                                "Dublicate Vendor" :
                                <>
                                    {cusId && isEdit ? "Update Vendor" : "New Vendor"}
                                </>
                        }
                    </h1>
                </div>
                <div id="buttonsdata">
                    <Link to={"/dashboard/vendors"} className="linkx3">
                        <RxCross2 />
                    </Link>
                </div>
            </div>


            <div className="ccfz1 formsectionx1">

                <div className='insideccfz1'>

                    <button className={`type-button ${switchCusData === "Basic" && 'selectedbtnx2'}`} onClick={() => setSwitchCusData("Basic")}>(1) Basic Details {tick?.basicTick &&
                        <svg className='absiconofx56' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#cdcdcd"} fill={"none"}>
                            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>}
                    </button>

                    <button className={`type-button ${tick?.basicTick ? "" : "disabledfield"}  ${switchCusData === "Address" && 'selectedbtnx2'}`} onClick={() => setSwitchCusData("Address")}>(2) Address {tick?.addressTick &&
                        <svg className='absiconofx56' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#cdcdcd"} fill={"none"}>
                            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>}
                    </button>

                    <button className={`type-button ${tick?.basicTick && tick?.addressTick ? "" : "disabledfield"} ${switchCusData === "Contact" && 'selectedbtnx2'}`} onClick={() => setSwitchCusData("Contact")}>(3) Contact Persons {contactTick &&
                        <svg className='absiconofx56' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#cdcdcd"} fill={"none"}>
                            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>}
                    </button>

                    <button className={`type-button ${tick?.basicTick && tick?.addressTick && contactTick && tick?.addressTick ? "" : "disabledfield"} ${switchCusData === "Bank" && 'selectedbtnx2'}`} onClick={() => setSwitchCusData("Bank")}>(4) Bank Details{tick?.bankTick &&
                        <svg className='absiconofx56' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#cdcdcd"} fill={"none"}>
                            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>}
                    </button>

                    <button className={`type-button ${tick?.basicTick && tick?.addressTick && contactTick && tick?.bankTick ? "" : "disabledfield"} ${switchCusData === "Remark" && 'selectedbtnx2'}`} onClick={() => setSwitchCusData("Remark")}>(5) Remarks {userData?.remarks && <svg className='absiconofx56' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#cdcdcd"} fill={"none"}>
                        <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>}</button>
                </div>

            </div>

            {/* form Data */}
            <div id="formofcreateitems">

                <DisableEnterSubmitForm onSubmit={handleSubmit}>
                    <div className="itemsformwrap">
                        <div id="">

                            {/* main forms */}
                            <VendorBasicDetails switchCusData={switchCusData} customerData={{ user, isEdit, isDublicate }} setTick={setTick} tick={tick} updateUserData={updateUserData} />

                            <CustomerAddress switchCusData={switchCusData} setTick={setTick} tick={tick} customerData={{ user, isEdit, isDublicate }} updateUserData={updateUserData} />

                            <CustomerContactDetail
                                switchCusData={switchCusData}
                                customerData={{ user, isEdit, isDublicate }}
                                userData={userData}
                                setUserData={setUserData}
                                updateUserData={updateUserData}
                                // setTick={setTick}
                                contactTick={contactTick}
                                setContactTick={setContactTick}
                            // tick={tick}
                            />

                            <BankDetails
                                switchCusData={switchCusData}
                                customerData={{ user, isEdit, isDublicate }}
                                userData={userData}
                                setUserData={setUserData}
                                updateUserData={updateUserData}
                                setTick={setTick} tick={tick}
                            />


                            {switchCusData === "Remark" && <>
                                <div id="secondx2_customer">
                                    <div className="iconheading">
                                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2162_1003)">
                                                <path d="M22.9131 29.2736L20.1978 9.83819C20.1675 9.6241 20.0224 9.44384 19.8198 9.3686L9.25972 5.45472C8.96171 5.3366 8.62437 5.48244 8.50626 5.78045C8.5036 5.78718 8.50104 5.794 8.49859 5.80085L1.77285 23.5537C1.65599 23.857 1.80714 24.1977 2.1105 24.3146C2.11492 24.3163 2.1194 24.3179 2.12384 24.3195L21.593 31.4613L21.6582 31.4771C21.954 31.5502 22.2567 31.3855 22.3559 31.0975L22.8893 29.5465C22.9187 29.4587 22.9268 29.3652 22.9131 29.2736Z" fill="#FFA000" />
                                                <path d="M31.3864 11.348C31.4258 11.0253 31.1961 10.7318 30.8733 10.6924C30.8716 10.6922 30.87 10.692 30.8683 10.6918L25.8078 10.0783L10.8619 8.26555C10.5422 8.22548 10.2497 8.44993 10.2056 8.76911L7.48462 27.4926C7.44101 27.7941 7.63468 28.0791 7.93111 28.1496L7.99633 28.1654L28.5748 30.7303C28.8974 30.7704 29.1915 30.5413 29.2316 30.2187C29.2319 30.2162 29.2322 30.2138 29.2325 30.2113L31.3864 11.348Z" fill="#FFE082" />
                                                <path d="M21.8116 13.3427C21.4955 13.2667 21.3009 12.9488 21.3769 12.6327C21.4135 12.4803 21.5094 12.3488 21.6434 12.2673L25.1972 10.1001C25.4718 9.92609 25.8355 10.0075 26.0096 10.2822C26.1837 10.5568 26.1022 10.9204 25.8276 11.0945C25.8218 11.0982 25.816 11.1017 25.8101 11.1052L22.2563 13.2724C22.1232 13.3538 21.9633 13.3791 21.8116 13.3427Z" fill="#455A64" />
                                                <path d="M26.9465 12.1624C28.5263 12.5453 30.1175 11.5751 30.5004 9.99524C30.8833 8.41541 29.913 6.82429 28.3332 6.44138C26.7534 6.05846 25.1622 7.02875 24.7793 8.60857C24.3964 10.1884 25.3667 11.7795 26.9465 12.1624Z" fill="#F44336" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2162_1003">
                                                    <rect width="28.2614" height="28.2614" fill="white" transform="translate(7.4375 0.164062) rotate(13.6245)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <p>Remarks</p>
                                    </div>

                                    <div id="main_forms_desigin_cus">
                                        <textarea
                                            value={userData?.remarks}
                                            onChange={handleRemarksChange}
                                            cols="140"
                                            rows="5"
                                            placeholder='Remarks ( for internal use )'
                                            className='textareacustomcbs'
                                        >
                                        </textarea>

                                    </div>
                                </div>
                            </>
                            }
                        </div>
                    </div>
                    <div className={`actionbar`}>
                        <button id='herobtnskls' type="submit" className={` ${tick?.basicTick ? "" : "disabledbtn"} `}>
                            {
                                cusId && isDublicate ?
                                    <p> {customer?.loading === true ? "Dublicating" : "Dublicate"}</p>
                                    :
                                    <>
                                        {cusId && isEdit ?
                                            <p> {customer?.loading === true ? "Updating" : "Update"}</p>
                                            :
                                            <p> {customer?.loading === true ? "Submiting" : "Submit"}</p>
                                        }
                                    </>
                            }
                        </button>
                        <button type='button'>Cancel</button>
                    </div>


                </DisableEnterSubmitForm>
            </div>
            <Toaster />
        </>
    );
};

export default CreateVendors;
