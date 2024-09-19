import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    status: false,
    certificateData: null,
};

const certificateSlice = createSlice({
    name: 'certificate',
    initialState,
    reducers: {
        pushCertificateData(state, action) {
            state.certificateData = action.payload;
        },
    },
});

export const { pushCertificateData } = certificateSlice.actions;

export default certificateSlice.reducer;
