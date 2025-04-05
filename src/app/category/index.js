// pages/productCategories.js
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Main from '@/components/main/main';
import CategoryTable from '@/components/categorycom/CategoryTable';
import CategoryModal from '@/components/categorycom/CategoryModal';
import ProductModal from '@/components/categorycom/ProductModal';

export default function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [assignedProducts, setAssignedProducts] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const data = [
      { id: 1, name: 'Điện thoại', products: [] },
      { id: 2, name: 'Laptop', products: [] },
      { id: 3, name: 'Máy tính bảng', products: [] }
    ];
    setCategories(data);
  };

  const fetchProducts = async () => {
    const data = [
      { id: 1, name: 'iPhone 13' },
      { id: 2, name: 'MacBook Pro' },
      { id: 3, name: 'iPad Air' },
      { id: 4, name: 'Samsung Galaxy' },
      { id: 5, name: 'Dell XPS 13' }
    ];
    setProducts(data);
    setAvailableProducts(data);
  };

  const handleAddCategory = () => {
    if (!newCategory) return;
    const newCategoryData = {
      id: categories.length + 1,
      name: newCategory,
      products: []
    };
    setCategories([...categories, newCategoryData]);
    setNewCategory('');
    setShowCategoryModal(false);
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setNewCategory(category.name);
    setShowCategoryModal(true);
  };

  const handleSaveEditCategory = () => {
    if (!newCategory || !editCategory) return;
    const updatedCategories = categories.map((category) =>
      category.id === editCategory.id ? { ...category, name: newCategory } : category
    );
    setCategories(updatedCategories);
    setEditCategory(null);
    setNewCategory('');
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id) => {
    const updatedCategories = categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
  };

  const handleAddProductToCategory = (category) => {
    setSelectedCategory(category);
    setAvailableProducts(products.filter(product => !category.products.some(catProd => catProd.id === product.id)));
    setAssignedProducts(category.products);
    setShowProductModal(true);
  };

  const moveToAssigned = (product) => {
    setAssignedProducts([...assignedProducts, product]);
    setAvailableProducts(availableProducts.filter(prod => prod.id !== product.id));
  };

  const moveToAvailable = (product) => {
    setAvailableProducts([...availableProducts, product]);
    setAssignedProducts(assignedProducts.filter(prod => prod.id !== product.id));
  };

  const saveProducts = () => {
    const updatedCategories = categories.map((category) =>
      category.id === selectedCategory.id ? { ...category, products: assignedProducts } : category
    );
    setCategories(updatedCategories);
    setShowProductModal(false);
  };

  return (
    <Main title={"Category"}>
      <h1>Danh mục sản phẩm</h1>
      <Button className='mb-2' onClick={() => setShowCategoryModal(true)}>Thêm danh mục</Button>
      <CategoryTable
        categories={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onAddProduct={handleAddProductToCategory}
      />
      <CategoryModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        category={editCategory}
        onSave={editCategory ? handleSaveEditCategory : handleAddCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <ProductModal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        availableProducts={availableProducts}
        assignedProducts={assignedProducts}
        onAddProduct={moveToAssigned}
        onRemoveProduct={moveToAvailable}
        onSave={saveProducts}
      />
    </Main>
  );
}
