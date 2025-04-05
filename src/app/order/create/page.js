"use client";
import AuthGuard from "@/components/AuthProvider/AuthGuard";
import Main from "@/components/main/main";
import CustomerInfo from "@/components/main/order/CustomInfo";
import OrderInfo from "@/components/main/order/OrderInfo";
import AddressInfo from "@/components/main/order/AddressInfo";
import OrderDetailsTable from "@/components/main/order/OrderDetailsTable";
import style from "./style.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import authorizeAxiosInstance from "@/hooks/axios";
import Loading from "@/components/loading";
import { useRouter } from 'next/navigation';
import { Form} from "react-bootstrap";
require("dotenv").config();

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

export default function CreateOrder() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('By_TikTok');
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
    country: "United States",
    zipCode: "",
  });
  const [orderInfo, setOrderInfo] = useState({
    labelUrl: "",
    tracking: "",
    extraId: "",
    status: "NEW",
    desgin : "",
    mockup: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const cancel = () => {
    setOrderDetails([]);
    setAddressInfo({
      street: "",
      streetTwo: "",
      city: "",
      country: "United States",
      zipCode: "",
      status: "NEW",
    });
    setCustomerInfo({
      customName: "",
      phone: "",
      email: "",
    });
    setErrors({});
  };
  const fomartPhone = (value)=>{
    let phoneNumber = value;
    if (!phoneNumber) return;
    if (phoneNumber.startsWith("+1") ) {
      phoneNumber = phoneNumber.replace(/^\+1/, "(+1)");
      return phoneNumber;
    }
    if(!phoneNumber.startsWith("(+1)")){
      phoneNumber = "(+1)" + phoneNumber;
    }
    return phoneNumber;
  }
  // Sử dụng hàm validateForm
  const handleSubmit = async () => {
    if (validInfo() && validateByTikTok() && validate()) {
      try {
        customerInfo.phone = fomartPhone(customerInfo.phone);
        setLoading(true);
        let orders = {
          ...customerInfo,
          ...addressInfo,
          ...orderInfo,
          orderDetailsList: orderDetails,
          type : selectedOption
        };
        // Không có lỗi, xử lý gửi form
        console.log("Form submitted successfully:", orders);
        let url = `${URL_ROOT}/private/order/create-order`;
        let res = await authorizeAxiosInstance.post(url, orders);
        setLoading(false);
        toast.success("Tạo hóa đơn thành công!");
        await mutate(`${URL_ROOT}/private/order/get-all-by-user`);
        router.push("/order");
      } catch (error) {
        setLoading(false);
      }
    } else {
      // Có lỗi, xử lý hiển thị thông báo lỗi
      console.log("Form validation errors:", errors);
    }
  };
  const [textCopy, setTextCopy] = useState("");


  useEffect(() => {
    if (errors.orderDetails) {
      toast.error(errors.orderDetails);
    }
  }, [errors]);

  useEffect(() => {
    if (!textCopy) return;
    try {
      const addressObject = parseAddress(textCopy);
      if(!addressObject.phone) return;
      if (addressObject.phone.startsWith("+1")) {
        addressObject.phone = addressObject.phone.replace(/^\+1/, "(+1)");
      }

      if(!addressObject.phone.startsWith("(+1)")){
        addressObject.phone = "(+1)" + addressObject.phone;
      }
      setAddressInfo({
        ...addressInfo,
        street: addressObject.address.street,
        city: addressObject.address.city,
        country: addressObject.address.country,
        state: addressObject.address.state,
        zipCode: addressObject.address.zipCode,
      });
      setCustomerInfo({
        ...customerInfo,
        customName: addressObject.name,
        phone: addressObject.phone,
      });
      setSelectedOption("By_Seller");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi!");
    }
  }, [textCopy]);

  function parseAddress(text) {
    const lines = text
      .trim()
      .split("\n")
      .map((line) => line.trim()); // Loại bỏ khoảng trắng và ký tự xuống dòng

    if (lines.length < 5) {
      throw new Error("Invalid address format");
    }

    return {
      name: lines[0].replace(/[\r"]/g, ""), // Xóa \r và dấu "
      phone: lines[1]
        .replace(/[^\d+]/g, "")
        .replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1$2$3$4"),
      address: {
        street: lines[2].replace(/[\r"]/g, ""), // Xóa \r và dấu "
        city: lines[3].split(",")[0].trim(),
        state: lines[3].split(",")[1].trim(),
        country: lines[3].split(",")[2].trim(),
        zipCode: lines[4].replace(/[\r"]/g, ""), // Xóa \r và dấu "
      },
    };
  }

  const handleChange = (value) => {
    setSelectedOption(value);
  };
  const handlePaste = async () => {
    async function readClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        if (!text || !text.trim()) {
          toast.error("Chưa copy nội dung!");
          return;
        }
        setTextCopy(text);
      } catch (err) {
        console.log(err);
        toast.error("Lỗi!");
      }
    }
    await readClipboard();
  };
  return (
    <AuthGuard>
      <Main title={"Create Order"}>
        <div>
          <button onClick={handleSubmit} className={style.btnSave}>
            Lưu
          </button>
          <button onClick={cancel} className={style.btnCancel}>
            Hủy
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
            <div onClick={handlePaste} className={style["btn-clipboard"]}>
              <i class="bi bi-clipboard-check"></i>
              paste to clipboard
            </div>
            <div>
              <Form.Control
                as="textarea"
                rows={3}
                value={textCopy}
                placeholder="Nhập nội dung tại đây"
                onChange={(e) => setTextCopy(e.target.value)}
                style={{ height: "150px", marginBottom:"4px"}}
              />
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
        {loading && <Loading />}
      </Main>
    </AuthGuard>
  );
}
