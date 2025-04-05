// components/ProductModal.js
import { Modal, Button, Table, Nav, Tab } from 'react-bootstrap';

const ProductModal = ({
  show,
  onHide,
  availableProducts,
  assignedProducts,
  onAddProduct,
  onRemoveProduct,
  onSave
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thêm sản phẩm vào danh mục</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="assigned">
          <Nav variant="tabs" className="d-flex justify-content-start">
            <Nav.Item>
              <Nav.Link eventKey="assigned">Trong danh mục</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="available">Ngoài danh mục</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="available">
              <Table striped bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th>Thêm vào danh mục</th>
                  </tr>
                </thead>
                <tbody>
                  {availableProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>
                        <Button
                          variant="success"
                          onClick={() => onAddProduct(product)}
                        >
                          Thêm
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab.Pane>

            <Tab.Pane eventKey="assigned">
              <Table striped bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th>Loại bỏ khỏi danh mục</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => onRemoveProduct(product)}
                        >
                          Loại bỏ
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={onSave}>
          Lưu sản phẩm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
