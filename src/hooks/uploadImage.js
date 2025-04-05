require('dotenv').config()

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT
const useUploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    let url;
    try {
      const response = await fetch(`${URL_ROOT}/public/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      const data = await response.json();
      url =data.url;
      return {url};
    } catch (err) {
      return Promise.reject(err);
    }  
};

export default useUploadImage;
