"use client"
import { Form, Row, Col } from 'react-bootstrap';
import { useStore } from '@/store/hooks';

const OrderInfo = ({orderInfo, setOrderInfo, errors}) => {

    const [{user}] = useStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderInfo((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };


    return (
      <div>
         <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="desgin">
              <Form.Label>Desgin</Form.Label>
              <Form.Control
                type="text"
                name="desgin"
                autoComplete="off"
                value={orderInfo.desgin}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="mockup">
              <Form.Label>Mockup</Form.Label>
              <Form.Control
                type="text"
                name="mockup"
                autoComplete="off"
                value={orderInfo.mockup}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        {
         user?.role === "ADMIN" &&   <Row className="mb-3">
            <Col md={12}>
              <Form.Group className="mt-3">
                <Form.Label>
                  Status<span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="status"
                  value={orderInfo.status}
                  onChange={handleChange}
                >
                  <option value="NEW">NEW</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        }
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="labelUrl">
              <Form.Label>Label URL</Form.Label>
              <Form.Control
                type="text"
                name="labelUrl"
                autoComplete="off"
                value={orderInfo.labelUrl}
                onChange={handleChange}
              />
              {errors.labelUrl && (
                <Form.Text className="text-danger">{errors.labelUrl}</Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="tracking">
              <Form.Label>Tracking</Form.Label>
              <Form.Control
                type="text"
                name="tracking"
                autoComplete="off"
                value={orderInfo.tracking}
                onChange={handleChange}
              />
              {errors.tracking && (
                <Form.Text className="text-danger">{errors.tracking}</Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group controlId="extraId">
              <Form.Label>Extra ID</Form.Label>
              <Form.Control
                type="text"
                name="extraId"
                autoComplete="off"
                value={orderInfo.extraId}
                onChange={handleChange}
              />
                {errors.extraId && (
                <Form.Text className="text-danger">{errors.extraId}</Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>
      </div>
    );
};

export default OrderInfo;
