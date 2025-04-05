// components/ProductModal.js
"use client"
import { useState, useEffect } from 'react';
import { Modal, Button, Table, Nav, Tab } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { PhotoProvider, PhotoView } from 'react-photo-view';
const ProductModal = ({
  show,
  onHide,
  availableProducts,
  assignedProducts,
  onAddProduct,
  onRemoveProduct,
  onSave
}) => {

  let [list_1, setList_1] = useState([])
  let [list_2, setList_2] = useState([]);
  let [keyword_1, setKeyWord_1] = useState("")
  let [keyword_2, setKeyWord_2] = useState("")

  useEffect(() => {
    if (assignedProducts && availableProducts) {
      setList_1(assignedProducts);
      setList_2(availableProducts);
    }
  }, [assignedProducts, availableProducts]);

  const search = (list, debouncedKeyword, type) => {
    console.log("Debounced Keyword:", debouncedKeyword); // Kiểm tra từ khóa đã debounce

    const lowerCaseSearchTerm = debouncedKeyword.toLowerCase();
    let filteredList = debouncedKeyword
      ? list.filter(
          (item) =>
            item.sku.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.productName.toLowerCase().includes(lowerCaseSearchTerm)
        )
      : list;

    if (type === "IN") {
      setList_1(filteredList);
    } else {
      setList_2(filteredList);
    }
  };
  useEffect(()=>{
    const timer = setTimeout(() => {
      search(assignedProducts,keyword_1,"IN")
    }, 500); 
    return () => clearTimeout(timer);
  },[keyword_1])

  useEffect(()=>{
    const timer = setTimeout(() => {
      search(availableProducts,keyword_2,"OUT")
    }, 500); 
    return () => clearTimeout(timer);
  },[keyword_2])

  const close = ()=>{
    onHide();
    setKeyWord_1("");
    setKeyWord_2("");
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Thêm sản phẩm vào danh mục</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "520px" }}>
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
              <div style={{margin: "8px 0"}}>
                  Tìm kiếm: 
                  <input 
                    type='text' 
                    value={keyword_2}
                    style={{width : "70%", padding:"2px 4px"}} 
                    onChange={(e) => setKeyWord_2(e.target.value)}
                  />
              </div>
              <PerfectScrollbar style={{ maxHeight: "400px" }}>
                <Table striped bordered hover className="mt-2">
                  <thead style={{position:"sticky", top: "-1px"}}>
                    <tr>
                      <th>SKU</th>
                      <th style={{ width: "70%" }}>Sản phẩm</th>
                      <th>Thêm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list_2.map((product) => (
                      <tr key={product.id}>
                        <td>{product.sku}</td>
                        <td style={{ width: "70%" }}>
                          <PhotoProvider key={product.id}>
                            <PhotoView src={product.urlImage}>
                              <img
                                src={product.urlImage}
                                alt="Thumbnail"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  cursor: "pointer",
                                  marginRight: "4px",
                                }}
                              />
                            </PhotoView>
                          </PhotoProvider>
                          {product.productName}
                        </td>
                        <td>
                          <Button
                            style={{ padding: "2px 6px" }}
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
              </PerfectScrollbar>
            </Tab.Pane>

            <Tab.Pane eventKey="assigned">
              <div style={{margin: "8px 0"}}>
                  Tìm kiếm: 
                  <input type='text' 
                    value={keyword_1}
                    style={{width : "70%", padding:"2px 4px"}} 
                    onChange={(e) => setKeyWord_1(e.target.value)} 
                  />
              </div>
              <PerfectScrollbar style={{ maxHeight: "400px" }}>
                <Table striped bordered hover className="mt-2">
                  <thead style={{position:"sticky", top: "-1px"}}>
                    <tr>
                      <th>SKU</th>
                      <th style={{ width: "70%" }}>Sản phẩm</th>
                      <th>Loại bỏ</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "14px" }}>
                    {list_1.map((product) => (
                      <tr key={product.id}>
                        <td>{product.sku}</td>
                        <td style={{ width: "70%" }}>
                          <PhotoProvider key={product.id}>
                            <PhotoView src={product.urlImage}>
                              <img
                                src={product.urlImage}
                                alt="Thumbnail"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  cursor: "pointer",
                                  marginRight: "4px",
                                }}
                              />
                            </PhotoView>
                          </PhotoProvider>
                          {product.productName}
                        </td>
                        <td>
                          <Button
                            style={{ padding: "2px 6px" }}
                            variant="danger"
                            onClick={() => onRemoveProduct(product)}
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </PerfectScrollbar>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
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
