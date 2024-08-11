import React, { useEffect, useRef, useState } from 'react'
import useOutsideClick from '../Helper/PopupData';
import { RxCross2 } from 'react-icons/rx';
import CustomDropdown10 from '../../Components/CustomDropdown/CustomDropdown10';
import { otherIcons } from '../Helper/SVGIcons/ItemsIcons/Icons';
import CustomDropdown03 from '../../Components/CustomDropdown/CustomDropdown03';
import { useDispatch, useSelector } from 'react-redux';
import { binViewAction, rackViewAction, warehouseViewAction, zoneViewAction } from '../../Redux/Actions/warehouseActions';
import { todayDate } from '../Helper/DateFormat';
import DisableEnterSubmitForm from '../Helper/DisableKeys/DisableEnterSubmitForm';
import { GRNreceiptMoveItemActions } from '../../Redux/Actions/grnActions';
import { useNavigate } from 'react-router-dom';
import MainScreenFreezeLoader from '../../Components/Loaders/MainScreenFreezeLoader';
import { Toaster } from 'react-hot-toast';

const MoveItemPopup = ({ setMoveItem, itemId }) => {
    const popupRef = useRef(null);
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const GRNitem = useSelector(state => state?.GRNitem);

    const warehouseView = useSelector(state => state?.warehouseView);
    const warehouseViews = warehouseView?.data;

    const zoneView = useSelector(state => state?.zoneView);
    const zoneViews = zoneView?.data?.data;

    const rackView = useSelector(state => state?.rackView);
    const rackViews = rackView?.data?.data;

    const binView = useSelector(state => state?.binView);
    const binViews = binView?.data?.data;

    const [formData, setFormData] = useState({
        id: itemId,
        warehouse_id: null,
        zone_id: null,
        rack_id: null,
        bin_id: null,
        transaction_date: todayDate(),
        fy: localStorage.getItem('FinancialYear'),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "warehouse_id") {
            dispatch(zoneViewAction({ warehouse_id: value }));
        } else if (name === "zone_id") {
            dispatch(rackViewAction({ zone_id: value }));
        } else if (name === "rack_id") {
            dispatch(binViewAction({ rack_id: value }));
        }
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmitCategory = async () => {
        try {
            await dispatch(GRNreceiptMoveItemActions(formData, setMoveItem));
        } catch (error) {
            console.log(false)
        }
    };

    useEffect(() => {
        dispatch(warehouseViewAction());
    }, [dispatch])

    useOutsideClick(popupRef, () => setShowPopup(false));
    return (
        <div className="mainxpopups1" ref={popupRef}>

            {GRNitem?.loading ? <MainScreenFreezeLoader /> : ""}
            <div className="popup-content">
                <span className="close-button" onClick={() => setMoveItem(false)}><RxCross2 /></span>
                <h2>Move Item</h2>

                <div className="midpopusec12x">
                    <div className="f1wrapofcreq">
                        <div className="form_commonblock">
                            <label >Warehouse<b className='color_red'>*</b></label>
                            <span id=''>
                                {otherIcons.name_svg}
                                <CustomDropdown03
                                    options={warehouseViews || []}
                                    value={formData.warehouse_id}
                                    onChange={handleChange}
                                    name="warehouse_id"
                                    defaultOption="Select Warehouse"
                                    type="categories"
                                />
                            </span>

                        </div>

                        <div className="form_commonblock">
                            <label >Select Zone<b className='color_red'>*</b></label>
                            <span id=''>
                                {otherIcons.name_svg}
                                <CustomDropdown03
                                    options={zoneViews || []}
                                    value={formData.zone_id}
                                    onChange={handleChange}
                                    name="zone_id"
                                    defaultOption="Select Zone"
                                    type="categories"
                                />
                            </span>
                        </div>
                        <div className="form_commonblock">
                            <label >Select Rack<b className='color_red'>*</b></label>
                            <span id=''>
                                {otherIcons.name_svg}
                                <CustomDropdown03
                                    options={rackViews || []}
                                    value={formData.rack_id}
                                    onChange={handleChange}
                                    name="rack_id"
                                    defaultOption="Select Rack"
                                    type="categories"
                                />
                            </span>
                        </div>
                        <div className="form_commonblock">
                            <label >Select Bin<b className='color_red'>*</b></label>
                            <span id=''>
                                {otherIcons.name_svg}
                                <CustomDropdown03
                                    options={binViews || []}
                                    value={formData.bin_id}
                                    onChange={handleChange}
                                    name="bin_id"
                                    defaultOption="Select Bin"
                                    type="categories"
                                />
                            </span>
                        </div>

                    </div>
                    <div className={`submitbuttons1  }`} onClick={() => handleSubmitCategory()}>
                        <span>
                            <p>Submit</p>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}>
                                <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15 17C15 17 20 13.3176 20 12C20 10.6824 15 7 15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <Toaster />
        </div >
    )
}

export default MoveItemPopup