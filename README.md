# Proyecto de Gestión de Contactos y Categorías

# Este proyecto es una aplicación web desarrollada con Spring Boot en el backend 
# y React en el frontend. Su objetivo es gestionar contactos y categorías, 
# con autenticación basada en tokens JWT.

# ========================================
# Características
# ========================================

# Autenticación y Autorización:
# - Inicio de sesión y registro de usuarios.
# - Protección de rutas en el frontend.
# - Uso de tokens JWT para la autenticación.

# Gestión de Contactos:
# - Crear, leer, actualizar y eliminar contactos.
# - Listar contactos asociados a un usuario autenticado.

# Gestión de Categorías:
# - Crear y listar categorías por usuario.
# - Relación entre categorías y contactos.

# Interfaz de Usuario:
# - Navegación protegida con React Router.
# - Manejo de errores y mensajes de estado.

# ========================================
# Tecnologías Utilizadas
# ========================================

# Backend:
# - Java y Spring Boot
#   - Spring Security para autenticación y autorización.
#   - Spring Data JPA para acceso a la base de datos.
#   - Base de datos relacional (MySQL, PostgreSQL, etc).

# Frontend:
# - React
#   - React Router para navegación entre páginas.
#   - Axios para llamadas HTTP al backend.

# Otros:
# - Maven para gestión de dependencias.
# - JWT para manejo de sesiones autenticadas.
# - Axios para consumo de API desde React.

# ========================================
# Estructura del Proyecto
# ========================================

# Backend:
# - src/main/java/com/bezkoder/springjwt/models        -> Entidades del modelo de datos
# - src/main/java/com/bezkoder/springjwt/repository    -> Repositorios JPA
# - src/main/java/com/bezkoder/springjwt/controllers   -> Controladores REST
# - src/main/java/com/bezkoder/springjwt/security      -> Configuración de seguridad y JWT

# Frontend:
# - src/services     -> Servicios para llamadas API (AuthService, ContactService)
# - src/pages        -> Componentes principales de las páginas
# - src/components   -> Componentes reutilizables (ej. ProtectedRoute)

# ========================================
# Instalación y Configuración
# ========================================

# Backend:
# 1. Clonar el repositorio
git clone <url-del-backend>

# 2. Configurar la base de datos en application.properties o application.yml

# 3. Ejecutar el backend con Maven
mvn spring-boot:run

# Frontend:
# 1. Clonar el repositorio
git clone https://github.com/Interianxx/React-frontend.git

# 2. Instalar dependencias
cd React-frontend
yarn install
# o
npm install

# 3. Ejecutar el frontend en modo desarrollo
yarn start
# o
npm start

# La aplicación estará disponible en: http://localhost:3000

# ========================================
# Autor
# ========================================

# Desarrollado por: Interianxx
# Repositorio: https://github.com/Interianxx/React-frontend
