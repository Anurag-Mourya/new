
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

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const createGRNreducer = (state = initialState, action) => {
    switch (action?.type) {
        case CREATE_GRN_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CREATE_GRN_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case CREATE_GRN_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const listGRNreducer = (state = initialState, action) => {
    switch (action?.type) {
        case GET_GRN_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_GRN_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case GET_GRN_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}
export const GRNdetailsReducer = (state = initialState, action) => {
    switch (action?.type) {
        case GRN_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GRN_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case GRN_DETAILS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};



export const GRNstatusReducer = (state = initialState, action) => {
    switch (action?.type) {
        case GRN_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GRN_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case GRN_STATUS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const GRNdeleteReducer = (state = initialState, action) => {
    switch (action?.type) {
        case GRN_DELETE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GRN_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case GRN_DELETE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};



export const GRNrecepitListReducer = (state = initialState, action) => {
    switch (action?.type) {
        case GET_GRN_RECEIPT_LIST__REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_GRN_RECEIPT_LIST__SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case GET_GRN_RECEIPT_LIST__ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};


export const GRNrecepitDetailReducer = (state = initialState, action) => {
    switch (action?.type) {
        case GET_GRN_RECEIPT_DETAIL__REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_GRN_RECEIPT_DETAIL__SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case GET_GRN_RECEIPT_DETAIL__ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};


export const GRNrecepitMoveItemReducer = (state = initialState, action) => {
    switch (action?.type) {
        case MOVE_ITEM_LIST__REQUEST:
            return {
                ...state,
                loading: true,
            };
        case MOVE_ITEM_LIST__SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case MOVE_ITEM_LIST__ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};