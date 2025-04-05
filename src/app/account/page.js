"use client"
import AccountCom from "./index";
import AuthGuard from "@/components/AuthProvider/AuthGuard";
export default function AccountPage(){


    return(
        <AuthGuard>
            <AccountCom/>
        </AuthGuard>
    )
}