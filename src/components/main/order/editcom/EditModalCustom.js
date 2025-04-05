import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
const axios = require("axios");
require("dotenv").config();

let EMAIL = process.env.NEXT_PUBLIC_EMAIL;
let API_KEY = process.env.NEXT_PUBLIC_API_KEY;
let API_STATES = process.env.NEXT_PUBLIC_states;
let API_GET = process.env.NEXT_PUBLIC_Getaccesstoken;

const EditModal = ({ show, handleClose, order, handleSave }) => {

  const [formData, setFormData] = useState({});
  const [states, setStates] = useState([]);

  // Data when modal is displayed
  useEffect(() => {
    if(!show || !order) return;
    setFormData({
      customName: order.customName,
      phone: fomartPhone(order.phone),
      street: order.street,
      streetTwo: order.streetTwo,
      city: order.city,
      country: order.country,
      state: order.state,
      zipCode: order.zipCode,
      email: order.email,
    });
  }, [order, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
  const handleBluer = (e) => {
    let phoneNumber = fomartPhone(e.target.value);
    setFormData({
        ...formData,
        phone: phoneNumber
    })
  };
  const validInfo = () => {
    let isValid = true;
    // Kiểm tra formData
    if (!formData.customName || !formData.customName.trim()) {
      isValid = false;
    }
    if (!formData.phone || !formData.phone.trim()) {
      isValid = false;
    } else if (!/^(\(\+1\)|\+1|)?\s?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData.phone)) {
      isValid = false;
    }  
    if (
      formData.email &&
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)
    ) {
      isValid = false;
    }
    // Kiểm tra addressInfo
    if (!formData.street || !formData.street.trim()) {
      isValid = false;
    }
    if (!formData.street ||!formData.city.trim()) {
      isValid = false;
    }
    if ( !formData.zipCode || !formData.zipCode.trim()) {
      isValid = false;
    } else if (!/^\d{5,10}$/.test(formData.zipCode)) {
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = () => {
    console.log(formData);
    if(!validInfo()) {
        toast.error("Một số trườngcòn thiếu hoặc chưa đúng định dạng!");
        return;
    }
    handleSave(formData, order.id);
    handleClose();
  };
  useEffect(() => {
    // Gọi API để lấy states
    const fetchData = async () => {
      try {
        const response = await axios.get(API_GET, {
          headers: {
            Accept: "application/json",
            "api-token": API_KEY,
            "user-email": EMAIL,
          },
        });

        let api = response?.data?.auth_token;
        if (api) {
          const res = await axios.get(API_STATES, {
            headers: {
              Authorization: "Bearer " + api,
            },
          });

          setStates(res.data || []);
        }
      } catch (error) {
        setError(error.message);
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* First row: Custom Name and Phone */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCustomName">
                <Form.Label>Customer Name <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="customName"
                  value={formData.customName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone Number <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBluer}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formStreet">
                <Form.Label>Street Address <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formStreetTwo">
                <Form.Label>Street Address (Detailed)</Form.Label>
                <Form.Control
                  type="text"
                  name="streetTwo"
                  value={formData.streetTwo || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Third row: City and State */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCity">
                <Form.Label>City <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formState">
                <Form.Label>State <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  as="select"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {states?.map((state, index) => (
                    <option key={index} value={state?.state_name}>
                      {state?.state_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Fourth row: Zip Code and Email */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formZipCode">
                <Form.Label>Zip Code <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Fifth row: Country (disabled) and Status */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="formCountry">
                <Form.Label>Country <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value="United States"
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
