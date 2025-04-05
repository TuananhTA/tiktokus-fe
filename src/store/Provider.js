"use client"
import Context from "./Context";
import { useReducer, useEffect} from "react";
import { initialize } from "./actions";
import reducer, {initState} from "./reducer";
import UserService from "@/service/UserService";

function Provider({children}){

    const [state, dispatch] = useReducer(reducer, initState)
    useEffect( ()=>{
        ( async ()=>{
            const token = localStorage.getItem('accessToken');
            if(!token){
                return dispatch(initialize({isAuthenticated : false, user : null}))
            }
            try{
                const { user } = await UserService.getUserInfo();
                return dispatch(initialize({isAuthenticated : true, user}))
            }catch(e){
                return dispatch(initialize({isAuthenticated : false, user : null}))
            }
        })();
    },[])
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}

export default Provider;