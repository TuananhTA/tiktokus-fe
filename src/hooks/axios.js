"use client"
import axios from "axios";
import {toast } from 'react-toastify';
import { initialize } from "@/store/actions";
// import { useStore } from "@/store/hooks";




let authorizeAxiosInstance = axios.create();

authorizeAxiosInstance.defaults.timeout =1000 *60 * 10;

authorizeAxiosInstance.defaults.withCredentials = true;

authorizeAxiosInstance.interceptors.request.use(
  function (config) {
    if (typeof window !== 'undefined') {
      let accessToken = window.localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
authorizeAxiosInstance.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
        if(error.response?.status == 401){
            toast.error("Phiên đăng nhập đã hết hạn");
            let accessToken = localStorage.getItem("accessToken");
            if(accessToken){
                localStorage.removeItem("accessToken");
            }
            location.href ="/login";
        }
        else if(error.response?.status == 403){
            location.href ="/login";
            
        }else{
            toast.error(error.response?.data.error);
        }
    return Promise.reject(error);
  });



export default authorizeAxiosInstance;