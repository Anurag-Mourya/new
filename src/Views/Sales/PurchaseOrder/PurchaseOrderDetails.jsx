import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { Link, useNavigate } from 'react-router-dom'
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
// import { purchaseOrderDelete, purchaseOrderDetails, purchaseOrderStatus } from '../../../Redux/Actions/purchaseOrderActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader02 from '../../../Components/Loaders/Loader02';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import toast, { Toaster } from 'react-hot-toast';
import { formatDate, formatDate2, formatDate3, formatDate4, generatePDF } from '../../Helper/DateFormat';

import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useOutsideClick from '../../Helper/PopupData';
import { purchasesDelete, purchasesDetails, purchasesStatus } from '../../../Redux/Actions/purchasesActions';

const PurchaseOrderDetails = () => {
    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdownx1, setShowDropdownx1] = useState(false);
    const purchaseStatus = useSelector(state => state?.purchseStatus);
    const purchaseDelete = useSelector(state => state?.deletePurchase);
    const purchaseDetail = useSelector(state => state?.detailsPurchase);
    const purchase = purchaseDetail?.data?.purchaseOrder;

    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);



    useOutsideClick(dropdownRef2, () => setShowDropdown(false));
    useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));



    const UrlId = new URLSearchParams(location.search).get("id");
    const [callApi, setCallApi] = useState(false);
    const handleEditThing = (val) => {
        const queryParams = new URLSearchParams();
        queryParams.set("id", UrlId);
        if (val === "edit") {
            queryParams.set("edit", true);
            Navigate(`/dashboard/create-purchases?${queryParams.toString()}`);
        } else if (val === "convert") {
            queryParams.set("convert", "purchase_to_bill");
            Navigate(`/dashboard/create-bills?${queryParams.toString()}`);
        } else if (val === "dublicate") {
            queryParams.set("dublicate", true);
            Navigate(`/dashboard/create-purchases?${queryParams.toString()}`);
        } else if (val === "approved") {
            dispatch(purchasesStatus({ id: UrlId, status: 1 }, setCallApi))
            // .then(() => {
            //     if (purchaseStatus?.data?.message === "Purchase Order Approved Updated Successfully") {
            //         toast?.success(purchaseStatus?.data?.message);
            //         setCallApi((preState) => !preState);

            //     }
            // })
        }
    };


    const changeStatus = (statusVal) => {
        // console.log("statusVal", statusVal);
        try {
            const sendData = {
                id: UrlId
            }
            // switch (statusVal) {
            //     case 'accepted':
            //         sendData.status = 1
            //         break;
            //     case 'decline':
            //         sendData.status = 2
            //         break;
            //     default:
            // }

            if (statusVal === "delete") {
                dispatch(purchasesDelete(sendData, Navigate)).then(() => {
                    setCallApi((preState) => !preState);
                });
            }
            // else {
            //     dispatch(purchaseOrderStatus(sendData)).then(() => {
            //         setCallApi((preState) => !preState);
            //     });
            // }
        } catch (error) {
            console.log("error", error);
        }
    }


    useEffect(() => {
        if (UrlId) {
            const queryParams = {
                id: UrlId,
            };
            dispatch(purchasesDetails(queryParams));
        }
    }, [dispatch, UrlId, callApi]);

    const totalFinalAmount = purchase?.items?.reduce((acc, item) => acc + parseFloat(item?.final_amount), 0);

    // pdf & print
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // const generatePDF = () => {
    //     const input = document.getElementById('quotation-content');
    //     html2canvas(input).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF();
    //         pdf.addImage(imgData, 'PNG', 0, 0);
    //         pdf.save('quotation.pdf');
    //     });
    // };
    // pdf & print


    return (
        <>
            {purchaseDelete?.loading || purchaseStatus?.loading && <MainScreenFreezeLoader />}
            {purchaseDetail?.loading ? <Loader02 /> :
                <div ref={componentRef}>

                    <div id="Anotherbox" className='formsectionx1'>
                        <div id="leftareax12">
                            <h1 id="firstheading">{purchase?.purchase_order_id}</h1>
                        </div>
                        <div id="buttonsdata">

                            {purchase?.status == 1 || purchase?.status == 2 ? "" : <div className="mainx1 s1d2f14s2d542maix4ws" onClick={() => handleEditThing("approved")}>
                                <p>Make As Approved</p>
                            </div>}
                            {/* <div className="mainx1 s1d2f14s2d542maix4ws" onClick={() => handleEditThing("approved")} data-tooltip-place='bottom' data-tooltip-id="my-tooltip" data-tooltip-content="Edit">
                                <p>Make As Approved</p>
                            </div> */}

                            {purchase?.status == 1 || purchase?.status == 2 ? "" :
                                <div className="mainx1" onClick={() => handleEditThing("edit")} data-tooltip-place='bottom' data-tooltip-id="my-tooltip" data-tooltip-content="Edit">
                                    <img src="/Icons/pen-clip.svg" alt="" />
                                    <p>Edit</p>
                                </div>
                            }
                            <div onClick={() => setShowDropdownx1(!showDropdownx1)} className="mainx1" ref={dropdownRef1}>
                                <p >PDF/Print</p>
                                {otherIcons?.arrow_svg}
                                {showDropdownx1 && (
                                    <div className="dropdownmenucustom">
                                        <div className='dmncstomx1 primarycolortext' onClick={() => generatePDF(purchase?.items)}>
                                            {otherIcons?.pdf_svg}
                                            PDF</div>
                                        <div className='dmncstomx1 primarycolortext' onClick={handlePrint}>
                                            {otherIcons?.print_svg}
                                            Print</div>

                                    </div>
                                )}
                            </div>

                            <div className="sepc15s63x63"></div>

                            <div onClick={() => setShowDropdown(!showDropdown)} className="mainx2" ref={dropdownRef2}>
                                <img src="/Icons/menu-dots-vertical.svg" alt="" data-tooltip-place='bottom' data-tooltip-id="my-tooltip" data-tooltip-content="More Options" />
                                {showDropdown && (
                                    <div className="dropdownmenucustom">
                                        {/* {purchase?.status === "1" ? (
                                            <div className='dmncstomx1' onClick={() => changeStatus("decline")}>
                                                {otherIcons?.cross_declined_svg}
                                                Mark as declined
                                            </div>
                                        ) : purchase?.status === "2" ? (
                                            <div className='dmncstomx1' onClick={() => changeStatus("accepted")}>
                                                {otherIcons?.check_accepted_svg}
                                                Mark as accepted
                                            </div>
                                        ) : (
                                            <>
                                                <div className='dmncstomx1' onClick={() => changeStatus("decline")}>
                                                    {otherIcons?.cross_declined_svg}
                                                    Mark as declined
                                                </div>
                                                <div className='dmncstomx1' onClick={() => changeStatus("accepted")}>
                                                    {otherIcons?.check_accepted_svg}
                                                    Mark as accepted
                                                </div>
                                            </>
                                        )} */}

                                        <div className='dmncstomx1' onClick={() => handleEditThing("dublicate")}>
                                            {otherIcons?.dublicate_svg}
                                            Duplicate</div>

                                        <div className='dmncstomx1' style={{ cursor: "pointer" }} onClick={() => changeStatus("delete")}>
                                            {otherIcons?.delete_svg}
                                            Delete</div>
                                    </div>
                                )}
                            </div>
                            <Link to={"/dashboard/purchase"} className="linkx3" data-tooltip-place='bottom' data-tooltip-id="my-tooltip" data-tooltip-content="Close">
                                <RxCross2 />
                            </Link>
                        </div>
                    </div>
                    <div className="listsectionsgrheigh" id='quotation-content'>
                        {/* {purchase?.status == 2 ? "" :
                            <>
                                <div className="commonquoatjkx54s">
                                    <div className="firstsecquoatjoks45">
                                        <div className="detailsbox4x15sfirp">
                                            <img src="https://cdn-icons-png.flaticon.com/512/9329/9329876.png" alt="" />
                                        </div>
                                        <div className="detailsbox4x15s">
                                            <h2>Complete Your Purchase</h2>


                                            <p>You can create the bills and receives(in any sequence) with this order to complete your purchase.</p>
                                            <button onClick={() => handleEditThing("convert")}>
                                                Convert To Bill
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </>
                        } */}

                        <div className="commonquoatjkx55s">
                            <div className="childommonquoatjkx55s">

                                <div className="labeltopleftx456">
                                    {purchase?.status === "0" ? "Draft" : purchase?.status === "1" ? "Open" : purchase?.status == "2" ? "Closed" : purchase?.status == "3" ? "Pending" : purchase?.status == "4" ? "Overdue" : ""
                                    }
                                </div>


                                <div className="detailsbox4x15s1">
                                    <div className="xhjksl45s">
                                        <svg width="24" height="23" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg"><path d="M16.7582 0.894043L18.8566 4.51588L16.7582 8.13771H12.5615L10.4631 4.51588L12.5615 0.894043L16.7582 0.894043Z" /><path d="M6.29509 0.894043L13.5963 13.4842L11.4979 17.1061H7.30116L0 4.51588L2.09836 0.894043L6.29509 0.894043Z" /></svg>
                                        <p>Accounts</p>
                                    </div>
                                    <div className="xhjksl45s2">
                                        <h1>PURCHSE ORDER</h1>
                                        <span><p>Purchse Order No:</p> <h3>{purchase?.purchase_order_id}</h3></span>
                                        <span><p>Bill Date:</p> <h3>{formatDate4(purchase?.transaction_date)}</h3></span>
                                    </div>
                                </div>
                                <br />

                                <div className="tablex15s56s3">

                                    <div className="thaedaksx433">
                                        <p className='sfdjklsd1xs2w1'>#</p>
                                        <p className='sfdjklsd1xs2w2'>Item & Description</p>
                                        <p className='sfdjklsd1xs2w3'>Qty</p>
                                        <p className='sfdjklsd1xs2w4'>Rate</p>
                                        <p className='sfdjklsd1xs2w5'>Amount</p>
                                    </div>
                                    {purchase?.items?.map((val, index) => (
                                        <div className="rowsxs15aksx433">
                                            <p className='sfdjklsd1xs2w1'>{index + 1}</p>
                                            <p className='sfdjklsd1xs2w2'>{val?.item?.name || "*********"}</p>
                                            <p className='sfdjklsd1xs2w3'>{val?.quantity || "*********"}</p>
                                            <p className='sfdjklsd1xs2w4'>{val?.rate || "*********"}</p>
                                            <p className='sfdjklsd1xs2w5'>{val?.final_amount || "*********"}</p>
                                        </div>
                                    ))}

                                </div>
                                <div className="finalcalculateiosxl44s">
                                    <span><p>Subtotal</p> <h5>{purchase?.subtotal || "00"}</h5></span>
                                    <span><p> Adjustment Charge</p> <h5>{purchase?.adjustment_charge || "00"}</h5></span>
                                    <span><p>Shipping Charge</p> <h5>{purchase?.shipping_charge || "00"}</h5></span>
                                    <span><p>Total</p> <h5>{purchase?.total || "00"}</h5></span>
                                </div>
                            </div>
                        </div>
                        <div className="lastseck4x5s565">
                            <p>More information</p>
                            <p>Sale person:   {purchase?.sale_person || "*********"} </p>
                            <p>Vendor Note:   {purchase?.vendor_note || "*********"} </p>
                            <p>Terms And Conditions:   {purchase?.terms_and_condition || "*********"} </p>
                        </div>
                    </div>
                </div>}
            <Toaster />
        </>
    )
}

export default PurchaseOrderDetails;