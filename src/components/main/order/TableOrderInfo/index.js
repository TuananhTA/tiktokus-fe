// components/CustomerTable.js
import { useState } from 'react';
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
let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

const moment = require('moment');
const formattedTime  = (time)=>moment(time).format('HH:mm DD/MM/YYYY');

const OrderTableInfo = ({ orders, orderKey}) => {

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

    return (
      <Table
        className={`${style.table} mt-4`}
        striped
        bordered
        hover
        responsive
      >
        <thead>
          <tr>
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
              <td style={{ textAlign: "center" }}>
                {order.id}
                <br></br>
                {formattedTime(order.createdAt)}
                <br></br>
                {order.extraId}
              </td>
              <td>{order.user.fullName}</td>
              <td>
                {order.type === "By_Seller" ? (
                  <>
                    {order.customName}
                    <br></br>
                    phone: {order.phone}
                    <br></br>
                    {order.street}
                    {order.streetTwo ? order.streetTwo : ""}, {order.city},{" "}
                    {order.state}, {order.country}
                    <br></br>
                    Zip code: {order.zipCode}
                    <br></br>
                    email: {order.email}
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
              <td>{order.status}</td>
              <td>{order.quantity}</td>
              <td>
                Fee: {formatToUSD(order.expense)} <br></br>
                Sản phẩm : {formatToUSD(order.preProduct)} <br></br>
                Lable : {formatToUSD(order.expenseLable)} <br></br>
                Tổng : {formatToUSD(order.total)}
              </td>
              <td>
                Label Url:{" "}
                <span>
                  {order.labelUrl && (
                    <a href={order.labelUrl} target="_blank">
                      click để xem
                    </a>
                  )}
                </span>
                <br></br>
                Tracking: <span>{order.tracking}</span>
                <br></br>
                Ship by : <span>{order.type}</span>
              </td>
              <td style={{width: " 100px"}}>
                <Button
                  className="p-1 m-1"
                  onClick={() => handlePrint(order.labelUrl)}
                  style={{fontSize:"12px"}}
                >
                  In
                </Button>
                {order.status === "NEW" && user.role !== "ADMIN" && (
                  <>
                     <Button
                        onClick={() => cancel(order)}
                        className="p-1 mt-1 mb-1"
                        variant="danger"
                        style={{fontSize:"12px"}}
                      >
                        Cancel
                      </Button>
                  </>
                )}
                {user.role === "ADMIN" &&
                  order.status !== "COMPLETED" &&
                  order.status !== "CANCELED" && (
                    <>
                      <Button
                        onClick={() => cancel(order)}
                        className="p-1 mt-1 mb-1"
                        variant="danger"
                        style={{fontSize:"12px"}}
                      >
                        Cancel
                      </Button>
                      <a href={`/order/update/${order.id}`}>
                        <Button variant="success" className="m-1 p-1" style={{fontSize:"12px"}}>
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
    );
};

export default OrderTableInfo;
