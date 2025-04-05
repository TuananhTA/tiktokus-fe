// components/CategoryModal.js
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryModal = ({ show, onHide, category, onSave, onChange, isFunc }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isFunc? 'Sửa danh mục' : 'Thêm danh mục'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCategoryName">
            <Form.Label>Tên danh mục</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên danh mục"
              value={isFunc? category.categoryName : category}
              onChange={onChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Hủy</Button>
        <Button variant="primary" onClick={onSave}>{isFunc ? 'Lưu' : 'Thêm'}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryModal;
