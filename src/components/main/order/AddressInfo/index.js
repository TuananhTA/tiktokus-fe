"use client";
import { Form, Row, Col, FormGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
const axios = require("axios");
require("dotenv").config();

let EMAIL = process.env.NEXT_PUBLIC_EMAIL;
let API_KEY = process.env.NEXT_PUBLIC_API_KEY;
let API_STATES = process.env.NEXT_PUBLIC_states;
let API_GET = process.env.NEXT_PUBLIC_Getaccesstoken;

const AddressInfo = ({ addressInfo, setAddressInfo, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [states, setStates] = useState();
  useEffect(() => {
    (async () => {
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
        console.log(error);
      }
    })();
  }, []);
  console.log(addressInfo);
  return (
    <div>
      <Row className="mb-3">
        <Col md={6}>
          <Col>
            <Form.Group controlId="street">
              <Form.Label>
                Street<span className="text-danger">* </span>
                {errors.street && (
                  <Form.Text className="text-danger">{errors.street}</Form.Text>
                )}
              </Form.Label>
              <Form.Control
                type="text"
                name="street"
                required
                autoComplete="off"
                value={addressInfo.street}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Form.Group controlId="streetTwo" className="mt-3">
            <Form.Label>Street 2</Form.Label>
            <Form.Control
              type="text"
              name="streetTwo"
              required
              autoComplete="off"
              value={addressInfo.streetTwo}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="city" className="mt-3">
            <Form.Label>
              City<span className="text-danger">* </span>
              {errors.city && (
                <Form.Text className="text-danger">{errors.city}</Form.Text>
              )}
            </Form.Label>
            <Form.Control
              type="text"
              name="city"
              required
              autoComplete="off"
              value={addressInfo.city}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>State</Form.Label>
            <Form.Control
              as="select"
              name="state"
              value={addressInfo.state}
              onChange={handleChange}
             // Hiển thị border đỏ nếu có lỗi
            >
              {states?.map((state, index) => (
                <option key={index} value={state.state_name}>
                  {state.state_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="country" className="mt-3">
            <Form.Label>
              Country<span className="text-danger">* </span>
              {errors.country && (
                <Form.Text className="text-danger">{errors.country}</Form.Text>
              )}
            </Form.Label>
            <Form.Control
              type="text"
              name="country"
              required
              autoComplete="off"
              value={addressInfo.country}
              disabled
            />
          </Form.Group>
          <Form.Group controlId="zipCode" className="mt-3">
            <Form.Label>
              Zip Code<span className="text-danger">* </span>
              {errors.zipCode && (
                <Form.Text className="text-danger">{errors.zipCode}</Form.Text>
              )}
            </Form.Label>
            <Form.Control
              type="text"
              name="zipCode"
              required
              autoComplete="off"
              value={addressInfo.zipCode}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default AddressInfo;
