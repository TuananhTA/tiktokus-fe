"use client"
import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import getData from "@/hooks/useFechtData";
require("dotenv").config();


let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

const ProductModal = ({ show, handleClose }) => {
  // Danh sách sản phẩm giả lập
  const {data: products, isLoading} = getData(`${URL_ROOT}/private/product/get-all-to-excel`)

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Xử lý tìm kiếm
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProducts(
      products.filter((product) =>
        product.sku.toLowerCase().includes(term)
      )
    );
  };

  // Chọn tất cả hoặc bỏ chọn tất cả
  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(filteredProducts);
    } else {
      setSelectedProducts([]);
    }
  };

  // Xử lý chọn từng sản phẩm
  const toggleSelectProduct = (product) => {
    const exists = selectedProducts.some((p) => p.id === product.id);
    if (exists) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // Xóa sản phẩm khỏi danh sách đã chọn
  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  if(isLoading) return <>is Loading...</>

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chọn Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Phần 1: Chọn tất cả và tìm kiếm */}
        <div className="d-flex align-items-center mb-3">
          <Form.Check
            type="checkbox"
            label="Chọn tất cả"
            className="me-3"
            onChange={(e) => toggleSelectAll(e.target.checked)}
          />
          <Form.Control
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Kết quả tìm kiếm */}
        {searchTerm && (
          <div className="mb-3">
            <strong>Kết quả tìm kiếm:</strong>
            {filteredProducts.length > 0 ? (
              <ul className="list-group mt-2">
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {product.sku} - Số lượng: {product.quantity}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => toggleSelectProduct(product)}
                    >
                      {selectedProducts.some((p) => p.id === product.id) ? "Bỏ chọn" : "Chọn"}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mt-2">Không tìm thấy sản phẩm nào.</p>
            )}
          </div>
        )}

        {/* Phần 2: Hiển thị sản phẩm đã chọn */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>SKU</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt="Product" width="50" />
                </td>
                <td>{product.sku}</td>
                <td>{product.quantity}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
