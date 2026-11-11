# Práctica: Inicio de sesión con Next.js + Firebase

Página de inicio de sesión hecha con **Next.js (App Router, JavaScript)**, **Tailwind CSS** y **Firebase Authentication**.

## Cómo ejecutar

1. Copia `.env.example` como `.env.local` y llena los valores de tu proyecto de Firebase
   (Configuración del proyecto → Tus apps → Configuración del SDK).
2. Ejecuta:

```bash
npm install      # instala las dependencias
npm run dev      # servidor de desarrollo en http://localhost:3000
npm run build    # compila para producción
npm start        # ejecuta la versión compilada
npm run lint     # revisa el código con ESLint
```

> Para probar el acceso, el usuario debe existir en Firebase Authentication (proveedor Correo/contraseña habilitado).

## Archivos

| Archivo | Qué hace |
|---|---|
| `app/layout.js` | Layout raíz: `lang="es"`, fondo gris claro e importación de estilos. |
| `app/globals.css` | Solo importa Tailwind CSS. |
| `app/page.js` | Página principal; centra el componente `LoginForm`. |
| `components/LoginForm.jsx` | Componente cliente con el formulario, estados, validación y llamada a Firebase. |
| `components/CampoTexto.jsx` | Input reutilizable con etiqueta y mensaje de error en rojo. |
| `lib/firebase.js` | Configuración de Firebase leída de variables de entorno (sin inicializar dos veces) y export de `auth`. |
| `.env.local` | Valores reales de Firebase (no se sube a git). |
| `.env.example` | Plantilla con los nombres de las variables, sin valores. |
| `lib/validaciones.js` | `validarLogin(email, password)` y `mensajeDeError(codigo)`. |
