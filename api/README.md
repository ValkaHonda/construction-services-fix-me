# constructruction services api

## Instructions for running the project:

- For now migrations are available, but are disable for easier use.
- Create two files at level package.json

  - .env

  ```
  PORT=3000
  JWT_SECRET=VerySecr3t!
  DB_TYPE=mysql
  DB_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=root
  DB_PASSWORD=password
  DB_DATABASE_NAME=dev_db
  ```

  - ormconfig.json

  ```
  {
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "database": "dev_db",
      "username": "root",
      "password": "password",
      "synchronize": true,
      "logging": false,
      "entities": [
          "src/entities/**/*.ts"
      ],
      "migrations": [
          "src/migration/**/*.ts"
      ],
      "cli": {
          "entitiesDir": "src/entities",
          "migrationsDir": "src/migration"
      }
  }
  ```

- Create a databse `dev_db`
- `npm run start:dev`
