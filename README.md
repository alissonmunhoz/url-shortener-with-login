  # URL Shortener API

This is a URL shortener service built using [NestJS](https://nestjs.com/) and PostgreSQL, using [Prisma ORM](https://www.prisma.io/). It supports user authentication, URL shortening, click tracking, and user-based URL management.

##  Project Structure

- `src/` – Application source code
- `prisma/` – Prisma schema and migrations
- `test/` – Test files
- `dist/` – Compiled TypeScript output
- `generated/` – Auto-generated code (likely from Prisma)
- `.env` – Environment variables
- `docker-compose.yml` – Docker configuration
- `tsconfig*.json` – TypeScript configuration
- `.prettierrc`, `.eslintrc` – Code style and linting

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Running with Docker

```bash
docker-compose up
