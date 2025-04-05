"use client";
import AuthGuard from "@/components/AuthProvider/AuthGuard"
import RoleBasedGuard from "@/components/AuthProvider/RoleBasedGuard"
import UpdateOrder from "./index";
import { use } from 'react';


export default function UpdateOrderPage({params}){

  const {id } = use(params);

  return(
    <AuthGuard>
      <RoleBasedGuard accessibleRoles={["ADMIN","ORDER"]}>
        <UpdateOrder id= {id}></UpdateOrder>
      </RoleBasedGuard>
    </AuthGuard>
  )
}


