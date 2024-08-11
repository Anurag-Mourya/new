import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader02 from "../../Components/Loaders/Loader02";
import { activeInActive, itemDetails, deleteItems } from "../../Redux/Actions/itemsActions";
import { RxCross2 } from 'react-icons/rx';
import InsideItemDetailsBox, { InsideWarehouseDetailsBox } from '../Items/InsideItemDetailsBox';
import toast, { Toaster } from 'react-hot-toast';
import MainScreenFreezeLoader from '../../Components/Loaders/MainScreenFreezeLoader';
import { otherIcons } from '../Helper/SVGIcons/ItemsIcons/Icons';
import newmenuicoslz from '../../assets/outlineIcons/othericons/newmenuicoslz.svg';
import MoveItemPopup from '../GRN/MoveItemPopup';
import { GRNdetailsActions } from '../../Redux/Actions/grnActions';
import { warehouseDetailAction } from '../../Redux/Actions/warehouseActions';

const WarehouseDetail = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const Navigate = useNavigate();
    const itemId = new URLSearchParams(location.search).get("id");

    const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown visibility
    const item_detail = useSelector(state => state?.itemDetail);
    const { item_details, stock_details, preferred_vendor, purchase_account, sale_account } = useSelector(state => state?.itemDetail?.itemsDetail?.data || {});
    const deletedItem = useSelector(state => state?.deleteItem);
    const GRNdetails = useSelector(state => state?.GRNdetails);

    const warehouseDetails = useSelector(state => state?.warehouseDetail);
    const warehouseDetail = warehouseDetails?.data;
    const [switchValue, setSwitchValue] = useState(""); // State for the switch button value
    const dropdownRef = useRef(null); // Ref to the dropdown element
    const status = useSelector(state => state?.status);

    const [moveItem, setMoveItem] = useState(false);

    useEffect(() => {
        if (itemId) {
            const queryParams = {
                warehouse_id: itemId,
                // fy: localStorage.getItem('FinancialYear'),
            };
            dispatch(warehouseDetailAction(queryParams));
        }
    }, [dispatch, itemId]);

    useEffect(() => {
        setSwitchValue(item_details?.active);
    }, [item_details]);

    const handleSwitchChange = (e) => {
        const newValue = e.target.value;
        setSwitchValue(newValue);
        if (itemId) {
            const sendData = {
                item_id: itemId,
                active: newValue
            }
            dispatch(activeInActive(sendData))
                .then(() => {
                    const toastMessage = newValue === '1' ? 'Item is now active' : 'Item is now inactive';
                    toast.success(toastMessage);
                })
                .catch((error) => {
                    toast.error('Failed to update item status');
                    console.error('Error updating item status:', error);
                    // Revert switch value if there's an error
                    setSwitchValue((prevValue) => prevValue === '1' ? '0' : '1');
                });
        }
    };

    const deleteItemsHandler = () => {
        if (itemId) {
            dispatch(deleteItems({ item_id: itemId }, Navigate));
        }
    }

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };


    const handleEditThing = (val) => {
        const queryParams = new URLSearchParams();
        // queryParams.set("id", UrlId);

        if (val === "move") {
            // setMoveItem(true);
        } else if (val == "dublicate") {
            queryParams.set(val, true);
            Navigate(`/dashboard/create-bills?${queryParams.toString()}`);
        } else if (val === "convert") {
            queryParams.set(val, "bill_to_payment");
            Navigate(`/dashboard/create-payment-made?${queryParams.toString()}`);
        } else if (val === "approved") {
            dispatch(billStatus({ id: itemId, status: 1 }, setCallApi))
        } else if (val === "edit") {
            queryParams.set("edit", true);
            queryParams.set("id", itemId);
            Navigate(`/dashboard/create-warehouse?${queryParams.toString()}`);
        }

    };


    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEditItems = () => {
        const queryParams = new URLSearchParams();
        queryParams.set("id", itemId);
        queryParams.set("edit", true);
        navigate(`/dashboard/create-items?${queryParams.toString()}`);
    };
    const handleDublicateItems = () => {
        const queryParams = new URLSearchParams();
        queryParams.set("id", itemId);
        queryParams.set("dublicate", true);
        navigate(`/dashboard/create-items?${queryParams.toString()}`);
    };

    // console.log("warehouseDetail", warehouseDetail)
    return (
        <>

            {deletedItem?.loading && <MainScreenFreezeLoader />}
            {status?.loading && <MainScreenFreezeLoader />}

            <Toaster />
            {/* {
                item_detail?.loading ? "<Loader02 />" : */}
            {warehouseDetails?.loading ? <Loader02 /> :
                <>
                    <div id="Anotherbox" className='formsectionx1'>
                        <div id="leftareax12">
                            <h1 id="firstheading">{warehouseDetail?.data?.name}</h1>
                        </div>
                        <div id="buttonsdata">

                            {
                                warehouseDetail?.data?.is_active === "1" ?
                                    <div className="mainx1 s1d2f14s2d542maix4ws" onClick={() => handleEditThing("move")} >
                                        <p>Active</p>
                                    </div> :
                                    <div className="mainx1 s1d2f14s2d542maix5ws" onClick={() => handleEditThing("move")} >
                                        <p>Inactive</p>
                                    </div>
                            }




                            <div className="mainx1" onClick={() => handleEditThing("edit")} style={{ border: "1px solid #4f4f4f63", background: 'white' }}>
                                <img src="/Icons/pen-clip.svg" alt="" />
                                <p>Edit</p>
                            </div>

                            {/* <div className="mainx1" style={{ border: "1px solid red", background: 'white' }}>
                            <p>Delete</p>
                        </div> */}

                            <Link to={"/dashboard/warehouse"} className="linkx3" data-tooltip-place='bottom' data-tooltip-id="my-tooltip" data-tooltip-content="Close" >
                                <RxCross2 />
                            </Link>
                        </div>
                    </div>

                    <div id="item-details">
                        <InsideWarehouseDetailsBox itemDetails={warehouseDetail} />
                    </div>

                    {moveItem && <MoveItemPopup setMoveItem={setMoveItem} />}

                </>
            }
            {/* } */}
        </>
    );
};

export default WarehouseDetail;
