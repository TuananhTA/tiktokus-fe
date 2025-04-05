"use client";
import Main from "@/components/main/main";
import CustomerInfo from "@/components/main/order/CustomInfo";
import OrderInfo from "@/components/main/order/OrderInfo";
import AddressInfo from "@/components/main/order/AddressInfo";
import OrderDetailsTable from "@/components/main/order/OrderDetailsTable";
import style from "./style.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import Loading from "@/components/loading";
require("dotenv").config();

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

import authorizeAxiosInstance from "@/hooks/axios";
export default function UpdateOrder({ id }) {
  const urlGetData = `${URL_ROOT}/private/order/details/${id}`;
  const [notFound, setNotFound] = useState(false);
  const [selectedOption, setSelectedOption] = useState('By_TikTok');
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    customName: "",
    phone: "",
    email: "",
  });
  const [addressInfo, setAddressInfo] = useState({
    street: "",
    streetTwo: "",
    city: "",
    country: "",
    zipCode: "",
    status: "NEW",
    state:""
  });
  const [orderInfo, setOrderInfo] = useState({
    labelUrl: "",
    tracking: "",
    extraId: "",
  });
  const [errors, setErrors] = useState({});





  const validInfo = () => {
    if (selectedOption === "By_TikTok") return true;
    const newErrors = {
      customName: "",
      phone: "",
      email: "",
      street: "",
      city: "",
      country: "",
      zipCode: "",
    };
    let isValid = true;

    // Kiểm tra customerInfo
    if (!customerInfo.customName.trim()) {
      newErrors.customName = "Customer Name is required";
      isValid = false;
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    } else if (!/^(\(\+1\)|\+1|)?\s?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/.test(customerInfo.phone)) {
      newErrors.phone = "Phone must be a valid US number (e.g., +1 812-258-7306)";
      isValid = false;
    }    
    if (
      customerInfo.email &&
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(customerInfo.email)
    ) {
      newErrors.email = "Email must be a valid email address";
      isValid = false;
    }

    // Kiểm tra addressInfo
    if (!addressInfo.street.trim()) {
      isValid = false;
      newErrors.street = "Street is required";
    }
    if (!addressInfo.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }
    if (!addressInfo.country.trim()) {
      newErrors.country = "Country is required";
      isValid = false;
    }
    if (!addressInfo.zipCode.trim()) {
      isValid = false;
      newErrors.zipCode = "Zip Code is required";
    } else if (!/^\d{5,10}$/.test(addressInfo.zipCode)) {
      newErrors.zipCode = "between 5-10 digits";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const validateByTikTok = () => {
    if (selectedOption === "By_Seller") return true;
    const newErrors = {
      labelUrl: "",
      tracking: "",
      extraId: ""
    };
    let isValid = true;
    if (!orderInfo.labelUrl.trim()) {
      newErrors.labelUrl = "Lable url required when ship by tiktok";
      isValid = false;
    }

    if (!orderInfo.tracking.trim()) {
      newErrors.tracking = "Tracking required when ship by tiktok";
      isValid = false;
    }

    if (!orderInfo.extraId.trim()) {
      newErrors.extraId = "Extra ID required when ship by tiktok";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const validate = ()=>{
    const newErrors = {
      orderDetails: ""
    };
    let isValid = true;
    if (orderDetails && orderDetails.length === 0) {
      newErrors.orderDetails = "Must have at least 1 product";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  }
  // Sử dụng hàm validateForm
  const handleSubmit = async () => {
    if (validInfo() && validateByTikTok() && validate()) {
      setLoading(true);
      orderDetails.forEach((item) => {
        delete item.id;
      });
      let orders = {
        ...customerInfo,
        ...addressInfo,
        ...orderInfo,
        orderDetailsList: orderDetails,
        type : selectedOption
      };
      // Không có lỗi, xử lý gửi form
      console.log("Form submitted successfully:", orders);
      let url = `${URL_ROOT}/private/order/update/${id}`;
      try {
        let res = await authorizeAxiosInstance.put(url, orders);
        let message = res.message;
        let formattedMessage = message.replace(/,/g, ",\n");
        toast.success(formattedMessage);
        await mutate(`${URL_ROOT}/private/order/get-all-by-user?page=0&size=10`);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
      // location.href = "/order";
    } else {
      // Có lỗi, xử lý hiển thị thông báo lỗi
      console.log("Form validation errors:", errors);
    }
  };
  useEffect(() => {
    if (errors.orderDetails) {
      toast.error(errors.orderDetails);
    }
  }, [errors]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authorizeAxiosInstance.get(urlGetData);
        let order = res.data;
        setCustomerInfo({
          ...customerInfo,
          customName: order.customName,
          phone: order.phone,
          email: order.email,
        });
        setAddressInfo({
          ...addressInfo,
          street: order.street,
          country: order.country,
          streetTwo: order.streetTwo,
          zipCode: order.zipCode,
          city: order.city,
          state: order.state
        });
        setOrderInfo({
          ...orderInfo,
          labelUrl: order.labelUrl,
          tracking: order.tracking,
          extraId: order.extraId,
          status: order.status,
        });
        setOrderDetails([...orderDetails, ...order.orderDetailsList]);
        setSelectedOption(order.type);
      } catch (error) {
        setNotFound(true);
      }

    };
    fetchData();
  }, [id]);

  const handleChange = (value) => {
    setSelectedOption(value);
  };

  if (notFound) return <div>Hóa đơn không tồn tại</div>;
  return (
    <Main title={"Chỉnh sửa hóa đơn"}>
      <div>
        <button onClick={handleSubmit} className={`m-2 ${style.btnSave}`}>
          Lưu
        </button>
      </div>
      <div className="d-flex">
        <div className={style.item}>
          <div className={style["radio-container"]}>
            <label
              className={`${style["radio-label"]} ${
                selectedOption === "By_TikTok" ? style.active : ""
              }`}
              onClick={() => handleChange("By_TikTok")}
            >
              <input
                type="radio"
                name="purchase-method"
                value="By_TikTok"
                checked={selectedOption === "By_TikTok"}
              />
              <span>By TikTok</span>
            </label>

            <label
              className={`${style["radio-label"]} ${
                selectedOption === "By_Seller" ? style.active : ""
              }`}
              onClick={() => handleChange("By_Seller")}
            >
              <input
                type="radio"
                name="purchase-method"
                value="By_Seller"
                checked={selectedOption === "By_Seller"}
              />
              <span>By Seller</span>
            </label>
          </div>
          {selectedOption === "By_Seller" && (
              <>
                <CustomerInfo
                  customerInfo={customerInfo}
                  setCustomerInfo={setCustomerInfo}
                  errors={errors}
                />
                <AddressInfo
                  addressInfo={addressInfo}
                  setAddressInfo={setAddressInfo}
                  errors={errors}
                />
              </>
            )}

            <OrderInfo
              orderInfo={orderInfo}
              setOrderInfo={setOrderInfo}
              errors={errors}
            />
        </div>
        <div className={style.item}>
          <OrderDetailsTable
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            type={selectedOption}
          />
        </div>
      </div>
      {loading && <Loading></Loading>}
    </Main>
  );
}
