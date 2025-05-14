# Proyecto Frontend de Gestión de Contactos y Categorías

Este proyecto es la **interfaz de usuario** de una aplicación web de gestión de contactos y categorías. Ha sido desarrollada con **React**, y está diseñada para comunicarse con un backend en **Spring Boot** utilizando autenticación basada en **tokens JWT**.

## Características

- **Autenticación y Autorización**:
  - Inicio de sesión y registro de usuarios.
  - Protección de rutas mediante componentes protegidos.
  - Gestión de sesiones con tokens JWT almacenados.

- **Gestión de Contactos**:
  - Visualización de contactos por usuario autenticado.
  - Creación, edición y eliminación de contactos.

- **Gestión de Categorías**:
  - Creación de categorías personales.
  - Asociación de contactos con categorías.

- **Interfaz de Usuario**:
  - Navegación mediante React Router.
  - Componentes reutilizables.
  - Feedback al usuario con mensajes de éxito o error.

## Tecnologías Utilizadas

### Frontend
- **React**:
  - React Router DOM para la navegación.
  - Axios para la comunicación con el backend.
  - Context API o LocalStorage para manejo del estado de autenticación.

### Otros
- **JWT** para autenticación.
- **CSS / Bootstrap / Tailwind** (según configuración del repositorio).
- **Vite** o **Create React App** (según configuración de base).

## Estructura del Proyecto

- `src/services`: Lógica de conexión con la API REST (por ejemplo, `AuthService`, `ContactService`).
- `src/pages`: Páginas principales de la aplicación (`LoginPage`, `ContactsPage`, `CategoriesPage`, etc.).
- `src/components`: Componentes reutilizables como `Navbar`, `ProtectedRoute`, `FormContact`.
- `src/App.js`: Componente raíz que gestiona rutas y estructura general.

## Instalación y Configuración

### Requisitos Previos
- Node.js >= 14.x
- Yarn (opcional, puedes usar npm también)

### Pasos

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Interianxx/React-frontend.git
   cd React-frontend
   ```

2. Instala las dependencias:
   ```bash
   yarn install
   # o
   npm install
   ```

3. Configura las variables de entorno (opcional):
   - Crea un archivo `.env` en la raíz.
   - Agrega la URL del backend:
     ```
     REACT_APP_API_URL=http://localhost:8080/api
     ```

4. Ejecuta la aplicación:
   ```bash
   yarn start
   # o
   npm start
   ```

5. Accede a la aplicación en:
   ```
   http://localhost:3000
   ```

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz commit:
   ```bash
   git commit -m "Agrega nueva funcionalidad"
   ```
4. Envía un pull request explicando tus cambios.

## Autor

- **Interianxx**
- [GitHub - Interianxx](https://github.com/Interianxx)
