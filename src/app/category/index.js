// pages/productCategories.js
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Main from '@/components/main/main';
import CategoryTable from '@/components/categorycom/CategoryTable';
import CategoryModal from '@/components/categorycom/CategoryModal';
import ProductModal from '@/components/categorycom/ProductModal';
import getData from '@/hooks/useFechtData';
import authorizeAxiosInstance from "@/hooks/axios"
import { toast } from "react-toastify";
require("dotenv").config();
let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

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
  const [isFunc, setIsFunc] = useState(false);

  const {
    data: categoriesData,
    isLoading: categoryIsLoading,
    error: categoryError,
  } = getData(`${URL_ROOT}/private/category/get-all-category`);
  const {
    data: productData,
    isLoading: productIsLoading,
    error: productError,
  } = getData(`${URL_ROOT}/private/product/get-all-to-excel`);

  useEffect(() => {
    if(!categoryIsLoading && !categoryError){
      console.log(categoriesData);
      fetchCategories();
    }
  }, [categoriesData,categoryIsLoading,categoryError]);

  useEffect(() => {
    if(!productIsLoading && !productError){
      fetchProducts();
    }
  }, [productData, productIsLoading, productError]);

  const fetchCategories = () => {
    setCategories(categoriesData.data);
  };

  const fetchProducts = () => {
    setProducts(productData.data);
    setAvailableProducts(productData.data);
  };

  const handleAddCategory =async () => {
    if (!newCategory) return;
    let url_post = `${URL_ROOT}/private/category/create-category?categoryName=${newCategory}`
    const newCategoryData = await authorizeAxiosInstance.post(url_post); 
    console.log(newCategoryData);
    if(newCategoryData.status === 200){
      toast.success("Thêm thư mục thành công!")
      setCategories([newCategoryData.data,...categories]);
      setNewCategory('');
      setShowCategoryModal(false);
    };
  }
  const handleEditCategory = (category) => {
    setIsFunc(true)
    setEditCategory(category);
    setNewCategory(category.name);
    setShowCategoryModal(true);
  };

  const handleSaveEditCategory = async () => {

    let url_change_name =`${URL_ROOT}/private/category/change-name/${editCategory.id}?categoryName=${editCategory.categoryName}`
    const updatedCategories =  await authorizeAxiosInstance.put(url_change_name);
    if(updatedCategories.status === 200){
      toast.success("Chỉnh sửa thành công!")
      setIsFunc(false)
      setCategories(updatedCategories.data);
      setEditCategory(null);
      setNewCategory(''); 
      setShowCategoryModal(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    let url_delete = `${URL_ROOT}/private/category/delete-category/${id}`
    const updatedCategories = await authorizeAxiosInstance.delete(url_delete);
    console.log(updatedCategories);
    if(updatedCategories.status === 200){
      toast.success("Xóa danh mục thành công!");
      setCategories(updatedCategories.data);
    }
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

  const saveProducts = async () => {
    console.log(selectedCategory);
    let url_save =`${URL_ROOT}/private/category/add-product-in-category/${selectedCategory.id}`
    console.log("ass: ",assignedProducts);
    const updatedCategories = await authorizeAxiosInstance.post(url_save,assignedProducts)
    if(updatedCategories.status === 200){
      setCategories(updatedCategories.data);
      setShowProductModal(false);
    }
  };

  return (
    <Main title={"Category"}>
      <h1>Danh mục sản phẩm</h1>
      <Button className="mb-2" onClick={() => {
        setIsFunc(false)
        setShowCategoryModal(true)}
        }>
        Thêm danh mục
      </Button>
      <CategoryTable
        categories={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onAddProduct={handleAddProductToCategory}
      />
      <CategoryModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        category={isFunc ? editCategory : newCategory}
        onSave={isFunc ? handleSaveEditCategory : handleAddCategory}
        isFunc= {isFunc}
        onChange={
          isFunc
            ? (e) =>
                setEditCategory({
                  ...editCategory,
                  categoryName: e.target.value,
                })
            : (e) => setNewCategory(e.target.value)
        }
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
