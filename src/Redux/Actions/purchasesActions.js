import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    PURCHASES_CREATE_REQUEST,
    PURCHASES_CREATE_SUCCESS,
    PURCHASES_CREATE_ERROR,

    PURCHASES_DETAIL_REQUEST,
    PURCHASES_DETAIL_SUCCESS,
    PURCHASES_DETAIL_ERROR,

    PURCHASES_DELETE_REQUEST,
    PURCHASES_DELETE_SUCCESS,
    PURCHASES_DELETE_ERROR,

    PURCHASES_SEND_REQUEST,
    PURCHASES_SEND_SUCCESS,
    PURCHASES_SEND_ERROR,

    PURCHASES_STATUS_REQUEST,
    PURCHASES_STATUS_SUCCESS,
    PURCHASES_STATUS_ERROR,
} from '../Constants/purchasesConstants.js';
import SendMail from '../../Components/SendMail/SendMail.jsx';
import Swal from 'sweetalert2';
import { billStatus } from './billActions.js';
import { GRNstatusActions } from './grnActions.js';
const queryParams = new URLSearchParams();

export const createPurchases = (queryParams, Navigate, section, editDub, buttonName, itemId, convert) => async (dispatch) => {
    dispatch({ type: PURCHASES_CREATE_REQUEST });
    console.log("buttonName", buttonName)
    try {
        const response = await axiosInstance.post(`/purchase/create/update`, queryParams);

        dispatch({ type: PURCHASES_CREATE_SUCCESS, payload: response.data });

        if (response?.data?.message === "Transaction Created Successfully") {
            if (section === "purchase" && !editDub && buttonName === "saveAndSend") {

                const sendData = {
                    id: response?.data?.transaction?.id,
                    status: 1
                };
                await dispatch(purchasesStatus(sendData, "")); // Dispatch purchasesStatus with sendData
            } else if (section === "purchase" && editDub && buttonName === "saveAndSend") {
                const sendData = {
                    id: response?.data?.transaction?.id,
                    status: 1
                };
                await dispatch(purchasesStatus(sendData, "")); // Dispatch purchasesStatus with sendData
            }

            let confirmed = null;
            if (buttonName === "saveAndSend" && confirmed === null) {
                const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: 'Do you want to send this purchase?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                });

                if (result.isConfirmed) {
                    confirmed = true;
                } else {
                    confirmed = false;
                }
            }


            //purchase in create
            if (section === "purchase" && !editDub && buttonName === "saveAndSend" && confirmed === true) {
                const queryParams = new URLSearchParams();
                queryParams.set("purchase_send", true);
                Navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data } });
            } else if (section === "purchase" && !editDub && buttonName === "saveAndSend" && confirmed === false) {
                toast.success("Purchase Order Saved As Open");
                Navigate(`/dashboard/purchase`)
            } else if (section === "purchase" && !editDub && buttonName === "saveAsDraft") {
                Navigate(`/dashboard/purchase`)
                toast.success("Purchase Order Saved As Draft");

                //purchase in update 
            } else if (section === "purchase" && editDub && buttonName === "saveAndSend" && confirmed === true) {
                const queryParams = new URLSearchParams();
                queryParams.set("purchase_send", true);
                Navigate(`/dashboard/send_mail?${queryParams.toString()}`, { state: { data: response?.data } });
            } else if (section === "purchase" && editDub && buttonName === "saveAndSend" && confirmed === false) {
                toast.success("Purchase Order Updated As Open");
                Navigate(`/dashboard/purchase`)
            } else if (section === "purchase" && editDub && buttonName === "saveAsDraft") {
                Navigate(`/dashboard/purchase`)
                toast.success("Purchase Order Saved As Draft");
            }


            //bills in create
            if (section === "bills" && buttonName === "saveAsDraft" && !editDub && !convert) {
                toast?.success("Bill Saved As Draft")
                Navigate(`/dashboard/bills`);
            } else if (section === "bills" && buttonName === "saveAndOpen" && !editDub && !convert) {

                const sendBillData = {
                    id: response?.data?.transaction?.id,
                    status: 1
                }
                await dispatch(billStatus(sendBillData, ""))
                toast.success("Bill Created As Open");
                Navigate(`/dashboard/bill-details?id=${sendBillData?.id}`);

                // bill in update
            } else if (section === "bills" && buttonName === "saveAsDraft" && editDub && !convert) {
                toast?.success("Bill Updated As Draft")
                Navigate(`/dashboard/bills`);
            } else if (section === "bills" && buttonName === "saveAndOpen" && editDub && !convert) {
                const sendBillData = {
                    id: response?.data?.transaction?.id,
                    status: 1
                }
                await dispatch(billStatus(sendBillData, ""))
                toast.success("Bill Updated As Open");
                Navigate(`/dashboard/bill-details?id=${sendBillData?.id}`);
            }

            // bill in convert
            if (section === "bills" && buttonName === "saveAsDraft" && !editDub && convert) {
                const sendData = {
                    id: itemId,
                    status: 2
                };
                await dispatch(purchasesStatus(sendData, ""));
                toast.success("Convert As Draft");
                Navigate(`/dashboard/bills`);
            } else if (section === "bills" && buttonName === "saveAndOpen" && !editDub && convert) {
                const sendBillData = {
                    id: response?.data?.transaction?.id,
                    status: 1
                }
                await dispatch(billStatus(sendBillData, ""));
                const sendPurchaseData = {
                    id: itemId,
                    status: 2
                };
                if (convert === "grn_to_bill") {
                    await dispatch(GRNstatusActions(sendPurchaseData));
                } else {
                    await dispatch(purchasesStatus(sendPurchaseData, ""));
                }
                toast.success("Convert As Open");
                Navigate(`/dashboard/bill-details?id=${sendBillData?.id}`);

            }
            // toast.success("Purchase Order Convert Successfully")
        } else {
            toast.error(response?.data?.message);
        }

    } catch (error) {
        dispatch({ type: PURCHASES_CREATE_ERROR, payload: error.message });
        toast.error(error.message);
    }
};

export const purchasesStatus = (queryParams, setCallApi) => async (dispatch) => {
    dispatch({ type: PURCHASES_STATUS_REQUEST });
    try {
        const response = await axiosInstance.post(`/purchase-order/status`, queryParams);

        dispatch({ type: PURCHASES_STATUS_SUCCESS, payload: response.data });


        if (setCallApi) {
            if (response?.data?.message === "Purchase Order Approved Updated Successfully") {
                toast.success(response?.data?.message);
                setCallApi((preState) => !preState);
            } else {
                toast.error(response?.data?.message);
            }
        }

    } catch (error) {
        dispatch({ type: PURCHASES_STATUS_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};




export const purchasesDetails = (queryParams, setDetail_api_data) => async (dispatch) => {
    // console.log("queryParams", queryParams)
    dispatch({ type: PURCHASES_DETAIL_REQUEST });
    try {
        const response = await axiosInstance.post(`/purchase-order/details`,
            queryParams
        );

        dispatch({ type: PURCHASES_DETAIL_SUCCESS, payload: response.data });

        if (response?.data?.purchaseOrder) {
            setDetail_api_data(response?.data?.purchaseOrder)
        }

    } catch (error) {
        dispatch({ type: PURCHASES_DETAIL_ERROR, payload: error.message });
    }
};


export const purchasesDelete = (queryParams) => async (dispatch) => {
    // console.log("queryParams", queryParams)
    dispatch({ type: PURCHASES_DELETE_REQUEST });
    try {
        const response = await axiosInstance.post(`/purchase-order/delete`,
            queryParams
        );

        dispatch({ type: PURCHASES_DELETE_SUCCESS, payload: response.data });

        if (response?.data?.message === "Transaction Created Successfully") {
            toast.success(response?.data?.message)
        } else {
            toast.error(response?.data?.message)
        }

    } catch (error) {
        dispatch({ type: PURCHASES_DELETE_ERROR, payload: error.message });
        toast.error(error?.message)
    }
};


export const purchasesSendMail = (queryParams, Navigate) => async (dispatch) => {
    // console.log("queryParams", queryParams)
    dispatch({ type: PURCHASES_SEND_REQUEST });
    try {
        const response = await axiosInstance.post(`/purchase-order/send`,
            queryParams
        );

        dispatch({ type: PURCHASES_SEND_SUCCESS, payload: response.data });

        if (response?.data?.message === "Purchase Order sent Successfully") {
            toast.success(response?.data?.message)
            Navigate('/dashboard/purchase');
        } else {
            toast.error(response?.data?.message)
        }
        // console.log("response", response);
    } catch (error) {
        dispatch({ type: PURCHASES_SEND_ERROR, payload: error.message });
        toast.error(error?.message)
    }
};

