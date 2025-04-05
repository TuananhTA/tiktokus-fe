"use client";
import Main from "@/components/main/main";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import getData from "@/hooks/useFechtData"; // Đảm bảo rằng getData dùng useSWR hoặc được cấu hình async đúng cách
import OrderTableInfo from "@/components/main/order/TableOrderInfo";
import { useStore } from "@/store/hooks";
import style from "./style.module.css";
import { useState, useRef, useEffect } from "react";
import PaginationCustom from "@/components/Pagination/PaginationCustom";
import { toast } from "react-toastify";
import useExcelReader from "@/hooks/useExcelReader";
import authorizeAxiosInstance from "@/hooks/axios";
import OrderModal from "@/components/main/order/TabOrders/Modal";
import { mutate } from "swr";
import DownloadButton from "@/components/main/order/DownloadButton";
import ExportToExcel from "@/components/main/order/BtnExcel/ExportToExcel";
import ScrollMenu from "@/components/ScrollMenu";
import { set } from "lodash";
require("dotenv").config();

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

export default function Order() {
  let urlGetData = `${URL_ROOT}/private/order/get-all-by-user`;
  let urlGetAll = `${URL_ROOT}/private/order/get-all`;

  const [check, setCheck] = useState(true);
  const [userId, setUserId] = useState(null);
  const url = check ? urlGetData : urlGetAll;
  const [{ user }] = useStore();
  const {
    data: jsonData,
    error: errorExcel,
    readExcelFile,
  } = useExcelReader();

  const [page, setPage] = useState(0); // Trang bắt đầu từ 0
  const [size, setSize] = useState(10); // Số phần tử mỗi trang
  const [debouncedKeyword, setDebouncedKeyword] = useState({}); // Từ khóa với debounce
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleSelectedDataChange = (newSelectedOrders) => {
    setSelectedOrders(newSelectedOrders);
  };

  const [search, setSearch] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
    userId:""
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
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Kích hoạt input file khi ấn nút
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      readExcelFile(file);
    }
    event.target.value = null;
  };
  var [ordersImport, setOrderImport] = useState([]);
  useEffect(() => {
    if (jsonData.length === 0) return;
    let orders = [];
    let index = 1;
    (async () => {
      for (let col of jsonData) {
        const skus = String(col.SKU)
          .split(",")
          .map((item) => item.trim());

        const quantities = String(col.Quantity)
          .split(",")
          .map((item) => Number.parseInt(item.trim()));

        let resProducts = await authorizeAxiosInstance.post(
          `${URL_ROOT}/private/product/get-product-by-skus`,
          skus
        );
        if (resProducts.data && resProducts.data.length === 0) {
          toast.error(`Không tim thấy sản phẩm ở ${col.__rowNum__}`);
          return;
        }

        if (resProducts.data.length < skus.length) {
          toast.warning(
            "Một số sản phẩm bạn không có quyền order! tại row: " +
              col.__rowNum__
          );
        }

        let orderDetailsList = resProducts.data.map((item, index) => {
          return {
            quantity: quantities[index],
            product: item,
          };
        });
        let phoneNumber = col.Phone;
        if (
          phoneNumber &&
          !phoneNumber.startsWith("+1") &&
          !phoneNumber.startsWith("(+1)")
        ) {
          phoneNumber = "+1 " + phoneNumber;
        }

        let order = {
          index,
          customName: col.Fullname,
          phone: phoneNumber,
          email: col.Email || "",
          street: col.Street,
          streetTwo: col.Street2 || "",
          city: col.City,
          country: col.Country,
          zipCode: col.Zipcode,
          status: "NEW",
          state: col["State"] || "",
          labelUrl: col["Label Url"] || "",
          tracking: col["Tracking Number"] || "",
          extraId: col["Extra Id"] || "",
          type: col["Ship by"] || "",
          orderDetailsList,
        };
        let { isValid, errors } = validateOrder(order);

        if (!isValid) {
          toast.error("Row: " + col.__rowNum__ + " " + errors);
          return;
        }
        index++;
        orders.push(order);
      }
      if (orders.length === 0) {
        toast.error("File không có dữ liệu!");
        return;
      }
      setOrderImport(orders);
    })();
  }, [errorExcel, jsonData]);

  useEffect(() => {
    if (ordersImport.length === 0) return;
    handleShow();
  }, [ordersImport]);
  if (error) return <div>failed to load</div>;

  const orders = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  function validateOrder(order) {
    let errors = "";
    let isValid = true;

    // Kiểm tra nếu type là BY_TIKTOK
    if (order.type === "By_TikTok") {
      if (!order.extraId) {
        errors += "Extra Id is required for By_TikTok type ";
        isValid = false;
      }
      if (!order.labelUrl) {
        errors += "Label URL is required for By_TikTok type ";
        isValid = false;
      }
      if (!order.tracking) {
        errors += "Tracking Number is required for By_TikTok type ";
        isValid = false;
      }
    }

    // Kiểm tra nếu type là BY_SELLER
    if (order.type === "By_Seller") {
      if (!order.customName) {
        errors += "Customer Name is required for By_Seller type ";
        isValid = false;
      }
      if (!order.phone) {
        errors += "Phone is required for By_Seller type ";
        isValid = false;
      } else {
        // Kiểm tra định dạng số điện thoại
        let phoneNumber = order.phone.trim();
        if (
          !/^(\(\+1\)|\+1)?\s?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phoneNumber)
        ) {
          errors +=
            "Phone must be a valid US number (e.g., +1 812-258-7306 or 812-258-7306). ";
          isValid = false;
        }
      }
      if (!order.street) {
        errors += "Street is required for By_Seller type ";
        isValid = false;
      }
      if (!order.state) {
        errors += "State is required for By_Seller type ";
        isValid = false;
      }
      if (!order.country) {
        errors += "Country is required for By_Seller type ";
        isValid = false;
      }
      if (!order.city) {
        errors += "City is required for By_Seller type ";
        isValid = false;
      }
      if (!order.zipCode) {
        errors += "Zip Code is required for By_Seller type ";
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handlerSubmitImportExcel = async () => {
    try {
      await authorizeAxiosInstance.post(
        `${URL_ROOT}/private/order/create-order-by-file`,
        ordersImport
      );
      toast.success("Thành công");
      mutate(key);
      handleClose();
    } catch (error) {}
  };
  let URL_STAFF = `${URL_ROOT}/private/user/get-staff`
  const { data : users, isLoading : isUsersLoading, error: usersErros} = getData(URL_STAFF);
  useEffect(() => {
    setPage(0);
    if (userId !== null) {
      setSearch({
        search: "",
        status: "",
        startDate: "",
        endDate: "",
        userId,
      });
      if (userId === -2) {
        setCheck(true);
        setDebouncedKeyword({});
      }else{
        setCheck(false);
        setDebouncedKeyword({ userId });
      }
    }
  }, [userId]);

  const mergareItem = ()=>{
      const items = [
        {
          id: -2,
          categoryName: "MY ORDER",
        },
        {
          id:-3,
          categoryName: "ORDER",
        },
        {
          id:-1,
          categoryName: "SELLER",
        },
      ];

      if(!isUsersLoading && !usersErros){
        users.data.forEach (user=>{
          if(user.role != "PACKER"){
            let item = {
              id: user.id,
              categoryName : user.fullName
            }
            items.push(item);
          }
        })
      }
      return items;
  } 
  const items = mergareItem();
  return (
    <Main title={"Order"}>
      <div>
        <OrderModal
          orders={ordersImport}
          showModal={showModal}
          handleClose={handleClose}
          handleSubmit={handlerSubmitImportExcel}
        />
        <div className="d-flex mb-3">
          <a href={"/order/create"}>
            <Button className="m-1">Tạo hóa đơn</Button>
          </a>
          <Button variant="dark" className="m-1" onClick={handleButtonClick}>
            Import từ CSV
          </Button>
          <DownloadButton />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
          />
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
      {(user?.role === "ADMIN" || user?.role === "ORDER") && (
        <div className="pt-2">
          <ScrollMenu items={items} onItemClick={onCheck} selected={-2} />
        </div>
      )}
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
