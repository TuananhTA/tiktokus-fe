"use client"
import AuthGuard from "@/components/AuthProvider/AuthGuard"
import Packer from "./index"
import RoleBasedGuard from "@/components/AuthProvider/RoleBasedGuard"

export default function OrderPage(){
    return(
        <AuthGuard>
            <RoleBasedGuard accessibleRoles={["ADMIN","PACKER"]}>
                <Packer></Packer>
            </RoleBasedGuard>
        </AuthGuard>
    )
}