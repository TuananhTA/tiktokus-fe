import { useState } from "react";
import * as XLSX from "xlsx";

const useExcelReader = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const readExcelFile = (file) => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        // Đọc sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Chuyển sheet sang JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
        setError(null); // Xóa lỗi nếu đọc thành công
      } catch (err) {
        setError("Failed to parse Excel file.");
      }
    };

    reader.readAsBinaryString(file);
  };

  return { data, setData, error, readExcelFile };
};

export default useExcelReader;
