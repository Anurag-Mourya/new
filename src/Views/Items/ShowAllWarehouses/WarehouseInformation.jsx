import React, { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { FaMapSigns } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { GiFallingRocks } from "react-icons/gi";
import CreateItemPopup from '../CreateItemPopup';
import CreateStockPopup from '../CreateStockPopup';

const WarehouseInformation = ({ warehouseData, itemDetails }) => {

    const [warehouseListData, setWarehouseListData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [itemDetailData, setitemDetailData] = useState([]);
    // console.log("warehosue", warehouseData)

    const handleAddStock = (val) => {
        setShowPopup(true);
        setitemDetailData(val);
    }
    return (
        <>
            <div id="middlesection" >

                {/* warehouse */}
                <>

                    <div id="Anotherbox" className='inidbx1s2x21s5 Anotherbox4'>
                        <div id="leftareax12" >
                            <h1 id="firstheading" >
                                <span><SiHomeassistantcommunitystore /></span>
                                Warehouses
                            </h1>
                            <p id="firsttagp">{warehouseData?.total_quantity_by_warehouse?.length} records</p>
                        </div>
                    </div>
                    <div id="mainsectioncsls" className="commonmainqusalincetcsecion listsectionsgrheigh">
                        <div id="leftsidecontentxls">
                            <div id="item-listsforcontainer">
                                <div id="newtableofagtheme">
                                    <div className="table-headerx12">

                                        <div className="table-cellx12 quotiosalinvlisxs1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Warehouse Name</div>
                                        <div className="table-cellx12 quotiosalinvlisxs2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Quantity</div>
                                        <div className="table-cellx12 quotiosalinvlisxs2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Action</div>
                                    </div>
                                    <>
                                        {warehouseData?.total_quantity_by_warehouse?.map((quotation, index) => (
                                            <div
                                                className={`table-rowx12 selectedresult`}
                                                key={index}
                                            >

                                                <div className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.warehouse?.name}</div>
                                                <div className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.total_quantity}</div>
                                                <div onClick={() => handleAddStock(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    Adjust Stock</div>
                                            </div>
                                        ))}
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                </>


                {/* zone */}
                <>
                    <div id="Anotherbox" className='Anotherbox4'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <span><FaMapSigns /></span>
                                Zone
                            </h1>
                            <p id="firsttagp">{warehouseData?.total_quantity_by_zone?.length} records</p>
                        </div>
                    </div>
                    <div id="mainsectioncsls" className="commonmainqusalincetcsecion listsectionsgrheigh">
                        <div id="leftsidecontentxls">
                            <div id="item-listsforcontainer">
                                <div id="newtableofagtheme">
                                    <div className="table-headerx12">

                                        <div className="table-cellx12 quotiosalinvlisxs1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Zone Name</div>
                                        <div className="table-cellx12 quotiosalinvlisxs2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Warehouse</div>
                                        <div className="table-cellx12 quotiosalinvlisxs2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Quantity</div>
                                        <div className="table-cellx12 quotiosalinvlisxs2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Action</div>
                                    </div>
                                    <>
                                        {warehouseData?.total_quantity_by_zone?.map((quotation, index) => (
                                            <div
                                                className={`table-rowx12 selectedresult`}
                                                key={index}
                                            >

                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.zone?.name}</div>
                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.warehouse?.name}</div>
                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.total_quantity}</div>
                                                <div onClick={() => handleAddStock(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    Adjust Stock</div>
                                            </div>
                                        ))}
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                </>


                {/* Racks */}
                <>
                    <div id="Anotherbox" className='Anotherbox4'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <span><GiFallingRocks /></span>
                                Racks
                            </h1>
                            <p id="firsttagp">{warehouseData?.total_quantity_by_rack?.length} records</p>
                        </div>
                    </div>
                    <div id="mainsectioncsls" className="commonmainqusalincetcsecion listsectionsgrheigh">
                        <div id="leftsidecontentxls">
                            <div id="item-listsforcontainer">
                                <div id="newtableofagtheme">
                                    <div className="table-headerx12">

                                        <div className="table-cellx12 quotiosalinvlisxs1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Rack Name</div>
                                        <div className="table-cellx12 quotiosalinvlisxs1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Zone Name</div>
                                        <div className="table-cellx12 quotiosalinvlisxs1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Warehouse Name</div>
                                        <div className="table-cellx12 quotiosalinvlisxs2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Quantity</div>
                                        <div className="table-cellx12 quotiosalinvlisxs2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Action</div>
                                    </div>
                                    <>
                                        {warehouseData?.total_quantity_by_rack?.map((quotation, index) => (
                                            <div
                                                className={`table-rowx12 selectedresult`}
                                                key={index}
                                            >

                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.rack?.name}</div>

                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.zone?.name}</div>

                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.warehouse?.name}</div>
                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.total_quantity}</div>
                                                <div onClick={() => handleAddStock(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    Adjust Stock</div>
                                            </div>
                                        ))}
                                    </>


                                </div>
                            </div>
                        </div>
                    </div>
                </>


                {/* bin */}
                <>
                    <div id="Anotherbox" className='Anotherbox4'>
                        <div id="leftareax12">
                            <h1 id="firstheading">
                                <span><RiDeleteBin6Fill /></span>
                                Bins
                            </h1>
                            <p id="firsttagp">{warehouseData?.total_quantity_by_bin?.length} records</p>
                        </div>
                    </div>
                    <div id="mainsectioncsls" className="commonmainqusalincetcsecion listsectionsgrheigh">
                        <div id="leftsidecontentxls">
                            <div id="item-listsforcontainer">
                                <div id="newtableofagtheme">
                                    <div className="table-headerx12">

                                        <div className="table-cellx12 quotiosalinvlisxs1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Bin Name</div>
                                        <div className="table-cellx12 quotiosalinvlisxs1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Zone Name</div>
                                        <div className="table-cellx12 quotiosalinvlisxs1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Rack Name</div>
                                        <div className="table-cellx12 quotiosalinvlisxs1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Warehouse Name</div>

                                        <div className="table-cellx12 quotiosalinvlisxs2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Quantity</div>
                                        <div className="table-cellx12 quotiosalinvlisxs2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#5D369F"} fill={"none"}>
                                                <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Action</div>
                                    </div>
                                    <>
                                        {warehouseData?.total_quantity_by_bin?.map((quotation, index) => (
                                            <div
                                                className={`table-rowx12 selectedresult`}
                                                key={index}
                                            >

                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.bin?.name}</div>
                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.zone?.name}</div>
                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.rack?.name}</div>
                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.warehouse?.name}</div>
                                                <div onClick={() => handleRowClicked(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    {quotation?.total_quantity}</div>
                                                <div onClick={() => handleAddStock(quotation)} className="table-cellx12 quotiosalinvlisxs1">
                                                    Adjust Stock</div>
                                            </div>
                                        ))}
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            </div >

            {showPopup === true ?
                <div className="mainxpopups2">
                    <div className="popup-content02">
                        <CreateStockPopup closePopup={setShowPopup}
                            itemDetailData={itemDetailData}
                            itemDetails={itemDetails}
                        />
                    </div>
                </div> : ""
            }


        </>
    )
}

export default WarehouseInformation