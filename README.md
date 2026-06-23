# ⚖️ LEGAL-iCoop

**Asesor Legal Inteligente en Derecho Cooperativo**

---

## 📦 DEPENDENCIAS COMPLETAS

### Frontend (carpeta `frontend/`)

Ejecuta dentro de `frontend/`:
```bash
npm install react react-dom
npm install framer-motion
npm install lucide-react
npm install tailwindcss postcss autoprefixer
npm install vite @vitejs/plugin-react
npm install appwrite
npm install axios


 Instalar FRONTEND
cd frontend
npm install react react-dom framer-motion lucide-react tailwindcss postcss autoprefixer vite @vitejs/plugin-react appwrite axios

# 3. Instalar BACKEND (opcional)
cd ../backend
npm install express cors dotenv node-appwrite openai nodemon --save-dev

# 4. Instalar Appwrite CLI (global)
npm install -g appwrite-cli

# 5. Volver a la raíz
cd ..

# 6. Configurar .env
cp frontend/.env.example frontend/.env
# Editar con tus credenciales

# 7. Configurar Appwrite
node scripts/create-collections.js
node scripts/seed-knowledge.js

# 8. Iniciar
cd frontend
npm run dev