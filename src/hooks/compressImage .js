const compressImage = (file, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Giảm kích thước canvas (tuỳ chỉnh theo nhu cầu)
          canvas.width = img.width * 0.5; // Giảm kích thước 50%
          canvas.height = img.height * 0.5;

          // Vẽ ảnh lên canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Nén ảnh với chất lượng tùy chọn
          canvas.toBlob(
            (blob) => {
              resolve(blob); // Trả về Blob chứa ảnh đã nén
            },
            'image/jpeg', // Định dạng ảnh
            quality // Chất lượng nén
          );
        };
      };
    });
};
export default compressImage;