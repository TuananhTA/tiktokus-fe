import { Form, Button, Container, Image } from 'react-bootstrap';
import { useState } from 'react';
import compressImage from '@/hooks/compressImage ';
export default function FormCreate({formData, setFormData,errors}) {
  const [imagePreview, setImagePreview] = useState('');
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        let processedFile = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const blob = new Blob([file], { type: 'image/jpeg' });
          processedFile = blob;
        };
        if (file.size > 10 * 1024 * 1024) {
          // Nén ảnh nếu kích thước lớn hơn 10MB
          processedFile = await compressImage(file, 0.7);
        } 
        formData.file = processedFile;
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      <Form >
      <Form.Group controlId="urlImage" className="mt-3">
          <Form.Label>Ảnh sản phẩm</Form.Label>
          <div>
            <Image
              src={imagePreview || '/empty.jpg'}
              alt="Product"
              style={{ width: '100px', height: '100px', borderRadius: '5px', margin: '10px' }}
            />
            <br/>
            <Button variant="primary" as="label" htmlFor="file-upload" className="mb-2">
              Choose Image
            </Button>
            <Form.Control
              type="file"
              id="file-upload"
              name="urlImage"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
              required
              controlId="urlImage"
            />
            {errors.urlImage && <Form.Text className="text-danger">{errors.urlImage}</Form.Text>}
          </div>
        </Form.Group>
        <Form.Group controlId="productName">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control
            type="text"
            name="productName"
            value={formData.productName}
            onInput={handleInputChange}
            required
            controlId="productName"
          />
          {errors.productName && <Form.Text className="text-danger">{errors.productName}</Form.Text>}
        </Form.Group>
        <Form.Group controlId="SKU">
          <Form.Label>SKU</Form.Label>
          <Form.Control
            type="text"
            name="sku"
            value={formData.sku}
            onInput={handleInputChange}
            required
            controlId="SKU"
          />
          {errors.sku && <Form.Text className="text-danger">{errors.sku}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="quantity" className="mt-3">
          <Form.Label>Số lượng tồn kho</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onInput={handleInputChange}
            required
            min={0}
            controlId="quantity"
          />
          {errors.quantity && <Form.Text className="text-danger">{errors.quantity}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="price" className="mt-3">
          <Form.Label>Giá bán</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="price"
            onInput={handleInputChange}
            value={formData.price}
            required
            min={0}
            controlId="price"
          />
          {errors.price && <Form.Text className="text-danger">{errors.price}</Form.Text>}
        </Form.Group>
      </Form>
    </>
  );
}
