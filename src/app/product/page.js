"use client";
import Main from "@/components/main/main";
import Table from "@/components/table";
import getData from "@/hooks/useFechtData";
import ModalCustom from "@/components/modal";
import FormCreate from "@/components/main/Product/formCreate";
import FormUpdate from "@/components/main/Product/formUpdate";
import ModalCustomV2 from "@/components/modalv2";
import { useState, useEffect, useRef } from "react";
import useUploadImage from "@/hooks/uploadImage";
import { toast } from "react-toastify";
import authorizeAxiosInstance from "@/hooks/axios";
import { Button, Form } from "react-bootstrap";
import Loading from "@/components/loading";
import SearchInput from "@/components/main/Product/search";
require("dotenv").config();
import { useStore } from "@/store/hooks";
import { mutate } from "swr";
import AuthGuard from "@/components/AuthProvider/AuthGuard";
import PaginationCustom from "@/components/Pagination/PaginationCustom";

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

export default function Product() {
  const [page, setPage] = useState(0); // Trang bắt đầu từ 0
  const [size, setSize] = useState(10); // Số phần tử mỗi trang
  const inputRef = useRef(null);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

    const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
    const [debouncedKeyword, setDebouncedKeyword] = useState(searchKeyword); // Từ khóa với debounce

    const [state] = useStore();
    const { user } = state;

    const params = {
      page,
      size,
      ...(debouncedKeyword ? { search: debouncedKeyword } : {}), 
    };

  const { data, error, isLoading, key } = getData(
    `${URL_ROOT}/private/product/get-all-active`,
    params
  );

  const [formData, setFormData] = useState({
    productName: "",
    quantity: 0,
    price: 0,
    urlImage: "",
    file: null,
    sku: "",
  });

  const [formDataUpdate, setFormDataUpdate] = useState({
    productName: "",
    quantity: 0,
    price: 0,
    urlImage: "",
    file: null,
    status: "AVAILABLE",
    id: null,
    sku: "",
  });

  const [errors, setErrors] = useState({
    productName: "",
    quantity: "",
    price: "",
    urlImage: "",
    sku: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors = {
      productName: "",
      quantity: "",
      price: "",
      urlImage: "",
      sku: "",
    };

    if (!formData.productName.trim()) {
      newErrors.productName = "Tên sản phẩm là bắt buộc";
      isValid = false;
    }
    if (!formData.sku.trim()) {
      newErrors.sku = "Mã sku là bắt buộc";
      isValid = false;
    }

    if (!formData.quantity && formData.quantity < 0) {
      newErrors.quantity = "Số lượng phải lớn hơn hoặc bằng 0";
      isValid = false;
    }

    if (!formData.price && formData.price < 0) {
      newErrors.price = "Giá bán phải lớn hơn 0";
      isValid = false;
    }

    if (!formData.file) {
      newErrors.urlImage = "Ảnh sản phẩm là bắt buộc";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const validateUpdate = () => {
    let isValid = true;
    const newErrors = {
      productName: "",
      quantity: "",
      price: "",
      urlImage: "",
      sku: "",
    };

    if (!formDataUpdate.productName.trim()) {
      newErrors.productName = "Tên sản phẩm là bắt buộc";
      isValid = false;
    }
    if (!formDataUpdate.sku.trim()) {
      newErrors.sku = "Mã sku là bắt buộc";
      isValid = false;
    }

    if (!formDataUpdate.quantity && formDataUpdate.quantity < 0) {
      newErrors.quantity = "Số lượng phải lớn hơn hoặc bằng 0";
      isValid = false;
    }

    if (!formDataUpdate.price && formDataUpdate.price < 0) {
      newErrors.price = "Giá bán phải lớn hơn 0";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (setShow) => {
    if (validate()) {
      setLoading(true);
      console.log("Form data:", formData);

      try {
        const { url } = await useUploadImage(formData.file);
        formData.urlImage = url;
        const response = await authorizeAxiosInstance.post(
          `${URL_ROOT}/private/product/create-product`,
          formData
        );
        if (response.status === 200) {
          handleClose(setShow);
          toast.success("Thêm sản phâm mới thành công!");
          mutate(key); 
        } else {
          console.error("Failed to create product");
          toast.error("Thêm mới bại!");
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  const handleClose = (setShow) => {
    setShow(false);
    setFormData({
      productName: "",
      quantity: 0,
      price: 0,
      urlImage: "",
      file: null,
      sku: "",
    });
    setErrors({
      productName: "",
      quantity: "",
      price: "",
      urlImage: "",
    });
  };

  const handleClickTable = (item) => {
    if (user && user.role === "STAFF") return null;
    setFormDataUpdate({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      urlImage: item.urlImage,
      status: item.status,
      id: item.id,
      sku: item.sku,
    });
    setShow(true);
  };

  const handleCloseModalUpdate = () => {
    setFormDataUpdate({
      productName: "",
      quantity: 0,
      price: 0,
      urlImage: "",
      file: null,
      id: null,
    });
    setErrors({
      productName: "",
      quantity: "",
      price: "",
      urlImage: "",
    });
    setShow(false);
  };
  const handleUpdate = async () => {
    if (validateUpdate()) {
      console.log("Form data:", formDataUpdate);
      setLoading(true);
      if (!formDataUpdate.urlImage.trim()) {
        const { error, url } = await useUploadImage(formDataUpdate.file);
        formDataUpdate.urlImage = url;
        if (error) {
          console.log(error);
          return;
        }
      }
      let url = `${URL_ROOT}/private/product/update-product/${formDataUpdate.id}`;
      const response = await authorizeAxiosInstance.put(url, formDataUpdate);
      if (response.status === 200) {
        toast.success("Chỉnh sửa thành công!");
        handleCloseModalUpdate();
        setLoading(false);
        mutate(key);
      } else {
        console.error("Failed to create product");
        toast.error("Chỉnh sửa thất bại!");
      }
    }
  };
  const deleteProduct = async () => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );
    if (confirmDelete) {
      try {
        setLoading(true);
        let url = `${URL_ROOT}/private/product/delete-product/${formDataUpdate.id}`;
        const response = await authorizeAxiosInstance.delete(url);
        setLoading(false);
        toast.success("Xóa thành công!");
        await mutate(key);
        handleCloseModalUpdate();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        toast.error("Xóa thất bại!");
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchKeyword]);

  const onCancel = () => {
    setSearchKeyword("")
  };

  const columns = [
    { title: "SKU", name: "sku" },
    { title: "Tên sản phẩm", name: "productName" },
    { title: "Hình ảnh", name: "urlImage", type: "IMAGE" },
    { title: "Giá", name: "price" },
    { title: "Số lượng", name: "quantity" },
    { title: "Đã bán ra", name: "quantityInOrder" },
    { title: "Trạng thái", name: "status" },
  ];

  if (error)
    return (
      <AuthGuard>
        <div>failed to load</div>
      </AuthGuard>
    );  
  const products = data?.data?.content || [];
  console.log(data);
  const totalPages = data?.data?.totalPages || 1;


  const handleOpen = () => window.location.href="/product/excel";

  return (
    <>
      <AuthGuard>
        <Main title={"Product"}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {user && user.role != "STAFF" && (
              <div>
                <ModalCustom
                  buttonName={"Thêm sản phẩm mới"}
                  colorButton={"primary"}
                  size={"lg"}
                  heading={"Thêm sản phẩm mới"}
                  onClick={handleSubmit}
                  close={handleClose}
                >
                  <FormCreate
                    errors={errors}
                    setErrors={setErrors}
                    formData={formData}
                    setFormData={setFormData}
                  ></FormCreate>
                </ModalCustom>
                <Button variant="dark" className="m-1" onClick={handleOpen}>
                  Xuất file
                </Button>

              </div>
            )}
            <div>
              <SearchInput ref={inputRef} value={searchKeyword} setValue={setSearchKeyword} onCancel={onCancel} />
            </div>
          </div>
          <ModalCustomV2
            size={"lg"}
            heading={"Sửa sản phẩm"}
            show={show}
            close={handleCloseModalUpdate}
            update={handleUpdate}
            setShow={setShow}
            deleteProduct={deleteProduct}
          >
            <FormUpdate
              formData={formDataUpdate}
              setFormData={setFormDataUpdate}
              errors={errors}
            ></FormUpdate>
          </ModalCustomV2>
          <Table
            columns={columns}
            data= {products}
            onClick={handleClickTable}
            page={page}
            size={size}
          ></Table>
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
    </>
  );
}
