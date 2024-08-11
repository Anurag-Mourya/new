import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { Link, useNavigate } from 'react-router-dom'
import { otherIcons } from '../Helper/SVGIcons/ItemsIcons/Icons';
// import { purchaseOrderDelete, purchaseOrderDetails, purchaseOrderStatus } from '../../../Redux/Actions/purchaseOrderActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader02 from '../../Components/Loaders/Loader02';
import MainScreenFreezeLoader from '../../Components/Loaders/MainScreenFreezeLoader';
import toast, { Toaster } from 'react-hot-toast';
import { formatDate, formatDate2, formatDate3, formatDate4, generatePDF } from '../Helper/DateFormat';

import { useReactToPrint } from 'react-to-print';
import useOutsideClick from '../Helper/PopupData';
import { purchasesDelete, purchasesDetails, purchasesStatus } from '../../Redux/Actions/purchasesActions';
import { GRNdeleteActions, GRNdetailsActions, GRNstatusActions } from '../../Redux/Actions/grnActions';
import ImagesCrou from '../../Components/ShowImageCarousel.jsx/ImagesCrou';

const PurchaseOrderDetails = () => {
    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdownx1, setShowDropdownx1] = useState(false);
    const grnStatus = useSelector(state => state?.GRNstatus);
    const grnDelete = useSelector(state => state?.GRNdelete);

    const GRNdetails = useSelector(state => state?.GRNdetails);
    const GRNdetail = GRNdetails?.data?.bgrnill;

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
            Navigate(`/dashboard/new-grn?${queryParams.toString()}`);
        } else if (val === "convert") {
            queryParams.set("convert", "grn_to_bill");
            Navigate(`/dashboard/create-bills?${queryParams.toString()}`);
        } else if (val === "dublicate") {
            queryParams.set("dublicate", true);
            Navigate(`/dashboard/new-grn?${queryParams.toString()}`);
        } else if (val === "approved") {
            dispatch(GRNstatusActions({ id: UrlId, status: "3" }, setCallApi))
            // .then(() => {
            //     if (grnStatus?.data?.message === "Purchase Order Approved Updated Successfully") {
            //         toast?.success(grnStatus?.data?.message);
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
                dispatch(GRNdeleteActions(sendData, Navigate))
            }
            else {
                dispatch(GRNstatusActions(sendData, setCallApi))

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
            dispatch(GRNdetailsActions(queryParams));
        }
    }, [dispatch, UrlId, callApi]);


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
    const [showImagesModal, setshowImagesModal] = useState(false);
    const [showComponent, setShowComponent] = useState(false);
    const [imagesVal, setImagesVal] = useState([]);


    const showAllImages = (val) => {
        // console.log("valeeeeeee", val);
        setImagesVal(val);
        setshowImagesModal(true);
        setShowComponent(true);

    }

    console.log("GRNdetail", GRNdetail)
    return (
        <>
            {grnDelete?.loading && <MainScreenFreezeLoader />}
            {grnStatus?.loading && <MainScreenFreezeLoader />}
            {GRNdetails?.loading ? <Loader02 /> :
                <div ref={componentRef}>

                    <div id="Anotherbox" className='formsectionx1'>
                        <div id="leftareax12">
                            <h1 id="firstheading">{GRNdetail?.grn_no}</h1>
                        </div>
                        <div id="buttonsdata">

                            {GRNdetail?.status == 1 || GRNdetail?.status == 3 ? "" : <div className="mainx1 s1d2f14s2d542maix4ws" onClick={() => handleEditThing("approved")} >
                                <p>Sent For Approval</p>
                            </div>
                            }

                            {GRNdetail?.status == 1 || GRNdetail?.status == 3 ? "" :
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
                                        <div className='dmncstomx1 primarycolortext' onClick={() => generatePDF(GRNdetail?.items)}>
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

                                        <div className='dmncstomx1' onClick={() => handleEditThing("dublicate")}>
                                            {otherIcons?.dublicate_svg}
                                            Duplicate</div>

                                        <div className='dmncstomx1' style={{ cursor: "pointer" }} onClick={() => changeStatus("delete")}>
                                            {otherIcons?.delete_svg}
                                            Delete</div>
                                    </div>
                                )}
                            </div>
                            <Link to={"/dashboard/grn"} className="linkx3" data-tooltip-place='bottom' data-tooltip-id="my-tooltip" data-tooltip-content="Close">
                                <RxCross2 />
                            </Link>
                        </div>
                    </div>

                    {/* <GrnListDetails/>*/}
                    <div className="listsectionsgrheigh" id='quotation-content'>
                        <div className="commonquoatjkx55s">
                            <div className="childommonquoatjkx55s">

                                <div className={GRNdetail?.status == 0 ? 'convertedClassName' : GRNdetail?.status == 1 ? 'approvedClassName' : GRNdetail?.status == 2 ? 'declinedClassName' : GRNdetail?.status == 3 ? 'sentClassName' : GRNdetail?.status == 4 ? 'convertedClassName' : 'defaultClassName'} >

                                    {GRNdetail?.status === "0" ? "Draft" : GRNdetail?.status === "1" ? "Bill Created" : GRNdetail?.status == "2" ? "Decline" : GRNdetail?.status == "3" ? "Sent For Approval" : GRNdetail?.status == "4" ? "Overdue" : ""}

                                </div>


                                <div className="detailsbox4x15s1">
                                    <div className="xhjksl45s">
                                        <svg width="24" height="23" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg"><path d="M16.7582 0.894043L18.8566 4.51588L16.7582 8.13771H12.5615L10.4631 4.51588L12.5615 0.894043L16.7582 0.894043Z" /><path d="M6.29509 0.894043L13.5963 13.4842L11.4979 17.1061H7.30116L0 4.51588L2.09836 0.894043L6.29509 0.894043Z" /></svg>
                                        <p>GOODS RECEIVED NOTE</p>
                                    </div>
                                    <div className="xhjksl45s2">
                                        <h1>GRN</h1>
                                        <span><p>GRN No: </p> <h3>{GRNdetail?.grn_no}</h3></span>
                                        <span><p>Bill Date: </p> <h3>{formatDate4(GRNdetail?.transaction_date)}</h3></span>
                                    </div>
                                </div>
                                <br />

                                <div className="tablex15s56s3">

                                    <div className="thaedaksx433">
                                        <p className='sfdjklsd1xs2w1'>#</p>
                                        <p className='sfdjklsd1xs2w2'>Item & Description</p>
                                        <p className='sfdjklsd1xs2w4'>Rate</p>
                                        {GRNdetail?.purchase_order && <p className='sfdjklsd1xs2w3'>PO QTY</p>}
                                        <p className='sfdjklsd1xs2w3'>GRN QTY</p>
                                        <p className='sfdjklsd1xs2w3'>CHARGES WEIGHT</p>
                                        <p className='sfdjklsd1xs2w3'>TAX RATE</p>
                                        <p className='sfdjklsd1xs2w3'>CUSTOM DUTY</p>
                                        <p className='sfdjklsd1xs2w5'>FINAL AMOUNT</p>
                                        <p className='sfdjklsd1xs2w5'>ATTACHAMENTS</p>
                                    </div>

                                    {GRNdetail?.items?.map((val, index) => (
                                        <div className="rowsxs15aksx433">
                                            <p className='sfdjklsd1xs2w1'>{index + 1}</p>
                                            <p className='sfdjklsd1xs2w2'>{val?.item?.name || ""}</p>
                                            <p className='sfdjklsd1xs2w4'>{val?.rate || ""}</p>
                                            <p className='sfdjklsd1xs2w3'>{val?.po_qty || ""}</p>
                                            <p className='sfdjklsd1xs2w3'>{val?.gr_qty || ""}</p>
                                            <p className='sfdjklsd1xs2w3'>{val?.charges_weight || ""}</p>
                                            <p className='sfdjklsd1xs2w3'>{val?.tax_rate || ""}</p>
                                            <p className='sfdjklsd1xs2w3'>{val?.custom_duty || ""}</p>
                                            <p className='sfdjklsd1xs2w5'>{val?.final_amount || ""}</p>

                                            <p style={{ cursor: 'pointer' }} className='sfdjklsd1xs2w4' onClick={() => showAllImages(JSON.parse(val?.upload_image))}>{(JSON.parse(val?.upload_image))?.length > 1 ? `${(JSON.parse(val?.upload_image))?.length} Images` : `${(JSON.parse(val?.upload_image))?.length < 1 ? `Nil` : (JSON.parse(val?.upload_image))?.length} Image`}</p>

                                        </div>
                                    ))}
                                </div>

                                <br></br>
                                <div className="tablex15s56s3">
                                    <h2>Charges</h2>
                                    <div className="thaedaksx433">
                                        <p className='sfdjklsd1xs2w1'>#</p>
                                        <p className='sfdjklsd1xs2w2'>Account Name</p>
                                        <p className='sfdjklsd1xs2w2'>Vendor Name</p>
                                        <p className='sfdjklsd1xs2w4'>Amount</p>
                                        <p className='sfdjklsd1xs2w3'>Remark</p>
                                        <p className='sfdjklsd1xs2w3'>Attachments</p>
                                    </div>

                                    {GRNdetail?.charges?.map((val, index) => (
                                        <div className="rowsxs15aksx433" id='rowsxs15aksx433'>
                                            <p className='sfdjklsd1xs2w1'>{index + 1}</p>
                                            <p className='sfdjklsd1xs2w2'>{val?.account?.account_name || ""}</p>
                                            <p className='sfdjklsd1xs2w2'>{(val?.vendor?.first_name || "") + (val?.vendor?.last_name || "")}</p>
                                            <p className='sfdjklsd1xs2w4'>{val?.amount || ""}</p>
                                            <p className='sfdjklsd1xs2w3'>{val?.remarks || ""}</p>
                                            <p style={{ cursor: "pointer" }} className='sfdjklsd1xs2w4' onClick={() => showAllImages(JSON.parse(val?.upload_image))}>{(JSON.parse(val?.upload_image))?.length > 1 ? `${(JSON.parse(val?.upload_image))?.length} Images` : `${(JSON.parse(val?.upload_image))?.length < 1 ? `Nil` : (JSON.parse(val?.upload_image))?.length} Image`}</p>
                                        </div>
                                    ))}

                                </div>
                                <div className="finalcalculateiosxl44s">
                                    <span><p>Subtotal</p> <h5>{GRNdetail?.subtotal || "00"}</h5></span>
                                    <span><p> Adjustment Charge</p> <h5>{GRNdetail?.adjustment_charge || "00"}</h5></span>
                                    <span><p> Total Charge</p> <h5>{GRNdetail?.total_grn_charges || "00"}</h5></span>
                                    <span><p>Total</p> <h5>{GRNdetail?.total || "00"}</h5></span>
                                </div>
                            </div>
                        </div>
                        <div className="lastseck4x5s565">
                            <p>More information</p>
                            <p>Vendor Note:   {GRNdetail?.vendor_note == 0 ? "" : GRNdetail?.vendor_note || ""} </p>
                            <p>Terms And Conditions:   {GRNdetail?.terms_and_condition == 0 ? "" : GRNdetail?.terms_and_condition || ""} </p>
                        </div>
                    </div>
                </div>
            }

            {showComponent && (
                <ImagesCrou
                    showModal={showImagesModal}
                    closeModal={setshowImagesModal}
                    images={imagesVal}
                />
            )}
            <Toaster />
        </>
    )
}

export default PurchaseOrderDetails;
