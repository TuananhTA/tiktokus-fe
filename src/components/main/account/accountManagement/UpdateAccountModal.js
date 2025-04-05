import React, { use, useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Loading from "@/components/loading";
import authorizeAxiosInstance from "@/hooks/axios";
import { mutate } from "swr";
import { toast } from "react-toastify";
require('dotenv').config()

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT

const UpdateAccountModal = ({user, show, setShow, setUser }) => {
  const [balance, setBalance] = useState({
    balance :  0
  });

  useEffect(()=>{
    setBalance({
      balance :  0
    })
  },[show])
  const [loading, setLoading] = useState(false);
  const [errorVali, setErrorVali] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    balance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "balance"){
      setBalance({
        ...balance,
        [name] : value
      })
    }
    setUser({
      ...user,
      [name]: value,
    });
  };

  const validate = () => {
    let errors = {};
    let isValid = true;

    // Kiểm tra họ và tên
    if (!user.fullName) {
      errors.fullName = "Họ và tên là bắt buộc.";
      isValid = false;
    }

    // Kiểm tra email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!user.email) {
      errors.email = "Email là bắt buộc.";
      isValid = false;
    } else if (!emailPattern.test(user.email)) {
      errors.email = "Email không hợp lệ.";
      isValid = false;
    }

    // Kiểm tra số điện thoại
    if (!user.phone) {
      errors.phone = "Số điện thoại là bắt buộc.";
      isValid = false;
    }

    // Kiểm tra mật khẩu
    if (user.password && user.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      isValid = false;
    }

    // Kiểm tra số dư
    if (isNaN(Number.parseFloat(balance.balance))) {
      errors.balance = "Số dư phải là một.";
      isValid = false;
    }

    setErrorVali(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true)
      console.log("Account Update:", user);
      try {
        let url = `${URL_ROOT}/private/user/edit/${user.id}`

        let newUser = {
          ...user,
          balance: balance.balance
        }
        await authorizeAxiosInstance.put(url,newUser);
        mutate(`${URL_ROOT}/private/user/get-staff`)
        setLoading(false);
        onHide();
        toast.success("Cập nhật thành công!")
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };
  
  const onHide = () =>{
    setShow(false)
    setErrorVali({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        balance: "",
    });
    setUser({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        balance: 0,
      });
  }

  return (
    <div>
      {/* Modal */}
      <Modal show={show} backdrop="static" onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo Tài Khoản Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Họ và Tên */}
            <Form.Group controlId="fullName" className="mt-2">
              <Form.Label>Họ và Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
              />
              {errorVali.fullName && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errorVali.fullName}
                </span>
              )}
            </Form.Group>

            {/* Email */}
            <Form.Group controlId="email" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
              {errorVali.email && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errorVali.email}
                </span>
              )}
            </Form.Group>

            {/* Số Điện Thoại */}
            <Form.Group controlId="phone" className="mt-2">
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                name="phone"
                value={user.phone}
                onChange={handleChange}
              />
              {errorVali.phone && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errorVali.phone}
                </span>
              )}
            </Form.Group>

            {/* Mật khẩu */}
            <Form.Group controlId="password" className="mt-2">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Đổi mật khẩu"
                name="password"
                value={user.password}
                onChange={handleChange}
              />
              {errorVali.password && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errorVali.password}
                </span>
              )}
            </Form.Group>
            {/* Số Dư */}
            <Form.Group controlId="balance" className="mt-2">
              <Form.Label>Cộng vào số dư</Form.Label>
              <Form.Control
                type="number"
                name="balance"
                value={balance.balance}
                onChange={handleChange}
              />
              {errorVali.balance && (
                <span style={{ color: "red", fontSize: "0.875rem" }}>
                  {errorVali.balance}
                </span>
              )}
            </Form.Group>

            <Form.Group controlId="status" className="mt-2">
              <Form.Label>Trạng Thái</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={user.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="LOCKED">LOCKED</option>
              </Form.Control>
            </Form.Group>

            {/* Nút tạo tài khoản */}
            <Button variant="primary" type="submit" className="mt-2">
              Cập nhật
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default UpdateAccountModal;
