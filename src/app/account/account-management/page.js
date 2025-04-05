import AccountManagementIndex from "."
import AuthGuard from "@/components/AuthProvider/AuthGuard"
import RoleBasedGuard from "@/components/AuthProvider/RoleBasedGuard"
export default function AccountManagementPage(){
    return(
        <AuthGuard>
            <RoleBasedGuard accessibleRoles={["ADMIN"]}>
                <AccountManagementIndex/>
            </RoleBasedGuard>
        </AuthGuard>
    )
}