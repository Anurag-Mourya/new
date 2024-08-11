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

    // zones

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

} from '../Constants/warehouseConstants';


const initialState = {
    loading: false,
    data: null,
    error: null,
};



// warehouse
export const warehouseViewReducer = (state = initialState, action) => {
    switch (action?.type) {
        case WAREHOUSE_VIEW_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case WAREHOUSE_VIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case WAREHOUSE_VIEW_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const warehouseCreateReducer = (state = initialState, action) => {
    switch (action?.type) {
        case WAREHOUSE_CREATE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case WAREHOUSE_CREATE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case WAREHOUSE_CREATE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const warehouseDetailReducer = (state = initialState, action) => {
    switch (action?.type) {
        case WAREHOUSE_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case WAREHOUSE_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case WAREHOUSE_DETAIL_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const warehouseStatusReducer = (state = initialState, action) => {
    switch (action?.type) {
        case WAREHOUSE_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case WAREHOUSE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case WAREHOUSE_STATUS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};


// zones
export const zoneViewReducer = (state = initialState, action) => {
    switch (action?.type) {
        case ZONE_VIEW_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ZONE_VIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case ZONE_VIEW_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const zoneCreateReducer = (state = initialState, action) => {
    switch (action?.type) {
        case ZONE_CREATE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ZONE_CREATE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case ZONE_CREATE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const zoneDetailsReducer = (state = initialState, action) => {
    switch (action?.type) {
        case ZONE_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ZONE_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case ZONE_DETAIL_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const zoneStatusReducer = (state = initialState, action) => {
    switch (action?.type) {
        case ZONE_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ZONE_STATUS_REQUEST:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case ZONE_STATUS_REQUEST:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

// Racks


export const rackViewReducer = (state = initialState, action) => {
    switch (action?.type) {
        case RACK_VIEW_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case RACK_VIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case RACK_VIEW_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const rackCreateReducer = (state = initialState, action) => {
    switch (action?.type) {
        case RACK_CREATE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case RACK_CREATE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case RACK_CREATE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};



export const rackDetailsReducer = (state = initialState, action) => {
    switch (action?.type) {
        case RACK_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case RACK_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case RACK_DETAIL_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const rackStatusReducer = (state = initialState, action) => {
    switch (action?.type) {
        case RACK_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case RACK_STATUS_REQUEST:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case RACK_STATUS_REQUEST:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

// Bins
export const binViewReducer = (state = initialState, action) => {
    switch (action?.type) {
        case BIN_VIEW_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case BIN_VIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case BIN_VIEW_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const binCreateReducer = (state = initialState, action) => {
    switch (action?.type) {
        case BIN_CREATE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case BIN_CREATE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case BIN_CREATE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};



export const binDetailsReducer = (state = initialState, action) => {
    switch (action?.type) {
        case BIN_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case BIN_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case BIN_DETAIL_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const binStatusReducer = (state = initialState, action) => {
    switch (action?.type) {
        case BIN_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case BIN_STATUS_REQUEST:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
            };
        case BIN_STATUS_REQUEST:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
