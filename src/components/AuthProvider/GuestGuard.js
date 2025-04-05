import { useStore } from "@/store/hooks";
import Loading from "../loading";

const GuestGuard = ({children})=>{
    const [state] = useStore();
    const {isInitialized, isAuthenticated } = state;

    if(!isInitialized) return <Loading></Loading>
    if(isAuthenticated) {
        location.href= "/product";
        return;
    }
    return <>{children}</>
} 
export default GuestGuard;