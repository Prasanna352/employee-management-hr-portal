# Employee Management & HR Portal

A full-stack web application for managing employee and HR operations through a centralized portal.

The application provides role-based access for **Admin, HR, and Employee** users and includes modules for employee management, departments, leave requests, attendance, payroll, performance, documents, and announcements.

## Features

* User registration and login
* JWT-based authentication
* Role-based authorization
* Employee management
* Department management
* Leave request management
* Leave approval and rejection
* Attendance management
* Payroll management
* Employee performance management
* Employee document management
* Company announcements
* Responsive user interface
* Centralized dashboard

## User Roles

### Admin

Admin users can manage and monitor the organization's HR operations, including:

* Employees
* Departments
* Leave requests
* Attendance
* Payroll
* Performance
* Employee documents
* Announcements

### HR

HR users can access HR-related management functionality according to their assigned permissions.

### Employee

Employees can access employee-specific functionality and view relevant HR information.

## Application Modules

### Authentication

* User registration
* User login
* JWT token generation
* Secure password storage using BCrypt
* Role-based access control

### Employee Management

* Add employees
* View employees
* Update employee information
* Delete employees

### Department Management

* Create departments
* View departments
* Update department information
* Delete departments

### Leave Management

* Submit leave requests
* View leave requests
* Search leave requests
* Approve leave requests
* Reject leave requests
* Track leave status

### Attendance

* Record attendance
* Search attendance records
* Track Present/Absent status

### Payroll

* Create payroll records
* Search payroll records
* Calculate and display salary information
* View net salary

### Performance

* Add employee performance records
* Search performance records
* Store ratings and reviews

### Employee Documents

* Add employee document records
* Search documents
* Track document type and path information

### Announcements

* Create announcements
* Search announcements
* Display announcements
* Set announcement priority

## Technology Stack

### Backend

* Java 17
* Spring Boot
* Spring Web MVC
* Spring Data JPA
* Spring Security
* JWT
* BCrypt
* MySQL
* Maven

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite
* Axios
* React Router

### Database

* MySQL

## Security

The application uses JWT-based authentication and Spring Security for protecting API endpoints.

Security features include:

* JWT authentication
* Role-based authorization
* BCrypt password hashing
* Protected API endpoints
* CORS configuration
* Stateless authentication

Passwords and JWT secrets are configured through environment variables rather than being hardcoded in the application.

## Project Structure

```text
employee-management-hr-portal/
│
├── employee-management-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/employeemanagement/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │
│   ├── pom.xml
│   └── .gitignore
│
├── employee-management-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
└── README.md
```

## Database Setup

Create the MySQL database:

```sql
CREATE DATABASE employee_management_db;
```

The Spring Boot application uses:

```text
Database: employee_management_db
Port: 3306
```

Hibernate is configured to automatically update the database schema:

```properties
spring.jpa.hibernate.ddl-auto=update
```

## Backend Configuration

The backend expects the database password and JWT secret to be provided through environment variables.

Example:

```text
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
```

Do not commit actual passwords or JWT secrets to GitHub.

## Running the Backend

Navigate to the backend directory:

```bash
cd employee-management-backend
```

Run the application using Maven:

```bash
mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

## Running the Frontend

Navigate to the frontend directory:

```bash
cd employee-management-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

## API Base URL

The React frontend communicates with the Spring Boot backend through:

```text
http://localhost:8080
```

Axios is configured to automatically attach the JWT token to authenticated requests.

## Authentication Flow

```text
User
  ↓
Register / Login
  ↓
Spring Boot Authentication
  ↓
JWT Token
  ↓
React Local Storage
  ↓
Axios Request Interceptor
  ↓
Authorization: Bearer <token>
  ↓
Spring Security
  ↓
Protected API
```

## Screenshots

Screenshots of the application can be added here.

Suggested screenshots:

* Login page
* Registration page
* Dashboard
* Employee Management
* Leave Management
* Attendance
* Payroll
* Performance
* Announcements

## Future Enhancements

Possible future improvements include:

* Email notifications
* File upload and storage
* Advanced employee search and filtering
* Detailed HR reports
* Attendance analytics
* Payroll reports
* Password reset functionality
* User profile management
* Cloud deployment
* Automated testing
* Audit logging

## Author

**Byrapuneni Prasanna**

Bachelor of Technology — Computer Science and Engineering
