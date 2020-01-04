import { SET_COORDINATES } from '../actions'

const initialState = {
    coordinates: {
        lat: undefined,
        lng: undefined
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COORDINATES:
            return { ...state, coordinates: action.coordinates };
        default:
            return state;
    }
};

export default reducer;