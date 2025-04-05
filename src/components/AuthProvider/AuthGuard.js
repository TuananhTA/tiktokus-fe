"use client"
import { useEffect } from 'react';
import { useStore } from "@/store/hooks";
import Loading from "../loading";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const [state] = useStore();
  const { isInitialized, isAuthenticated } = state;
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login"); // Điều hướng đến trang login nếu không được xác thực
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) return <Loading />;

  if (!isAuthenticated) {
    return null; // Trả về null hoặc loading nếu không được phép truy cập
  }

  return <>{children}</>;
}
