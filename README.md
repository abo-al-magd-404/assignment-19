# ASSIGNMENT 18 | NEST.JS SECOND ASSIGNMET
**Author:** mohamed mahmoud abo al magd  
**Group:** Node_C45_Mon&Thurs_9:00pm (Online)

## Project overview
A modular NestJS (TypeScript) backend focused on user and e-commerce domains. The app uses Mongoose for MongoDB persistence, JWT-based authentication, file upload integrations (Cloudinary / AWS S3), and a global validation + response pipeline to deliver consistent API behavior.

### Stack
- Language(s): TypeScript
- Framework / runtime: NestJS (v11)
- Notable libraries:
  - @nestjs/* (core, config, mongoose, jwt, platform-express)
  - mongoose (MongoDB)
  - class-validator / class-transformer (DTO validation)
  - bcrypt (password hashing)
  - zod (optional schema parsing/validation)
  - cloudinary, @aws-sdk/* (file storage integrations)
  - redis, jsonwebtoken, nodemailer, multer

## What’s included (key files & layout)
```
package.json                       # scripts, dependencies, jest config
tsconfig.json
src/
  main.ts                          # bootstrap: global ValidationPipe, interceptors, static /upload
  app.module.ts                    # application wiring; imports modules & Mongoose config
  config/
    config.ts                      # all runtime env constants (PORT, DB_URI, etc.)
    index.ts
  common/
    interceptor/                   # TransformInterceptor, LanguageInterceptor, WatchInterceptor
    modules/                       # shared auth modules (SharedAuthenticationModule)
    service/                       # CloudinaryService and other shared services
  modules/
    authentication/                # authentication flows (JWTs, tokens, guards)
    user/                          # user domain
    product/                       # product domain
    category/                      # category domain
    brand/                         # brand domain
    order/                         # order domain
uploads/                            # static uploads served at /upload (created at runtime)
test/                               # unit + e2e tests
```

## How it fits together
- AppModule composes domain modules (authentication, user, product, category, brand, order) and registers global services.  
- MongooseModule.forRootAsync reads DB_URI from configuration and sets up connection lifecycle logs.  
- src/main.ts sets a global ValidationPipe (stopAtFirstError, whitelist, forbidNonWhitelisted), registers three global interceptors (WatchInterceptor, LanguageInterceptor, TransformInterceptor), enables CORS, and serves uploaded files from ./uploads at the `/upload` route.  
- Authentication is exposed through dedicated modules and a SharedAuthenticationModule used across the app.

## Features (implemented / clearly present)
- Modular NestJS architecture with domain separation (auth, user, product, category, brand, order).
- MongoDB persistence via Mongoose with connection lifecycle logging.
- Global request validation and standardized response wrapping (TransformInterceptor adds `{ message, data }`).
- Localization header handling via LanguageInterceptor (accept-language defaults to user.lang or `en`).
- File upload / static serving (express static at `/upload`), plus Cloudinary / AWS S3 client libraries configured for media handling.
- JWT-based tokens (dependencies and config keys present) and password hashing with bcrypt.
- Utilities for emailing (nodemailer), caching (redis), and external HTTP requests (axios).

## Configuration (environment variables referenced)
The repository exports many runtime constants from `src/config/config.ts`. Provide these in your environment or an `.env` file:

General
- PORT

Database / cache
- DB_URI
- REDIS_URL

Security / crypto
- SALT_ROUND
- ENC_IV_LENGTH
- ENC_KEY

JWT signatures & expirations
- USER_ACCESS_TOKEN_SIGNATURE
- USER_REFRESH_TOKEN_SIGNATURE
- SYSTEM_ACCESS_TOKEN_SIGNATURE
- SYSTEM_REFRESH_TOKEN_SIGNATURE
- ACCESS_TOKEN_EXPIRES_IN
- REFRESH_TOKEN_EXPIRES_IN

Email / app info
- APP_EMAIL (EMAIL_APP)
- APP_EMAIL_PASSWORD (EMAIL_APP_PASSWORD)
- APPLICATION_NAME

Social / clients
- FACEBOOK
- INSTAGRAM
- TWITTER
- ORIGINS (comma-separated)
- CLIENT_IDS (comma-separated)

Note: Several env vars are required by the code paths; missing values may cause runtime failures. Add an `.env.example` listing the above with placeholders.

## Quickstart — from a fresh clone
Install dependencies:
```bash
npm install
```

Run in development (watch):
```bash
npm run start:dev
# or
npm run start
```

Build and run production:
```bash
npm run build
npm run start:prod
```

Run tests:
```bash
npm run test          # unit tests
npm run test:e2e      # e2e tests
npm run test:cov      # coverage
```

Scripts available (from package.json):
- build, start, start:dev, start:debug, start:prod
- lint, format
- test, test:watch, test:cov, test:e2e

## Observed runtime behavior & entry points
- HTTP server entry: `src/main.ts` — sets up global pipes/interceptors and starts the app on PORT.
- App composition: `src/app.module.ts` — imports ConfigModule, MongooseModule.forRootAsync, SharedAuthenticationModule and all domain modules.
- Static uploads served at `/upload` mapped to `./uploads`.

## Tests & quality
- Jest is configured to run TypeScript tests (ts-jest) with test files matching `*.spec.ts`.
- ESLint + Prettier are present in devDependencies for code quality and formatting.

## Notes & recommended next steps
- Add `.env.example` and document which env vars are required and which are optional. Use `src/config/config.ts` as the authoritative list.  
- Add API documentation (Swagger/OpenAPI) to expose routes and DTOs for consumers.  
- Add CONTRIBUTING.md and a short development checklist (run, test, lint, build).  
- Consider adding runtime health checks and a Dockerfile / docker-compose for local environment parity.

## License
This project is currently set as `UNLICENSED` in package.json.
