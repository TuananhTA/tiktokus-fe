import Image from "next/image";
import styles from "./page.module.css";
import AuthGuard from "@/components/AuthProvider/AuthGuard";
import RoleBasedGuard from "@/components/AuthProvider/RoleBasedGuard";

export default function Home() {
  return (
      <AuthGuard>
         <RoleBasedGuard accessibleRoles={["ADMIN"]}>
              <h1>Đây là trang thống kê</h1>
         </RoleBasedGuard>
      </AuthGuard>
  );
}
