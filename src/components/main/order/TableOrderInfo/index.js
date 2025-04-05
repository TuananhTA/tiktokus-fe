// components/CustomerTable.js
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import style from"./style.module.css"
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import Loading from '@/components/loading';
import { useStore } from '@/store/hooks';
import authorizeAxiosInstance from "@/hooks/axios"
import { mutate } from "swr";
import { PhotoProvider, PhotoView } from 'react-photo-view';
require("dotenv").config();
import Tippy from '@tippyjs/react';
import EditModal from '../editcom/EditModalLable';
import EditModalCustom from '../editcom/EditModalCustom';
import EmptyState from '@/components/EmptyState/EmptyState';
import Swal from 'sweetalert2';
let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

const moment = require('moment');
const formattedTime  = (time)=>moment(time).format('HH:mm DD/MM/YYYY');

const OrderTableInfo = ({ orders, orderKey, onSelectedDataChange, selectedOrders }) => {

    const [{ user }] = useStore();
    const [isLoading, setIsLoading] = useState(false);

    const handlePrint = (url) => {

        if(!url){
            toast.error("Lable url không hợp lệ!")
            return
        }
        // Mở cửa sổ mới với URL
        const printWindow = window.open(url, '_blank');
        // Khi cửa sổ đã tải xong, thực hiện in và đóng cửa sổ
        printWindow.addEventListener('load', () => {
            printWindow.print();
            printWindow.close();
        });
    };

    const cancel = async (order)=>{
        let url = `${URL_ROOT}/private/order/cancel/${order.id}`
        setIsLoading(true)
        try{
           await authorizeAxiosInstance.put(url)
           toast.success("Thành công!");
           mutate(orderKey)
           mutate(`${URL_ROOT}/private/user/get-user-login`)

        }catch(error){

        }
        setIsLoading(false);

    }

    function formatToUSD(amount) {
      return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
      }).format(amount).replace(/,/g, '');
  }
  const changeStatus = (e,id) =>{
    let value = e.target.value;
    Swal.fire({
      title: 'Xác nhận chuyển trạng thái?',
      text:value === "CANCELED"? "Khi hủy không thể khôi phục?" : `Chuyển trạng thái ${value}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oke!',
    }).then((result) => {
      if (result.isConfirmed) {
        handleYes();
      }
    });
    const handleYes = async ()=>{
      let url = `${URL_ROOT}/private/order/change-status/${id}?status=${value}`;
      setIsLoading(true)
      try{
        await authorizeAxiosInstance.put(url)
        toast.success("Thành công!");
        mutate(orderKey)
        mutate(`${URL_ROOT}/private/user/get-user-login`)
      }catch(error){
      
      }
      setIsLoading(false);
    }
  }
  async function copyToClipboardModern(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Thành công")
    } catch (err) {
      toast.error("Thất bại!")
    }
  }
  const [showModalLable, setShowModalLable] = useState(false);
  const [showModalCustome, setShowModalCustome] = useState(false);
  const [selectOrder, setSelectOrder] = useState({});
  const handleShowModalLable = (order) => {
    setSelectOrder(order);
    setShowModalLable(true)
  }
  const handleCloseModalLable = () => setShowModalLable(false);

  const handleSaveLable = async (updatedData,id) => {
      setIsLoading(true);
      let url_edit = `${URL_ROOT}/private/order/update-label/${id}`
      let res = await authorizeAxiosInstance.put(url_edit, updatedData);
      setIsLoading(false);
      if(res.status === 200){
        mutate(orderKey);
        toast.success("Chỉnh sửa thành công");
        return;
      }
      toast.error(res.error);
  };

  const handleShowModalCustome = (order) => {
    setSelectOrder(order);
    setShowModalCustome(true);
  }
  const handleCloseModalCustome = () => setShowModalCustome(false);

  const handleSaveCustome = async (updatedData,id) => {
      setIsLoading(true);
      try {
        let url_edit = `${URL_ROOT}/private/order/update-customer/${id}`
        let res = await authorizeAxiosInstance.put(url_edit, updatedData);
        if(res.status === 200){
          mutate(orderKey);
          toast.success("Chỉnh sửa thành công");
        }
      } catch (error) {
      }
      setIsLoading(false);
  };
  const [selectedRows, setSelectedRows] = useState({});

  // Đồng bộ với danh sách các order đã chọn từ parent
  useEffect(() => {
    const updatedSelection = {};
    selectedOrders.forEach((order) => {
      updatedSelection[order.id] = true;
    });
    setSelectedRows(updatedSelection);
  }, [selectedOrders]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
  
    // Cập nhật danh sách các order đã chọn, giữ lại những order cũ đã chọn
    const updatedSelection = { ...selectedRows }; // Giữ nguyên các lựa chọn cũ
    const selectedItems = [...selectedOrders]; // Giữ nguyên các order đã chọn cũ
  
    orders.forEach((order) => {
      if (checked) {
        // Nếu chọn tất cả, thêm order vào danh sách đã chọn nếu chưa có
        if (!updatedSelection[order.id]) {
          updatedSelection[order.id] = true;
          selectedItems.push(order);
        }
      } else {
        // Nếu bỏ chọn tất cả, xóa order khỏi danh sách đã chọn
        if (updatedSelection[order.id]) {
          delete updatedSelection[order.id];
          const index = selectedItems.findIndex(o => o.id === order.id);
          if (index > -1) {
            selectedItems.splice(index, 1);
          }
        }
      }
    });
  
    setSelectedRows(updatedSelection);
  
    // Truyền danh sách được chọn lên component cha
    if (onSelectedDataChange) {
      onSelectedDataChange(selectedItems);
    }
  };

  // Hàm chọn từng dòng
  const handleSelectRow = (e, order) => {
    const checked = e.target.checked;
    const updatedSelection = { ...selectedRows, [order.id]: checked };

    setSelectedRows(updatedSelection);

    // Cập nhật danh sách các order đã chọn
    const updatedSelectedData = checked
      ? [...selectedOrders.filter((o) => o.id !== order.id), order]
      : selectedOrders.filter((o) => o.id !== order.id);

    // Truyền danh sách được chọn lên component cha
    if (onSelectedDataChange) {
      onSelectedDataChange(updatedSelectedData);
    }
  };

  if(orders.length === 0) return <EmptyState message='Trống'/>

    return (
      <>
        <EditModal
          show={showModalLable}
          handleClose={handleCloseModalLable}
          order={selectOrder}
          handleSave={handleSaveLable}
        />
        <EditModalCustom
          show={showModalCustome}
          handleClose={handleCloseModalCustome}
          order={selectOrder}
          handleSave={handleSaveCustome}
        />
        <Table className={`${style.table} mt-4`} responsive>
          <thead>
            <tr>
              <th style={{padding :"8px"}}>
                 <input 
                   type="checkbox"
                   checked={orders.length > 0 && orders.every((order) => selectedRows[order.id])}
                   onChange={handleSelectAll}
                   style={{width: "16px", height: "16px"}} 
                />
              </th>
              <th>ID</th>
              <th>Người tạo hóa đơn</th>
              <th>Thông tin khách hàng</th>
              <th>Sản phẩm</th>
              <th>Trạng thái</th>
              <th>Số lượng</th>
              <th>Chi phí</th>
              <th>Thông tin đơn hàng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id}>
                <td>
                  <input 
                     type="checkbox"
                     checked={!!selectedRows[order.id]}
                     onChange={(e) => handleSelectRow(e, order)}
                    style={{width: "16px", height: "16px"}}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  {order.id}
                  <br></br>
                  {formattedTime(order.createdAt)}
                  <br></br>
                  {order.extraId}
                </td>
                <td>{order.user.fullName}</td>
                <td className={style.lable} style={{ position: "relative" }}>
                  {order.type === "By_Seller" ? (
                    <>
                      {order.customName}
                      <br></br>
                      {order.phone}
                      <br></br>
                      {order.street}
                      {order.streetTwo ? order.streetTwo : ""}, {order.city},{" "}
                      {order.state}, {order.country}
                      <br></br>
                      {order.zipCode}
                      <br></br>
                      Email: {order.email}
                      {order.status === "NEW" && (
                      <div className={style.pen} onClick={() => handleShowModalCustome(order)}>
                          <i className="bi bi-pen-fill"></i>
                      </div>
                  )}
                    </>
                  ) : (
                    <>Thông tin ở lable</>
                  )}

                </td>
                <td>
                  {order?.orderDetailsList?.map((item) => (
                    <PhotoProvider key={item.id}>
                      <PhotoView src={item.product.urlImage}>
                        <img
                          src={item.product.urlImage}
                          alt="Thumbnail"
                          style={{
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                          }}
                        />
                      </PhotoView>
                      <Tippy content={item.product.productName}>
                        <span>
                          {item.product.productName.length > 20
                            ? `${item.product.productName.substring(0, 20)}...`
                            : item.product.productName}{" "}
                          x {item.quantity}
                        </span>
                      </Tippy>
                      <br></br>
                    </PhotoProvider>
                  ))}
                </td>
                <td>
                  {(user?.role === "ADMIN" || user?.role === "ORDER" || user?.role === "PACKER") && order.status != "CANCELED" ? (
                    <>
                      <select
                        onChange={(e) => changeStatus(e, order.id)}
                        style={{ padding: "4px", borderRadius: "4px" }}
                        value={order.status}
                      >
                        <option value="NEW">NEW</option>
                        <option value="PACKED">PACKED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELED">CANCELED</option>
                      </select>
                    </>
                  ) : (
                    order.status
                  )}
                </td>
                <td>{order.quantity}</td>
                <td>
                  Fee: {formatToUSD(order.expense)} <br></br>
                  Sản phẩm : {formatToUSD(order.preProduct)} <br></br>
                  Lable : {formatToUSD(order.expenseLable)} <br></br>
                  Tổng : {formatToUSD(order.total)}
                </td>
                <td className={style.lable} style={{ position: "relative" }}>
                  Label Url:{" "}
                  <span>
                    {order.labelUrl && (
                      <>
                        <a href={order.labelUrl} target="_blank">
                          click để xem
                        </a>
                        <i
                          onClick={() => copyToClipboardModern(order.labelUrl)}
                          className={`${style.icon} bi bi-copy`}
                        ></i>
                      </>
                    )}
                  </span>
                  <br></br>
                  Tracking:{" "}
                  <span>
                    {order.tracking}
                    {order.tracking && (
                      <i
                        onClick={() => copyToClipboardModern(order.tracking)}
                        className={`${style.icon} bi bi-copy`}
                      ></i>
                    )}
                  </span>
                  <br></br>
                  Ship by : <span>{order.type}</span>
                  <br></br>
                  <span>
                    {order.desgin && (
                      <>
                        <a href={order.labelUrl} target="_blank">
                          desgin
                        </a>
                        <i
                          onClick={() => copyToClipboardModern(order.desgin)}
                          className={`${style.icon} bi bi-copy`}
                        ></i>
                      </>
                    )}
                  </span>
                  <br></br>
                  <span>
                    {order.mockup && (
                      <>
                        <a href={order.mockup} target="_blank">
                          mockup
                        </a>
                        <i
                          onClick={() => copyToClipboardModern(order.mockup)}
                          className={`${style.icon} bi bi-copy`}
                        ></i>
                      </>
                    )}
                  </span>
                  {(user?.role === "ADMIN" || user?.role === "ORDER") && (
                    <>
                      <div className={style.pen} onClick={() => handleShowModalLable(order)}>
                        <i className="bi bi-pen-fill"></i>
                      </div>
                    </>
                  )}
                </td>
                <td style={{ width: " 100px" }}>
                  <Button
                    className="p-1 m-1"
                    onClick={() => handlePrint(order.labelUrl)}
                    style={{ fontSize: "12px" }}
                  >
                    In
                  </Button>
                  {order.status === "NEW" && user.role !== "ADMIN" && (
                    <>
                      <Button
                        onClick={() => cancel(order)}
                        className="p-1 mt-1 mb-1"
                        variant="danger"
                        style={{ fontSize: "12px" }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {(user?.role === "ADMIN" || user?.role === "ORDER") &&
                    order.status !== "COMPLETED" &&
                    order.status !== "CANCELED" && (
                      <>
                        <Button
                          onClick={() => cancel(order)}
                          className="p-1 mt-1 mb-1"
                          variant="danger"
                          style={{ fontSize: "12px" }}
                        >
                          Cancel
                        </Button>
                        <a href={`/order/update/${order.id}`}>
                          <Button
                            variant="success"
                            className="m-1 p-1"
                            style={{ fontSize: "12px" }}
                          >
                            Chỉnh sửa
                          </Button>
                        </a>
                      </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
          {isLoading && <Loading></Loading>}
        </Table>
      </>
    );


};

export default OrderTableInfo;
