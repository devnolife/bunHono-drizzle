# Devnolife Pendaftaran Beasiswa

This is a server-side application for managing scholarship registrations. It provides APIs for users to register for scholarships, view profiles, and for admins to manage student data and scholarship applications.

## Table of Contents

- [Devnolife Pendaftaran Beasiswa](#devnolife-pendaftaran-beasiswa)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
    - [User](#user)
    - [Beasiswa](#beasiswa)
    - [Admin](#admin)
  - [Environment Variables](#environment-variables)
  - [Contributing](#contributing)
  - [License](#license)
    - [Additional Information](#additional-information)

## Features

- User authentication and authorization
- User profile management
- Scholarship registration
- Admin management of student data and scholarship applications

## Prerequisites

- [Bun](https://bun.sh) (version 0.1.0 or higher)
- PostgreSQL

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/devnolife/bunHono-drizzle.git
   cd devnolife-pendaftaran-beasiswa
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Set up the database:**

   Ensure PostgreSQL is running and create a database for the project. Update the `.env` file with your database configuration.

4. **Run database migrations:**

   ```bash
   bun drizzle-kit generate:migration
   bun drizzle-kit migrate
   ```

## Usage

1. **Start the server:**

   ```bash
   bun run start
   ```

2. The server will start on the port specified in the `.env` file (default is 3000 , but i change to 8000).

## API Endpoints

### Auth

- **POST /login**
  - Login and get a JWT token.

### User

- **GET /profile**
  - Get the profile of the authenticated user.

### Beasiswa

- **POST /beasiswa/register**
  - Register for a scholarship. The request should include `jenisBeasiswaId`, `nilaiRaport`, and `urlFile`.

### Admin

- **GET /admin/mahasiswa**
  - Get a list of all students and their scholarship data.

- **PUT /admin/beasiswa/nilai**
  - Update the `nilai` field in the `beasiswa` table. The request should include `beasiswaId` and `newNilai`.

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
DB_USERNAME=USERNAME
DB_PASSWORD=PASSWORD
DB_HOST=HOST
DB_PORT=PORT
DB_NAME=NAME
PRODUCTION=false

```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License.


### Additional Information

- Replace `devnolife` in the clone URL with your GitHub username.
- Ensure to include all necessary details in the `.env` file, especially the database connection string and JWT secret.
- The database setup commands (`bun drizzle-kit generate:migration` and `bun drizzle-kit migrate`) might need to be adjusted based on your actual migration tool and scripts.

This README provides a comprehensive overview and instructions for setting up and using the "devnolife Pendaftaran Beasiswa" application. Adjust the details as necessary to fit your project's specifics.
