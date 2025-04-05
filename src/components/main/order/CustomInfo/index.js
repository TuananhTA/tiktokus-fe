"use client";
import { Form, Row, Col } from "react-bootstrap";

const CustomerInfo = ({ customerInfo, setCustomerInfo, errors }) => {
  const handleChange = (e) => {
    let { name, value } = e.target;
    setCustomerInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleBluer = (e) => {
    let phoneNumber = e.target.value;
    if (!phoneNumber) return;
    if (phoneNumber.startsWith("+1") ) {
      phoneNumber = phoneNumber.replace(/^\+1/, "(+1)");
      setCustomerInfo({
        ...customerInfo,
        phone: phoneNumber,
      });
      return;
    }
    if(!phoneNumber.startsWith("(+1)")){
      phoneNumber = "(+1)" + phoneNumber;
      setCustomerInfo({
        ...customerInfo,
        phone: phoneNumber,
      });
    }
  };

  return (
    <div>
      <Form.Group as={Row} className="mb-3" autocomplete="off">
        <Col>
          <Form.Label>
            Customer Name <span className="text-danger">* </span>
            
          </Form.Label>
          <Form.Control
            type="text"
            name="customName"
            required
            autoComplete="off"
            onChange={handleChange}
            value={customerInfo.customName}
          />
          {errors.customName && (
                <Form.Text className="text-danger">{errors.customName}</Form.Text>
            )}
        </Col>
        <Col>
          <Form.Label>
            Phone<span className="text-danger">* </span>
          </Form.Label>
          <Form.Control 
            type="text" 
            name="phone" 
            required 
            autoComplete="off" 
            onChange={handleChange}
            onBlur={handleBluer}
            value={customerInfo.phone}
        />
          {errors.phone && (
                  <Form.Text className="text-danger">{errors.phone}</Form.Text>
              )}
        </Col>
        <Col>
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            name="email" 
            autoComplete="off"
            onChange={handleChange}
            value={customerInfo.email} 
        />
        {errors.email && (
                <Form.Text className="text-danger">{errors.email}</Form.Text>
            )}
        </Col>
      </Form.Group>
    </div>
  );
};

export default CustomerInfo;
