"use client";
import { Table, Container, Button, Form, Row, Col } from "react-bootstrap";
import style from "./style.module.css";
import { useState, useEffect, useRef } from "react";
import Popper from "../../Popper";
import authorizeAxiosInstance from "@/hooks/axios";
import { debounce } from "lodash"; // Import lodash
import { toast } from "react-toastify";
import PaginationCustom from "@/components/Pagination/PaginationCustom";

require("dotenv").config();

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

export default function ListProduct({ user }) {
  const [products, setProducts] = useState([]); // Toàn bộ danh sách sản phẩm
  const [paginatedProducts, setPaginatedProducts] = useState([]); // Dữ liệu hiển thị theo trang
  const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const popperRef = useRef(null);
  const [page, setPage] = useState(1); // Trang hiện tại (bắt đầu từ 1)
  const [size, setSize] = useState(7); // Kích thước mỗi trang

  // Fetch toàn bộ dữ liệu sản phẩm từ server
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      let url = `${URL_ROOT}/private/product/get-all-by-user/${user.id}?page=0&size=50000`;
      try {
        let response = await authorizeAxiosInstance.get(url);
        const data = response?.data?.content || [];
        console.log(data)
        setProducts(data);
        setPage(1); // Reset về trang đầu khi có dữ liệu mới
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user]);

  // Cập nhật danh sách hiển thị theo trang
  useEffect(() => {
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    if (Array.isArray(products)) {
      setPaginatedProducts(products.slice(startIndex, endIndex)); // Chỉ gọi slice nếu products là mảng
    } else {
      setPaginatedProducts([]); // Đặt giá trị mặc định nếu không phải mảng
    }
  }, [page, size, products]);

  const handleDelete = (product) => {
    setProducts(products.filter((item) => item.id !== product.id));
  };

  const add = (p) => {
    if (products.find((item) => item.id === p.id)) return;
    setProducts([p, ...products]);
    setIsVisible(false);
  };

  const saveProduct = async () => {
    if (!user) {
      toast.error("Fail because User is not chosen!");
      return;
    }
    try {
      let url = `${URL_ROOT}/private/product/add-product-for-user/${user.id}`;
      await authorizeAxiosInstance.put(url, products);
      toast.success("Thành công!");
    } catch (error) {
      toast.error("Thất bại!");
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popperRef.current && !popperRef.current.contains(event.target)) {
        setIsVisible(false); // Ẩn Popper nếu nhấp chuột bên ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debouncedSearch = debounce(async (term) => {
    let res = await authorizeAxiosInstance.get(
      `${URL_ROOT}/private/product/search?search=${term}&page=0&size=50000`
    );
    setIsVisible(true);
    console.log(res)
    setSearchResult(res?.data?.content || []);
  }, 300); // Chậm 300ms sau khi người dùng dừng nhập

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResult([]);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);


  if (!user) return <div>Vui lòng chọn user trước..</div>;

  return (
    <>
      <h4>Danh sách sản phẩm được order</h4>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="pt-2 pb-2">
          <Button onClick={saveProduct}>Lưu</Button>
        </div>
        <div className="pt-2 pb-2">
          <Form.Group as={Row} className="mb-3">
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm sản phẩm bằng tên hoặc mã sku chính xác"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => setIsVisible(true)}
                className={style.input}
              />
              {isVisible && searchResult.length > 0 && (
                <div className="position-relative" ref={popperRef}>
                  <Popper>
                    {searchResult.map((product, index) => (
                      <div
                        key={index}
                        className={`d-flex p-2 mb-1 position-relative ${style.cardItem}`}
                        style={{ border: "1px dashed", borderRadius: "4px" }}
                        onClick={() => add(product)}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={product.urlImage}
                            alt={product.productName}
                            className="img-fluid"
                            style={{ width: "40px", height: "40px" }}
                          />
                        </div>
                        <div style={{ paddingLeft: "6px" }}>
                          <p className="m-0" style={{fontSize:"14px"}}>{product.productName}</p>
                          <span>{product.sku}</span>
                        </div>
                      </div>
                    ))}
                  </Popper>
                </div>
              )}
            </Col>
          </Form.Group>
        </div>
      </div>
      <div>
        <Table striped bordered hover bsPrefix className={style.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Chọn</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product, index) => (
              <tr key={product.id}>
                <td style={{width: "40px"}}>{(page - 1) * size + index + 1}</td>
                <td>
                  <div style={{ display: "flex" }}>
                    <div>
                      <img
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                        src={product.urlImage}
                      />
                    </div>
                    <div style={{ paddingLeft: "8px" }}>
                      <p style={{ margin: "0" }}>{product.productName}</p>
                      <p className="m-0">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <Button
                    className="btn btn-danger"
                    onClick={() => handleDelete(product)}
                    style={{fontSize:"12px", padding:"2px 8px"}}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{display:"flex"}}>
          <PaginationCustom
            currentPage={page}
            totalPages={Math.ceil(products.length / size)}
            onPageChange={(newPage) => setPage(newPage)}
          />
          <Form.Group controlId="formSelect" style={{marginLeft:"4px", width:"80px"}}>
            <Form.Control 
              as="select" 
              value={size}
              onChange={(e)=> {
                setPage(1);
                setSize(e.target.value)
              }}
            >
              <option value="7" >Size</option>
              <option value="7" >7</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Control>
          </Form.Group>
        </div>
      </div>
    </>
  );
}
