"use client";
import Main from "@/components/main/main";
import { Button, Form} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import authorizeAxiosInstance from "@/hooks/axios";
import {toast } from 'react-toastify';
import Loading from "@/components/loading";
import TrasTable from "@/components/main/Transaction/TableTransaction"
import getData from "@/hooks/useFechtData";
import { useStore } from "@/store/hooks";
import AuthGuard from "@/components/AuthProvider/AuthGuard"
import PaginationCustom from "@/components/Pagination/PaginationCustom"
require("dotenv").config();

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

export default function Transaction() {
  const [show, setShow] = useState(false);
  const [errorVali, setError] = useState();
  const [loading, setLoading] = useState(false);

  const [expense, setExpense] = useState({});
  const [currExpense, setCurrExpense] = useState({});
  let urlGetData = `${URL_ROOT}/private/transaction/get-user-login`

  const [{user}] = useStore();

  if(user && user?.role === "ADMIN"){  
    urlGetData = `${URL_ROOT}/private/transaction/get-all`
  }
  const [page, setPage] = useState(0); // Trang bắt đầu từ 0
  const [size, setSize] = useState(10); // Số phần tử mỗi trang

  const params = {
    page,
    size
  };

  const { data, isLoading } = getData(urlGetData,params);

   useEffect(() => {
    const fetchData = async () => {
      let res = await authorizeAxiosInstance.get(
        `${URL_ROOT}/private/expense/get-expense`
      );
      setExpense(res.data);
      setCurrExpense(res.data);
    };
    fetchData();
  }, [show]);

  const handleClose = () => {
    
    setShow(false);
  }
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    if (!errorVali) {
        setLoading(true)
        // Thực hiện hành động khi dữ liệu hợp lệ
        console.log("Expense:", expense.expense);
        try{ 
            let res = await authorizeAxiosInstance.put(`${URL_ROOT}/private/expense/update`, expense);
            setLoading(false);
            toast.success("Điều chỉnh thành công!");
            setShow(false);
        }catch(error){
            toast.error("Điều chỉnh thất bại!");
            console.log(error);
        }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let newValue = value;
    if (name === "step") {
      newValue = value.match(/^\d*/)?.[0] || "";
    }

    setExpense({
      ...expense,
      [name]: newValue,
    });

    // Kiểm tra nếu trường đang cập nhật là 'expense' và giá trị hợp lệ
    if (name === 'expense') {
      const parsedValue = Number.parseFloat(newValue);
      if (parsedValue < 0 || isNaN(parsedValue)) {
        console.log(1);
        setError("Giá trị phải là số dương.");
      }
      else {
        setError(""); // Xóa lỗi nếu hợp lệ
      }
    }
    else if (name === 'step') {
      const intValue = Number.parseInt(newValue);
      if (intValue < 0 || isNaN(intValue)) {
        setError("Giá trị phải là số nguyên dương.");
      }
      else {
        setError(""); // Xóa lỗi nếu hợp lệ
      }
    }
    else if (name === 'lableCosts') {
      const intValue = Number.parseInt(newValue);
      if (intValue < 0 || isNaN(intValue)) {
        setError("Giá trị phải là số nguyên dương.");
      }
      else {
        setError(""); // Xóa lỗi nếu hợp lệ
      }
    }
};



  function formatToUSD(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount).replace(/,/g, '');
  }
  if(isLoading) return <Loading></Loading>
 const transactions = data?.data?.content || [];
 const totalPages = data?.data?.totalPages || 1;

  return (
    <AuthGuard>
      <Main title={"Transaction"}>
        {user.role === "ADMIN" && (
          <div>
            <Button variant="primary" onClick={handleShow}>
              Điều chỉnh chi phí
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Điều chỉnh</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {errorVali && (
                  <span className="mt-2 text-danger">{errorVali}</span>
                )}
                <Form.Group controlId="formName">
                  <Form.Label>Chi phí</Form.Label>
                  <Form.Control
                    type="number"
                    name="expense"
                    value={expense.expense}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formName" className="pt-2">
                  <Form.Label>Bước nhảy sản phẩm</Form.Label>
                  <Form.Control
                    type="number"
                    name="step"
                    value={expense.step}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formName" className="pt-2">
                  <Form.Label>Lable</Form.Label>
                  <Form.Control
                    type="number"
                    name="lableCosts"
                    value={expense.lableCosts}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
            <span
              style={{
                display: "inline-block",
                fontSize: "16px",
                marginLeft: "8px",
              }}
            >
              Chi phí hiện tại: {formatToUSD(currExpense.expense)}
            </span>
          </div>
        )}
        <div className="pt-4">
          <TrasTable transactions={transactions} page={page} size={size} />
        </div>
        <div style={{display:"flex"}}>
          <PaginationCustom
            currentPage={page + 1} // currentPage bắt đầu từ 1 cho UI
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage - 1)} // Chuyển về index 0-based cho API
          />
          <Form.Group controlId="formSelect" style={{marginLeft:"4px", width:"80px"}}>
            <Form.Control 
              as="select" 
              value={size}
              onChange={(e)=> {
                setPage(0);
                setSize(e.target.value)
              }}
            >
              <option value="10" >Size</option>
              <option value="10" >10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Control>
          </Form.Group>
        </div>
        {loading && <Loading></Loading>}
      </Main>
    </AuthGuard>
  );
}
