"use client"
import AuthGuard from "@/components/AuthProvider/AuthGuard"
import Order from "./index"

export default function OrderPage(){
    return(
        <AuthGuard>
            <Order></Order>
        </AuthGuard>
    )
}