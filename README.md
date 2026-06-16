# equipo7-backend — Burrito Lector API

Backend REST para la aplicación **Burrito Lector**, desarrollado con **NestJS + TypeORM + PostgreSQL**.

## Stack Técnico

- **Framework**: NestJS
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (passport-jwt)
- **Validación**: class-validator / class-transformer
- **Uploads**: Multer (disk storage)
- **Deploy**: Render

---

## Configuración local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# edita .env con tus datos de PostgreSQL
```

### 3. Crear la base de datos
```sql
CREATE DATABASE burrito_lector;
```

### 4. Correr la app
```bash
npm run start:dev
```

### 5. Seed (admin + datos de prueba)
```bash
npm run seed
```
Crea: admin@burritolector.com / Admin1234!  y lectores de prueba.

---

## Deploy en Render

- Build command: `npm install && npm run build`
- Start command: `node dist/main`
- Variables de entorno: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, JWT_SECRET, NODE_ENV=production

---

## Endpoints

Base URL: `/api`

### Auth
| Método | Ruta | Auth |
|--------|------|------|
| POST | /auth/registro | - |
| POST | /auth/login | - |
| POST | /auth/admin/login | - |

### Libros
| Método | Ruta | Auth |
|--------|------|------|
| GET | /libros | Lector/Admin |
| GET | /libros/:id | Lector/Admin |
| POST | /libros | Admin (multipart) |
| PUT | /libros/:id | Admin (multipart) |
| DELETE | /libros/:id | Admin |

### Reseñas
| Método | Ruta | Auth |
|--------|------|------|
| POST | /resenas | Lector |
| GET | /resenas/mias | Lector |
| GET | /resenas/libro/:libroId | Lector/Admin |
| PUT | /resenas/:id | Lector |
| DELETE | /resenas/:id | Lector |

### Afinidad
| Método | Ruta | Auth |
|--------|------|------|
| GET | /afinidad | Lector (similitud coseno >= 0.70) |

### Dashboard
| Método | Ruta | Auth |
|--------|------|------|
| GET | /dashboard | Admin |

### Usuarios
| Método | Ruta | Auth |
|--------|------|------|
| GET | /usuarios | Admin |
| GET | /usuarios/:id | Admin |

---

Todas las respuestas: `{ success, data, timestamp }`
