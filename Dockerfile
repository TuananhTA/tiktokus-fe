# Sử dụng Node.js chính thức làm base image
FROM node:20-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (hoặc yarn.lock) vào container
COPY package*.json ./

# Cài đặt các dependencies cần thiết
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .


# Mở cổng 3000 (cổng mặc định của Next.js)
EXPOSE 3000

# Lệnh khởi động ứng dụng Next.js
CMD ["npm", "start"]
