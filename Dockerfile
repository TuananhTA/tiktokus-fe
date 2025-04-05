# Sử dụng Node.js 20 (phiên bản mới nhất hỗ trợ Next.js 15.0.2)
FROM node:20-alpine AS base

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các công cụ cần thiết (nếu cần)
RUN apk add --no-cache libc6-compat

# Sao chép file package.json và package-lock.json (nếu có)
COPY package.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Expose cổng mà Next.js sử dụng (mặc định là 3000)
EXPOSE 3000

# Thiết lập biến môi trường (mặc định là production)
ENV NODE_ENV=production

# Chạy ứng dụng
CMD ["npm", "start"]