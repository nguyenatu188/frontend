## Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Clone project về máy
```bash
git clone https://github.com/nguyenatu188/frontend.git
cd frontend
```

### 2. Cài node modules và tailwind
```bash
npm install tailwindcss @tailwindcss/vite
```

### 3. Chỉnh file vite.config.js
```bash
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
})

```

### 4. Chạy development frontend
```bash
npm run dev
```
