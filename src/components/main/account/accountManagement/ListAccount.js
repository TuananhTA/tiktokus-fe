import { Table, Container, Button } from 'react-bootstrap';
import { useState } from 'react';
import style from "./style.module.css"
import UpdateAccountModal from './UpdateAccountModal';

export default function ListAccount({users, handleClick}){

    const [selectedRow, setSelectedRow] = useState(null);
    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);

    // Hàm xử lý khi nhấp vào một hàng
    const handleRowClick = (index,user) => {
        setSelectedRow(index);
        handleClick(user);
    };
    const clickUpdate = (user) =>{
      setUser(user)
      setShow(true);
    }
    

    return(
        <div className="mt-2">
        <h4>Danh Sách Tài Khoản</h4>
        <Table bordered hover bsPrefix className={style.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên tài khoản</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Chức vụ</th>
              <th>Thông tin khác</th>
              <th>Sửa</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user,index) => (
              <tr
                key={user.id}
                className={selectedRow === index ? style.active : ''}
                onClick={() => handleRowClick(index, user)}
              >
                <td style={{padding:"2px", textAlign:"center"}}  >{index +1}</td>
                <td style={{padding:"2px"}} >
                   <p style={{padding : "0", margin : "0"}} >{user.fullName}</p>
                </td>
                <td style={{padding:"2px"}}>
                   <p style={{padding : "0", margin : "0"}}> {user.phone}</p>
                </td>
                <td style={{padding:"2px"}}>
                   <p style={{padding : "0", margin : "0"}}>{user.email}</p>
                </td>
                <td style={{padding:"2px"}}>
                   <p style={{padding : "0", margin : "0"}}>{user.role}</p>
                </td>
                <td style={{padding:"2px"}}>
                   <p style={{padding : "0", margin : "0"}}> Trạng thái: {user.status}</p>
                   <p style={{padding : "0", margin : "0"}}> Balance: ${user.balance}</p>
                </td>
                <td style={{padding:"2px", textAlign:"center"}}>
                  <Button style={{fontSize:"12px", padding:"2px 8px"}} onClick={() => clickUpdate(user)}>Sửa</Button>
                </td>
              </tr>
            ))} 
          </tbody>
        </Table>
        <UpdateAccountModal 
          user={user} 
          show={show} 
          setShow = {setShow}
          setUser = {setUser} 
        />
      </div>
    )
}