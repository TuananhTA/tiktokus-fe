
"use client"
import ProductCategories from ".";
import AuthGuard from "@/components/AuthProvider/AuthGuard";
export default function CategoryPage(){

    return(
        <AuthGuard>
            <ProductCategories></ProductCategories>
        </AuthGuard>
    )
}