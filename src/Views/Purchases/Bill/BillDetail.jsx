import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { Link, useNavigate } from 'react-router-dom'
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { invoiceDetailes, invoicesDelete, invoicesStatus } from '../../../Redux/Actions/invoiceActions';
import Loader02 from '../../../Components/Loaders/Loader02';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import toast, { Toaster } from 'react-hot-toast';
import { formatDate, formatDate2, formatDate3, generatePDF } from '../../Helper/DateFormat';
import { billDeletes, billDetails, billStatus } from '../../../Redux/Actions/billActions';
import useOutsideClick from '../../Helper/PopupData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';
const BillDetail = () => {
    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const invoiceDetail = useSelector(state => state?.billDetail);
    const invoiceStatus = useSelector(state => state?.billStatuses);
    const billDelete = useSelector(state => state?.billDelete);
    const invoice = invoiceDetail?.data?.bill;

    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdownx1, setShowDropdownx1] = useState(false);
    const [showDropdownx2, setShowDropdownx2] = useState(false);

    const dropdownRef = useRef(null);
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);


    useOutsideClick(dropdownRef2, () => setShowDropdown(false));
    useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));
    useOutsideClick(dropdownRef, () => setShowDropdownx2(false));




    const UrlId = new URLSearchParams(location.search).get("id");
    const [callApi, setCallApi] = useState(false);

    const handleEditThing = (val) => {
        const queryParams = new URLSearchParams();
        queryParams.set("id", UrlId);

        if (val === "edit") {
            queryParams.set(val, true);
            Navigate(`/dashboard/create-bills?${queryParams.toString()}`);
        } else if (val == "dublicate") {
            queryParams.set(val, true);
            Navigate(`/dashboard/create-bills?${queryParams.toString()}`);
        } else if (val === "convert") {
            queryParams.set(val, "bill_to_payment");
            Navigate(`/dashboard/create-payment-made?${queryParams.toString()}`);
        }

    };

    const changeStatus = (statusVal) => {
        try {
            const sendData = {
                id: UrlId
            }
            switch (statusVal) {
                case 'accepted':
                    sendData.status = 1
                    break;
                case 'decline':
                    sendData.status = 2
                    break;
                default:
            }

            if (statusVal === "delete") {
                dispatch(billDeletes(sendData, Navigate));
            } else {
                dispatch(billStatus(sendData)).then(() => {
                    setCallApi((preState) => !preState);
                });
            }

        } catch (error) {
            console.log("error", error);
        }
    }


    useEffect(() => {
        if (UrlId) {
            const queryParams = {
                id: UrlId,
            };
            dispatch(billDetails(queryParams));
        }
    }, [dispatch, UrlId, callApi]);

    const totalFinalAmount = invoice?.items?.reduce((acc, item) => acc + parseFloat(item?.final_amount), 0);



    // const generatePDF = () => {
    //     const input = document.getElementById('quotation-content');
    //     html2canvas(input).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF();
    //         pdf.addImage(imgData, 'PNG', 0, 0);
    //         pdf.save('quotation.pdf');
    //     });
    // };

    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <>
            {/* {invoiceStatus?.loading && <MainScreenFreezeLoader />} */}
            {billDelete?.loading || invoiceStatus?.loading && <MainScreenFreezeLoader />}
            {invoiceDetail?.loading ? <Loader02 /> :
                <div ref={componentRef} >
                    <Toaster />
                    <div id="Anotherbox" className='formsectionx1'>
                        <div id="leftareax12">
                            <h1 id="firstheading">{invoice?.bill_no}</h1>
                        </div>
                        <div id="buttonsdata">

                            {/* {invoice?.status == 1 ? "" : <div className="mainx1 s1d2f14s2d542maix4ws" onClick={() => handleEditThing("approved")} >
                                <p>Make As Approved</p>
                            </div>} */}

                            {
                                invoice?.status == 1 ? "" :
                                    <div className="mainx1" onClick={() => handleEditThing("edit")}>
                                        <img src="/Icons/pen-clip.svg" alt="" />
                                        <p>Edit</p>
                                    </div>
                            }
                            <div onClick={() => setShowDropdownx1(!showDropdownx1)} className="mainx1" ref={dropdownRef1}>
                                <p>PDF/Print</p>
                                {otherIcons?.arrow_svg}
                                {showDropdownx1 && (
                                    <div className="dropdownmenucustom">
                                        <div className='dmncstomx1 primarycolortext' onClick={() => generatePDF(invoice?.items)}>
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
                                        {invoice?.status === "1" ? (
                                            <div className='dmncstomx1' onClick={() => changeStatus("decline")}>
                                                {otherIcons?.cross_declined_svg}
                                                Mark as declined
                                            </div>
                                        ) : invoice?.status === "2" ? (
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
                                        )}

                                        <div className='dmncstomx1' onClick={() => handleEditThing("dublicate")}>
                                            {otherIcons?.dublicate_svg}
                                            Duplicate</div>

                                        <div className='dmncstomx1' style={{ cursor: "pointer" }} onClick={() => changeStatus("delete")}>
                                            {otherIcons?.delete_svg}
                                            Delete</div>
                                    </div>
                                )}

                            </div>

                            <Link to={"/dashboard/bills"} className="linkx3" data-tooltip-place='bottom' data-tooltip-id="my-tooltip" data-tooltip-content="Close" >
                                <RxCross2 />
                            </Link>
                        </div>
                    </div>
                    <div className="">
                        <div className="commonquoatjkx54s">
                            <div className="firstsecquoatjoks45">
                                <div className="detailsbox4x15sfirp">
                                    <img src="https://cdn-icons-png.flaticon.com/512/9329/9329876.png" alt="" />
                                </div>
                                <div className="detailsbox4x15s">
                                    <h2>Complete Your Payment</h2>
                                    <p>You can create the payment  with this order to complete your bill.</p>
                                    <button onClick={() => handleEditThing("convert")}>
                                        Create A Payment

                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="commonquoatjkx55s" id='quotation-content'>
                            <div className="childommonquoatjkx55s">
                                <div className=
                                    {
                                        invoice?.status == 0 ? 'convertedClassName' : invoice?.status == 1 ? 'approvedClassName' : invoice?.status == 2 ? 'declinedClassName' : invoice?.status == 3 ? 'sentClassName' : invoice?.status == 4 ? 'convertedClassName' : 'defaultClassName'
                                    }
                                >

                                    {invoice?.status === "0" ? "Draft" : invoice?.status === "1" ? "Open" : invoice?.status == "2" ? "Decline" : invoice?.status == "3" ? "Pending" : invoice?.status == "4" ? "Overdue" : ""
                                    }

                                </div>
                                <div className="detailsbox4x15s1">
                                    <div className="xhjksl45s">
                                        <svg width="24" height="23" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg"><path d="M16.7582 0.894043L18.8566 4.51588L16.7582 8.13771H12.5615L10.4631 4.51588L12.5615 0.894043L16.7582 0.894043Z" /><path d="M6.29509 0.894043L13.5963 13.4842L11.4979 17.1061H7.30116L0 4.51588L2.09836 0.894043L6.29509 0.894043Z" /></svg>
                                        <p>Accounts</p>
                                    </div>
                                    <div className="xhjksl45s2">
                                        <h1>BILL</h1>
                                        <span><p>Bill Number:</p> <h3>{invoice?.bill_no}</h3></span>
                                        <span><p>Bill Date:</p> <h3> {formatDate3(invoice?.transaction_date)}</h3></span>
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
                                    {invoice?.items?.map((val, index) => (
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
                                    <span><p>Subtotal</p> <h5>{invoice?.subtotal || "00"}</h5></span>
                                    <span><p> Adjustment Charge</p> <h5>{invoice?.adjustment_charge || "00"}</h5></span>
                                    <span><p>Shipping Charge</p> <h5>{invoice?.shipping_charge || "00"}</h5></span>
                                    <span><p>Total</p> <h5>{invoice?.total || "00"}</h5></span>
                                </div>
                            </div>
                        </div>
                        {/* <div className="lastseck4x5s565">
                            <p>More Information</p>
                            <p>Sale Person: {invoice?.sale_person || "*********"} </p>
                        </div> */}
                    </div>
                </div>}
            <Toaster />
        </>
    )
}

export default BillDetail;