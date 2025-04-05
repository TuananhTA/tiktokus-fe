"use client";
import React, { useState, useEffect } from "react";
import { Form, Table, Button, Row, Col } from "react-bootstrap";
import getData from "@/hooks/useFechtData";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css"; // Import CSS cho PerfectScrollbar
import styled from "styled-components";

require("dotenv").config();

const URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

const SelectProductsPage = () => {
  const { data, isLoading } = getData(`${URL_ROOT}/private/product/get-all-to-excel`);
  var products = [];
  if (!isLoading) {
    products = data.data;
  }

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Xử lý tìm kiếm
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProducts(
      products.filter((product) => product.sku.toLowerCase().includes(term))
    );
    setCurrentPage(1); // Khi tìm kiếm, quay về trang 1
  };

  // Phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Chọn tất cả hoặc bỏ chọn tất cả trong toàn bộ danh sách sản phẩm
  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products); // Chọn tất cả sản phẩm trong danh sách gốc
    } else {
      setSelectedProducts([]); // Bỏ chọn tất cả
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

  if (isLoading) return <>Loading...</>;

  // Tính toán chỉ mục của các sản phẩm trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = searchTerm
    ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    : products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Tính số trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Xuất file Excel
  const exportToExcel = () => {
    if (selectedProducts.length === 0) return;

    const wb = XLSX.utils.book_new();
    const wsData = selectedProducts.map((product) => [
      product.productName,
      product.sku,
      `$${product.price.toFixed(2)}`, // Định dạng giá dưới dạng USD
      product.quantity,
      product.status === "AVAILABLE" ? "AVAILABLE" : "DISCONNECT",
      product.urlImage, // Thêm URL ảnh
    ]);

    const ws = XLSX.utils.aoa_to_sheet([
      ["Sản phẩm", "SKU", "Giá (USD)", "Số lượng", "Trạng thái", "URL Ảnh"],
      ...wsData,
    ]);

    XLSX.utils.book_append_sheet(wb, ws, "Selected Products");

    // Lấy ngày hiện tại và thêm vào tên file
    const today = new Date();
    const date = today.toISOString().split("T")[0]; // Định dạng yyyy-mm-dd
    const fileName = `product_robin_${date}.xlsx`;

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(file, fileName);
  };

  return (
    <Container>
      <h1>Chọn Sản Phẩm</h1>

      <Row>
        {/* Cột 1: Tất cả sản phẩm */}
        <Col md={6}>
          <div className="mb-3">
            {/* Phần tìm kiếm và chọn tất cả */}
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
            {/* Nút xuất Excel chỉ hiển thị khi có sản phẩm được chọn */}
            {selectedProducts.length > 0 && (
              <Button variant="success" onClick={exportToExcel} className="mb-3">
                Xuất Excel
              </Button>
            )}
          </div>

          {/* Hiển thị các sản phẩm với PerfectScrollbar */}
          <PerfectScrollbar style={{ maxHeight: "80vh" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Sản phẩm (SKU - Trạng thái)</th>
                  <th>Giá (USD)</th>
                  <th>Số lượng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.urlImage}
                        alt="Product"
                        width="50"
                        height="50"
                      />
                    </td>
                    <td>
                      {product.productName}
                      <br /> {product.sku} <br />
                      <span
                        className={`badge ${
                          product.status === "AVAILABLE"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {product.status === "AVAILABLE"
                          ? "AVAILABLE"
                          : "DISCONNECT"}
                      </span>
                    </td>
                    <td>
                      {/* Hiển thị giá */}
                      ${product.price.toFixed(2)}
                    </td>
                    <td>{product.quantity}</td>
                    <td>
                      <Button
                        variant={selectedProducts.some((p) => p.id === product.id) ? "danger" : "primary"}
                        size="sm"
                        onClick={() => toggleSelectProduct(product)}
                      >
                        {selectedProducts.some((p) => p.id === product.id)
                          ? "Bỏ chọn"
                          : "Chọn"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </PerfectScrollbar>

          {/* Phân trang */}
          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                {pageNumbers.map((number) => (
                  <li key={number} className="page-item">
                    <Button
                      className="page-link"
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Col>

        {/* Cột 2: Sản phẩm đã chọn */}
        <Col md={6}>
          <div>
            <h5>Sản phẩm đã chọn</h5>
            <PerfectScrollbar style={{ maxHeight: "80vh" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Sản phẩm (SKU - Trạng thái)</th>
                    <th>Giá (USD)</th>
                    <th>Số lượng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.urlImage}
                          alt="Product"
                          width="50"
                          height="50"
                        />
                      </td>
                      <td>
                        {product.productName}
                        <br /> {product.sku} <br />
                        <span
                          className={`badge ${
                            product.status === "AVAILABLE"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {product.status === "AVAILABLE"
                            ? "AVAILABLE"
                            : "DISCONNECT"}
                        </span>
                      </td>
                      <td>
                        {/* Hiển thị giá */}
                        ${product.price.toFixed(2)}
                      </td>
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
            </PerfectScrollbar>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

// Styled component cho header cố định
const Container = styled.div`
  padding: 20px;
  .table th {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
  }
`;

export default SelectProductsPage;
