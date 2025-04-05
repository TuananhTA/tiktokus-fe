"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    router.push("/login"); // Chuyển hướng bằng Next.js router
  }, [router]);

  return null; // Không cần render nội dung nào
}
