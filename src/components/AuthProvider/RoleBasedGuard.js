"use client"
import { useStore } from "@/store/hooks";

export default function RoleBasedGuard ({children, accessibleRoles = []}){

    const [{user}] = useStore();
    
    if(!accessibleRoles.includes(user?.role)){
        return(
            <div>Bạn không có quyền truy cập!</div>
        )
    }
    return(
        <>{children}</>
    )

}