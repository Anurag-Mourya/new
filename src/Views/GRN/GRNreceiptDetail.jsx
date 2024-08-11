import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader02 from "../../Components/Loaders/Loader02";
import { activeInActive, itemDetails, deleteItems } from "../../Redux/Actions/itemsActions";
import { RxCross2 } from 'react-icons/rx';
import { InsideGrnDetailsBox } from '../Items/InsideItemDetailsBox';
import toast, { Toaster } from 'react-hot-toast';
import MainScreenFreezeLoader from '../../Components/Loaders/MainScreenFreezeLoader';
import MoveItemPopup from './MoveItemPopup';
import { GRNreceipDetailsActions } from '../../Redux/Actions/grnActions';

const GRNreceiptDetail = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const itemId = new URLSearchParams(location.search).get("id");

    const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown visibility
    const item_detail = useSelector(state => state?.GRNreceptDetail || {});
    const item_details = item_detail?.data?.grn_items
    const deletedItem = useSelector(state => state?.deleteItem);
    const GRNdetails = useSelector(state => state?.GRNdetails);
    const [switchValue, setSwitchValue] = useState(""); // State for the switch button value
    const dropdownRef = useRef(null); // Ref to the dropdown element
    const status = useSelector(state => state?.status);

    const [moveItem, setMoveItem] = useState(false);

    useEffect(() => {
        if (itemId) {
            const queryParams = {
                id: itemId,
                fy: localStorage.getItem('FinancialYear'),
            };
            dispatch(GRNreceipDetailsActions(queryParams));
        }
    }, [dispatch, itemId]);


    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };


    const handleEditThing = (val) => {
        const queryParams = new URLSearchParams();
        // queryParams.set("id", UrlId);

        if (val === "move") {
            setMoveItem(true);
        } else if (val == "dublicate") {
            queryParams.set(val, true);
            Navigate(`/dashboard/create-bills?${queryParams.toString()}`);
        } else if (val === "convert") {
            queryParams.set(val, "bill_to_payment");
            Navigate(`/dashboard/create-payment-made?${queryParams.toString()}`);
        } else if (val === "approved") {
            dispatch(billStatus({ id: UrlId, status: 1 }, setCallApi))
        }

    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>

            {deletedItem?.loading && <MainScreenFreezeLoader />}
            {status?.loading && <MainScreenFreezeLoader />}

            <Toaster />
            {/* {
                item_detail?.loading ? "<Loader02 />" : */}

            <>
                <div id="Anotherbox" className='formsectionx1'>
                    <div id="leftareax12">
                        <h1 id="firstheading">{item_details?.grn?.grn_no}</h1>
                    </div>
                    <div id="buttonsdata">

                        <div className="mainx1 s1d2f14s2d542maix4ws" onClick={() => handleEditThing("move")} >
                            <p>Move Item</p>
                        </div>


                        {/* <div className="mainx1" onClick={() => handleEditThing("edit")} style={{ border: "1px solid #4f4f4f63", background: 'white' }}>
                            <img src="/Icons/pen-clip.svg" alt="" />
                            <p>Edit</p>
                        </div> */}

                        {/* <div className="mainx1" style={{ border: "1px solid red", background: 'white' }}>
                            <p>Delete</p>
                        </div> */}

                        <Link to={"/dashboard/grn_receipt"} className="linkx3" data-tooltip-place='bottom' data-tooltip-id="my-tooltip" data-tooltip-content="Close" >
                            <RxCross2 />
                        </Link>
                    </div>
                </div>

                <div id="item-details">
                    <InsideGrnDetailsBox itemDetails={item_details} />
                </div>

                {moveItem && <MoveItemPopup setMoveItem={setMoveItem} itemId={itemId} />}

            </>
            {/* } */}
        </>
    );
};

export default GRNreceiptDetail;
