import { Form, Button, Container } from "react-bootstrap";
import Loading from "@/components/loading";
import authorizeAxiosInstance from "@/hooks/axios";
import { toast } from "react-toastify";
import { useState } from "react";
require("dotenv").config();

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

export default function UserFormInfo({ formData, setFormData }) {
  const [loading, setLoading] = useState(false);

  const [errorVali, setErrorVali] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorVali({
      fullName: "",
      email: "",
      phone: "",
      password: "",
    });

    let isValid = true;
    let errors = {};

    // Validate Name
    if (!formData.fullName.trim()) {
      errors.fullName = "Name is required.";
      isValid = false;
    }

    // Validate Email
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate Phone
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number (10-15 digits).";
      isValid = false;
    }

    // Validate Password
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    if (!isValid) {
      setErrorVali(errors);
      return;
    }

    console.log("User Data:", formData);
    try {
      let url = `${URL_ROOT}/private/user/edit/${formData.id}`;
      await authorizeAxiosInstance.put(url, formData);
      setLoading(false);
      toast.success("Cập nhật thành công!");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Container className="mt-5">
      <h2>My Info</h2>
      <Form onSubmit={handleSubmit}>
        {/* Name Field */}
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errorVali.fullName && (
            <span
              style={{ color: "red", fontSize: "0.875em" }}
              className="mt-2"
            >
              {errorVali.fullName}
            </span>
          )}
        </Form.Group>

        {/* Email Field */}
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errorVali.email && (
            <span
              style={{ color: "red", fontSize: "0.875em" }}
              className="mt-2"
            >
              {errorVali.email}
            </span>
          )}
        </Form.Group>

        {/* Phone Field */}
        <Form.Group controlId="formPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errorVali.phone && (
            <span
              style={{ color: "red", fontSize: "0.875em" }}
              className="mt-2"
            >
              {errorVali.phone}
            </span>
          )}
        </Form.Group>

        {/* Password Field */}
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Change password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errorVali.password && (
            <span
              style={{ color: "red", fontSize: "0.875em" }}
              className="mt-2"
            >
              {errorVali.password}
            </span>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Lưu
        </Button>
      </Form>
    </Container>
  );
}
