
"use client"
import ProductCategories from ".";
import AuthGuard from "@/components/AuthProvider/AuthGuard";
import RoleBasedGuard from "@/components/AuthProvider/RoleBasedGuard";
export default function CategoryPage(){

    return(
        <AuthGuard>
            <RoleBasedGuard accessibleRoles={["ADMIN"]}>
                <ProductCategories></ProductCategories>
            </RoleBasedGuard>
        </AuthGuard>
    )
}