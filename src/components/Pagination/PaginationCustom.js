import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

function PaginationCustom({ currentPage, totalPages, onPageChange }) {
  // Tạo danh sách các trang
  const getPageItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Số trang hiển thị tối đa giữa các dấu "..."

    // Xác định trang bắt đầu và kết thúc
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Dấu "..." đầu
    if (startPage > 1) {
      items.push(
        <Pagination.Ellipsis key="start-ellipsis" onClick={() => onPageChange(1)} />
      );
    }

    // Các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Dấu "..." cuối
    if (endPage < totalPages) {
      items.push(
        <Pagination.Ellipsis key="end-ellipsis" onClick={() => onPageChange(totalPages)} />
      );
    }

    return items;
  };

  return (
    <Pagination>
      <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {getPageItems()}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
}

export default PaginationCustom;
