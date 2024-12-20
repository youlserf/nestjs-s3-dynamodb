```markdown
# NestJS File Management Application

Este es un proyecto de gestión de archivos que utiliza NestJS, AWS SDK, y otras tecnologías modernas para manejar la carga, descarga y listado de archivos a través de Amazon S3 y DynamoDB. El proyecto utiliza un servicio de autenticación REST basado en JWT y PostgreSQL para validar los tokens de los usuarios.

## Requisitos

Antes de comenzar, asegúrate de tener lo siguiente instalado:

- [Node.js 20](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

## Configuración de AWS

Asegúrate de configurar las credenciales de AWS correctamente en el archivo `.env`. Necesitarás las siguientes claves y valores:

```env
AWS_ACCESS_KEY_ID=<tu_access_key_id>
AWS_SECRET_ACCESS_KEY=<tu_secret_access_key>
AWS_REGION=<tu_región>
S3_BUCKET_NAME=<tu_nombre_de_bucket_s3>
DYNAMODB_TABLE_NAME=<tu_nombre_de_tabla_dynamodb>
AUTH_REST_URL=<tu_url_de_servicio_de_autenticación>
```

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url_del_repositorio>
   cd <directorio_del_proyecto>
   ```

2. Instala las dependencias utilizando `pnpm`:
   ```bash
   pnpm install
   ```

3. Clona también el proyecto de autenticación que se usará para validar los tokens:
   ```bash
   git clone https://github.com/youlserf/nestjs-jwt-postgress-auth-rest.git
   cd nestjs-jwt-postgress-auth-rest
   pnpm install
   pnpm run start
   ```

   Este servicio debe estar ejecutándose para que la autenticación funcione correctamente, http://localhost:4000/auth/validate-token.

## Ejecutar el Proyecto

1. Regresa al directorio de la aplicación principal y ejecuta:
   ```bash
   pnpm run start
   ```

2. La aplicación estará corriendo en el puerto configurado en `process.env.PORT` o en el puerto 3000 de manera predeterminada.

## Endpoints de la API

### Autenticación

- La autenticación se maneja a través del servicio proporcionado por [nestjs-jwt-postgress-auth-rest](https://github.com/youlserf/nestjs-jwt-postgress-auth-rest).
- **POST** `/auth/login`: Permite iniciar sesión y obtener un token JWT.

### Gestión de Archivos

- **POST** `/files/upload`: Permite cargar un archivo al bucket S3 y almacenar la información en DynamoDB.
  - Requiere autenticación (token Bearer).
  - Cuerpo de la solicitud: El archivo debe ser enviado en el campo `file` del formulario.
  
- **POST** `/files/download`: Permite descargar un archivo desde el bucket S3 utilizando un `fileId`.
  - Requiere autenticación (token Bearer).
  - Cuerpo de la solicitud: `fileId` como un string.
  
- **GET** `/files/list`: Devuelve una lista de archivos asociados a un `userId` específico.
  - Requiere autenticación (token Bearer).

## Estructura del Proyecto

- **`src/config/aws.config.ts`**: Configuración de clientes para interactuar con AWS (DynamoDB y S3).
- **`src/modules/auth`**: Módulo de autenticación que interactúa con el servicio de autenticación REST.
- **`src/modules/files`**: Módulo para la gestión de archivos (subida, descarga y listado).
- **`src/app.module.ts`**: Módulo raíz de la aplicación.

## Scripts

- `pnpm run start`: Inicia el servidor en desarrollo.
- `pnpm run build`: Compila el proyecto para producción.
- `pnpm run start:prod`: Inicia el servidor en modo producción.
  
## Contribuciones

Las contribuciones son bienvenidas. Si tienes alguna sugerencia, abre un *issue* o envía un *pull request*.

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
```

Ahora se menciona explícitamente el proyecto de autenticación que estás utilizando y cómo configurarlo para integrarlo con tu aplicación principal.