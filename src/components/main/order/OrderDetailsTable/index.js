"use client";
import { useState, useRef, useEffect } from "react";
import { debounce } from "lodash"; // Import lodash
import { Table, Form, Row, Col } from "react-bootstrap";
import Popper from "../../Popper";
import style from "./style.module.css";
import authorizeAxiosInstance from "@/hooks/axios";
require('dotenv').config()

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT

const OrderDetailsTable = ({ orderDetails, setOrderDetails, type }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResulf, setSearchResult] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const [fee, setFee] = useState(0);
  const [label, setLable] = useState(0);
  const [total, setTotal] = useState(0);
  const [expense, setExpense] = useState({});

  const popperRef = useRef(null);

  // Hàm debounced cho việc tìm kiếm
  const debouncedSearch = debounce(async (term) => {
    let res = await authorizeAxiosInstance.get(
      `${URL_ROOT}/private/product/search-in-order?search=${term}`
    );
    setIsVisible(true);
    setSearchResult(res.data);
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

  useEffect(() => {
    const fetchData = async () => {
      let res = await authorizeAxiosInstance.get(
        `${URL_ROOT}/private/expense/get-expense`
      );
      setExpense(res.data)
    };
    fetchData();
  }, []);

  useEffect(() => {
    if(expense){
      console.log(expense)
      let quantity = 0;
      const sum = orderDetails.reduce((acc, item) => {
        if (item.product?.price && item.quantity) {
          quantity += item.quantity;
          return acc + item.quantity * item.product.price;
        }
        return acc;
      }, 0);
      let roundedUp = Math.ceil(quantity/ expense.step);
      setFee(expense.expense * roundedUp);
      if(orderDetails && orderDetails.length > 0)
        setLable(expense.lableCosts);
      setTotal(sum);
    }
  }, [orderDetails, expense]);

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

  const add = (product) => {
    let updatedOrderDetails;
    if (orderDetails) {
      // Tìm sản phẩm trong orderDetails
      const existingProduct = orderDetails.find(
        (item) => item.product.id === product.id
      );
      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
        existingProduct.quantity += 1;
        updatedOrderDetails = [...orderDetails];
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào orderDetails
        updatedOrderDetails = [...orderDetails, { product, quantity: 1 }];
      }
    } else {
      // Nếu orderDetails không tồn tại, khởi tạo nó với sản phẩm mới
      updatedOrderDetails = [{ product, quantity: 1 }];
    }
  
    setOrderDetails(updatedOrderDetails);
  
    // // Cập nhật lại total sau khi orderDetails thay đổi
    // const sum = updatedOrderDetails.reduce((acc, item) => {
    //   if (item.product?.price && item.quantity) {
    //     return acc + item.quantity * item.product.price;
    //   }
    //   return acc;
    // }, 0);
    // console.log(sum);
    // setTotal(sum);
    setIsVisible(false);
  };
  
  const deleteProduct = (productId)=>{
    setOrderDetails(prevOrderDetails => 
        prevOrderDetails.filter(item => item.product.id !== productId)
    );
  }

  const updateQuantity = (productId, newQuantity) => {
    setOrderDetails(prevOrderDetails =>
      prevOrderDetails.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const updateQuantityWhenBlur = (productId, newQuantity) => {
    console.log("blur")
    if(isNaN(newQuantity) || newQuantity === 1){
        updateQuantity(productId,1);
    }
  };
  function formatToUSD(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount).replace(/,/g, '');
  }  

  return (
    <div>
      <Form.Group as={Row} className="mb-3">
        <Col md={12}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => setIsVisible(true)}
            className={style.input}
          />

          {isVisible && searchResulf.length > 0 && (
            <div className="position-relative" ref={popperRef}>
              <Popper>
                {searchResulf.map((product, index) => {
                  return (
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
                          style={{ width: "50px", height: "50px" }}
                        />
                      </div>
                      <div style={{ paddingLeft: "6px" }}>
                        <p className="m-0">{product.productName}</p>
                        <span>Tồn kho: {product.quantity}</span> -{" "}
                        <span>Giá: {formatToUSD(product.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </Popper>
            </div>
          )}
        </Col>
      </Form.Group>

      {/* Bảng sản phẩm */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Tổng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails?.map((item) => (
            <tr key={item.product.id}>
              <td>{item.product.productName}</td>
              <td>
                <Form.Control
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                  className={style.inputQuatity}
                  onBlur={(e)=> updateQuantityWhenBlur(item.product.id,parseInt(e.target.value))}
                />
              </td>
              <td>{formatToUSD(item.product.price)}</td>
              <td>{Math.ceil((item.quantity * item.product.price) * 100) / 100}</td>
              <td >
                <button className={style.buttonDele} onClick={()=> deleteProduct(item.product.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
          <p>Tiền sản phẩm: {formatToUSD(total)}</p>
          <p>Chi phí: {formatToUSD(fee)}</p>
          <p>{type === "By_Seller" && <>Label: {formatToUSD(label)}</>}</p>
         <h4>Tổng tiền: {formatToUSD(fee + total)}</h4>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
