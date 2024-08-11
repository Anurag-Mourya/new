import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    PAYMENT_CREATE_REQUEST,
    PAYMENT_CREATE_SUCCESS,
    PAYMENT_CREATE_ERROR,

    PAYMENT_DETAIL_REQUEST,
    PAYMENT_DETAIL_SUCCESS,
    PAYMENT_DETAIL_ERROR,

    PAYMENT_DELETE_REQUEST,
    PAYMENT_DELETE_SUCCESS,
    PAYMENT_DELETE_ERROR,

    FETCH_PAYMENT_REC_LIST_DATA_REQUEST,
    FETCH_PAYMENT_REC_LIST_DATA_SUCCESS,
    FETCH_PAYMENT_REC_LIST_DATA_FAILURE,

} from '../Constants/paymentConstatnt';


export const updatePaymentRec = (quotationData, Navigate, val) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_CREATE_REQUEST });

        const { data } = await axiosInstance.post(
            `/payment/create/update`,
            quotationData
        );

        dispatch({
            type: PAYMENT_CREATE_SUCCESS,
            payload: {
                data
            },
        });

        if (data?.message === "Payment has been added.") {
            toast.success(data?.message);
            if (val === "payment_made") {
                Navigate("/dashboard/payment-made")
            } else if (val === "payment_rec") {
                Navigate("/dashboard/payment-recieved")
            }
            // Navigate("/dashboard/payment-recieved")
        } else {
            toast.error(data?.message);
        }


    } catch (error) {
        dispatch({ type: PAYMENT_CREATE_ERROR, payload: error.message });
    }
};


export const paymentRecList = (quotationData) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PAYMENT_REC_LIST_DATA_REQUEST });

        const { data } = await axiosInstance.post(
            `/payments/list`,
            quotationData
        );

        dispatch({
            type: FETCH_PAYMENT_REC_LIST_DATA_SUCCESS,
            payload: {
                data
            },
        });

    } catch (error) {
        dispatch({ type: FETCH_PAYMENT_REC_LIST_DATA_FAILURE, payload: error.message });
    }
};


export const paymentRecDetail = (quotationData, Navigate) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_DETAIL_REQUEST });

        const { data } = await axiosInstance.post(
            `/payments/details`,
            quotationData
        );

        dispatch({
            type: PAYMENT_DETAIL_SUCCESS,
            payload: {
                data
            },
        });


    } catch (error) {
        dispatch({ type: PAYMENT_DETAIL_ERROR, payload: error.message });
    }
};


export const paymentRecDelete = (quotationData, Navigate, val) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_DELETE_REQUEST });

        const { data } = await axiosInstance.post(
            `/payments/delete`,
            quotationData
        );

        dispatch({
            type: PAYMENT_DELETE_SUCCESS,
            payload: {
                data
            },
        });

        if (data?.message === "Payment Deleted Successfully" && val === "payment_made") {
            toast.success(data?.message);
            Navigate("/dashboard/payment-made");
        }
        else if (data?.message === "Payment Deleted Successfully" && val === "payment_rec") {
            Navigate("/dashboard/payment-recieved");
            toast.success(data?.message);
        } else {
            toast.error(data?.message);
        }

        setTimeout(() => {
            Navigate('/dashboard/payment-recieved');
        }, 500);
    } catch (error) {
        dispatch({ type: PAYMENT_DELETE_ERROR, payload: error.message });
    }
};


export const paymentRecStatus = (quotationData, Navigate) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_STATUS_REQUEST });

        const { data } = await axiosInstance.post(
            `/payments/status`,
            quotationData
        );

        dispatch({
            type: PAYMENT_STATUS_SUCCESS,
            payload: {
                data
            },
        });

        toast.success("data from actions", data);

        setTimeout(() => {
            Navigate('/dashboard/payment-recieved');
        }, 500);
    } catch (error) {
        dispatch({ type: PAYMENT_STATUS_ERROR, payload: error.message });
    }
};
