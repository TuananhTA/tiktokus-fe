import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

const EditModal = ({ show, handleClose, order, handleSave }) => {
  const [formData, setFormData] = useState({});
  useEffect(()=>{
    if(!order) return;
    if(show){
        setFormData({
            labelUrl: order.labelUrl,
            tracking: order.tracking,
            type: order.type,
        })
    }
  }, [show, order])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    handleSave(formData,order.id);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa thông tin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formLabelUrl">
            <Form.Label>Label URL</Form.Label>
            <Form.Control
              type="text"
              name="labelUrl"
              value={formData?.labelUrl || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTracking">
            <Form.Label>Tracking</Form.Label>
            <Form.Control
              type="text"
              name="tracking"
              value={formData?.tracking || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formType">
            <Form.Label>Ship by</Form.Label>
            <Form.Select
              onChange={handleChange}
              value={formData?.type || ""}
              style={{ padding: "4px", borderRadius: "4px" }}
              name="type"
            >
              <option value="By_TikTok">By_TikTok</option>
              <option value="By_Seller">By_Seller</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
