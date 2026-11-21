<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# 💰 FinanzApp

Una aplicación web moderna de gestión financiera personal desarrollada con tecnologías de punta. Permite llevar un control exhaustivo de ingresos, gastos, saldos por cuentas y visualización gráfica de las finanzas en tiempo real, conectada a una base de datos en la nube.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## ✨ Características Principales

- **Dashboard Financiero Completo:** Visualización rápida de saldo total actual, ingresos y gastos globales, y un desglose específico del mes en curso.
- **Gestión de Cuentas / Billeteras:** Control de saldo individualizado por cada cuenta conectada.
- **CRUD Completo de Movimientos:** 
  - Registro de nuevos ingresos y gastos con validaciones estrictas mediante **Zod** y **React Hook Form**.
  - Listado interactivo con buscador en tiempo real y filtros avanzados por tipo y categoría.
  - Edición y eliminación de registros con alertas visuales integradas y confirmaciones estéticas.
- **Gráficos Dinámicos:** Visualización clara de gastos e ingresos categorizados utilizando `recharts`.
- **Diseño Moderno (Teal Treasury):** Interfaz limpia, responsiva, con soporte móvil (barra de navegación flotante) y estética oscura profesional.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Base de Datos & Backend:** [Supabase](https://supabase.com/)
- **Validación de Formularios:** `zod` & `react-hook-form`
- **Iconos:** `lucide-react`
- **Gráficos:** `recharts`

---

## 🚀 Guía de Instalación y Ejecución Local

Si querés clonar y correr este proyecto en tu computadora, seguí estos pasos:


    
```bash
 1. Clonar el repositorio

git clone [https://github.com/TU_USUARIO/finanz-app.git](https://github.com/TU_USUARIO/finanz-app.git)
cd finanz-app

2 .Instalar dependencias

npm install

3. Configurar las Variables de Entorno
Crea un archivo llamado .env.local en la raíz del proyecto y añade tus credenciales de Supabase:

Fragmento de código
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave_anonima_de_supabase

4. Ejecutar el servidor de desarrollo

npm run dev
Abre http://localhost:3000 en tu navegador para ver la aplicación funcionando.

🗄️ Esquema de Base de Datos (Supabase)
La aplicación utiliza dos tablas principales en Supabase:

cuentas:

id (INT / PK)

nombre (TEXT)

tipo (TEXT)

color (TEXT)

movimientos:

id (INT / PK)

descripcion (TEXT)

monto (NUMERIC)

tipo (TEXT: 'ingreso' o 'gasto')

categoria (TEXT)

fecha (TEXT / DATE)

cuenta_id (INT / FK a cuentas.id)

📄 Licencia
Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

<ElicitationsGroup message="Para cuando estés listo con tu repositorio:">
  <Elicitation label="Crear un archivo LICENSE de tipo MIT para tu repositorio de GitHub" query="Quiero generar el texto para un archivo LICENSE de tipo MIT para mi proyecto en GitHub."/>
  <Elicitation label="Preparar los pasos para desplegar en Vercel con integración continua" query="Dame un resumen de cómo se conecta GitHub con Vercel para despliegues automáticos en cada push."/>
</ElicitationsGroup>
>>>>>>> 2170927d5ddc3667f6596ca0e9df40d16f5404a6
