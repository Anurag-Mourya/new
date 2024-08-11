import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    QUOTATION_DETAIL_REQUEST,
    QUOTATION_DETAIL_SUCCESS,
    QUOTATION_DETAIL_ERROR,

    QUOTATION_UPDATE_REQUEST,
    QUOTATION_UPDATE_SUCCESS,
    QUOTATION_UPDATE_ERROR,

    QUOTATION_STATUS_REQUEST,
    QUOTATION_STATUS_SUCCESS,
    QUOTATION_STATUS_ERROR,

    QUOTATION_DELETE_REQUEST,
    QUOTATION_DELETE_SUCCESS,
    QUOTATION_DELETE_ERROR,

    QUOTATION_SEND_REQUEST,
    QUOTATION_SEND_SUCCESS,
    QUOTATION_SEND_ERROR,
} from "../Constants/quotationConstants";
import { useNavigate } from 'react-router-dom';

export const quotationDetails = (queryParams, setDetail_api_data) => async (dispatch) => {
    try {
        dispatch({ type: QUOTATION_DETAIL_REQUEST });

        const { data } = await axiosInstance.post(
            '/quotations/details',
            queryParams
        );

        console.log("queryParams", queryParams)
        console.log("data", data)

        if (data?.quotation && setDetail_api_data) {
            setDetail_api_data(data?.quotation)
        }

        dispatch({
            type: QUOTATION_DETAIL_SUCCESS,
            payload: {
                data
            },
        });

    } catch (error) {
        dispatch({ type: QUOTATION_DETAIL_ERROR, payload: error.message });
    }
};

export const updateQuotation = (quotationData, navigate, valSmall, valCap, isEdit, buttonName, confirmed) => async (dispatch) => {
    // console.log("button nbame", valSmall, valCap, isEdit, buttonName)
    try {
        dispatch({ type: QUOTATION_UPDATE_REQUEST });

        const { data } = await axiosInstance.post(
            `/sales/create/update`,
            quotationData
        );

        dispatch({
            type: QUOTATION_UPDATE_SUCCESS,
            payload: {
                data
            },
        });

        if (data?.message === "Transaction Created Successfully") {

            if (valSmall && buttonName === "saveAndSend") {

                if (isEdit) {
                    toast.success(`${valCap} Updated Successfully`);
                } else {
                    toast.success(`${valCap} Created Successfully`);
                }

                setTimeout(() => {
                    const queryParams = new URLSearchParams();
                    queryParams.set(`${valSmall}_send`, true);
                    navigate(`/dashboard/send_mail?${queryParams.toString()}`,
                        {
                            state: {
                                data: data?.transaction
                            }
                        });
                }, [2000]);

            } else if (valSmall && buttonName === "saveAsDraft") {
                if (isEdit) {
                    toast.success(`${valCap} Updated Successfully`);
                } else {
                    toast.success(`${valCap} Created Successfully`);
                }
                navigate(`/dashboard/${valSmall}`);
            }

            // else if (val === "sales") {
            //     navigate("/dashboard/sales-orders")
            // } else if (val === "invoices") {
            //     navigate("/dashboard/invoices")
            // }

        } else {
            toast.error(data?.message);
        }

    } catch (error) {
        dispatch({ type: QUOTATION_UPDATE_ERROR, payload: error.message });
    }
};



export const updateCreditNote = (quotationData, Navigate, val) => async (dispatch) => {
    // console.log("quotationData", quotationData)
    try {
        dispatch({ type: QUOTATION_UPDATE_REQUEST });

        const { data } = await axiosInstance.post(
            `/credit-debit/create/update`,
            quotationData
        );

        dispatch({
            type: QUOTATION_UPDATE_SUCCESS,
            payload: {
                data
            },
        });


        if (data?.message === "Transaction Created Successfully") {
            toast.success(data?.message);
            if (val === "debit_note") {
                Navigate('/dashboard/debit-notes');
            } else {
                Navigate('/dashboard/credit-notes');
            }
        } else {
            toast.error(data?.message);
        }

    } catch (error) {
        dispatch({ type: QUOTATION_UPDATE_ERROR, payload: error.message });
    }
};



export const quotationStatus = (quotationData, Navigate) => async (dispatch) => {
    try {
        dispatch({ type: QUOTATION_STATUS_REQUEST });

        const { data } = await axiosInstance.post(
            `/quotation/status`,
            quotationData
        );

        dispatch({
            type: QUOTATION_STATUS_SUCCESS,
            payload: {
                data
            },
        });
        if (data?.message === "Quotation Declined Updated Successfully") {
            toast.success(data?.message);
        } else if (data?.message === "Quotation Approved Updated Successfully") {
            toast.success(data?.message);
        } else {
            toast.error(data?.message);
        }

    } catch (error) {
        dispatch({ type: QUOTATION_STATUS_ERROR, payload: error.message });
    }
};

export const quotationDelete = (quotationData, Navigate) => async (dispatch) => {
    // console.log("quotationData", quotationData)
    try {
        dispatch({ type: QUOTATION_DELETE_REQUEST });

        const { data } = await axiosInstance.post(
            `/quotation/delete`,
            quotationData
        );

        dispatch({
            type: QUOTATION_DELETE_SUCCESS,
            payload: {
                data
            },
        });


        if (data?.message === "Quotation is Approved. You can't delete this quotation.") {
            toast.error(data?.message);
        } else if (data?.message === "Quotation deleted Successfully") {
            toast.success(data?.message);
            Navigate('/dashboard/quotation');
        }

    } catch (error) {
        dispatch({ type: QUOTATION_DELETE_ERROR, payload: error.message });
    }
};

export const quotationSend = (quotationData, Navigate) => async (dispatch) => {
    // console.log("quotationData", quotationData)
    try {
        dispatch({ type: QUOTATION_SEND_REQUEST });

        const { data } = await axiosInstance.post(
            `/quotation/send`,
            quotationData
        );

        dispatch({
            type: QUOTATION_SEND_SUCCESS,
            payload: {
                data
            },
        });

        // console.log("quotaion send data", data)

        if (data?.message === "Quotation sent Successfully") {
            toast.success(data?.message);
            Navigate('/dashboard/quotation');
        } else {
            toast.error(data?.message)
        }

    } catch (error) {
        dispatch({ type: QUOTATION_SEND_ERROR, payload: error.message });
    }
};


