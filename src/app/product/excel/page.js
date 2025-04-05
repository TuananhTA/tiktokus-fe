"use client"
import AuthGuard from "@/components/AuthProvider/AuthGuard"
import SelectProductsPage from "."
import Main from "@/components/main/main"

export default function OrderPage(){
    return(
        <AuthGuard>
            <Main title={"Export excel product"}>
                <SelectProductsPage/>
            </Main>
        </AuthGuard>
    )
}