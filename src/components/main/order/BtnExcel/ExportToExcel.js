import React from 'react';
import { Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const ExportToExcel = ({ data }) => {
  const headers = [
    "Extra Id","Fullname", "Phone", "Email", "Street", "Street2", "City", "State", "Country", 
    "Zipcode", "Shipping label", "Tracking number", "Fulfill fee", "Label Fee", 
    "Status", "Sku", "Title", "Quantity"
  ];

  const handleExport = () => {
    // Chuyển đổi dữ liệu thành định dạng mà Excel có thể sử dụng
    const formattedData = data.map(item => ({
       ID: item.id,
      'Extra Id': item.extraId,
      Fullname: item.customName,
      Phone: item.phone,
      Email: item.email,
      Street: item.street,
      Street2: item.streetTwo,
      City: item.city,
      State: item.state,
      Country: item.country,
      Zipcode: item.zipCode,
      'Shipping label': item.labelUrl,
      'Tracking number': item.tracking,
      'Fulfill fee': item.expense,
      'Label Fee': item.expenseLable,
      Status: item.status,
      Sku: item?.orderDetailsList?.map(item => item.product.sku).join(", ") || "",
      Title: item?.orderDetailsList?.map(item => item.product.productName).join(", ") || "",
      Quantity: item.quantity,
      Ship_By : item.type
    }));

    // Tạo workbook
    const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Xuất file
    XLSX.writeFile(wb, "orders.xlsx");
  };
  if(data && data.length  > 0)
        return <Button style={{padding:"2px", marginLeft:"2px"}} onClick={handleExport}>Export to Excel</Button>

  return(
    <Button style={{padding:"2px", marginLeft:"2px", fontSize:"16px"}} disabled >Export to Excel</Button>
  )
};

export default ExportToExcel;
