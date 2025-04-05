import { SIGN_IN, INITIALIZE, UPDATE_BALANCE } from "./constants";
const initState ={
    isInitialized : false,
    isAuthenticated : false,
    user : null
}

function reducer(state, action){
    const {isAuthenticated, user} = action.payload

    switch(action.type){
        case SIGN_IN:{
            const {user} = action.payload
            return {
                ...state,
                isAuthenticated : true,
                user
            }
        }
        case INITIALIZE:{
            const {isAuthenticated, user} = action.payload
            return{
                ...state,
                isAuthenticated,
                user,
                isInitialized : true
            }
        }
        case UPDATE_BALANCE: {
            // Cập nhật số dư cho user
            const { balance } = action.payload;  // balance là số dư mới
            return {
                ...state,
                user: {
                    ...state.user,
                    balance,  // Cập nhật số dư mới cho user
                },
            };
        }


        default:
            throw new Error("action not invalid");    
    
    }
}

export { initState };
export default reducer;