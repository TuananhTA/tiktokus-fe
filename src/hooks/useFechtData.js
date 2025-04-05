"use client";
import useSWR from 'swr';
import authorizeAxiosInstance from "@/hooks/axios";
const getData = (url, params = {}) => {
    // Kiểm tra và thêm các tham số query
    const queryParams = new URLSearchParams(params).toString();
    const key = queryParams ? `${url}?${queryParams}` : url;
  
    // Sử dụng SWR để fetch dữ liệu
    const { data, error, isLoading } = useSWR(key, authorizeAxiosInstance);
  
    return { data, error, isLoading, key };
  };
  
  export default getData;