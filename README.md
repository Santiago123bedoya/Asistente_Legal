# ⚖️ LEGAL-iCoop

**Asesor Legal Inteligente en Derecho Cooperativo**

---

## 🚀 Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env
# Editar con tus credenciales de Appwrite y DeepSeek

# 3. Iniciar dev
npm run dev
```

## 📦 Stack

| Capa       | Tecnología                              |
| ---------- | --------------------------------------- |
| Frontend   | React 18 + Vite + TailwindCSS           |
| UI         | Framer Motion + Lucide Icons            |
| Estado     | Zustand                                 |
| Backend    | Appwrite (BaaS)                         |
| IA         | DeepSeek API + RAG                      |

## 🔧 Scripts

| Comando           | Descripción              |
| ----------------- | ------------------------ |
| `npm run dev`     | Inicia servidor de dev   |
| `npm run build`   | Build para producción    |
| `npm run preview` | Previsualiza el build    |

## 🧠 Arquitectura

- **Autenticación**: Appwrite Auth + colección de usuarios en DB
- **Chat**: RAG sobre base de conocimiento → DeepSeek API
- **Roles**: usuario normal (chat) y admin (dashboard)
- **Base de conocimiento**: documentos de derecho cooperativo indexados en Appwrite

## 📁 Estructura

```
src/
├── components/
│   ├── AdminDashboard/   # Panel de administración
│   ├── Auth/             # Login/Registro
│   ├── ChatInterface/    # Chat legal con IA
│   └── Common/           # Componentes compartidos
├── hooks/                # Custom hooks (useAuth, useChat, useMetrics)
├── pages/                # Páginas principales
├── services/             # Appwrite, chat, auth, admin
├── store/                # Zustand stores
├── utils/                # Formateadores, validadores
├── App.jsx
├── main.jsx
└── index.css
```

## ⚠️ Disclaimer

LEGAL-iCoop complementa pero NO reemplaza la asesoría legal humana.
