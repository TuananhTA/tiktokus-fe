// components/CategoryTable.js
import { Table, Button } from 'react-bootstrap';

const CategoryTable = ({ categories, onEdit, onDelete, onAddProduct }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Tên danh mục</th>
          <th>Số lượng sản phẩm</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.categoryName}</td>
            <td>
              <ul>
                {category.products.length}
              </ul>
            </td>
            <td>
              <Button variant="warning" onClick={() => onEdit(category)}>Sửa</Button>{' '}
              <Button variant="danger" onClick={() => onDelete(category.id)}>Xóa</Button>{' '}
              <Button variant="info" onClick={() => onAddProduct(category)}>Thêm sản phẩm</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CategoryTable;
