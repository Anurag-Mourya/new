import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    CREATE_GRN_REQUEST,
    CREATE_GRN_SUCCESS,
    CREATE_GRN_ERROR,

    GET_GRN_REQUEST,
    GET_GRN_SUCCESS,
    GET_GRN_ERROR,

    GRN_DETAILS_REQUEST,
    GRN_DETAIL_SUCCESS,
    GRN_DETAILS_ERROR,

    GET_GRN_RECEIPT_LIST__REQUEST,
    GET_GRN_RECEIPT_LIST__SUCCESS,
    GET_GRN_RECEIPT_LIST__ERROR,

    GET_GRN_RECEIPT_DETAIL__REQUEST,
    GET_GRN_RECEIPT_DETAIL__SUCCESS,
    GET_GRN_RECEIPT_DETAIL__ERROR,

    GRN_STATUS_REQUEST,
    GRN_STATUS_SUCCESS,
    GRN_STATUS_ERROR,


    GRN_DELETE_REQUEST,
    GRN_DELETE_SUCCESS,
    GRN_DELETE_ERROR,

    MOVE_ITEM_LIST__REQUEST,
    MOVE_ITEM_LIST__SUCCESS,
    MOVE_ITEM_LIST__ERROR,
} from '../Constants/grnConstants.js';
import { createPurchases } from './purchasesActions.js';

export const GRNcreateActions = (queryParams, Navigate, isEdit, buttonName, itemId, convert) => async (dispatch) => {
    dispatch({ type: CREATE_GRN_REQUEST });

    // console.log(isEdit, buttonName, itemId, convert)
    try {
        const response = await axiosInstance.post(`/grn/create/update`, queryParams);
        console.log("respons", response)
        dispatch({ type: CREATE_GRN_SUCCESS, payload: response.data });


        if (response?.data?.message === "Transaction Created Successfully" && !isEdit) {
            toast.success("GRN Created Successfully");
            Navigate('/dashboard/grn')
        } else if (response?.data?.message === "Transaction Created Successfully" && isEdit) {
            toast.success("GRN Updated Successfully");
            Navigate('/dashboard/grn')
        }
        else {
            toast.error(response?.data?.message);
        }

    } catch (error) {
        dispatch({ type: CREATE_GRN_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNlistActions = (queryParams) => async (dispatch) => {
    dispatch({ type: GET_GRN_REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/list`, queryParams);

        dispatch({ type: GET_GRN_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GET_GRN_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};

export const GRNdetailsActions = (queryParams) => async (dispatch) => {
    dispatch({ type: GRN_DETAILS_REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/details`, queryParams);


        dispatch({ type: GRN_DETAIL_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GRN_DETAILS_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNstatusActions = (queryParams, setCallApi, billData) => async (dispatch) => {
    dispatch({ type: GRN_STATUS_REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/status`, queryParams);

        console.log("response", response);

        if (response?.data?.message === "GRN Declined Updated Successfully") {
            toast.success(response?.data?.message);
            setCallApi((preState) => !preState);
        } else if (response?.data?.message === "GRN Approved Updated Successfully") {

            toast.success(response?.data?.message);
            setCallApi((preState) => !preState);

            await dispatch(createPurchases(billData, ""));
        } else if (response?.data?.message === "GRN  Updated Successfully") {
            toast.success(response?.data?.message);
            setCallApi((preState) => !preState);
        } else {
            toast.error(response?.data?.message);
        }
        dispatch({ type: GRN_STATUS_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GRN_STATUS_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};

export const GRNdeleteActions = (queryParams, Navigate) => async (dispatch) => {
    dispatch({ type: GRN_DELETE_REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/delete`, queryParams);

        if (response?.data?.message === "GRN deleted Successfully") {
            toast.success(response?.data?.message);
            Navigate("/dashboard/grn");
        } else {
            toast.error(response?.data?.message);
        }
        dispatch({ type: GRN_DELETE_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GRN_DELETE_ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNreceiptListActions = (queryParams) => async (dispatch) => {
    dispatch({ type: GET_GRN_RECEIPT_LIST__REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/receipt/list`, queryParams);

        dispatch({ type: GET_GRN_RECEIPT_LIST__SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GET_GRN_RECEIPT_LIST__ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNreceipDetailsActions = (queryParams) => async (dispatch) => {
    dispatch({ type: GET_GRN_RECEIPT_DETAIL__REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/receipt/details`, queryParams);

        dispatch({ type: GET_GRN_RECEIPT_DETAIL__SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: GET_GRN_RECEIPT_DETAIL__ERROR, payload: error.message });
        toast.error(error?.message);
    }
};


export const GRNreceiptMoveItemActions = (queryParams, setMoveItem) => async (dispatch) => {
    dispatch({ type: MOVE_ITEM_LIST__REQUEST });
    try {
        const response = await axiosInstance.post(`/grn/receipt/stock/adjust`, queryParams);

        if (response?.data?.message === "GRN Item Moved Successfully") {
            toast?.success(response?.data?.message);
            setMoveItem(false)
            Navigate("/dashboard/grn");
        } else {
            toast?.error(response?.data?.message);
        }

        dispatch({ type: MOVE_ITEM_LIST__SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: MOVE_ITEM_LIST__ERROR, payload: error.message });
        toast.error(error?.message);
    }
};

