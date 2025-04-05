import { SIGN_IN, INITIALIZE,UPDATE_BALANCE} from "./constants";

export const signIn = payload => ({
    type : SIGN_IN,
    payload
})

export const initialize = payload => ({
    type : INITIALIZE,
    payload
})
export const updateBalance = payload => ({
    type : UPDATE_BALANCE,
    payload
})
