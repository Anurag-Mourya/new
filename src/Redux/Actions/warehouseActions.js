import toast from 'react-hot-toast';
import axiosInstance from '../../Configs/axiosInstance';
import {
    // warehouse
    WAREHOUSE_VIEW_REQUEST,
    WAREHOUSE_VIEW_SUCCESS,
    WAREHOUSE_VIEW_ERROR,

    WAREHOUSE_CREATE_REQUEST,
    WAREHOUSE_CREATE_SUCCESS,
    WAREHOUSE_CREATE_ERROR,

    WAREHOUSE_DETAIL_REQUEST,
    WAREHOUSE_DETAIL_SUCCESS,
    WAREHOUSE_DETAIL_ERROR,

    WAREHOUSE_STATUS_REQUEST,
    WAREHOUSE_STATUS_SUCCESS,
    WAREHOUSE_STATUS_ERROR,

    // zone
    ZONE_VIEW_REQUEST,
    ZONE_VIEW_SUCCESS,
    ZONE_VIEW_ERROR,

    ZONE_CREATE_REQUEST,
    ZONE_CREATE_SUCCESS,
    ZONE_CREATE_ERROR,

    ZONE_DETAIL_REQUEST,
    ZONE_DETAIL_SUCCESS,
    ZONE_DETAIL_ERROR,

    ZONE_STATUS_REQUEST,
    ZONE_STATUS_SUCCESS,
    ZONE_STATUS_ERROR,

    // RACK
    RACK_VIEW_REQUEST,
    RACK_VIEW_SUCCESS,
    RACK_VIEW_ERROR,

    RACK_CREATE_REQUEST,
    RACK_CREATE_SUCCESS,
    RACK_CREATE_ERROR,

    RACK_DETAIL_REQUEST,
    RACK_DETAIL_SUCCESS,
    RACK_DETAIL_ERROR,

    RACK_STATUS_REQUEST,
    RACK_STATUS_SUCCESS,
    RACK_STATUS_ERROR,

    // BIN
    BIN_VIEW_REQUEST,
    BIN_VIEW_SUCCESS,
    BIN_VIEW_ERROR,

    BIN_CREATE_REQUEST,
    BIN_CREATE_SUCCESS,
    BIN_CREATE_ERROR,

    BIN_DETAIL_REQUEST,
    BIN_DETAIL_SUCCESS,
    BIN_DETAIL_ERROR,

    BIN_STATUS_REQUEST,
    BIN_STATUS_SUCCESS,
    BIN_STATUS_ERROR,
} from '../Constants/warehouseConstants.js'


// warehouse
export const warehouseViewAction = (queryParams) => async (dispatch) => {

    dispatch({ type: WAREHOUSE_VIEW_REQUEST });
    try {
        const response = await axiosInstance.post(`/warehouse/list`,
            queryParams
        );

        dispatch({ type: WAREHOUSE_VIEW_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: WAREHOUSE_VIEW_ERROR, payload: error.message });
    }
};

export const warehouseCreateAction = (queryParams, Navigate) => async (dispatch) => {

    dispatch({ type: WAREHOUSE_CREATE_REQUEST });
    try {
        const response = await axiosInstance.post(`/warehouse/create/update`,
            queryParams
        );

        if (response?.data?.message === "Warehouse Created Successfully") {
            toast?.success(response?.data?.message);
            Navigate("/dashboard/warehouse")
        } else if (response?.data?.message === "Warehouse Updated Successfully") {
            toast?.success(response?.data?.message);
            Navigate("/dashboard/warehouse")
        }


        dispatch({ type: WAREHOUSE_CREATE_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: WAREHOUSE_CREATE_ERROR, payload: error.message });
    }
};

export const warehouseDetailAction = (queryParams) => async (dispatch) => {

    dispatch({ type: WAREHOUSE_DETAIL_REQUEST });
    try {
        const response = await axiosInstance.post(`/warehouse/details`,
            queryParams
        );

        dispatch({ type: WAREHOUSE_DETAIL_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: WAREHOUSE_DETAIL_ERROR, payload: error.message });
    }
};

export const warehouseStatusAction = (queryParams) => async (dispatch) => {

    dispatch({ type: WAREHOUSE_STATUS_REQUEST });
    try {
        const response = await axiosInstance.post(`/warehouse/status`,
            queryParams
        );

        dispatch({ type: WAREHOUSE_STATUS_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: WAREHOUSE_STATUS_ERROR, payload: error.message });
    }
};


// ZONE
export const zoneViewAction = (queryParams) => async (dispatch) => {

    dispatch({ type: ZONE_VIEW_REQUEST });
    try {
        const response = await axiosInstance.post(`/zone/list`,
            queryParams
        );

        dispatch({ type: ZONE_VIEW_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: ZONE_VIEW_ERROR, payload: error.message });
    }
};

export const zoneCreateAction = (queryParams, Navigate) => async (dispatch) => {

    dispatch({ type: ZONE_CREATE_REQUEST });
    try {
        const response = await axiosInstance.post(`/zone/create/update`,
            queryParams
        );

        if (response?.data?.message === "Warehouse Zone Created Successfully") {
            toast?.success(response?.data?.message);
            Navigate("/dashboard/zone")
        } else if (response?.data?.message === "Warehouse Zone Updated Successfully") {
            toast?.success(response?.data?.message);
            Navigate("/dashboard/zone")
        } else {
            toast?.error(response?.data?.message);
        }

        dispatch({ type: ZONE_CREATE_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: ZONE_CREATE_ERROR, payload: error.message });
    }
};

export const zoneDetailAction = (queryParams) => async (dispatch) => {

    dispatch({ type: ZONE_DETAIL_REQUEST });
    try {
        const response = await axiosInstance.post(`/zone/details`,
            queryParams
        );

        dispatch({ type: ZONE_DETAIL_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: ZONE_DETAIL_ERROR, payload: error.message });
    }
};

export const zoneStatusAction = (queryParams) => async (dispatch) => {

    dispatch({ type: ZONE_STATUS_REQUEST });
    try {
        const response = await axiosInstance.post(`/zone/status`,
            queryParams
        );

        dispatch({ type: ZONE_STATUS_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: ZONE_STATUS_ERROR, payload: error.message });
    }
};


// RACKS
export const rackViewAction = (queryParams) => async (dispatch) => {

    dispatch({ type: RACK_VIEW_REQUEST });
    try {
        const response = await axiosInstance.post(`/racks/list`,
            queryParams
        );

        dispatch({ type: RACK_VIEW_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: RACK_VIEW_ERROR, payload: error.message });
    }
};

export const rackCreateAction = (queryParams, Navigate) => async (dispatch) => {

    dispatch({ type: RACK_CREATE_REQUEST });
    try {
        const response = await axiosInstance.post(`/racks/create/update`,
            queryParams
        );

        if (response?.data?.message === "Warehouse Racks Created Successfully") {
            toast?.success(response?.data?.message);
            Navigate("/dashboard/racks")
        } else if (response?.data?.message === "Warehouse Racks Updated Successfully") {
            toast?.success(response?.data?.message);
            Navigate("/dashboard/racks")
        } else {
            toast?.error(response?.data?.message);
        }

        dispatch({ type: RACK_CREATE_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: RACK_CREATE_ERROR, payload: error.message });
    }
};

export const rackDetailAction = (queryParams) => async (dispatch) => {

    dispatch({ type: RACK_DETAIL_REQUEST });
    try {
        const response = await axiosInstance.post(`/racks/details`,
            queryParams
        );

        dispatch({ type: RACK_DETAIL_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: RACK_DETAIL_ERROR, payload: error.message });
    }
};

export const rackStatusAction = (queryParams) => async (dispatch) => {

    dispatch({ type: RACK_STATUS_REQUEST });
    try {
        const response = await axiosInstance.post(`/rack/status`,
            queryParams
        );

        dispatch({ type: RACK_STATUS_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: RACK_STATUS_ERROR, payload: error.message });
    }
};


// Bins
export const binViewAction = (queryParams) => async (dispatch) => {

    dispatch({ type: BIN_VIEW_REQUEST });
    try {
        const response = await axiosInstance.post(`/bin/list`,
            queryParams
        );

        dispatch({ type: BIN_VIEW_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: BIN_VIEW_ERROR, payload: error.message });
    }
};

export const binCreateAction = (queryParams, Navigate) => async (dispatch) => {

    dispatch({ type: BIN_CREATE_REQUEST });
    try {
        const response = await axiosInstance.post(`/bin/create/update`,
            queryParams
        );

        if (response?.data?.message === "Warehouse Bins Created Successfully") {
            toast?.success(response?.data?.message);
            Navigate("/dashboard/bin")
        } else if (response?.data?.message === "Warehouse Bins Updated Successfully") {
            toast?.success(response?.data?.message);
            Navigate("/dashboard/bin")
        } else {
            toast?.error(response?.data?.message);
        }

        dispatch({ type: BIN_CREATE_SUCCESS, payload: response.data });

    } catch (error) {
        dispatch({ type: BIN_CREATE_ERROR, payload: error.message });
    }
};

export const binDetailAction = (queryParams) => async (dispatch) => {

    dispatch({ type: BIN_DETAIL_REQUEST });
    try {
        const response = await axiosInstance.post(`/bin/details`,
            queryParams
        );

        dispatch({ type: BIN_DETAIL_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: BIN_DETAIL_ERROR, payload: error.message });
    }
};

export const binStatusAction = (queryParams) => async (dispatch) => {

    dispatch({ type: BIN_STATUS_REQUEST });
    try {
        const response = await axiosInstance.post(`/bin/status`,
            queryParams
        );

        dispatch({ type: BIN_STATUS_SUCCESS, payload: response.data });


    } catch (error) {
        dispatch({ type: BIN_STATUS_ERROR, payload: error.message });
    }
};
