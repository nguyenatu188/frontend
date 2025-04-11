## Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Clone project về máy
```bash
git clone https://github.com/nguyenatu188/frontend.git
cd frontend
```

### Những cài đặt dưới này đều ở folder frontend hết nhé

### 2. Cài node modules và tailwind
```bash
npm install tailwindcss @tailwindcss/vite 
```

### 3. Cài daisyUI (rất tiện, nó về cơ bản là các thành phần giao diện (ava, bảng, form, lịch, product card, ...) đã tạo sẵn)
```bash
npm i -D daisyui@latest
```

### 4. Cài các thư viện cần cài (framer motion cho animation và router để di chuyển giữa các page)
```bash
npm install framer-motion react-router-dom
```

### 5.Cài font awesome để dùng icon
```bash
npm i --save @fortawesome/fontawesome-svg-core

npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons

npm i --save @fortawesome/react-fontawesome@latest
```
### 6. Chạy development frontend
```bash
npm run dev
```
