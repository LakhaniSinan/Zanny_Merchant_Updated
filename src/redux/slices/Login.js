import { createSlice } from "@reduxjs/toolkit"


export const Login = createSlice({
    name: "Login",
    initialState: {
        user: null,
        terms: false
    },
    reducers: {
        setUserData: (state, action) => {
            state.user = action.payload
        },
        setTermsData: (state, action) => {
            state.terms = action.payload
        }
    }
})

export const { setUserData, setTermsData } = Login.actions

export default Login.reducer