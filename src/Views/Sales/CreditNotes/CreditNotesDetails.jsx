import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { Link, useNavigate } from 'react-router-dom'
import { otherIcons } from '../../Helper/SVGIcons/ItemsIcons/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { creditNotesDelete, creditNotesDetails } from '../../../Redux/Actions/notesActions';
import Loader02 from '../../../Components/Loaders/Loader02';
import { quotationStatus } from '../../../Redux/Actions/quotationActions';
import MainScreenFreezeLoader from '../../../Components/Loaders/MainScreenFreezeLoader';
import { Toaster } from 'react-hot-toast';

import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useOutsideClick from '../../Helper/PopupData';
import { generatePDF } from '../../Helper/DateFormat';

const CreditNotesDetails = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownx1, setShowDropdownx1] = useState(false);

  const creditDetails = useSelector(state => state?.creditNoteDetail);
  const credit = creditDetails?.creditDetail?.data?.CreditNote;
  const quoteStatus = useSelector(state => state?.quoteStatus);
  const creditDelete = useSelector(state => state?.creditNoteDelete);

  const dateObject = new Date(credit?.created_at);
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  useOutsideClick(dropdownRef, () => setShowDropdown(false));
  useOutsideClick(dropdownRef1, () => setShowDropdownx1(false));



  const UrlId = new URLSearchParams(location.search).get("id");

  const handleEditThing = (val) => {
    const queryParams = new URLSearchParams();
    queryParams.set("id", UrlId);

    if (val === "edit") {
      queryParams.set("edit", true);
      Navigate(`/dashboard/create-credit-note?${queryParams.toString()}`);
    }
    else if ("dublicate") {
      queryParams.set("dublicate", true);
      Navigate(`/dashboard/create-credit-note?${queryParams.toString()}`);
    }

  };



  const [callApi, setCallApi] = useState(false);
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
        dispatch(creditNotesDelete(sendData, Navigate));
      } else {
        dispatch(quotationStatus(sendData)).then(() => {
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
      dispatch(creditNotesDetails(queryParams));
    }
  }, [dispatch, UrlId, callApi]);

  const totalFinalAmount = credit?.items?.reduce((acc, item) => acc + parseFloat(item?.final_amount), 0);



  // pdf & print
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const generatePDF = () => {
  //   const input = document.getElementById('quotation-content');
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, 'PNG', 0, 0);
  //     pdf.save('quotation.pdf');
  //   });
  // };
  // pdf & print

  return (
    <>
      {quoteStatus?.loading && <MainScreenFreezeLoader />}
      {creditDelete?.loading && <MainScreenFreezeLoader />}
      {creditDetails?.loading ? <Loader02 /> :
        <div ref={componentRef} >
          <div id="Anotherbox" className='formsectionx1'>
            <div id="leftareax12">
              <h1 id="firstheading">CN-00354</h1>
            </div>
            <div id="buttonsdata">

              <div className="mainx1" onClick={() => handleEditThing("edit")}>
                <img src="/Icons/pen-clip.svg" alt="" />
                <p>Edit</p>
              </div>

              <div onClick={() => setShowDropdownx1(!showDropdownx1)} className="mainx1" ref={dropdownRef1}>
                <p>PDF/Print</p>
                {otherIcons?.arrow_svg}
                {showDropdownx1 && (
                  <div className="dropdownmenucustom">
                    <div className='dmncstomx1 primarycolortext' onClick={() => generatePDF(invoice?.items)} >
                      {otherIcons?.pdf_svg}
                      PDF</div>
                    <div className='dmncstomx1 primarycolortext' onClick={handlePrint}>
                      {otherIcons?.print_svg}
                      Print</div>

                  </div>
                )}
              </div>

              <div className="sepc15s63x63"></div>

              <div onClick={() => setShowDropdown(!showDropdown)} className="mainx2" ref={dropdownRef}>
                <img src="/Icons/menu-dots-vertical.svg" alt="" />
                {showDropdown && (
                  <div className="dropdownmenucustom">
                    {credit?.status === "1" ? (
                      <div className='dmncstomx1' onClick={() => changeStatus("decline")}>
                        {otherIcons?.cross_declined_svg}
                        Mark as declined
                      </div>
                    ) : credit?.status === "2" ? (
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
                    {/* <div className='dmncstomx1' >
                      {otherIcons?.convert_svg}
                      Convert</div> */}
                    <div className='dmncstomx1' style={{ cursor: "pointer" }} onClick={() => changeStatus("delete")}>
                      {otherIcons?.delete_svg}
                      Delete</div>
                  </div>
                )}
              </div>







              <Link to={"/dashboard/credit-notes"} className="linkx3">
                <RxCross2 />
              </Link>
            </div>
          </div>
          <div className="listsectionsgrheigh">
            <div className="commonquoatjkx54s">
              <div className="firstsecquoatjoks45">
                <div className="detailsbox4x15sfirp">
                  <img src="https://cdn-icons-png.flaticon.com/512/9329/9329876.png" alt="" />
                </div>
                <div className="detailsbox4x15s">
                  <h2>Send the credit note</h2>
                  <p>Go ahead and email this credit note to your customer or simply convert it to open</p>
                  {/* <button>Send credit note</button> */}
                  {/* <button>Convert to open</button> */}
                </div>
              </div>
            </div>

            <div className="commonquoatjkx55s" id='quotation-content'>
              <div className="childommonquoatjkx55s">
                <div className="labeltopleftx456">Sent</div>
                <div className="detailsbox4x15s1">
                  <div className="xhjksl45s">
                    <svg width="24" height="23" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg"><path d="M16.7582 0.894043L18.8566 4.51588L16.7582 8.13771H12.5615L10.4631 4.51588L12.5615 0.894043L16.7582 0.894043Z" /><path d="M6.29509 0.894043L13.5963 13.4842L11.4979 17.1061H7.30116L0 4.51588L2.09836 0.894043L6.29509 0.894043Z" /></svg>
                    <p>Accounts</p>
                  </div>
                  <div className="xhjksl45s2">
                    <h1>Credit Note</h1>
                    <span><p>Credit Note no:</p> <h3>{credit?.bill_id}</h3></span>
                    <span><p>Bill date:</p> <h3>{formattedDate}</h3></span>
                  </div>
                </div>

                <div className="cjkls5xs1">
                  <h1>Credit to:</h1>
                  <h3>{credit?.customer_name}</h3>
                  <p>
                    {(() => {
                      try {
                        const address = JSON.parse(credit?.address || '{}');
                        const shipping = address?.shipping;
                        if (!shipping) return "Address not available";

                        const { street_1, street_2, city_id, state_id, country_id } = shipping;
                        return `${street_1 || ""} ${street_2 || ""}, City ID: ${city_id || ""}, State ID: ${state_id || ""}, Country ID: ${country_id || ""}`;
                      } catch (error) {
                        console.error("Failed to parse address JSON:", error);
                        return "Address not available";
                      }
                    })()}
                  </p>
                </div>

                <div className="tablex15s56s3">
                  <div className="thaedaksx433">
                    <p className='sfdjklsd1xs2w1'>S.No</p>
                    <p className='sfdjklsd1xs2w2'>Item & Description</p>
                    <p className='sfdjklsd1xs2w3'>Qty</p>
                    <p className='sfdjklsd1xs2w4'>Rate</p>
                    <p className='sfdjklsd1xs2w5'>Amount</p>
                  </div>
                  {credit?.items?.map((val, index) => (
                    <div className="rowsxs15aksx433">
                      <p className='sfdjklsd1xs2w1'>{index + 1}</p>
                      <p className='sfdjklsd1xs2w2'>{val?.item_id || "*********"}</p>
                      <p className='sfdjklsd1xs2w3'>{val?.quantity || "*********"}</p>
                      <p className='sfdjklsd1xs2w4'>{val?.tax_amount || "*********"}</p>
                      <p className='sfdjklsd1xs2w5'>{val?.final_amount || "*********"}</p>
                    </div>
                  ))}

                </div>
                <div className="finalcalculateiosxl44s">
                  <span><p>Subtotal</p> <h5>{totalFinalAmount?.toFixed(2) || "00"}</h5></span>
                  <span><p>Total</p> <h5>{totalFinalAmount?.toFixed(2) || "00"}</h5></span>
                </div>
              </div>
            </div>
            <div className="lastseck4x5s565">
              <p>More information</p>
              <p>Sale person:    {credit?.sale_person || "*********"} </p>
            </div>
          </div>
        </div>}
      <Toaster />
    </>
  )
}


export default CreditNotesDetails;