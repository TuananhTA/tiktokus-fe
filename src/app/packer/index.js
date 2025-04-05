"use client";
import Main from "@/components/main/main";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import getData from "@/hooks/useFechtData"; // Đảm bảo rằng getData dùng useSWR hoặc được cấu hình async đúng cách
import OrderTableInfo from "@/components/main/order/TableOrderInfo";
import { useStore } from "@/store/hooks";
import { useState, useRef, useEffect } from "react";
import PaginationCustom from "@/components/Pagination/PaginationCustom";
import { toast } from "react-toastify";
import ExportToExcel from "@/components/main/order/BtnExcel/ExportToExcel";
require("dotenv").config();

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

export default function Packer() {
  let url = `${URL_ROOT}/private/order/get-all`;

  const [userId, setUserId] = useState("-3");
  const [page, setPage] = useState(0); // Trang bắt đầu từ 0
  const [size, setSize] = useState(10); // Số phần tử mỗi trang
  const [debouncedKeyword, setDebouncedKeyword] = useState({userId}); // Từ khóa với debounce
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleSelectedDataChange = (newSelectedOrders) => {
    setSelectedOrders(newSelectedOrders);
  };  

  const [search, setSearch] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
    userId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    if (search.startDate && search.endDate) {
      let st = new Date(search.startDate);
      let ed = new Date(search.endDate);
      if (ed < st) {
        toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
        return;
      }
    }
    setDebouncedKeyword({
      ...search,
      startDate: convertDate(search.startDate),
      endDate: convertDate(search.endDate),
    });
    
  };
  const convertDate = (date) => (date ? `${date}T00:00` : "");

  const handleReste = () => {
    setPage(0);
    setSearch({
      search: "",
      status: "",
      startDate: "",
      endDate: "",
      userId
    });
    setDebouncedKeyword({userId});
  };

  const params = {
    page,
    size,
    ...(debouncedKeyword ? { ...debouncedKeyword } : {}),
  };

  const { data, error, key } = getData(url, params);
  const onCheck = (item) => {
     setUserId(item.id);
  };
  if (error) return <div>failed to load</div>;

  const orders = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  let URL_STAFF = `${URL_ROOT}/private/user/get-staff`
  const { data : users, isLoading : isUsersLoading, error: usersErros} = getData(URL_STAFF);
  return (
    <Main title={"Order"}>
      <div>
        <div className="d-flex mb-3">
          <ExportToExcel data={selectedOrders} />
        </div>

        <div className="d-flex justify-content-between flex-wrap">
          {/* Nhóm tìm kiếm 1 */}
          <div className="flex-grow-1 me-3">
            <Form.Group>
              <Form.Label>Mã hóa đơn</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm hóa đơn"
                name="search"
                value={search.search}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          {/* Nhóm tìm kiếm 2 */}
          <div className="flex-grow-2 me-3">
            <Form.Group>
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={search.status}
                onChange={handleChange}
              >
                <option value="">Tất cả</option>
                <option value="NEW">NEW</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELED">CANCELED</option>
              </Form.Select>
            </Form.Group>
          </div>

          {/* Nhóm tìm kiếm 3 */}
          <div className="flex-grow-2 me-3">
            <Form.Group>
              <Form.Label>Từ ngày</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={search.startDate}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          {/* Nhóm tìm kiếm 3 */}
          <div className="flex-grow-2 me-3">
            <Form.Group>
              <Form.Label>Kết thúc</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={search.endDate}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          {/* Nút tìm kiếm */}
        </div>
        <div className="d-flex">
          <div>
            <Button
              variant="primary"
              className="m-2 mb-0"
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </div>
          <div>
            <Button variant="danger" className="m-2 mb-0" onClick={handleReste}>
              Reset
            </Button>
          </div>
        </div>
      </div>
      <div>
        <OrderTableInfo
          orders={orders}
          orderKey={key}
          onSelectedDataChange={handleSelectedDataChange}
          selectedOrders={selectedOrders}
        />
      </div>
      <div style={{ display: "flex" }}>
        <PaginationCustom
          currentPage={page + 1} // currentPage bắt đầu từ 1 cho UI
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage - 1)} // Chuyển về index 0-based cho API
        />
        <Form.Group
          controlId="formSelect"
          style={{ marginLeft: "4px", width: "80px" }}
        >
          <Form.Control
            as="select"
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(e.target.value);
            }}
          >
            <option value="10">Size</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Form.Control>
        </Form.Group>
      </div>
    </Main>
  );
}
